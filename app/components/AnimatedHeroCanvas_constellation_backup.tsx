'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { inSphere } from 'maath/random';

const PARTICLE_COUNT = 300;

function getMedicalPoints(count: number) {
  const pts = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    if (Math.random() > 0.5) {
      pts[i * 3] = (Math.random() - 0.5) * 2.5;
      pts[i * 3 + 1] = (Math.random() - 0.5) * 0.7;
      pts[i * 3 + 2] = (Math.random() - 0.5) * 0.7;
    } else {
      pts[i * 3] = (Math.random() - 0.5) * 0.7;
      pts[i * 3 + 1] = (Math.random() - 0.5) * 2.5;
      pts[i * 3 + 2] = (Math.random() - 0.5) * 0.7;
    }
  }
  return pts;
}

function getLensPoints(count: number) {
  const pts = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    if (Math.random() > 0.3) {
      const angle = Math.random() * Math.PI * 2;
      const r = 0.9 + (Math.random() - 0.5) * 0.3;
      pts[i * 3] = Math.cos(angle) * r - 0.4;
      pts[i * 3 + 1] = Math.sin(angle) * r + 0.4;
      pts[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
    } else {
      const handleLen = Math.random() * 1.5;
      pts[i * 3] = 0.5 + handleLen;
      pts[i * 3 + 1] = -0.5 - handleLen;
      pts[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
    }
  }
  return pts;
}

function getCodePoints(count: number) {
  const pts = new Float32Array(count * 3);
  const third = Math.floor(count / 3);
  for (let i = 0; i < count; i++) {
    const noise = (Math.random() - 0.5) * 0.15;
    const noiseZ = (Math.random() - 0.5) * 0.2;
    if (i < third) {
      // Left bracket  <
      const y = (Math.random() - 0.5) * 2.2;
      const x = -1.2 - Math.abs(y) * 0.5;
      pts[i * 3] = x + noise;
      pts[i * 3 + 1] = y + noise;
      pts[i * 3 + 2] = noiseZ;
    } else if (i < third * 2) {
      // Slash  /
      const t = Math.random();
      pts[i * 3] = -0.3 + t * 0.6 + noise;
      pts[i * 3 + 1] = -1.1 + t * 2.2 + noise;
      pts[i * 3 + 2] = noiseZ;
    } else {
      // Right bracket  >
      const y = (Math.random() - 0.5) * 2.2;
      const x = 1.2 + Math.abs(y) * 0.5;
      pts[i * 3] = x + noise;
      pts[i * 3 + 1] = y + noise;
      pts[i * 3 + 2] = noiseZ;
    }
  }
  return pts;
}

function getGraphicsPoints(count: number) {
  const pts = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const y = (Math.random() - 0.5) * 2.5;
    const maxW = (y + 1.25) * 0.7; // Triangle shape
    const x = (Math.random() - 0.5) * maxW;
    pts[i * 3] = x;
    pts[i * 3 + 1] = -y;
    pts[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
  }
  return pts;
}

// Smooth easing function for organic morphing
function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

function MorphingConstellation({ activeIndex }: { activeIndex: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const prevIndex = useRef(activeIndex);
  const morphProgress = useRef(1); // 1 = fully morphed
  const timeRef = useRef(0); // Self-tracked elapsed time (avoids deprecated THREE.Clock)

  const shapes = useMemo(() => [
    getMedicalPoints(PARTICLE_COUNT),
    getLensPoints(PARTICLE_COUNT),
    getCodePoints(PARTICLE_COUNT),
    getGraphicsPoints(PARTICLE_COUNT)
  ], []);

  const currentPositions = useMemo(() => new Float32Array(shapes[0]), [shapes]);
  // Buffer for line segments: max possible lines between all points * 2 vertices * 3 coords
  const linePositions = useMemo(() => new Float32Array(PARTICLE_COUNT * PARTICLE_COUNT * 3), []);

  const starTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const context = canvas.getContext('2d');
    if (context) {
      const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.3, 'rgba(96, 165, 250, 0.8)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      context.fillStyle = gradient;
      context.fillRect(0, 0, 32, 32);
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  // Each star gets a random phase offset and speed so they twinkle independently
  const twinkleData = useMemo(() => {
    const offsets = new Float32Array(PARTICLE_COUNT);
    const speeds = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      offsets[i] = Math.random() * Math.PI * 2;     // random phase
      speeds[i] = 1.5 + Math.random() * 4;          // random speed between 1.5–5.5
    }
    return { offsets, speeds };
  }, []);

  // Per-particle sizes for individual twinkling
  const sizes = useMemo(() => new Float32Array(PARTICLE_COUNT).fill(0.15), []);

  useFrame((_state, delta) => {
    if (!pointsRef.current || !linesRef.current) return;
    
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const sizeAttr = pointsRef.current.geometry.attributes.size;
    const linesArray = linesRef.current.geometry.attributes.position.array as Float32Array;

    if (prevIndex.current !== activeIndex) {
      prevIndex.current = activeIndex;
      morphProgress.current = 0; // Reset morph progress for smooth easing
    }

    // Advance morph progress (0 to 1 over ~2 seconds)
    if (morphProgress.current < 1) {
      morphProgress.current = Math.min(1, morphProgress.current + delta * 0.5);
    }

    // Slowly rotate the active shape and lines together
    pointsRef.current.rotation.y += delta * 0.08;
    pointsRef.current.rotation.x += delta * 0.03;
    linesRef.current.rotation.y += delta * 0.08;
    linesRef.current.rotation.x += delta * 0.03;

    // Track time ourselves to avoid deprecated THREE.Clock
    timeRef.current += delta;
    const t = timeRef.current;
    let lineIndex = 0;

    const target = shapes[activeIndex];
    // Update particle positions and per-star twinkle
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const idx = i * 3;
      // Smooth eased morph toward target
      const ease = smoothstep(Math.min(1, morphProgress.current)) * 2 + 0.5;
      const lerpFactor = ease * delta;
      positions[idx] += (target[idx] - positions[idx]) * lerpFactor;
      positions[idx+1] += (target[idx+1] - positions[idx+1]) * lerpFactor;
      positions[idx+2] += (target[idx+2] - positions[idx+2]) * lerpFactor;
      
      // Floating organic noise
      if (i % 3 === 0) {
        positions[idx] += Math.sin(t * 2 + i) * 0.003;
      }

      // Random individual twinkle: size oscillates between 0.06 and 0.22
      if (sizeAttr) {
        const s = sizes as Float32Array;
        s[i] = 0.1 + Math.sin(t * twinkleData.speeds[i] + twinkleData.offsets[i]) * 0.06;
        (sizeAttr as THREE.BufferAttribute).needsUpdate = true;
      }

      // Constellation lines: connect nearby stars
      for (let j = i + 1; j < PARTICLE_COUNT; j++) {
        const jdx = j * 3;
        const dx = positions[idx] - positions[jdx];
        const dy = positions[idx+1] - positions[jdx+1];
        const dz = positions[idx+2] - positions[jdx+2];
        const distSq = dx*dx + dy*dy + dz*dz;
        
        if (distSq < 0.15) {
          linesArray[lineIndex++] = positions[idx];
          linesArray[lineIndex++] = positions[idx+1];
          linesArray[lineIndex++] = positions[idx+2];
          linesArray[lineIndex++] = positions[jdx];
          linesArray[lineIndex++] = positions[jdx+1];
          linesArray[lineIndex++] = positions[jdx+2];
        }
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    
    // Update lines
    linesRef.current.geometry.setDrawRange(0, lineIndex / 3);
    linesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group>
      {/* Twinkling Stars */}
      <points ref={pointsRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[currentPositions, 3]} />
          <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
        </bufferGeometry>
        <pointsMaterial
          transparent
          color="#ffffff"
          size={0.15}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          map={starTexture}
        />
      </points>
      {/* Connecting Constellation Lines */}
      <lineSegments ref={linesRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#60a5fa" transparent opacity={0.2} depthWrite={false} blending={THREE.AdditiveBlending} />
      </lineSegments>
    </group>
  );
}

// Slowly drifting background stars
function DriftingStars() {
  const ref = useRef<THREE.Group>(null);
  useFrame((_state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.02;
      ref.current.rotation.x += delta * 0.01;
    }
  });
  return (
    <group ref={ref}>
      <Stars radius={4} depth={15} count={80} factor={3} saturation={0} fade speed={1.5} />
    </group>
  );
}

export default function AnimatedHeroCanvas({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="w-full h-full relative">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <DriftingStars />
        <MorphingConstellation activeIndex={activeIndex} />
      </Canvas>
    </div>
  );
}

'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

const DOMAIN_DATA = [
  // 0: Medical - DNA Double Helix Cloud
  {
    generate: (count: number) => {
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const t = (i / count) * Math.PI * 8;
        const strand = i % 2 === 0 ? 1 : -1;
        const radius = 1.0 + (Math.random() - 0.5) * 0.25;
        pos[i * 3] = Math.cos(t) * radius * strand;
        pos[i * 3 + 1] = (i / count - 0.5) * 3.8;
        pos[i * 3 + 2] = Math.sin(t) * radius * strand;
      }
      return pos;
    },
    color: '#2dd4bf',
    glow: '#14b8a6',
  },
  // 1: SEO - High-density Global Geodesic Network
  {
    generate: (count: number) => {
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const r = 1.5 + (Math.random() - 0.5) * 0.2;
        pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        pos[i * 3 + 2] = r * Math.cos(phi);
      }
      return pos;
    },
    color: '#c084fc',
    glow: '#a855f7',
  },
  // 2: Coding - High-density 3D Matrix Cube
  {
    generate: (count: number) => {
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 2.6;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 2.6;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 2.6;
      }
      return pos;
    },
    color: '#60a5fa',
    glow: '#3b82f6',
  },
  // 3: Design - Torus Knot Flow
  {
    generate: (count: number) => {
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const t = (i / count) * Math.PI * 4;
        const p = 2;
        const q = 3;
        const r = 0.8 + 0.3 * Math.cos(q * t);
        pos[i * 3] = r * Math.cos(p * t) + (Math.random() - 0.5) * 0.15;
        pos[i * 3 + 1] = r * Math.sin(p * t) + (Math.random() - 0.5) * 0.15;
        pos[i * 3 + 2] = 0.4 * Math.sin(q * t) + (Math.random() - 0.5) * 0.15;
      }
      return pos;
    },
    color: '#fb7185',
    glow: '#f43f5e',
  },
];

const POINT_COUNT = 1500;

function VolumetricCloudScene({ activeIndex }: { activeIndex: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const targetDomain = activeIndex % 4;

  const pointSets = useMemo(() => {
    return DOMAIN_DATA.map((d) => d.generate(POINT_COUNT));
  }, []);

  const currentPositions = useMemo(() => new Float32Array(pointSets[0]), [pointSets]);

  useFrame((_state, delta) => {
    if (!pointsRef.current) return;
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const target = pointSets[targetDomain];

    // Smooth volumetric morphing
    const lerpFactor = delta * 2.5;
    for (let i = 0; i < POINT_COUNT * 3; i++) {
      positions[i] += (target[i] - positions[i]) * lerpFactor;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // Organic idle drift
    pointsRef.current.rotation.y += delta * 0.35;
    pointsRef.current.rotation.x = Math.sin(_state.clock.elapsedTime * 0.5) * 0.15;
  });

  const domain = DOMAIN_DATA[targetDomain];

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[currentPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.045}
          color={domain.color}
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </Float>
  );
}

export default function VolumetricCloudHero({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="w-full h-full relative">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <VolumetricCloudScene activeIndex={activeIndex} />
      </Canvas>
    </div>
  );
}

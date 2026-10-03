'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

const PARTICLE_COUNT = 300;

// Dynamic chromatic color theme definitions per topic
const DOMAIN_THEMES = [
  {
    name: 'Medical Sciences',
    starColor: '#ffffff',
    lineColor: '#2dd4bf', // Bioluminescent Teal
    glowColor: '#14b8a6',
    dustColor: '#5eead4',
    frequency: 330, // E4 harmonic
  },
  {
    name: 'SEO',
    starColor: '#ffffff',
    lineColor: '#c084fc', // Deep Nebula Violet
    glowColor: '#9333ea',
    dustColor: '#e9d5ff',
    frequency: 392, // G4 harmonic
  },
  {
    name: 'Coding',
    starColor: '#ffffff',
    lineColor: '#60a5fa', // Electric Cyan/Azure
    glowColor: '#2563eb',
    dustColor: '#93c5fd',
    frequency: 440, // A4 harmonic
  },
  {
    name: 'Design',
    starColor: '#ffffff',
    lineColor: '#fb7185', // Rose Gold / Sunset Amber
    glowColor: '#e11d48',
    dustColor: '#fda4af',
    frequency: 523.25, // C5 harmonic
  },
];

// ------------------------------------------------------------------
// Musical Audio Synthesizer: Ethereal Ambient Chords (Web Audio API)
// ------------------------------------------------------------------
let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let isMuted = false;

export function setAudioMuted(muted: boolean) {
  isMuted = muted;
  if (masterGain && audioCtx) {
    masterGain.gain.setValueAtTime(isMuted ? 0 : 0.18, audioCtx.currentTime);
  }
}

export function getAudioMuted() {
  return isMuted;
}

export function initAudio() {
  if (typeof window === 'undefined') return;
  try {
    if (!audioCtx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioCtx = new AudioCtx();
        masterGain = audioCtx.createGain();
        masterGain.gain.setValueAtTime(isMuted ? 0 : 0.18, audioCtx.currentTime);
        masterGain.connect(audioCtx.destination);
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  } catch (err) {
    console.warn('AudioContext init error:', err);
  }
}

export function playMusicalChord(freq: number) {
  if (isMuted) return;
  initAudio();
  if (!audioCtx || !masterGain) return;
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const now = audioCtx.currentTime;

  // Musical Chord construction:
  // Root note (Fundamental Sine) + Warm Octave Sub (Sine) + Shimmering Fifth (Triangle)
  const notes = [
    { freq: freq, type: 'sine' as OscillatorType, vol: 0.15 },
    { freq: freq * 1.5, type: 'triangle' as OscillatorType, vol: 0.09 }, // perfect fifth harmonic
    { freq: freq * 2, type: 'sine' as OscillatorType, vol: 0.05 },      // octave shimmer
  ];

  notes.forEach(({ freq: f, type, vol }) => {
    if (!audioCtx || !masterGain) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(f, now);

    // Silky musical envelope: gentle bloom attack (60ms) and warm, lingering musical decay (3.0s)
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(vol, now + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.0);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(now);
    osc.stop(now + 3.1);
  });
}

// ------------------------------------------------------------------
// 1. MEDICAL SCIENCES: Proper Scientific 3D DNA Double-Helix
// ------------------------------------------------------------------
function getDnaPoints(count: number) {
  const pts = new Float32Array(count * 3);
  const backboneStrandCount = Math.floor(count * 0.30);
  const rungsCount = count - backboneStrandCount * 2;
  const turns = 4.0;
  const radius = 1.15;
  const height = 3.6;

  // Strand A (5' to 3' backbone)
  for (let i = 0; i < backboneStrandCount; i++) {
    const t = i / (backboneStrandCount - 1);
    const angle = t * Math.PI * 2 * turns;
    const y = (t - 0.5) * height;

    pts[i * 3] = Math.cos(angle) * radius;
    pts[i * 3 + 1] = y;
    pts[i * 3 + 2] = Math.sin(angle) * radius;
  }

  // Strand B (Antiparallel complementary backbone)
  const offsetB = backboneStrandCount;
  for (let i = 0; i < backboneStrandCount; i++) {
    const idx = offsetB + i;
    const t = i / (backboneStrandCount - 1);
    const angle = t * Math.PI * 2 * turns + Math.PI;
    const y = (t - 0.5) * height;

    pts[idx * 3] = Math.cos(angle) * radius;
    pts[idx * 3 + 1] = y;
    pts[idx * 3 + 2] = Math.sin(angle) * radius;
  }

  // Base pair connecting ladders
  const offsetRungs = backboneStrandCount * 2;
  const numRungs = 20;
  const ptsPerRung = Math.floor(rungsCount / numRungs);

  for (let r = 0; r < numRungs; r++) {
    const t = (r + 0.5) / numRungs;
    const angle = t * Math.PI * 2 * turns;
    const y = (t - 0.5) * height;

    const ax = Math.cos(angle) * radius;
    const az = Math.sin(angle) * radius;
    const bx = Math.cos(angle + Math.PI) * radius;
    const bz = Math.sin(angle + Math.PI) * radius;

    for (let p = 0; p < ptsPerRung; p++) {
      const idx = offsetRungs + r * ptsPerRung + p;
      if (idx >= count) break;
      const frac = (p + 1) / (ptsPerRung + 1);
      pts[idx * 3] = ax + (bx - ax) * frac;
      pts[idx * 3 + 1] = y;
      pts[idx * 3 + 2] = az + (bz - az) * frac;
    }
  }

  // Remainder
  for (let i = offsetRungs + numRungs * ptsPerRung; i < count; i++) {
    const t = Math.random();
    const angle = t * Math.PI * 2 * turns;
    pts[i * 3] = Math.cos(angle) * radius;
    pts[i * 3 + 1] = (t - 0.5) * height;
    pts[i * 3 + 2] = Math.sin(angle) * radius;
  }

  return pts;
}

// ------------------------------------------------------------------
// 2. SEO: 3D Earth Globe (Pure Latitudes & Longitudes, Equator removed)
// ------------------------------------------------------------------
function getEarthGlobePoints(count: number) {
  const pts = new Float32Array(count * 3);
  const R = 1.55;

  const meridianCount = Math.floor(count * 0.50);
  const latitudeCount = count - meridianCount;

  // 1. Longitude Meridians
  const numMeridians = 10;
  for (let i = 0; i < meridianCount; i++) {
    const mIdx = i % numMeridians;
    const meridianAngle = (mIdx / numMeridians) * Math.PI;
    const circleAngle = Math.floor(i / numMeridians) * ((Math.PI * 2) / (meridianCount / numMeridians));

    const x = Math.sin(circleAngle) * R;
    const y = Math.cos(circleAngle) * R;

    pts[i * 3] = x * Math.cos(meridianAngle);
    pts[i * 3 + 1] = y;
    pts[i * 3 + 2] = x * Math.sin(meridianAngle);
  }

  // 2. Latitude Parallel Circles (Excluding y = 0 equator)
  const latitudes = [-0.85, -0.65, -0.45, -0.25, 0.25, 0.45, 0.65, 0.85];
  const ptsPerLat = Math.floor(latitudeCount / latitudes.length);

  for (let l = 0; l < latitudes.length; l++) {
    const yNorm = latitudes[l];
    const y = yNorm * R;
    const ringRadius = Math.sqrt(Math.max(0, R * R - y * y));

    for (let p = 0; p < ptsPerLat; p++) {
      const idx = meridianCount + l * ptsPerLat + p;
      if (idx >= count) break;
      const angle = (p / ptsPerLat) * Math.PI * 2;
      pts[idx * 3] = Math.cos(angle) * ringRadius;
      pts[idx * 3 + 1] = y;
      pts[idx * 3 + 2] = Math.sin(angle) * ringRadius;
    }
  }

  // Remainder
  for (let i = meridianCount + latitudes.length * ptsPerLat; i < count; i++) {
    const y = (Math.random() > 0.5 ? 1 : -1) * (0.3 + Math.random() * 0.5) * R;
    const r = Math.sqrt(Math.max(0, R * R - y * y));
    const angle = Math.random() * Math.PI * 2;
    pts[i * 3] = Math.cos(angle) * r;
    pts[i * 3 + 1] = y;
    pts[i * 3 + 2] = Math.sin(angle) * r;
  }

  return pts;
}

// ------------------------------------------------------------------
// 3. CODING: Sharp Code Syntax  < >  (Chevrons only)
// ------------------------------------------------------------------
function getCodingPoints(count: number) {
  const pts = new Float32Array(count * 3);
  const leftCount = Math.floor(count * 0.50);
  const rightCount = count - leftCount;

  // 1. Left Bracket '<'
  for (let i = 0; i < leftCount; i++) {
    const t = i / (leftCount - 1);
    const y = (0.5 - t) * 2.5;
    const x = -1.6 + Math.abs(t - 0.5) * 2.2;
    pts[i * 3] = x;
    pts[i * 3 + 1] = y;
    pts[i * 3 + 2] = 0;
  }

  // 2. Right Bracket '>'
  for (let i = 0; i < rightCount; i++) {
    const idx = leftCount + i;
    const t = i / (rightCount - 1);
    const y = (0.5 - t) * 2.5;
    const x = 1.6 - Math.abs(t - 0.5) * 2.2;
    pts[idx * 3] = x;
    pts[idx * 3 + 1] = y;
    pts[idx * 3 + 2] = 0;
  }

  return pts;
}

// ------------------------------------------------------------------
// 4. DESIGN: Vector Fountain Pen Nib (Iconic Design Tool)
// ------------------------------------------------------------------
function getPenNibPoints(count: number) {
  const pts = new Float32Array(count * 3);
  const outerCount = Math.floor(count * 0.50);
  const holeCount = Math.floor(count * 0.20);
  const slitCount = Math.floor(count * 0.20);
  const baseCount = count - outerCount - holeCount - slitCount;

  // 1. Outer Pen Nib Contour
  for (let i = 0; i < outerCount; i++) {
    const t = i / (outerCount - 1);
    let x = 0;
    let y = 0;

    if (t <= 0.5) {
      const u = t / 0.5;
      y = -1.3 + u * 2.9;
      const taper = Math.pow(1 - u, 0.7);
      x = -0.95 * taper;
    } else {
      const u = (t - 0.5) / 0.5;
      y = 1.6 - u * 2.9;
      const taper = Math.pow(u, 0.7);
      x = 0.95 * taper;
    }

    pts[i * 3] = x;
    pts[i * 3 + 1] = y;
    pts[i * 3 + 2] = 0;
  }

  // 2. Central Circular Breather Hole
  const holeRadius = 0.22;
  const holeCenterY = -0.15;
  for (let i = 0; i < holeCount; i++) {
    const idx = outerCount + i;
    const angle = (i / holeCount) * Math.PI * 2;
    pts[idx * 3] = Math.cos(angle) * holeRadius;
    pts[idx * 3 + 1] = holeCenterY + Math.sin(angle) * holeRadius;
    pts[idx * 3 + 2] = 0;
  }

  // 3. Central Ink Slit
  for (let i = 0; i < slitCount; i++) {
    const idx = outerCount + holeCount + i;
    const t = i / (slitCount - 1);
    pts[idx * 3] = 0;
    pts[idx * 3 + 1] = 1.55 - t * 1.48;
    pts[idx * 3 + 2] = 0;
  }

  // 4. Base Collar / Grip Line
  for (let i = 0; i < baseCount; i++) {
    const idx = outerCount + holeCount + slitCount + i;
    const t = i / (baseCount - 1 || 1);
    pts[idx * 3] = -0.85 + t * 1.7;
    pts[idx * 3 + 1] = -1.35;
    pts[idx * 3 + 2] = 0;
  }

  return pts;
}

function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

// ------------------------------------------------------------------
// MAIN 3D CONSTELLATION ENGINE
// ------------------------------------------------------------------
function MorphingConstellation({
  activeIndex,
  isHoldingBlackHole,
}: {
  activeIndex: number;
  isHoldingBlackHole: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const lineMatRef = useRef<THREE.LineBasicMaterial>(null);
  const pointMatRef = useRef<THREE.PointsMaterial>(null);

  const prevIndex = useRef(activeIndex);
  const morphProgress = useRef(1);
  const timeRef = useRef(0);
  const glitchTimeRef = useRef(0); // Hologram Glitch timer

  // Physics recoil and black hole collapse scale
  const blackHoleIntensity = useRef(0);

  // Interpolated line colors
  const currentLineColor = useRef(new THREE.Color(DOMAIN_THEMES[0].lineColor));
  const targetLineColor = useRef(new THREE.Color(DOMAIN_THEMES[0].lineColor));

  const shapes = useMemo(() => [
    getDnaPoints(PARTICLE_COUNT),        // 0: Medical Sciences
    getEarthGlobePoints(PARTICLE_COUNT), // 1: SEO
    getCodingPoints(PARTICLE_COUNT),     // 2: Coding
    getPenNibPoints(PARTICLE_COUNT),     // 3: Design
  ], []);

  const currentPositions = useMemo(() => new Float32Array(shapes[0]), [shapes]);
  const linePositions = useMemo(() => new Float32Array(PARTICLE_COUNT * PARTICLE_COUNT * 3), []);

  // Per-star vortex orbit offsets
  const vortexData = useMemo(() => {
    const angles = new Float32Array(PARTICLE_COUNT);
    const radDist = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      angles[i] = Math.random() * Math.PI * 2;
      radDist[i] = 0.5 + Math.random() * 1.2;
    }
    return { angles, radDist };
  }, []);

  const starTexture = useMemo(() => createSoftCircleTexture(), []);

  const twinkleData = useMemo(() => {
    const offsets = new Float32Array(PARTICLE_COUNT);
    const speeds = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      offsets[i] = Math.random() * Math.PI * 2;
      speeds[i] = 1.5 + Math.random() * 3.5;
    }
    return { offsets, speeds };
  }, []);

  const sizes = useMemo(() => new Float32Array(PARTICLE_COUNT).fill(0.12), []);

  useFrame((state, delta) => {
    if (!pointsRef.current || !linesRef.current) return;

    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const sizeAttr = pointsRef.current.geometry.attributes.size;
    const linesArray = linesRef.current.geometry.attributes.position.array as Float32Array;

    // Trigger shape glitch and musical chord when index ticks
    if (prevIndex.current !== activeIndex) {
      prevIndex.current = activeIndex;
      morphProgress.current = 0;
      glitchTimeRef.current = 0.25; // 250ms quantum glitch pulse
      const theme = DOMAIN_THEMES[activeIndex % DOMAIN_THEMES.length];
      playMusicalChord(theme.frequency);
    }

    if (morphProgress.current < 1) {
      morphProgress.current = Math.min(1, morphProgress.current + delta * 0.55);
    }

    if (glitchTimeRef.current > 0) {
      glitchTimeRef.current -= delta;
    }

    // Physics calculation for Black Hole Singularity on click & hold
    if (isHoldingBlackHole) {
      blackHoleIntensity.current = Math.min(1, blackHoleIntensity.current + delta * 3.5);
    } else {
      blackHoleIntensity.current = Math.max(0, blackHoleIntensity.current - delta * 2.8);
    }

    // Smoothly interpolate chromatic line colors
    const activeTheme = DOMAIN_THEMES[activeIndex % DOMAIN_THEMES.length];
    targetLineColor.current.set(activeTheme.lineColor);
    currentLineColor.current.lerp(targetLineColor.current, delta * 3.0);

    if (lineMatRef.current) {
      lineMatRef.current.color.copy(currentLineColor.current);
    }

    // Dynamic mouse / touch tilt response
    if (groupRef.current) {
      const targetRotX = -state.pointer.y * 0.55;
      const targetRotY = state.pointer.x * 0.75;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, delta * 3);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, delta * 3);
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, state.pointer.x * 0.35, delta * 2);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, state.pointer.y * 0.35, delta * 2);

      // Split-second Hologram Glitch displacement on switch
      if (glitchTimeRef.current > 0) {
        groupRef.current.position.x += (Math.random() - 0.5) * 0.08;
        groupRef.current.position.y += (Math.random() - 0.5) * 0.08;
      }
    }

    // Organic idle rotation
    pointsRef.current.rotation.y += delta * 0.08;
    pointsRef.current.rotation.x += delta * 0.03;
    linesRef.current.rotation.y += delta * 0.08;
    linesRef.current.rotation.x += delta * 0.03;

    timeRef.current += delta;
    const t = timeRef.current;
    let lineIndex = 0;

    const target = shapes[activeIndex % shapes.length];
    const progress = morphProgress.current;

    // Quantum spiral vortex stream during transitions
    const transitionStream = Math.sin(progress * Math.PI) * 1.4;

    // Pointer 3D coordinate projection in world space for gravitational pull
    const pointer3DX = state.pointer.x * 2.8;
    const pointer3DY = state.pointer.y * 1.8;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const idx = i * 3;
      const ease = smoothstep(Math.min(1, progress)) * 2.2 + 0.6;
      const lerpFactor = ease * delta;

      let tx = target[idx];
      let ty = target[idx + 1];
      let tz = target[idx + 2];

      // Add spiral vortex while in transit
      if (transitionStream > 0.02) {
        const angle = vortexData.angles[i] + t * 4;
        const swirlRadius = vortexData.radDist[i] * transitionStream;
        tx += Math.cos(angle) * swirlRadius;
        tz += Math.sin(angle) * swirlRadius;
        ty += Math.sin(angle * 2) * 0.3 * transitionStream;
      }

      // Gravitational Singularity Pull toward cursor when clicking/holding
      if (blackHoleIntensity.current > 0.01) {
        const bhForce = blackHoleIntensity.current;
        tx = THREE.MathUtils.lerp(tx, pointer3DX + (Math.random() - 0.5) * 0.25, bhForce * 0.85);
        ty = THREE.MathUtils.lerp(ty, pointer3DY + (Math.random() - 0.5) * 0.25, bhForce * 0.85);
        tz = THREE.MathUtils.lerp(tz, (Math.random() - 0.5) * 0.25, bhForce * 0.85);
      }

      positions[idx] += (tx - positions[idx]) * lerpFactor;
      positions[idx + 1] += (ty - positions[idx + 1]) * lerpFactor;
      positions[idx + 2] += (tz - positions[idx + 2]) * lerpFactor;

      // Resting breathing wave
      if (i % 3 === 0) {
        positions[idx] += Math.sin(t * 2 + i) * 0.003;
      }

      // Star sizes - clean twinkle without oversized flares
      if (sizeAttr) {
        const s = sizes as Float32Array;
        const twinkle = Math.sin(t * twinkleData.speeds[i] + twinkleData.offsets[i]);
        s[i] = 0.11 + twinkle * 0.025;
        (sizeAttr as THREE.BufferAttribute).needsUpdate = true;
      }

      // Pure constellation connecting lines between neighboring stars only (NO cursor lines)
      for (let j = i + 1; j < PARTICLE_COUNT; j++) {
        // Prevent lines spanning across the middle gap in Coding '< >'
        if (activeIndex % shapes.length === 2) {
          const leftCount = Math.floor(PARTICLE_COUNT * 0.50);
          if ((i < leftCount && j >= leftCount) || (i >= leftCount && j < leftCount)) continue;
        }

        const jdx = j * 3;
        const dx = positions[idx] - positions[jdx];
        const dy = positions[idx + 1] - positions[jdx + 1];
        const dz = positions[idx + 2] - positions[jdx + 2];
        const distSq = dx * dx + dy * dy + dz * dz;

        if (distSq < 0.16) {
          linesArray[lineIndex++] = positions[idx];
          linesArray[lineIndex++] = positions[idx + 1];
          linesArray[lineIndex++] = positions[idx + 2];
          linesArray[lineIndex++] = positions[jdx];
          linesArray[lineIndex++] = positions[jdx + 1];
          linesArray[lineIndex++] = positions[jdx + 2];
        }
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    linesRef.current.geometry.setDrawRange(0, lineIndex / 3);
    linesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      {/* 3D Soft Glowing Stars with organic feathering */}
      <points ref={pointsRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[currentPositions, 3]} />
          <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
        </bufferGeometry>
        <pointsMaterial
          ref={pointMatRef}
          transparent
          color="#ffffff"
          size={0.18}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.NormalBlending}
          opacity={0.85}
          map={starTexture}
        />
      </points>

      {/* Dynamic Chromatic Constellation Lines */}
      <lineSegments ref={linesRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          ref={lineMatRef}
          color={DOMAIN_THEMES[0].lineColor}
          transparent
          opacity={0.25}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
}

// Shared ultra-soft, feathered cosmic starlight disc (guarantees round discs, zero square artifacts)
function createSoftCircleTexture() {
  if (typeof document === 'undefined') return undefined;
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
    gradient.addColorStop(0.25, 'rgba(235, 245, 255, 0.4)');
    gradient.addColorStop(0.6, 'rgba(180, 210, 255, 0.12)');
    gradient.addColorStop(0.9, 'rgba(140, 180, 255, 0.02)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
  }
  return new THREE.CanvasTexture(canvas);
}

// ------------------------------------------------------------------
// Deep Parallax Stardust Layers & Ephemeral Shooting Stars
// ------------------------------------------------------------------
function DeepCosmicBackground() {
  const groupRef = useRef<THREE.Group>(null);
  const layer1Ref = useRef<THREE.Points>(null);
  const layer2Ref = useRef<THREE.Points>(null);
  const shootingStarRef = useRef<THREE.LineSegments>(null);

  const starTexture = useMemo(() => createSoftCircleTexture(), []);

  // Deep Parallax Layer 1: Distant microscopic cosmic dust (200 particles)
  const dust1 = useMemo(() => {
    const count = 200;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = -4 - Math.random() * 8; // Deep in background
    }
    return pos;
  }, []);

  // Mid Parallax Layer 2: Ambient drifting stardust (100 particles)
  const dust2 = useMemo(() => {
    const count = 100;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = -1 - Math.random() * 4; // Mid-plane depth
    }
    return pos;
  }, []);

  // Ephemeral Shooting Stars system (trail line geometry)
  const shootingStarState = useRef({
    active: false,
    timer: 2.0, // First meteor shoots after 2s
    progress: 0,
    speed: 3.5,
    startX: 0,
    startY: 0,
    startZ: 0,
    dx: -1.2,
    dy: -0.7,
    dz: -0.2,
    length: 1.8,
  });

  const shootingLinePos = useMemo(() => new Float32Array(6), []);

  useFrame((state, delta) => {
    // Parallax depth response to mouse
    if (layer1Ref.current) {
      layer1Ref.current.position.x = THREE.MathUtils.lerp(layer1Ref.current.position.x, state.pointer.x * 0.12, 0.03);
      layer1Ref.current.position.y = THREE.MathUtils.lerp(layer1Ref.current.position.y, state.pointer.y * 0.12, 0.03);
      layer1Ref.current.rotation.y += delta * 0.008;
    }
    if (layer2Ref.current) {
      layer2Ref.current.position.x = THREE.MathUtils.lerp(layer2Ref.current.position.x, state.pointer.x * 0.28, 0.05);
      layer2Ref.current.position.y = THREE.MathUtils.lerp(layer2Ref.current.position.y, state.pointer.y * 0.28, 0.05);
      layer2Ref.current.rotation.y += delta * 0.015;
    }

    // Shooting star animation logic
    const s = shootingStarState.current;
    if (!s.active) {
      s.timer -= delta;
      if (s.timer <= 0) {
        // Spawn shooting star high in diagonal corner
        s.active = true;
        s.progress = 0;
        s.timer = 5.0 + Math.random() * 6.0; // Next meteor in 5-11 seconds
        s.startX = 3.0 + Math.random() * 3.0;
        s.startY = 2.5 + Math.random() * 2.0;
        s.startZ = -2.0 - Math.random() * 3.0;
        s.speed = 4.0 + Math.random() * 2.5;
        s.length = 1.4 + Math.random() * 1.0;
      }
    } else {
      s.progress += delta * s.speed;
      const headX = s.startX + s.dx * s.progress;
      const headY = s.startY + s.dy * s.progress;
      const headZ = s.startZ + s.dz * s.progress;

      const tailFrac = Math.max(0, s.progress - s.length);
      const tailX = s.startX + s.dx * tailFrac;
      const tailY = s.startY + s.dy * tailFrac;
      const tailZ = s.startZ + s.dz * tailFrac;

      shootingLinePos[0] = headX;
      shootingLinePos[1] = headY;
      shootingLinePos[2] = headZ;
      shootingLinePos[3] = tailX;
      shootingLinePos[4] = tailY;
      shootingLinePos[5] = tailZ;

      if (shootingStarRef.current) {
        shootingStarRef.current.geometry.attributes.position.needsUpdate = true;
        const mat = shootingStarRef.current.material as THREE.LineBasicMaterial;
        // Fade out smoothly as it reaches completion
        mat.opacity = Math.max(0, 0.7 - (s.progress / 8.0));
      }

      if (s.progress > 8.0) {
        s.active = false;
        if (shootingStarRef.current) {
          const mat = shootingStarRef.current.material as THREE.LineBasicMaterial;
          mat.opacity = 0;
        }
      }
    }
  });

  return (
    <group ref={groupRef}>
      {/* Layer 1: Distant microscopic stardust particles (smooth circular discs) */}
      <points ref={layer1Ref}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dust1, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.045}
          color="#94a3b8"
          transparent
          opacity={0.35}
          depthWrite={false}
          map={starTexture}
        />
      </points>

      {/* Layer 2: Mid-distance soft ambient stardust (smooth circular discs) */}
      <points ref={layer2Ref}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dust2, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.065}
          color="#cbd5e1"
          transparent
          opacity={0.45}
          depthWrite={false}
          map={starTexture}
        />
      </points>

      {/* Rare Ephemeral Shooting Star Line Trail */}
      <lineSegments ref={shootingStarRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[shootingLinePos, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color="#e0f2fe"
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
}

export default function AnimatedHeroCanvas({ activeIndex }: { activeIndex: number }) {
  const [isHoldingBlackHole, setIsHoldingBlackHole] = useState(false);

  // Smoothly unlock audio on user gesture anywhere on window
  useEffect(() => {
    const unlock = () => {
      initAudio();
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('click', unlock);
      window.removeEventListener('keydown', unlock);
      window.removeEventListener('touchstart', unlock);
    };

    window.addEventListener('pointerdown', unlock, { passive: true });
    window.addEventListener('click', unlock, { passive: true });
    window.addEventListener('keydown', unlock, { passive: true });
    window.addEventListener('touchstart', unlock, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('click', unlock);
      window.removeEventListener('keydown', unlock);
      window.removeEventListener('touchstart', unlock);
    };
  }, []);

  const handlePointerDown = () => {
    initAudio();
    setIsHoldingBlackHole(true);
  };

  const handlePointerUp = () => {
    setIsHoldingBlackHole(false);
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      className="w-full h-full relative cursor-grab active:cursor-grabbing touch-none select-none"
    >
      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 45 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <DeepCosmicBackground />
        <MorphingConstellation
          activeIndex={activeIndex}
          isHoldingBlackHole={isHoldingBlackHole}
        />
      </Canvas>
    </div>
  );
}

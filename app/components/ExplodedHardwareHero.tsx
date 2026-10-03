'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

const PALETTES = [
  { main: '#14b8a6', glow: '#5eead4', base: '#042f2e' }, // Medical
  { main: '#a855f7', glow: '#d8b4fe', base: '#2e1065' }, // SEO
  { main: '#3b82f6', glow: '#93c5fd', base: '#172554' }, // Code
  { main: '#f43f5e', glow: '#fda4af', base: '#4c0519' }, // Design
];

function ExplodedLayers({ activeIndex }: { activeIndex: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const layers = [
    useRef<THREE.Group>(null),
    useRef<THREE.Group>(null),
    useRef<THREE.Group>(null),
    useRef<THREE.Group>(null),
    useRef<THREE.Group>(null),
  ];

  const palette = PALETTES[activeIndex % PALETTES.length];

  useFrame((_state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
      groupRef.current.rotation.x = Math.sin(_state.clock.elapsedTime * 0.5) * 0.2 + 0.3;
    }

    // Breathing explosion expansion along the vertical axis
    const t = _state.clock.elapsedTime * 1.5;
    const expansion = 0.55 + Math.sin(t) * 0.2; // Distance between layers

    layers.forEach((lRef, idx) => {
      if (lRef.current) {
        const offset = (idx - 2) * expansion;
        lRef.current.position.y = offset;
      }
    });
  });

  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={0.6}>
      <group ref={groupRef}>
        {/* Layer 0: Base Substrate Board */}
        <group ref={layers[0]}>
          <mesh>
            <boxGeometry args={[2.4, 0.08, 2.4]} />
            <meshStandardMaterial color={palette.base} roughness={0.3} metalness={0.7} />
          </mesh>
          <mesh position={[0, -0.05, 0]}>
            <boxGeometry args={[2.5, 0.02, 2.5]} />
            <meshBasicMaterial color={palette.glow} wireframe transparent opacity={0.4} />
          </mesh>
        </group>

        {/* Layer 1: Silicon Logic Die */}
        <group ref={layers[1]}>
          <mesh>
            <boxGeometry args={[1.6, 0.06, 1.6]} />
            <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.9} />
          </mesh>
          {/* Micro Bus Traces */}
          {[-0.6, 0, 0.6].map((x, i) => (
            <mesh key={i} position={[x, 0.04, 0]}>
              <boxGeometry args={[0.08, 0.02, 1.4]} />
              <meshBasicMaterial color={palette.glow} />
            </mesh>
          ))}
        </group>

        {/* Layer 2: Core Processing Crystal */}
        <group ref={layers[2]}>
          <mesh>
            <octahedronGeometry args={[0.7, 0]} />
            <meshPhysicalMaterial
              color={palette.main}
              emissive={palette.glow}
              emissiveIntensity={0.8}
              roughness={0.1}
              metalness={0.2}
              clearcoat={1}
            />
          </mesh>
        </group>

        {/* Layer 3: Interconnect Wireframe Matrix */}
        <group ref={layers[3]}>
          <mesh>
            <boxGeometry args={[2.0, 0.04, 2.0]} />
            <meshBasicMaterial color={palette.glow} wireframe transparent opacity={0.6} />
          </mesh>
        </group>

        {/* Layer 4: Glass Protective Shield */}
        <group ref={layers[4]}>
          <mesh>
            <boxGeometry args={[2.3, 0.04, 2.3]} />
            <meshPhysicalMaterial
              color="#ffffff"
              roughness={0.05}
              transmission={0.9}
              thickness={0.5}
              transparent
              opacity={0.7}
            />
          </mesh>
        </group>
      </group>
    </Float>
  );
}

export default function ExplodedHardwareHero({ activeIndex }: { activeIndex: number }) {
  const palette = PALETTES[activeIndex % PALETTES.length];

  return (
    <div className="w-full h-full relative">
      <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[6, 8, 5]} intensity={2.0} color="#ffffff" />
        <pointLight position={[-5, -4, -3]} intensity={2.5} color={palette.main} />
        <pointLight position={[5, 4, 3]} intensity={2.5} color={palette.glow} />
        <ExplodedLayers activeIndex={activeIndex} />
      </Canvas>
    </div>
  );
}

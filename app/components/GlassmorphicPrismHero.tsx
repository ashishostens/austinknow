'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

const PALETTES = [
  { color: '#2dd4bf', emissive: '#0f766e', accent: '#5eead4' }, // Medical Teal
  { color: '#c084fc', emissive: '#6b21a8', accent: '#e9d5ff' }, // SEO Purple
  { color: '#60a5fa', emissive: '#1e40af', accent: '#93c5fd' }, // Code Blue
  { color: '#fb7185', emissive: '#9f1239', accent: '#fda4af' }, // Design Rose
];

function PrismaticCores({ activeIndex }: { activeIndex: number }) {
  const outerPrism = useRef<THREE.Mesh>(null);
  const innerGeometry = useRef<THREE.Mesh>(null);
  const floatingRing = useRef<THREE.Group>(null);

  const palette = PALETTES[activeIndex % PALETTES.length];

  useFrame((_state, delta) => {
    if (outerPrism.current) {
      outerPrism.current.rotation.x += delta * 0.35;
      outerPrism.current.rotation.y += delta * 0.45;
    }
    if (innerGeometry.current) {
      innerGeometry.current.rotation.y -= delta * 0.6;
      innerGeometry.current.rotation.z += delta * 0.4;
      const s = 0.85 + Math.sin(_state.clock.elapsedTime * 2.5) * 0.08;
      innerGeometry.current.scale.set(s, s, s);
    }
    if (floatingRing.current) {
      floatingRing.current.rotation.z += delta * 0.5;
    }
  });

  return (
    <Float speed={2.5} rotationIntensity={0.6} floatIntensity={1.0}>
      {/* Internal Glowing Quantum Core */}
      <mesh ref={innerGeometry}>
        <dodecahedronGeometry args={[0.7, 0]} />
        <meshPhysicalMaterial
          color={palette.color}
          emissive={palette.accent}
          emissiveIntensity={1.2}
          roughness={0.1}
          metalness={0.2}
          wireframe
        />
      </mesh>

      {/* Outer Heavy Refractive Frosted Glass Prism */}
      <mesh ref={outerPrism}>
        <octahedronGeometry args={[1.65, 0]} />
        <MeshTransmissionMaterial
          backside={true}
          samples={8}
          resolution={256}
          transmission={0.95}
          roughness={0.08}
          thickness={1.2}
          ior={1.65}
          chromaticAberration={0.12}
          anisotropy={0.2}
          distortion={0.3}
          distortionScale={0.4}
          temporalDistortion={0.2}
          color="#ffffff"
        />
      </mesh>

      {/* Floating Refraction Ring */}
      <group ref={floatingRing} rotation={[Math.PI / 3, 0, 0]}>
        <mesh>
          <torusGeometry args={[2.3, 0.012, 16, 100]} />
          <meshBasicMaterial color={palette.color} transparent opacity={0.6} />
        </mesh>
      </group>
    </Float>
  );
}

export default function GlassmorphicPrismHero({ activeIndex }: { activeIndex: number }) {
  const palette = PALETTES[activeIndex % PALETTES.length];

  return (
    <div className="w-full h-full relative">
      <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 10, 5]} intensity={2.0} color="#ffffff" />
        <pointLight position={[-5, -5, -3]} intensity={2.5} color={palette.color} />
        <pointLight position={[5, 5, 3]} intensity={2.5} color={palette.accent} />
        <PrismaticCores activeIndex={activeIndex} />
      </Canvas>
    </div>
  );
}

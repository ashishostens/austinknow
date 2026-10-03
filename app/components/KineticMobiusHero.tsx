'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

const PALETTES = [
  { main: '#14b8a6', glow: '#2dd4bf' }, // Medical
  { main: '#a855f7', glow: '#c084fc' }, // SEO
  { main: '#3b82f6', glow: '#60a5fa' }, // Code
  { main: '#f43f5e', glow: '#fb7185' }, // Design
];

function MobiusRibbon({ activeIndex }: { activeIndex: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const palette = PALETTES[activeIndex % PALETTES.length];

  // Procedural mathematical Mobius Strip geometry
  const geometry = useMemo(() => {
    const uSegments = 160;
    const vSegments = 24;
    const vertices: number[] = [];
    const indices: number[] = [];

    const R = 1.6; // Primary radius
    const w = 0.55; // Ribbon half-width

    for (let i = 0; i <= uSegments; i++) {
      const u = (i / uSegments) * Math.PI * 2;
      for (let j = 0; j <= vSegments; j++) {
        const v = (j / vSegments - 0.5) * 2 * w;

        // Parametric Mobius equations
        const x = (R + v * Math.cos(u / 2)) * Math.cos(u);
        const y = (R + v * Math.cos(u / 2)) * Math.sin(u);
        const z = v * Math.sin(u / 2);

        vertices.push(x, y, z);
      }
    }

    for (let i = 0; i < uSegments; i++) {
      for (let j = 0; j < vSegments; j++) {
        const a = i * (vSegments + 1) + j;
        const b = (i + 1) * (vSegments + 1) + j;
        const c = (i + 1) * (vSegments + 1) + (j + 1);
        const d = i * (vSegments + 1) + (j + 1);

        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame((_state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.45;
      meshRef.current.rotation.y += delta * 0.6;
    }
  });

  return (
    <Float speed={2.2} rotationIntensity={0.6} floatIntensity={0.9}>
      <mesh ref={meshRef} geometry={geometry}>
        <meshPhysicalMaterial
          color={palette.main}
          emissive={palette.glow}
          emissiveIntensity={0.4}
          roughness={0.15}
          metalness={0.85}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          side={THREE.DoubleSide}
          wireframe={false}
        />
      </mesh>
    </Float>
  );
}

export default function KineticMobiusHero({ activeIndex }: { activeIndex: number }) {
  const palette = PALETTES[activeIndex % PALETTES.length];

  return (
    <div className="w-full h-full relative">
      <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={2.5} color="#ffffff" />
        <pointLight position={[-6, -6, -3]} intensity={2.5} color={palette.glow} />
        <pointLight position={[6, 6, 3]} intensity={2.5} color={palette.main} />
        <MobiusRibbon activeIndex={activeIndex} />
      </Canvas>
    </div>
  );
}

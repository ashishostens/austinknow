'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text } from '@react-three/drei';
import * as THREE from 'three';

const PALETTES = [
  { main: '#14b8a6', glow: '#2dd4bf', term: '#042f2e' },
  { main: '#a855f7', glow: '#c084fc', term: '#2e1065' },
  { main: '#3b82f6', glow: '#60a5fa', term: '#172554' },
  { main: '#f43f5e', glow: '#fb7185', term: '#4c0519' },
];

const GLYPHS = ['<code/>', 'AI_01', '{fn}', '404', '0x1F', 'SEO', 'DNA', 'λ', 'const', '0101'];

function AsciiHudVisual({ activeIndex }: { activeIndex: number }) {
  const group = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const palette = PALETTES[activeIndex % PALETTES.length];

  const glyphPoints = useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => {
      const angle = (i / 18) * Math.PI * 2;
      const r = 1.9 + (i % 2) * 0.4;
      return {
        x: Math.cos(angle) * r,
        y: Math.sin(angle) * r,
        z: ((i % 3) - 1) * 0.5,
        text: GLYPHS[i % GLYPHS.length],
      };
    });
  }, []);

  useFrame((_state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.3;
      group.current.rotation.z += delta * 0.1;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z -= delta * 0.5;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
      <group ref={group}>
        {/* Central Wireframe Radar / HUD Core */}
        <mesh>
          <icosahedronGeometry args={[1.2, 1]} />
          <meshBasicMaterial color={palette.glow} wireframe transparent opacity={0.65} />
        </mesh>

        <mesh>
          <octahedronGeometry args={[0.7, 0]} />
          <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.85} />
        </mesh>

        {/* Outer Circular Reticle Ring */}
        <mesh ref={ringRef}>
          <ringGeometry args={[2.5, 2.53, 64]} />
          <meshBasicMaterial color={palette.main} transparent opacity={0.5} side={THREE.DoubleSide} />
        </mesh>

        {/* Orbiting Terminal Glyphs */}
        {glyphPoints.map((item, idx) => (
          <Text
            key={idx}
            position={[item.x, item.y, item.z]}
            fontSize={0.22}
            color={palette.glow}
            anchorX="center"
            anchorY="middle"
          >
            {item.text}
          </Text>
        ))}
      </group>
    </Float>
  );
}

export default function AsciiHudHero({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="w-full h-full relative">
      <Canvas camera={{ position: [0, 0, 5.8], fov: 45 }}>
        <AsciiHudVisual activeIndex={activeIndex} />
      </Canvas>
    </div>
  );
}

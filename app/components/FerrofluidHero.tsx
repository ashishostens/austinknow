'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';

const PALETTES = [
  { color: '#0f172a', emissive: '#0d9488', specular: '#5eead4', distort: 0.65, speed: 3.5 }, // Medical Emerald Fluid
  { color: '#18022d', emissive: '#7e22ce', specular: '#c084fc', distort: 0.75, speed: 4.0 }, // SEO Purple Magnetic
  { color: '#020617', emissive: '#1d4ed8', specular: '#60a5fa', distort: 0.55, speed: 5.0 }, // Code Electric Ferrofluid
  { color: '#1f0410', emissive: '#be123c', specular: '#fb7185', distort: 0.70, speed: 3.8 }, // Design Molten Rose
];

function FerrofluidMesh({ activeIndex }: { activeIndex: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const distortRef = useRef<any>(null);
  const rippleRings = useRef<THREE.Group>(null);
  const palette = PALETTES[activeIndex % PALETTES.length];

  useFrame((_state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.4;
      meshRef.current.rotation.y += delta * 0.55;
    }
    if (distortRef.current) {
      distortRef.current.distort = THREE.MathUtils.lerp(
        distortRef.current.distort,
        palette.distort + Math.sin(_state.clock.elapsedTime * 3) * 0.15,
        delta * 2.0
      );
    }
    if (rippleRings.current) {
      rippleRings.current.rotation.z -= delta * 0.6;
    }
  });

  return (
    <Float speed={2.5} rotationIntensity={0.8} floatIntensity={1.2}>
      {/* Dynamic Magnetic Ferrofluid Droplet */}
      <Sphere ref={meshRef} args={[1.3, 128, 128]}>
        <MeshDistortMaterial
          ref={distortRef}
          color={palette.color}
          emissive={palette.emissive}
          emissiveIntensity={0.6}
          roughness={0.05}
          metalness={0.95}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
          distort={palette.distort}
          speed={palette.speed}
        />
      </Sphere>

      {/* Surface tension droplets */}
      <group ref={rippleRings}>
        {[-1.8, 1.8].map((x, i) => (
          <mesh key={i} position={[x, (i - 0.5) * 1.5, 0]}>
            <sphereGeometry args={[0.22, 32, 32]} />
            <meshStandardMaterial
              color={palette.specular}
              roughness={0.1}
              metalness={0.9}
              emissive={palette.emissive}
              emissiveIntensity={0.4}
            />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

export default function FerrofluidHero({ activeIndex }: { activeIndex: number }) {
  const palette = PALETTES[activeIndex % PALETTES.length];

  return (
    <div className="w-full h-full relative">
      <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={2.5} color="#ffffff" />
        <pointLight position={[-6, -6, -3]} intensity={3} color={palette.specular} />
        <pointLight position={[6, 6, 3]} intensity={3} color={palette.emissive} />
        <FerrofluidMesh activeIndex={activeIndex} />
      </Canvas>
    </div>
  );
}

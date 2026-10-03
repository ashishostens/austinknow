'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text } from '@react-three/drei';
import * as THREE from 'three';

// -------------------------------------------------------------
// Transition State Wrapper: Handles Dissolve -> Recreate Particle Burst
// -------------------------------------------------------------
function DissolveRecreateContainer({
  activeIndex,
  children,
}: {
  activeIndex: number;
  children: (displayedIndex: number, transitionProgress: number) => React.ReactNode;
}) {
  const [displayedIndex, setDisplayedIndex] = useState(activeIndex);
  const transitionRef = useRef(1); // 0 = fully dissolved out, 1 = fully materialized in
  const isDissolvingOut = useRef(false);
  const nextTargetIndex = useRef(activeIndex);
  const groupRef = useRef<THREE.Group>(null);
  const burstParticlesRef = useRef<THREE.Points>(null);

  // Trigger dissolve when activeIndex changes
  useEffect(() => {
    if (activeIndex !== displayedIndex && !isDissolvingOut.current) {
      nextTargetIndex.current = activeIndex;
      isDissolvingOut.current = true;
    }
  }, [activeIndex, displayedIndex]);

  // Spark burst particles for dissolve effect
  const burstCount = 200;
  const burstData = useMemo(() => {
    const pos = new Float32Array(burstCount * 3);
    const vel = new Float32Array(burstCount * 3);
    for (let i = 0; i < burstCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const speed = 1.5 + Math.random() * 2.5;

      vel[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
      vel[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
      vel[i * 3 + 2] = Math.cos(phi) * speed;

      pos[i * 3] = 0;
      pos[i * 3 + 1] = 0;
      pos[i * 3 + 2] = 0;
    }
    return { pos, vel };
  }, [burstCount]);

  useFrame((_state, delta) => {
    if (isDissolvingOut.current) {
      // Dissolve out: 1 -> 0 quickly (~0.5s)
      transitionRef.current -= delta * 2.2;
      if (transitionRef.current <= 0) {
        transitionRef.current = 0;
        setDisplayedIndex(nextTargetIndex.current);
        isDissolvingOut.current = false; // Start recreating in
      }
    } else if (transitionRef.current < 1) {
      // Recreate in: 0 -> 1 smoothly (~0.6s)
      transitionRef.current = Math.min(1, transitionRef.current + delta * 1.8);
    }

    const p = transitionRef.current; // 0 (dissolved) to 1 (solid)

    if (groupRef.current) {
      // Scale down + spin rapidly while dissolving, then expand back
      const scale = 0.2 + 0.8 * Math.pow(p, 2);
      groupRef.current.scale.set(scale, scale, scale);
      groupRef.current.position.y = (1 - p) * 0.4;
      groupRef.current.rotation.y += delta * (isDissolvingOut.current ? 3.0 : 0.8);
    }

    // Animate burst sparks during the transition
    if (burstParticlesRef.current) {
      const positions = burstParticlesRef.current.geometry.attributes.position.array as Float32Array;
      const burstFactor = (1 - p) * 1.2;

      for (let i = 0; i < burstCount; i++) {
        positions[i * 3] = burstData.vel[i * 3] * burstFactor;
        positions[i * 3 + 1] = burstData.vel[i * 3 + 1] * burstFactor;
        positions[i * 3 + 2] = burstData.vel[i * 3 + 2] * burstFactor;
      }
      burstParticlesRef.current.geometry.attributes.position.needsUpdate = true;
      burstParticlesRef.current.visible = p < 0.95;
    }
  });

  return (
    <>
      {/* Dissolution quantum spark particles */}
      <points ref={burstParticlesRef} visible={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[burstData.pos, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          color="#60a5fa"
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Hologram Model Group */}
      <group ref={groupRef}>{children(displayedIndex, transitionRef.current)}</group>
    </>
  );
}

// -------------------------------------------------------------
// 1. MEDICAL SCIENCES: Rotating 3D DNA Double-Helix + Pulsing Core
// -------------------------------------------------------------
function MedicalModel({ progress }: { progress: number }) {
  const group = useRef<THREE.Group>(null);
  const heartRef = useRef<THREE.Mesh>(null);
  const helixPairs = 22;

  const rungs = useMemo(() => {
    return Array.from({ length: helixPairs }, (_, i) => {
      const t = (i / helixPairs) * Math.PI * 4;
      const y = (i / helixPairs - 0.5) * 4.0;
      const x = Math.cos(t) * 1.1;
      const z = Math.sin(t) * 1.1;
      return { t, y, x, z };
    });
  }, [helixPairs]);

  useFrame((_state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.7;
    if (heartRef.current) {
      const scale = 1 + Math.sin(_state.clock.elapsedTime * 6) * 0.12;
      heartRef.current.scale.set(scale, scale, scale);
    }
  });

  const opacity = Math.max(0.1, progress);

  return (
    <group ref={group}>
      <mesh ref={heartRef} position={[0, 0, 0]}>
        <octahedronGeometry args={[0.45, 2]} />
        <meshPhysicalMaterial
          color="#0d9488"
          emissive="#2dd4bf"
          emissiveIntensity={0.8 * progress}
          roughness={0.1}
          metalness={0.1}
          clearcoat={1}
          wireframe
          transparent
          opacity={opacity}
        />
      </mesh>

      {rungs.map((rung, i) => (
        <group key={i} position={[0, rung.y, 0]}>
          <mesh position={[rung.x, 0, rung.z]}>
            <sphereGeometry args={[0.09, 16, 16]} />
            <meshStandardMaterial
              color="#14b8a6"
              emissive="#5eead4"
              emissiveIntensity={0.6 * progress}
              transparent
              opacity={opacity}
            />
          </mesh>
          <mesh position={[-rung.x, 0, -rung.z]}>
            <sphereGeometry args={[0.09, 16, 16]} />
            <meshStandardMaterial
              color="#06b6d4"
              emissive="#67e8f9"
              emissiveIntensity={0.6 * progress}
              transparent
              opacity={opacity}
            />
          </mesh>
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[new Float32Array([rung.x, 0, rung.z, -rung.x, 0, -rung.z]), 3]}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#99f6e4" transparent opacity={0.6 * opacity} />
          </line>
        </group>
      ))}
    </group>
  );
}

// -------------------------------------------------------------
// 2. SEO: Interconnected Global Network Web + Radar Scan
// -------------------------------------------------------------
function SeoModel({ progress }: { progress: number }) {
  const group = useRef<THREE.Group>(null);
  const radarRef = useRef<THREE.Mesh>(null);
  const nodeCount = 26;

  const { nodes, connections } = useMemo(() => {
    const pts: [number, number, number][] = [];
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < nodeCount; i++) {
      const y = 1 - (i / (nodeCount - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = phi * i;
      const x = Math.cos(theta) * radius * 1.5;
      const z = Math.sin(theta) * radius * 1.5;
      pts.push([x, y * 1.5, z]);
    }

    const lines: number[] = [];
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i][0] - pts[j][0];
        const dy = pts[i][1] - pts[j][1];
        const dz = pts[i][2] - pts[j][2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < 1.3) {
          lines.push(...pts[i], ...pts[j]);
        }
      }
    }
    return { nodes: pts, connections: new Float32Array(lines) };
  }, [nodeCount]);

  useFrame((_state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.45;
    if (radarRef.current) {
      radarRef.current.rotation.z += delta * 1.8;
      radarRef.current.scale.setScalar(1 + (Math.sin(_state.clock.elapsedTime * 3) + 1) * 0.15);
    }
  });

  const opacity = Math.max(0.1, progress);

  return (
    <group ref={group}>
      <mesh>
        <icosahedronGeometry args={[0.55, 2]} />
        <meshPhysicalMaterial
          color="#7c3aed"
          emissive="#c084fc"
          emissiveIntensity={0.6 * progress}
          roughness={0.2}
          clearcoat={1}
          wireframe
          transparent
          opacity={opacity}
        />
      </mesh>

      <mesh ref={radarRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.6, 1.66, 64]} />
        <meshBasicMaterial color="#c084fc" transparent opacity={0.4 * opacity} side={THREE.DoubleSide} />
      </mesh>

      {nodes.map((pos, idx) => (
        <mesh key={idx} position={pos}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial
            color="#a855f7"
            emissive="#d8b4fe"
            emissiveIntensity={0.8 * progress}
            transparent
            opacity={opacity}
          />
        </mesh>
      ))}

      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[connections, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#c084fc" transparent opacity={0.35 * opacity} />
      </lineSegments>
    </group>
  );
}

// -------------------------------------------------------------
// 3. CODING: 3D Holographic Code Cube + Syntax Orbitals
// -------------------------------------------------------------
function CodingModel({ progress }: { progress: number }) {
  const outerCube = useRef<THREE.Group>(null);
  const innerCube = useRef<THREE.Mesh>(null);
  const bracketGroup = useRef<THREE.Group>(null);

  useFrame((_state, delta) => {
    if (!outerCube.current) return;
    outerCube.current.rotation.x += delta * 0.45;
    outerCube.current.rotation.y += delta * 0.6;
    if (innerCube.current) {
      innerCube.current.rotation.x -= delta * 0.7;
      innerCube.current.rotation.z += delta * 0.5;
    }
    if (bracketGroup.current) {
      bracketGroup.current.rotation.y += delta * 0.35;
    }
  });

  const opacity = Math.max(0.1, progress);

  return (
    <group>
      <group ref={outerCube}>
        <mesh>
          <boxGeometry args={[2.0, 2.0, 2.0]} />
          <meshBasicMaterial color="#3b82f6" wireframe transparent opacity={0.45 * opacity} />
        </mesh>
        {[-1, 1].map((x) =>
          [-1, 1].map((y) =>
            [-1, 1].map((z) => (
              <mesh key={`${x}-${y}-${z}`} position={[x, y, z]}>
                <boxGeometry args={[0.14, 0.14, 0.14]} />
                <meshStandardMaterial
                  color="#60a5fa"
                  emissive="#93c5fd"
                  emissiveIntensity={0.9 * progress}
                  transparent
                  opacity={opacity}
                />
              </mesh>
            ))
          )
        )}
      </group>

      <mesh ref={innerCube}>
        <octahedronGeometry args={[0.85, 0]} />
        <meshPhysicalMaterial
          color="#1d4ed8"
          emissive="#60a5fa"
          emissiveIntensity={0.7 * progress}
          roughness={0.1}
          metalness={0.2}
          clearcoat={1}
          wireframe
          transparent
          opacity={opacity}
        />
      </mesh>

      <group ref={bracketGroup}>
        <Text
          position={[-1.6, 0, 0]}
          fontSize={0.8}
          color="#93c5fd"
          anchorX="center"
          anchorY="middle"
          fillOpacity={opacity}
        >
          &lt;
        </Text>
        <Text
          position={[0, 0, 1.4]}
          fontSize={0.7}
          color="#60a5fa"
          anchorX="center"
          anchorY="middle"
          fillOpacity={opacity}
        >
          /
        </Text>
        <Text
          position={[1.6, 0, 0]}
          fontSize={0.8}
          color="#93c5fd"
          anchorX="center"
          anchorY="middle"
          fillOpacity={opacity}
        >
          &gt;
        </Text>
      </group>
    </group>
  );
}

// -------------------------------------------------------------
// 4. DESIGN: Prismatic Icosahedron Gem + Golden Ratio Rings
// -------------------------------------------------------------
function DesignModel({ progress }: { progress: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ring1 = useRef<THREE.Group>(null);
  const ring2 = useRef<THREE.Group>(null);

  useFrame((_state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta * 0.3;
    meshRef.current.rotation.y += delta * 0.45;
    if (ring1.current) ring1.current.rotation.z += delta * 0.6;
    if (ring2.current) ring2.current.rotation.y -= delta * 0.5;
  });

  const opacity = Math.max(0.1, progress);

  return (
    <group>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.15, 0]} />
        <meshPhysicalMaterial
          color="#f43f5e"
          emissive="#fb7185"
          emissiveIntensity={0.45 * progress}
          roughness={0.15}
          metalness={0.2}
          clearcoat={1}
          transparent
          opacity={opacity}
        />
      </mesh>

      <group ref={ring1} rotation={[Math.PI / 4, 0, 0]}>
        <mesh>
          <torusGeometry args={[1.9, 0.015, 16, 80]} />
          <meshBasicMaterial color="#fb923c" transparent opacity={0.6 * opacity} />
        </mesh>
      </group>

      <group ref={ring2} rotation={[-Math.PI / 3, Math.PI / 6, 0]}>
        <mesh>
          <torusGeometry args={[2.2, 0.01, 16, 80]} />
          <meshBasicMaterial color="#f472b6" transparent opacity={0.4 * opacity} />
        </mesh>
      </group>
    </group>
  );
}

// -------------------------------------------------------------
// MAIN COMPONENT EXPORT
// -------------------------------------------------------------
export default function ModernHeroAlternative({ activeIndex }: { activeIndex: number }) {
  const currentDomain = activeIndex % 4;

  const domainThemes = [
    { name: 'Medical Sciences', color: '#14b8a6', light: '#2dd4bf' },
    { name: 'SEO & Search Architecture', color: '#8b5cf6', light: '#c084fc' },
    { name: 'Full-Stack Code Engineering', color: '#3b82f6', light: '#60a5fa' },
    { name: 'Visual & System Design', color: '#f43f5e', light: '#fb7185' },
  ];

  const currentTheme = domainThemes[currentDomain];

  return (
    <div className="w-full h-full relative">
      <Canvas camera={{ position: [0, 0, 5.8], fov: 45 }}>
        {/* Studio Lighting */}
        <ambientLight intensity={0.7} />
        <directionalLight position={[6, 8, 5]} intensity={1.8} color="#ffffff" />
        <pointLight position={[-5, -4, -3]} intensity={2.5} color={currentTheme.color} />
        <pointLight position={[5, 4, 3]} intensity={2.5} color={currentTheme.light} />

        {/* Dissolve & Recreate transition wrapper */}
        <Float speed={1.8} rotationIntensity={0.3} floatIntensity={0.6}>
          <DissolveRecreateContainer activeIndex={currentDomain}>
            {(idx, progress) => {
              switch (idx) {
                case 0:
                  return <MedicalModel progress={progress} />;
                case 1:
                  return <SeoModel progress={progress} />;
                case 2:
                  return <CodingModel progress={progress} />;
                case 3:
                  return <DesignModel progress={progress} />;
                default:
                  return null;
              }
            }}
          </DissolveRecreateContainer>
        </Float>
      </Canvas>

      {/* Modern Badge indicator at bottom of 3D Canvas */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-mono tracking-wider flex items-center gap-2 pointer-events-none">
        <span
          className="w-2 h-2 rounded-full animate-ping"
          style={{ backgroundColor: currentTheme.light }}
        />
        <span className="text-gray-300">{currentTheme.name}</span>
      </div>
    </div>
  );
}

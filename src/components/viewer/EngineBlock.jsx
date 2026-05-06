import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useEngineStore from '../../store/engineStore';

// Engine block is the main housing. Centered at origin.
// Inline-4 cylinders run along X-axis.
// Power output goes toward -Z (rear).
// Cylinder height (piston travel) is along Y-axis.

export default function EngineBlock({ onClick }) {
  const groupRef = useRef();
  const bodyRef = useRef();
  const activeTab = useEngineStore((s) => s.activeTab);
  const isRunning = useEngineStore((s) => s.isRunning);

  const blockMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#2b5d34', metalness: 0.6, roughness: 0.4,
  }), []);

  const headMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#3d834b', metalness: 0.5, roughness: 0.45,
    emissive: '#001800', emissiveIntensity: 0.15,
  }), []);

  const overheatMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#4a2020', metalness: 0.8, roughness: 0.3,
    emissive: '#ff2200', emissiveIntensity: 0,
  }), []);

  const boltMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#667788', metalness: 0.95, roughness: 0.1,
  }), []);

  useFrame(() => {
    if (!groupRef.current) return;
    const { isRunning, rpm, failures } = useEngineStore.getState();

    // Vibration
    const vib = isRunning ? (rpm / 3000) * 0.004 : 0;
    if (isRunning && rpm > 0) {
      groupRef.current.position.x = (Math.random() - 0.5) * vib;
      groupRef.current.position.y = (Math.random() - 0.5) * vib;
    } else {
      groupRef.current.position.x *= 0.9;
      groupRef.current.position.y *= 0.9;
    }

    // Overheat glow
    if (failures.overheating) {
      overheatMaterial.emissiveIntensity = 0.3 + Math.sin(Date.now() * 0.005) * 0.2;
      if (bodyRef.current) bodyRef.current.material = overheatMaterial;
    } else {
      overheatMaterial.emissiveIntensity = 0;
      if (bodyRef.current) bodyRef.current.material = blockMaterial;
    }
  });

  const isClickable = activeTab === 'learning';

  // Cylinder bore positions along X (4 inline cylinders)
  // MUST match Crankshaft, Piston, and Bearings positions
  const cylPositions = [-0.6, -0.2, 0.2, 0.6];

  return (
    <group
      ref={groupRef}
      onClick={isClickable ? (e) => { e.stopPropagation(); onClick?.('engineBlock'); } : undefined}
    >
      {/* ── Main Block Body ── */}
      <mesh ref={bodyRef} position={[0, 0, 0]} material={blockMaterial} castShadow receiveShadow>
        <boxGeometry args={[2.0, 1.2, 1.0]} />
      </mesh>

      {/* ── Cylinder Head (top plate) ── */}
      <mesh position={[0, 0.72, 0]} material={headMaterial} castShadow>
        <boxGeometry args={[2.1, 0.2, 1.05]} />
      </mesh>

      {/* ── Sump / Oil Pan (bottom) ── */}
      <mesh position={[0, -0.72, 0]} material={headMaterial} castShadow>
        <boxGeometry args={[1.8, 0.2, 0.85]} />
      </mesh>

      {/* ── Cylinder Bore Caps (visible on top of head) ── */}
      {cylPositions.map((x, i) => (
        <group key={`cyl-${i}`}>
          {/* Cylinder bore ring */}
          <mesh position={[x, 0.83, 0]} material={blockMaterial} castShadow>
            <cylinderGeometry args={[0.16, 0.16, 0.02, 20]} />
          </mesh>
          {/* Cylinder liner (visible inside) */}
          <mesh position={[x, 0.5, 0]} material={headMaterial}>
            <cylinderGeometry args={[0.14, 0.14, 0.5, 16, 1, true]} />
          </mesh>
        </group>
      ))}

      {/* ── Cooling Fins (side detail) ── */}
      {[-0.8, -0.4, 0, 0.4, 0.8].map((x, i) => (
        <mesh key={`fin-${i}`} position={[x, 0, 0.54]} material={blockMaterial} castShadow>
          <boxGeometry args={[0.06, 0.9, 0.08]} />
        </mesh>
      ))}
      {[-0.8, -0.4, 0, 0.4, 0.8].map((x, i) => (
        <mesh key={`fin-b-${i}`} position={[x, 0, -0.54]} material={blockMaterial} castShadow>
          <boxGeometry args={[0.06, 0.9, 0.08]} />
        </mesh>
      ))}

      {/* ── Exhaust Manifold (side, runs along X) ── */}
      <mesh position={[0, 0.4, 0.62]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 1.8, 10]} />
        <meshStandardMaterial color="#3a3a3a" metalness={0.9} roughness={0.2} emissive="#ff4400" emissiveIntensity={isRunning ? 1.5 : 0} />
      </mesh>
      {/* Exhaust runners from each cylinder */}
      {cylPositions.map((x, i) => (
        <mesh key={`exh-${i}`} position={[x, 0.5, 0.55]} rotation={[Math.PI / 4, 0, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.25, 8]} />
          <meshStandardMaterial color="#3a3a3a" metalness={0.9} roughness={0.2} emissive="#ff4400" emissiveIntensity={isRunning ? 2.5 : 0} />
        </mesh>
      ))}

      {/* ── Head Bolts ── */}
      {cylPositions.flatMap((x) => [
        [x - 0.12, 0.83, 0.35],
        [x + 0.12, 0.83, 0.35],
        [x - 0.12, 0.83, -0.35],
        [x + 0.12, 0.83, -0.35],
      ]).map(([x, y, z], i) => (
        <mesh key={`bolt-${i}`} position={[x, y, z]} material={boltMaterial} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.06, 6]} />
        </mesh>
      ))}

      {/* ── Rear Flange (connects to gearbox at Z=-0.5) ── */}
      <mesh position={[0, -0.2, -0.52]} material={headMaterial} castShadow>
        <boxGeometry args={[0.75, 0.75, 0.06]} />
      </mesh>

      {/* ── Front Pulley Mount ── */}
      <mesh position={[0, -0.2, 0.53]} material={headMaterial} castShadow>
        <cylinderGeometry args={[0.18, 0.18, 0.06, 16]} />
      </mesh>
    </group>
  );
}

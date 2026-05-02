import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useEngineStore from '../../store/engineStore';

// Drive shaft: Z = -0.95 (gearbox rear) to Z = -2.25
// Center at (0, -0.2, -1.6), length 1.3

export default function DriveShaft({ onClick }) {
  const groupRef = useRef();
  const spinRef = useRef();
  const activeTab = useEngineStore((s) => s.activeTab);

  const shaftMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#8899aa', metalness: 0.92, roughness: 0.12,
  }), []);
  const couplingMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#667788', metalness: 0.85, roughness: 0.2,
  }), []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const { isRunning, rpm, reverseGear, failures, explodedProgress } = useEngineStore.getState();
    groupRef.current.position.z = -1.6 + explodedProgress * -3.0;

    // Misalignment wobble
    if (isRunning && failures.shaftMisalignment) {
      groupRef.current.position.x = Math.sin(Date.now() * 0.01) * 0.02;
    } else {
      groupRef.current.position.x = 0;
    }
  });

  const isClickable = activeTab === 'learning';

  return (
    <group ref={groupRef} position={[0, -0.2, -1.6]}
      onClick={isClickable ? (e) => { e.stopPropagation(); onClick?.('driveShaft'); } : undefined}>
      {/* Main shaft along Z */}
      <mesh material={shaftMat} castShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 1.3, 16]} />
      </mesh>
      {/* Forward coupling (touches gearbox rear at Z=-0.95) */}
      <mesh position={[0, 0, 0.65]} rotation={[Math.PI / 2, 0, 0]} material={couplingMat} castShadow>
        <cylinderGeometry args={[0.11, 0.11, 0.06, 20]} />
      </mesh>
      {/* Aft coupling (at Z=-2.25, propeller attaches here) */}
      <mesh position={[0, 0, -0.65]} rotation={[Math.PI / 2, 0, 0]} material={couplingMat} castShadow>
        <cylinderGeometry args={[0.09, 0.09, 0.05, 18]} />
      </mesh>
      {/* Stern tube bearing */}
      <mesh position={[0, 0, -0.2]} rotation={[Math.PI / 2, 0, 0]} material={couplingMat} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.1, 16]} />
      </mesh>
      {/* Stern tube seal */}
      <mesh position={[0, 0, -0.5]} rotation={[Math.PI / 2, 0, 0]} material={couplingMat} castShadow>
        <torusGeometry args={[0.06, 0.012, 8, 16]} />
      </mesh>
    </group>
  );
}

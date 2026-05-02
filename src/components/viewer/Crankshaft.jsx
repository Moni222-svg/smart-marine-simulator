import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useEngineStore from '../../store/engineStore';

// Crankshaft at Y=-0.2 inside engine block.
// Runs along X axis. Spins around X (crank throws orbit).
// Cylinder X positions: -0.6, -0.2, 0.2, 0.6

export default function Crankshaft({ onClick }) {
  const shaftRef = useRef();
  const activeTab = useEngineStore((s) => s.activeTab);

  const shaftMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#8899aa', metalness: 0.95, roughness: 0.1,
  }), []);
  const journalMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#aabbcc', metalness: 0.98, roughness: 0.05,
  }), []);
  const counterMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#667788', metalness: 0.9, roughness: 0.15,
  }), []);

  useFrame((_, delta) => {
    if (!shaftRef.current) return;
    const { isRunning, rpm, reverseGear, explodedProgress } = useEngineStore.getState();
    shaftRef.current.position.y = -0.2 + explodedProgress * -2.0;

    if (isRunning && rpm > 0) {
      const speed = (rpm / 3000) * 15 * (reverseGear ? -1 : 1);
      shaftRef.current.rotation.x += speed * delta;
    }
  });

  const isClickable = activeTab === 'learning';
  const cylX = [-0.6, -0.2, 0.2, 0.6];

  return (
    <group ref={shaftRef} position={[0, -0.2, 0]}
      onClick={isClickable ? (e) => { e.stopPropagation(); onClick?.('crankshaft'); } : undefined}>
      {/* Main shaft along X */}
      <mesh material={shaftMat} castShadow rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.055, 0.055, 1.8, 16]} />
      </mesh>
      {/* Crank throws */}
      {cylX.map((x, i) => {
        const phase = (i * Math.PI) / 2;
        const r = 0.15;
        const yOff = Math.sin(phase) * r;
        const zOff = Math.cos(phase) * r;
        return (
          <group key={i}>
            <mesh position={[x, yOff * 0.5, zOff * 0.5]} material={shaftMat} castShadow>
              <boxGeometry args={[0.07, Math.abs(yOff) + 0.05, Math.abs(zOff) + 0.05]} />
            </mesh>
            <mesh position={[x, yOff, zOff]} rotation={[0, 0, Math.PI / 2]} material={journalMat} castShadow>
              <cylinderGeometry args={[0.035, 0.035, 0.09, 12]} />
            </mesh>
            <mesh position={[x, -yOff * 0.6, -zOff * 0.6]} material={counterMat} castShadow>
              <boxGeometry args={[0.08, 0.1, 0.1]} />
            </mesh>
          </group>
        );
      })}
      {/* Flywheel — connects to gearbox */}
      <mesh position={[0, 0, -0.02]} rotation={[0, 0, Math.PI / 2]} material={journalMat} castShadow>
        <cylinderGeometry args={[0.22, 0.22, 0.05, 24]} />
      </mesh>
    </group>
  );
}

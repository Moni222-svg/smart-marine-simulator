import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useEngineStore from '../../store/engineStore';

// 5 main bearings at crankshaft level Y=-0.2
// Between and outside each cylinder: X = -0.8, -0.4, 0.0, 0.4, 0.8

export default function Bearings({ onClick }) {
  const groupRef = useRef();
  const activeTab = useEngineStore((s) => s.activeTab);
  const gearWear = useEngineStore((s) => s.failures.gearWear);

  const mat = useMemo(() => new THREE.MeshStandardMaterial({
    color: gearWear ? '#aa8844' : '#aabbcc',
    metalness: gearWear ? 0.7 : 0.92,
    roughness: gearWear ? 0.5 : 0.1,
  }), [gearWear]);

  useFrame(() => {
    if (!groupRef.current) return;
    const { explodedProgress } = useEngineStore.getState();
    groupRef.current.position.y = -0.2 + explodedProgress * -3.0;
  });

  const isClickable = activeTab === 'learning';
  const bearingX = [-0.8, -0.4, 0.0, 0.4, 0.8];

  return (
    <group ref={groupRef} position={[0, -0.2, 0]}
      onClick={isClickable ? (e) => { e.stopPropagation(); onClick?.('bearings'); } : undefined}>
      {bearingX.map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          <mesh material={mat} castShadow rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.07, 0.02, 10, 18]} />
          </mesh>
          <mesh position={[0, -0.05, 0]} material={mat} castShadow>
            <boxGeometry args={[0.07, 0.03, 0.07]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

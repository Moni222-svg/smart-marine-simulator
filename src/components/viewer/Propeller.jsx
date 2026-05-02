import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useEngineStore from '../../store/engineStore';

// Propeller hub at (0, -0.2, -2.35), touching drive shaft rear at Z=-2.25

export default function Propeller({ onClick }) {
  const propRef = useRef();
  const groupRef = useRef();
  const activeTab = useEngineStore((s) => s.activeTab);
  const propellerDamage = useEngineStore((s) => s.failures.propellerDamage);

  const bladeMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: propellerDamage ? '#886633' : '#b8860b',
    metalness: 0.85, roughness: propellerDamage ? 0.5 : 0.2,
  }), [propellerDamage]);

  const hubMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#8B7355', metalness: 0.9, roughness: 0.15,
  }), []);

  useFrame((_, delta) => {
    if (!propRef.current || !groupRef.current) return;
    const { isRunning, rpm, reverseGear, explodedProgress } = useEngineStore.getState();
    groupRef.current.position.z = -2.35 + explodedProgress * -3.0;

    if (isRunning && rpm > 0) {
      const speed = (rpm / 3000) * 20 * (reverseGear ? -1 : 1);
      propRef.current.rotation.z += speed * delta;
    }
  });

  const isClickable = activeTab === 'learning';
  const bladeCount = propellerDamage ? 3 : 4;

  return (
    <group ref={groupRef} position={[0, -0.2, -2.35]}
      onClick={isClickable ? (e) => { e.stopPropagation(); onClick?.('propeller'); } : undefined}>
      <group ref={propRef}>
        <mesh material={hubMat} castShadow>
          <sphereGeometry args={[0.09, 16, 16]} />
        </mesh>
        <mesh position={[0, 0, -0.14]} rotation={[Math.PI / 2, 0, 0]} material={hubMat} castShadow>
          <coneGeometry args={[0.07, 0.15, 16]} />
        </mesh>
        {Array.from({ length: bladeCount }).map((_, i) => {
          const angle = (i / 4) * Math.PI * 2;
          return (
            <group key={i} rotation={[0, 0, angle]}>
              <mesh position={[0, 0.35, 0]} rotation={[0.25, 0, 0]} material={bladeMat} castShadow>
                <boxGeometry args={[0.11, 0.55, 0.02]} />
              </mesh>
              <mesh position={[0, 0.1, 0]} material={hubMat} castShadow>
                <cylinderGeometry args={[0.03, 0.05, 0.06, 8]} />
              </mesh>
            </group>
          );
        })}
      </group>
      <mesh position={[0, 0, 0.1]} rotation={[Math.PI / 2, 0, 0]} material={hubMat} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.05, 6]} />
      </mesh>
    </group>
  );
}

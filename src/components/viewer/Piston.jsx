import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useEngineStore from '../../store/engineStore';

// Pistons inside cylinder bores. Cylinder X: -0.6, -0.2, 0.2, 0.6
// Rest Y = 0.2 (inside upper block). Stroke ±0.2

export default function Piston({ index = 0, onClick }) {
  const pistonRef = useRef();
  const activeTab = useEngineStore((s) => s.activeTab);

  const pistonMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#99aabb', metalness: 0.9, roughness: 0.15,
  }), []);
  const ringMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#556677', metalness: 0.95, roughness: 0.1,
  }), []);
  const rodMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#7788aa', metalness: 0.85, roughness: 0.2,
  }), []);

  const cylX = [-0.6, -0.2, 0.2, 0.6];
  const xPos = cylX[index];
  const restY = 0.2;

  useFrame((state) => {
    if (!pistonRef.current) return;
    const { isRunning, rpm, reverseGear, explodedProgress } = useEngineStore.getState();
    const yExplode = explodedProgress * 2.5;

    if (isRunning && rpm > 0) {
      const speed = (rpm / 3000) * 15 * (reverseGear ? -1 : 1);
      const time = state.clock.getElapsedTime();
      const phase = (index * Math.PI) / 2;
      const stroke = Math.sin(time * speed + phase) * 0.2;
      pistonRef.current.position.y = restY + stroke + yExplode;
    } else {
      const target = restY + yExplode;
      pistonRef.current.position.y += (target - pistonRef.current.position.y) * 0.05;
    }
  });

  const isClickable = activeTab === 'learning';

  return (
    <group ref={pistonRef} position={[xPos, restY, 0]}
      onClick={isClickable ? (e) => { e.stopPropagation(); onClick?.('piston'); } : undefined}>
      <mesh material={pistonMat} castShadow>
        <cylinderGeometry args={[0.13, 0.13, 0.12, 18]} />
      </mesh>
      {[0.035, 0, -0.035].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} material={ringMat} castShadow>
          <torusGeometry args={[0.13, 0.008, 8, 18]} />
        </mesh>
      ))}
      <mesh position={[0, -0.28, 0]} material={rodMat} castShadow>
        <boxGeometry args={[0.04, 0.4, 0.03]} />
      </mesh>
    </group>
  );
}

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useEngineStore from '../../store/engineStore';

export default function OceanEnvironment() {
  const waterRef = useRef();
  const shipRef = useRef();
  const activeTab = useEngineStore((s) => s.activeTab);

  const waterMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#0a3d6b',
    metalness: 0.6,
    roughness: 0.3,
    transparent: true,
    opacity: 0.7,
    side: THREE.DoubleSide,
  }), []);

  const hullMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#2a1a1a',
    metalness: 0.5,
    roughness: 0.6,
  }), []);

  useFrame((state) => {
    if (!waterRef.current || activeTab !== 'marine') return;
    const time = state.clock.getElapsedTime();

    // Animate water vertices for wave effect
    const pos = waterRef.current.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const y = Math.sin(x * 0.5 + time * 0.8) * 0.15 +
                Math.sin(z * 0.3 + time * 0.5) * 0.1 +
                Math.cos(x * 0.2 + z * 0.3 + time * 0.6) * 0.08;
      pos.setY(i, y);
    }
    pos.needsUpdate = true;

    // Ship bobbing
    if (shipRef.current) {
      shipRef.current.position.y = -1 + Math.sin(time * 0.6) * 0.08;
      shipRef.current.rotation.x = Math.sin(time * 0.4) * 0.02;
      shipRef.current.rotation.z = Math.sin(time * 0.3) * 0.015;
    }
  });

  if (activeTab !== 'marine') return null;

  return (
    <group>
      {/* Water plane */}
      <mesh ref={waterRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[40, 40, 60, 60]} />
        <meshStandardMaterial {...waterMat} />
      </mesh>

      {/* Ship hull */}
      <group ref={shipRef} position={[0, -1, 0]}>
        <mesh material={hullMat} castShadow>
          <boxGeometry args={[2, 0.8, 8]} />
        </mesh>
        {/* Bow */}
        <mesh position={[0, 0, -4.5]} rotation={[0, 0, 0]} material={hullMat} castShadow>
          <coneGeometry args={[1.2, 2, 4, 1, false, Math.PI / 4]} />
        </mesh>
        {/* Deck */}
        <mesh position={[0, 0.5, -1]} castShadow>
          <boxGeometry args={[1.8, 0.1, 6]} />
          <meshStandardMaterial color="#4a3a2a" metalness={0.3} roughness={0.7} />
        </mesh>
        {/* Cabin */}
        <mesh position={[0, 1.1, 1.5]} castShadow>
          <boxGeometry args={[1.2, 0.8, 1.5]} />
          <meshStandardMaterial color="#334455" metalness={0.6} roughness={0.3} />
        </mesh>
      </group>

      {/* Sky dome hint (fog handles most atmosphere) */}
      <mesh position={[0, 10, 0]}>
        <sphereGeometry args={[30, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshBasicMaterial color="#0a1628" side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

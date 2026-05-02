import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useEngineStore from '../../store/engineStore';

export default function GearSystem({ onClick }) {
  const gear1Ref = useRef();
  const gear2Ref = useRef();
  const groupRef = useRef();
  const activeTab = useEngineStore((s) => s.activeTab);
  const gearWear = useEngineStore((s) => s.failures.gearWear);

  const gearMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: gearWear ? '#887744' : '#778899',
    metalness: 0.9, roughness: gearWear ? 0.4 : 0.15,
  }), [gearWear]);

  const housingMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#2a3545', metalness: 0.75, roughness: 0.3,
  }), []);

  const housingTransMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#334455', metalness: 0.7, roughness: 0.3,
    transparent: true, opacity: 0.4,
  }), []);

  useFrame((_, delta) => {
    const { isRunning, rpm, reverseGear, explodedProgress } = useEngineStore.getState();
    if (groupRef.current) {
      groupRef.current.position.z = -0.75 + explodedProgress * -2.0;
    }
    if (!gear1Ref.current || !gear2Ref.current) return;
    if (isRunning && rpm > 0) {
      const speed = (rpm / 3000) * 12 * (reverseGear ? -1 : 1);
      // Gears spin around Y (their cylinder axis) - NOT Z!
      gear1Ref.current.rotation.y += speed * delta;
      gear2Ref.current.rotation.y -= speed * delta * 0.6;
    }
  });

  const isClickable = activeTab === 'learning';

  return (
    <group ref={groupRef} position={[0, -0.2, -0.75]}
      onClick={isClickable ? (e) => { e.stopPropagation(); onClick?.('gearSystem'); } : undefined}>
      {/* Front plate - flush with engine block rear at Z=-0.5 */}
      <mesh position={[0, 0, 0.2]} material={housingMat} castShadow>
        <boxGeometry args={[0.7, 0.7, 0.06]} />
      </mesh>
      <mesh material={housingTransMat} castShadow>
        <boxGeometry args={[0.65, 0.65, 0.4]} />
      </mesh>
      <mesh position={[0, 0, -0.2]} material={housingMat} castShadow>
        <boxGeometry args={[0.6, 0.6, 0.04]} />
      </mesh>
      {/* Input gear */}
      <group ref={gear1Ref} position={[0, 0.08, 0]}>
        <mesh material={gearMat} castShadow>
          <cylinderGeometry args={[0.18, 0.18, 0.1, 24]} />
        </mesh>
        {Array.from({ length: 14 }).map((_, i) => {
          const a = (i / 14) * Math.PI * 2;
          return (<mesh key={i} position={[Math.cos(a) * 0.2, 0, Math.sin(a) * 0.2]}
            rotation={[0, -a, 0]} material={gearMat} castShadow>
            <boxGeometry args={[0.035, 0.1, 0.025]} />
          </mesh>);
        })}
      </group>
      {/* Output gear */}
      <group ref={gear2Ref} position={[0, -0.14, 0]}>
        <mesh material={gearMat} castShadow>
          <cylinderGeometry args={[0.11, 0.11, 0.1, 18]} />
        </mesh>
        {Array.from({ length: 10 }).map((_, i) => {
          const a = (i / 10) * Math.PI * 2;
          return (<mesh key={i} position={[Math.cos(a) * 0.125, 0, Math.sin(a) * 0.125]}
            rotation={[0, -a, 0]} material={gearMat} castShadow>
            <boxGeometry args={[0.03, 0.1, 0.02]} />
          </mesh>);
        })}
      </group>
    </group>
  );
}

import React, { useRef, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import useEngineStore from '../../store/engineStore';
import EngineBlock from './EngineBlock';
import Crankshaft from './Crankshaft';
import Piston from './Piston';
import DriveShaft from './DriveShaft';
import GearSystem from './GearSystem';
import Propeller from './Propeller';
import Bearings from './Bearings';
import PartLabel from './PartLabel';

export default function EngineModel() {
  const setSelectedPart = useEngineStore((s) => s.setSelectedPart);

  const handlePartClick = useCallback((partName) => {
    setSelectedPart(partName);
  }, [setSelectedPart]);

  return (
    <group>
      <EngineBlock onClick={handlePartClick} />
      <Crankshaft onClick={handlePartClick} />
      {[0, 1, 2, 3].map((i) => (
        <Piston key={i} index={i} onClick={handlePartClick} />
      ))}
      <Bearings onClick={handlePartClick} />
      <GearSystem onClick={handlePartClick} />
      <DriveShaft onClick={handlePartClick} />
      <Propeller onClick={handlePartClick} />
      <PartLabel />

      {/* Oil leak particles */}
      <OilLeakEffect />
    </group>
  );
}

function OilLeakEffect() {
  const groupRef = useRef();
  const particles = React.useMemo(() =>
    Array.from({ length: 15 }).map(() => ({
      x: (Math.random() - 0.5) * 0.4,
      z: (Math.random() - 0.5) * 0.3,
      speed: 0.3 + Math.random() * 0.5,
      offset: Math.random() * 1.0,
    })), []);

  useFrame(() => {
    if (!groupRef.current) return;
    const { failures } = useEngineStore.getState();
    // Only show particles when oil leak is active
    groupRef.current.visible = failures.oilLeak;

    if (failures.oilLeak) {
      groupRef.current.children.forEach((child, i) => {
        const p = particles[i];
        child.position.y -= p.speed * 0.016;
        if (child.position.y < -1.2) {
          child.position.y = -0.6;
        }
      });
    }
  });

  return (
    <group ref={groupRef} position={[0.2, 0, 0.3]} visible={false}>
      {particles.map((p, i) => (
        <mesh key={i} position={[p.x, -0.6 - p.offset * 0.3, p.z]}>
          <sphereGeometry args={[0.012, 6, 6]} />
          <meshStandardMaterial color="#1a1000" metalness={0.3} roughness={0.8} transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  );
}

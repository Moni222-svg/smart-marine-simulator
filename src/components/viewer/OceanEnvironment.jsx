import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useEngineStore from '../../store/engineStore';

export default function OceanEnvironment() {
  const waterRef = useRef();
  const shipRef = useRef();
  const radarRef = useRef();
  const activeTab = useEngineStore((s) => s.activeTab);


  useFrame((state) => {
    if (!waterRef.current || activeTab !== 'marine') return;
    const time = state.clock.getElapsedTime();

    // Prominent, highly visible water movement
    const pos = waterRef.current.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const yLocal = pos.getY(i); // Local Y corresponds to World Z
      
      const waveHeight = Math.sin(x * 0.4 + time * 1.5) * 0.2 +
                         Math.sin(yLocal * 0.3 + time * 1.2) * 0.15 +
                         Math.cos(x * 0.2 + yLocal * 0.3 + time * 0.8) * 0.1;
      
      pos.setZ(i, waveHeight);
    }
    pos.needsUpdate = true;
    waterRef.current.geometry.computeVertexNormals();

    if (radarRef.current) {
      radarRef.current.rotation.y -= 0.04;
    }
  });

  // Realistic Solid Materials
  const hullExteriorMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#1a2433', // Dark navy
    metalness: 0.3,
    roughness: 0.7,
  }), []);

  const cutawayFaceMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#ffaa00', // Warning yellow-orange for the cutaway slice edge
    emissive: '#ffaa00',
    emissiveIntensity: 1.2,
    metalness: 0.1,
    roughness: 0.5,
  }), []);

  const interiorMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#e0e5eb', // Industrial light grey
    metalness: 0.2,
    roughness: 0.9,
  }), []);

  const windowMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#00aaff',
    emissive: '#00aaff',
    emissiveIntensity: 1.5,
    metalness: 0.9,
    roughness: 0.1,
  }), []);

  // Extremely realistic water material
  const waterMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#0055aa',
    transmission: 0.9,
    opacity: 1,
    transparent: true,
    metalness: 0.2,
    roughness: 0.1,
    ior: 1.33,
    thickness: 2.0,
    side: THREE.DoubleSide,
  }), []);

  // Engine Room Cutaway Shape (Aft section, Z: -2.1 to 2.0)
  const cutawayShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(3.0, -0.4);
    s.quadraticCurveTo(3.0, -1.2, 1.5, -1.2); // starboard bilge
    s.lineTo(-1.5, -1.2); // keel
    s.quadraticCurveTo(-3.0, -1.2, -3.0, -0.4); // port bilge
    s.lineTo(-3.0, 2.0); // port wall
    s.lineTo(-1.5, 2.0); // deck port
    s.lineTo(-1.5, -0.8); // inner port wall
    s.lineTo(2.0, -0.8); // inner floor
    s.lineTo(3.0, -0.4); // close right side
    return s;
  }, []);

  const cutawayExtrude = useMemo(() => ({
    steps: 1,
    depth: 4.1, // length: 4.1
    bevelEnabled: true,
    bevelSegments: 2,
    bevelSize: 0.05,
    bevelThickness: 0.05,
  }), []);

  // Solid Midship Shape (Cargo Holds, Z: 2.0 to 8.0)
  const solidShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(3.0, 2.0);
    s.lineTo(-3.0, 2.0);
    s.lineTo(-3.0, -0.4);
    s.quadraticCurveTo(-3.0, -1.2, -1.5, -1.2);
    s.lineTo(1.5, -1.2);
    s.quadraticCurveTo(3.0, -1.2, 3.0, -0.4);
    s.lineTo(3.0, 2.0);
    return s;
  }, []);

  const solidExtrude = useMemo(() => ({
    steps: 1,
    depth: 6.0, // length: 6.0
    bevelEnabled: true,
    bevelSegments: 2,
    bevelSize: 0.05,
    bevelThickness: 0.05,
  }), []);

  // Solid Bow Shape (Forward section, Z: 8.0 to 13.0)
  const bowShapeTopDown = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-3.0, -8.0); // mapped to Z=8.0
    s.lineTo(3.0, -8.0);
    s.bezierCurveTo(3.0, -10.0, 1.0, -13.0, 0, -13.0); // sleek bow curve to Z=13.0
    s.bezierCurveTo(-1.0, -13.0, -3.0, -10.0, -3.0, -8.0);
    return s;
  }, []);

  const bowExtrude = useMemo(() => ({
    steps: 1,
    depth: 3.2, // Y from -1.2 to 2.0
    bevelEnabled: true,
    bevelSegments: 2,
    bevelSize: 0.05,
    bevelThickness: 0.05,
  }), []);

  if (activeTab !== 'marine') return null;

  return (
    <group>
      {/* Dynamic Water Plane */}
      <mesh ref={waterRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.0, 0]} receiveShadow>
        <planeGeometry args={[100, 100, 60, 60]} />
        <meshPhysicalMaterial {...waterMat} />
      </mesh>
      
      {/* Static Deep Water Base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5.0, 0]}>
        <planeGeometry args={[200, 200]} />
        <meshBasicMaterial color="#020813" />
      </mesh>

      {/* Massive Cargo Ship Assembly */}
      <group position={[0, -0.2, 0]}>
        
        {/* Aft Cutaway (Engine Room) */}
        <mesh position={[0, 0, -2.1]} receiveShadow castShadow>
          <extrudeGeometry args={[cutawayShape, cutawayExtrude]} />
          <meshStandardMaterial attach="material-0" {...cutawayFaceMat} />
          <meshStandardMaterial attach="material-1" {...hullExteriorMat} />
        </mesh>

        {/* Solid Midship (Cargo Holds) */}
        <mesh position={[0, 0, 2.0]} receiveShadow castShadow>
          <extrudeGeometry args={[solidShape, solidExtrude]} />
          <meshStandardMaterial attach="material-0" {...cutawayFaceMat} />
          <meshStandardMaterial attach="material-1" {...hullExteriorMat} />
        </mesh>

        {/* Solid Curved Bow */}
        <mesh position={[0, -1.2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow castShadow>
          <extrudeGeometry args={[bowShapeTopDown, bowExtrude]} />
          <meshStandardMaterial attach="material-0" {...cutawayFaceMat} />
          <meshStandardMaterial attach="material-1" {...hullExteriorMat} />
        </mesh>

        {/* --- Engine Room Interior --- */}
        {/* Floor */}
        <mesh position={[0.25, -0.79, -0.05]} receiveShadow castShadow>
          <boxGeometry args={[3.5, 0.02, 4.1]} />
          <meshStandardMaterial {...interiorMat} />
        </mesh>
        {/* Port Wall */}
        <mesh position={[-1.49, 0.6, -0.05]} receiveShadow castShadow>
          <boxGeometry args={[0.02, 2.8, 4.1]} />
          <meshStandardMaterial {...interiorMat} />
        </mesh>
        {/* Forward Bulkhead (Engine Room Front Wall) */}
        <mesh position={[0.25, 0.6, 1.99]} receiveShadow castShadow>
          <boxGeometry args={[3.5, 2.8, 0.02]} />
          <meshStandardMaterial {...interiorMat} />
        </mesh>
        {/* Aft Bulkhead (Engine Room Back Wall) */}
        <mesh position={[0.25, 0.6, -2.09]} receiveShadow castShadow>
          <boxGeometry args={[3.5, 2.8, 0.02]} />
          <meshStandardMaterial {...interiorMat} />
        </mesh>

        {/* --- Superstructure (Forward of Engine Room) --- */}
        <mesh position={[0, 2.5, 5.0]} receiveShadow castShadow>
          <boxGeometry args={[4.5, 1.0, 4.0]} />
          <meshStandardMaterial {...interiorMat} />
        </mesh>
        
        {/* Captain's Bridge */}
        <mesh position={[0, 3.5, 4.5]} rotation={[0, Math.PI / 4, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[2.0, 2.4, 1.0, 4]} />
          <meshStandardMaterial {...interiorMat} />
        </mesh>

        {/* Glowing Bridge Windows */}
        <mesh position={[0, 3.5, 4.5]} rotation={[0, Math.PI / 4, 0]}>
          <cylinderGeometry args={[2.02, 2.42, 0.6, 4]} />
          <meshStandardMaterial {...windowMat} />
        </mesh>

        {/* Spinning Radar Mast */}
        <mesh position={[0, 4.2, 4.0]} receiveShadow castShadow>
          <cylinderGeometry args={[0.08, 0.1, 1.0, 8]} />
          <meshStandardMaterial color="#8899aa" />
        </mesh>
        <mesh ref={radarRef} position={[0, 4.7, 4.0]} castShadow>
          <boxGeometry args={[1.2, 0.1, 0.2]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>

        {/* Massive Funnel (Chimney) Swept back */}
        <mesh position={[0, 4.5, 6.0]} rotation={[-0.1, 0, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[0.4, 0.6, 3.0, 16]} />
          <meshStandardMaterial color="#b33939" metalness={0.2} roughness={0.7} />
        </mesh>

        {/* --- Engine Mounts --- */}
        <mesh position={[0, -0.65, 0]} receiveShadow castShadow>
          <boxGeometry args={[1.4, 0.3, 2.2]} />
          <meshStandardMaterial color="#334455" metalness={0.5} roughness={0.5} />
        </mesh>
        
        <mesh position={[0, -0.65, -0.75]} receiveShadow castShadow>
          <boxGeometry args={[0.9, 0.3, 1.0]} />
          <meshStandardMaterial color="#334455" metalness={0.5} roughness={0.5} />
        </mesh>

      </group>

      {/* Deep Sea Base */}
      <mesh position={[0, -5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[200, 200]} />
        <meshBasicMaterial color="#020813" />
      </mesh>
    </group>
  );
}

import React, { Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Grid, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import EngineModel from './EngineModel';
import OceanEnvironment from './OceanEnvironment';
import useEngineStore from '../../store/engineStore';

function PhysicsLoop() {
  const tick = useEngineStore((s) => s.tick);
  useFrame(() => { tick(); });
  return null;
}

function SceneLighting() {
  const activeTab = useEngineStore((s) => s.activeTab);
  return (
    <>
      <ambientLight intensity={0.35} color="#4488cc" />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.2}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <pointLight position={[-3, 3, -3]} intensity={0.5} color="#0088ff" />
      <pointLight position={[3, -1, 2]} intensity={0.3} color="#00ffaa" />
      <pointLight position={[0, 2, -2]} intensity={0.4} color="#88aaff" />
      {activeTab === 'marine' && (
        <pointLight position={[0, 5, 0]} intensity={0.4} color="#88aacc" />
      )}
      <spotLight
        position={[0, 6, 0]}
        angle={0.5}
        penumbra={0.5}
        intensity={0.5}
        color="#aaccff"
        castShadow
      />
    </>
  );
}

export default function EngineScene() {
  const activeTab = useEngineStore((s) => s.activeTab);

  return (
    <div className="w-full h-full canvas-container relative">
      <Canvas
        shadows
        camera={{ position: [20.0, 4.0, 4.0], fov: 45, near: 0.1, far: 150 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false }}
        style={{ background: '#050810' }}
      >
        <Suspense fallback={null}>
          <PhysicsLoop />
          <SceneLighting />

          <fog attach="fog" args={['#050810', 15, 60]} />

          <EngineModel />
          <OceanEnvironment />

          {activeTab !== 'marine' && (
            <Grid
              position={[0, -1.0, 0]}
              args={[20, 20]}
              cellSize={0.5}
              cellThickness={0.5}
              cellColor="#1a2236"
              sectionSize={2}
              sectionThickness={1}
              sectionColor="#243049"
              fadeDistance={15}
              fadeStrength={1}
              infiniteGrid
            />
          )}

          {activeTab === 'marine' && <Stars radius={50} depth={30} count={2000} factor={3} />}

          <Environment preset="city" background={false} />
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={2}
            maxDistance={50}
            target={[0, 0, 0]}
            autoRotate={false}
          />
          
          <EffectComposer disableNormalPass>
            <Bloom luminanceThreshold={0.5} mipmapBlur intensity={1.5} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
          </EffectComposer>
        </Suspense>
      </Canvas>

      {/* Overlay info */}
      <div className="absolute top-3 left-3 pointer-events-none">
        <div className="glass-panel-light px-3 py-1.5 text-xs text-metallic-light">
          <span className="text-accent-cyan font-mono">◉</span> Drag to rotate • Scroll to zoom • Right-click to pan
        </div>
      </div>
    </div>
  );
}

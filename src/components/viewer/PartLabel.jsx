import React from 'react';
import { Html } from '@react-three/drei';
import useEngineStore from '../../store/engineStore';
import partInfo from '../../data/partInfo';

export default function PartLabel() {
  const { selectedPart, activeTab } = useEngineStore();

  if (activeTab !== 'learning' || !selectedPart || !partInfo[selectedPart]) return null;

  const info = partInfo[selectedPart];

  return (
    <Html position={[2, 2, 0]} center distanceFactor={8}>
      <div className="w-72 glass-panel p-4 pointer-events-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
          <h3 className="text-accent-cyan font-display text-sm font-bold tracking-wide">
            {info.name}
          </h3>
        </div>
        <div className="space-y-2 text-xs">
          <div>
            <span className="text-metallic-light font-semibold">Function:</span>
            <p className="text-metallic mt-0.5 leading-relaxed">{info.function}</p>
          </div>
          <div>
            <span className="text-metallic-light font-semibold">Material:</span>
            <p className="text-metallic mt-0.5 leading-relaxed">{info.material}</p>
          </div>
          <div>
            <span className="text-metallic-light font-semibold">Maintenance:</span>
            <ul className="mt-0.5 space-y-0.5">
              {info.maintenance.map((tip, i) => (
                <li key={i} className="text-metallic flex items-start gap-1">
                  <span className="text-accent-cyan mt-0.5">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Html>
  );
}

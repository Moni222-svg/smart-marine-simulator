import React from 'react';
import { motion } from 'framer-motion';
import useEngineStore from '../../store/engineStore';

export default function ExplodedView() {
  const { activeTab, explodedProgress } = useEngineStore();

  if (activeTab !== 'exploded') return null;

  return (
    <motion.div
      className="glass-panel p-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1.5 h-1.5 rounded-full bg-accent-purple" />
        <h2 className="text-xs font-display font-bold tracking-widest text-metallic-light">EXPLODED VIEW</h2>
      </div>
      <p className="text-[10px] text-metallic mb-3">
        Components are automatically separated for inspection. Rotate the view to inspect each part from all angles.
      </p>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-metallic">Separation progress</span>
          <span className="text-accent-purple font-mono">{Math.round(explodedProgress * 100)}%</span>
        </div>
        <div className="h-1.5 bg-navy-700 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-200"
            style={{
              width: `${explodedProgress * 100}%`,
              background: 'linear-gradient(90deg, #a855f7, #00f0ff)',
              boxShadow: '0 0 8px rgba(168, 85, 247, 0.5)',
            }}
          />
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-1.5 text-[10px]">
        {['Engine Block', 'Crankshaft', 'Pistons (x4)', 'Drive Shaft', 'Gearbox', 'Propeller', 'Bearings'].map((part) => (
          <div key={part} className="flex items-center gap-1.5 text-metallic">
            <div className="w-1 h-1 rounded-full bg-accent-cyan" />
            {part}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

import React from 'react';
import { motion } from 'framer-motion';
import useEngineStore from '../../store/engineStore';

export default function LearningMode() {
  const { activeTab, selectedPart } = useEngineStore();

  if (activeTab !== 'learning') return null;

  return (
    <motion.div
      className="glass-panel p-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1.5 h-1.5 rounded-full bg-accent-green" />
        <h2 className="text-xs font-display font-bold tracking-widest text-metallic-light">LEARNING MODE</h2>
      </div>
      <p className="text-[10px] text-metallic mb-3">
        Click any engine component in the 3D view to learn about its function, material, and maintenance requirements.
      </p>
      <div className="glass-panel-light p-3 rounded-lg">
        {selectedPart ? (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
            <span className="text-xs text-accent-cyan font-semibold">
              Viewing: {selectedPart.replace(/([A-Z])/g, ' $1').trim()}
            </span>
          </div>
        ) : (
          <div className="text-center py-2">
            <p className="text-xs text-metallic-light">👆 Click a part to inspect</p>
            <p className="text-[10px] text-metallic mt-1">Available: Block, Crankshaft, Pistons, Shaft, Gears, Propeller, Bearings</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

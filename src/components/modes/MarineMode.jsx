import React from 'react';
import { motion } from 'framer-motion';
import useEngineStore from '../../store/engineStore';

export default function MarineMode() {
  const { activeTab, shipSpeed, thrustForce } = useEngineStore();

  if (activeTab !== 'marine') return null;

  const resistance = 0.02 * shipSpeed * shipSpeed;

  return (
    <motion.div
      className="glass-panel p-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
        <h2 className="text-xs font-display font-bold tracking-widest text-metallic-light">MARINE ENVIRONMENT</h2>
      </div>
      <p className="text-[10px] text-metallic mb-3">
        Engine mounted in ship hull with ocean simulation. Observe real-time thrust vs. water resistance dynamics.
      </p>
      <div className="space-y-2">
        <div className="flex items-center justify-between glass-panel-light p-2 rounded-lg">
          <span className="text-[10px] text-metallic">Ship Speed</span>
          <span className="font-display text-sm font-bold text-accent-cyan">{shipSpeed.toFixed(1)} <span className="text-[9px] text-metallic">kn</span></span>
        </div>
        <div className="flex items-center justify-between glass-panel-light p-2 rounded-lg">
          <span className="text-[10px] text-metallic">Thrust Force</span>
          <span className="font-display text-sm font-bold text-accent-green">{thrustForce.toFixed(1)} <span className="text-[9px] text-metallic">kN</span></span>
        </div>
        <div className="flex items-center justify-between glass-panel-light p-2 rounded-lg">
          <span className="text-[10px] text-metallic">Water Resistance</span>
          <span className="font-display text-sm font-bold text-accent-orange">{resistance.toFixed(1)} <span className="text-[9px] text-metallic">kN</span></span>
        </div>
      </div>
    </motion.div>
  );
}

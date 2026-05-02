import React from 'react';
import { motion } from 'framer-motion';
import useEngineStore from '../../store/engineStore';

export default function FailureSimulation() {
  const { failures, toggleFailure, activeTab } = useEngineStore();

  if (activeTab !== 'failure') return null;

  const failureTypes = [
    { key: 'oilLeak', label: 'Oil Leakage', icon: '💧', desc: 'Simulates oil system leak — reduces oil pressure' },
    { key: 'overheating', label: 'Overheating', icon: '🔥', desc: 'Disables cooling — temperature rises rapidly' },
    { key: 'shaftMisalignment', label: 'Shaft Misalignment', icon: '↗', desc: 'Causes vibration and efficiency loss' },
    { key: 'propellerDamage', label: 'Propeller Damage', icon: '⚙', desc: 'Blade damage — reduces thrust efficiency' },
    { key: 'gearWear', label: 'Gear Wear', icon: '⚠', desc: 'Worn gears — increases noise and friction' },
  ];

  return (
    <motion.div
      className="glass-panel p-4 space-y-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-2 mb-1">
        <div className="w-1.5 h-1.5 rounded-full bg-accent-red" />
        <h2 className="text-xs font-display font-bold tracking-widest text-metallic-light">FAILURE SIMULATION</h2>
      </div>
      <p className="text-[10px] text-metallic">Activate failure modes to observe engine behavior under fault conditions.</p>
      <div className="space-y-2">
        {failureTypes.map((f) => (
          <motion.button
            key={f.key}
            onClick={() => toggleFailure(f.key)}
            className={`w-full flex items-center gap-3 p-2.5 rounded-lg border transition-all duration-300 text-left
              ${failures[f.key]
                ? 'border-accent-red/40 bg-red-500/10'
                : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04]'
              }`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <span className="text-lg">{f.icon}</span>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold ${failures[f.key] ? 'text-accent-red' : 'text-metallic-light'}`}>
                  {f.label}
                </span>
                {failures[f.key] && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-500/20 text-accent-red font-mono animate-pulse">
                    ACTIVE
                  </span>
                )}
              </div>
              <p className="text-[10px] text-metallic mt-0.5">{f.desc}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

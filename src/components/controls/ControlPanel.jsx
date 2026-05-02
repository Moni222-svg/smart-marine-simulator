import React from 'react';
import { motion } from 'framer-motion';
import useEngineStore from '../../store/engineStore';
import RPMSlider from './RPMSlider';
import ToggleSwitch from './ToggleSwitch';

export default function ControlPanel() {
  const {
    isRunning, startEngine, stopEngine, emergencyStopEngine, resetEmergencyStop,
    targetRpm, setTargetRpm, loadPercent, setLoadPercent,
    reverseGear, toggleReverse, emergencyStop,
  } = useEngineStore();

  return (
    <motion.div
      className="glass-panel p-4 space-y-4"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center gap-2 mb-1">
        <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />
        <h2 className="text-xs font-display font-bold tracking-widest text-metallic-light">ENGINE CONTROLS</h2>
      </div>

      {/* Start / Stop buttons */}
      <div className="flex gap-2">
        <motion.button
          onClick={isRunning ? stopEngine : startEngine}
          disabled={emergencyStop}
          className={`flex-1 py-2.5 rounded-lg font-display text-xs font-bold tracking-wider transition-all duration-300
            ${emergencyStop ? 'opacity-40 cursor-not-allowed bg-navy-700 text-metallic-dark' :
              isRunning
                ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-[0_0_15px_rgba(255,51,85,0.3)] hover:shadow-[0_0_25px_rgba(255,51,85,0.5)]'
                : 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-[0_0_15px_rgba(0,255,136,0.3)] hover:shadow-[0_0_25px_rgba(0,255,136,0.5)]'
            }`}
          whileHover={!emergencyStop ? { scale: 1.02 } : {}}
          whileTap={!emergencyStop ? { scale: 0.98 } : {}}
        >
          {isRunning ? '■ STOP ENGINE' : '▶ START ENGINE'}
        </motion.button>
      </div>

      {/* RPM Slider */}
      <RPMSlider
        value={targetRpm}
        onChange={setTargetRpm}
        disabled={!isRunning || emergencyStop}
      />

      {/* Load Slider */}
      <RPMSlider
        value={loadPercent}
        onChange={setLoadPercent}
        disabled={emergencyStop}
        min={0}
        max={100}
        label="LOAD"
      />

      {/* Reverse Gear */}
      <ToggleSwitch
        label="REVERSE GEAR"
        value={reverseGear}
        onChange={toggleReverse}
        disabled={!isRunning || emergencyStop}
      />

      {/* Emergency Stop */}
      <div className="pt-2 border-t border-white/5">
        {!emergencyStop ? (
          <motion.button
            onClick={emergencyStopEngine}
            className="w-full py-3 rounded-lg font-display text-xs font-bold tracking-widest btn-danger relative overflow-hidden"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">⚠ EMERGENCY STOP</span>
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/0 via-red-400/20 to-red-600/0 animate-scan-line" />
          </motion.button>
        ) : (
          <motion.button
            onClick={resetEmergencyStop}
            className="w-full py-3 rounded-lg font-display text-xs font-bold tracking-widest bg-navy-600 text-accent-orange border border-accent-orange/30 hover:bg-navy-500 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            animate={{ borderColor: ['rgba(255,107,53,0.3)', 'rgba(255,107,53,0.6)', 'rgba(255,107,53,0.3)'] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ↻ RESET EMERGENCY STOP
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

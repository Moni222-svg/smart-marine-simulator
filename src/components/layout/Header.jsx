import React from 'react';
import { motion } from 'framer-motion';
import useEngineStore from '../../store/engineStore';

const tabs = [
  { id: 'normal', label: 'Normal View', icon: '◎' },
  { id: 'exploded', label: 'Exploded', icon: '✦' },
  { id: 'learning', label: 'Learning', icon: '◈' },
  { id: 'failure', label: 'Failure Sim', icon: '⚠' },
  { id: 'marine', label: 'Marine', icon: '⚓' },
];

export default function Header() {
  const { activeTab, setActiveTab, isRunning, rpm, engineHealth } = useEngineStore();

  return (
    <header className="glass-panel border-b border-white/10 px-5 py-2.5 flex items-center justify-between relative z-10">
      {/* Left — Logo & Title */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-8 h-8 flex items-center justify-center">
            <svg viewBox="0 0 32 32" className="w-7 h-7">
              <circle cx="16" cy="16" r="12" fill="none" stroke="#00f0ff" strokeWidth="1.5" opacity="0.7" />
              <circle cx="16" cy="16" r="4" fill="#00f0ff" opacity="0.9" />
              {[0, 60, 120, 180, 240, 300].map((d) => (
                <rect key={d} x="15" y="2" width="2" height="5" rx="1" fill="#00f0ff" opacity="0.6"
                  transform={`rotate(${d} 16 16)`} />
              ))}
            </svg>
          </div>
          {isRunning && (
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-accent-green animate-pulse" />
          )}
        </div>
        <div>
          <h1 className="font-display text-sm font-bold tracking-widest gradient-text leading-tight">
            SMART 3D ENGINE SIM
          </h1>
          <p className="text-[10px] text-metallic tracking-wider font-mono">
            MARITIME PROPULSION SYSTEM
          </p>
        </div>
      </div>

      {/* Center — Navigation Tabs */}
      <nav className="flex items-center gap-1">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 relative
              ${activeTab === tab.id
                ? 'text-accent-cyan tab-active'
                : 'text-metallic hover:text-metallic-light hover:bg-white/5'
              }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="mr-1.5">{tab.icon}</span>
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 rounded-lg glow-border"
                style={{ background: 'rgba(0, 240, 255, 0.05)' }}
                transition={{ type: 'spring', duration: 0.4 }}
              />
            )}
          </motion.button>
        ))}
      </nav>

      {/* Right — Status indicators */}
      <div className="flex items-center gap-4 text-xs font-mono">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-accent-green animate-pulse' : 'bg-metallic-dark'}`} />
          <span className="text-metallic">{isRunning ? 'RUNNING' : 'IDLE'}</span>
        </div>
        <div className="text-metallic">
          <span className="text-metallic-light">RPM</span>{' '}
          <span className="metric-value text-xs">{Math.round(rpm)}</span>
        </div>
        <div className="text-metallic">
          <span className="text-metallic-light">HEALTH</span>{' '}
          <span className={`font-bold ${engineHealth > 60 ? 'text-accent-green' : engineHealth > 30 ? 'text-accent-orange' : 'text-accent-red'}`}>
            {engineHealth.toFixed(0)}%
          </span>
        </div>
      </div>
    </header>
  );
}

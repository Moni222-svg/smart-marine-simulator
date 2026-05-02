import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useEngineStore from '../../store/engineStore';

export default function LoadingScreen() {
  const { isLoading, setLoading } = useEngineStore();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 400);
          return 100;
        }
        return p + Math.random() * 8 + 2;
      });
    }, 80);
    return () => clearInterval(interval);
  }, [setLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #050810 0%, #0a1628 50%, #050810 100%)' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Scan lines overlay */}
          <div className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,240,255,0.03) 2px, rgba(0,240,255,0.03) 4px)',
            }}
          />

          {/* Logo */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="mb-8 text-center"
          >
            <div className="relative">
              {/* Engine icon */}
              <div className="w-20 h-20 mx-auto mb-4 relative">
                <svg viewBox="0 0 80 80" className="w-full h-full">
                  <circle cx="40" cy="40" r="35" fill="none" stroke="url(#grad)" strokeWidth="2" opacity="0.5" />
                  <circle cx="40" cy="40" r="28" fill="none" stroke="#00f0ff" strokeWidth="1" strokeDasharray="4 4">
                    <animateTransform attributeName="transform" type="rotate" from="0 40 40" to="360 40 40" dur="8s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="40" cy="40" r="8" fill="#00f0ff" opacity="0.8">
                    <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
                  </circle>
                  {/* Gear teeth */}
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                    <rect
                      key={deg}
                      x="38" y="5" width="4" height="10" rx="1"
                      fill="#00f0ff" opacity="0.6"
                      transform={`rotate(${deg} 40 40)`}
                    />
                  ))}
                  <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00f0ff" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <h1 className="font-display text-2xl font-bold tracking-widest gradient-text">
                SMART 3D
              </h1>
              <p className="font-display text-sm tracking-[0.3em] text-metallic-light mt-1">
                MARINE ENGINE SIMULATOR
              </p>
            </div>
          </motion.div>

          {/* Progress bar */}
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="relative"
          >
            <div className="w-[280px] h-1 bg-navy-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  width: `${Math.min(progress, 100)}%`,
                  background: 'linear-gradient(90deg, #00f0ff, #a855f7)',
                  boxShadow: '0 0 10px rgba(0, 240, 255, 0.5)',
                }}
              />
            </div>
            <p className="text-center text-xs font-mono text-metallic mt-3 tracking-wider">
              {progress < 30 ? 'Initializing systems...' :
               progress < 60 ? 'Loading engine components...' :
               progress < 85 ? 'Calibrating sensors...' :
               'Systems ready'}
              <span className="text-accent-cyan ml-2">{Math.min(Math.round(progress), 100)}%</span>
            </p>
          </motion.div>

          {/* Bottom text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 1 }}
            className="absolute bottom-6 text-xs font-mono text-metallic tracking-wider"
          >
            MARITIME PROPULSION ENGINEERING v3.0
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

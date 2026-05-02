import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import useEngineStore from '../../store/engineStore';
import AlertCard from './AlertCard';

export default function AIAlertPanel() {
  const alerts = useEngineStore((s) => s.alerts);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [alerts]);

  const criticalCount = alerts.filter((a) => a.severity === 'critical').length;
  const warningCount = alerts.filter((a) => a.severity === 'warning').length;

  return (
    <motion.div
      className="glass-panel p-4 flex flex-col"
      style={{ maxHeight: '250px' }}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">AI</span>
          </div>
          <h2 className="text-xs font-display font-bold tracking-widest text-metallic-light">PREDICTIVE MAINTENANCE</h2>
        </div>
        <div className="flex gap-2 text-[10px] font-mono">
          {criticalCount > 0 && (
            <span className="text-accent-red animate-pulse">● {criticalCount} CRIT</span>
          )}
          {warningCount > 0 && (
            <span className="text-accent-orange">● {warningCount} WARN</span>
          )}
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-2 pr-1">
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="w-8 h-8 rounded-full bg-accent-green/10 flex items-center justify-center mb-2">
              <span className="text-accent-green text-sm">✓</span>
            </div>
            <p className="text-xs text-metallic">All systems nominal</p>
            <p className="text-[10px] text-metallic-dark mt-0.5">AI monitoring active</p>
          </div>
        ) : (
          alerts.slice(-8).map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))
        )}
      </div>
    </motion.div>
  );
}

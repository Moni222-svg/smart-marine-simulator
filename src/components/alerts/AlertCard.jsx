import React from 'react';
import { motion } from 'framer-motion';

export default function AlertCard({ alert }) {
  const getSeverityStyles = () => {
    switch (alert.severity) {
      case 'critical':
        return { border: 'border-accent-red/30', bg: 'bg-red-500/5', icon: '🔴', color: 'text-accent-red' };
      case 'warning':
        return { border: 'border-accent-orange/30', bg: 'bg-orange-500/5', icon: '🟠', color: 'text-accent-orange' };
      default:
        return { border: 'border-accent-cyan/20', bg: 'bg-cyan-500/5', icon: '🔵', color: 'text-accent-cyan' };
    }
  };

  const styles = getSeverityStyles();
  const time = new Date(alert.timestamp).toLocaleTimeString('en-US', { hour12: false });

  return (
    <motion.div
      initial={{ opacity: 0, x: 20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      className={`p-2.5 rounded-lg border ${styles.border} ${styles.bg} space-y-1`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-xs">{styles.icon}</span>
          <span className={`text-[11px] font-semibold ${styles.color}`}>{alert.title}</span>
        </div>
        <span className="text-[9px] text-metallic-dark font-mono flex-shrink-0">{time}</span>
      </div>
      <p className="text-[10px] text-metallic leading-relaxed">{alert.message}</p>
      {alert.estimatedFailure && (
        <div className={`flex items-center gap-1 text-[10px] ${styles.color}`}>
          <span>⏱</span>
          <span className="font-mono font-bold">Est. failure in {alert.estimatedFailure}h</span>
        </div>
      )}
    </motion.div>
  );
}

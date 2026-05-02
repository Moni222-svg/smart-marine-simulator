import React from 'react';

export default function MetricCard({ label, value, unit, icon, color = '#00f0ff', trend }) {
  return (
    <div className="glass-panel-light p-2.5 rounded-lg">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] text-metallic tracking-wider font-medium">{label}</span>
        {icon && <span className="text-xs" style={{ color }}>{icon}</span>}
      </div>
      <div className="flex items-end gap-1">
        <span className="font-display text-lg font-bold" style={{ color, textShadow: `0 0 8px ${color}40` }}>
          {typeof value === 'number' ? (value < 10 ? value.toFixed(1) : Math.round(value)) : value}
        </span>
        <span className="text-[10px] text-metallic mb-0.5">{unit}</span>
        {trend !== undefined && (
          <span className={`text-[10px] ml-auto ${trend > 0 ? 'text-accent-red' : trend < 0 ? 'text-accent-green' : 'text-metallic-dark'}`}>
            {trend > 0 ? '▲' : trend < 0 ? '▼' : '─'}
          </span>
        )}
      </div>
    </div>
  );
}

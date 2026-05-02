import React from 'react';

export default function LinearGauge({ value, max, label, unit, warningThreshold, criticalThreshold }) {
  const percent = Math.min((value / max) * 100, 100);

  const getColor = () => {
    if (criticalThreshold && value >= criticalThreshold) return '#ff3355';
    if (warningThreshold && value >= warningThreshold) return '#ff6b35';
    return '#00f0ff';
  };

  const color = getColor();

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-metallic font-medium tracking-wider">{label}</span>
        <span className="font-display text-xs font-bold" style={{ color, textShadow: `0 0 6px ${color}40` }}>
          {typeof value === 'number' ? value.toFixed(1) : value}
          <span className="text-[9px] text-metallic ml-0.5">{unit}</span>
        </span>
      </div>
      <div className="h-2 bg-navy-700 rounded-full overflow-hidden relative">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${percent}%`,
            background: `linear-gradient(90deg, ${color}aa, ${color})`,
            boxShadow: `0 0 8px ${color}60`,
          }}
        />
        {/* Warning marker */}
        {warningThreshold && (
          <div
            className="absolute top-0 w-px h-full bg-accent-orange opacity-50"
            style={{ left: `${(warningThreshold / max) * 100}%` }}
          />
        )}
        {criticalThreshold && (
          <div
            className="absolute top-0 w-px h-full bg-accent-red opacity-50"
            style={{ left: `${(criticalThreshold / max) * 100}%` }}
          />
        )}
      </div>
    </div>
  );
}

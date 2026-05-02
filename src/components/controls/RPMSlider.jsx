import React from 'react';

export default function RPMSlider({ value, onChange, disabled, min = 0, max = 3000, label = 'RPM' }) {
  const percent = ((value - min) / (max - min)) * 100;
  const getColor = () => {
    if (percent > 85) return '#ff3355';
    if (percent > 65) return '#ff6b35';
    if (percent > 40) return '#ffd600';
    return '#00f0ff';
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-metallic-light font-medium">{label}</span>
        <span className="font-display text-sm font-bold" style={{ color: getColor(), textShadow: `0 0 8px ${getColor()}40` }}>
          {Math.round(value)}
          <span className="text-[10px] text-metallic ml-1">{label === 'RPM' ? 'RPM' : '%'}</span>
        </span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          className={`w-full ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
          style={{
            background: `linear-gradient(90deg, ${getColor()} ${percent}%, rgba(0,240,255,0.1) ${percent}%)`,
          }}
        />
        {/* Tick marks */}
        <div className="flex justify-between px-0.5 mt-1">
          {[0, 25, 50, 75, 100].map((p) => (
            <div key={p} className="flex flex-col items-center">
              <div className="w-px h-1.5 bg-metallic-dark" />
              <span className="text-[8px] text-metallic-dark mt-0.5">
                {Math.round(min + (max - min) * (p / 100))}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

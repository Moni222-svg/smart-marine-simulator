import React from 'react';

export default function RadialGauge({ value, max, label, unit, warningThreshold, criticalThreshold, size = 120 }) {
  const percent = Math.min(value / max, 1);
  const r = (size - 20) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const startAngle = -225;
  const endAngle = 45;
  const totalAngle = endAngle - startAngle;
  const currentAngle = startAngle + totalAngle * percent;

  const getColor = () => {
    if (criticalThreshold && value >= criticalThreshold) return '#ff3355';
    if (warningThreshold && value >= warningThreshold) return '#ff6b35';
    return '#00f0ff';
  };

  const color = getColor();

  const polarToCartesian = (angle) => {
    const rad = (angle * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const describeArc = (start, end) => {
    const s = polarToCartesian(start);
    const e = polarToCartesian(end);
    const largeArcFlag = end - start > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${e.x} ${e.y}`;
  };

  // Needle endpoint
  const needleEnd = polarToCartesian(currentAngle);

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background arc */}
        <path d={describeArc(startAngle, endAngle)} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" strokeLinecap="round" />
        {/* Value arc */}
        {percent > 0.01 && (
          <path d={describeArc(startAngle, currentAngle)} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 4px ${color}80)` }} />
        )}
        {/* Tick marks */}
        {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
          const a = startAngle + totalAngle * p;
          const outer = polarToCartesian(a);
          const innerR = r - 8;
          const rad = (a * Math.PI) / 180;
          const inner = { x: cx + innerR * Math.cos(rad), y: cy + innerR * Math.sin(rad) };
          return (
            <line key={i} x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          );
        })}
        {/* Needle */}
        <line x1={cx} y1={cy} x2={needleEnd.x} y2={needleEnd.y} stroke={color} strokeWidth="2" strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 3px ${color})` }} />
        {/* Center dot */}
        <circle cx={cx} cy={cy} r="3" fill={color} />
        {/* Value text */}
        <text x={cx} y={cy + 14} textAnchor="middle" fill={color} fontSize="16" fontFamily="Orbitron" fontWeight="700">
          {typeof value === 'number' ? (value < 10 ? value.toFixed(1) : Math.round(value)) : value}
        </text>
        <text x={cx} y={cy + 25} textAnchor="middle" fill="#8892a8" fontSize="8" fontFamily="Inter">
          {unit}
        </text>
      </svg>
      <span className="text-[10px] text-metallic font-medium tracking-wider mt-0.5">{label}</span>
    </div>
  );
}

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import useEngineStore from '../../store/engineStore';

export default function LiveChart() {
  const history = useEngineStore((s) => s.telemetryHistory);

  const data = history.filter((_, i) => i % 3 === 0).map((h, i) => ({
    t: i,
    rpm: Math.round(h.rpm),
    temp: Math.round(h.temperature),
  }));

  return (
    <div className="glass-panel-light p-3 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-metallic tracking-wider font-medium">RPM & TEMPERATURE HISTORY</span>
        <div className="flex gap-3">
          <div className="flex items-center gap-1">
            <div className="w-2 h-0.5 bg-accent-cyan rounded" />
            <span className="text-[9px] text-metallic">RPM</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-0.5 bg-accent-orange rounded" />
            <span className="text-[9px] text-metallic">TEMP</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={100}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="rpmGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00f0ff" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#00f0ff" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff6b35" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#ff6b35" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="t" hide />
          <YAxis tick={{ fill: '#4a5568', fontSize: 9 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              background: 'rgba(10,14,26,0.95)',
              border: '1px solid rgba(0,240,255,0.2)',
              borderRadius: '8px',
              fontSize: '10px',
              color: '#c0c8d8',
            }}
          />
          <Area type="monotone" dataKey="rpm" stroke="#00f0ff" fill="url(#rpmGrad)" strokeWidth={1.5} dot={false} isAnimationActive={false} />
          <Area type="monotone" dataKey="temp" stroke="#ff6b35" fill="url(#tempGrad)" strokeWidth={1.5} dot={false} isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

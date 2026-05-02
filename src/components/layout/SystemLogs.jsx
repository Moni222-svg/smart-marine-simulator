import React, { useRef, useEffect } from 'react';
import useEngineStore from '../../store/engineStore';

export default function SystemLogs() {
  const logs = useEngineStore((s) => s.logs);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'ENGINE': return 'text-accent-cyan';
      case 'EMERGENCY': return 'text-accent-red';
      case 'CONTROL': return 'text-accent-green';
      case 'FAILURE': return 'text-accent-orange';
      case 'MODE': return 'text-accent-purple';
      case 'AI': return 'text-accent-yellow';
      default: return 'text-metallic';
    }
  };

  return (
    <div className="glass-panel border-t border-white/10 h-full flex flex-col">
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-accent-cyan text-xs">▸</span>
          <span className="text-xs font-mono text-metallic-light tracking-wider">SYSTEM LOG</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
          <span className="text-[10px] font-mono text-metallic">LIVE</span>
        </div>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-1 font-mono text-[11px] space-y-0.5">
        {logs.length === 0 ? (
          <div className="text-metallic opacity-50 py-2">System initialized. Waiting for commands...</div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex gap-2 leading-relaxed animate-fade-in">
              <span className="text-metallic-dark flex-shrink-0">[{log.timestamp}]</span>
              <span className={`flex-shrink-0 ${getCategoryColor(log.category)}`}>[{log.category}]</span>
              <span className="text-metallic-light">{log.message}</span>
            </div>
          ))
        )}
        <div className="text-accent-cyan animate-blink">_</div>
      </div>
    </div>
  );
}

import React from 'react';
import { motion } from 'framer-motion';
import useEngineStore from '../../store/engineStore';
import RadialGauge from './RadialGauge';
import LinearGauge from './LinearGauge';
import MetricCard from './MetricCard';
import LiveChart from './LiveChart';

export default function TelemetryDashboard() {
  const {
    rpm, temperature, oilPressure, fuelConsumption,
    torque, thrustForce, propellerEfficiency, engineHealth,
    shipSpeed, activeTab,
  } = useEngineStore();

  return (
    <motion.div
      className="glass-panel p-4 space-y-3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex items-center gap-2 mb-1">
        <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />
        <h2 className="text-xs font-display font-bold tracking-widest text-metallic-light">TELEMETRY</h2>
      </div>

      {/* Radial gauges */}
      <div className="flex justify-around">
        <RadialGauge value={rpm} max={3000} label="RPM" unit="rev/min" warningThreshold={2200} criticalThreshold={2800} size={100} />
        <RadialGauge value={temperature} max={130} label="TEMP" unit="°C" warningThreshold={95} criticalThreshold={105} size={100} />
      </div>

      {/* Linear gauges */}
      <div className="space-y-2">
        <LinearGauge value={oilPressure} max={6} label="OIL PRESSURE" unit="bar" warningThreshold={2.5} criticalThreshold={1.5} />
        <LinearGauge value={fuelConsumption} max={200} label="FUEL CONSUMPTION" unit="L/h" warningThreshold={140} criticalThreshold={180} />
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 gap-2">
        <MetricCard label="TORQUE" value={torque} unit="N·m" icon="⟳" color="#00f0ff" />
        <MetricCard label="THRUST" value={thrustForce} unit="kN" icon="→" color="#00ff88" />
        <MetricCard label="PROP EFF" value={propellerEfficiency} unit="%" icon="⚙" color="#ffd600" />
        <MetricCard
          label="HEALTH"
          value={engineHealth}
          unit="%"
          icon="♥"
          color={engineHealth > 60 ? '#00ff88' : engineHealth > 30 ? '#ff6b35' : '#ff3355'}
        />
      </div>

      {/* Ship speed (marine mode) */}
      {activeTab === 'marine' && (
        <MetricCard label="SHIP SPEED" value={shipSpeed} unit="knots" icon="⚓" color="#22d3ee" />
      )}

      {/* Live chart */}
      <LiveChart />
    </motion.div>
  );
}

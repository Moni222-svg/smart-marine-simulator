// engineStore.js — Zustand global state + physics simulation loop
import { create } from 'zustand';
import {
  calcTemperature,
  calcOilPressure,
  calcFuelConsumption,
  calcTorque,
  calcThrust,
  calcPropellerEfficiency,
  calcHealthDegradation,
  calcShipSpeed,
} from '../simulation/physics';
import { analyzeEngine } from '../simulation/aiPredictor';

const useEngineStore = create((set, get) => ({
  // ─── Engine State ───
  isRunning: false,
  rpm: 0,
  targetRpm: 0,
  loadPercent: 30,
  reverseGear: false,
  emergencyStop: false,

  // ─── Telemetry ───
  temperature: 25,
  oilPressure: 0,
  fuelConsumption: 0,
  torque: 0,
  thrustForce: 0,
  propellerEfficiency: 0,
  engineHealth: 100,
  shipSpeed: 0,
  waterResistance: 0,

  // ─── Telemetry History (last 60 data points) ───
  telemetryHistory: [],

  // ─── Mode ───
  activeTab: 'normal',
  explodedProgress: 0,
  selectedPart: null,

  // ─── Failures ───
  failures: {
    oilLeak: false,
    overheating: false,
    shaftMisalignment: false,
    propellerDamage: false,
    gearWear: false,
  },

  // ─── Logs & Alerts ───
  logs: [],
  alerts: [],
  lastAlertTime: 0,

  // ─── Loading ───
  isLoading: true,
  loadProgress: 0,

  // ─── Actions ───
  setLoading: (val) => set({ isLoading: val }),
  setLoadProgress: (val) => set({ loadProgress: val }),

  startEngine: () => {
    const state = get();
    if (state.emergencyStop) return;
    set({ isRunning: true, targetRpm: state.targetRpm || 800 });
    get().addLog('ENGINE', 'Engine started — ignition sequence complete');
  },

  stopEngine: () => {
    set({ isRunning: false, targetRpm: 0 });
    get().addLog('ENGINE', 'Engine shutdown initiated');
  },

  emergencyStopEngine: () => {
    set({ isRunning: false, targetRpm: 0, rpm: 0, emergencyStop: true });
    get().addLog('EMERGENCY', '⚠ EMERGENCY STOP ACTIVATED — All systems halted');
  },

  resetEmergencyStop: () => {
    set({ emergencyStop: false });
    get().addLog('SYSTEM', 'Emergency stop reset — systems ready');
  },

  setTargetRpm: (rpm) => {
    set({ targetRpm: rpm });
    if (get().isRunning) {
      get().addLog('CONTROL', `Target RPM set to ${rpm}`);
    }
  },

  setLoadPercent: (load) => {
    set({ loadPercent: load });
    get().addLog('CONTROL', `Load set to ${load}%`);
  },

  toggleReverse: () => {
    const newVal = !get().reverseGear;
    set({ reverseGear: newVal });
    get().addLog('CONTROL', `Gear set to ${newVal ? 'REVERSE' : 'FORWARD'}`);
  },

  setActiveTab: (tab) => {
    set({ activeTab: tab, selectedPart: null });
    get().addLog('MODE', `Switched to ${tab} mode`);
  },

  setSelectedPart: (part) => set({ selectedPart: part }),

  toggleFailure: (type) => {
    const failures = { ...get().failures };
    failures[type] = !failures[type];
    set({ failures });
    get().addLog('FAILURE', `${type} ${failures[type] ? 'ACTIVATED' : 'DEACTIVATED'}`);
  },

  addLog: (category, message) => {
    set((state) => ({
      logs: [
        ...state.logs.slice(-99), // keep last 100
        {
          id: Date.now() + Math.random(),
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
          category,
          message,
        },
      ],
    }));
  },

  // ─── Physics Tick ───
  tick: () => {
    const state = get();

    // RPM smoothing
    let newRpm = state.rpm;
    if (state.isRunning) {
      const rpmDiff = state.targetRpm - state.rpm;
      newRpm = state.rpm + rpmDiff * 0.03; // smooth ramp
    } else {
      newRpm = state.rpm * 0.95; // coast down
      if (newRpm < 1) newRpm = 0;
    }

    // Physics calculations
    const temperature = calcTemperature(
      newRpm, state.loadPercent, state.oilPressure,
      state.failures.overheating, state.temperature
    );
    const oilPressure = calcOilPressure(newRpm, state.failures.oilLeak, state.oilPressure);
    const fuelConsumption = calcFuelConsumption(newRpm, state.loadPercent);
    const torque = calcTorque(newRpm, state.loadPercent);
    const propellerEfficiency = calcPropellerEfficiency(
      newRpm, state.loadPercent,
      state.failures.propellerDamage, state.failures.shaftMisalignment
    );
    const thrustForce = calcThrust(newRpm, propellerEfficiency);
    const shipSpeed = calcShipSpeed(thrustForce, state.shipSpeed);

    // Health degradation (only when running)
    let engineHealth = state.engineHealth;
    if (state.isRunning && newRpm > 0) {
      const healthDelta = calcHealthDegradation(oilPressure, temperature, state.failures);
      engineHealth = Math.max(0, Math.min(100, engineHealth + healthDelta * 0.016));
    }

    // Exploded view interpolation
    let explodedProgress = state.explodedProgress;
    if (state.activeTab === 'exploded') {
      explodedProgress = Math.min(1, explodedProgress + 0.02);
    } else {
      explodedProgress = Math.max(0, explodedProgress - 0.03);
    }

    // Telemetry history (every ~30 ticks / 0.5s)
    const historyEntry = {
      time: Date.now(),
      rpm: newRpm,
      temperature,
      oilPressure,
      fuelConsumption,
      torque,
      thrust: thrustForce,
    };

    const newHistory = [...state.telemetryHistory, historyEntry].slice(-120);

    set({
      rpm: newRpm,
      temperature,
      oilPressure,
      fuelConsumption,
      torque,
      thrustForce,
      propellerEfficiency,
      engineHealth,
      shipSpeed,
      explodedProgress,
      telemetryHistory: newHistory,
    });

    // AI alerts (every 3 seconds)
    const now = Date.now();
    if (state.isRunning && now - state.lastAlertTime > 3000) {
      const newAlerts = analyzeEngine({
        ...state,
        rpm: newRpm,
        temperature,
        oilPressure,
        fuelConsumption,
        propellerEfficiency,
        engineHealth,
      });
      if (newAlerts.length > 0) {
        set((s) => ({
          alerts: [...s.alerts.slice(-19), ...newAlerts], // keep last 20
          lastAlertTime: now,
        }));
      }
    }
  },
}));

export default useEngineStore;

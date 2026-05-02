// aiPredictor.js — AI Predictive Maintenance Module

/**
 * Analyze engine state and produce predictive maintenance alerts.
 * Returns an array of alert objects.
 */
export function analyzeEngine(state) {
  const alerts = [];
  const now = Date.now();

  // ─── Overheating Detection ───
  if (state.temperature > 105) {
    alerts.push({
      id: `overheat-crit-${now}`,
      severity: 'critical',
      type: 'overheating',
      title: 'CRITICAL: Engine Overheating',
      message: `Temperature at ${state.temperature.toFixed(1)}°C exceeds safe limit (105°C). Immediate shutdown recommended.`,
      estimatedFailure: estimateFailureTime(state.temperature, 120, 0.3),
      timestamp: now,
    });
  } else if (state.temperature > 95) {
    alerts.push({
      id: `overheat-warn-${now}`,
      severity: 'warning',
      type: 'overheating',
      title: 'WARNING: High Temperature',
      message: `Temperature at ${state.temperature.toFixed(1)}°C approaching critical threshold. Reduce load or RPM.`,
      estimatedFailure: estimateFailureTime(state.temperature, 120, 0.15),
      timestamp: now,
    });
  }

  // ─── Oil Pressure Analysis ───
  if (state.oilPressure < 1.5 && state.isRunning) {
    alerts.push({
      id: `oil-crit-${now}`,
      severity: 'critical',
      type: 'oil_pressure',
      title: 'CRITICAL: Oil Pressure Loss',
      message: `Oil pressure at ${state.oilPressure.toFixed(2)} bar — bearing damage imminent. Check for leaks.`,
      estimatedFailure: estimateFailureTime(1.5 - state.oilPressure, 1.5, 0.4),
      timestamp: now,
    });
  } else if (state.oilPressure < 2.5 && state.isRunning) {
    alerts.push({
      id: `oil-warn-${now}`,
      severity: 'warning',
      type: 'oil_pressure',
      title: 'WARNING: Low Oil Pressure',
      message: `Oil pressure at ${state.oilPressure.toFixed(2)} bar — below optimal range (3-5 bar).`,
      estimatedFailure: null,
      timestamp: now,
    });
  }

  // ─── Fuel Overconsumption ───
  const expectedFuel = getExpectedFuelConsumption(state.rpm, state.loadPercent);
  if (state.fuelConsumption > expectedFuel * 1.3 && state.isRunning) {
    alerts.push({
      id: `fuel-warn-${now}`,
      severity: 'warning',
      type: 'fuel',
      title: 'Fuel Overconsumption Detected',
      message: `Consuming ${state.fuelConsumption.toFixed(1)} L/h vs expected ${expectedFuel.toFixed(1)} L/h (+${((state.fuelConsumption / expectedFuel - 1) * 100).toFixed(0)}%).`,
      estimatedFailure: null,
      timestamp: now,
    });
  }

  // ─── Engine Health Prediction ───
  if (state.engineHealth < 30) {
    alerts.push({
      id: `health-crit-${now}`,
      severity: 'critical',
      type: 'health',
      title: 'CRITICAL: Engine Health Critical',
      message: `Engine health at ${state.engineHealth.toFixed(1)}%. Major overhaul required immediately.`,
      estimatedFailure: estimateFailureTime(30 - state.engineHealth, 30, 0.5),
      timestamp: now,
    });
  } else if (state.engineHealth < 60) {
    alerts.push({
      id: `health-warn-${now}`,
      severity: 'warning',
      type: 'health',
      title: 'Engine Health Degrading',
      message: `Engine health at ${state.engineHealth.toFixed(1)}%. Schedule maintenance soon.`,
      estimatedFailure: estimateFailureTime(60 - state.engineHealth, 100, 0.1),
      timestamp: now,
    });
  }

  // ─── Bearing Wear Warning ───
  if (state.failures.gearWear || (state.oilPressure < 2.0 && state.rpm > 2000)) {
    alerts.push({
      id: `bearing-warn-${now}`,
      severity: 'warning',
      type: 'bearing',
      title: 'Bearing Wear Detected',
      message: 'Excessive bearing wear detected due to inadequate lubrication or gear stress. Inspect bearings.',
      estimatedFailure: estimateFailureTime(1, 1, 0.2),
      timestamp: now,
    });
  }

  // ─── Shaft Misalignment ───
  if (state.failures.shaftMisalignment) {
    alerts.push({
      id: `shaft-warn-${now}`,
      severity: 'critical',
      type: 'shaft',
      title: 'Shaft Misalignment Detected',
      message: 'Drive shaft misalignment causing vibration and efficiency loss. Realignment required.',
      estimatedFailure: estimateFailureTime(1, 1, 0.25),
      timestamp: now,
    });
  }

  // ─── Propeller Damage ───
  if (state.failures.propellerDamage) {
    alerts.push({
      id: `prop-warn-${now}`,
      severity: 'warning',
      type: 'propeller',
      title: 'Propeller Damage Detected',
      message: `Propeller efficiency reduced to ${state.propellerEfficiency.toFixed(1)}%. Cavitation risk increased.`,
      estimatedFailure: null,
      timestamp: now,
    });
  }

  return alerts;
}

/**
 * Estimate time to failure in hours based on current deviation.
 */
function estimateFailureTime(currentDeviation, maxDeviation, ratePerHour) {
  if (ratePerHour <= 0) return null;
  const remaining = maxDeviation - currentDeviation;
  const hours = Math.max(0.1, remaining / (ratePerHour * 60));
  return Math.round(hours * 10) / 10;
}

/**
 * Get expected fuel consumption for comparison.
 */
function getExpectedFuelConsumption(rpm, load) {
  if (rpm === 0) return 0;
  const base = 5;
  const rpmFactor = (rpm / 3000) ** 1.8 * 180;
  const loadFactor = 1 + (load / 100) * 0.8;
  return (base + rpmFactor) * loadFactor;
}

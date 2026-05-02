// physics.js — Pure functions for marine engine physics simulation

/**
 * Calculate engine temperature based on RPM, load, and conditions.
 * Normal operating range: 60-95°C, Critical: >105°C
 */
export function calcTemperature(rpm, load, oilPressure, isOverheating, currentTemp) {
  const baseTemp = 25; // ambient
  const rpmHeat = (rpm / 3000) * 45; // RPM contributes up to 45°C
  const loadHeat = (load / 100) * 35;  // Load contributes up to 35°C
  const coolingEffect = Math.min(oilPressure / 5, 1) * 15; // Oil cooling up to 15°C
  const overheatBonus = isOverheating ? 30 : 0;
  
  const targetTemp = baseTemp + rpmHeat + loadHeat - coolingEffect + overheatBonus;
  // Smooth interpolation toward target
  return currentTemp + (targetTemp - currentTemp) * 0.02;
}

/**
 * Calculate oil pressure based on RPM and leak condition.
 * Normal: 3-5 bar, Warning: <2.5 bar, Critical: <1.5 bar
 */
export function calcOilPressure(rpm, hasLeak, currentPressure) {
  const basePressure = rpm > 0 ? 1.5 : 0;
  const rpmPressure = (rpm / 3000) * 3.5;
  const leakPenalty = hasLeak ? 2.0 : 0;
  
  const targetPressure = Math.max(0, basePressure + rpmPressure - leakPenalty);
  return currentPressure + (targetPressure - currentPressure) * 0.03;
}

/**
 * Calculate fuel consumption based on RPM and load.
 * Result in liters per hour.
 */
export function calcFuelConsumption(rpm, load) {
  if (rpm === 0) return 0;
  const baseConsumption = 5; // idle consumption at low RPM
  const rpmFactor = (rpm / 3000) ** 1.8 * 180; // non-linear increase
  const loadFactor = 1 + (load / 100) * 0.8;
  return (baseConsumption + rpmFactor) * loadFactor;
}

/**
 * Calculate engine torque based on RPM and load.
 * Result in N·m. Peaks around 1500-2000 RPM (typical diesel curve).
 */
export function calcTorque(rpm, load) {
  if (rpm === 0) return 0;
  // Bell curve peaking at ~1800 RPM
  const normalized = rpm / 1800;
  const torqueCurve = normalized * Math.exp(1 - normalized);
  const maxTorque = 2500; // N·m max
  const loadFactor = 0.3 + (load / 100) * 0.7;
  return torqueCurve * maxTorque * loadFactor;
}

/**
 * Calculate thrust force based on RPM and propeller efficiency.
 * Result in kN.
 */
export function calcThrust(rpm, efficiency) {
  if (rpm === 0) return 0;
  const maxThrust = 85; // kN
  const rpmFactor = (rpm / 3000) ** 1.5;
  return maxThrust * rpmFactor * (efficiency / 100);
}

/**
 * Calculate propeller efficiency based on RPM, load, and damage.
 * Result in percentage (0-100).
 */
export function calcPropellerEfficiency(rpm, load, isDamaged, isShaftMisaligned) {
  if (rpm === 0) return 0;
  // Optimal efficiency around 70-80% load and 1500-2200 RPM
  const rpmNorm = rpm / 3000;
  const loadNorm = load / 100;
  
  // Efficiency curve: peaks at mid-range
  let efficiency = 85 - Math.abs(rpmNorm - 0.6) * 30 - Math.abs(loadNorm - 0.7) * 15;
  
  if (isDamaged) efficiency *= 0.6;
  if (isShaftMisaligned) efficiency *= 0.75;
  
  return Math.max(5, Math.min(98, efficiency));
}

/**
 * Calculate engine health degradation rate.
 * Returns negative delta per second.
 */
export function calcHealthDegradation(oilPressure, temperature, failures) {
  let degradation = 0;
  
  // Low oil pressure damage
  if (oilPressure < 1.5) degradation += 0.15;
  else if (oilPressure < 2.5) degradation += 0.05;
  
  // Overheating damage
  if (temperature > 110) degradation += 0.2;
  else if (temperature > 100) degradation += 0.1;
  else if (temperature > 95) degradation += 0.03;
  
  // Failure mode damage
  if (failures.oilLeak) degradation += 0.08;
  if (failures.overheating) degradation += 0.12;
  if (failures.shaftMisalignment) degradation += 0.1;
  if (failures.propellerDamage) degradation += 0.06;
  if (failures.gearWear) degradation += 0.07;
  
  return -degradation;
}

/**
 * Calculate ship speed from thrust and resistance.
 * Simplified model. Result in knots.
 */
export function calcShipSpeed(thrust, currentSpeed) {
  const dragCoefficient = 0.02;
  const mass = 500; // arbitrary mass factor
  const drag = dragCoefficient * currentSpeed * currentSpeed;
  const netForce = thrust - drag;
  const acceleration = netForce / mass;
  const newSpeed = Math.max(0, currentSpeed + acceleration * 0.016); // dt ≈ 16ms
  return Math.min(30, newSpeed); // max 30 knots
}

/**
 * Calculate resistance force from water.
 * Result in kN.
 */
export function calcWaterResistance(speed) {
  return 0.02 * speed * speed;
}

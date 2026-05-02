// partInfo.js — Engine part metadata for learning mode

const partInfo = {
  engineBlock: {
    name: 'Engine Block (Cylinder Block)',
    function: 'The main structural component housing the cylinders, crankcase, and internal passages for coolant and oil. Provides mounting points for all other engine components.',
    material: 'Cast iron alloy (GG-25) or aluminum alloy for marine applications, with chrome-plated cylinder liners.',
    maintenance: [
      'Inspect for cracks or corrosion every 8,000 operating hours',
      'Check cylinder liner wear — replace when tolerance exceeds 0.5mm',
      'Monitor coolant passages for scale buildup',
      'Ensure torque on head bolts meets specification',
    ],
  },
  crankshaft: {
    name: 'Crankshaft',
    function: 'Converts reciprocating piston motion into rotational motion. Transmits torque to the drive shaft and ultimately the propeller via the gear system.',
    material: 'Forged alloy steel (42CrMo4), case-hardened bearing journals, dynamically balanced.',
    maintenance: [
      'Check bearing clearances every 4,000 hours',
      'Inspect for surface cracks using magnetic particle testing',
      'Monitor vibration levels for balance degradation',
      'Lubrication oil analysis every 500 hours for metal particulates',
    ],
  },
  piston: {
    name: 'Piston Assembly',
    function: 'Compresses fuel-air mixture and transmits combustion force to the crankshaft via connecting rods. Marine pistons operate in a 2-stroke or 4-stroke cycle.',
    material: 'Aluminum alloy crown with cast iron ring carrier, chrome-ceramic coated ring grooves.',
    maintenance: [
      'Inspect piston rings for wear every 6,000 hours',
      'Check crown for heat damage or carbon deposits',
      'Monitor blowby gases — increasing levels indicate ring wear',
      'Replace rings when gap exceeds manufacturer tolerance',
    ],
  },
  driveShaft: {
    name: 'Drive Shaft (Propeller Shaft)',
    function: 'Transmits rotational power from the engine/gearbox to the propeller. Must handle thrust loads, torque, and allow for alignment adjustments.',
    material: 'High-tensile stainless steel (AISI 316L) or bronze-lined, with water-lubricated bearings.',
    maintenance: [
      'Check alignment every 2,000 hours using laser alignment tools',
      'Inspect stern tube seals for water ingress',
      'Monitor bearing temperature and wear',
      'Verify coupling bolt torque and condition',
    ],
  },
  gearSystem: {
    name: 'Reduction Gearbox',
    function: 'Reduces engine RPM to optimal propeller speed while increasing torque. Provides forward/reverse capability via clutch packs.',
    material: 'Case-hardened steel gears (16MnCr5), bronze synchronizer rings, high-strength aluminum housing.',
    maintenance: [
      'Oil analysis every 500 hours for metal contamination',
      'Check gear tooth contact pattern annually',
      'Inspect clutch plates for wear and slippage',
      'Monitor operating temperature — max 85°C oil temp',
    ],
  },
  propeller: {
    name: 'Marine Propeller',
    function: 'Converts shaft rotational energy into thrust by accelerating water. Blade geometry optimized for vessel speed range and wake pattern.',
    material: 'Nickel-aluminum-bronze (NAB) alloy — excellent corrosion resistance, cavitation-resistant.',
    maintenance: [
      'Inspect for cavitation erosion and edge damage every drydock',
      'Check blade pitch angles remain within specification',
      'Polish surfaces to reduce drag — marine growth increases fuel consumption 10-15%',
      'Dynamic balance check if vibration is detected',
    ],
  },
  bearings: {
    name: 'Main Bearings & Thrust Bearing',
    function: 'Support the crankshaft and drive shaft, allowing free rotation while absorbing radial and axial (thrust) loads. Critical for alignment and vibration control.',
    material: 'White metal (Babbitt) lined steel shells, or polymer composite for water-lubricated stern tube bearings.',
    maintenance: [
      'Measure bearing clearances every 4,000 hours',
      'Monitor oil temperature differential across bearings',
      'Check for white metal fatigue or wiping',
      'Oil analysis for tin/lead particles indicates bearing wear',
    ],
  },
};

export default partInfo;

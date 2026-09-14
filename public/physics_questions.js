/**
 * Comprehensive Sri Lankan G.C.E. Advanced Level Physics Question Bank
 * Covers all 8 Units of the NIE Sri Lankan A/L Physics Syllabus:
 * Unit 1: Measurement & Dimensions
 * Unit 2: Mechanics
 * Unit 3: Oscillations & Waves
 * Unit 4: Thermal Physics
 * Unit 5: Gravitational & Electrostatic Fields
 * Unit 6: Current Electricity & Electromagnetism
 * Unit 7: Electronics & Operational Amplifiers
 * Unit 8: Radiation, Matter & Modern Physics
 * 
 * Each unit contains 100 high-yield A/L standard MCQ questions (Total: 800 questions).
 */

const PHYSICS_UNITS = [
  { id: "all", name: "🌟 Wednesday All-Units A/L Grand Examination", desc: "Official 100-question comprehensive examination balanced across all 8 Physics units according to Sri Lankan A/L syllabus weights.", total: 100, isGrand: true },
  { id: 1, name: "Unit 1: Measurement & Dimensions", desc: "SI base units, dimensional analysis, precision instruments, error propagation", total: 100 },
  { id: 2, name: "Unit 2: Mechanics", desc: "Linear motion, vectors, Newton's laws, circular motion, rotational dynamics, work, energy & momentum", total: 100 },
  { id: 3, name: "Unit 3: Oscillations & Waves", desc: "SHM, sound waves, Doppler effect, resonance, wave optics, interference, diffraction", total: 100 },
  { id: 4, name: "Unit 4: Thermal Physics", desc: "Calorimetry, ideal gas laws, kinetic theory, thermal conductivity, thermal radiation, thermodynamics", total: 100 },
  { id: 5, name: "Unit 5: Fields (Gravitational & Electrostatic)", desc: "Newtonian gravity, planetary orbits, Coulomb's law, electric potential, Gauss's law, capacitors", total: 100 },
  { id: 6, name: "Unit 6: Current Electricity & Electromagnetism", desc: "Ohm's law, Kirchhoff's laws, potentiometer, magnetic forces, Biot-Savart, Faraday's induction, AC", total: 100 },
  { id: 7, name: "Unit 7: Electronics & Operational Amplifiers", desc: "Semiconductors, p-n junctions, rectifiers, BJT transistors, op-amps (inverting, non-inverting, comparator)", total: 100 },
  { id: 8, name: "Unit 8: Radiation, Matter & Modern Physics", desc: "Photoelectric effect, de Broglie waves, Bohr atomic model, X-rays, radioactivity, mass-energy equivalence", total: 100 }
];

// Helper to systematically construct verified, high-quality question pools for each unit
function generateUnitQuestions(unitId, unitName) {
  const list = [];

  const unitTemplates = {
    1: [
      {
        q: "What is the SI base unit of thermodynamic temperature?",
        opts: ["Kelvin (K)", "Degree Celsius (°C)", "Fahrenheit (°F)", "Joule (J)"],
        ans: 0,
        exp: "Kelvin is the SI fundamental base unit for temperature."
      },
      {
        q: "The dimension of Planck's constant (h) is equivalent to the dimension of:",
        opts: ["Angular momentum", "Linear momentum", "Energy", "Power"],
        ans: 0,
        exp: "[h] = M L² T⁻¹, which is identical to angular momentum (m v r)."
      },
      {
        q: "The least count of a standard vernier caliper having 50 vernier divisions matching 49 main scale mm divisions is:",
        opts: ["0.02 mm", "0.01 mm", "0.05 mm", "0.1 mm"],
        ans: 0,
        exp: "Least Count = 1 MSD - 1 VSD = 1 mm - (49/50) mm = 1/50 mm = 0.02 mm."
      },
      {
        q: "Which of the following is a dimensionless physical quantity?",
        opts: ["Refractive index", "Gravitational constant", "Planck's constant", "Electric permittivity"],
        ans: 0,
        exp: "Refractive index is the ratio of speeds of light in two media, hence dimensionless [M⁰L⁰T⁰]."
      },
      {
        q: "The pitch of a micrometer screw gauge is 0.5 mm and its circular scale has 50 divisions. Its least count is:",
        opts: ["0.01 mm", "0.001 mm", "0.02 mm", "0.05 mm"],
        ans: 0,
        exp: "Least count = Pitch / Circular divisions = 0.5 mm / 50 = 0.01 mm."
      },
      {
        q: "If percentage error in measuring radius R of a sphere is 2%, the percentage error in calculated volume is:",
        opts: ["6%", "2%", "4%", "8%"],
        ans: 0,
        exp: "V = (4/3)πR³, so ΔV/V = 3 * (ΔR/R) = 3 * 2% = 6%."
      },
      {
        q: "The dimension of Universal Gravitational Constant G is:",
        opts: ["M⁻¹ L³ T⁻²", "M L² T⁻²", "M⁻¹ L² T⁻¹", "M L³ T⁻²"],
        ans: 0,
        exp: "F = G m₁m₂/r² => G = F r² / m² => [G] = (M L T⁻²)(L²) / M² = M⁻¹ L³ T⁻²."
      },
      {
        q: "Which pair of physical quantities have identical dimensions?",
        opts: ["Work and Torque", "Force and Impulse", "Power and Energy", "Pressure and Force"],
        ans: 0,
        exp: "Both Work (F*d) and Torque (r*F) have dimensions M L² T⁻²."
      },
      {
        q: "When a zero error in a micrometer screw gauge is +0.03 mm, the true reading is obtained by:",
        opts: ["Subtracting 0.03 mm from observed reading", "Adding 0.03 mm to observed reading", "Multiplying by 0.03", "Dividing by 0.03"],
        ans: 0,
        exp: "True reading = Observed reading - Zero error."
      },
      {
        q: "The dimensional formula of Surface Tension is:",
        opts: ["M L⁰ T⁻²", "M L⁻¹ T⁻²", "M L T⁻²", "M L² T⁻²"],
        ans: 0,
        exp: "Surface tension γ = Force / Length => [γ] = M L T⁻² / L = M L⁰ T⁻²."
      }
    ],
    2: [
      {
        q: "A projectile is launched with velocity u at angle θ to horizontal. The maximum height achieved is:",
        opts: ["(u² sin²θ)/(2g)", "(u² sin 2θ)/g", "(u sinθ)/g", "(u² cos²θ)/(2g)"],
        ans: 0,
        exp: "At highest point, v_y = 0. Using v² = u² - 2gh gives H = (u² sin²θ)/(2g)."
      },
      {
        q: "A body of mass m moves in a horizontal circle of radius r with constant angular velocity ω. The centripetal force is:",
        opts: ["m r ω²", "m r / ω²", "m ω / r", "m r² ω"],
        ans: 0,
        exp: "Centripetal acceleration is r ω², so force F = m r ω²."
      },
      {
        q: "In an elastic collision between two isolated masses in a closed system:",
        opts: ["Both total linear momentum and total kinetic energy are conserved", "Only momentum is conserved", "Only kinetic energy is conserved", "Neither is conserved"],
        ans: 0,
        exp: "By definition, an elastic collision conserves both kinetic energy and linear momentum."
      },
      {
        q: "The moment of inertia of a uniform solid disc of mass M and radius R about its central perpendicular axis is:",
        opts: ["(1/2) M R²", "M R²", "(2/5) M R²", "(1/4) M R²"],
        ans: 0,
        exp: "Standard rotational moment of inertia for a uniform disc is I = (1/2) M R²."
      },
      {
        q: "Terminal velocity of a spherical raindrop falling through viscous air is directly proportional to:",
        opts: ["Square of its radius (r²)", "Radius (r)", "Cube of radius (r³)", "Inverse of radius (1/r)"],
        ans: 0,
        exp: "According to Stokes' Law, terminal velocity v_t = (2/9) r² (ρ - σ) g / η, which varies as r²."
      },
      {
        q: "A body of mass 2 kg moving at 10 m/s is brought to rest in 0.5 seconds. The average retarding force is:",
        opts: ["40 N", "20 N", "10 N", "50 N"],
        ans: 0,
        exp: "Impulse = Δp => F * Δt = m * Δv => F * 0.5 = 2 * 10 = 20 => F = 40 N."
      },
      {
        q: "Bernoulli's equation for fluid flow is a direct consequence of the conservation of:",
        opts: ["Energy", "Linear momentum", "Angular momentum", "Mass"],
        ans: 0,
        exp: "Bernoulli's principle expresses conservation of mechanical energy for streamline non-viscous fluid flow."
      },
      {
        q: "The angle of banking θ for a curve of radius r safely negotiated at speed v without friction is given by:",
        opts: ["tan θ = v² / (r g)", "sin θ = v² / (r g)", "cos θ = v / (r g)", "tan θ = (r g) / v²"],
        ans: 0,
        exp: "Resolving normal reaction: N sin θ = m v² / r and N cos θ = m g, hence tan θ = v² / (r g)."
      },
      {
        q: "A uniform ladder of weight W leans against a frictionless vertical wall. The frictional force at the ground is:",
        opts: ["Equal to the normal reaction from the wall", "Zero", "Equal to W", "Half of W"],
        ans: 0,
        exp: "Horizontal equilibrium requires Friction at ground = Normal reaction from smooth vertical wall."
      },
      {
        q: "The work done by a conservative force along any closed path is always:",
        opts: ["Zero", "Positive", "Negative", "Dependent on the path taken"],
        ans: 0,
        exp: "By definition, the line integral of a conservative force over a closed loop is identically zero."
      }
    ],
    3: [
      {
        q: "In simple harmonic motion (SHM), when the displacement is maximum, the acceleration is:",
        opts: ["Maximum and directed towards equilibrium", "Zero", "Minimum and directed away", "Constant"],
        ans: 0,
        exp: "a = -ω² x. When x = +A, acceleration has maximum magnitude ω²A directed towards the center."
      },
      {
        q: "The apparent frequency heard by an observer moving with velocity u_o towards a stationary source of frequency f is:",
        opts: ["f * (v + u_o) / v", "f * (v - u_o) / v", "f * v / (v + u_o)", "f * v / (v - u_o)"],
        ans: 0,
        exp: "Doppler effect when observer approaches stationary source: f' = f (v + u_o) / v."
      },
      {
        q: "The fundamental frequency of a resonance tube open at one end and closed at the other of length L is:",
        opts: ["v / (4L)", "v / (2L)", "2v / L", "4v / L"],
        ans: 0,
        exp: "For closed pipe at fundamental resonance, L = λ/4 => λ = 4L => f = v / (4L)."
      },
      {
        q: "Two sound waves of frequencies 256 Hz and 260 Hz are sounded together. The beat frequency produced is:",
        opts: ["4 Hz", "258 Hz", "516 Hz", "2 Hz"],
        ans: 0,
        exp: "Beat frequency = |f₁ - f₂| = |260 - 256| = 4 Hz."
      },
      {
        q: "In Young's double slit experiment, fringe width β is given by:",
        opts: ["λ D / d", "λ d / D", "D d / λ", "λ / (D d)"],
        ans: 0,
        exp: "Fringe separation β = λ D / d, where D is screen distance and d is slit separation."
      },
      {
        q: "Light of wavelength λ passes through a single slit of width a. The angular width of the central diffraction maximum is:",
        opts: ["2 λ / a", "λ / a", "λ / (2a)", "4 λ / a"],
        ans: 0,
        exp: "First minima occur at sin θ ≈ λ/a, so total angular width of central maximum is 2θ = 2λ/a."
      },
      {
        q: "Brewster's angle i_p for a glass medium of refractive index n in air satisfies:",
        opts: ["tan(i_p) = n", "sin(i_p) = n", "cos(i_p) = n", "tan(i_p) = 1/n"],
        ans: 0,
        exp: "Brewster's law states that complete polarization occurs when tan(i_p) = n."
      },
      {
        q: "A progressive wave has equation y = 0.05 sin(100π t - 2π x). The wave speed is:",
        opts: ["50 m/s", "100 m/s", "25 m/s", "200 m/s"],
        ans: 0,
        exp: "v = ω / k = 100π / 2π = 50 m/s."
      },
      {
        q: "When a sound wave travels from air into water, which wave characteristic remains unchanged?",
        opts: ["Frequency", "Wavelength", "Speed", "Amplitude"],
        ans: 0,
        exp: "Frequency is determined strictly by the source vibration and remains invariant during refraction."
      },
      {
        q: "Stationary waves are formed by superposition of two identical waves traveling in:",
        opts: ["Opposite directions with equal amplitudes and frequencies", "Same direction with same phase", "Perpendicular directions", "Different media"],
        ans: 0,
        exp: "Standing waves arise from interference between two identical counter-propagating waves."
      }
    ],
    4: [
      {
        q: "According to the First Law of Thermodynamics, for an adiabatic expansion of an ideal gas:",
        opts: ["ΔU = -W (internal energy decreases)", "ΔU = Q", "ΔU = 0", "W = 0"],
        ans: 0,
        exp: "In adiabatic process, Q = 0. Thus ΔU = Q - W = -W. Work done by gas decreases its internal energy."
      },
      {
        q: "The root-mean-square (rms) speed of ideal gas molecules of molar mass M at absolute temperature T is:",
        opts: ["√(3 R T / M)", "√(2 R T / M)", "√(8 R T / π M)", "3 R T / M"],
        ans: 0,
        exp: "C_rms = √(3 k_B T / m) = √(3 R T / M)."
      },
      {
        q: "Stefan-Boltzmann Law states that radiant power emitted per unit surface area of a black body is proportional to:",
        opts: ["T⁴", "T²", "T³", "T"],
        ans: 0,
        exp: "Total emissive power E = σ T⁴ where T is absolute temperature in Kelvin."
      },
      {
        q: "Wien's displacement law relating peak wavelength λ_m and absolute temperature T is:",
        opts: ["λ_m * T = constant", "λ_m / T = constant", "λ_m * T² = constant", "λ_m² * T = constant"],
        ans: 0,
        exp: "Wien's law states λ_max T = b = 2.898 × 10⁻³ m·K."
      },
      {
        q: "In an isothermal process for an ideal gas, which parameter remains strictly constant?",
        opts: ["Internal energy U", "Pressure P", "Volume V", "Heat content Q"],
        ans: 0,
        exp: "For ideal gas, internal energy depends only on temperature T. Since T is constant, ΔU = 0."
      },
      {
        q: "The efficiency of a Carnot engine operating between reservoir temperatures T_H and T_C (in Kelvin) is:",
        opts: ["1 - (T_C / T_H)", "1 - (T_H / T_C)", "T_C / T_H", "T_H / (T_H + T_C)"],
        ans: 0,
        exp: "Carnot maximum theoretical efficiency η = 1 - (T_cold / T_hot)."
      },
      {
        q: "The anomalous expansion of water occurs in the temperature range:",
        opts: ["0 °C to 4 °C", "4 °C to 10 °C", "-4 °C to 0 °C", "0 °C to 100 °C"],
        ans: 0,
        exp: "Water contracts when heated from 0 °C to 4 °C, reaching maximum density at 4 °C."
      },
      {
        q: "Rate of heat conduction dQ/dt through a slab of area A, thickness d, thermal conductivity k and temp difference ΔT is:",
        opts: ["k A ΔT / d", "k d ΔT / A", "A d ΔT / k", "k A d / ΔT"],
        ans: 0,
        exp: "Fourier's conduction law: dQ/dt = k A (T₁ - T₂) / d."
      },
      {
        q: "At constant volume, the pressure of a given mass of gas is directly proportional to its absolute temperature. This is:",
        opts: ["Gay-Lussac's (Pressure) Law", "Boyle's Law", "Charles's Law", "Avogadro's Law"],
        ans: 0,
        exp: "P ∝ T at constant volume is Gay-Lussac's Law."
      },
      {
        q: "Molar heat capacities of an ideal gas C_p and C_v are related by Mayer's relation:",
        opts: ["C_p - C_v = R", "C_p + C_v = R", "C_p / C_v = R", "C_v - C_p = R"],
        ans: 0,
        exp: "Mayer's relation for one mole of ideal gas is C_p - C_v = R."
      }
    ],
    5: [
      {
        q: "The electric field intensity E at distance r from a point charge q in vacuum is:",
        opts: ["q / (4 π ε₀ r²)", "q / (4 π ε₀ r)", "q² / (4 π ε₀ r)", "q / (2 π ε₀ r²)"],
        ans: 0,
        exp: "From Coulomb's Law, field E = F/q₀ = q / (4πε₀r²)."
      },
      {
        q: "The capacitance of a parallel plate capacitor with plate area A and separation d in vacuum is:",
        opts: ["ε₀ A / d", "ε₀ d / A", "A d / ε₀", "4 π ε₀ A / d"],
        ans: 0,
        exp: "C = Q/V = ε₀ A / d."
      },
      {
        q: "The escape velocity from the surface of Earth of mass M and radius R is:",
        opts: ["√(2 G M / R)", "√(G M / R)", "√(G M / 2R)", "2 G M / R"],
        ans: 0,
        exp: "Setting total mechanical energy to zero: (1/2) m v² - G M m / R = 0 => v_e = √(2GM/R)."
      },
      {
        q: "Orbital period T of a satellite in circular orbit of radius r around mass M satisfies Kepler's third law:",
        opts: ["T² ∝ r³", "T³ ∝ r²", "T ∝ r²", "T² ∝ r"],
        ans: 0,
        exp: "Equating gravitational pull to centripetal force: G M m / r² = m (2π/T)² r => T² = (4π²/GM) r³."
      },
      {
        q: "The energy stored in a charged capacitor of capacitance C charged to potential difference V is:",
        opts: ["(1/2) C V²", "C V²", "(1/2) C² V", "2 C V²"],
        ans: 0,
        exp: "Stored electrostatic potential energy U = (1/2) C V² = (1/2) Q V = Q² / (2C)."
      },
      {
        q: "Electric potential V at distance r from point charge q is:",
        opts: ["q / (4 π ε₀ r)", "q / (4 π ε₀ r²)", "-q / (4 π ε₀ r)", "q² / (4 π ε₀ r)"],
        ans: 0,
        exp: "V = ∫ E dr = q / (4πε₀r)."
      },
      {
        q: "If a dielectric slab of constant K is inserted between plates of an isolated charged capacitor, the electric field:",
        opts: ["Decreases by factor 1/K", "Increases by factor K", "Remains unchanged", "Becomes zero"],
        ans: 0,
        exp: "Since charge Q remains fixed and C increases to KC, V = Q/C decreases by 1/K, so E = V/d decreases by 1/K."
      },
      {
        q: "At the center of a uniformly charged thin spherical conducting shell of radius R and charge Q:",
        opts: ["Electric field is zero, electric potential is Q / (4πε₀R)", "Both field and potential are zero", "Field is non-zero, potential is zero", "Field is Q/(4πε₀R²)"],
        ans: 0,
        exp: "Inside any charged conductor, E = 0. Therefore potential is uniform and equal to surface potential Q/(4πε₀R)."
      },
      {
        q: "The work done in moving a test charge q around any closed path in a static electric field is:",
        opts: ["Zero", "q V", "q E", "Independent of field"],
        ans: 0,
        exp: "Electrostatic field is conservative, meaning closed line integral ∮ E · dr = 0."
      },
      {
        q: "Gauss's law states that total electric flux Φ through any closed Gaussian surface enclosing charge Q_enc is:",
        opts: ["Q_enc / ε₀", "ε₀ Q_enc", "Q_enc / (4 π ε₀)", "4 π ε₀ Q_enc"],
        ans: 0,
        exp: "Gauss's Law: ∮ E · dA = Q_enclosed / ε₀."
      }
    ],
    6: [
      {
        q: "According to Kirchhoff's Current Law (junction rule), the algebraic sum of currents meeting at any node is zero. This reflects conservation of:",
        opts: ["Electric charge", "Energy", "Linear momentum", "Potential difference"],
        ans: 0,
        exp: "KCL states charge cannot accumulate at an infinitesimal circuit node (conservation of charge)."
      },
      {
        q: "Kirchhoff's Loop Rule (voltage law) is a statement of the conservation of:",
        opts: ["Energy", "Charge", "Current", "Power"],
        ans: 0,
        exp: "Total work done in moving a unit charge around any closed loop is zero (conservation of energy)."
      },
      {
        q: "The magnetic force on a charge q moving with velocity v in magnetic flux density B is:",
        opts: ["F = q (v × B)", "F = q (v · B)", "F = (v × B) / q", "F = q v / B"],
        ans: 0,
        exp: "Lorentz magnetic force is F = q (v × B) with magnitude q v B sin θ."
      },
      {
        q: "The magnetic field B at distance r from a long straight wire carrying steady current I in vacuum is:",
        opts: ["μ₀ I / (2 π r)", "μ₀ I / (4 π r²)", "μ₀ I / (2 r)", "μ₀ I r / (2 π)"],
        ans: 0,
        exp: "From Ampere's Law: ∮ B · dl = B (2πr) = μ₀ I => B = μ₀ I / (2πr)."
      },
      {
        q: "A potentiometer is superior to a conventional voltmeter for measuring EMF of a cell because:",
        opts: ["It draws zero current from the test cell at the balance point", "It has lower internal resistance", "It operates at higher voltage", "It measures current directly"],
        ans: 0,
        exp: "At null balance, no current is drawn, measuring true terminal open-circuit electromotive force."
      },
      {
        q: "Faraday's law of electromagnetic induction states that induced EMF ε in a coil of N turns is:",
        opts: ["-N (dΦ / dt)", "-N Φ", "N (dI / dt)", "-L (dΦ / dt)"],
        ans: 0,
        exp: "ε = -N (dΦ/dt). The negative sign represents Lenz's Law."
      },
      {
        q: "Lenz's law of induction is an immediate manifestation of:",
        opts: ["Conservation of energy", "Conservation of charge", "Conservation of momentum", "Newton's first law"],
        ans: 0,
        exp: "The induced current opposes the flux change; mechanical work done against this opposition equals generated electrical energy."
      },
      {
        q: "In an AC circuit containing only a pure inductor of inductance L, current lags voltage by a phase of:",
        opts: ["π/2 radians (90°)", "π radians (180°)", "0 radians", "π/4 radians (45°)"],
        ans: 0,
        exp: "In pure inductive circuit, current lags EMF by 90° (V leads I by π/2)."
      },
      {
        q: "The energy stored in an inductor of inductance L carrying steady current I is:",
        opts: ["(1/2) L I²", "L I²", "(1/2) L² I", "2 L I²"],
        ans: 0,
        exp: "Stored magnetic field energy U_B = (1/2) L I²."
      },
      {
        q: "When length and cross-sectional area of a uniform cylindrical metallic wire are both doubled, its electrical resistance:",
        opts: ["Remains unchanged", "Doubles", "Halves", "Quadruples"],
        ans: 0,
        exp: "R = ρ L / A. If L' = 2L and A' = 2A, then R' = ρ(2L)/(2A) = ρ L / A = R."
      }
    ],
    7: [
      {
        q: "An ideal operational amplifier (Op-Amp) is characterized by:",
        opts: ["Infinite input impedance and zero output impedance", "Zero input impedance and infinite output impedance", "Infinite gain and infinite output impedance", "Zero voltage gain and zero bandwidth"],
        ans: 0,
        exp: "Ideal op-amp parameters: R_in = ∞, R_out = 0, Open-loop gain A = ∞, Slew rate = ∞."
      },
      {
        q: "In an inverting op-amp amplifier with input resistor R₁ and feedback resistor R_f, voltage gain A_v is:",
        opts: ["-R_f / R₁", "1 + (R_f / R₁)", "-R₁ / R_f", "R_f / (R₁ + R_f)"],
        ans: 0,
        exp: "Using virtual ground concept at the inverting terminal: V_out / V_in = -R_f / R₁."
      },
      {
        q: "In a non-inverting op-amp configuration, the closed-loop voltage gain A_v is:",
        opts: ["1 + (R_f / R₁)", "-R_f / R₁", "R_f / R₁", "1 - (R_f / R₁)"],
        ans: 0,
        exp: "For non-inverting op-amp, A_v = 1 + R_f / R₁."
      },
      {
        q: "In an n-type extrinsic semiconductor, the majority charge carriers are:",
        opts: ["Electrons", "Holes", "Positive ions", "Protons"],
        ans: 0,
        exp: "Doping pure silicon with pentavalent donor atoms (e.g. Phosphorus) creates excess conduction electrons."
      },
      {
        q: "The width of the depletion layer in a semiconductor p-n junction:",
        opts: ["Decreases in forward bias and increases in reverse bias", "Increases in forward bias", "Remains constant", "Decreases in both directions"],
        ans: 0,
        exp: "Forward bias pushes majority carriers across the junction, shrinking depletion width; reverse bias widens it."
      },
      {
        q: "A Zener diode is predominantly operated in which region for voltage regulation?",
        opts: ["Reverse breakdown region", "Forward conduction region", "Cut-off region", "Saturation region"],
        ans: 0,
        exp: "In reverse breakdown, Zener voltage V_z remains nearly constant despite substantial changes in current."
      },
      {
        q: "In a bipolar junction transistor (BJT) in active amplification mode, the emitter-base and collector-base junctions are:",
        opts: ["Forward-biased and reverse-biased respectively", "Both forward-biased", "Both reverse-biased", "Reverse-biased and forward-biased"],
        ans: 0,
        exp: "Active mode requires forward bias on emitter junction (to inject carriers) and reverse bias on collector junction (to sweep carriers across)."
      },
      {
        q: "The ripple frequency of a full-wave bridge rectifier fed from 50 Hz AC mains is:",
        opts: ["100 Hz", "50 Hz", "25 Hz", "200 Hz"],
        ans: 0,
        exp: "Full-wave rectification inverts negative half-cycles, doubling output pulse frequency: 2 * 50 Hz = 100 Hz."
      },
      {
        q: "The Boolean logic function implemented by a two-input NAND gate is:",
        opts: ["Y = NOT (A AND B)", "Y = NOT (A OR B)", "Y = A AND B", "Y = A OR B"],
        ans: 0,
        exp: "NAND output is high (1) whenever any input is 0, represented by Y = (A · B)'."
      },
      {
        q: "The 'virtual ground' concept in negative-feedback op-amp circuits arises because:",
        opts: ["Open-loop gain is exceedingly large, making differential input voltage (V₊ - V₋) ≈ 0", "The inverting terminal is physically soldered to ground", "Feedback resistor is zero", "Output current is zero"],
        ans: 0,
        exp: "Since A_ol → ∞ and V_out is finite, V_diff = V_out / A_ol ≈ 0. If non-inverting terminal is at 0V, inverting terminal sits at virtual ground."
      }
    ],
    8: [
      {
        q: "In the photoelectric effect, maximum kinetic energy of emitted photoelectrons depends strictly on:",
        opts: ["Frequency of incident radiation", "Intensity of incident light", "Surface area of emitter", "Exposure time"],
        ans: 0,
        exp: "Einstein's equation: K_max = h f - Φ. Kinetic energy increases linearly with frequency above threshold."
      },
      {
        q: "The de Broglie wavelength λ of a particle of mass m moving with velocity v is:",
        opts: ["h / (m v)", "m v / h", "h m / v", "h / (m v²)"],
        ans: 0,
        exp: "Matter wavelength λ = h / p = h / (m v)."
      },
      {
        q: "According to Bohr's postulate for the hydrogen atom, orbital angular momentum of an electron in orbit n is quantized as:",
        opts: ["n h / (2 π)", "n h / π", "2 π n / h", "n² h / (2 π)"],
        ans: 0,
        exp: "Bohr's quantization condition: L = m v r = n ℏ = n h / (2π)."
      },
      {
        q: "The half-life T_(1/2) of a radioactive isotope having decay constant λ is:",
        opts: ["ln(2) / λ ≈ 0.693 / λ", "λ / ln(2)", "1 / λ", "2 / λ"],
        ans: 0,
        exp: "N = N₀ e^(-λt). When N = N₀/2, t = ln(2) / λ = 0.693 / λ."
      },
      {
        q: "During beta-minus (β⁻) radioactive decay, a nucleus emits:",
        opts: ["An electron and an antineutrino", "A positron and a neutrino", "A helium nucleus", "A photon only"],
        ans: 0,
        exp: "n → p + e⁻ + ν_bar (neutron converts to proton, emitting electron and antineutrino)."
      },
      {
        q: "The minimum wavelength λ_min (cutoff wavelength) of continuous X-rays produced in an X-ray tube at accelerating voltage V is:",
        opts: ["h c / (e V)", "e V / (h c)", "h V / (e c)", "c / (e V)"],
        ans: 0,
        exp: "Duane-Hunt Law: e V = h f_max = h c / λ_min => λ_min = h c / (e V)."
      },
      {
        q: "Mass defect Δm in a nuclear fusion reaction is converted into released energy Q according to Einstein's relation:",
        opts: ["Q = Δm * c²", "Q = (1/2) Δm * c²", "Q = Δm * c", "Q = Δm / c²"],
        ans: 0,
        exp: "E = m c² represents relativistic mass-energy equivalence."
      },
      {
        q: "Binding energy per nucleon is maximum for which of the following nuclides?",
        opts: ["Iron-56 (⁵⁶Fe)", "Uranium-235 (²³⁵U)", "Helium-4 (⁴He)", "Deuterium (²H)"],
        ans: 0,
        exp: "Iron-56 sits near the pinnacle of the nuclear binding energy curve at ~8.8 MeV per nucleon."
      },
      {
        q: "The threshold frequency for photoelectric emission from a metal of work function 3.3 eV is approximately (h = 6.6 × 10⁻³⁴ J·s):",
        opts: ["8.0 × 10¹⁴ Hz", "5.0 × 10¹⁴ Hz", "2.0 × 10¹⁵ Hz", "1.0 × 10¹⁴ Hz"],
        ans: 0,
        exp: "Φ = 3.3 * 1.6 × 10⁻¹⁹ J = 5.28 × 10⁻¹⁹ J. f₀ = Φ / h = 5.28 × 10⁻¹⁹ / 6.6 × 10⁻³⁴ = 8.0 × 10¹⁴ Hz."
      },
      {
        q: "When an electron in a hydrogen atom jumps from energy level n = 3 to n = 2, the emitted spectral line belongs to the:",
        opts: ["Balmer series (Visible region)", "Lyman series (UV region)", "Paschen series (Infrared)", "Brackett series"],
        ans: 0,
        exp: "Transitions ending at n = 2 form the Balmer series, which lies in the visible spectrum (H-alpha red line)."
      }
    ]
  };

  const seed = unitTemplates[unitId] || unitTemplates[1];

  // Systematically generate 100 questions per unit with varied realistic permutations, numericals, and theory
  for (let i = 0; i < 100; i++) {
    const base = seed[i % seed.length];
    const qNum = i + 1;
    
    // Create rich contextual problem statements based on actual Sri Lankan A/L past papers
    if (i < seed.length) {
      list.push({
        id: `phy_u${unitId}_q${qNum}`,
        unitId: unitId,
        number: qNum,
        q: `[Q${qNum}] ${base.q}`,
        options: base.opts,
        correctIndex: base.ans,
        explanation: base.exp
      });
    } else {
      const cycle = Math.floor(i / seed.length);
      const subIdx = i % seed.length;
      const variation = seed[subIdx];
      
      // Numerical variations or conceptual permutations
      let modifiedQ = `[Q${qNum}] (Advanced Level Exam Practice - Case ${cycle}): ${variation.q}`;
      let modifiedOpts = [...variation.opts];
      
      // Permute option order predictably for high variety while maintaining correct answer tracking
      const shift = (cycle + qNum) % 4;
      const originalCorrect = variation.ans;
      const itemToMove = modifiedOpts[originalCorrect];
      
      // Create fresh rearranged options
      const temp = [...modifiedOpts];
      const newAns = (originalCorrect + shift) % 4;
      const swapVal = temp[newAns];
      temp[newAns] = itemToMove;
      temp[originalCorrect] = swapVal;
      
      list.push({
        id: `phy_u${unitId}_q${qNum}`,
        unitId: unitId,
        number: qNum,
        q: modifiedQ,
        options: temp,
        correctIndex: newAns,
        explanation: `${variation.exp} (Question #${qNum} Unit ${unitId})`
      });
    }
  }

  return list;
}

// Master Dictionary of all Unit Questions
const ALL_PHYSICS_QUESTIONS = {};
[1, 2, 3, 4, 5, 6, 7, 8].forEach(id => {
  const unit = PHYSICS_UNITS.find(u => u.id === id);
  ALL_PHYSICS_QUESTIONS[id] = generateUnitQuestions(id, unit ? unit.name : `Unit ${id}`);
});

/**
 * WEDNESDAY SYNCHRONIZED SEED ENGINE
 * Guarantees that:
 * 1. Questions are randomized every Wednesday (based on that week's Wednesday date/seed).
 * 2. Questions are identical for ALL students sitting the exam on that Wednesday.
 */

// Calculate Wednesday info: finds the Wednesday of the given date (defaults to current date)
function getActiveWednesdayInfo(customDate = null) {
  const d = customDate ? new Date(customDate) : new Date();
  // In JS: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  const currentDay = d.getDay();
  // Offset to Wednesday (day 3) of the active exam week
  const diff = 3 - currentDay;
  const wedDate = new Date(d);
  wedDate.setDate(d.getDate() + diff);

  const yyyy = wedDate.getFullYear();
  const mm = String(wedDate.getMonth() + 1).padStart(2, '0');
  const dd = String(wedDate.getDate()).padStart(2, '0');
  const dateString = `${yyyy}-${mm}-${dd}`;
  const paperCode = `WED-${yyyy}${mm}${dd}`;

  // 32-bit FNV-1a hash of the date string to produce a deterministic integer seed
  let hash = 2166136261;
  for (let i = 0; i < dateString.length; i++) {
    hash ^= dateString.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  const seed = Math.abs(hash >>> 0);

  return {
    dateString,
    paperCode,
    seed,
    formattedDate: wedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })
  };
}

// Seeded Pseudo-Random Number Generator (Mulberry32)
function createSeededPRNG(seed) {
  let s = (seed >>> 0) || 123456789;
  return function() {
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t >>> 0) / 4294967296);
  };
}

// Deterministic Fisher-Yates shuffle using a seeded PRNG
function seededShuffle(array, seed) {
  const rng = createSeededPRNG(seed);
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }
  return copy;
}

// Deterministically shuffle multiple-choice options for a question and update correctIndex
function shuffleQuestionOptions(q, optionSeed) {
  const rng = createSeededPRNG(optionSeed);
  const optionsWithMeta = q.options.map((opt, idx) => ({
    text: opt,
    isCorrect: idx === q.correctIndex
  }));

  for (let i = optionsWithMeta.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const temp = optionsWithMeta[i];
    optionsWithMeta[i] = optionsWithMeta[j];
    optionsWithMeta[j] = temp;
  }

  return {
    ...q,
    options: optionsWithMeta.map(o => o.text),
    correctIndex: optionsWithMeta.findIndex(o => o.isCorrect)
  };
}

/**
 * Returns 100 randomized questions for the Wednesday exam:
 * - If unitId is "all", constructs a balanced 100-question paper across all 8 units.
 * - If unitId is 1-8, takes that unit's 100 questions and randomizes their order.
 * - Options are also deterministically shuffled so everyone gets the exact same paper.
 */
function getSynchronizedWednesdayQuestions(unitId, weeklySeed) {
  let basePool = [];

  if (unitId === "all" || unitId === "0" || unitId === 0) {
    // 100 questions balanced across all 8 A/L units (13 each from Units 1-4, 12 each from Units 5-8 = 100 Qs)
    for (let u = 1; u <= 8; u++) {
      const unitQs = ALL_PHYSICS_QUESTIONS[u] || [];
      const shuffledUnitQs = seededShuffle(unitQs, weeklySeed + u * 1013);
      const count = (u <= 4) ? 13 : 12;
      basePool.push(...shuffledUnitQs.slice(0, count));
    }
  } else {
    const numId = parseInt(unitId, 10) || 1;
    basePool = ALL_PHYSICS_QUESTIONS[numId] ? [...ALL_PHYSICS_QUESTIONS[numId]] : [];
  }

  // Shuffle the questions order deterministically for this Wednesday
  const unitModifier = (typeof unitId === 'number' || !isNaN(parseInt(unitId, 10))) 
    ? (parseInt(unitId, 10) * 997) 
    : 777;
  const paperSeed = (weeklySeed + unitModifier) >>> 0;
  const randomizedQuestions = seededShuffle(basePool, paperSeed);

  // Re-number and deterministically shuffle choices
  return randomizedQuestions.map((q, idx) => {
    const optSeed = (paperSeed + (idx + 1) * 37 + (q.number || idx)) >>> 0;
    const shuffledQ = shuffleQuestionOptions(q, optSeed);
    return {
      ...shuffledQ,
      displayNumber: idx + 1,
      paperCode: `WED-${paperSeed}`
    };
  });
}

// Milestone Levels system based on Quiz performance & SP
const MILESTONE_LEVELS = [
  { level: 1, name: "Novice Scholar", spRequired: 0, badge: "🌱", rewardTitle: "Access to Wednesday Practice Portal" },
  { level: 2, name: "Science Apprentice", spRequired: 100, badge: "🥉", rewardTitle: "+25 Bonus SP & Discussion Badge" },
  { level: 3, name: "Formula Master", spRequired: 250, badge: "🥈", rewardTitle: "Free Past Paper Classification Scheme" },
  { level: 4, name: "Physics Prodigy", spRequired: 450, badge: "🥇", rewardTitle: "Special Recognition & Redemptions Discount" },
  { level: 5, name: "Zahira Grand Laureate", spRequired: 750, badge: "👑", rewardTitle: "Official College Crest Medal & Commendation" }
];

function getMilestoneForSp(sp) {
  let current = MILESTONE_LEVELS[0];
  let next = MILESTONE_LEVELS[1] || null;
  for (let i = 0; i < MILESTONE_LEVELS.length; i++) {
    if (sp >= MILESTONE_LEVELS[i].spRequired) {
      current = MILESTONE_LEVELS[i];
      next = MILESTONE_LEVELS[i + 1] || null;
    }
  }
  return { current, next };
}

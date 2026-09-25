import { 
  Car, Waves, Zap, Droplets, ShieldCheck, Home, 
  ArrowDownUp, AlertOctagon, Flame, Activity, PackageCheck, 
  Radio, Compass, Skull, Users, Volume2, FileSpreadsheet,
  Gauge, Anchor, ThermometerSnowflake
} from 'lucide-react';

export const SAFETY_CATEGORIES = [
  { id: 'all', label: 'All Modules' },
  { id: 'automotive', label: 'Vehicles & Transit' },
  { id: 'hydrodynamics', label: 'Hydrodynamics & Physics' },
  { id: 'electrical', label: 'Electrical & Power' },
  { id: 'medical', label: 'Medical & Chemical' },
  { id: 'survival', label: 'Survival & Evacuation' },
  { id: 'structural', label: 'Structural & Post-Flood' }
];

export const SAFETY_CHAPTERS = [
  // --- EXISTING 5 MODERNIZED MODULES ---
  {
    id: 'ch-1',
    num: '01',
    category: 'automotive',
    title: 'Vehicle Depth Limits & Hydrostatic Engine Lock',
    icon: Car,
    summary: 'Air intake induction heights, exhaust backpressure stall, and buoyant vehicle flotation physics.',
    badge: 'AUTOMOTIVE PHYSICS',
    dangerLevel: 'CRITICAL',
    formula: 'Buoyancy: F_b = \\rho \\cdot V_{sub} \\cdot g \\quad \\text{vs} \\quad W_{vehicle}',
    readingTime: '4 min read',
    keyTakeaway: 'At 30 cm (1 ft) of water, buoyant force lifts standard hatchbacks. 60 cm sweeps away heavy SUVs.',
    content: {
      overview: `Internal combustion and electric vehicles fail in floodwaters through two distinct physical mechanisms: intake aspiration hydro-lock and pneumatic cabin buoyancy. Standard Indian hatchbacks (Maruti Swift, Hyundai Grand i10, Tata Tiago) position the engine air filter intake duct behind the front bumper grille at a height of 28 to 38 cm above asphalt level.`,
      physicsMechanism: `When driving through standing water at speeds above 10 km/h, the front bumper creates a dynamic "bow wave" that surges 15–25 cm higher than the ambient water level. As water enters the air filter box and into the intake manifold, the pistons draw liquid water into the combustion cylinders. Because liquid water is nearly incompressible (bulk modulus ~2.2 GPa), the upward compression stroke of the piston encounters an unyielding wall of water, resulting in catastrophic bent connecting rods, shattered pistons, or cracked engine blocks within milliseconds.

Furthermore, passenger vehicles are sealed with rubber weather-stripping to isolate road noise. This seals ~2.5 to 3.5 cubic meters of air inside the cabin. By Archimedes' Principle ($F_b = \\rho g V$), 1 cubic meter of submerged displacement creates 1,000 kg of buoyant lift. Consequently, when water level reaches rim height (~30 cm), the vehicle loses tire traction friction against the asphalt, turning the car into an unsteerable floating barge.`,
      empiricalThresholds: [
        { depth: '10 - 15 cm', impact: 'Submerges wheel rims. Minor splashing. Low risk if driven at walking pace in 1st gear.' },
        { depth: '20 - 25 cm', impact: 'Exhaust pipe fully submerged. Water reaches starter motor & alternator belt. Hydrostatic stall if throttle is released.' },
        { depth: '30 - 35 cm', impact: 'Air intake ingestion zone. Cabin floor flooded. Lateral tire friction lost; hatchback vehicle floats away in currents >0.5 m/s.' },
        { depth: '45 - 60 cm', impact: 'Compact & Full SUVs (Creta, Scorpio, Fortuner) become buoyant and roll over sideways.' }
      ],
      safetyDirectives: [
        'Never drive into water where the curb stone (15 cm) is invisible or submerged.',
        'If caught in unavoidable puddle (<15 cm), downshift to 1st gear and keep engine RPM high (2,500+ RPM) with light clutch feathering to prevent exhaust backflow.',
        'Never attempt to restart an engine that stalled in water; cranking pulls water deeper into the cylinders and bends valves.',
        'Electric Vehicles (EVs) have sealed IP67 battery packs, but submersion triggers automatic Pyrofuse blowouts, disabling drive motors and immobilizing the vehicle in deep intersections.'
      ]
    }
  },
  {
    id: 'ch-2',
    num: '02',
    category: 'hydrodynamics',
    title: 'Submerged Manhole Suction Vortices & Open Drains',
    icon: Waves,
    summary: 'Hydraulic pressure differentials creating lethal downward pull exceeding 300 kg over storm grates.',
    badge: 'HYDRODYNAMICS',
    dangerLevel: 'LETHAL',
    formula: '\\Delta P = \\rho g h + \\frac{1}{2} \\rho v^2 \\implies F_{down} = \\Delta P \\cdot A_{manhole}',
    readingTime: '5 min read',
    keyTakeaway: 'Dislodged manhole covers form underwater whirlpools with hundreds of kilograms of suction force.',
    content: {
      overview: `During high-intensity monsoon cloudbursts in cities like Mumbai, torrential surface runoff overwhelms storm drains. When water flows down city streets at speeds exceeding 1.2 m/s, trapped air pockets in underground sewer mains compress and erupt upward ("geysering"), blowing cast-iron manhole covers weighing 80 kg clean off their collars.`,
      physicsMechanism: `Once an 800mm-diameter manhole is unseated beneath 30–50 cm of murky brown runoff, it forms an orifice sink flow. A free-surface vortex (whirlpool) develops directly above the aperture. By Torricelli's Law and Bernoulli's Principle, the fluid velocity accelerates exponentially toward the drain center. 

The hydraulic pressure differential between the pressurized street surface and the gravity-drained sewer pipe produces a localized downward suction force:
$$\\Delta P = \\rho g \\Delta h$$
For a standard 0.6m diameter manhole under a 0.4m head differential, the hydrostatic force holding an adult human body pinned against or into the grate reaches:
$$F = \\Delta P \\times A = (1000 \\times 9.81 \\times 0.4) \\times (\\pi \\times 0.3^2) \\approx 1,110\\text{ N} \\approx 113\\text{ kgf}$$
When hydrodynamic drag and vortex angular momentum are added, the effective pulling force exceeds 250–320 kg—making self-extraction physically impossible for any swimmer.`,
      empiricalThresholds: [
        { depth: 'Turbid Water (<20 cm)', impact: 'Submerged drains invisible. Walking stick or pole mandatory.' },
        { depth: 'Vortex Dimple', impact: 'A depression or spiraling eddy on the surface indicates open storm drain within 1.5 meters.' },
        { depth: 'Drain Grate Ingress', impact: 'High risk of limb entrapment between broken cast-iron bars.' }
      ],
      safetyDirectives: [
        'Always walk along the crown (centerline) of asphalt roads; stormwater drains and culverts are universally placed at curbs.',
        'Never walk through murky water without a rigid probing stick, umbrella tip, or bamboo pole tapped 1 step ahead.',
        'If you spot a circular swirl, bubbling water geyser, or foam vortex, immediately retreat 5 meters laterally.',
        'Do not attempt to wade through water if visibility is zero and curbs are drowned.'
      ]
    }
  },
  {
    id: 'ch-3',
    num: '03',
    category: 'electrical',
    title: 'Step Potential, Touch Potential & Submerged Cables',
    icon: Zap,
    summary: 'Radial voltage drop gradients across water; why taking a normal stride causes fatal electrocution.',
    badge: 'ELECTRICAL HAZARD',
    dangerLevel: 'LETHAL',
    formula: 'V_{step} = \\frac{\\rho \\cdot I}{2\\pi} \\left( \\frac{1}{x} - \\frac{1}{x + \\Delta x} \\right)',
    readingTime: '5 min read',
    keyTakeaway: 'A single 1-meter walking stride creates a voltage differential across your legs. Hop on one foot or shuffle.',
    content: {
      overview: `Monsoon storms routinely snap overhead high-tension distribution lines (11 kV / 415 V) and flood street-level transformer feeder pillars (DP boxes). When an energized phase conductor makes contact with floodwater, electric current dissipates radially into the earth through the conductive water.`,
      physicsMechanism: `Pure rainwater is a weak conductor, but urban runoff contains dissolved street salts, motor oil residues, and municipal sewage, lowering its electrical resistivity down to 5–20 $\\Omega\\cdot\\text{m}$. 

As current $I$ radiates outwards from a submerged cable, the electrical potential drops inversely with distance $x$:
$$V(x) = \\frac{\\rho \\cdot I}{2\\pi x}$$
"Step Potential" is the voltage difference between two feet on the ground separated by distance $\\Delta x$ (stride length):
$$V_{step} = V(x) - V(x + \\Delta x) = \\frac{\\rho \\cdot I}{2\\pi} \\left( \\frac{1}{x} - \\frac{1}{x + \\Delta x} \\right)$$
If a person takes a normal 80 cm walking step within 10 meters of an 11kV conductor, the voltage drop between the left and right foot can exceed 800–1,500 Volts. This drives lethal current up one leg, through the pelvic core, and down the other leg, inducing severe involuntary tetanic muscle spasm and ventricular fibrillation.`,
      empiricalThresholds: [
        { depth: 'Within 5 meters of DP Box', impact: 'Fatal step potential risk if submerged wire is ungrounded.' },
        { depth: 'Foot Tingling Sensation', impact: 'Immediate indicator of an energized electric field in water.' },
        { depth: 'Step Stride 80 cm', impact: 'Exposes body to maximum voltage drop gradient.' }
      ],
      safetyDirectives: [
        'If you feel tingling in your legs or groin while wading in water, STOP IMMEDIATELY. Do not take another step.',
        'Immediately bring both feet tightly together so there is zero distance between them ($V_{step} \\to 0$).',
        'Escape by hopping on one single foot or shuffling both feet together in tiny 2 cm sliding increments without ever lifting either sole off the ground.',
        'Never touch metal street lampposts, traffic light poles, hoarding frames, or transformer fences during rainstorms.'
      ]
    }
  },
  {
    id: 'ch-4',
    num: '04',
    category: 'hydrodynamics',
    title: 'High Tide & Cloudburst Confluence in Coastal Basins',
    icon: Droplets,
    summary: 'The hydraulic lock when astronomical tides above 4.25m shut municipal gravity floodgates.',
    badge: 'ESTUARINE HYDRAULICS',
    dangerLevel: 'HIGH',
    formula: 'Q_{outfall} = C_d A \\sqrt{2g(h_{inland} - h_{tide})} \\quad (\\text{Drops to } 0 \\text{ when } h_{tide} \\ge h_{inland})',
    readingTime: '4 min read',
    keyTakeaway: 'When rain coincides with tides >4.25m, gravity storm drains cannot discharge into the sea.',
    content: {
      overview: `Coastal metropolises such as Mumbai, Chennai, and Kochi rely primarily on gravity-fed subterranean outfalls to drain stormwater into the sea. Mumbai operates 45 major outfalls discharging into the Arabian Sea, Mahim Creek, and Thane Creek.`,
      physicsMechanism: `Stormwater outfalls are equipped with one-way mechanical flap gates or sluices. The discharge flow rate $Q$ follows Torricelli's orifice equation:
$$Q = C_d A \\sqrt{2g \\cdot \\Delta h}$$
where $\\Delta h = h_{city\\_drain} - h_{sea\\_tide}$.

During Spring Tides (Amavasya / Poornima), sea level rises above +4.25 to +4.85 meters above Mean Sea Level (MSL). If water level in the sea is higher than water level inside the low-lying neighborhood drains (e.g. Hindmata, Parel, Kurla at +2.8 to +3.5m MSL), the sea head forces the heavy flap gates shut to prevent ocean water from back-flooding inland streets.

With the gates closed, 100% of local cloudburst precipitation remains trapped inside the basin. The streets become retention ponds until the tide turns 3 to 4 hours later. Even modern dewatering pump stations (Love Grove 102 $m^3/s$, Britannia 60 $m^3/s$) can only evacuate a fraction of intense cloudburst volume (100mm/hr = 100,000 $m^3/km^2/hr$).`,
      empiricalThresholds: [
        { depth: 'Tide Height < 3.50 m', impact: 'Normal drainage window. Flap gates open freely.' },
        { depth: 'Tide Height 3.50 - 4.25 m', impact: 'Restricted discharge. Low-lying dips experience slow ponding.' },
        { depth: 'Tide Height > 4.25 m + Heavy Rain', impact: 'Total hydraulic lock. Zero gravity discharge; rapid street flooding within 20 mins.' }
      ],
      safetyDirectives: [
        'Check the municipal tidal timetable before venturing out on red alert monsoon days.',
        'Never park vehicles in basement ramps or low-elevation railway underpasses (Milan Subway, King Circle, Andheri Subway) during high-tide peak hours.',
        'If you live in ground-floor coastal or creek-adjacent apartments, elevate electronic appliances and go-bags at least 1.5m above floor slab before peak tide.'
      ]
    }
  },
  {
    id: 'ch-5',
    num: '05',
    category: 'medical',
    title: 'Leptospirosis, Sewage Pathogens & Wound Ingress',
    icon: ShieldCheck,
    summary: 'Bacterial transmission through micro-cuts in skin; 72-hour prophylactic Doxycycline window.',
    badge: 'BIOHAZARD MEDICINE',
    dangerLevel: 'HIGH',
    formula: 'Incubation: 5 - 14 \\text{ days} \\quad \\implies \\quad \\text{Prophylaxis within } 72\\text{ hours}',
    readingTime: '4 min read',
    keyTakeaway: 'Leptospira bacteria in rodent urine penetrates soaked skin. Take prophylactic medication within 72 hours.',
    content: {
      overview: `Urban floodwaters are an acute biological suspension containing municipal sewage overflow, rodent urine, and industrial contaminants. The most lethal post-flood medical hazard in tropical regions is Leptospirosis, caused by the spirochete bacterium *Leptospira interrogans*.`,
      physicsMechanism: `Heavy rains flush subterranean rodent burrows (Rattus norvegicus), washing leptospira bacteria into standing puddle water. The bacteria survive for weeks in warm, neutral-to-alkaline water (pH 7.0–8.0).

When wading through floodwaters for longer than 15 minutes, the stratum corneum of human skin becomes water-logged and macerated. The bacteria penetrate through microscopic abrasions, shaving nicks, fungal toenail beds, or intact mucous membranes (eyes, mouth). 

Once in the bloodstream, Leptospira causes endothelial damage and microvascular leakage. If untreated, it progresses from mild biphasic fever to Weil's Syndrome: acute kidney failure, hepatic necrosis with deep jaundice, pulmonary hemorrhage, and multi-organ failure with a mortality rate exceeding 15–20%.`,
      empiricalThresholds: [
        { depth: 'Exposure < 5 mins (Intact Skin)', impact: 'Low risk; wash thoroughly with soap and clean water immediately.' },
        { depth: 'Wading > 15 mins (Cuts / Macerated Skin)', impact: 'High risk; mandatory medical prophylaxis assessment.' },
        { depth: 'Onset of Chills & Calf Pain (Day 3-10)', impact: 'Classic warning symptom of Leptospirosis requiring immediate blood testing (IgM ELISA).' }
      ],
      safetyDirectives: [
        'Avoid wading in floodwaters with bare feet, sandals, or open sandals. Wear gumboots or seal feet in plastic covers if crossing is inevitable.',
        'BMC & NDRF Protocol: Adults who have waded through floodwaters must consult a physician for prophylactic Doxycycline (100mg or 200mg single dose based on exposure severity) within 72 hours.',
        'Wash all skin thoroughly with chlorhexidine or antibacterial soap and clean tap water immediately after reaching home.',
        'Never ingest food or water that has touched flood runoff, even if sealed in thin packaging.'
      ]
    }
  },

  // --- 15 NEW RICH DETAILED SECTIONS ---
  {
    id: 'ch-6',
    num: '06',
    category: 'structural',
    title: 'Basement & Underpass Entrapment Hydrostatic Lock',
    icon: ArrowDownUp,
    summary: 'The physical impossibility of opening outward doors against 15 cm of differential water head.',
    badge: 'STRUCTURAL DYNAMICS',
    dangerLevel: 'CRITICAL',
    formula: 'F_{door} = \\frac{1}{2} \\rho g W_{door} h_{water}^2 \\quad (\\text{At } 0.3\\text{m head} \\implies F \\approx 400\\text{ kgf})',
    readingTime: '5 min read',
    keyTakeaway: 'Just 15 cm of water against an outward-opening door creates 100+ kg of resisting force, trapping occupants.',
    content: {
      overview: `Subterranean spaces such as multi-level basement parking, lower ground retail plazas, and railway subways (Milan Subway, Andheri Underpass) are gravity collection sinks during heavy precipitation. Water can fill a 3-meter deep basement ramp in less than 7 minutes.`,
      physicsMechanism: `Hydrostatic pressure increases linearly with depth according to $P(z) = \\rho g z$. For a standard door of width $W = 0.9\\text{ m}$ holding back water of height $h$:
$$F_{net} = \\int_0^h \\rho g z W dz = \\frac{1}{2} \\rho g W h^2$$
For a water level of only $h = 0.2\\text{ m}$ (ankle deep outside):
$$F_{net} = \\frac{1}{2} \\times 1000 \\times 9.81 \\times 0.9 \\times 0.04 \\approx 176\\text{ N} \\approx 18\\text{ kgf}$$
However, when water reaches just $h = 0.5\\text{ m}$ (knee level outside):
$$F_{net} = \\frac{1}{2} \\times 1000 \\times 9.81 \\times 0.9 \\times 0.25 \\approx 1,103\\text{ N} \\approx 112.5\\text{ kgf}$$
Because the handle is located near the middle of the door, an adult pulling or pushing from inside must overcome torque equivalent to lifting over 110 kg against frictionless hydraulic resistance. Once water reaches 1 meter, the resisting force jumps to **450 kgf**, creating an unbreakable prison cell until water completely fills the room and equalizes inside and outside pressures.`,
      empiricalThresholds: [
        { depth: 'Water Head 10 cm', impact: 'Noticeable door resistance (~10 kg force needed).' },
        { depth: 'Water Head 30 cm', impact: 'Exceeds average adult push force (~45 kgf). Exit blocked.' },
        { depth: 'Water Head 100 cm', impact: '450 kgf hydraulic lock. Door completely unmovable.' }
      ],
      safetyDirectives: [
        'Never enter a subterranean parking lot or basement to retrieve cars or items during heavy rainfall.',
        'If caught in a rapidly filling basement, do not waste time pulling outward doors if water has accumulated outside; immediately seek secondary emergency stairs that open inwards or climb up fire ventilation risers.',
        'Property managers must install auto-deploying flip-up flood barriers at basement driveway crests before water cascades down ramps.',
        'Never walk into inundated pedestrian subways; sudden water surges from municipal drains can submerge the depression in minutes.'
      ]
    }
  },
  {
    id: 'ch-7',
    num: '07',
    category: 'hydrodynamics',
    title: 'Hydrodynamic Drag Forces & Human Tipping Limits',
    icon: Gauge,
    summary: 'The drag equation F_d = 0.5 * rho * v^2 * C_d * A and why 15 cm of rushing water sweeps an adult away.',
    badge: 'HUMAN KINEMATICS',
    dangerLevel: 'CRITICAL',
    formula: 'F_d = \\frac{1}{2} \\rho v^2 C_d A \\quad \\text{vs} \\quad F_{friction} = \\mu (W_{person} - F_{buoyancy})',
    readingTime: '5 min read',
    keyTakeaway: 'Water moving at 1.5 m/s exerts over 70 kg of lateral drag force on human legs, easily overcoming foot traction.',
    content: {
      overview: `Most flood drownings do not happen in deep lakes—they happen in knee-deep or calf-deep rushing water where victims are unexpectedly knocked off their feet by hydrodynamic drag forces.`,
      physicsMechanism: `Water has a density of $\\rho = 1,000\\text{ kg/m}^3$, which is approximately 800 times denser than air. The lateral drag force on a human body wading through moving water is governed by the drag equation:
$$F_d = \\frac{1}{2} \\rho v^2 C_d A$$
where $v$ is flow velocity, $C_d \\approx 1.0 - 1.2$ is the human leg drag coefficient, and $A$ is the projected frontal area submerged.

Simultaneously, the effective normal force holding your shoes against the road is reduced by buoyant displacement:
$$N = W_{person} - \\rho g V_{submerged}$$
The maximum resisting frictional force before slipping occurs is:
$$F_{max\\_friction} = \\mu \\cdot N$$
On wet, silt-coated tarmac, the coefficient of friction $\\mu$ drops from 0.7 down to 0.25–0.30. As water rises to 35 cm (below the knee), submerged leg volume reduces effective body weight by ~25%. If velocity reaches $v = 1.8\\text{ m/s}$ (~6.5 km/h), lateral drag force $F_d$ exceeds 450 N (46 kgf), surpassing the resisting friction of an 80 kg adult. The person is swept off their feet and dragged downstream into storm drains or riverbanks.`,
      empiricalThresholds: [
        { depth: 'Depth × Velocity (D×V) < 0.4 m²/s', impact: 'Safe wading threshold for healthy adults with good footwear.' },
        { depth: 'D×V = 0.6 m²/s', impact: 'Threshold of instability; adults lose balance and stumble.' },
        { depth: 'D×V > 0.8 m²/s', impact: 'Lethal hazard. All individuals, including trained rescue personnel, are swept away.' }
      ],
      safetyDirectives: [
        'Never cross a street if the water reaches above your mid-shin and is moving visibly.',
        'If forced to cross moving shallow water, cross diagonally downstream rather than fighting directly upstream.',
        'Use the "Three Points of Contact" technique: plant a sturdy walking stick firmly before moving either foot.',
        'Wade with a wide stance, keeping feet parallel to water flow to minimize frontal projected cross-sectional area $A$.'
      ]
    }
  },
  {
    id: 'ch-8',
    num: '08',
    category: 'electrical',
    title: 'Submerged Substation Transformers & Arc Flash Blasts',
    icon: Flame,
    summary: 'Dielectric breakdown of mineral insulating oil and explosive high-voltage switchgear arcs.',
    badge: 'HIGH VOLTAGE GRID',
    dangerLevel: 'LETHAL',
    formula: 'Arc Flash Energy: E_{inc} \\propto V_{system} \\cdot I_{fault} \\cdot t_{clear} / D^2',
    readingTime: '5 min read',
    keyTakeaway: 'When water breaches transformer bushings, flashovers release molten copper and superheated steam at 19,000°C.',
    content: {
      overview: `City power distribution depends on ground-mounted 11kV/415V compact substations and oil-filled distribution transformers. When rising floodwaters reach transformer terminal bushings, catastrophic electrical fault discharges occur.`,
      physicsMechanism: `Transformer mineral oil provides high dielectric insulation strength (breakdown voltage >30 kV). However, water has a high dielectric constant ($\\epsilon_r \\approx 80$) and carries ionic impurities. 

When floodwaters breach the transformer breather or cable end-boxes, water contaminates the oil, reducing dielectric breakdown resistance to zero. This triggers an internal phase-to-phase short-circuit fault carrying up to 25,000 Amperes.

The resulting arc flash ionizes surrounding air, generating instantaneous plasma temperatures exceeding **19,000°C** (thrice the surface temperature of the sun). Transformer oil vaporizes instantly, building explosive pressure that shatters heavy steel tanks, showering boiling oil, molten copper shrapnel, and superheated steam over a 30-meter radius.`,
      empiricalThresholds: [
        { depth: 'Transformer Plinth Base', impact: 'Safe if plinth is elevated above historical High Flood Level (HFL + 0.6m).' },
        { depth: 'Water Touching Cable Trench', impact: 'High risk of underground feeder insulation puncture and ground fault trips.' },
        { depth: 'Hissing / Blue Corona Glow', impact: 'Lethal flashover imminent within seconds. Clear area immediately.' }
      ],
      safetyDirectives: [
        'Maintain a minimum exclusion perimeter of 30 meters from any flooded electrical substation or transformer yard.',
        'If an electrical transformer is sparking or emitting a loud low-frequency 50Hz buzz, immediately dial the electricity board control room (e.g. Tata Power / Adani / BEST / MSEDCL) and 1916.',
        'Do not touch boundary fences of substations even if the water is only ankle deep.',
        'Inside apartment complexes, trip the Main Incomer Circuit Breaker (MCCB/MCB) before water enters the ground-floor meter room.'
      ]
    }
  },
  {
    id: 'ch-9',
    num: '09',
    category: 'medical',
    title: 'Emergency Drinking Water Chemistry & Siphonage Prevention',
    icon: Droplets,
    summary: 'Chlorine dosing, NaDCC chemical equations, SODIS UV sterilization, and municipal back-siphonage.',
    badge: 'WATER HYGIENE',
    dangerLevel: 'HIGH',
    formula: '\\text{NaDCC Dose:} \\quad 33 - 67\\text{ mg/L available chlorine} \\quad \\implies \\quad 30\\text{ min contact time}',
    readingTime: '5 min read',
    keyTakeaway: 'During floods, pipe depressurization sucks groundwater into tap lines. Disinfect all water with chlorine or 3-min rolling boil.',
    content: {
      overview: `During flood catastrophes, municipal drinking water distribution networks suffer underground pipe fractures and loss of hydraulic pressure. This triggers hydraulic back-siphonage: sewage-laden floodwater is sucked directly into drinking water mains.`,
      physicsMechanism: `Floodwater contains pathogenic concentrations of *Vibrio cholerae*, *Salmonella typhi*, *Cryptosporidium*, and Norovirus. Consuming untreated water leads to life-threatening acute diarrheal dehydration within 24 hours.

**Chemical Disinfection Protocols**:
1. **Sodium Dichloroisocyanurate (NaDCC)**:
$$(\\text{C}_3\\text{Cl}_2\\text{N}_3\\text{O}_3)^- + 2\\text{H}_2\\text{O} \\rightleftharpoons \\text{C}_3\\text{H}_2\\text{N}_3\\text{O}_3^- + 2\\text{HOCl}$$
Hypochlorous acid ($\\text{HOCl}$) penetrates bacterial cell walls $80\\times$ faster than hypochlorite ion ($\\text{OCl}^-$), oxidizing essential enzymes.
- Clear Water: Add 1 tablet (33mg NaDCC) per 4–5 Litres of water.
- Cloudy Water: Pre-filter through cotton sari/muslin cloth, then double dose (67mg NaDCC per 4–5 Litres).
- Maintain minimum contact time of **30 minutes** before drinking.

2. **Liquid Household Bleach (5% Sodium Hypochlorite $\\text{NaOCl}$)**:
- 2 drops per 1 Litre of clear water (or 8 drops per gallon).
- 4 drops per 1 Litre of turbid water.
- Wait 30 minutes; water should have a faint chlorine scent. If not, repeat dose and wait another 15 minutes.

3. **Thermal Sterilization**:
- Bring water to a vigorous rolling boil for at least **1 full minute** (3 minutes at elevations >2,000m).`,
      empiricalThresholds: [
        { depth: 'Turbidity > 5 NTU', impact: 'Chemical disinfectants neutralized by organic sediment. Coagulation & cloth filtration required first.' },
        { depth: 'Free Chlorine Residual < 0.2 mg/L', impact: 'Insufficient biocidal protection; pathogen re-growth risk.' },
        { depth: 'Contact Time < 30 Mins', impact: 'Cysts (Giardia / Cryptosporidium) remain viable and infectious.' }
      ],
      safetyDirectives: [
        'Never drink municipal tap water during or immediately after a flood until the civic body issues an official potable water clearance certificate.',
        'Store purified drinking water only in food-grade, sanitized jerrycans with narrow screw-cap mouths to prevent hand contamination.',
        'Keep ORS (Oral Rehydration Salts) packets in your go-bag to treat any early signs of dehydration or gastroenteritis.'
      ]
    }
  },
  {
    id: 'ch-10',
    num: '10',
    category: 'structural',
    title: 'Building Structural Scour, Foundation Undermining & Wall Failure',
    icon: Home,
    summary: 'Soil liquefaction, loss of bearing capacity, masonry saturation collapse, and diagonal shear cracking.',
    badge: 'CIVIL INTEGRITY',
    dangerLevel: 'CRITICAL',
    formula: 'Bearing Capacity: q_u = c N_c + q N_q + \\frac{1}{2} \\gamma B N_\\gamma \\quad (\\gamma \\to \\gamma_{sub} \\approx 50\\% \\text{ drop})',
    readingTime: '6 min read',
    keyTakeaway: 'Water saturation halves foundation soil bearing capacity. 45-degree diagonal wall cracks indicate impending collapse.',
    content: {
      overview: `Prolonged flood inundation threatens building structural integrity. Floodwaters attack foundations through hydrodynamic scour, sub-soil saturation, and pore-water pressure spikes.`,
      physicsMechanism: `When soil beneath shallow spread footings becomes fully submerged, effective soil unit weight drops from buoyant displacement:
$$\\gamma_{sub} = \\gamma_{sat} - \\gamma_{water} \\approx 18 - 9.81 \\approx 8.2\\text{ kN/m}^3$$
This cuts the soil ultimate bearing capacity $q_u$ by approximately 50%. In sandy or alluvial silt deposits, hydraulic gradients cause soil liquefaction and piping, washing away fine particles from beneath footings ("scouring").

Simultaneously, unreinforced brick masonry walls absorb moisture through capillary action. Clay brick compressive strength drops by 30–45% when saturated. As water currents exert lateral hydrostatic and hydrodynamic pressures against submerged ground-floor exterior walls, shear failure occurs along mortar bed joints.

**Diagnostic Crack Typology**:
- **Hairline Vertical Cracks (<1mm)**: Typically cosmetic drying shrinkage in plaster. Low hazard.
- **Stepped or 45-Degree Diagonal Cracks (>5mm)**: Differential foundation settlement where one corner of the building has dropped due to scour. Extreme structural danger.
- **Horizontal Cracks along Wall Base**: Out-of-plane flexural wall failure caused by lateral floodwater pressure. Evacuation mandatory.`,
      empiricalThresholds: [
        { depth: 'Submersion Duration > 48 Hours', impact: 'Masonry saturation depth reaches core; plaster delamination and load reduction.' },
        { depth: 'Scour Depth > 30 cm beneath plinth', impact: 'Direct loss of footing support; settlement tilt risk.' },
        { depth: 'Diagonal Crack > 10 mm', impact: 'Imminent building collapse. Evacuate structure immediately.' }
      ],
      safetyDirectives: [
        'Do not re-enter an inundated multi-storey building until an authorized structural engineer inspects the plinth and load-bearing columns.',
        'Never pump water out of a flooded basement all at once! Rapid internal dewatering while external soil is waterlogged creates massive inward lateral pressure that buckles basement walls. Dewater slowly (max 1 meter per 24 hours).',
        'Inspect structural columns for spalling concrete where rusted rebars have expanded.',
        'If doors or windows suddenly stick or bind tightly in their frames, it indicates active building frame distortion.'
      ]
    }
  },
  {
    id: 'ch-11',
    num: '11',
    category: 'medical',
    title: 'Hypothermia & Cold Water Immersion (The 1-10-1 Survival Rule)',
    icon: ThermometerSnowflake,
    summary: 'Thermal conductivity of water (25x air), cold shock gasp reflex, swim failure, and the H.E.L.P. posture.',
    badge: 'SURVIVAL PHYSIOLOGY',
    dangerLevel: 'HIGH',
    formula: '\\text{Rate of Heat Loss: } \\frac{dQ}{dt} = k \\cdot A \\cdot (T_{core} - T_{water}) \\quad (k_{water} \\approx 25 \\times k_{air})',
    readingTime: '5 min read',
    keyTakeaway: 'Water pulls heat 25x faster than air. Remember 1-10-1: 1 min to control breathing, 10 min dexterity, 1 hr survival.',
    content: {
      overview: `Even in tropical monsoons with air temperatures of 25°C, prolonged immersion in moving floodwater causes life-threatening clinical hypothermia. Water conducts heat away from the human body 25 times faster than still air.`,
      physicsMechanism: `Human core body temperature must stay between 36.5°C and 37.5°C. When immersed, thermal loss rapidly outpaces internal metabolic heat generation. The physiological degradation follows the universal **1-10-1 Rule**:

1. **1 Minute - Cold Shock Response**: 
Sudden immersion triggers involuntary gasp reflex and hyperventilation (breathing rate increases $4\\times$). If your head is underwater during this initial gasp, you will aspirate 1–2 liters of water, causing instant drowning.
2. **10 Minutes - Cold Incapacitation & Swim Failure**:
Blood vessels in the extremities constrict (vasoconstriction) to preserve core heart/brain temperature. Muscles and nerves in the arms and fingers drop in temperature; manual dexterity and grip strength vanish. Victims become unable to pull themselves onto floating wreckage or grasp thrown rescue ropes.
3. **1 Hour - Hypothermia Onset**:
Core body temperature drops below 35°C (Mild), then 32°C (Moderate: shivering stops, mental confusion, cardiac arrhythmias), and finally below 28°C (Severe: ventricular fibrillation and cardiac arrest).

**The H.E.L.P. Stance (Heat Escape Lessening Posture)**:
Swimming vigorously increases blood flow to the arms and legs, accelerating heat loss by 35%. Instead, adopt H.E.L.P.:
- Pull knees tightly against chest.
- Cross ankles and wrap arms around shins.
- Keep head and neck out of the water to shield major blood vessels in the neck and armpits.
- If in a group, form a tight circular "Huddle" with chests pressed together and children in the center.`,
      empiricalThresholds: [
        { depth: 'Water Temp 20 - 25°C', impact: 'Exhaustion / swim failure within 2 to 4 hours without life jacket.' },
        { depth: 'Water Temp 15 - 20°C', impact: 'Dexterity lost in <20 minutes; unconsciousness in 2–3 hours.' },
        { depth: 'Active Swimming vs H.E.L.P.', impact: 'H.E.L.P. stance extends conscious survival time by 50%.' }
      ],
      safetyDirectives: [
        'Control your breathing during the first 60 seconds; do not thrash or panic.',
        'Do not remove clothing; water trapped in your shirts and pants warms up and provides boundary layer insulation.',
        'Adopt the H.E.L.P. posture while awaiting rescue.',
        'Never massage or vigorously rub hypothermic victims; rough handling can trigger fatal ventricular fibrillation.'
      ]
    }
  },
  {
    id: 'ch-12',
    num: '12',
    category: 'automotive',
    title: 'Submerged Vehicle Window Escape & Pressure Equalization Drill',
    icon: AlertOctagon,
    summary: 'The 60-second window before electronics short-circuit; why you must break side windows, not windshields.',
    badge: 'VEHICLE ESCAPE',
    dangerLevel: 'CRITICAL',
    formula: 't_{window\\_active} \\le 60\\text{ seconds} \\quad \\implies \\quad \\text{Unbuckle } \\to \\text{ Open Window } \\to \\text{ Exit}',
    readingTime: '5 min read',
    keyTakeaway: 'You have under 60 seconds to roll down electric windows before battery shorts. Break side glass with ceramic tips.',
    content: {
      overview: `When a vehicle plunges into a flooded canal, ditch, or underpass, panic kills. Drivers instinctively push the car doors, only to find them immovable due to hundreds of kilograms of hydrostatic pressure.`,
      physicsMechanism: `A sinking vehicle goes through three distinct hydrodynamic stages:

**Stage 1: The Floating Window (0 - 60 Seconds)**:
The vehicle floats for 30 to 90 seconds while air is displaced. **This is your only guaranteed survival escape window.** Modern electronic power windows continue functioning for 30–60 seconds before water shorts out the electrical bus.
*Action*: Instantly unbuckle seatbelts and roll down all side windows immediately. Climb through the open window onto the vehicle roof.

**Stage 2: Water Level Rising Above Bottom of Windows**:
Once outside water rises past the window sill, hydrostatic pressure jams the door tightly shut. Electric windows will now short out and fail.
*Window Breaking Physics*: The front windshield is made of laminated safety glass (two layers of glass bonded to a polyvinyl butyral plastic interlayer) designed specifically to NOT shatter under blunt impact. Kicking or punching the windshield is completely futile.
*Side Windows*: Side and rear windows are made of tempered glass (toughened by thermal tempering, holding ~70 MPa of internal compressive stress). Hitting the center with blunt hands or shoes flexes and absorbs the shock. You MUST strike the **lower corner** of a side window with a concentrated hardened point:
- Spring-loaded center punch
- Ceramic spark plug fragment
- Metal headrest prongs wedged into the window weatherseal slot and levered downward.

**Stage 3: Pressure Equalization (The Last Resort)**:
If windows cannot be opened or broken, do not panic. As water floods the cabin up to chest and chin level, the pressure inside equalizes with the outside pressure ($P_{in} \\approx P_{out}$).
When water reaches neck height, take a deep breath from the remaining ceiling air pocket, push the door firmly with both feet and hands, and swim to the surface.`,
      empiricalThresholds: [
        { depth: '0 - 30 Seconds', impact: 'Car floating; doors cannot be opened, but power windows operational.' },
        { depth: '60 - 120 Seconds', impact: 'Electrical failure; water submerges dashboard. Heavy water ingress.' },
        { depth: '180+ Seconds', impact: 'Complete cabin immersion; pressure equalized.' }
      ],
      safetyDirectives: [
        'Memorize the survival mnemonic: **SEATBELT - WINDOW - CHILDREN FIRST - OUT**.',
        'Keep an emergency window-punch / seatbelt-cutter tool mounted in the glovebox or center console within arm’s reach.',
        'Do not waste mobile phone battery calling emergency services while inside a sinking car; escape first.',
        'Help children out first by pushing them through the open window onto the roof before climbing out yourself.'
      ]
    }
  },
  {
    id: 'ch-13',
    num: '13',
    category: 'survival',
    title: '72-Hour Flood Evacuation Go-Bag & Caloric Rationing',
    icon: PackageCheck,
    summary: 'Essential hydration math (3L/person/day), waterproof document vaulting, and calorie-dense nutrition.',
    badge: 'DISASTER LOGISTICS',
    dangerLevel: 'MEDIUM',
    formula: '\\text{Water: } 3\\text{ Litres/person/day} \\times 3\\text{ days} \\quad | \\quad \\text{Calories: } \\ge 2,200\\text{ kcal/person/day}',
    readingTime: '5 min read',
    keyTakeaway: 'Pack an airtight IP67 dry-bag with 3L water per person/day, waterproof document pouches, and high-calorie rations.',
    content: {
      overview: `During severe urban deluge events, municipal rescue teams face heavy backlogs and road cutoffs. Citizens must be fully self-reliant for at least 72 hours before organized relief arrives.`,
      physicsMechanism: `The human body can survive 3 weeks without food, but only 3 days without water. In humid, stressful monsoon conditions, respiratory and sweat loss demands a minimum baseline intake:
$$\\text{Daily Hydration} = 3\\text{ Litres per adult} \\quad (2\\text{L for drinking, } 1\\text{L for sanitation / infant hygiene})$$
For a family of 3, a 72-hour survival reserve requires **27 Litres** of potable water.

**Nutritional Thermodynamics**:
Flood survival foods must require zero cooking, zero refrigeration, and zero added water:
- High caloric density (>450 kcal/100g): Roasted gram (chana), almonds, walnuts, energy bars, peanut butter, glucose biscuits, dry dates.
- High sodium / electrolyte content to prevent hyponatremia.

**Airtight Document Vaulting**:
Passports, Aadhaar cards, property deeds, and insurance policies must be placed in a transparent, double-ziplocked waterproof pouch (rated IP67 or IP68), along with digital backup flash drives containing encrypted scans.`,
      empiricalThresholds: [
        { depth: 'Go-Bag Max Weight', impact: 'Should not exceed 10–15% of your body weight (approx 7–9 kg for adults) for mobile wading.' },
        { depth: 'Electronics Protection', impact: 'Power bank (20,000 mAh), spare charging cables sealed in silicone dry-bags.' },
        { depth: 'Medical Supply', impact: 'Minimum 14-day supply of prescription chronic medications (insulin, anti-hypertensives, inhalers).' }
      ],
      safetyDirectives: [
        'Store your completed Go-Bag in an elevated, easily accessible closet near the main apartment door.',
        'Keep a whistle attached to the exterior shoulder strap of the bag for hands-free acoustic signaling.',
        'Include a waterproof LED headlamp with spare lithium batteries (hands-free illumination is vital when wading).',
        'Carry physical cash in small denominations (₹100 / ₹200 / ₹500); ATMs, card swiping machines, and UPI fail during power grid collapses.'
      ]
    }
  },
  {
    id: 'ch-14',
    num: '14',
    category: 'hydrodynamics',
    title: 'Estuarine Tidal Convergence & Sluice Gate Mechanics',
    icon: Anchor,
    summary: 'The physics of the Mithi River backwater curve, Mahim Creek storm surges, and Britannia pump telemetry.',
    badge: 'ESTUARINE DYNAMICS',
    dangerLevel: 'HIGH',
    formula: 'S_{backwater} = \\int \\frac{1 - (v/v_c)^2}{S_0 - S_f} dy \\quad \\implies \\quad \\text{Upstream head rises exponentially}',
    readingTime: '6 min read',
    keyTakeaway: 'When the Arabian Sea surges into coastal rivers, upstream river levels rise even if upstream rain decreases.',
    content: {
      overview: `Cities like Mumbai are built on reclaimed estuarine islands. Rivers like the Mithi River (17.8 km long) and Poisar, Dahisar, and Oshiwara rivers act as the primary natural storm drainage corridors.`,
      physicsMechanism: `When an oceanic storm surge enters Mahim Bay, sea water pushes inland into the mouth of the Mithi River. This creates a hydraulic **Backwater Profile (M1 Backwater Curve)** governed by the Saint-Venant shallow water equations:
$$\\frac{\\partial y}{\\partial x} = \\frac{S_0 - S_f}{1 - Fr^2}$$
where $Fr = \\frac{v}{\\sqrt{gy}}$ is the Froude number.

Because the estuarine bed slope $S_0$ is extremely flat (less than 1:2500 in Kurla and Kalina), the adverse tidal slope forces river water backward. The river cross-section swells, and water levels at Kurla (10 km upstream from the sea) rise up to 2 meters higher than at the river mouth.

To mitigate this, automated pumping stations (Love Grove, Cleveland Bunder, Haji Ali, Britannia, Gazdarband) utilize high-capacity vertical axial flow pumps. Britannia pumping station can evacuate 60 cubic meters per second (equivalent to filling 4 Olympic-sized swimming pools per minute), but requires heavy diesel generator backup because grid power trips during storms.`,
      empiricalThresholds: [
        { depth: 'Tidal Swell > 4.5 m MSL', impact: 'Reverses flow direction of Mithi River up to Kranti Nagar bridge.' },
        { depth: 'Pump Station Generator Cut-in', impact: 'Takes 90 seconds. Temporary 15 cm surge in storm culverts during startup.' },
        { depth: 'Estuarine Flap Gate Pressure', impact: 'Exceeds 40 metric tons of hydrostatic force sealing the ocean out.' }
      ],
      safetyDirectives: [
        'If you reside in river catchment corridors (Kurla West, Bail Bazar, Saki Naka, Chunabhatti), evacuate at the first warning of combined high tide (>4.2m) and IMD Red Alert.',
        'Never walk along river revetments or retaining walls; saturated embankment soils suffer sudden slope slips.',
        'Monitor civic pumping station telemetry and Mithi river gauge alarms through the civic dashboard.'
      ]
    }
  },
  {
    id: 'ch-15',
    num: '15',
    category: 'survival',
    title: 'Flash Flood Early Acoustic Cues & Debris Surge Hydrology',
    icon: Volume2,
    summary: 'Recognizing infrasound rumbles, sudden water discoloration, and nullah bank cavitation.',
    badge: 'EARLY DETECTION',
    dangerLevel: 'CRITICAL',
    formula: 'v_{wavefront} = \\sqrt{g \\cdot h_{wave}} \\cdot \\left( 1 + \\frac{3}{2} \\frac{h_{wave}}{h_0} \\right)',
    readingTime: '5 min read',
    keyTakeaway: 'A sudden change from clear to muddy brown water with floating tree limbs means a flash flood wave arrives in 2–5 minutes.',
    content: {
      overview: `In foothill corridors, quarry depressions, and hilly urban catchments (Powai, Asalpha, Ghatkopar hills, Kandivali east), cloudbursts trigger flash floods that advance with zero warning.`,
      physicsMechanism: `A flash flood wavefront behaves as a hydraulic bore (shock wave) traveling downstream at speeds up to 5–8 m/s (18–30 km/h). The acoustic cues and hydrological markers precede the visible wall of water by 2 to 5 minutes:

1. **Acoustic Infrasound Rumble**:
As the surging flood tears boulders, tree trunks, and concrete slabs along the riverbed, the grinding collisions produce a distinctive deep, low-frequency roar resembling a freight train or continuous thunder without lightning.
2. **Sudden Water Discoloration**:
If a flowing stream suddenly turns from dark grey or clear to thick, frothy muddy chocolate-brown, it indicates an upstream landslide, dam overtopping, or wall collapse that has injected millions of tons of colloidal silt into the flow.
3. **Sudden Water Level Drop Before the Surge**:
If water in a nullah suddenly drops by 15–30 cm while rain is continuing, an upstream obstruction (e.g., collapsed bridge or culvert clogged with cars and debris) has created a temporary dam. Within minutes, the dam will burst under hydrostatic load, releasing an explosive wave downstream.`,
      empiricalThresholds: [
        { depth: 'Stream Sound Elevation (>75 dB)', impact: 'Immediate indicator of high-velocity upstream debris transport.' },
        { depth: 'Water Turn muddy + Brown Froth', impact: 'Wavefront arrival within 120–300 seconds. Move vertically immediately.' },
        { depth: 'Upstream Obstruction Dam Breach', impact: 'Multiplies downstream peak discharge ($Q_{peak}$) by 300%.' }
      ],
      safetyDirectives: [
        'If you hear a deep mechanical roaring sound coming from an upstream nullah, DO NOT stop to look. Immediately run uphill.',
        'Never attempt to cross a bridge or culvert if water has reached within 30 cm of the bridge deck slab.',
        'Always move perpendicular to the stream direction towards higher ground; never try to outrun a flash flood by running along the channel bank.'
      ]
    }
  },
  {
    id: 'ch-16',
    num: '16',
    category: 'structural',
    title: 'Toxic Sump Gas, Sewer Backflow & Post-Flood Black Mold',
    icon: Skull,
    summary: 'Hydrogen sulfide (H2S), sewer methane accumulation in flooded basements, and Stachybotrys mold remediation.',
    badge: 'CHEMICAL HAZARDS',
    dangerLevel: 'LETHAL',
    formula: '\\text{H}_2\\text{S Lethal Threshold: } > 100\\text{ ppm} \\quad (\\text{Paralyzes olfactory nerve in 2 seconds})',
    readingTime: '5 min read',
    keyTakeaway: 'Submerged basements and sump tanks trap odorless methane and lethal H2S gas. Ventilate before entering.',
    content: {
      overview: `Once floodwaters recede, the aftermath presents unseen chemical and microbiological threats that kill unsuspecting residents entering basements, lift shafts, and underground water storage sumps.`,
      physicsMechanism: `1. **Hydrogen Sulfide ($H_2S$) & Sewer Gas Asphyxiation**:
Anaerobic decomposition of sewage, organic mud, and dead biomass in unventilated flooded pits produces hydrogen sulfide ($H_2S$) and methane ($CH_4$). 
- At 0.1 to 1 ppm, $H_2S$ smells like rotten eggs.
- At 100 ppm, $H_2S$ instantly paralyzes the human olfactory nerve—**the smell disappears completely**, giving victims a false sense of safety.
- At 300 to 500 ppm, a single breath causes pulmonary edema and instant loss of consciousness ("knockdown"). Victims collapse into the sump water and drown.

2. **Toxic Black Mold (*Stachybotrys chartarum*)**:
Within 24 to 48 hours of dampness, mold spores germinate on drywall, plywood, and false ceilings. *Stachybotrys* synthesizes cytotoxic mycotoxins (trichothecenes) that cause respiratory bleeding, severe asthma attacks, and immune suppression.`,
      empiricalThresholds: [
        { depth: 'Gas: H2S > 10 ppm', impact: 'Exceeds OSHA Permissible Exposure Limit. Requires air-supplied respirator.' },
        { depth: 'Mold: Spore Germination', impact: 'Begins within 24–48 hours at relative humidity > 70%.' },
        { depth: 'Sewer Backflow Ingress', impact: 'Requires discarding all porous mattresses, upholstered furniture, and carpets.' }
      ],
      safetyDirectives: [
        'Never enter an unventilated basement, lift pit, or underground water sump without positive-pressure mechanical blower ventilation.',
        'During cleanup, wear an N95 or P100 half-face respirator, non-porous rubber gloves, and safety goggles.',
        'Disinfect flooded walls with a biocide solution: 1 cup (240 ml) of 5% chlorine bleach mixed in 4 liters of clean water. Scrub surfaces and allow to air-dry with industrial fans running.',
        'Throw out all drywall, gypsum board, insulation, and cardboard that remained underwater for more than 48 hours; they cannot be sanitized.'
      ]
    }
  },
  {
    id: 'ch-17',
    num: '17',
    category: 'medical',
    title: 'Displaced Wildlife & Venomous Reptile Flood Encounters',
    icon: Activity,
    summary: 'Russell\'s Vipers, Cobras, and Kraits seeking dry high ground inside homes; pressure immobilization protocols.',
    badge: 'WILDLIFE PROTOCOLS',
    dangerLevel: 'HIGH',
    formula: '\\text{Anti-Snake Venom (ASV): Polyvalent} \\implies \\text{Administer within 2 hours at Tertiary Hospital}',
    readingTime: '5 min read',
    keyTakeaway: 'Floods force snakes and scorpions out of burrows onto elevated house furniture, doorframes, and bed mattresses.',
    content: {
      overview: `Subsurface burrows of snakes, scorpions, and rodents are flooded during monsoons, driving displaced wildlife to seek dry high ground inside residential homes, stairwells, and parked vehicle engine bays.`,
      physicsMechanism: `In urban and suburban Indian regions, the "Big Four" venomous snake species are encountered:
1. **Spectacled Cobra (*Naja naja*)**: Neurotoxic venom (paralyzes respiratory diaphragm).
2. **Common Krait (*Bungarus caeruleus*)**: Potent neurotoxin; nocturnal bites often happen while sleeping on ground mattresses with painless puncture marks.
3. **Russell\'s Viper (*Daboia russelii*)**: Hemotoxic venom (massive tissue necrosis, internal hemorrhaging, acute renal failure).
4. **Saw-scaled Viper (*Echis carinatus*)**: Vasculotoxic; prevents blood clotting.

**Emergency Envenomation Protocol (DOs & DONTs)**:
- **DO NOT** apply a tourniquet (tight binding causes localized gangrene and amputations).
- **DO NOT** cut the wound with razor blades or attempt to suck venom out (causes severe infection and accelerates lymphatic spread).
- **DO NOT** apply ice or electrical shock.
- **DO**: Immobilize the bitten limb using a rigid splint and broad crepe bandage (Pressure Immobilization Technique). Keep the bitten limb below heart level.
- **DO**: Transport victim immediately to the nearest government civil hospital stocking Polyvalent Anti-Snake Venom (ASV).`,
      empiricalThresholds: [
        { depth: 'Snake Encounters During Floods', impact: 'Increase by 400% in ground-floor houses and stilt parking.' },
        { depth: 'Krait Envenomation Window', impact: 'Respiratory paralysis can develop within 4 to 8 hours without ASV.' },
        { depth: 'Polyvalent ASV Golden Window', impact: 'Must be administered within 120 minutes for maximum clinical efficacy.' }
      ],
      safetyDirectives: [
        'Never walk in unlit floodwater or dark ground-floor rooms without a high-intensity flashlight.',
        'Check beds, sofa cushions, shoe racks, and under toilet seats before sitting or reaching down with bare hands.',
        'Never attempt to handle, capture, or kill a snake yourself; contact animal rescue NGOs (e.g. SARRP / Resqink / Forest Department helpline 1926).',
        'Elevate ground-floor mattresses onto bed frames at least 50 cm off the floor slab.'
      ]
    }
  },
  {
    id: 'ch-18',
    num: '18',
    category: 'survival',
    title: 'Special Assistance Triage: Infants, Elderly & Device Dependents',
    icon: Users,
    summary: 'Oxygen concentrators, dialysis fluid cold chains, infant formula sterilization, and vertical evacuation chairs.',
    badge: 'VULNERABLE POPULATIONS',
    dangerLevel: 'HIGH',
    formula: '\\text{Battery Reserve: } P_{device} \\times t_{hours} \\quad (\\text{Oxygen Concentrator: } 350\\text{W } \\implies \\text{Inverter load})',
    readingTime: '5 min read',
    keyTakeaway: 'Prepare emergency battery backups for oxygen concentrators and plan vertical evacuation for bedridden seniors.',
    content: {
      overview: `Disaster mortality disproportionately affects the elderly, infants, and individuals dependent on medical life-support technology. Electrical grid blackouts and elevator shutdowns trap vulnerable citizens on high floors or flooded ground units.`,
      physicsMechanism: `1. **Oxygen Concentrator & Ventilator Power Resilience**:
A standard 5L/min medical oxygen concentrator consumes ~350–400 Watts of electricity. A 150Ah / 12V inverter battery provides only ~3.5 hours of continuous runtime before depletion.
*Directives*: Procure two manual E-type oxygen cylinders (680 Litres each with pressure regulator) as zero-electricity backup reserves.

2. **Peritoneal Dialysis & Insulin Cold-Chain**:
Insulin degrades rapidly above 30°C. If domestic refrigerators lose power:
- Store insulin vials in a sealed waterproof container inside a thermos flask filled with ice cubes or gel packs.
- Do not let insulin vials touch ice directly (freezing destroys insulin proteins).

3. **Infant Nutrition & Feeding**:
Unboiled floodwater used to mix powdered infant formula causes severe fatal gastroenteritis. If clean water is unavailable, mothers should prioritize continued breastfeeding. If using formula, water must be boiled for 3 full minutes.

4. **Non-Ambulatory Vertical Evacuation**:
When elevators stop, wheel-chair bound or bedridden individuals cannot navigate staircase stairwells. Use the **Two-Person Fore-and-Aft Carry** or a heavy blanket dragging technique down stairs.`,
      empiricalThresholds: [
        { depth: 'Power Cut > 4 Hours', impact: 'Inverter batteries exhausted for heavy medical equipment.' },
        { depth: 'Insulin Without Cooling (>30°C)', impact: 'Potency drops significantly after 48 hours.' },
        { depth: 'Stair Evacuation Chair', impact: 'Requires 2 trained individuals per non-ambulatory adult.' }
      ],
      safetyDirectives: [
        'Register vulnerable family members in advance with the Ward Disaster Management Cell for priority rescue evacuation.',
        'Keep a handwritten laminated medical summary sheet (blood group, chronic conditions, medication dosages, physician emergency numbers) pinned to the patient’s clothing.',
        'Maintain a 3-day supply of pre-mixed ready-to-feed sterile liquid baby formula if possible.',
        'Charge medical backup batteries whenever mains power is momentarily restored.'
      ]
    }
  },
  {
    id: 'ch-19',
    num: '19',
    category: 'survival',
    title: 'Acoustic Distress Signaling, Morse Code & Aerial Ground Markers',
    icon: Radio,
    summary: 'Universal 3-signal rule, audio whistle harmonics, SOS optical strobing, and roof helicopter marker codes.',
    badge: 'RESCUE SIGNALING',
    dangerLevel: 'MEDIUM',
    formula: '\\text{Acoustic Range: Whistle (105 dB) reaches 1.6 km} \\quad \\text{vs} \\quad \\text{Human Voice (70 dB) reaches 150 m}',
    readingTime: '4 min read',
    keyTakeaway: 'A pea-less whistle is audible 10x further than screaming. Blow 3 short blasts to signal emergency distress.',
    content: {
      overview: `When mobile phone cellular towers collapse during severe flooding, stranded citizens must rely on acoustic, optical, and visual ground markers to attract disaster rescue boats and NDRF/Air Force helicopters.`,
      physicsMechanism: `1. **The Universal Rule of Three**:
In search and rescue operations worldwide, **any sequence of THREE signals repeated at regular intervals indicates distress**:
- 3 sharp whistle blasts (wait 1 minute, repeat).
- 3 flashes of a mirror or flashlight.
- 3 gunshots or vehicle horn bursts.

2. **Acoustic Whistle vs Human Screaming**:
Human vocal cords screaming at 70–80 dB fatigue within 15–20 minutes and attenuate rapidly across rain-drenched air, carrying less than 150 meters. A standard pea-less safety whistle (e.g. Fox 40) generates **105 to 115 decibels** at 2.5 to 3.5 kHz—the exact frequency spectrum where human ear sensitivity is highest. Whistle blasts cut through rain and engine noise, reaching over **1.6 kilometers (1 mile)** with minimal physical effort.

3. **SOS Morse Code Optical Strobing**:
Using a flashlight or phone screen:
$$\\dots \\quad --- \\quad \\dots \\quad (3\\text{ short flashes, } 3\\text{ long flashes, } 3\\text{ short flashes})$$

4. **Aeronautical Ground-to-Air Symbols for Roof Rescue**:
Lay out bright sheets, contrasting cloth, or spray-paint symbols on flat terrace roofs for rescue helicopters:
- **V**: "Require Assistance"
- **X**: "Require Medical Assistance"
- **N**: "No / Negative"
- **Y**: "Yes / Affirmative"
- **$\\to$ (Arrow)**: "Proceeding in this direction"
Each symbol should be at least **3 meters (10 feet) long** to be clearly legible from 1,000 feet altitude.`,
      empiricalThresholds: [
        { depth: 'Whistle Sound Output', impact: '110 dB @ 1 meter; carries across open water up to 1,600m.' },
        { depth: 'Flashlight Strobe in Dark', impact: 'Visible to helicopter night-vision (NVG) up to 5 km away.' },
        { depth: 'Roof Symbol Dimensions', impact: 'Minimum 3m × 3m size with high contrast against terrace concrete.' }
      ],
      safetyDirectives: [
        'Never yell or scream continuously; you will lose your voice in 15 minutes. Use an acoustic whistle.',
        'At night, point your flashlight or phone strobe towards rescue boats or helicopters in bursts of 3.',
        'Tie a bright orange or yellow cloth to a high bamboo pole on your roof terrace.',
        'Never use laser pointers towards helicopters (causes pilot flash blindness and is a criminal offense).'
      ]
    }
  },
  {
    id: 'ch-20',
    num: '20',
    category: 'structural',
    title: 'Flood Forensic Damage Documentation & IRDAI Insurance Claims',
    icon: FileSpreadsheet,
    summary: 'Watermark photographic protocols, salvage mitigation legal duties, and SDRF ex-gratia relief filings.',
    badge: 'LEGAL & INSURANCE',
    dangerLevel: 'MEDIUM',
    formula: '\\text{Claim Payout} \\propto \\text{Policy Cover} - \\text{Depreciation} - \\text{Under-Insurance Deductions}',
    readingTime: '5 min read',
    keyTakeaway: 'Photograph watermarks on walls and appliances before touching debris to ensure complete insurance settlement.',
    content: {
      overview: `After floodwaters drain away, families face enormous economic devastation. Securing fair and rapid compensation from insurance companies (under IRDAI guidelines) or State Disaster Response Fund (SDRF) ex-gratia relief requires systematic forensic photographic evidence.`,
      physicsMechanism: `Insurance surveyors adhere strictly to the principle of indemnity and require proof of cause of loss (Proximate Cause). Cleaning up, painting walls, or dumping damaged electronics before photographic surveyor inspection almost always results in claim repudiation.

**The 6-Step Forensic Documentation Protocol**:
1. **Preserve the High-Water Mark (Tide Line)**:
Floodwaters leave a distinctive brown mud/silt deposit line on internal plaster walls and doorframes. Measure the distance from the finished floor level to this watermark with a measuring tape and photograph it with a timestamped camera app.
2. **360-Degree Wide & Macro Photography**:
- Take wide-angle room photos showing the waterline in relation to furniture.
- Take macro photos of manufacturer serial number plates, model badges, and barcode stickers on flooded appliances (refrigerators, washing machines, inverter units, televisions).
3. **The "Duty of Mitigation" Principle**:
Under general insurance contract law, the insured has a legal duty to minimize secondary losses. Once floodwaters recede:
- Disconnect power supply to prevent short circuits.
- Elevate salvageable items off damp floors.
- Do not attempt to turn on or start water-submerged electronics or car engines (surveyors will flag this as "willful worsening of loss" and reject the claim).
4. **Log Damaged Vehicle Specifics**:
For cars, photograph water level against door handles, wheel rims, and engine compartment intake boxes before towing.
5. **Government SDRF Panchnama**:
For municipal ex-gratia relief, obtain an official *Panchnama* signed by the local Ward Talathi or Revenue Officer certifying flood water depth in your premises.`,
      empiricalThresholds: [
        { depth: 'Notice of Claim Window', impact: 'Must notify insurer within 48 to 72 hours of incident.' },
        { depth: 'Watermark Evidence Value', impact: 'Definitively establishes depth of inundation for structural damage calculation.' },
        { depth: 'Depreciation on Electronics', impact: 'Typically 20–50% unless policy includes Zero Depreciation / Return to Invoice rider.' }
      ],
      safetyDirectives: [
        'Keep soft copies of original purchase invoices, receipts, and warranty cards backed up on Google Drive or DigiLocker.',
        'Never sign a blank survey discharge voucher provided by an insurance surveyor before reviewing itemized compensation.',
        'Make an itemized inventory Excel sheet listing item name, purchase date, invoice cost, replacement cost, and damage severity.'
      ]
    }
  }
];


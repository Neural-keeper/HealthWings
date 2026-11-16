export type MissionPhase = 'Pre-Flight' | 'In-Flight' | 'Post-Flight';
export type BodySystemId = 'immune' | 'metabolism' | 'mental' | 'circulation' | 'neuro_ocular';
export type HealthStatus = 'Nominal' | 'Watch' | 'Critical';

export interface ScatterPoint {
  id: string;
  flightDay: number; // -30 (Pre), 1..180 (In-flight), 185..210 (Post)
  phase: MissionPhase;
  value: number;
  cohortMean: number;
  cohortSd: number;
  cohortN: number;
  isCurrentCrew?: boolean;
}

export interface BenchmarkMetric {
  id: string;
  label: string;
  unit: string;
  currentValue: number;
  healthyMin: number;
  healthyMax: number;
  scaleMin: number;
  scaleMax: number;
  higherIsBetter?: boolean; // undefined means middle range [healthyMin, healthyMax] is optimal
  lsahCohortNote: string;
}

export interface BodySystemProfile {
  id: BodySystemId;
  name: string;
  shortName: string;
  wingSide: 'mental' | 'physical';
  lsahStudyRef: string;
  summary: string;
  primaryUnit: string;
  primaryMetricId: string;
  recommendedTestId: string;
  benchmarks: BenchmarkMetric[];
  scatterSeries: ScatterPoint[];
}

export interface ZeroGTestProtocol {
  id: string;
  name: string;
  wavelengthNm: string;
  durationSec: number;
  targetSystems: BodySystemId[];
  zeroGPrinciple: string;
  hardware: string;
  steps: string[];
  normalReadingRange: string;
}

export interface SymptomOption {
  id: string;
  label: string;
  category: 'mental' | 'physical';
  lsahCorrelate: string;
}

export interface AstronautBiometrics {
  flightDay: number;
  moodScore: number; // 1..10
  sleepHours: number; // 3..10
  stressLevel: number; // 1..10 (higher = more stressed)
  exerciseMinutes: number; // 0..150 (ARED + T2 + CEVIS)
  hydrationLiters: number; // 0.8..4.0
  hrvRmssd: number; // 15..95 ms
  restingHr: number; // 45..105 bpm
  nkCellActivity: number; // 15..65 %
  vitaminD: number; // 12..65 ng/mL
  choroidalDeltaUm: number; // 0..95 um
}

export interface PlanetMilestone {
  index: number;
  name: string;
  starsRequired: number;
  radiusPx: number;
  orbitRadiusPx: number;
  orbitSpeedSec: number;
  color: string;
  ring?: boolean;
  healthBadge: string;
  description: string;
}

export const NASA_SYMPTOMS: SymptomOption[] = [
  { id: 'visual_blur', label: 'Near-vision blur or halos', category: 'physical', lsahCorrelate: 'SANS Optic Disc Edema' },
  { id: 'headache', label: 'Frontal pressure headache', category: 'physical', lsahCorrelate: 'Cephalad Fluid Shift' },
  { id: 'fatigue', label: 'Daytime fatigue / sluggishness', category: 'mental', lsahCorrelate: 'Circadian Phase Drift' },
  { id: 'insomnia', label: 'Fragmented sleep (< 6h)', category: 'mental', lsahCorrelate: 'Melatonin Suppression' },
  { id: 'dizziness', label: 'Lightheaded during movement', category: 'physical', lsahCorrelate: 'Plasma Volume / Orthostatic Drop' },
  { id: 'skin_flare', label: 'Skin rash or nasal congestion', category: 'physical', lsahCorrelate: 'Immune Cytokine Shift' },
  { id: 'low_mood', label: 'Low mood or isolation strain', category: 'mental', lsahCorrelate: 'POMS Affect Decline' },
  { id: 'muscle_ache', label: 'Caloric drop / muscle soreness', category: 'physical', lsahCorrelate: 'ARED Load & Vitamin D Deficit' },
];

export const ZERO_G_LIGHT_TESTS: ZeroGTestProtocol[] = [
  {
    id: 'optical_ppg_hrv',
    name: 'Optical PPG & HRV Cabin-LED Scan',
    wavelengthNm: '525 nm Green + 660 nm Red',
    durationSec: 60,
    targetSystems: ['circulation', 'mental'],
    zeroGPrinciple: 'Measures capillary pulse wave transit via skin reflectance—requires zero gravity-dependent mercury cuffs or venous pooling.',
    hardware: 'Crew Wrist Photodiode + Cabin Diffuse LED',
    steps: [
      'Anchor feet under cabin handrail to eliminate micro-drift during the 60-second optical capture.',
      'Hold index fingertip gently against the 525 nm optical window—do not press hard enough to blanch capillaries.',
      'Breathe at a steady 6-breaths/min cadence while the photodiode samples pulse intervals (RMSSD).',
      'Confirm green optical lock tone and sync waveform to Pisces telemetry.',
    ],
    normalReadingRange: 'HR 52–74 bpm · HRV RMSSD 42–82 ms',
  },
  {
    id: 'spectral_retinal_oct',
    name: 'Portable Spectral Retinal OCT Scan',
    wavelengthNm: '840 nm Near-Infrared SLD',
    durationSec: 90,
    targetSystems: ['neuro_ocular', 'circulation'],
    zeroGPrinciple: 'Low-coherence interferometry maps retinal nerve fiber & choroidal thickness using pure light back-scatter without eye contact or gravity.',
    hardware: 'ISS Spectralis-Lite Head-Mounted OCT',
    steps: [
      'Secure the elastic occipital strap so the optical aperture floats stably 18 mm from the cornea.',
      'Fixate on the internal amber crosshair target inside the eyepiece for 15 seconds per eye.',
      'Trigger the 840 nm cross-sectional raster sweep across the optic nerve head and macula.',
      'Inspect choroidal thickness delta against your pre-flight L-30 baseline.',
    ],
    normalReadingRange: 'Choroidal Delta < +25 μm · IOP 11–18 mmHg',
  },
  {
    id: 'blue_pupillometry',
    name: '480 nm Blue-Light Pupillometry Assay',
    wavelengthNm: '480 nm Melanopsin Blue',
    durationSec: 45,
    targetSystems: ['mental', 'neuro_ocular'],
    zeroGPrinciple: 'Quantifies melanopsin retinal ganglion reflex & cognitive alertness via non-contact infrared pupil tracking in dark sleep stations.',
    hardware: 'Sleep-Quarter Optical Visor',
    steps: [
      'Dim cabin module shutters or enter crew sleep station for 30 seconds of dark adaptation.',
      'Position the optical visor gently over brow ridge and tap Start Flash Assay.',
      'Keep eyes open during three 1-second 480 nm calibrated blue-light pulses.',
      'Tap the right thumb trigger immediately upon visual flash confirmation for PVT reaction timing.',
    ],
    normalReadingRange: 'Pupil Latency 190–255 ms · PVT < 285 ms',
  },
  {
    id: 'transcutaneous_photometry',
    name: 'Transcutaneous Spectral Photometry (TSP)',
    wavelengthNm: '450–940 nm Multi-Spectral LED',
    durationSec: 50,
    targetSystems: ['metabolism', 'immune'],
    zeroGPrinciple: 'Non-invasive broadband skin spectroscopy estimates tissue oxygenation, bilirubin, and oxidative stress markers without centrifuge blood draws.',
    hardware: 'Handheld Dermal Spectrometer',
    steps: [
      'Wipe inner forearm test site with sterile dry pad to remove floating skin oils.',
      'Hold spectrometer flush against forearm using light spring-clip band (no gravity pressure needed).',
      'Run 5-wavelength reflectance sweep across 450 nm, 577 nm, 660 nm, 810 nm, and 940 nm.',
      'Review estimated metabolic & inflammatory chromophore index in Pisces.',
    ],
    normalReadingRange: 'Tissue StO2 68–84% · Inflammatory Index < 1.35',
  },
  {
    id: 'fnirs_cerebral',
    name: 'fNIRS Prefrontal Light Oxygenation Cap',
    wavelengthNm: '730 nm & 850 nm Dual NIR',
    durationSec: 75,
    targetSystems: ['mental', 'circulation'],
    zeroGPrinciple: 'Near-infrared photons penetrate 2 cm into prefrontal cortex to measure oxy/deoxy-hemoglobin ratios without supine gravity assumptions.',
    hardware: 'Soft-Band fNIRS Optode Strip',
    steps: [
      'Fasten the soft neoprene optode strip smoothly across the forehead above the brow.',
      'Tether floating cable clip to flight suit collar so microgravity movement adds zero motion artifact.',
      'Complete the 60-second paced memory sequence while NIR optodes log cortical oxygenation.',
      'Upload cortical HbO2 recovery curve to NASA LSAH mission log.',
    ],
    normalReadingRange: 'Prefrontal HbO2 Saturation 64–78%',
  },
];

export const INITIAL_BIOMETRICS: AstronautBiometrics = {
  flightDay: 78,
  moodScore: 7,
  sleepHours: 6.1,
  stressLevel: 5,
  exerciseMinutes: 75,
  hydrationLiters: 2.1,
  hrvRmssd: 44,
  restingHr: 74,
  nkCellActivity: 34,
  vitaminD: 26,
  choroidalDeltaUm: 42,
};

export const SOLAR_SYSTEM_PLANETS: PlanetMilestone[] = [
  {
    index: 1,
    name: 'Mercury',
    starsRequired: 1,
    radiusPx: 7,
    orbitRadiusPx: 54,
    orbitSpeedSec: 12,
    color: '#CBD5E1',
    healthBadge: 'Hydration & Baseline Check',
    description: 'First orbital check-in logged with Dr. Pisces.',
  },
  {
    index: 2,
    name: 'Venus',
    starsRequired: 2,
    radiusPx: 10,
    orbitRadiusPx: 78,
    orbitSpeedSec: 17,
    color: '#FDE68A',
    healthBadge: 'Circadian Light Sync',
    description: 'Blue-light pupillometry & sleep cycle stabilized.',
  },
  {
    index: 3,
    name: 'Earth',
    starsRequired: 3,
    radiusPx: 11,
    orbitRadiusPx: 105,
    orbitSpeedSec: 23,
    color: '#60A5FA',
    healthBadge: 'Cardio & HRV Balance',
    description: 'Optical PPG heart rate variability within crew target.',
  },
  {
    index: 4,
    name: 'Mars',
    starsRequired: 4,
    radiusPx: 9,
    orbitRadiusPx: 132,
    orbitSpeedSec: 30,
    color: '#FB923C',
    healthBadge: 'ARED Resistance Quota',
    description: 'Daily microgravity strength countermeasures completed.',
  },
  {
    index: 5,
    name: 'Jupiter',
    starsRequired: 5,
    radiusPx: 18,
    orbitRadiusPx: 168,
    orbitSpeedSec: 42,
    color: '#FDBA74',
    healthBadge: 'Immune Resilience',
    description: 'NK-cell defense & stress cortisol within healthy adult bounds.',
  },
  {
    index: 6,
    name: 'Saturn',
    starsRequired: 6,
    radiusPx: 15,
    orbitRadiusPx: 206,
    orbitSpeedSec: 54,
    color: '#FCD34D',
    ring: true,
    healthBadge: 'Vitamin D & Bone Density',
    description: 'Metabolic & bone resorption biomarkers stabilized.',
  },
  {
    index: 7,
    name: 'Uranus',
    starsRequired: 7,
    radiusPx: 12,
    orbitRadiusPx: 242,
    orbitSpeedSec: 68,
    color: '#7DD3FC',
    healthBadge: 'SANS Ocular Clearance',
    description: '840 nm OCT choroidal thickness verified in safe zone.',
  },
  {
    index: 8,
    name: 'Neptune',
    starsRequired: 8,
    radiusPx: 12,
    orbitRadiusPx: 276,
    orbitSpeedSec: 82,
    color: '#818CF8',
    healthBadge: 'Full 8-Planet Peak Readiness',
    description: 'All Mental & Physical wing bars balanced for long-duration flight.',
  },
];

// Deterministic NASA LSAH longitudinal cohort data generator (FD -30 to FD +210)
export function buildBodySystems(bio: AstronautBiometrics): BodySystemProfile[] {
  const sleepScore = Math.min(100, Math.round((bio.sleepHours / 8) * 100));

  return [
    {
      id: 'immune',
      name: 'Immune System & Viral Defense',
      shortName: 'Immune',
      wingSide: 'physical',
      lsahStudyRef: 'NASA LSAH ISS-Immune Cohort (N=48)',
      summary:
        'Microgravity alters lymphocyte distribution and reactivates latent herpesviruses. Tracking NK-cell cytotoxicity alongside salivary cortisol/IgA catches immune drift early.',
      primaryUnit: '%',
      primaryMetricId: 'nk_cell',
      recommendedTestId: 'transcutaneous_photometry',
      benchmarks: [
        {
          id: 'nk_cell',
          label: 'NK-Cell Cytotoxicity',
          unit: '%',
          currentValue: bio.nkCellActivity,
          healthyMin: 38,
          healthyMax: 62,
          scaleMin: 10,
          scaleMax: 75,
          lsahCohortNote: 'Healthy ground adults average 40–60%; in-flight ISS nadir typically occurs around FD-60 to FD-110.',
        },
        {
          id: 'salivary_iga',
          label: 'Salivary IgA / Cortisol Ratio',
          unit: 'ratio',
          currentValue: Number((1.65 - bio.stressLevel * 0.08 + bio.sleepHours * 0.05).toFixed(2)),
          healthyMin: 1.25,
          healthyMax: 2.2,
          scaleMin: 0.4,
          scaleMax: 2.6,
          lsahCohortNote: 'Drops below 1.15 correlate with elevated upper-respiratory irritation in closed habitats.',
        },
      ],
      scatterSeries: [
        { id: 'im-1', flightDay: -28, phase: 'Pre-Flight', value: 52, cohortMean: 50, cohortSd: 6, cohortN: 48 },
        { id: 'im-2', flightDay: -14, phase: 'Pre-Flight', value: 49, cohortMean: 49, cohortSd: 6, cohortN: 48 },
        { id: 'im-3', flightDay: -3, phase: 'Pre-Flight', value: 46, cohortMean: 47, cohortSd: 6, cohortN: 48 },
        { id: 'im-4', flightDay: 7, phase: 'In-Flight', value: 41, cohortMean: 42, cohortSd: 7, cohortN: 48 },
        { id: 'im-5', flightDay: 18, phase: 'In-Flight', value: 38, cohortMean: 39, cohortSd: 7, cohortN: 48 },
        { id: 'im-6', flightDay: 32, phase: 'In-Flight', value: 35, cohortMean: 37, cohortSd: 8, cohortN: 48 },
        { id: 'im-7', flightDay: 49, phase: 'In-Flight', value: 32, cohortMean: 35, cohortSd: 8, cohortN: 46 },
        { id: 'im-8', flightDay: 64, phase: 'In-Flight', value: 31, cohortMean: 34, cohortSd: 7, cohortN: 46 },
        { id: 'im-current', flightDay: bio.flightDay, phase: 'In-Flight', value: bio.nkCellActivity, cohortMean: 35, cohortSd: 7, cohortN: 45, isCurrentCrew: true },
        { id: 'im-9', flightDay: 112, phase: 'In-Flight', value: 37, cohortMean: 37, cohortSd: 7, cohortN: 44 },
        { id: 'im-10', flightDay: 145, phase: 'In-Flight', value: 39, cohortMean: 38, cohortSd: 6, cohortN: 44 },
        { id: 'im-11', flightDay: 175, phase: 'In-Flight', value: 40, cohortMean: 39, cohortSd: 6, cohortN: 42 },
        { id: 'im-12', flightDay: 192, phase: 'Post-Flight', value: 44, cohortMean: 45, cohortSd: 6, cohortN: 42 },
        { id: 'im-13', flightDay: 210, phase: 'Post-Flight', value: 50, cohortMean: 49, cohortSd: 5, cohortN: 40 },
      ],
    },
    {
      id: 'metabolism',
      name: 'Metabolism, Vitamin D & Bone Turnover',
      shortName: 'Metabolism',
      wingSide: 'physical',
      lsahStudyRef: 'NASA LSAH Nutritional & Bone Biochemistry Archive',
      summary:
        'Without solar UVB and gravitational loading, 25-OH Vitamin D and bone calcium balance decline unless ARED resistance and supplementation stay locked in.',
      primaryUnit: 'ng/mL',
      primaryMetricId: 'vit_d',
      recommendedTestId: 'transcutaneous_photometry',
      benchmarks: [
        {
          id: 'vit_d',
          label: '25-OH Vitamin D',
          unit: 'ng/mL',
          currentValue: bio.vitaminD,
          healthyMin: 30,
          healthyMax: 55,
          scaleMin: 10,
          scaleMax: 70,
          lsahCohortNote: 'LSAH clinical target is >= 30 ng/mL to protect trabecular bone mineral density.',
        },
        {
          id: 'bone_ntx',
          label: 'Bone Resorption (NTx)',
          unit: 'nmol/mmol',
          currentValue: Math.round(78 - bio.exerciseMinutes * 0.25),
          healthyMin: 25,
          healthyMax: 54,
          scaleMin: 15,
          scaleMax: 95,
          lsahCohortNote: 'Daily ARED resistance >= 90 min suppresses excess bone calcium mobilization.',
        },
      ],
      scatterSeries: [
        { id: 'mt-1', flightDay: -30, phase: 'Pre-Flight', value: 41, cohortMean: 40, cohortSd: 5, cohortN: 52 },
        { id: 'mt-2', flightDay: -10, phase: 'Pre-Flight', value: 42, cohortMean: 41, cohortSd: 5, cohortN: 52 },
        { id: 'mt-3', flightDay: 14, phase: 'In-Flight', value: 36, cohortMean: 37, cohortSd: 6, cohortN: 52 },
        { id: 'mt-4', flightDay: 30, phase: 'In-Flight', value: 33, cohortMean: 34, cohortSd: 6, cohortN: 50 },
        { id: 'mt-5', flightDay: 55, phase: 'In-Flight', value: 29, cohortMean: 31, cohortSd: 6, cohortN: 50 },
        { id: 'mt-current', flightDay: bio.flightDay, phase: 'In-Flight', value: bio.vitaminD, cohortMean: 30, cohortSd: 6, cohortN: 49, isCurrentCrew: true },
        { id: 'mt-6', flightDay: 108, phase: 'In-Flight', value: 31, cohortMean: 31, cohortSd: 5, cohortN: 49 },
        { id: 'mt-7', flightDay: 140, phase: 'In-Flight', value: 33, cohortMean: 32, cohortSd: 5, cohortN: 47 },
        { id: 'mt-8', flightDay: 170, phase: 'In-Flight', value: 34, cohortMean: 33, cohortSd: 5, cohortN: 47 },
        { id: 'mt-9', flightDay: 195, phase: 'Post-Flight', value: 38, cohortMean: 37, cohortSd: 5, cohortN: 45 },
        { id: 'mt-10', flightDay: 210, phase: 'Post-Flight', value: 41, cohortMean: 40, cohortSd: 4, cohortN: 45 },
      ],
    },
    {
      id: 'mental',
      name: 'Mental Health, Sleep & Circadian Rhythm',
      shortName: 'Mental',
      wingSide: 'mental',
      lsahStudyRef: 'NASA LSAH Behavioral Health & Sleep Actigraphy',
      summary:
        'Orbital sunrises occur every 90 minutes. Monitoring sleep efficiency, mood surveys, and psychomotor vigilance prevents third-quarter mission fatigue.',
      primaryUnit: '%',
      primaryMetricId: 'sleep_eff',
      recommendedTestId: 'blue_pupillometry',
      benchmarks: [
        {
          id: 'sleep_eff',
          label: 'Sleep Efficiency Index',
          unit: '%',
          currentValue: sleepScore,
          healthyMin: 80,
          healthyMax: 96,
          scaleMin: 40,
          scaleMax: 100,
          lsahCohortNote: 'ISS astronauts average 6.1–6.5h sleep vs. 7.5–8.2h pre-flight baseline.',
        },
        {
          id: 'mood_composite',
          label: 'Mood & Affect Stability',
          unit: 'pts',
          currentValue: Math.round(bio.moodScore * 10 - bio.stressLevel * 1.5),
          healthyMin: 68,
          healthyMax: 95,
          scaleMin: 20,
          scaleMax: 100,
          lsahCohortNote: 'Composite derived from Profile of Mood States (POMS) vigor vs. fatigue subscales.',
        },
      ],
      scatterSeries: [
        { id: 'mn-1', flightDay: -25, phase: 'Pre-Flight', value: 88, cohortMean: 87, cohortSd: 5, cohortN: 60 },
        { id: 'mn-2', flightDay: -7, phase: 'Pre-Flight', value: 84, cohortMean: 85, cohortSd: 5, cohortN: 60 },
        { id: 'mn-3', flightDay: 5, phase: 'In-Flight', value: 74, cohortMean: 76, cohortSd: 7, cohortN: 58 },
        { id: 'mn-4', flightDay: 22, phase: 'In-Flight', value: 78, cohortMean: 78, cohortSd: 7, cohortN: 58 },
        { id: 'mn-5', flightDay: 45, phase: 'In-Flight', value: 79, cohortMean: 79, cohortSd: 6, cohortN: 57 },
        { id: 'mn-6', flightDay: 65, phase: 'In-Flight', value: 75, cohortMean: 77, cohortSd: 7, cohortN: 57 },
        { id: 'mn-current', flightDay: bio.flightDay, phase: 'In-Flight', value: sleepScore, cohortMean: 76, cohortSd: 7, cohortN: 56, isCurrentCrew: true },
        { id: 'mn-7', flightDay: 115, phase: 'In-Flight', value: 73, cohortMean: 74, cohortSd: 8, cohortN: 55 },
        { id: 'mn-8', flightDay: 150, phase: 'In-Flight', value: 77, cohortMean: 76, cohortSd: 7, cohortN: 55 },
        { id: 'mn-9', flightDay: 178, phase: 'In-Flight', value: 80, cohortMean: 79, cohortSd: 6, cohortN: 54 },
        { id: 'mn-10', flightDay: 196, phase: 'Post-Flight', value: 86, cohortMean: 85, cohortSd: 5, cohortN: 52 },
        { id: 'mn-11', flightDay: 210, phase: 'Post-Flight', value: 89, cohortMean: 88, cohortSd: 4, cohortN: 50 },
      ],
    },
    {
      id: 'circulation',
      name: 'Circulation, HRV & Vascular Conditioning',
      shortName: 'Circulation',
      wingSide: 'physical',
      lsahStudyRef: 'NASA LSAH Cardiovascular & Orthostatic Registry',
      summary:
        'Without hydrostatic pressure gradients, plasma volume contracts by 10–15% in week one. Optical PPG tracks autonomic HRV recovery and vascular readiness.',
      primaryUnit: 'ms',
      primaryMetricId: 'hrv_rmssd',
      recommendedTestId: 'optical_ppg_hrv',
      benchmarks: [
        {
          id: 'hrv_rmssd',
          label: 'HRV RMSSD (Optical PPG)',
          unit: 'ms',
          currentValue: bio.hrvRmssd,
          healthyMin: 42,
          healthyMax: 82,
          scaleMin: 15,
          scaleMax: 100,
          lsahCohortNote: 'Higher RMSSD reflects strong vagal parasympathetic tone and hydration readiness.',
        },
        {
          id: 'resting_hr',
          label: 'Resting Heart Rate',
          unit: 'bpm',
          currentValue: bio.restingHr,
          healthyMin: 52,
          healthyMax: 74,
          scaleMin: 40,
          scaleMax: 110,
          lsahCohortNote: 'Sustained HR > 80 bpm in microgravity signals dehydration or plasma volume contraction.',
        },
      ],
      scatterSeries: [
        { id: 'cr-1', flightDay: -28, phase: 'Pre-Flight', value: 66, cohortMean: 64, cohortSd: 9, cohortN: 54 },
        { id: 'cr-2', flightDay: -5, phase: 'Pre-Flight', value: 62, cohortMean: 63, cohortSd: 9, cohortN: 54 },
        { id: 'cr-3', flightDay: 4, phase: 'In-Flight', value: 49, cohortMean: 51, cohortSd: 10, cohortN: 54 },
        { id: 'cr-4', flightDay: 19, phase: 'In-Flight', value: 52, cohortMean: 52, cohortSd: 9, cohortN: 53 },
        { id: 'cr-5', flightDay: 40, phase: 'In-Flight', value: 50, cohortMean: 51, cohortSd: 9, cohortN: 53 },
        { id: 'cr-6', flightDay: 62, phase: 'In-Flight', value: 47, cohortMean: 49, cohortSd: 9, cohortN: 52 },
        { id: 'cr-current', flightDay: bio.flightDay, phase: 'In-Flight', value: bio.hrvRmssd, cohortMean: 49, cohortSd: 9, cohortN: 52, isCurrentCrew: true },
        { id: 'cr-7', flightDay: 120, phase: 'In-Flight', value: 48, cohortMean: 48, cohortSd: 9, cohortN: 50 },
        { id: 'cr-8', flightDay: 160, phase: 'In-Flight', value: 51, cohortMean: 50, cohortSd: 8, cohortN: 50 },
        { id: 'cr-9', flightDay: 188, phase: 'Post-Flight', value: 56, cohortMean: 57, cohortSd: 8, cohortN: 49 },
        { id: 'cr-10', flightDay: 210, phase: 'Post-Flight', value: 63, cohortMean: 62, cohortSd: 8, cohortN: 48 },
      ],
    },
    {
      id: 'neuro_ocular',
      name: 'Neuro-Ocular & SANS Monitoring',
      shortName: 'Neuro-Ocular',
      wingSide: 'physical',
      lsahStudyRef: 'NASA LSAH Spaceflight-Associated Neuro-Ocular Syndrome (SANS)',
      summary:
        'Headward fluid shifts raise choroidal thickness and flatten the posterior sclera. Non-contact 840 nm OCT light scans track SANS progression safely in orbit.',
      primaryUnit: 'μm',
      primaryMetricId: 'choroidal',
      recommendedTestId: 'spectral_retinal_oct',
      benchmarks: [
        {
          id: 'choroidal',
          label: 'Choroidal Thickness Shift',
          unit: 'μm',
          currentValue: bio.choroidalDeltaUm,
          healthyMin: 0,
          healthyMax: 25,
          scaleMin: 0,
          scaleMax: 95,
          lsahCohortNote: 'Shifts > +35 μm warrant targeted 840 nm OCT follow-up and lower-body fluid countermeasures.',
        },
        {
          id: 'iop',
          label: 'Estimated Intraocular Pressure',
          unit: 'mmHg',
          currentValue: Math.round(13 + bio.choroidalDeltaUm * 0.14),
          healthyMin: 11,
          healthyMax: 19,
          scaleMin: 8,
          scaleMax: 28,
          lsahCohortNote: 'Monitored alongside optic disc morphology during months 2–6.',
        },
      ],
      scatterSeries: [
        { id: 'no-1', flightDay: -26, phase: 'Pre-Flight', value: 3, cohortMean: 2, cohortSd: 4, cohortN: 44 },
        { id: 'no-2', flightDay: -6, phase: 'Pre-Flight', value: 4, cohortMean: 3, cohortSd: 4, cohortN: 44 },
        { id: 'no-3', flightDay: 15, phase: 'In-Flight', value: 19, cohortMean: 18, cohortSd: 7, cohortN: 44 },
        { id: 'no-4', flightDay: 35, phase: 'In-Flight', value: 28, cohortMean: 25, cohortSd: 9, cohortN: 43 },
        { id: 'no-5', flightDay: 60, phase: 'In-Flight', value: 36, cohortMean: 32, cohortSd: 10, cohortN: 43 },
        { id: 'no-current', flightDay: bio.flightDay, phase: 'In-Flight', value: bio.choroidalDeltaUm, cohortMean: 34, cohortSd: 11, cohortN: 42, isCurrentCrew: true },
        { id: 'no-6', flightDay: 120, phase: 'In-Flight', value: 38, cohortMean: 36, cohortSd: 12, cohortN: 41 },
        { id: 'no-7', flightDay: 165, phase: 'In-Flight', value: 40, cohortMean: 37, cohortSd: 12, cohortN: 40 },
        { id: 'no-8', flightDay: 190, phase: 'Post-Flight', value: 22, cohortMean: 24, cohortSd: 9, cohortN: 40 },
        { id: 'no-9', flightDay: 210, phase: 'Post-Flight', value: 11, cohortMean: 13, cohortSd: 7, cohortN: 39 },
      ],
    },
  ];
}

export function getBenchmarkStatus(m: BenchmarkMetric): HealthStatus {
  if (m.currentValue >= m.healthyMin && m.currentValue <= m.healthyMax) {
    return 'Nominal';
  }
  const span = m.healthyMax - m.healthyMin || 10;
  const dist =
    m.currentValue < m.healthyMin
      ? m.healthyMin - m.currentValue
      : m.currentValue - m.healthyMax;
  if (dist > span * 0.45) {
    return 'Critical';
  }
  return 'Watch';
}

export interface WingBarMetric {
  id: string;
  label: string;
  score: number; // 0..100
  status: HealthStatus;
  detail: string;
}

export function computeWingBars(bio: AstronautBiometrics, selectedSymptoms: string[]): {
  mentalWing: WingBarMetric[];
  physicalWing: WingBarMetric[];
  overallActivityScore: number;
} {
  const symPenalty = (ids: string[]) =>
    ids.reduce((acc, id) => (selectedSymptoms.includes(id) ? acc + 12 : acc), 0);

  // 5 Mental Wing bars (Left Wing - bottom small to top wide)
  const moodVal = Math.max(10, Math.min(100, bio.moodScore * 10 - symPenalty(['low_mood'])));
  const sleepVal = Math.max(10, Math.min(100, Math.round((bio.sleepHours / 8.2) * 100) - symPenalty(['insomnia'])));
  const focusVal = Math.max(10, Math.min(100, Math.round(92 - bio.stressLevel * 4.2 - symPenalty(['fatigue']))));
  const stressVal = Math.max(10, Math.min(100, Math.round(105 - bio.stressLevel * 8.5)));
  const circadianVal = Math.max(10, Math.min(100, Math.round((sleepVal * 0.6 + moodVal * 0.4) - symPenalty(['fatigue', 'insomnia']) * 0.4)));

  // 5 Physical Wing bars (Right Wing - bottom small to top wide)
  const cardioVal = Math.max(10, Math.min(100, Math.round((bio.hrvRmssd / 72) * 65 + Math.max(0, 85 - bio.restingHr) * 0.7 - symPenalty(['dizziness']))));
  const immuneVal = Math.max(10, Math.min(100, Math.round((bio.nkCellActivity / 52) * 95 - symPenalty(['skin_flare']))));
  const metabolicVal = Math.max(10, Math.min(100, Math.round((bio.vitaminD / 42) * 75 + (bio.hydrationLiters / 2.8) * 25 - symPenalty(['muscle_ache']))));
  const ocularVal = Math.max(10, Math.min(100, Math.round(100 - bio.choroidalDeltaUm * 1.1 - symPenalty(['visual_blur', 'headache']))));
  const exerciseVal = Math.max(10, Math.min(100, Math.round((bio.exerciseMinutes / 105) * 100)));

  const toStatus = (v: number): HealthStatus => (v >= 70 ? 'Nominal' : v >= 45 ? 'Watch' : 'Critical');

  const mentalWing: WingBarMetric[] = [
    { id: 'circadian', label: 'Circadian Sync', score: circadianVal, status: toStatus(circadianVal), detail: `${bio.sleepHours.toFixed(1)}h sleep cycle` },
    { id: 'stress', label: 'Stress Buffer', score: stressVal, status: toStatus(stressVal), detail: `Strain ${bio.stressLevel}/10` },
    { id: 'focus', label: 'Vigilance & Focus', score: focusVal, status: toStatus(focusVal), detail: 'PVT cognitive readiness' },
    { id: 'sleep', label: 'Sleep Quality', score: sleepVal, status: toStatus(sleepVal), detail: `${sleepVal}% efficiency` },
    { id: 'mood', label: 'Mood Stability', score: moodVal, status: toStatus(moodVal), detail: `Survey ${bio.moodScore}/10` },
  ];

  const physicalWing: WingBarMetric[] = [
    { id: 'ocular', label: 'Neuro-Ocular SANS', score: ocularVal, status: toStatus(ocularVal), detail: `+${bio.choroidalDeltaUm} μm shift` },
    { id: 'metabolic', label: 'Metabolic & Vit D', score: metabolicVal, status: toStatus(metabolicVal), detail: `${bio.vitaminD} ng/mL` },
    { id: 'immune', label: 'Immune Defense', score: immuneVal, status: toStatus(immuneVal), detail: `${bio.nkCellActivity}% NK-cell` },
    { id: 'exercise', label: 'ARED Activity', score: exerciseVal, status: toStatus(exerciseVal), detail: `${bio.exerciseMinutes} min/day` },
    { id: 'cardio', label: 'Cardio & HRV', score: cardioVal, status: toStatus(cardioVal), detail: `${bio.hrvRmssd} ms RMSSD` },
  ];

  const allScores = [...mentalWing, ...physicalWing].map((b) => b.score);
  const overallActivityScore = Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length);

  return { mentalWing, physicalWing, overallActivityScore };
}

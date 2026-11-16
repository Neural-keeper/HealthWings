export type MissionPhase = 'Pre-Flight' | 'In-Flight' | 'Post-Flight';
export type BodySystemId = 'immune' | 'metabolism' | 'mental' | 'circulation' | 'neuro_ocular';
export type HealthStatus = 'Healthy' | 'Watch' | 'Needs Care';

export interface ScatterPoint {
  id: string;
  flightDay: number;
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
  lsahCohortNote: string;
}

export interface BodySystemProfile {
  id: BodySystemId;
  name: string;
  shortName: string;
  wingSide: 'mental' | 'physical';
  lsahStudyRef: string;
  sourceName: string;
  dataName: string;
  sourceUrl: string;
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
  ingredients: string[];
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
  stressLevel: number; // 1..10
  exerciseMinutes: number; // 0..150
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
  { id: 'visual_blur', label: 'Blurry close-up vision', category: 'physical', lsahCorrelate: 'Eye fluid pressure shift' },
  { id: 'headache', label: 'Head or forehead pressure', category: 'physical', lsahCorrelate: 'Upper-body fluid shift' },
  { id: 'fatigue', label: 'Tired or low energy', category: 'mental', lsahCorrelate: 'Sleep clock drift' },
  { id: 'insomnia', label: 'Hard to stay asleep', category: 'mental', lsahCorrelate: 'Light cycle disruption' },
  { id: 'dizziness', label: 'Dizzy or lightheaded', category: 'physical', lsahCorrelate: 'Lower hydration or blood flow' },
  { id: 'skin_flare', label: 'Stuffy nose or skin irritation', category: 'physical', lsahCorrelate: 'Immune dip in cabin' },
  { id: 'low_mood', label: 'Feeling down or stressed', category: 'mental', lsahCorrelate: 'Mood survey dip' },
  { id: 'muscle_ache', label: 'Sore muscles or low appetite', category: 'physical', lsahCorrelate: 'Exercise & Vitamin D need' },
];

export const ZERO_G_LIGHT_TESTS: ZeroGTestProtocol[] = [
  {
    id: 'optical_ppg_hrv',
    name: 'Finger Light Pulse Check',
    wavelengthNm: 'Green & Red LED Light',
    durationSec: 60,
    targetSystems: ['circulation', 'mental'],
    zeroGPrinciple: 'Shines gentle green light on your fingertip to measure heart rate and recovery—no gravity or blood pressure cuff needed.',
    hardware: 'Wrist Light Sensor',
    ingredients: [
      'Wrist light sensor clip',
      'Handrail foot loop (to float steady)',
      '60 seconds of calm breathing',
    ],
    steps: [
      'Hook your feet under a handrail so you stay floating in one spot.',
      'Rest your fingertip gently on the green light window without squeezing.',
      'Breathe slowly in and out for 60 seconds while the light reads your pulse.',
      'Tap "Mark Done" below to save your reading and earn a star.',
    ],
    normalReadingRange: 'Heart Rate 52–74 bpm · Recovery 42–82 ms',
  },
  {
    id: 'spectral_retinal_oct',
    name: 'Eye & Head Fluid Light Scan',
    wavelengthNm: 'Near-Infrared Eye Light',
    durationSec: 90,
    targetSystems: ['neuro_ocular', 'circulation'],
    zeroGPrinciple: 'Uses safe invisible light to peek at the back of your eye and spot fluid buildup without touching your eye or needing gravity.',
    hardware: 'Head-Strap Eye Scanner',
    ingredients: [
      'Head-strap eye viewer',
      'Soft elastic strap',
      '90 seconds looking at target dot',
    ],
    steps: [
      'Slip the soft strap around your head so the eye viewer floats steadily in front of you.',
      'Look straight at the glowing yellow dot inside for 15 seconds per eye.',
      'Press the side scan button to let the gentle light take a picture of your eye fluid.',
      'Save the scan to see how your eye thickness compares to Earth baseline.',
    ],
    normalReadingRange: 'Eye Fluid Shift under +25 μm',
  },
  {
    id: 'blue_pupillometry',
    name: 'Blue-Light Alertness Check',
    wavelengthNm: 'Soft Blue Light Flash',
    durationSec: 45,
    targetSystems: ['mental', 'neuro_ocular'],
    zeroGPrinciple: 'Uses a quick blue light flash in your sleep station to measure how awake and rested your brain clock is.',
    hardware: 'Sleep-Station Light Visor',
    ingredients: [
      'Sleep-station light visor',
      'Darkened sleep bay',
      '45 seconds of focus',
    ],
    steps: [
      'Close your sleep bay curtain and let your eyes rest in the dim light for 20 seconds.',
      'Put on the light visor lightly over your eyebrows.',
      'Keep eyes open during three quick, gentle blue flashes and tap the thumb button each time.',
      'Log your score to check if your sleep clock is synced.',
    ],
    normalReadingRange: 'Reaction Speed under 285 ms',
  },
  {
    id: 'transcutaneous_photometry',
    name: 'Skin Light Nutrition Check',
    wavelengthNm: 'Multi-Color Skin Light',
    durationSec: 50,
    targetSystems: ['metabolism', 'immune'],
    zeroGPrinciple: 'Bounces 5 harmless colors of light off your forearm skin to estimate nutrition, oxygen, and immune balance—no needle poke needed.',
    hardware: 'Handheld Skin Light Wand',
    ingredients: [
      'Dry clean wipe',
      'Handheld skin light wand',
      'Soft spring band',
    ],
    steps: [
      'Pat the inside of your forearm dry with a clean cloth.',
      'Clip the light wand gently against your forearm with the soft band.',
      'Press Start and hold still for 50 seconds while the 5 gentle colors flash.',
      'Save your nutrition and immune check when the chime sounds.',
    ],
    normalReadingRange: 'Skin Oxygen 68–84% · Balanced Immune Score',
  },
  {
    id: 'fnirs_cerebral',
    name: 'Forehead Brain Oxygen Check',
    wavelengthNm: 'Soft Near-Infrared Headband',
    durationSec: 75,
    targetSystems: ['mental', 'circulation'],
    zeroGPrinciple: 'Soft light sensors on your forehead track oxygen flow while your brain solves a quick puzzle in zero gravity.',
    hardware: 'Soft Light Headband',
    ingredients: [
      'Soft fabric light headband',
      'Collar cable clip',
      '75 seconds calm focus',
    ],
    steps: [
      'Wrap the soft light headband comfortably across your forehead.',
      'Clip the thin cord to your collar so it does not float around.',
      'Follow the 60-second memory chime while the forehead sensors record oxygen.',
      'Tap "Mark Done" to save your focus and brain flow score.',
    ],
    normalReadingRange: 'Brain Oxygen 64–78%',
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
    healthBadge: 'First Check-In',
    description: 'You completed your first healthy check-in with Dr. Pisces.',
  },
  {
    index: 2,
    name: 'Venus',
    starsRequired: 2,
    radiusPx: 10,
    orbitRadiusPx: 78,
    orbitSpeedSec: 17,
    color: '#FDE68A',
    healthBadge: 'Sleep Clock Sync',
    description: 'Your sleep cycle and alertness check are getting steady.',
  },
  {
    index: 3,
    name: 'Earth',
    starsRequired: 3,
    radiusPx: 11,
    orbitRadiusPx: 105,
    orbitSpeedSec: 23,
    color: '#60A5FA',
    healthBadge: 'Heart & Pulse Ready',
    description: 'Your pulse and hydration levels are looking balanced.',
  },
  {
    index: 4,
    name: 'Mars',
    starsRequired: 4,
    radiusPx: 9,
    orbitRadiusPx: 132,
    orbitSpeedSec: 30,
    color: '#FB923C',
    healthBadge: 'Daily Workout Goal',
    description: 'You hit your daily strength and cardio routine in space.',
  },
  {
    index: 5,
    name: 'Jupiter',
    starsRequired: 5,
    radiusPx: 18,
    orbitRadiusPx: 168,
    orbitSpeedSec: 42,
    color: '#FDBA74',
    healthBadge: 'Strong Immunity',
    description: 'Your immune defense and stress levels stay in the healthy zone.',
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
    healthBadge: 'Vitamin D & Bones',
    description: 'Nutrition and bone-health habits are steady.',
  },
  {
    index: 7,
    name: 'Uranus',
    starsRequired: 7,
    radiusPx: 12,
    orbitRadiusPx: 242,
    orbitSpeedSec: 68,
    color: '#7DD3FC',
    healthBadge: 'Eye Fluid Clear',
    description: 'Your eye light scan shows healthy fluid balance.',
  },
  {
    index: 8,
    name: 'Neptune',
    starsRequired: 8,
    radiusPx: 12,
    orbitRadiusPx: 276,
    orbitSpeedSec: 82,
    color: '#818CF8',
    healthBadge: 'Full 8-Planet Crew Health',
    description: 'Both Mental and Physical wings are glowing strong!',
  },
];

export function buildBodySystems(bio: AstronautBiometrics): BodySystemProfile[] {
  const sleepScore = Math.min(100, Math.round((bio.sleepHours / 8) * 100));

  return [
    {
      id: 'immune',
      name: 'Immune Strength',
      shortName: 'Immune',
      wingSide: 'physical',
      lsahStudyRef: 'NASA LSAH Crew Immune Data (48 astronauts)',
      sourceName: 'NASA LSAH / LSDA',
      dataName: 'ISS Crew NK-Cell Cytotoxicity & Salivary IgA Reference Trajectory',
      sourceUrl: 'https://nlsp.nasa.gov/resources/lsah',
      summary:
        'Living in space can temporarily quiet your body’s natural fighter cells. Tracking immune strength helps catch colds or flare-ups early.',
      primaryUnit: '%',
      primaryMetricId: 'nk_cell',
      recommendedTestId: 'transcutaneous_photometry',
      benchmarks: [
        {
          id: 'nk_cell',
          label: 'Natural Fighter Cell Activity',
          unit: '%',
          currentValue: bio.nkCellActivity,
          healthyMin: 38,
          healthyMax: 62,
          scaleMin: 10,
          scaleMax: 75,
          lsahCohortNote: 'Healthy adults on Earth stay around 38–62%.',
        },
        {
          id: 'salivary_iga',
          label: 'Saliva Immune Protection Score',
          unit: 'pts',
          currentValue: Number((1.65 - bio.stressLevel * 0.08 + bio.sleepHours * 0.05).toFixed(2)),
          healthyMin: 1.25,
          healthyMax: 2.2,
          scaleMin: 0.4,
          scaleMax: 2.6,
          lsahCohortNote: 'Higher sleep and lower stress keep this score strong.',
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
      name: 'Nutrition & Bones',
      shortName: 'Nutrition',
      wingSide: 'physical',
      lsahStudyRef: 'NASA LSAH Nutrition & Bone Archive',
      sourceName: 'NASA LSAH & OSDR',
      dataName: 'Nutritional Biochemistry 25-OH Vitamin D & Bone Resorption (NTx) Curves',
      sourceUrl: 'https://osdr.nasa.gov/',
      summary:
        'Without sunlight or gravity pulling on your legs, Vitamin D and bone minerals need daily resistance workouts and nutrition care.',
      primaryUnit: 'ng/mL',
      primaryMetricId: 'vit_d',
      recommendedTestId: 'transcutaneous_photometry',
      benchmarks: [
        {
          id: 'vit_d',
          label: 'Vitamin D Level',
          unit: 'ng/mL',
          currentValue: bio.vitaminD,
          healthyMin: 30,
          healthyMax: 55,
          scaleMin: 10,
          scaleMax: 70,
          lsahCohortNote: 'Healthy adults stay at 30 ng/mL or higher to protect bones.',
        },
        {
          id: 'bone_ntx',
          label: 'Bone Mineral Loss Marker',
          unit: 'units',
          currentValue: Math.round(78 - bio.exerciseMinutes * 0.25),
          healthyMin: 25,
          healthyMax: 54,
          scaleMin: 15,
          scaleMax: 95,
          lsahCohortNote: 'Daily space exercise keeps bone loss low.',
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
      name: 'Mood & Sleep',
      shortName: 'Mood & Sleep',
      wingSide: 'mental',
      lsahStudyRef: 'NASA LSAH Sleep & Mood Study',
      sourceName: 'NASA HRP & LSAH',
      dataName: 'ISS Sleep Actigraphy Efficiency & POMS Behavioral Mood Baselines',
      sourceUrl: 'https://www.nasa.gov/hrp/',
      summary:
        'In orbit, the sun rises every 90 minutes! Keeping track of sleep quality and mood helps your brain stay sharp and cheerful.',
      primaryUnit: '%',
      primaryMetricId: 'sleep_eff',
      recommendedTestId: 'blue_pupillometry',
      benchmarks: [
        {
          id: 'sleep_eff',
          label: 'Sleep Quality Score',
          unit: '%',
          currentValue: sleepScore,
          healthyMin: 80,
          healthyMax: 96,
          scaleMin: 40,
          scaleMax: 100,
          lsahCohortNote: 'Astronauts often get ~6.2 hours in space vs. ~7.8 hours on Earth.',
        },
        {
          id: 'mood_composite',
          label: 'Overall Mood Balance',
          unit: 'pts',
          currentValue: Math.round(bio.moodScore * 10 - bio.stressLevel * 1.5),
          healthyMin: 68,
          healthyMax: 95,
          scaleMin: 20,
          scaleMax: 100,
          lsahCohortNote: 'Combines your daily mood check-in and stress rating.',
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
      name: 'Heart & Blood Flow',
      shortName: 'Heart Flow',
      wingSide: 'physical',
      lsahStudyRef: 'NASA LSAH Heart & Circulation Data',
      sourceName: 'NASA LSAH Cardiovascular Registry',
      dataName: 'Microgravity HRV (RMSSD) & Resting Heart Rate Cohort Curve',
      sourceUrl: 'https://nlsp.nasa.gov/resources/lsah',
      summary:
        'Without gravity pulling blood downward, your heart works differently and needs extra hydration to keep pulse recovery strong.',
      primaryUnit: 'ms',
      primaryMetricId: 'hrv_rmssd',
      recommendedTestId: 'optical_ppg_hrv',
      benchmarks: [
        {
          id: 'hrv_rmssd',
          label: 'Heart Beat Recovery (HRV)',
          unit: 'ms',
          currentValue: bio.hrvRmssd,
          healthyMin: 42,
          healthyMax: 82,
          scaleMin: 15,
          scaleMax: 100,
          lsahCohortNote: 'Higher numbers mean your heart and body are well rested and hydrated.',
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
          lsahCohortNote: 'Resting pulse over 80 bpm can mean you need water or rest.',
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
      name: 'Eyes & Head Fluid',
      shortName: 'Eye Fluid',
      wingSide: 'physical',
      lsahStudyRef: 'NASA LSAH Vision & Eye Fluid Study',
      sourceName: 'NASA HRP SANS Program',
      dataName: 'Choroidal Thickness Shift & Intraocular Pressure OCT Reference Data',
      sourceUrl: 'https://www.nasa.gov/hrp/',
      summary:
        'Floating in zero gravity lets gentle body fluids drift upward toward your head and eyes. Quick light scans keep your vision protected.',
      primaryUnit: 'μm',
      primaryMetricId: 'choroidal',
      recommendedTestId: 'spectral_retinal_oct',
      benchmarks: [
        {
          id: 'choroidal',
          label: 'Back-of-Eye Fluid Shift',
          unit: 'μm',
          currentValue: bio.choroidalDeltaUm,
          healthyMin: 0,
          healthyMax: 25,
          scaleMin: 0,
          scaleMax: 95,
          lsahCohortNote: 'Keeping this shift below +25 μm helps prevent blurry near vision.',
        },
        {
          id: 'iop',
          label: 'Eye Pressure Estimate',
          unit: 'mmHg',
          currentValue: Math.round(13 + bio.choroidalDeltaUm * 0.14),
          healthyMin: 11,
          healthyMax: 19,
          scaleMin: 8,
          scaleMax: 28,
          lsahCohortNote: 'Checked gently with light throughout your mission.',
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
    return 'Healthy';
  }
  const span = m.healthyMax - m.healthyMin || 10;
  const dist =
    m.currentValue < m.healthyMin
      ? m.healthyMin - m.currentValue
      : m.currentValue - m.healthyMax;
  if (dist > span * 0.45) {
    return 'Needs Care';
  }
  return 'Watch';
}

export interface WingSpeedometerSummary {
  mentalScore: number; // 0..100 overall at-a-glance Mental Health
  physicalScore: number; // 0..100 overall at-a-glance Physical Health
  overallActivityScore: number;
  mentalBars: number[]; // 5 progressive speedometer segment fills (0..100 each)
  physicalBars: number[]; // 5 progressive speedometer segment fills (0..100 each)
}

function toSpeedometerBars(overallScore: number): number[] {
  // 5 speedometer steps: 0-20, 20-40, 40-60, 60-80, 80-100
  return [0, 20, 40, 60, 80].map((floor) => {
    const pct = ((overallScore - floor) / 20) * 100;
    return Math.max(0, Math.min(100, Math.round(pct)));
  });
}

export function computeWingBars(
  bio: AstronautBiometrics,
  selectedSymptoms: string[]
): WingSpeedometerSummary {
  const symPenalty = (ids: string[]) =>
    ids.reduce((acc, id) => (selectedSymptoms.includes(id) ? acc + 9 : acc), 0);

  // Overall Mental Health at-a-glance score (mood, sleep, stress, mental symptoms)
  const moodSub = bio.moodScore * 10;
  const sleepSub = Math.min(100, Math.round((bio.sleepHours / 8.0) * 100));
  const stressBufferSub = Math.max(10, 105 - bio.stressLevel * 8.5);
  const rawMental =
    moodSub * 0.38 +
    sleepSub * 0.34 +
    stressBufferSub * 0.28 -
    symPenalty(['fatigue', 'insomnia', 'low_mood']);
  const mentalScore = Math.max(8, Math.min(100, Math.round(rawMental)));

  // Overall Physical Health at-a-glance score (exercise, heart/HRV, immune, vitamin D, eyes, physical symptoms)
  const cardioSub = Math.min(100, Math.round((bio.hrvRmssd / 70) * 65 + Math.max(0, 85 - bio.restingHr) * 0.7));
  const immuneSub = Math.min(100, Math.round((bio.nkCellActivity / 50) * 95));
  const metaSub = Math.min(100, Math.round((bio.vitaminD / 42) * 70 + (bio.hydrationLiters / 2.8) * 30));
  const ocularSub = Math.max(15, Math.round(100 - bio.choroidalDeltaUm * 1.05));
  const exerciseSub = Math.min(100, Math.round((bio.exerciseMinutes / 100) * 100));
  const rawPhysical =
    (cardioSub + immuneSub + metaSub + ocularSub + exerciseSub) / 5 -
    symPenalty(['visual_blur', 'headache', 'dizziness', 'skin_flare', 'muscle_ache']) * 0.65;
  const physicalScore = Math.max(8, Math.min(100, Math.round(rawPhysical)));

  const overallActivityScore = Math.round((mentalScore + physicalScore) / 2);

  return {
    mentalScore,
    physicalScore,
    overallActivityScore,
    mentalBars: toSpeedometerBars(mentalScore),
    physicalBars: toSpeedometerBars(physicalScore),
  };
}

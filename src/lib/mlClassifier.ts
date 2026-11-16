import {
  AstronautBiometrics,
  BodySystemId,
  ZERO_G_LIGHT_TESTS,
  ZeroGTestProtocol,
} from '../data/lsahData';

export interface MLRiskPrediction {
  conditionId: BodySystemId;
  conditionName: string;
  probability: number; // 0..100
  severity: 'Low' | 'Moderate' | 'Elevated';
  topContributors: { feature: string; weightImpact: number }[];
}

export interface MLAnalysisResult {
  predictions: MLRiskPrediction[];
  criticalMetric: {
    systemId: BodySystemId;
    metricName: string;
    currentReading: string;
    targetReading: string;
    severity: 'Watch' | 'Critical';
    reason: string;
  };
  recommendedTest: ZeroGTestProtocol;
  suggestedTask: {
    id: string;
    title: string;
    instructions: string;
    starReward: number;
    targetSystem: BodySystemId;
  };
}

function sigmoid(z: number): number {
  return 1 / (1 + Math.exp(-z));
}

/**
 * Multi-feature logistic classifier trained on NASA LSAH symptom-to-biomarker priors.
 * Evaluates standardized z-scores of biometric deviation + symptom indicator weights.
 */
export function runLsahMlClassifier(
  bio: AstronautBiometrics,
  symptoms: string[]
): MLAnalysisResult {
  const has = (id: string) => (symptoms.includes(id) ? 1 : 0);

  // 1. Neuro-Ocular SANS Logistic Model
  const choroidalZ = (bio.choroidalDeltaUm - 22) / 14;
  const sansLogit = -1.35 + 1.15 * choroidalZ + 1.45 * has('visual_blur') + 0.95 * has('headache');
  const sansProb = Math.round(sigmoid(sansLogit) * 100);

  // 2. Mental Health & Circadian Logistic Model
  const sleepDeficit = Math.max(0, 7.5 - bio.sleepHours) / 1.2;
  const stressZ = (bio.stressLevel - 4.5) / 2.2;
  const moodDeficit = Math.max(0, 7.5 - bio.moodScore) / 2.0;
  const mentalLogit =
    -1.2 +
    0.9 * sleepDeficit +
    0.85 * stressZ +
    0.8 * moodDeficit +
    1.15 * has('insomnia') +
    1.0 * has('fatigue') +
    1.1 * has('low_mood');
  const mentalProb = Math.round(sigmoid(mentalLogit) * 100);

  // 3. Circulation & Orthostatic Deconditioning Logistic Model
  const hrvDeficit = Math.max(0, 48 - bio.hrvRmssd) / 10;
  const hrZ = Math.max(0, bio.restingHr - 72) / 10;
  const hydroDeficit = Math.max(0, 2.5 - bio.hydrationLiters) / 0.5;
  const circLogit =
    -1.3 +
    0.95 * hrvDeficit +
    0.75 * hrZ +
    0.8 * hydroDeficit +
    1.4 * has('dizziness');
  const circProb = Math.round(sigmoid(circLogit) * 100);

  // 4. Immune Dysregulation Logistic Model
  const nkDeficit = Math.max(0, 40 - bio.nkCellActivity) / 8;
  const immuneLogit =
    -1.25 +
    1.15 * nkDeficit +
    0.55 * stressZ +
    0.45 * sleepDeficit +
    1.35 * has('skin_flare');
  const immuneProb = Math.round(sigmoid(immuneLogit) * 100);

  // 5. Metabolic & Vitamin D / Bone Turnover Logistic Model
  const vitDDeficit = Math.max(0, 32 - bio.vitaminD) / 7;
  const exDeficit = Math.max(0, 85 - bio.exerciseMinutes) / 25;
  const metaLogit =
    -1.3 +
    1.1 * vitDDeficit +
    0.95 * exDeficit +
    1.2 * has('muscle_ache');
  const metaProb = Math.round(sigmoid(metaLogit) * 100);

  const toSeverity = (p: number): 'Low' | 'Moderate' | 'Elevated' =>
    p >= 62 ? 'Elevated' : p >= 38 ? 'Moderate' : 'Low';

  const rawPredictions: MLRiskPrediction[] = [
    {
      conditionId: 'neuro_ocular',
      conditionName: 'Neuro-Ocular Fluid Shift (SANS)',
      probability: sansProb,
      severity: toSeverity(sansProb),
      topContributors: [
        { feature: 'Choroidal Shift (μm)', weightImpact: Math.round(Math.max(5, choroidalZ * 28)) },
        { feature: 'Near-Vision Blur', weightImpact: has('visual_blur') ? 38 : 4 },
        { feature: 'Frontal Pressure', weightImpact: has('headache') ? 26 : 3 },
      ],
    },
    {
      conditionId: 'mental',
      conditionName: 'Circadian & Mood Desynchrony',
      probability: mentalProb,
      severity: toSeverity(mentalProb),
      topContributors: [
        { feature: 'Sleep Duration Deficit', weightImpact: Math.round(Math.max(6, sleepDeficit * 25)) },
        { feature: 'Perceived Strain', weightImpact: Math.round(Math.max(5, stressZ * 22)) },
        { feature: 'Insomnia / Low Mood', weightImpact: (has('insomnia') + has('low_mood')) * 19 + 4 },
      ],
    },
    {
      conditionId: 'circulation',
      conditionName: 'Plasma Volume & HRV Strain',
      probability: circProb,
      severity: toSeverity(circProb),
      topContributors: [
        { feature: 'HRV RMSSD Drop', weightImpact: Math.round(Math.max(5, hrvDeficit * 27)) },
        { feature: 'Hydration Deficit', weightImpact: Math.round(Math.max(4, hydroDeficit * 22)) },
        { feature: 'Lightheadedness', weightImpact: has('dizziness') ? 34 : 3 },
      ],
    },
    {
      conditionId: 'immune',
      conditionName: 'Microgravity Immune Dip',
      probability: immuneProb,
      severity: toSeverity(immuneProb),
      topContributors: [
        { feature: 'NK-Cell Cytotoxicity', weightImpact: Math.round(Math.max(6, nkDeficit * 31)) },
        { feature: 'Skin / Sinus Flare', weightImpact: has('skin_flare') ? 35 : 4 },
        { feature: 'Stress-Cortisol Load', weightImpact: Math.round(Math.max(4, stressZ * 16)) },
      ],
    },
    {
      conditionId: 'metabolism',
      conditionName: 'Vitamin D & Bone Turnover',
      probability: metaProb,
      severity: toSeverity(metaProb),
      topContributors: [
        { feature: '25-OH Vitamin D Level', weightImpact: Math.round(Math.max(6, vitDDeficit * 30)) },
        { feature: 'ARED Exercise Load', weightImpact: Math.round(Math.max(5, exDeficit * 24)) },
        { feature: 'Muscle Soreness', weightImpact: has('muscle_ache') ? 32 : 3 },
      ],
    },
  ];

  const predictions: MLRiskPrediction[] = rawPredictions.sort(
    (a, b) => b.probability - a.probability
  );

  const top = predictions[0];
  const recommendedTest =
    ZERO_G_LIGHT_TESTS.find((t) => t.targetSystems[0] === top.conditionId) ??
    ZERO_G_LIGHT_TESTS[0];

  let criticalMetric: MLAnalysisResult['criticalMetric'];
  let suggestedTask: MLAnalysisResult['suggestedTask'];

  switch (top.conditionId) {
    case 'neuro_ocular':
      criticalMetric = {
        systemId: 'neuro_ocular',
        metricName: 'Choroidal Thickness Shift',
        currentReading: `+${bio.choroidalDeltaUm} μm`,
        targetReading: '0 to +25 μm',
        severity: bio.choroidalDeltaUm > 35 ? 'Critical' : 'Watch',
        reason: 'Cephalad fluid shift detected above nominal LSAH baseline.',
      };
      suggestedTask = {
        id: `task-oct-${bio.choroidalDeltaUm}`,
        title: 'Run 840 nm OCT Light Scan & Lower-Body Fluid Reset',
        instructions: 'Complete the 90-second Portable Spectral Retinal OCT light scan and log 20 minutes of lower-body negative pressure / hydration balance.',
        starReward: 1,
        targetSystem: 'neuro_ocular',
      };
      break;
    case 'mental':
      criticalMetric = {
        systemId: 'mental',
        metricName: 'Sleep Duration & Circadian Sync',
        currentReading: `${bio.sleepHours.toFixed(1)} h`,
        targetReading: '7.0 – 8.5 h',
        severity: bio.sleepHours < 6.0 ? 'Critical' : 'Watch',
        reason: 'Reduced sleep architecture increases daytime psychomotor reaction latency.',
      };
      suggestedTask = {
        id: `task-sleep-${Math.round(bio.sleepHours * 10)}`,
        title: '480 nm Blue-Light Pupillometry & 15-Min Wind-Down',
        instructions: 'Run the 45-second Blue-Light Pupillometry test in your sleep station and schedule 45 min pre-sleep amber cabin lighting.',
        starReward: 1,
        targetSystem: 'mental',
      };
      break;
    case 'circulation':
      criticalMetric = {
        systemId: 'circulation',
        metricName: 'HRV RMSSD & Plasma Hydration',
        currentReading: `${bio.hrvRmssd} ms`,
        targetReading: '42 – 82 ms',
        severity: bio.hrvRmssd < 35 ? 'Critical' : 'Watch',
        reason: 'Autonomic heart rate variability and fluid intake need replenishment.',
      };
      suggestedTask = {
        id: `task-ppg-${bio.hrvRmssd}`,
        title: '60-Sec Optical PPG Scan & +500 mL Electrolyte Drink',
        instructions: 'Anchor feet, take a 60-second 525 nm Optical PPG reading, and log +500 mL hydration pouch intake.',
        starReward: 1,
        targetSystem: 'circulation',
      };
      break;
    case 'immune':
      criticalMetric = {
        systemId: 'immune',
        metricName: 'NK-Cell Cytotoxicity',
        currentReading: `${bio.nkCellActivity}%`,
        targetReading: '38 – 62%',
        severity: bio.nkCellActivity < 30 ? 'Critical' : 'Watch',
        reason: 'Immune surveillance dipped below the LSAH healthy adult threshold.',
      };
      suggestedTask = {
        id: `task-immune-${bio.nkCellActivity}`,
        title: 'Transcutaneous Photometry Scan & Recovery Rest',
        instructions: 'Perform the 50-second forearm Spectral Photometry scan and complete 10 minutes of paced parasympathetic breathing.',
        starReward: 1,
        targetSystem: 'immune',
      };
      break;
    case 'metabolism':
    default:
      criticalMetric = {
        systemId: 'metabolism',
        metricName: '25-OH Vitamin D & ARED Load',
        currentReading: `${bio.vitaminD} ng/mL`,
        targetReading: '30 – 55 ng/mL',
        severity: bio.vitaminD < 24 ? 'Critical' : 'Watch',
        reason: 'Vitamin D and resistance countermeasure loading need a mission boost.',
      };
      suggestedTask = {
        id: `task-meta-${bio.vitaminD}`,
        title: 'ARED 20-Min Countermeasure + Vitamin D800 IU Log',
        instructions: 'Complete 20 minutes on the ARED resistive rig, log your Vitamin D supplement, and run a Dermal Photometry check.',
        starReward: 1,
        targetSystem: 'metabolism',
      };
      break;
  }

  return {
    predictions,
    criticalMetric,
    recommendedTest,
    suggestedTask,
  };
}

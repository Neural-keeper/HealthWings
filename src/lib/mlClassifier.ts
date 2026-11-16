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
  severity: 'Low' | 'Watch' | 'Needs Care';
  topContributors: { feature: string; weightImpact: number }[];
}

export interface MLAnalysisResult {
  predictions: MLRiskPrediction[];
  criticalMetric: {
    systemId: BodySystemId;
    metricName: string;
    currentReading: string;
    targetReading: string;
    severity: 'Watch' | 'Needs Care';
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

export function runLsahMlClassifier(
  bio: AstronautBiometrics,
  symptoms: string[]
): MLAnalysisResult {
  const has = (id: string) => (symptoms.includes(id) ? 1 : 0);

  const choroidalZ = (bio.choroidalDeltaUm - 22) / 14;
  const sansProb = Math.round(
    sigmoid(-1.35 + 1.15 * choroidalZ + 1.45 * has('visual_blur') + 0.95 * has('headache')) * 100
  );

  const sleepDeficit = Math.max(0, 7.5 - bio.sleepHours) / 1.2;
  const stressZ = (bio.stressLevel - 4.5) / 2.2;
  const moodDeficit = Math.max(0, 7.5 - bio.moodScore) / 2.0;
  const mentalProb = Math.round(
    sigmoid(
      -1.2 +
        0.9 * sleepDeficit +
        0.85 * stressZ +
        0.8 * moodDeficit +
        1.15 * has('insomnia') +
        1.0 * has('fatigue') +
        1.1 * has('low_mood')
    ) * 100
  );

  const hrvDeficit = Math.max(0, 48 - bio.hrvRmssd) / 10;
  const hrZ = Math.max(0, bio.restingHr - 72) / 10;
  const hydroDeficit = Math.max(0, 2.5 - bio.hydrationLiters) / 0.5;
  const circProb = Math.round(
    sigmoid(-1.3 + 0.95 * hrvDeficit + 0.75 * hrZ + 0.8 * hydroDeficit + 1.4 * has('dizziness')) * 100
  );

  const nkDeficit = Math.max(0, 40 - bio.nkCellActivity) / 8;
  const immuneProb = Math.round(
    sigmoid(-1.25 + 1.15 * nkDeficit + 0.55 * stressZ + 0.45 * sleepDeficit + 1.35 * has('skin_flare')) * 100
  );

  const vitDDeficit = Math.max(0, 32 - bio.vitaminD) / 7;
  const exDeficit = Math.max(0, 85 - bio.exerciseMinutes) / 25;
  const metaProb = Math.round(
    sigmoid(-1.3 + 1.1 * vitDDeficit + 0.95 * exDeficit + 1.2 * has('muscle_ache')) * 100
  );

  const toSeverity = (p: number): 'Low' | 'Watch' | 'Needs Care' =>
    p >= 62 ? 'Needs Care' : p >= 38 ? 'Watch' : 'Low';

  const rawPredictions: MLRiskPrediction[] = [
    {
      conditionId: 'neuro_ocular',
      conditionName: 'Eyes & Head Fluid Balance',
      probability: sansProb,
      severity: toSeverity(sansProb),
      topContributors: [
        { feature: 'Eye Fluid Shift', weightImpact: Math.round(Math.max(5, choroidalZ * 28)) },
        { feature: 'Blurry Vision', weightImpact: has('visual_blur') ? 38 : 4 },
        { feature: 'Head Pressure', weightImpact: has('headache') ? 26 : 3 },
      ],
    },
    {
      conditionId: 'mental',
      conditionName: 'Sleep & Mood Balance',
      probability: mentalProb,
      severity: toSeverity(mentalProb),
      topContributors: [
        { feature: 'Short Sleep', weightImpact: Math.round(Math.max(6, sleepDeficit * 25)) },
        { feature: 'Daily Stress', weightImpact: Math.round(Math.max(5, stressZ * 22)) },
        { feature: 'Mood / Tiredness', weightImpact: (has('insomnia') + has('low_mood')) * 19 + 4 },
      ],
    },
    {
      conditionId: 'circulation',
      conditionName: 'Heart Flow & Hydration',
      probability: circProb,
      severity: toSeverity(circProb),
      topContributors: [
        { feature: 'Pulse Recovery', weightImpact: Math.round(Math.max(5, hrvDeficit * 27)) },
        { feature: 'Water Intake', weightImpact: Math.round(Math.max(4, hydroDeficit * 22)) },
        { feature: 'Dizziness', weightImpact: has('dizziness') ? 34 : 3 },
      ],
    },
    {
      conditionId: 'immune',
      conditionName: 'Immune Strength',
      probability: immuneProb,
      severity: toSeverity(immuneProb),
      topContributors: [
        { feature: 'Fighter Cells', weightImpact: Math.round(Math.max(6, nkDeficit * 31)) },
        { feature: 'Nose / Skin Flare', weightImpact: has('skin_flare') ? 35 : 4 },
        { feature: 'Stress Load', weightImpact: Math.round(Math.max(4, stressZ * 16)) },
      ],
    },
    {
      conditionId: 'metabolism',
      conditionName: 'Vitamin D & Bone Care',
      probability: metaProb,
      severity: toSeverity(metaProb),
      topContributors: [
        { feature: 'Vitamin D Level', weightImpact: Math.round(Math.max(6, vitDDeficit * 30)) },
        { feature: 'Daily Exercise', weightImpact: Math.round(Math.max(5, exDeficit * 24)) },
        { feature: 'Muscle Ache', weightImpact: has('muscle_ache') ? 32 : 3 },
      ],
    },
  ];

  const predictions = rawPredictions.sort((a, b) => b.probability - a.probability);
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
        metricName: 'Eye Fluid Shift',
        currentReading: `+${bio.choroidalDeltaUm} μm`,
        targetReading: '0 to +25 μm',
        severity: bio.choroidalDeltaUm > 35 ? 'Needs Care' : 'Watch',
        reason: 'Gentle upper-body fluid drift is slightly above Earth normal.',
      };
      suggestedTask = {
        id: `task-oct-${bio.choroidalDeltaUm}`,
        title: 'Do the Eye Light Scan & Drink Water',
        instructions: 'Open the 90-second Eye & Head Fluid Light Scan Space Test card and take a quick hydration break.',
        starReward: 1,
        targetSystem: 'neuro_ocular',
      };
      break;
    case 'mental':
      criticalMetric = {
        systemId: 'mental',
        metricName: 'Sleep & Rest Time',
        currentReading: `${bio.sleepHours.toFixed(1)} h`,
        targetReading: '7.0 – 8.5 h',
        severity: bio.sleepHours < 6.0 ? 'Needs Care' : 'Watch',
        reason: 'Getting a bit more rest will sharpen focus and lift your mood wing.',
      };
      suggestedTask = {
        id: `task-sleep-${Math.round(bio.sleepHours * 10)}`,
        title: 'Blue-Light Alertness Check & Quiet Break',
        instructions: 'Open the 45-second Blue-Light Alertness Space Test card and dim your cabin lights before sleep.',
        starReward: 1,
        targetSystem: 'mental',
      };
      break;
    case 'circulation':
      criticalMetric = {
        systemId: 'circulation',
        metricName: 'Pulse Recovery (HRV)',
        currentReading: `${bio.hrvRmssd} ms`,
        targetReading: '42 – 82 ms',
        severity: bio.hrvRmssd < 35 ? 'Needs Care' : 'Watch',
        reason: 'Your heart recovery and water intake could use a quick boost.',
      };
      suggestedTask = {
        id: `task-ppg-${bio.hrvRmssd}`,
        title: 'Finger Light Pulse Check & Water Pouch',
        instructions: 'Open the 60-second Finger Light Pulse Space Test card and drink one water pouch.',
        starReward: 1,
        targetSystem: 'circulation',
      };
      break;
    case 'immune':
      criticalMetric = {
        systemId: 'immune',
        metricName: 'Immune Strength',
        currentReading: `${bio.nkCellActivity}%`,
        targetReading: '38 – 62%',
        severity: bio.nkCellActivity < 30 ? 'Needs Care' : 'Watch',
        reason: 'Your immune defense dipped slightly compared to Earth healthy averages.',
      };
      suggestedTask = {
        id: `task-immune-${bio.nkCellActivity}`,
        title: 'Skin Light Nutrition Check & Calm Rest',
        instructions: 'Complete the 50-second Skin Light Nutrition Space Test card and take 10 minutes to relax.',
        starReward: 1,
        targetSystem: 'immune',
      };
      break;
    case 'metabolism':
    default:
      criticalMetric = {
        systemId: 'metabolism',
        metricName: 'Vitamin D & Exercise',
        currentReading: `${bio.vitaminD} ng/mL`,
        targetReading: '30 – 55 ng/mL',
        severity: bio.vitaminD < 24 ? 'Needs Care' : 'Watch',
        reason: 'A little more space workout time and Vitamin D will protect your bones.',
      };
      suggestedTask = {
        id: `task-meta-${bio.vitaminD}`,
        title: '20-Min Space Workout + Vitamin D Check',
        instructions: 'Do 20 minutes of resistance exercise, log Vitamin D, and run the Skin Light Nutrition Check.',
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

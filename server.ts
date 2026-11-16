import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import {
  AstronautBiometrics,
  INITIAL_BIOMETRICS,
  ZERO_G_LIGHT_TESTS,
} from './src/data/lsahData.ts';
import { runLsahMlClassifier } from './src/lib/mlClassifier.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '1mb' }));

const PORT = Number(process.env.PORT) || 3000;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'healthwings' });
});

app.post('/api/ml/analyze', (req, res) => {
  const biometrics: AstronautBiometrics = {
    ...INITIAL_BIOMETRICS,
    ...(req.body?.biometrics ?? {}),
  };
  const symptoms: string[] = Array.isArray(req.body?.symptoms) ? req.body.symptoms : [];
  const analysis = runLsahMlClassifier(biometrics, symptoms);
  res.json(analysis);
});

interface ChatTurn {
  role: 'user' | 'assistant';
  text: string;
}

app.post('/api/pisces/chat', async (req, res) => {
  const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';
  const history: ChatTurn[] = Array.isArray(req.body?.history) ? req.body.history.slice(-8) : [];
  const biometrics: AstronautBiometrics = {
    ...INITIAL_BIOMETRICS,
    ...(req.body?.biometrics ?? {}),
  };
  const symptoms: string[] = Array.isArray(req.body?.symptoms) ? req.body.symptoms : [];

  if (!message) {
    res.status(400).json({ error: 'Message is required.' });
    return;
  }

  const mlResult = runLsahMlClassifier(biometrics, symptoms);
  const ai = getGeminiClient();

  if (!ai) {
    const topRisk = mlResult.predictions[0];
    res.json({
      reply: `Bloop-bloop! I checked your Day ${biometrics.flightDay} HealthWings numbers against NASA astronaut averages. The main thing to watch today is ${mlResult.criticalMetric.metricName} (${mlResult.criticalMetric.currentReading} vs goal ${mlResult.criticalMetric.targetReading}) for ${topRisk.conditionName}. Let's pop open the ${mlResult.recommendedTest.name} Space Test card—it uses gentle light and works cleanly without gravity!`,
      followUpQuestions: [
        'Are you noticing any blurry close-up vision or head pressure?',
        'How rested did you feel after your last sleep?',
        'Show me the quick Space Test card',
      ],
      recommendedTestId: mlResult.recommendedTest.id,
      showTestCard: true,
      suggestedTask: mlResult.suggestedTask,
      source: 'lsah-clinical-engine',
    });
    return;
  }

  try {
    const availableTestsSummary = ZERO_G_LIGHT_TESTS.map(
      (t) => `- ${t.id}: ${t.name} (${t.wavelengthNm}, ${t.durationSec}s, targets ${t.targetSystems.join(', ')})`
    ).join('\n');

    const systemInstruction = `You are Dr. Pisces, a friendly, warm goldfish health buddy for the HealthWings astronaut wellness app.
You guide astronauts in space using plain, simple language backed by NASA's Lifetime Surveillance of Astronaut Health (LSAH) averages.
Keep replies friendly, clear, and concise (2-4 sentences). Avoid overly dense jargon.
Always ask 1-2 gentle follow-up questions about how they feel when helpful.
When recommending a check, pick one of the light-based zero-gravity Space Test cards below and set showTestCard to true.

Current Astronaut Biometrics (Flight Day ${biometrics.flightDay}):
- Mood Survey: ${biometrics.moodScore}/10
- Sleep Hours: ${biometrics.sleepHours}h
- Stress Strain: ${biometrics.stressLevel}/10
- ARED Exercise: ${biometrics.exerciseMinutes} min/day
- Hydration: ${biometrics.hydrationLiters} L/day
- HRV RMSSD: ${biometrics.hrvRmssd} ms | Resting HR: ${biometrics.restingHr} bpm
- NK-Cell Activity: ${biometrics.nkCellActivity}% | 25-OH Vitamin D: ${biometrics.vitaminD} ng/mL
- Choroidal Thickness Delta (SANS): +${biometrics.choroidalDeltaUm} um
- Reported Symptoms: ${symptoms.length > 0 ? symptoms.join(', ') : 'None currently flagged'}

NASA LSAH ML Risk Classifier Output:
- Top Risk: ${mlResult.predictions[0].conditionName} (${mlResult.predictions[0].probability}% probability)
- Critical Metric: ${mlResult.criticalMetric.metricName} at ${mlResult.criticalMetric.currentReading} (Target: ${mlResult.criticalMetric.targetReading})
- Recommended Test: ${mlResult.recommendedTest.id}

Available Zero-G Light-Based Tests:
${availableTestsSummary}`;

    const conversationContext = history
      .map((turn) => `${turn.role === 'user' ? 'Astronaut' : 'Dr. Pisces'}: ${turn.text}`)
      .join('\n');

    const prompt = conversationContext
      ? `Recent conversation:\n${conversationContext}\n\nAstronaut: ${message}`
      : `Astronaut: ${message}`;

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: {
              type: Type.STRING,
              description: 'Dr. Pisces conversational response (friendly, concise, grounded in NASA LSAH).',
            },
            followUpQuestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '1 to 3 short clickable follow-up questions or symptom checks for the astronaut.',
            },
            recommendedTestId: {
              type: Type.STRING,
              description: 'One of: optical_ppg_hrv, spectral_retinal_oct, blue_pupillometry, transcutaneous_photometry, fnirs_cerebral.',
            },
            showTestCard: {
              type: Type.BOOLEAN,
              description: 'True whenever Dr. Pisces recommends performing a zero-gravity light-based test.',
            },
          },
          required: ['reply', 'followUpQuestions', 'recommendedTestId', 'showTestCard'],
        },
      },
    });

    const rawText = (response.text ?? '').trim();
    const parsed = JSON.parse(rawText) as {
      reply: string;
      followUpQuestions: string[];
      recommendedTestId: string;
      showTestCard: boolean;
    };

    const validTest =
      ZERO_G_LIGHT_TESTS.find((t) => t.id === parsed.recommendedTestId) ??
      mlResult.recommendedTest;

    res.json({
      reply: parsed.reply,
      followUpQuestions: parsed.followUpQuestions?.slice(0, 3) ?? [],
      recommendedTestId: validTest.id,
      showTestCard: Boolean(parsed.showTestCard),
      suggestedTask: mlResult.suggestedTask,
      source: 'gemini-4-hydrogen',
    });
  } catch (err) {
    console.error('Gemini API error in /api/pisces/chat:', err);
    res.json({
      reply: `My orbital telemetry link hit a brief solar squall, but our local NASA LSAH model is still online! Based on your ${mlResult.criticalMetric.metricName} (${mlResult.criticalMetric.currentReading}), I recommend running the ${mlResult.recommendedTest.name} next. How are your eyes, sleep, and hydration feeling right now?`,
      followUpQuestions: [
        'Show me how to do the light scan in zero-G',
        'Check my most critical metric',
        'I feel fatigued today',
      ],
      recommendedTestId: mlResult.recommendedTest.id,
      showTestCard: true,
      suggestedTask: mlResult.suggestedTask,
      source: 'lsah-fallback',
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Pisces Orbital Health server running at http://localhost:${PORT}`);
  });
}

startServer();

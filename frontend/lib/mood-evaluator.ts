export type MoodKey = "calm" | "neutral" | "slightly-stressed" | "stressed" | "high-distress";

export interface MoodEvaluation {
  moodKey: MoodKey;
  moodLabel: string;
  faceType: MoodKey;
  explanation: string;
  tips: string[];
}

export const MOOD_THRESHOLDS: { max: number; moodKey: MoodKey; moodLabel: string }[] = [
  { max: 3, moodKey: "calm", moodLabel: "Calm & Grounded" },
  { max: 7, moodKey: "neutral", moodLabel: "Steady & Neutral" },
  { max: 10, moodKey: "slightly-stressed", moodLabel: "Slightly Stressed" },
  { max: 13, moodKey: "stressed", moodLabel: "Feeling Stressed" },
  { max: 16, moodKey: "high-distress", moodLabel: "High Distress" },
];

const MOOD_DETAILS: Record<MoodKey, { explanation: string; tips: string[] }> = {
  calm: {
    explanation: "You're showing signs of feeling balanced today. Keep nurturing those grounding routines.",
    tips: [
      "Take a moment to celebrate something that went well.",
      "Share your good energy with a friend or loved one.",
    ],
  },
  neutral: {
    explanation: "You're managing things fairly well. A small pause for yourself could make it even better.",
    tips: [
      "Drink water and stretch for a few minutes.",
      "Schedule a mini-activity you enjoy before the day ends.",
    ],
  },
  "slightly-stressed": {
    explanation: "You might be carrying some tension. A gentle reset can help you feel lighter.",
    tips: [
      "Take 5 deep breaths and write down one worry to revisit later.",
      "Listen to a short calming playlist or guided breathing.",
    ],
  },
  stressed: {
    explanation: "Things feel heavy right now. It's okay to slow down and ask for support.",
    tips: [
      "Reach out to someone you trust and share how you're feeling.",
      "Give yourself permission to take a short break from responsibilities.",
    ],
  },
  "high-distress": {
    explanation: "You're experiencing intense stress. Please prioritize your well-being and consider talking to a professional.",
    tips: [
      "Contact a trusted friend, mentor, or counselor as soon as you can.",
      "If things feel overwhelming, reach out to a local helpline or emergency service.",
    ],
  },
};

export const evaluateScore = (totalScore: number): MoodEvaluation => {
  const threshold = MOOD_THRESHOLDS.find((item) => totalScore <= item.max) ?? MOOD_THRESHOLDS[MOOD_THRESHOLDS.length - 1];
  const details = MOOD_DETAILS[threshold.moodKey];

  return {
    moodKey: threshold.moodKey,
    moodLabel: threshold.moodLabel,
    faceType: threshold.moodKey,
    explanation: details.explanation,
    tips: details.tips,
  };
};

export const MOOD_QUESTIONS = [
  {
    id: "calm",
    prompt: "In the last 24 hours, how often did you feel calm or relaxed?",
    options: [
      { label: "Most of the time", value: 0 },
      { label: "Some of the time", value: 1 },
      { label: "Rarely or not at all", value: 2 },
    ],
  },
  {
    id: "sleep",
    prompt: "How much trouble did you have falling asleep or staying asleep?",
    options: [
      { label: "Not at all", value: 0 },
      { label: "Some trouble", value: 1 },
      { label: "A lot / very restless", value: 2 },
    ],
  },
  {
    id: "worry",
    prompt: "How often did worry or anxious thoughts interrupt what you were doing?",
    options: [
      { label: "Almost never", value: 0 },
      { label: "Sometimes", value: 1 },
      { label: "Often or constantly", value: 2 },
    ],
  },
  {
    id: "motivation",
    prompt: "How motivated did you feel to do small tasks today?",
    options: [
      { label: "Very motivated", value: 0 },
      { label: "Somewhat motivated", value: 1 },
      { label: "Not motivated", value: 2 },
    ],
  },
  {
    id: "connection",
    prompt: "How connected did you feel to others today?",
    options: [
      { label: "Connected", value: 0 },
      { label: "Sometimes connected", value: 1 },
      { label: "Isolated", value: 2 },
    ],
  },
  {
    id: "joy",
    prompt: "How much were you able to enjoy small things or hobbies?",
    options: [
      { label: "A lot", value: 0 },
      { label: "A little", value: 1 },
      { label: "Not at all", value: 2 },
    ],
  },
  {
    id: "overwhelm",
    prompt: "How often did you feel overwhelmed by tasks or emotions?",
    options: [
      { label: "Rarely", value: 0 },
      { label: "Sometimes", value: 1 },
      { label: "Often", value: 2 },
    ],
  },
  {
    id: "energy",
    prompt: "Overall, how would you rate your energy level today?",
    options: [
      { label: "High", value: 0 },
      { label: "Okay", value: 1 },
      { label: "Very low", value: 2 },
    ],
  },
];

export const MAX_SCORE = MOOD_QUESTIONS.length * 2;

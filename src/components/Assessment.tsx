import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Heart, Moon, Zap, MessageCircle, Wind, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

// ───────────────────────────────────────────────
// Types
// ───────────────────────────────────────────────
interface Option {
  label: string;
  value: number;
  emoji?: string;
}

interface Question {
  id: string;
  question: string;
  subtitle?: string;
  type: "emoji-scale" | "options" | "tags";
  options: Option[];
  icon: React.ReactNode;
}

interface AssessmentResult {
  score: number;
  moodScore: number;
  sleepScore: number;
  anxietyScore: number;
  energyScore: number;
  needTag: string;
  timestamp: string;
}

// ───────────────────────────────────────────────
// Questions
// ───────────────────────────────────────────────
const questions: Question[] = [
  {
    id: "mood",
    question: "How would you describe your mood right now?",
    subtitle: "Pick the emoji that feels closest to how you feel.",
    type: "emoji-scale",
    icon: <Heart className="w-6 h-6" />,
    options: [
      { label: "Very Low", value: 1, emoji: "😔" },
      { label: "Low", value: 2, emoji: "😕" },
      { label: "Okay", value: 3, emoji: "😐" },
      { label: "Good", value: 4, emoji: "🙂" },
      { label: "Great", value: 5, emoji: "😊" },
    ],
  },
  {
    id: "sleep",
    question: "How has your sleep been lately?",
    subtitle: "Think about the past 2–3 nights.",
    type: "options",
    icon: <Moon className="w-6 h-6" />,
    options: [
      { label: "Good — I'm well rested", value: 3, emoji: "😴" },
      { label: "Okay — could be better", value: 2, emoji: "🛌" },
      { label: "Poor — trouble sleeping", value: 1, emoji: "😵" },
    ],
  },
  {
    id: "anxiety",
    question: "Are you feeling anxious or overthinking?",
    subtitle: "Be honest — this is just for you.",
    type: "options",
    icon: <Wind className="w-6 h-6" />,
    options: [
      { label: "Not at all", value: 3, emoji: "✅" },
      { label: "A little bit", value: 2, emoji: "🌊" },
      { label: "Yes, quite a lot", value: 1, emoji: "🌀" },
    ],
  },
  {
    id: "energy",
    question: "How is your energy level right now?",
    subtitle: "Physically and mentally.",
    type: "options",
    icon: <Zap className="w-6 h-6" />,
    options: [
      { label: "High — feeling active", value: 3, emoji: "⚡" },
      { label: "Medium — getting by", value: 2, emoji: "🔋" },
      { label: "Low — feeling drained", value: 1, emoji: "🪫" },
    ],
  },
  {
    id: "need",
    question: "What do you feel you need most right now?",
    subtitle: "There's no wrong answer.",
    type: "tags",
    icon: <Heart className="w-6 h-6" />,
    options: [
      { label: "Talk it out", value: 1, emoji: "💬" },
      { label: "Calm down", value: 2, emoji: "🧘" },
      { label: "Sleep better", value: 3, emoji: "🌙" },
      { label: "Just explore", value: 4, emoji: "🔍" },
    ],
  },
];

// ───────────────────────────────────────────────
// Scoring & Result Logic
// ───────────────────────────────────────────────
function getResult(answers: Record<string, number>) {
  const moodScore = answers["mood"] ?? 3;
  const sleepScore = answers["sleep"] ?? 2;
  const anxietyScore = answers["anxiety"] ?? 2;
  const energyScore = answers["energy"] ?? 2;
  const needValue = answers["need"] ?? 4;

  const total = moodScore + sleepScore + anxietyScore + energyScore; // max 14

  const needLabels: Record<number, string> = {
    1: "Talk it out",
    2: "Calm down",
    3: "Sleep better",
    4: "Just explore",
  };

  const needTag = needLabels[needValue] ?? "Just explore";

  const result: AssessmentResult = {
    score: total,
    moodScore,
    sleepScore,
    anxietyScore,
    energyScore,
    needTag,
    timestamp: new Date().toISOString(),
  };

  // Save to localStorage for personalization
  localStorage.setItem("hoper_assessment", JSON.stringify(result));

  return result;
}

function getResultCard(result: AssessmentResult) {
  const { score, needTag } = result;

  if (score >= 11) {
    return {
      label: "You seem to be doing well today",
      emoji: "🌟",
      message:
        "That's wonderful! Even on good days, it's beautiful to take a moment and check in with yourself. HOPEr is here whenever you need a supportive space.",
      color: "from-mint-green/60 to-blue-200/40",
      badge: "bg-mint-green text-charcoal-gray",
    };
  } else if (score >= 8) {
    return {
      label: "You seem a bit stressed today",
      emoji: "🌿",
      message:
        "It's okay — life gets heavy sometimes. A few mindful moments can help reset your nervous system. Let HOPEr guide you gently.",
      color: "from-lavender/60 to-blue-200/40",
      badge: "bg-lavender text-charcoal-gray",
    };
  } else if (score >= 5) {
    return {
      label: "You seem to be struggling a little",
      emoji: "🌙",
      message:
        "You're not alone in this. Whether it's rest, breathing space, or just someone to talk to — HOPEr is here with no judgment.",
      color: "from-soft-lavender/70 to-lavender/40",
      badge: "bg-secondary text-secondary-foreground",
    };
  } else {
    return {
      label: "You seem overwhelmed right now",
      emoji: "💙",
      message:
        "It takes courage to check in with yourself. Please know you're seen and valued. Let's take it one step at a time — HOPEr is right here with you.",
      color: "from-blue-200/50 to-lavender/50",
      badge: "bg-blue-100 text-blue-900",
    };
  }
}

function getPersonalizedChatMessage(result: AssessmentResult): string {
  const { score, needTag, sleepScore, anxietyScore } = result;

  if (score >= 11) {
    return "I can see you're doing well today! I'm here if you'd like to talk, explore something on your mind, or just have a mindful conversation.";
  } else if (score >= 8 && anxietyScore <= 2) {
    return "I understand you've been a bit anxious lately. Let's take it slow — I'm here to listen and support you. Would you like to share what's been on your mind?";
  } else if (sleepScore === 1) {
    return "I see sleep has been tough lately. That can really affect everything else. I'm here to help — would you like to talk about what might be keeping you up?";
  } else if (needTag === "Calm down") {
    return "I can see you need some calm right now. I'm here with you. Would you like to try a quick breathing exercise together, or would you prefer to talk about what's going on?";
  } else {
    return "I can see things feel heavy right now. You don't have to face this alone — I'm here, and I'm listening. Take your time and share whatever feels right.";
  }
}

// ───────────────────────────────────────────────
// Sub-components
// ───────────────────────────────────────────────
const ProgressBar = ({ current, total }: { current: number; total: number }) => (
  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
    <div
      className="h-full bg-gradient-to-r from-secondary to-primary rounded-full transition-all duration-500 ease-out"
      style={{ width: `${((current + 1) / total) * 100}%` }}
    />
  </div>
);

const EmojiScaleQuestion = ({
  question,
  selected,
  onSelect,
}: {
  question: Question;
  selected: number | null;
  onSelect: (val: number) => void;
}) => (
  <div className="flex flex-col items-center gap-4 w-full">
    <div className="flex gap-3 sm:gap-5 justify-center flex-wrap">
      {question.options.map((opt) => (
        <button
          key={opt.value}
          id={`assessment-mood-${opt.value}`}
          onClick={() => onSelect(opt.value)}
          className={`flex flex-col items-center gap-2 p-3 sm:p-4 rounded-2xl border-2 transition-all duration-200 hover:scale-105 active:scale-95 ${
            selected === opt.value
              ? "border-secondary bg-secondary/10 shadow-md scale-105"
              : "border-muted bg-white hover:border-secondary/50"
          }`}
          aria-pressed={selected === opt.value}
        >
          <span className="text-3xl sm:text-4xl">{opt.emoji}</span>
          <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">{opt.label}</span>
        </button>
      ))}
    </div>
  </div>
);

const OptionsQuestion = ({
  question,
  selected,
  onSelect,
}: {
  question: Question;
  selected: number | null;
  onSelect: (val: number) => void;
}) => (
  <div className="flex flex-col gap-3 w-full max-w-md mx-auto">
    {question.options.map((opt) => (
      <button
        key={opt.value}
        id={`assessment-opt-${question.id}-${opt.value}`}
        onClick={() => onSelect(opt.value)}
        className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
          selected === opt.value
            ? "border-secondary bg-secondary/10 shadow-md"
            : "border-muted bg-white hover:border-secondary/40"
        }`}
        aria-pressed={selected === opt.value}
      >
        <span className="text-2xl">{opt.emoji}</span>
        <span className="font-medium text-charcoal-gray">{opt.label}</span>
        {selected === opt.value && (
          <span className="ml-auto w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
            <span className="text-white text-xs">✓</span>
          </span>
        )}
      </button>
    ))}
  </div>
);

const TagsQuestion = ({
  question,
  selected,
  onSelect,
}: {
  question: Question;
  selected: number | null;
  onSelect: (val: number) => void;
}) => (
  <div className="flex flex-wrap gap-3 justify-center max-w-md mx-auto">
    {question.options.map((opt) => (
      <button
        key={opt.value}
        id={`assessment-tag-${opt.value}`}
        onClick={() => onSelect(opt.value)}
        className={`flex items-center gap-2.5 px-5 py-3.5 rounded-full border-2 text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-95 ${
          selected === opt.value
            ? "border-secondary bg-secondary text-secondary-foreground shadow-lg"
            : "border-muted bg-white text-charcoal-gray hover:border-secondary/50"
        }`}
        aria-pressed={selected === opt.value}
      >
        <span className="text-lg">{opt.emoji}</span>
        {opt.label}
      </button>
    ))}
  </div>
);

// ───────────────────────────────────────────────
// Result Screen
// ───────────────────────────────────────────────
const ResultScreen = ({ result }: { result: AssessmentResult }) => {
  const navigate = useNavigate();
  const card = getResultCard(result);
  const chatMessage = getPersonalizedChatMessage(result);

  const getPrimaryAction = () => {
    const { needTag } = result;
    if (needTag === "Sleep better") {
      return { label: "Sleep Wellness Mode", path: "/sleep", emoji: "🌙" };
    } else if (needTag === "Calm down") {
      return { label: "Mindfulness Mode", path: "/mindfulness", emoji: "🧘" };
    } else {
      return { label: "Talk to HOPEr", path: "/chat", emoji: "💬", message: chatMessage };
    }
  };

  const primary = getPrimaryAction();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-lavender/40 to-background px-4 py-10">
      <div className="w-full max-w-lg mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Result Card */}
        <div className={`rounded-3xl bg-gradient-to-br ${card.color} border border-white/60 shadow-xl p-8 text-center space-y-4`}>
          <div className="text-5xl mb-2">{card.emoji}</div>
          <h2 className="text-xl sm:text-2xl font-bold text-charcoal-gray font-lustria">{card.label}</h2>
          <p className="text-sm sm:text-base text-charcoal-gray/80 leading-relaxed">{card.message}</p>

          {/* Scores */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            {[
              { label: "Mood", val: result.moodScore, max: 5 },
              { label: "Sleep", val: result.sleepScore, max: 3 },
              { label: "Calm", val: result.anxietyScore, max: 3 },
              { label: "Energy", val: result.energyScore, max: 3 },
            ].map((s) => (
              <div key={s.label} className="bg-white/60 rounded-xl p-3">
                <div className="text-xs text-muted-foreground mb-1">{s.label}</div>
                <div className="flex gap-1">
                  {Array.from({ length: s.max }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-all ${
                        i < s.val ? "bg-secondary" : "bg-muted"
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Primary action */}
          <Button
            id="assessment-primary-action"
            className="w-full h-14 text-base bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold rounded-2xl shadow-lg active:scale-[0.98] transition-all"
            onClick={() => {
              if (primary.message) {
                navigate(primary.path, { state: { initialMessage: primary.message } });
              } else {
                navigate(primary.path);
              }
            }}
          >
            <span className="mr-2 text-xl">{primary.emoji}</span>
            {primary.label}
          </Button>

          {/* Talk to HOPEr (if not primary) */}
          {primary.path !== "/chat" && (
            <Button
              id="assessment-chat-action"
              variant="outline"
              className="w-full h-12 text-sm border-2 border-secondary/40 text-secondary hover:bg-secondary/10 rounded-2xl active:scale-[0.98] transition-all font-semibold"
              onClick={() =>
                navigate("/chat", { state: { initialMessage: chatMessage } })
              }
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Talk to HOPEr
            </Button>
          )}

          {/* Go home */}
          <Button
            id="assessment-home-action"
            variant="ghost"
            className="w-full h-10 text-sm text-muted-foreground hover:text-foreground rounded-2xl active:scale-[0.98] transition-all"
            onClick={() => navigate("/")}
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

// ───────────────────────────────────────────────
// Main Assessment Component
// ───────────────────────────────────────────────
const Assessment = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [animating, setAnimating] = useState(false);

  const currentQuestion = questions[currentIndex];
  const selectedValue = answers[currentQuestion?.id] ?? null;
  const isLast = currentIndex === questions.length - 1;

  const handleSelect = (val: number) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: val }));
  };

  const handleNext = () => {
    if (selectedValue === null) return;
    if (isLast) {
      const r = getResult(answers);
      setResult(r);
      return;
    }
    setAnimating(true);
    setTimeout(() => {
      setCurrentIndex((i) => i + 1);
      setAnimating(false);
    }, 200);
  };

  const handleBack = () => {
    if (currentIndex === 0) {
      navigate("/");
      return;
    }
    setAnimating(true);
    setTimeout(() => {
      setCurrentIndex((i) => i - 1);
      setAnimating(false);
    }, 200);
  };

  if (result) return <ResultScreen result={result} />;

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-lavender/30 to-background flex flex-col">
      {/* Header */}
      <div className="bg-secondary px-4 sm:px-6 py-4 flex items-center justify-between border-b-2 border-deep-purple shrink-0">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-secondary-foreground hover:text-primary transition-colors active:scale-95"
          id="assessment-back-btn"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline text-sm font-medium">
            {currentIndex === 0 ? "Back to Home" : "Previous"}
          </span>
        </button>

        <div className="flex items-center gap-2">
          <img src="/favicon-icon.svg" alt="HOPEr" className="h-7 w-7" />
          <span className="text-secondary-foreground font-bold text-base">HOPEr Check-In</span>
        </div>

        <span className="text-secondary-foreground/70 text-sm font-medium">
          {currentIndex + 1} / {questions.length}
        </span>
      </div>

      {/* Progress */}
      <div className="px-4 sm:px-8 py-3 shrink-0">
        <ProgressBar current={currentIndex} total={questions.length} />
      </div>

      {/* Question */}
      <div
        className={`flex-1 flex flex-col items-center justify-center px-4 sm:px-8 py-6 transition-all duration-200 ${
          animating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
        }`}
      >
        <div className="w-full max-w-xl mx-auto space-y-8">
          {/* Icon + Question */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary/20 text-secondary mx-auto">
              {currentQuestion.icon}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-charcoal-gray font-lustria px-2">
              {currentQuestion.question}
            </h2>
            {currentQuestion.subtitle && (
              <p className="text-sm text-muted-foreground">{currentQuestion.subtitle}</p>
            )}
          </div>

          {/* Answer Options */}
          {currentQuestion.type === "emoji-scale" && (
            <EmojiScaleQuestion
              question={currentQuestion}
              selected={selectedValue}
              onSelect={handleSelect}
            />
          )}
          {currentQuestion.type === "options" && (
            <OptionsQuestion
              question={currentQuestion}
              selected={selectedValue}
              onSelect={handleSelect}
            />
          )}
          {currentQuestion.type === "tags" && (
            <TagsQuestion
              question={currentQuestion}
              selected={selectedValue}
              onSelect={handleSelect}
            />
          )}
        </div>
      </div>

      {/* Footer / Next Button */}
      <div className="shrink-0 px-4 sm:px-8 py-5 border-t border-border bg-white/60 backdrop-blur-sm">
        <div className="max-w-xl mx-auto">
          <Button
            id="assessment-next-btn"
            onClick={handleNext}
            disabled={selectedValue === null}
            className="w-full h-13 py-3.5 text-base font-semibold rounded-xl bg-secondary hover:bg-secondary/90 text-secondary-foreground disabled:opacity-40 transition-all active:scale-[0.98]"
          >
            {isLast ? "See My Results" : "Continue"}
            {!isLast && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Assessment;

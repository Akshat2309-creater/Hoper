import { useEffect, useMemo, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { evaluateScore, MAX_SCORE, MOOD_QUESTIONS, MoodKey, MoodEvaluation } from "@/lib/mood-evaluator";
import { useNavigate } from "react-router-dom";

const STORAGE_KEY = "hoper-mood-quiz-progress";

type AnswerValue = 0 | 1 | 2 | null;

interface StoredState {
  currentIndex: number;
  answers: AnswerValue[];
}

const useQuizState = (questionCount: number) => {
  const createDefaultAnswers = () => Array.from({ length: questionCount }, () => null as AnswerValue);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerValue[]>(createDefaultAnswers);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed: StoredState = JSON.parse(saved);
        if (Array.isArray(parsed.answers) && typeof parsed.currentIndex === "number") {
          setAnswers(parsed.answers.slice(0, questionCount));
          setCurrentIndex(Math.min(parsed.currentIndex, questionCount - 1));
        }
      } catch (error) {
        console.warn("Failed to parse stored quiz state", error);
      }
    }
  }, [questionCount]);

  const persist = (nextAnswers: AnswerValue[], nextIndex: number) => {
    const nextState: StoredState = { answers: nextAnswers, currentIndex: nextIndex };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
  };

  const updateAnswer = (index: number, value: 0 | 1 | 2) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = value;
      persist(next, currentIndex);
      return next;
    });
  };

  const goTo = (nextIndex: number) => {
    setCurrentIndex(nextIndex);
    persist(answers, nextIndex);
  };

  const reset = () => {
    const defaults = createDefaultAnswers();
    setAnswers(defaults);
    setCurrentIndex(0);
    localStorage.removeItem(STORAGE_KEY);
  };

  return { currentIndex, answers, updateAnswer, goTo, reset };
};

interface QuestionCardProps {
  questionIndex: number;
  prompt: string;
  options: { label: string; value: 0 | 1 | 2 }[];
  selected: AnswerValue;
  onSelect: (value: 0 | 1 | 2) => void;
}

const QuestionCard = ({ questionIndex, prompt, options, selected, onSelect }: QuestionCardProps) => (
  <div className="space-y-6" aria-live="polite">
    <div>
      <p className="text-sm uppercase tracking-wide text-deep-purple/80 font-semibold mb-2">Question {questionIndex + 1}</p>
      <h2 className="text-2xl sm:text-3xl font-bold text-charcoal-gray leading-snug">{prompt}</h2>
    </div>

    <div role="radiogroup" aria-label={prompt} className="space-y-3">
      {options.map((option, idx) => {
        const optionId = `mood-option-${questionIndex}-${idx}`;
        const isSelected = selected === option.value;
        return (
          <label
            key={option.value}
            htmlFor={optionId}
            className={`flex items-center gap-3 rounded-xl border-2 p-4 transition-all cursor-pointer focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-deep-purple ${
              isSelected ? "border-deep-purple bg-soft-lavender/50" : "border-transparent bg-white hover:border-deep-purple/40"
            }`}
          >
            <input
              id={optionId}
              type="radio"
              name={`question-${questionIndex}`}
              value={option.value}
              checked={isSelected}
              onChange={() => onSelect(option.value)}
              className="h-4 w-4 border-charcoal-gray text-deep-purple focus:ring-deep-purple"
              aria-checked={isSelected}
            />
            <span className="text-base text-charcoal-gray">{option.label}</span>
          </label>
        );
      })}
    </div>
  </div>
);

interface ProgressBarProps {
  current: number;
  total: number;
}

const ProgressBar = ({ current, total }: ProgressBarProps) => {
  const percentage = Math.round(((current + 1) / total) * 100);

  return (
    <div className="space-y-2" aria-label="Quiz progress">
      <div className="flex items-center justify-between text-sm text-charcoal-gray/80">
        <span>
          {current + 1} / {total}
        </span>
        <span>{percentage}%</span>
      </div>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percentage}
        className="h-2 w-full rounded-full bg-off-white"
      >
        <div
          className="h-2 rounded-full bg-deep-purple transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

interface ResultFaceProps {
  faceType: MoodKey;
}

const ResultFace = ({ faceType }: ResultFaceProps) => {
  const faceConfig: Record<MoodKey, { color: string; mouth: string; eyeOffset: number }> = {
    calm: { color: "#BCEAD5", mouth: "M20 28 Q24 32 28 28", eyeOffset: 0 },
    neutral: { color: "#A8D8EA", mouth: "M20 28 L28 28", eyeOffset: 0 },
    "slightly-stressed": { color: "#F4B731", mouth: "M18 29 Q24 24 30 29", eyeOffset: 0.5 },
    stressed: { color: "#F6A5A5", mouth: "M18 30 Q24 22 30 30", eyeOffset: 1 },
    "high-distress": { color: "#F17070", mouth: "M18 32 Q24 20 30 32", eyeOffset: 1.5 },
  };

  const { color, mouth, eyeOffset } = faceConfig[faceType];

  return (
    <svg
      width="160"
      height="160"
      viewBox="0 0 48 48"
      role="img"
      aria-label={`Mood face showing ${faceType.replace("-", " ")}`}
      className="mx-auto drop-shadow-lg transition-transform duration-500 ease-out animate-[pulse_3s_ease-in-out_infinite]"
    >
      <circle cx="24" cy="24" r="20" fill={color} />
      <circle cx={18} cy={20 - eyeOffset} r="2.3" fill="#333" className="animate-[blink_4s_linear_infinite]" />
      <circle cx={30} cy={20 - eyeOffset} r="2.3" fill="#333" className="animate-[blink_4s_linear_infinite]" />
      <path d={mouth} stroke="#333" strokeWidth="2" strokeLinecap="round" fill="transparent" className="animate-[breath_5s_ease-in-out_infinite]" />
    </svg>
  );
};

const animationStyles = `
@keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.02); } }
@keyframes blink { 0%, 92%, 100% { transform: scaleY(1); } 96% { transform: scaleY(0.2); } }
@keyframes breath { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-1px); } }
`;

const ResultView = ({
  result,
  onRetake,
  onSave,
  saving,
  onOpenChat,
}: {
  result: MoodEvaluation;
  onRetake: () => void;
  onSave: () => Promise<void>;
  saving: boolean;
  onOpenChat: () => void;
}) => (
  <div className="space-y-8" aria-live="polite">
    <style>{animationStyles}</style>
    <div className="text-center space-y-4">
      <ResultFace faceType={result.faceType} />
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-wide text-deep-purple/80 font-semibold">Your mood snapshot</p>
        <h2 className="text-3xl sm:text-4xl font-bold text-charcoal-gray">{result.moodLabel}</h2>
        <p className="text-charcoal-gray/90 max-w-2xl mx-auto">{result.explanation}</p>
      </div>
    </div>

    <div className="bg-white/90 border-2 border-deep-purple/20 rounded-2xl p-6 space-y-4">
      <h3 className="text-xl font-semibold text-charcoal-gray">Gentle support tips</h3>
      <ul className="list-disc list-inside space-y-2 text-charcoal-gray/90">
        {result.tips.map((tip) => (
          <li key={tip}>{tip}</li>
        ))}
      </ul>
      {result.moodKey === "high-distress" && (
        <p className="text-sm text-deep-purple font-medium">
          If this feels severe, please consider reaching out to a trusted person or professional helpline for immediate support.
        </p>
      )}
    </div>

    <div className="bg-soft-lavender/40 border border-deep-purple/20 rounded-2xl p-6 space-y-3">
      <h3 className="text-lg font-semibold text-deep-purple flex items-center gap-2">
        Looking for a caring conversation?
      </h3>
      <p className="text-charcoal-gray/90">
        Our supportive chatbot is always available to listen, reflect, and share calming prompts tailored to how you're feeling. You can chat anonymously and step away whenever you need.
      </p>
      <Button
        onClick={onOpenChat}
        className="inline-flex items-center gap-2 bg-deep-purple hover:bg-deep-purple/90"
      >
        Talk to HOPEr now
        <span aria-hidden="true">💬</span>
      </Button>
      <p className="text-xs text-charcoal-gray/70">
        HOPEr isn’t a substitute for professional care, but it can help you process emotions and discover next steps. If you’re in crisis, please reach out to a trusted person or local helpline right away.
      </p>
    </div>

    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
      <Button onClick={onRetake} variant="outline" className="min-w-[160px]">
        Retake quiz
      </Button>
      <Button onClick={onSave} disabled={saving} className="min-w-[160px]">
        {saving ? "Saving..." : "Save result"}
      </Button>
    </div>
  </div>
);

const MoodQuiz = () => {
  const { currentIndex, answers, updateAnswer, goTo, reset } = useQuizState(MOOD_QUESTIONS.length);
  const [showResult, setShowResult] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const currentQuestion = MOOD_QUESTIONS[currentIndex];
  const allAnswered = answers.every((answer) => answer !== null);

  const totalScore = useMemo(() => {
    return answers.reduce((total, value) => (value !== null ? total + value : total), 0);
  }, [answers]);

  const result = useMemo(() => evaluateScore(totalScore), [totalScore]);

  const handleNext = () => {
    if (currentIndex < MOOD_QUESTIONS.length - 1) {
      goTo(currentIndex + 1);
    } else if (allAnswered) {
      setShowResult(true);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      goTo(currentIndex - 1);
    }
  };

  const handleRetake = () => {
    reset();
    setShowResult(false);
    setIsSaving(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/mood/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });

      if (!response.ok) {
        throw new Error("Failed to save result");
      }

      toast({
        title: "Mood result saved",
        description: "Thanks for checking in with yourself today.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Unable to save",
        description: "Please try again or reach out if the issue continues.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-soft-lavender/40 to-off-white" aria-labelledby="mood-quiz-heading">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="bg-white/90 backdrop-blur rounded-3xl border-2 border-deep-purple/20 shadow-xl p-6 sm:p-10">
          <header className="space-y-3 mb-8 text-center">
            <p className="text-sm uppercase tracking-wide text-deep-purple/80 font-semibold">Know Your Mood</p>
            <h1 id="mood-quiz-heading" className="text-3xl sm:text-4xl font-bold text-charcoal-gray">
              Take a quick, supportive mood check-in
            </h1>
            <p className="text-charcoal-gray/80 max-w-2xl mx-auto">
              Answer a few gentle questions to see where your mood is today. This is a supportive indicator, not a diagnosis.
            </p>
          </header>

          {!showResult ? (
            <div className="space-y-8">
              <ProgressBar current={currentIndex} total={MOOD_QUESTIONS.length} />
              <QuestionCard
                questionIndex={currentIndex}
                prompt={currentQuestion.prompt}
                options={currentQuestion.options}
                selected={answers[currentIndex]}
                onSelect={(value) => updateAnswer(currentIndex, value)}
              />

              <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4">
                <Button onClick={handleBack} variant="outline" disabled={currentIndex === 0} className="min-w-[120px]">
                  Back
                </Button>
                <div className="flex-1" />
                <Button
                  onClick={handleNext}
                  disabled={answers[currentIndex] === null}
                  className="min-w-[160px]"
                >
                  {currentIndex === MOOD_QUESTIONS.length - 1 ? "See results" : "Next"}
                </Button>
              </div>
            </div>
          ) : (
            <ResultView
              result={result}
              onRetake={handleRetake}
              onSave={handleSave}
              saving={isSaving}
              onOpenChat={() => navigate("/chat")}
            />
          )}

          {!showResult && (
            <p className="mt-8 text-xs text-charcoal-gray/70 text-center">
              Responses are stored locally until you finish. Scores range from 0 to {MAX_SCORE}. Higher scores indicate more stress signals.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default MoodQuiz;

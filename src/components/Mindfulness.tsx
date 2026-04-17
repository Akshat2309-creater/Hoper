import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Wind,
  Brain,
  Heart,
  Moon,
  ChevronRight,
  Home,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type Mode = "breathing" | "grounding" | "reflection";

const Mindfulness = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [selectedMode, setSelectedMode] = useState<Mode | null>(null);
  const [sessionStep, setSessionStep] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(false);

  const modes = [
    {
      id: "breathing",
      title: t("mind.m1.title") || "Breathing Exercise",
      description: t("mind.m1.desc") || "Calm your nervous system with guided breathwork.",
      icon: <Wind className="w-8 h-8" />,
      color: "from-blue-200 to-cyan-100",
      steps: [
        t("mind.m1.s1") || "Inhale slowly through your nose",
        t("mind.m1.s2") || "Hold your breath",
        t("mind.m1.s3") || "Exhale slowly through your mouth",
      ],
    },
    {
      id: "grounding",
      title: t("mind.m2.title") || "Grounding (5-4-3-2-1)",
      description: t("mind.m2.desc") || "Connect with your senses to reduce anxiety.",
      icon: <Brain className="w-8 h-8" />,
      color: "from-green-200 to-emerald-100",
      steps: [
        t("mind.m2.s1") || "5 things you can see",
        t("mind.m2.s2") || "4 things you can touch",
        t("mind.m2.s3") || "3 things you can hear",
        t("mind.m2.s4") || "2 things you can smell",
        t("mind.m2.s5") || "1 thing you can taste",
      ],
    },
    {
      id: "reflection",
      title: t("mind.m3.title") || "Guided Reflection",
      description: t("mind.m3.desc") || "Short journaling prompts to process thoughts.",
      icon: <Heart className="w-8 h-8" />,
      color: "from-purple-200 to-pink-100",
      steps: [
        t("mind.m3.s1") || "What's one thing you're grateful for today?",
        t("mind.m3.s2") || "What's a small win you had recently?",
        t("mind.m3.s3") || "What would you like to let go of?",
      ],
    },
  ];

  const startSession = (mode: Mode) => {
    setSelectedMode(mode);
    setIsSessionActive(true);
    setSessionStep(0);
  };

  const handleNext = () => {
    const currentMode = modes.find((m) => m.id === selectedMode);
    if (currentMode && sessionStep < currentMode.steps.length - 1) {
      setSessionStep(sessionStep + 1);
    } else {
      // Session completed
      setIsSessionActive(false);
      setSelectedMode(null);
    }
  };

  const handleReset = () => {
    setIsSessionActive(false);
    setSelectedMode(null);
    setSessionStep(0);
  };

  if (isSessionActive && selectedMode) {
    const mode = modes.find((m) => m.id === selectedMode);
    if (!mode) return null;
    return (
      <div className="min-h-screen bg-gradient-to-b from-lavender/30 to-background flex flex-col items-center py-12 sm:py-24 px-4 overflow-x-hidden">
        <div className="w-full max-w-5xl mx-auto text-center space-y-12 sm:space-y-16">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              {t("mind.end") || "End Session"}
            </button>
            <div className="text-sm font-medium">
              {t("common.step") || "Step"} {sessionStep + 1} {t("common.of") || "of"} {mode.steps.length}
            </div>
          </div>

          <div
            className={`rounded-3xl bg-gradient-to-br ${mode.color} border border-white/60 shadow-2xl p-8`}
          >
            <div className="text-6xl mb-6">{mode.icon}</div>
            <h2 className="text-xl sm:text-2xl font-bold text-charcoal-gray mb-3 sm:mb-4">
              {mode.title}
            </h2>
            <p className="text-lg text-charcoal-gray/80 mb-8">
              {mode.steps[sessionStep]}
            </p>
            {selectedMode === "breathing" && (
              <div className="my-6 sm:my-10">
                <div className="w-32 h-32 sm:w-48 sm:h-48 mx-auto rounded-full border-8 border-white/50 animate-pulse bg-gradient-to-r from-blue-300 to-cyan-300"></div>
                <p className="mt-4 sm:mt-6 text-lg sm:text-xl font-semibold text-charcoal-gray">
                  {t("mind.breathingLoop") || "Inhale... Hold... Exhale..."}
                </p>
              </div>
            )}
            <Progress
              value={(sessionStep + 1) * (100 / mode.steps.length)}
              className="h-2 mb-6"
            />
            <Button
              onClick={handleNext}
              className="w-full max-w-xs mx-auto h-12 text-base font-semibold rounded-xl bg-secondary hover:bg-secondary/90"
            >
              {sessionStep === mode.steps.length - 1
                ? (t("mind.btnFinish") || "Finish Session")
                : (t("mind.btnNext") || "Next Step")}
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </div>

          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mt-4"
          >
            <Home className="w-4 h-4 mr-2" />
            {t("common.backHome") || "Back to Home"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-lavender/20 to-background px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-charcoal-gray font-lustria mb-3">
            {t("mind.title") || "Mindfulness & Grounding"}
          </h1>
          <p className="text-muted-foreground text-lg">
            {t("mind.subtitle") || "Choose a practice to center yourself. No pressure, no rush."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {modes.map((mode) => (
            <Card
              key={mode.id}
              className={`border-2 hover:border-secondary/50 cursor-pointer transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br ${mode.color}/30`}
              onClick={() => startSession(mode.id as Mode)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-full bg-white/50">
                    {mode.icon}
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
                <CardTitle className="mt-4 text-xl">{mode.title}</CardTitle>
                <CardDescription>{mode.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-charcoal-gray/70 space-y-1">
                  {mode.steps.slice(0, 3).map((step, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="mr-2">•</span>
                      {step}
                    </li>
                  ))}
                  {mode.steps.length > 3 && (
                    <li className="text-muted-foreground">{t("common.more") || "... and more"}</li>
                  )}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => navigate("/assessment")}
            className="mr-4"
          >
            {t("mind.btnAssess") || "Take a quick assessment first"}
          </Button>
          <Button variant="ghost" onClick={() => navigate("/")}>
            <Home className="w-4 h-4 mr-2" />
            {t("common.backHome") || "Back to Home"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Mindfulness;

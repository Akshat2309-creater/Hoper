import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Wind,
  Brain,
  Heart,
  ChevronRight,
  Home,
  RotateCcw,
  Moon,
  Cloud,
  Zap,
  Anchor,
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
import {
  GuidedBreathing,
  BREATHING_PATTERN_CONFIG,
  isBreathingPatternId,
  type BreathingPatternId,
} from "@/components/GuidedBreathing";
import { setWellnessContext } from "@/lib/wellnessContext";

type Mode = "breathing" | "grounding" | "reflection";

const MODE_CARD_ACCENT: Record<Mode, string> = {
  breathing: "border-t-[3px] border-t-sky-500 dark:border-t-sky-400",
  grounding: "border-t-[3px] border-t-emerald-600 dark:border-t-emerald-400",
  reflection: "border-t-[3px] border-t-secondary dark:border-t-primary",
};

const BREATHING_GOALS: {
  pattern: BreathingPatternId;
  goalKey: "calm" | "sleep" | "quick" | "deep";
  icon: ReactNode;
}[] = [
  {
    pattern: "calm-446",
    goalKey: "calm",
    icon: <Cloud className="h-7 w-7" />,
  },
  {
    pattern: "relax-478",
    goalKey: "sleep",
    icon: <Moon className="h-7 w-7" />,
  },
  {
    pattern: "quick-426",
    goalKey: "quick",
    icon: <Zap className="h-7 w-7" />,
  },
  {
    pattern: "deep-555",
    goalKey: "deep",
    icon: <Anchor className="h-7 w-7" />,
  },
];

const Mindfulness = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useLanguage();
  const [selectedMode, setSelectedMode] = useState<Mode | null>(null);
  const [sessionStep, setSessionStep] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [breathingComplete, setBreathingComplete] = useState(false);
  const [selectedBreathPattern, setSelectedBreathPattern] =
    useState<BreathingPatternId | null>(null);
  const urlStarted = useRef(false);

  const modes = [
    {
      id: "breathing" as const,
      title: t("mind.m1.title") || "Breathing Exercise",
      description: t("mind.m1.desc") || "Calm your nervous system with guided breathwork.",
      icon: <Wind className="w-8 h-8" />,
      steps: [
        t("mind.m1.s1") || "Inhale slowly through your nose",
        t("mind.m1.s2") || "Hold your breath",
        t("mind.m1.s3") || "Exhale slowly through your mouth",
      ],
    },
    {
      id: "grounding" as const,
      title: t("mind.m2.title") || "Grounding (5-4-3-2-1)",
      description: t("mind.m2.desc") || "Connect with your senses to reduce anxiety.",
      icon: <Brain className="w-8 h-8" />,
      steps: [
        t("mind.m2.s1") || "5 things you can see",
        t("mind.m2.s2") || "4 things you can touch",
        t("mind.m2.s3") || "3 things you can hear",
        t("mind.m2.s4") || "2 things you can smell",
        t("mind.m2.s5") || "1 thing you can taste",
      ],
    },
    {
      id: "reflection" as const,
      title: t("mind.m3.title") || "Guided Reflection",
      description: t("mind.m3.desc") || "Short journaling prompts to process thoughts.",
      icon: <Heart className="w-8 h-8" />,
      steps: [
        t("mind.m3.s1") || "What's one thing you're grateful for today?",
        t("mind.m3.s2") || "What's a small win you had recently?",
        t("mind.m3.s3") || "What would you like to let go of?",
      ],
    },
  ];

  const cycleLabel = useCallback(
    (n: number, total: number) => {
      const fmt = t("mind.breath.cycleFmt");
      if (fmt.includes("{0}"))
        return fmt.replace("{0}", String(n)).replace("{1}", String(total));
      return `Cycle ${n} / ${total}`;
    },
    [t]
  );

  const breathLabels = {
    inhale: t("mind.breath.inhale"),
    hold: t("mind.breath.hold"),
    exhale: t("mind.breath.exhale"),
    cycle: cycleLabel,
    done: t("mind.breath.doneCta"),
    skip: t("mind.breath.skip"),
    reducedHint: t("mind.breath.reducedHint"),
    inhaleHint: t("mind.breath.hint.inhale"),
    holdHint: t("mind.breath.hint.hold"),
    exhaleHint: t("mind.breath.hint.exhale"),
    shoutInhale: t("mind.breath.shout.inhale"),
    shoutHold: t("mind.breath.shout.hold"),
    shoutExhale: t("mind.breath.shout.exhale"),
    statInhale: t("mind.breath.stat.inhale"),
    statHold: t("mind.breath.stat.hold"),
    statExhale: t("mind.breath.stat.exhale"),
    statsCalmLabel: t("mind.breath.stats.calm"),
    statsBreathsLabel: t("mind.breath.stats.breaths"),
    statsTodayLabel: t("mind.breath.stats.today"),
    statsLifetimeLabel: t("mind.breath.stats.lifetime"),
    statsDisclaimer: t("mind.breath.stats.disclaimer"),
    mascotAlt: t("mind.breath.mascotAlt"),
  };

  const startSession = (mode: Mode) => {
    setSelectedMode(mode);
    setIsSessionActive(true);
    setSessionStep(0);
    setBreathingComplete(false);
    if (mode === "breathing") setSelectedBreathPattern(null);
  };

  useEffect(() => {
    if (urlStarted.current) return;
    const m = searchParams.get("mode");
    const patternParam = searchParams.get("pattern");
    if (m === "breathing" || m === "grounding" || m === "reflection") {
      urlStarted.current = true;
      setSelectedMode(m);
      setSessionStep(0);
      setBreathingComplete(false);
      setIsSessionActive(true);
      if (m === "breathing" && isBreathingPatternId(patternParam)) {
        setSelectedBreathPattern(patternParam);
      } else if (m === "breathing") {
        setSelectedBreathPattern(null);
      }
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const handleNext = () => {
    const currentMode = modes.find((m) => m.id === selectedMode);
    if (currentMode && sessionStep < currentMode.steps.length - 1) {
      setSessionStep(sessionStep + 1);
    } else {
      setIsSessionActive(false);
      setSelectedMode(null);
      setBreathingComplete(false);
      setSelectedBreathPattern(null);
    }
  };

  const handleReset = () => {
    setIsSessionActive(false);
    setSelectedMode(null);
    setSessionStep(0);
    setBreathingComplete(false);
    setSelectedBreathPattern(null);
  };

  if (isSessionActive && selectedMode === "breathing") {
    if (!breathingComplete) {
      if (!selectedBreathPattern) {
        return (
          <div className="min-h-screen bg-gradient-to-b from-lavender/30 to-background px-4 py-10 sm:py-16">
            <div className="mx-auto max-w-4xl">
              <div className="mb-8 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <RotateCcw className="h-4 w-4" />
                  {t("mind.end") || "End Session"}
                </button>
              </div>
              <div className="mb-10 text-center">
                <h2 className="font-lustria text-2xl font-bold text-foreground sm:text-3xl">
                  {t("mind.breath.pickTitle")}
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
                  {t("mind.breath.pickSubtitle")}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {BREATHING_GOALS.map(({ pattern, goalKey, icon }) => (
                  <Card
                    key={pattern}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedBreathPattern(pattern);
                      }
                    }}
                    className="cursor-pointer border-2 border-border bg-card text-card-foreground shadow-sm transition-all hover:border-primary/50 hover:shadow-md dark:border-border dark:bg-card dark:hover:border-primary/60 dark:hover:bg-muted/20"
                    onClick={() => setSelectedBreathPattern(pattern)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="rounded-full bg-muted p-3 text-secondary shadow-sm ring-1 ring-border/70 dark:bg-secondary/35 dark:text-secondary-foreground dark:ring-border">
                            {icon}
                          </div>
                          <div>
                            <CardTitle className="text-lg text-foreground">
                              {t(`mind.breath.goal.${goalKey}.title`)}
                            </CardTitle>
                            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                              {t(`mind.breath.goal.${goalKey}.rhythm`)}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                      </div>
                      <CardDescription className="pt-2 text-left text-sm leading-relaxed text-muted-foreground">
                        {t(`mind.breath.goal.${goalKey}.desc`)}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );
      }

      const cfg = BREATHING_PATTERN_CONFIG[selectedBreathPattern];
      const goalMeta = BREATHING_GOALS.find((g) => g.pattern === selectedBreathPattern);
      const rhythmLabel = goalMeta
        ? t(`mind.breath.goal.${goalMeta.goalKey}.rhythm`)
        : undefined;

      return (
        <div className="min-h-screen bg-gradient-to-b from-lavender/30 to-background px-4 py-10 sm:px-6 sm:py-16 lg:px-10">
          <div className="mx-auto flex w-full max-w-6xl flex-col">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
              >
                <RotateCcw className="h-4 w-4" />
                {t("mind.end") || "End Session"}
              </button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-foreground hover:bg-muted dark:text-primary dark:hover:bg-muted/80"
                onClick={() => {
                  setSelectedBreathPattern(null);
                }}
              >
                {t("mind.breath.changeExercise")}
              </Button>
            </div>
            <h2 className="mb-1 text-center font-lustria text-2xl font-bold text-foreground sm:text-3xl lg:text-left">
              {t("mind.m1.title")}
            </h2>
            <p className="mb-8 text-center text-sm text-muted-foreground lg:mb-10 lg:max-w-2xl lg:text-left sm:text-base">
              {t("mind.m1.desc")}
            </p>
            <GuidedBreathing
              key={selectedBreathPattern}
              pattern={selectedBreathPattern}
              cycles={cfg.defaultCycles}
              labels={breathLabels}
              tone="sky"
              rhythmLabel={rhythmLabel}
              onComplete={() => setBreathingComplete(true)}
              onExit={handleReset}
            />
          </div>
        </div>
      );
    }

    return (
      <div className="flex min-h-screen flex-col items-center bg-gradient-to-b from-lavender/30 to-background px-4 py-16 dark:from-lavender/15">
        <div className="max-w-md rounded-3xl border border-border bg-card p-8 text-center text-card-foreground shadow-xl dark:border-border dark:bg-card dark:shadow-black/30">
          <div className="mb-4 text-5xl" aria-hidden>
            <Wind className="mx-auto h-14 w-14 text-primary" />
          </div>
          <h2 className="font-lustria text-xl font-bold text-foreground sm:text-2xl">
            {t("mind.breath.completeTitle")}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t("mind.breath.completeBody")}
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <Button
              className="w-full rounded-xl bg-secondary text-secondary-foreground"
              onClick={handleReset}
            >
              {t("mind.breath.doneCta")}
            </Button>
            <Button
              variant="outline"
              className="w-full rounded-xl border-2 border-border bg-background/50 dark:bg-transparent"
              onClick={() => {
                setBreathingComplete(false);
                setSelectedBreathPattern(null);
              }}
            >
              {t("mind.breath.changeExercise")}
            </Button>
            <Button
              variant="outline"
              className="w-full rounded-xl border-border dark:bg-transparent"
              onClick={() => {
                setWellnessContext({
                  source: "mindfulness",
                  summary: t("mind.ctx.afterBreath"),
                  savedAt: new Date().toISOString(),
                });
                navigate("/chat", {
                  state: {
                    initialMessage: t("mind.breath.chatSeed"),
                  },
                });
              }}
            >
              {t("mind.breath.chatCta")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isSessionActive && selectedMode) {
    const mode = modes.find((m) => m.id === selectedMode);
    if (!mode) return null;
    return (
      <div className="flex min-h-screen flex-col items-center overflow-x-hidden bg-gradient-to-b from-lavender/30 to-background px-4 py-12 sm:py-24">
        <div className="mx-auto w-full max-w-5xl space-y-12 text-center sm:space-y-16">
          <div className="mb-6 flex items-center justify-between">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <RotateCcw className="h-4 w-4" />
              {t("mind.end") || "End Session"}
            </button>
            <div className="text-sm font-medium text-muted-foreground">
              {t("common.step") || "Step"} {sessionStep + 1} {t("common.of") || "of"}{" "}
              {mode.steps.length}
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card bg-gradient-to-b from-primary/[0.07] to-card p-8 text-card-foreground shadow-2xl dark:border-border dark:from-transparent dark:to-card dark:shadow-black/30">
            <div className="mb-6 flex justify-center text-primary [&_svg]:h-14 [&_svg]:w-14">
              {mode.icon}
            </div>
            <h2 className="mb-3 font-lustria text-xl font-bold text-foreground sm:mb-4 sm:text-2xl">
              {mode.title}
            </h2>
            <p className="mb-10 min-h-[4.5rem] text-lg leading-relaxed text-foreground/90 sm:text-xl">
              {mode.steps[sessionStep]}
            </p>
            <Progress
              value={(sessionStep + 1) * (100 / mode.steps.length)}
              className="mb-6 h-2"
            />
            <Button
              onClick={handleNext}
              className="mx-auto h-12 w-full max-w-xs rounded-xl bg-secondary text-base font-semibold hover:bg-secondary/90"
            >
              {sessionStep === mode.steps.length - 1
                ? t("mind.btnFinish") || "Finish Session"
                : t("mind.btnNext") || "Next Step"}
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          <Button variant="ghost" onClick={() => navigate("/")} className="mt-4">
            <Home className="mr-2 h-4 w-4" />
            {t("common.backHome") || "Back to Home"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-lavender/20 to-background px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <h1 className="mb-3 font-lustria text-3xl font-bold text-foreground sm:text-4xl">
            {t("mind.title") || "Mindfulness & Grounding"}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t("mind.subtitle") || "Choose a practice to center yourself. No pressure, no rush."}
          </p>
        </div>

        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {modes.map((mode) => (
            <Card
              key={mode.id}
              className={`cursor-pointer border-2 border-border bg-card bg-gradient-to-b from-primary/[0.06] to-card text-card-foreground shadow-sm transition-all duration-300 hover:scale-[1.02] hover:border-primary/45 hover:shadow-md dark:from-transparent dark:to-card ${MODE_CARD_ACCENT[mode.id]}`}
              onClick={() => startSession(mode.id)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="rounded-full bg-background/70 p-3 text-foreground ring-1 ring-border/60 dark:bg-muted dark:text-card-foreground dark:ring-border">
                    {mode.icon}
                  </div>
                  <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                </div>
                <CardTitle className="mt-4 text-xl text-foreground">{mode.title}</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {mode.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {mode.steps.slice(0, 3).map((step, idx) => (
                    <li key={idx} className="flex items-start text-left">
                      <span className="mr-2 text-foreground/80">•</span>
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
          <Button variant="outline" onClick={() => navigate("/assessment")} className="mr-4">
            {t("mind.btnAssess") || "Take a quick assessment first"}
          </Button>
          <Button variant="ghost" onClick={() => navigate("/")}>
            <Home className="mr-2 h-4 w-4" />
            {t("common.backHome") || "Back to Home"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Mindfulness;

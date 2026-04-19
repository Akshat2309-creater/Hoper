import { useState, useEffect, useRef, type ReactNode } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Moon,
  Wind,
  CheckCircle,
  Clock,
  Home,
  ChevronRight,
  Star,
  Sparkles,
  Headphones,
  Shield,
  ScanLine,
  GitBranch,
  PenLine,
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
import { useLanguage } from "@/contexts/LanguageContext";
import {
  GuidedBreathing,
  BREATHING_PATTERN_CONFIG,
} from "@/components/GuidedBreathing";
import { setWellnessContext } from "@/lib/wellnessContext";
import { useSleepAmbient } from "@/hooks/useSleepAmbient";
import { SleepSoundPicker } from "@/components/sleep/SleepSoundPicker";
import { SleepRitualBuilder } from "@/components/sleep/SleepRitualBuilder";
import { SleepBodyScan } from "@/components/sleep/SleepBodyScan";
import { SleepCommitment } from "@/components/sleep/SleepCommitment";
import { SleepBranchStory } from "@/components/sleep/SleepBranchStory";
import { SleepDiaryEntry } from "@/components/sleep/SleepDiaryEntry";
import { SleepAmbientDock } from "@/components/sleep/SleepAmbientDock";

type Step =
  | "greeting"
  | "dimming"
  | "ritual"
  | "sounds"
  | "commitment"
  | "breathing"
  | "bodyscan"
  | "story"
  | "diary"
  | "checklist"
  | "close";

const Sleep = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState<Step>("greeting");
  const [timeOfDay, setTimeOfDay] = useState<"day" | "evening">("day");
  const [completedSteps, setCompletedSteps] = useState<Step[]>([]);
  const [breathingDone, setBreathingDone] = useState(false);
  const [bodyScanDone, setBodyScanDone] = useState(false);
  const urlStepApplied = useRef(false);
  const ambient = useSleepAmbient();

  useEffect(() => {
    const hour = new Date().getHours();
    setTimeOfDay(hour >= 18 || hour < 6 ? "evening" : "day");
  }, []);

  useEffect(() => {
    if (currentStep !== "breathing") setBreathingDone(false);
    if (currentStep !== "bodyscan") setBodyScanDone(false);
  }, [currentStep]);

  const stepOrder: Step[] = [
    "greeting",
    "dimming",
    "ritual",
    "sounds",
    "commitment",
    "breathing",
    "bodyscan",
    "story",
    "diary",
    "checklist",
    "close",
  ];

  useEffect(() => {
    if (urlStepApplied.current) return;
    const raw = searchParams.get("step");
    if (!raw) return;
    if (stepOrder.includes(raw as Step)) {
      urlStepApplied.current = true;
      setCurrentStep(raw as Step);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const steps: Record<Step, { title: string; description: string; icon: ReactNode }> = {
    greeting: {
      title:
        timeOfDay === "day"
          ? t("sleep.dayGreeting")
          : t("sleep.nightGreeting"),
      description:
        timeOfDay === "day"
          ? t("sleep.dayDesc")
          : t("sleep.nightDesc"),
      icon: <Moon className="w-8 h-8" />,
    },
    dimming: {
      title: t("sleep.dim.title") || "Reduce screen brightness",
      description: t("sleep.dim.desc") || "Dim your screen or enable night shift to reduce blue light exposure.",
      icon: <Star className="w-8 h-8" />,
    },
    ritual: {
      title: t("sleep.ritual.title"),
      description: t("sleep.ritual.desc"),
      icon: <Sparkles className="w-8 h-8" />,
    },
    sounds: {
      title: t("sleep.sound.title"),
      description: t("sleep.sound.desc"),
      icon: <Headphones className="w-8 h-8" />,
    },
    commitment: {
      title: t("sleep.commit.title"),
      description: t("sleep.commit.desc"),
      icon: <Shield className="w-8 h-8" />,
    },
    breathing: {
      title: t("sleep.breath.title") || "Breathing warm-up",
      description: t("sleep.breath.desc") || "A quick 4-7-8 breathing exercise to calm your nervous system.",
      icon: <Wind className="w-8 h-8" />,
    },
    bodyscan: {
      title: t("sleep.body.title"),
      description: t("sleep.body.desc"),
      icon: <ScanLine className="w-8 h-8" />,
    },
    story: {
      title: t("sleep.story.title"),
      description: t("sleep.story.desc"),
      icon: <GitBranch className="w-8 h-8" />,
    },
    diary: {
      title: t("sleep.diary.title"),
      description: t("sleep.diary.desc"),
      icon: <PenLine className="w-8 h-8" />,
    },
    checklist: {
      title: t("sleep.check.title") || "Sleep hygiene checklist",
      description: t("sleep.check.desc") || "Personalized tips based on your assessment.",
      icon: <CheckCircle className="w-8 h-8" />,
    },
    close: {
      title: t("sleep.close.title") || "You're all set",
      description: t("sleep.close.desc") || "Great job preparing for sleep. Sweet dreams!",
      icon: <Clock className="w-8 h-8" />,
    },
  };

  const handleNext = () => {
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCompletedSteps([...completedSteps, currentStep]);
      setCurrentStep(stepOrder[currentIndex + 1]);
    } else {
      navigate("/");
    }
  };

  const handleBack = () => {
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  const handleSkipToClose = () => {
    setCurrentStep("close");
  };

  const breathLabels = {
    inhale: t("mind.breath.inhale"),
    hold: t("mind.breath.hold"),
    exhale: t("mind.breath.exhale"),
    cycle: (n: number, total: number) => {
      const fmt = t("mind.breath.cycleFmt");
      if (fmt.includes("{0}"))
        return fmt.replace("{0}", String(n)).replace("{1}", String(total));
      return `Cycle ${n} / ${total}`;
    },
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

  const getStepContent = (step: Step) => {
    switch (step) {
      case "greeting":
        return (
          <div className="space-y-6 text-center">
            <div className="text-6xl">🌙</div>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Card className="border-border bg-card text-card-foreground dark:bg-card/90">
                <CardHeader>
                  <CardTitle className="text-lg">{t("sleep.hygiene.title") || "Sleep Hygiene Tips"}</CardTitle>
                  <CardDescription>{t("sleep.hygiene.desc") || "Daily habits for better sleep"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-left text-sm text-muted-foreground">
                    <li>• {t("sleep.hygiene.i1") || "Avoid caffeine after 2 PM"}</li>
                    <li>• {t("sleep.hygiene.i2") || "Keep your bedroom cool and dark"}</li>
                    <li>• {t("sleep.hygiene.i3") || "Stick to a consistent bedtime"}</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-border bg-card text-card-foreground dark:bg-card/90">
                <CardHeader>
                  <CardTitle className="text-lg">{t("sleep.winddown.title") || "Wind-Down Routine"}</CardTitle>
                  <CardDescription>{t("sleep.winddown.desc") || "Evening relaxation ideas"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-left text-sm text-muted-foreground">
                    <li>• {t("sleep.winddown.i1") || "Read a book (no screens)"}</li>
                    <li>• {t("sleep.winddown.i2") || "Gentle stretching or yoga"}</li>
                    <li>• {t("sleep.winddown.i3") || "Write down tomorrow's tasks"}</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case "dimming":
        return (
          <div className="space-y-6 text-center">
            <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-r from-indigo-200/80 to-sky-200/80 dark:from-secondary/40 dark:to-muted/50">
              <span className="text-5xl" aria-hidden>
                📱
              </span>
            </div>
            <div className="rounded-xl border border-border bg-muted/30 p-4 text-left dark:bg-muted/15">
              <h3 className="mb-2 font-semibold text-foreground">{t("common.quickTips") || "Quick tips:"}</h3>
              <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                <li>{t("sleep.dim.i1") || "Turn on Night Shift / Blue Light Filter"}</li>
                <li>{t("sleep.dim.i2") || "Lower screen brightness below 50%"}</li>
                <li>{t("sleep.dim.i3") || "Consider using an app like f.lux"}</li>
              </ul>
            </div>
          </div>
        );
      case "ritual":
        return <SleepRitualBuilder t={t} onContinue={handleNext} />;
      case "sounds":
        return (
          <SleepSoundPicker
            t={t}
            activeId={ambient.activeId}
            volume={ambient.volume}
            setVolume={ambient.setVolume}
            play={ambient.play}
            stop={ambient.stop}
          />
        );
      case "commitment":
        return <SleepCommitment t={t} onContinue={handleNext} />;
      case "breathing": {
        const sleepBreathCfg = BREATHING_PATTERN_CONFIG["relax-478"];
        if (!breathingDone) {
          return (
            <div className="space-y-4">
              <GuidedBreathing
                pattern="relax-478"
                cycles={sleepBreathCfg.defaultCycles}
                labels={breathLabels}
                tone="indigo"
                rhythmLabel={t("sleep.breath.rhythm478")}
                onComplete={() => setBreathingDone(true)}
                onExit={() => setBreathingDone(true)}
              />
              <p className="text-center text-sm text-muted-foreground">{t("sleep.breath.note")}</p>
            </div>
          );
        }
        return (
          <div className="space-y-4 text-center">
            <p className="text-lg font-medium text-foreground">{t("sleep.breath.afterTitle")}</p>
            <p className="text-sm text-muted-foreground">{t("sleep.breath.afterHint")}</p>
          </div>
        );
      }
      case "bodyscan":
        if (!bodyScanDone) {
          return <SleepBodyScan t={t} onDone={() => setBodyScanDone(true)} />;
        }
        return (
          <div className="text-center">
            <p className="text-foreground">{t("sleep.body.finish")}</p>
            <p className="mt-2 text-sm text-muted-foreground">{t("sleep.body.hint")}</p>
          </div>
        );
      case "story":
        return <SleepBranchStory t={t} onDone={handleNext} />;
      case "diary":
        return <SleepDiaryEntry t={t} onContinue={handleNext} />;
      case "checklist":
        return (
          <div className="space-y-6 text-center">
            <div className="text-6xl" aria-hidden>
              ✅
            </div>
            <div className="mx-auto max-w-md space-y-3">
              {[
                t("sleep.check.i1") || "Avoid news/social media 1 hour before bed",
                t("sleep.check.i2") || "Drink a cup of herbal tea (chamomile, lavender)",
                t("sleep.check.i3") || "Set your room temperature to 18–20°C",
                t("sleep.check.i4") || "Use blackout curtains or a sleep mask",
                t("sleep.check.i5") || "Keep a notepad by your bed for thoughts",
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-left text-card-foreground dark:bg-card/90"
                >
                  <input type="checkbox" className="h-5 w-5 shrink-0 rounded border-border" />
                  <span className="flex-1 text-sm">{item}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              {t("sleep.check.note") || "Check off items as you complete them tonight."}
            </p>
          </div>
        );
      case "close":
        return (
          <div className="space-y-6 text-center">
            <div className="text-6xl" aria-hidden>
              💤
            </div>
            <Card className="border-border bg-gradient-to-br from-emerald-50/90 to-teal-50/80 p-8 dark:from-card dark:to-muted/30 dark:text-card-foreground">
              <h3 className="mb-4 text-xl font-bold text-foreground">
                {t("sleep.close.hero") || "You've completed your wind‑down routine!"}
              </h3>
              <p className="mb-6 text-muted-foreground">
                {t("sleep.close.sub") || "Sleep well, and remember — HOPEr is here if you need support."}
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Button
                  onClick={() => {
                    setWellnessContext({
                      source: "sleep",
                      summary: t("sleep.ctx.doneSummary"),
                      savedAt: new Date().toISOString(),
                    });
                    navigate("/chat", {
                      state: {
                        initialMessage:
                          t("sleep.chatQuery") ||
                          "I just finished my sleep wind-down routine. Can we talk about sleep?",
                      },
                    });
                  }}
                >
                  {t("sleep.btnAskHoper") || "Ask HOPEr about sleep"}
                </Button>
                <Button variant="outline" onClick={() => navigate("/")}>
                  {t("common.backHome") || "Return to homepage"}
                </Button>
              </div>
            </Card>
          </div>
        );
      default:
        return null;
    }
  };

  const currentIndex = stepOrder.indexOf(currentStep);
  const progress = ((currentIndex + 1) / stepOrder.length) * 100;

  const soundLabel =
    ambient.activeId !== "off" ? t(`sleep.sound.${ambient.activeId}`) : "";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-indigo-50 to-background px-4 py-12 dark:from-indigo-950/40 sm:py-24">
      <SleepAmbientDock
        soundLabel={soundLabel}
        dockAriaLabel={t("sleep.sound.dockLabel")}
        activeId={ambient.activeId}
        volume={ambient.volume}
        setVolume={ambient.setVolume}
        stop={ambient.stop}
      />
      <div className="mx-auto flex w-full max-w-6xl flex-col pb-20">
        <div className="mb-8 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <Home className="h-4 w-4" />
            {t("common.home") || "Home"}
          </button>
          <div className="flex items-center gap-2">
            <Moon className="h-5 w-5 text-indigo-600 dark:text-primary" />
            <span className="font-bold text-foreground">{t("sleep.title")}</span>
          </div>
          <button
            type="button"
            onClick={handleSkipToClose}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {t("sleep.btnSkip")}
          </button>
        </div>

        <div className="mb-10">
          <div className="mb-2 flex justify-between text-sm text-muted-foreground">
            <span>
              {t("common.step") || "Step"} {currentIndex + 1} {t("common.of") || "of"} {stepOrder.length}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="border-2 border-border shadow-xl dark:border-border dark:bg-card/95">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-primary/15 dark:text-primary">
              {steps[currentStep].icon}
            </div>
            <CardTitle className="text-2xl text-foreground">{steps[currentStep].title}</CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              {steps[currentStep].description}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-8">{getStepContent(currentStep)}</CardContent>
        </Card>

        <div className="mt-8 flex justify-between gap-4">
          <Button variant="outline" onClick={handleBack} disabled={currentIndex === 0}>
            {t("sleep.btnPrevious")}
          </Button>
          <Button
            onClick={handleNext}
            disabled={
              (currentStep === "breathing" && !breathingDone) ||
              (currentStep === "bodyscan" && !bodyScanDone)
            }
            className="bg-indigo-600 hover:bg-indigo-700 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
          >
            {currentStep === "close" ? t("sleep.btnFinish") : t("sleep.btnNext")}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="mt-12 text-center">
          <p className="mb-4 text-muted-foreground">{t("sleep.footer") || "Need more help with sleep?"}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="outline" size="sm" onClick={() => navigate("/assessment")}>
              {t("sleep.btnAssess") || "Take sleep assessment"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate("/mindfulness")}>
              {t("mind.title") || "Try mindfulness"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate("/chat")}>
              {t("sleep.btnChat") || "Chat with HOPEr"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sleep;

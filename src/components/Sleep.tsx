import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Moon,
  Wind,
  BookOpen,
  CheckCircle,
  Clock,
  Home,
  ChevronRight,
  Star,
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

type Step =
  | "greeting"
  | "dimming"
  | "breathing"
  | "script"
  | "checklist"
  | "close";

const Sleep = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState<Step>("greeting");
  const [timeOfDay, setTimeOfDay] = useState<"day" | "evening">("day");
  const [completedSteps, setCompletedSteps] = useState<Step[]>([]);

  useEffect(() => {
    const hour = new Date().getHours();
    setTimeOfDay(hour >= 18 || hour < 6 ? "evening" : "day");
  }, []);

  const steps: Record<
    Step,
    { title: string; description: string; icon: React.ReactNode }
  > = {
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
    breathing: {
      title: t("sleep.breath.title") || "Breathing warm-up",
      description: t("sleep.breath.desc") || "A quick 4-7-8 breathing exercise to calm your nervous system.",
      icon: <Wind className="w-8 h-8" />,
    },
    script: {
      title: t("sleep.script.title") || "Calming sleep story",
      description: t("sleep.script.desc") || "Listen to a short guided relaxation script.",
      icon: <BookOpen className="w-8 h-8" />,
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

  const stepOrder: Step[] = [
    "greeting",
    "dimming",
    "breathing",
    "script",
    "checklist",
    "close",
  ];

  const handleNext = () => {
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCompletedSteps([...completedSteps, currentStep]);
      setCurrentStep(stepOrder[currentIndex + 1]);
    } else {
      // Finished
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

  const getStepContent = (step: Step) => {
    switch (step) {
      case "greeting":
        return (
          <div className="text-center space-y-6">
            <div className="text-6xl">🌙</div>
            <h2 className="text-2xl font-bold text-charcoal-gray">
              {steps[step].title}
            </h2>
            <p className="text-lg text-charcoal-gray/80">
              {steps[step].description}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              <Card className="bg-gradient-to-br from-blue-50 to-cyan-50">
                <CardHeader>
                  <CardTitle className="text-lg">{t("sleep.hygiene.title") || "Sleep Hygiene Tips"}</CardTitle>
                  <CardDescription>
                    {t("sleep.hygiene.desc") || "Daily habits for better sleep"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-2">
                    <li>• {t("sleep.hygiene.i1") || "Avoid caffeine after 2 PM"}</li>
                    <li>• {t("sleep.hygiene.i2") || "Keep your bedroom cool and dark"}</li>
                    <li>• {t("sleep.hygiene.i3") || "Stick to a consistent bedtime"}</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
                <CardHeader>
                  <CardTitle className="text-lg">{t("sleep.winddown.title") || "Wind-Down Routine"}</CardTitle>
                  <CardDescription>{t("sleep.winddown.desc") || "Evening relaxation ideas"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-2">
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
          <div className="text-center space-y-6">
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-blue-200 to-indigo-300 flex items-center justify-center">
              <div className="text-5xl">📱</div>
            </div>
            <h2 className="text-2xl font-bold text-charcoal-gray">
              {steps[step].title}
            </h2>
            <p className="text-lg text-charcoal-gray/80">
              {steps[step].description}
            </p>
            <div className="bg-muted/50 rounded-xl p-4 text-left">
              <h3 className="font-semibold mb-2">{t("common.quickTips") || "Quick tips:"}</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>{t("sleep.dim.i1") || "Turn on Night Shift / Blue Light Filter"}</li>
                <li>{t("sleep.dim.i2") || "Lower screen brightness below 50%"}</li>
                <li>{t("sleep.dim.i3") || "Consider using an app like f.lux"}</li>
              </ul>
            </div>
          </div>
        );
      case "breathing":
        return (
          <div className="text-center space-y-6">
            <div className="relative w-48 h-48 mx-auto">
              <div className="absolute inset-0 rounded-full border-8 border-blue-300 animate-pulse"></div>
              <div className="absolute inset-8 rounded-full border-6 border-blue-400 animate-pulse delay-300"></div>
              <div className="absolute inset-16 rounded-full border-4 border-blue-500 animate-pulse delay-700"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-charcoal-gray">
                  4-7-8
                </span>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-charcoal-gray">
              {steps[step].title}
            </h2>
            <p className="text-lg text-charcoal-gray/80">
              {steps[step].description}
            </p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-blue-100 rounded-xl p-4">
                <div className="text-2xl font-bold text-blue-800">4</div>
                <div className="text-sm">{t("common.inhale") || "Inhale"}</div>
              </div>
              <div className="bg-blue-200 rounded-xl p-4">
                <div className="text-2xl font-bold text-blue-800">7</div>
                <div className="text-sm">{t("common.hold") || "Hold"}</div>
              </div>
              <div className="bg-blue-300 rounded-xl p-4">
                <div className="text-2xl font-bold text-blue-800">8</div>
                <div className="text-sm">{t("common.exhale") || "Exhale"}</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {t("sleep.breath.note") || "Repeat 4 cycles, breathing gently through your nose."}
            </p>
          </div>
        );
      case "script":
        return (
          <div className="text-center space-y-6">
            <div className="text-6xl">📖</div>
            <h2 className="text-2xl font-bold text-charcoal-gray">
              {steps[step].title}
            </h2>
            <p className="text-lg text-charcoal-gray/80">
              {steps[step].description}
            </p>
            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 text-left p-6">
              <p className="italic text-charcoal-gray/90">
                "{t("sleep.script.content") || "Imagine yourself lying in a comfortable meadow. The sky is a deep, velvety blue, dotted with stars. You feel the soft grass beneath you, and a gentle breeze brushes your skin. With each breath, you let go of the day's worries, sinking deeper into relaxation..."}"
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                {t("sleep.script.note") || "Continue reading at your own pace, or close your eyes and visualize."}
              </p>
            </Card>
            <Button
              variant="outline"
              onClick={() => navigate("/mindfulness")}
              className="mt-4"
            >
              {t("sleep.btnMindfulnessMode") || "Try a guided meditation instead"}
            </Button>
          </div>
        );
      case "checklist":
        return (
          <div className="text-center space-y-6">
            <div className="text-6xl">✅</div>
            <h2 className="text-2xl font-bold text-charcoal-gray">
              {steps[step].title}
            </h2>
            <p className="text-lg text-charcoal-gray/80">
              {steps[step].description}
            </p>
            <div className="space-y-3 max-w-md mx-auto">
              {[
                t("sleep.check.i1") || "Avoid news/social media 1 hour before bed",
                t("sleep.check.i2") || "Drink a cup of herbal tea (chamomile, lavender)",
                t("sleep.check.i3") || "Set your room temperature to 18–20°C",
                t("sleep.check.i4") || "Use blackout curtains or a sleep mask",
                t("sleep.check.i5") || "Keep a notepad by your bed for thoughts",
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 bg-white border rounded-xl p-4"
                >
                  <input type="checkbox" className="h-5 w-5 rounded" />
                  <span className="text-left flex-1">{item}</span>
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
          <div className="text-center space-y-6">
            <div className="text-6xl">💤</div>
            <h2 className="text-2xl font-bold text-charcoal-gray">
              {steps[step].title}
            </h2>
            <p className="text-lg text-charcoal-gray/80">
              {steps[step].description}
            </p>
            <Card className="bg-gradient-to-br from-green-50 to-emerald-100 p-8">
              <h3 className="text-xl font-bold mb-4">
                {t("sleep.close.hero") || "You've completed your wind‑down routine!"}
              </h3>
              <p className="mb-6">
                {t("sleep.close.sub") || "Sleep well, and remember — HOPEr is here if you need support."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() =>
                    navigate("/chat", {
                      state: {
                        initialMessage:
                          t("sleep.chatQuery") || "I just finished my sleep wind-down routine. Can we talk about sleep?",
                      },
                    })
                  }
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-background px-4 py-10">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Home className="w-4 h-4" />
            {t("common.home") || "Home"}
          </button>
          <div className="flex items-center gap-2">
            <Moon className="w-5 h-5 text-indigo-600" />
            <span className="font-bold text-charcoal-gray">{t("sleep.title")}</span>
          </div>
          <button
            onClick={handleSkipToClose}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {t("sleep.btnSkip")}
          </button>
        </div>

        {/* Progress */}
        <div className="mb-10">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>
              {t("common.step") || "Step"} {currentIndex + 1} {t("common.of") || "of"} {stepOrder.length}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <Card className="border-2 shadow-xl">
          <CardHeader className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mx-auto mb-4">
              {steps[currentStep].icon}
            </div>
            <CardTitle className="text-2xl">
              {steps[currentStep].title}
            </CardTitle>
            <CardDescription className="text-lg">
              {steps[currentStep].description}
            </CardDescription>
          </CardHeader>
          <CardContent>{getStepContent(currentStep)}</CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentIndex === 0}
          >
            {t("sleep.btnPrevious")}
          </Button>
          <Button
            onClick={handleNext}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {currentStep === "close" ? t("sleep.btnFinish") : t("sleep.btnNext")}
            <ChevronRight className="ml-2 w-4 h-4" />
          </Button>
        </div>

        {/* Quick Links */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            {t("sleep.footer") || "Need more help with sleep?"}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/assessment")}
            >
              {t("sleep.btnAssess") || "Take sleep assessment"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/mindfulness")}
            >
              {t("mind.title") || "Try mindfulness"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/chat")}
            >
              {t("sleep.btnChat") || "Chat with HOPEr"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sleep;

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

type Step =
  | "greeting"
  | "dimming"
  | "breathing"
  | "script"
  | "checklist"
  | "close";

const Sleep = () => {
  const navigate = useNavigate();
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
          ? "Planning for better sleep tonight?"
          : "Ready to wind down?",
      description:
        timeOfDay === "day"
          ? "Let's prepare for a restful night with some healthy habits."
          : "Take a moment to relax and transition into sleep mode.",
      icon: <Moon className="w-8 h-8" />,
    },
    dimming: {
      title: "Reduce screen brightness",
      description:
        "Dim your screen or enable night shift to reduce blue light exposure.",
      icon: <Star className="w-8 h-8" />,
    },
    breathing: {
      title: "Breathing warm-up",
      description:
        "A quick 4-7-8 breathing exercise to calm your nervous system.",
      icon: <Wind className="w-8 h-8" />,
    },
    script: {
      title: "Calming sleep story",
      description: "Listen to a short guided relaxation script.",
      icon: <BookOpen className="w-8 h-8" />,
    },
    checklist: {
      title: "Sleep hygiene checklist",
      description: "Personalized tips based on your assessment.",
      icon: <CheckCircle className="w-8 h-8" />,
    },
    close: {
      title: "You're all set",
      description: "Great job preparing for sleep. Sweet dreams!",
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
                  <CardTitle className="text-lg">Sleep Hygiene Tips</CardTitle>
                  <CardDescription>
                    Daily habits for better sleep
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-2">
                    <li>• Avoid caffeine after 2 PM</li>
                    <li>• Keep your bedroom cool and dark</li>
                    <li>• Stick to a consistent bedtime</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
                <CardHeader>
                  <CardTitle className="text-lg">Wind‑Down Routine</CardTitle>
                  <CardDescription>Evening relaxation ideas</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-2">
                    <li>• Read a book (no screens)</li>
                    <li>• Gentle stretching or yoga</li>
                    <li>• Write down tomorrow's tasks</li>
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
              <h3 className="font-semibold mb-2">Quick tips:</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Turn on Night Shift / Blue Light Filter</li>
                <li>Lower screen brightness below 50%</li>
                <li>Consider using an app like f.lux</li>
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
                <div className="text-sm">Inhale</div>
              </div>
              <div className="bg-blue-200 rounded-xl p-4">
                <div className="text-2xl font-bold text-blue-800">7</div>
                <div className="text-sm">Hold</div>
              </div>
              <div className="bg-blue-300 rounded-xl p-4">
                <div className="text-2xl font-bold text-blue-800">8</div>
                <div className="text-sm">Exhale</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Repeat 4 cycles, breathing gently through your nose.
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
                "Imagine yourself lying in a comfortable meadow. The sky is a
                deep, velvety blue, dotted with stars. You feel the soft grass
                beneath you, and a gentle breeze brushes your skin. With each
                breath, you let go of the day's worries, sinking deeper into
                relaxation..."
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                Continue reading at your own pace, or close your eyes and
                visualize.
              </p>
            </Card>
            <Button
              variant="outline"
              onClick={() => navigate("/mindfulness")}
              className="mt-4"
            >
              Try a guided meditation instead
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
                "Avoid news/social media 1 hour before bed",
                "Drink a cup of herbal tea (chamomile, lavender)",
                "Set your room temperature to 18–20°C",
                "Use blackout curtains or a sleep mask",
                "Keep a notepad by your bed for thoughts",
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
              Check off items as you complete them tonight.
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
                You've completed your wind‑down routine!
              </h3>
              <p className="mb-6">
                Sleep well, and remember — HOPEr is here if you need support.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() =>
                    navigate("/chat", {
                      state: {
                        initialMessage:
                          "I just finished my sleep wind-down routine. Can we talk about sleep?",
                      },
                    })
                  }
                >
                  Ask HOPEr about sleep
                </Button>
                <Button variant="outline" onClick={() => navigate("/")}>
                  Return to homepage
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
            Home
          </button>
          <div className="flex items-center gap-2">
            <Moon className="w-5 h-5 text-indigo-600" />
            <span className="font-bold text-charcoal-gray">Sleep Wellness</span>
          </div>
          <button
            onClick={handleSkipToClose}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Skip
          </button>
        </div>

        {/* Progress */}
        <div className="mb-10">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>
              Step {currentIndex + 1} of {stepOrder.length}
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
            Previous
          </Button>
          <Button
            onClick={handleNext}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {currentStep === "close" ? "Finish" : "Next Step"}
            <ChevronRight className="ml-2 w-4 h-4" />
          </Button>
        </div>

        {/* Quick Links */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Need more help with sleep?
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/assessment")}
            >
              Take sleep assessment
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/mindfulness")}
            >
              Try mindfulness
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/chat")}
            >
              Chat with HOPEr
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sleep;

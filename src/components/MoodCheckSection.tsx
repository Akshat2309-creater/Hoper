import { ArrowRight, HeartPulse } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const MoodCheckSection = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  return (
    <section id="mood-check" className="bg-off-white px-4 py-16 sm:px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card text-card-foreground shadow-md md:flex-row md:divide-x md:divide-border/60 dark:border-deep-purple/30 dark:shadow-lg">
          <div className="md:w-1/2 p-8 sm:p-10 bg-gradient-to-br from-soft-lavender/40 to-white dark:from-soft-lavender/20 dark:to-card">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-golden-yellow/20 text-golden-yellow text-sm font-semibold mb-4">
              <HeartPulse className="h-4 w-4" />
              {t("mood.badge") || "New wellbeing tool"}
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {t("mood.title") || "Know Your Mood in Minutes"}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {t("mood.desc") || "Answer eight gentle questions and get a friendly mood snapshot with supportive tips. This quick check-in can help you notice how you're doing today."}
            </p>
          </div>
          <div className="md:w-1/2 flex flex-col justify-center bg-off-white/60 p-8 sm:p-10 dark:bg-muted/25">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-deep-purple" aria-hidden="true" />
                <p className="text-sm text-foreground/90 sm:text-base">
                  {t("mood.features") || "Takes under 3 minutes · Safe · Non-judgmental · Mobile friendly"}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate("/mood-check")}
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-deep-purple px-6 py-3 text-white font-semibold shadow-md transition-transform duration-200 hover:shadow-lg hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-deep-purple"
                >
                  {t("mood.btnStart") || "Start Mood Quiz"}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
                <button
                  onClick={() => navigate("/learn-more")}
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-deep-purple px-6 py-3 text-deep-purple font-semibold transition-colors duration-200 hover:bg-deep-purple hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-deep-purple"
                >
                  {t("mood.btnLearn") || "Learn more"}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                {t("mood.disclaimer") || "Scores are indicators, not diagnoses. If you feel unsafe, please reach out to a trusted person or local helpline immediately."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MoodCheckSection;

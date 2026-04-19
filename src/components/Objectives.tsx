import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const Objectives = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const objectives = [
    {
      number: 1,
      title: t("obj.o1.title") || "Provide Empathetic Guidance",
      description: t("obj.o1.desc") || "Reduce stress, motivate students, and foster resilience through compassionate conversations.",
      circleColor: "bg-golden-yellow",
      textColor: "text-[hsl(26_18%_14%)]",
    },
    {
      number: 2,
      title: t("obj.o2.title") || "Minimize Hallucinations",
      description: t("obj.o2.desc") || "Grounded in verified knowledge to ensure responsible and beneficial interactions.",
      circleColor: "bg-golden-yellow",
      textColor: "text-[hsl(26_18%_14%)]",
    },
    {
      number: 3,
      title: t("obj.o3.title") || "Develop Safe AI Companion",
      description: t("obj.o3.desc") || "Using RAG technology for accurate, reliable, and therapeutically sound responses.",
      circleColor: "bg-golden-yellow",
      textColor: "text-[hsl(26_18%_14%)]",
    },
    {
      number: 4,
      title: t("obj.o4.title") || "Build Scalable Platform",
      description: t("obj.o4.desc") || "Designed for schools, universities, and communities to maximize positive impact.",
      circleColor: "bg-golden-yellow",
      textColor: "text-[hsl(26_18%_14%)]",
    },
    {
      number: 5,
      title: t("obj.o5.title") || "Encourage Healthy Habits",
      description: t("obj.o5.desc") || "Promote well-being while preventing over-reliance on AI, fostering independence.",
      circleColor: "bg-golden-yellow",
      textColor: "text-[hsl(26_18%_14%)]",
    },
    {
      number: 6,
      title: t("obj.o6.title") || "Ensure Privacy & Security",
      description: t("obj.o6.desc") || "Protect user data and maintain confidentiality while providing personalized support.",
      circleColor: "bg-golden-yellow",
      textColor: "text-[hsl(26_18%_14%)]",
    },
  ];

  return (
    <section
      id="objectives"
      className="bg-off-white py-12 px-4 sm:px-6 sm:py-16 md:py-20 dark:bg-background"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="rounded-2xl bg-deep-purple p-6 shadow-lg ring-1 ring-black/5 sm:p-8 lg:p-12 lg:shadow-xl dark:bg-secondary dark:ring-border">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="mb-3 text-3xl font-bold text-white dark:text-secondary-foreground sm:mb-4 sm:text-4xl md:text-5xl">
              {t("obj.titlePrefix") || "Our Core"}{" "}
              <span className="text-golden-yellow">{t("obj.titleSuffix") || "Objectives"}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 lg:gap-8 mb-8 sm:mb-10 md:mb-12">
            <div className="space-y-5 sm:space-y-6 lg:space-y-8">
              {objectives.slice(0, 3).map((objective) => (
                <div key={objective.number} className="flex items-start space-x-3 sm:space-x-4">
                  <div className={`w-11 h-11 sm:w-12 sm:h-12 ${objective.circleColor} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <span className={`text-base sm:text-lg font-bold ${objective.textColor}`}>{objective.number}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-1 text-lg font-bold text-white dark:text-secondary-foreground sm:mb-2 sm:text-xl">
                      {objective.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-white/90 dark:text-secondary-foreground/85 sm:text-base">
                      {objective.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-5 sm:space-y-6 lg:space-y-8">
              {objectives.slice(3).map((objective) => (
                <div key={objective.number} className="flex items-start space-x-3 sm:space-x-4">
                  <div className={`w-11 h-11 sm:w-12 sm:h-12 ${objective.circleColor} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <span className={`text-base sm:text-lg font-bold ${objective.textColor}`}>{objective.number}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-1 text-lg font-bold text-white dark:text-secondary-foreground sm:mb-2 sm:text-xl">
                      {objective.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-white/90 dark:text-secondary-foreground/85 sm:text-base">
                      {objective.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <Button size="lg" className="bg-golden-yellow text-[hsl(26_18%_14%)] hover:bg-golden-yellow/90 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 active:scale-95 transition-transform" onClick={() => navigate('/chat')}>
              {t("obj.cta") || "Experience HOPEr Today"}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Objectives;

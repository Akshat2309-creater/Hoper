import { useNavigate } from "react-router-dom";
import { ClipboardList, Leaf, Moon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Features = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  /** Icon chips use design tokens so light + dark both read clearly. */
  const features = [
    {
      title: t("nav.checkIn") || "Check In",
      description: t("features.assessmentDesc") || "Take a personalized mental health assessment to understand your emotions.",
      icon: ClipboardList,
      path: "/assessment",
      color: "bg-secondary text-secondary-foreground",
      hover: "hover:bg-secondary/90",
    },
    {
      title: t("nav.mindfulness") || "Mindfulness",
      description: t("features.mindfulnessDesc") || "Explore guided breathing, grounding exercises, and meditation.",
      icon: Leaf,
      path: "/mindfulness?mode=breathing",
      color: "bg-mint text-mint-foreground",
      hover: "hover:bg-mint/90",
    },
    {
      title: t("nav.sleep") || "Sleep",
      description: t("features.sleepDesc") || "Prepare for a restful night with relaxation and sleep tracking tools.",
      icon: Moon,
      path: "/sleep?step=breathing",
      color: "bg-sky text-sky-foreground",
      hover: "hover:bg-sky/90",
    },
  ];

  return (
    <section
      id="features"
      className="border-y border-border/50 bg-off-white/60 py-12 md:py-16 px-4 sm:px-6 dark:border-border dark:bg-muted/20"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t("features.title") || "Explore Your Wellness"}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("features.subtitle") || "Discover personalized tools designed to help you regain inner peace and manage stress effectively."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              onClick={() => navigate(feature.path)}
              className="group flex cursor-pointer flex-col justify-between rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-md dark:border-border dark:bg-card/90 dark:shadow-black/20 dark:hover:border-primary/50 dark:hover:bg-card sm:p-8"
            >
              <div>
                <div
                  className={`mb-6 flex h-14 w-14 items-center justify-center rounded-full shadow-sm ring-1 ring-black/[0.06] transition-transform duration-300 group-hover:scale-105 dark:ring-white/12 ${feature.color} ${feature.hover}`}
                >
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {feature.description}
                </p>
              </div>
              <div className="flex items-center text-sm font-semibold text-secondary transition-colors duration-300 group-hover:text-primary dark:text-primary dark:group-hover:text-golden-yellow">
                {t("nav.explore") || "Explore"} 
                <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

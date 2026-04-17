import { useNavigate } from "react-router-dom";
import { ClipboardList, Leaf, Moon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Features = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const features = [
    {
      title: t("nav.checkIn") || "Check In",
      description: t("features.assessmentDesc") || "Take a personalized mental health assessment to understand your emotions.",
      icon: ClipboardList,
      path: "/assessment",
      color: "bg-deep-purple text-white",
      hover: "hover:bg-deep-purple/90"
    },
    {
      title: t("nav.mindfulness") || "Mindfulness",
      description: t("features.mindfulnessDesc") || "Explore guided breathing, grounding exercises, and meditation.",
      icon: Leaf,
      path: "/mindfulness",
      color: "bg-emerald-600 text-white",
      hover: "hover:bg-emerald-700"
    },
    {
      title: t("nav.sleep") || "Sleep",
      description: t("features.sleepDesc") || "Prepare for a restful night with relaxation and sleep tracking tools.",
      icon: Moon,
      path: "/sleep",
      color: "bg-indigo-600 text-white",
      hover: "hover:bg-indigo-700"
    }
  ];

  return (
    <section id="features" className="py-12 md:py-16 px-4 bg-off-white/50 border-t border-deep-purple/10">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal-gray mb-4">
            {t("features.title") || "Explore Your Wellness"}
          </h2>
          <p className="text-base sm:text-lg text-charcoal-gray/80 max-w-2xl mx-auto">
            {t("features.subtitle") || "Discover personalized tools designed to help you regain inner peace and manage stress effectively."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              onClick={() => navigate(feature.path)}
              className="group cursor-pointer rounded-2xl bg-white border border-deep-purple/10 shadow-lg p-6 sm:p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-6 shadow-md transition-transform duration-300 group-hover:scale-110 ${feature.color}`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-charcoal-gray mb-3">
                  {feature.title}
                </h3>
                <p className="text-charcoal-gray/80 leading-relaxed mb-6">
                  {feature.description}
                </p>
              </div>
              <div className="flex items-center text-sm font-semibold text-deep-purple group-hover:text-golden-yellow transition-colors duration-300">
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

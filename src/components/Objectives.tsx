import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Objectives = () => {
  const navigate = useNavigate();
  const objectives = [
    {
      number: 1,
      title: "Provide Empathetic Guidance",
      description: "Reduce stress, motivate students, and foster resilience through compassionate conversations.",
      circleColor: "bg-golden-yellow",
      textColor: "text-charcoal-gray",
    },
    {
      number: 2,
      title: "Minimize Hallucinations",
      description: "Grounded in verified knowledge to ensure responsible and beneficial interactions.",
      circleColor: "bg-golden-yellow",
      textColor: "text-charcoal-gray",
    },
    {
      number: 3,
      title: "Develop Safe AI Companion",
      description: "Using RAG technology for accurate, reliable, and therapeutically sound responses.",
      circleColor: "bg-golden-yellow",
      textColor: "text-charcoal-gray",
    },
    {
      number: 4,
      title: "Build Scalable Platform",
      description: "Designed for schools, universities, and communities to maximize positive impact.",
      circleColor: "bg-golden-yellow",
      textColor: "text-charcoal-gray",
    },
    {
      number: 5,
      title: "Encourage Healthy Habits",
      description: "Promote well-being while preventing over-reliance on AI, fostering independence.",
      circleColor: "bg-golden-yellow",
      textColor: "text-charcoal-gray",
    },
    {
      number: 6,
      title: "Ensure Privacy & Security",
      description: "Protect user data and maintain confidentiality while providing personalized support.",
      circleColor: "bg-golden-yellow",
      textColor: "text-charcoal-gray",
    },
  ];

  return (
    <section id="objectives" className="py-12 sm:py-16 md:py-20 px-4 bg-off-white">
      <div className="container mx-auto max-w-6xl">
        <div className="bg-deep-purple rounded-lg p-6 sm:p-8 lg:p-12 shadow-lg">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4">
              Our Core <span className="text-golden-yellow">Objectives</span>
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
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2">{objective.title}</h3>
                    <p className="text-sm sm:text-base text-white/80 leading-relaxed">{objective.description}</p>
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
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2">{objective.title}</h3>
                    <p className="text-sm sm:text-base text-white/80 leading-relaxed">{objective.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <Button size="lg" className="bg-golden-yellow text-charcoal-gray hover:bg-golden-yellow/90 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 active:scale-95 transition-transform" onClick={() => navigate('/chat')}>
              Experience HOPEr Today
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Objectives;

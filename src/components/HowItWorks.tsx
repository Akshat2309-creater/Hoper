import { Database, Search, Brain, Shield } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      icon: Database,
      title: "Verified Knowledge Base",
      description1: "Clinically verified mental health resources and trusted spiritual wisdom form our foundation.",
      description2: "Curated from peer-reviewed research, therapeutic practices, and centuries of spiritual guidance.",
    },
    {
      number: 2,
      icon: Search,
      title: "Semantic Retrieval",
      description1: "Pinecone vector database enables precise, context-aware information retrieval.",
      description2: "Advanced semantic search ensures the most relevant and helpful content for each query.",
    },
    {
      number: 3,
      icon: Brain,
      title: "AI Processing",
      description1: "Advanced AI architecture synthesizes verified information into empathetic responses.",
      description2: "Combines retrieval accuracy with generative empathy, minimizing harmful hallucinations.",
    },
    {
      number: 4,
      icon: Shield,
      title: "Safety Measures",
      description1: "Multiple layers of safety filters and clear disclaimers protect vulnerable users.",
      description2: "Built-in crisis detection, professional referral systems, and transparent limitations.",
    },
  ];

  return (
    <section id="how-it-works" className="py-12 sm:py-16 md:py-20 px-4 bg-off-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal-gray mb-4 sm:mb-6">
            How <span className="text-deep-purple">HOPEr</span> Works
          </h2>
          <p className="text-base sm:text-lg text-charcoal-gray max-w-4xl mx-auto px-4">
            Our methodology combines cutting-edge AI technology with clinically verified mental health resources to deliver safe, empathetic, and effective support.
          </p>
        </div>

        <div className="relative">
          {/* Steps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8 relative z-10">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="group text-center border-2 border-deep-purple rounded-lg p-4 sm:p-5 lg:p-6 bg-white hover:shadow-lg transition-shadow duration-300"
              >
                {/* Number Circle */}
                <div className="relative mb-4">
                  <div className="w-8 h-8 bg-golden-yellow rounded-full flex items-center justify-center mx-auto mb-4 z-20 relative">
                    <span className="text-charcoal-gray font-bold text-sm">{step.number}</span>
                  </div>
                  
                  {/* Icon Circle */}
                  <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-md border-2 border-deep-purple transition-colors duration-300 group-hover:bg-deep-purple">
                    <step.icon className="w-7 h-7 sm:w-8 sm:h-8 text-deep-purple transition-colors duration-300 group-hover:text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2 sm:space-y-3">
                  <h3 className="text-base sm:text-lg font-bold text-golden-yellow">{step.title}</h3>
                  <p className="text-xs sm:text-sm text-charcoal-gray leading-relaxed">{step.description1}</p>
                  <p className="text-xs sm:text-sm text-charcoal-gray leading-relaxed">{step.description2}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

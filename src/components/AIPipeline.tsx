import { useState } from "react";
import { X } from "lucide-react";

const AIPipeline = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const pipelineFeatures = [
    {
      title: "Retrieval-Augmented Generation (RAG)",
      description: "Combines real-time information retrieval with generative AI for accurate, contextual responses.",
    },
    {
      title: "Vector Database Technology",
      description: "Pinecone enables semantic understanding and precise retrieval of relevant mental health content.",
    },
    {
      title: "Safety-First Architecture",
      description: "Multiple safety layers, content filtering, and crisis detection ensure user protection.",
    },
  ];

  return (
    <section id="ai-pipeline" className="py-12 sm:py-16 md:py-20 px-4 bg-off-white">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
          {/* Left Side - Advanced AI Pipeline */}
          <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal-gray mb-6 sm:mb-8">
              Advanced AI <span className="text-deep-purple">Pipeline</span>
            </h2>
            
            <div className="space-y-5 sm:space-y-6">
              {pipelineFeatures.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3 sm:space-x-4 text-left">
                  <div className="w-3 h-3 bg-deep-purple rounded-sm flex-shrink-0 mt-2"></div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-deep-purple mb-1 sm:mb-2">{feature.title}</h3>
                    <p className="text-sm sm:text-base text-charcoal-gray leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

                 {/* Right Side - Architecture Diagram */}
                 <div 
                   className="bg-golden-yellow rounded-lg p-3 sm:p-4 shadow-lg flex items-center justify-center group cursor-pointer active:scale-95 transition-transform"
                   onClick={() => setIsFullscreen(true)}
                 >
                   <img 
                     src="/architecture.webp" 
                     alt="HOPEr Architecture" 
                     className="rounded-lg max-w-full h-auto transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl"
                   />
                 </div>
        </div>

        {/* Fullscreen Modal */}
        {isFullscreen && (
          <div 
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 animate-in fade-in duration-300"
            onClick={() => setIsFullscreen(false)}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors active:scale-95"
              onClick={() => setIsFullscreen(false)}
              aria-label="Close fullscreen"
            >
              <X className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </button>

            {/* Fullscreen Image */}
            <div className="max-w-6xl w-full max-h-[90vh] overflow-auto">
              <img 
                src="/architecture.webp" 
                alt="HOPEr Architecture - Fullscreen" 
                className="w-full h-auto rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AIPipeline;

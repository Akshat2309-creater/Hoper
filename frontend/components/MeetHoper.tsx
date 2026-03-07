import { Shield, Heart, Clock, BookOpen, Users, Brain } from "lucide-react";

const MeetHoper = () => {
  const features = [
    {
      icon: Shield,
      title: "Safe & Verified",
      description: "Built on clinically verified mental health resources and spiritual wisdom with proper safety filters.",
    },
    {
      icon: Heart,
      title: "Empathetic Support",
      description: "Provides non-judgmental, compassionate conversations designed to reduce stress and build resilience.",
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Always there when you need support, providing instant stress relief and motivational guidance.",
    },
    {
      icon: BookOpen,
      title: "Knowledge-Grounded",
      description: "All responses sourced from curated mental health texts, ensuring accuracy and therapeutic value.",
    },
    {
      icon: Users,
      title: "Professional Referrals",
      description: "Recognizes when professional help is needed and guides users to appropriate mental health resources.",
    },
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Uses advanced AI to provide personalized mental health guidance tailored to your unique needs and situation.",
    },
  ];

  return (
    <section id="meet-hoper" className="py-12 sm:py-16 md:py-20 px-4 bg-off-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-deep-purple mb-3 sm:mb-4">
            Meet <span className="text-deep-purple border-b-4 border-golden-yellow">HOPEr</span>
          </h2>
          <p className="text-xl sm:text-2xl font-bold text-golden-yellow mb-4 sm:mb-6">
            A Safe, Empathetic AI Companion
          </p>
          <p className="text-base sm:text-lg text-charcoal-gray max-w-4xl mx-auto px-4">
            HOPEr bridges the gap between student mental health needs and available support, providing immediate, safe, and therapeutically sound guidance whenever it's needed.
          </p>
        </div>

        {/* Video Section */}
        <div className="mb-10 sm:mb-12 md:mb-16">
          <div className="relative max-w-3xl mx-auto">
            <div className="relative rounded-lg sm:rounded-xl overflow-hidden shadow-lg sm:shadow-xl border border-deep-purple sm:border-2">
              <video 
                className="w-full h-auto"
                autoPlay
                muted
                loop
                playsInline
                controls
              >
                <source src="/HOPEr-video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
          <p className="text-center text-xs sm:text-sm md:text-base text-charcoal-gray/80 mt-4 sm:mt-6 px-4">
            Understanding the struggles students face and why we built an AI companion that truly cares
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group bg-white border-2 border-deep-purple rounded-lg p-5 sm:p-6 lg:p-8 shadow-md hover:bg-deep-purple hover:scale-105 transition-all duration-300 cursor-pointer active:scale-95">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-golden-yellow bg-golden-yellow flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <feature.icon className="w-7 h-7 sm:w-8 sm:h-8 text-deep-purple" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-charcoal-gray mb-3 sm:mb-4 text-center group-hover:text-white">{feature.title}</h3>
              <p className="text-sm sm:text-base text-charcoal-gray leading-relaxed text-center group-hover:text-white">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MeetHoper;

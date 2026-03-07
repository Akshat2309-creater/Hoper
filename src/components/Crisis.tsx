import { TrendingUp, Users, Heart, AlertTriangle } from "lucide-react";

const Crisis = () => {
  const statistics = [
    {
      icon: TrendingUp,
      number: "45%",
      description: "of young people report struggling with mental health",
      source: "Surgo Health, 2024",
    },
    {
      icon: Users,
      number: "1 in 7",
      description: "teenagers globally suffer from mental disorders",
      source: "WHO, 2024",
    },
    {
      icon: Heart,
      number: "40%",
      description: "of high schoolers experience persistent sadness",
      source: "CDC, 2023",
    },
    {
      icon: AlertTriangle,
      number: "53%",
      description: "of schools feel equipped to provide adequate support",
      source: "NCES, 2024",
    },
  ];

  const factors = [
    {
      title: "High-Pressure Environment",
      description: "Academic stress, exam anxiety, and future fears create persistent burnout and hopelessness among students worldwide.",
    },
    {
      title: "Support Gaps",
      description: "Stigma, cost, and limited resources restrict access to professional help, leaving students without critical support.",
    },
    {
      title: "Dangerous Alternatives",
      description: "Students turn to unsafe AI chatbots that lack clinical oversight and can provide harmful or misleading advice.",
    },
  ];

  const thoughtLeaders = [
    {
      image: "/tweet1.jpg",
      caption: "Leading voices warn that unchecked AI stress is amplifying anxiety among students — support systems must evolve.",
      attribution: "Tech Thought Leader • 2025",
    },
    {
      image: "/tweet2.jpg",
      caption: "Even top AI innovators are urging teams to prioritise mental health safeguards alongside product velocity.",
      attribution: "AI Conference Highlight • 2025",
    },
    {
      image: "/tweet3.jpg",
      caption: "Founders across the globe are opening up about burnout and seeking kinder tech cultures for their teams.",
      attribution: "Global Startup Forum • 2025",
    },
  ];

  return (
    <section id="crisis" className="py-12 sm:py-16 md:py-20 px-4 bg-off-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-deep-purple mb-3 sm:mb-4">
            The Mental Health <span className="text-golden-yellow">Crisis</span>
          </h2>
          <p className="text-lg sm:text-xl text-charcoal-gray max-w-3xl mx-auto px-4">
            Students are facing unprecedented mental health challenges, while support systems struggle to keep up.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-stretch">
          {/* Left Side - Crisis Section Image */}
          <div className="flex items-center justify-center">
            {/* Mobile Image */}
            <img src="/crisis-mobile.png" alt="Mental Health Crisis Illustration" className="md:hidden max-w-full h-auto border-4 sm:border-8 border-deep-purple rounded-lg" />
            {/* Desktop Image */}
            <img src="/crisis-section.png" alt="Mental Health Crisis Illustration" className="hidden md:block max-w-full h-auto border-4 sm:border-8 border-deep-purple rounded-lg" />
          </div>

          {/* Right Side - Statistics Cards in 2x2 Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {statistics.map((stat, index) => (
              <div key={index} className="group text-center border-2 border-deep-purple rounded-lg px-4 py-6 sm:px-4 sm:py-8 bg-white hover:bg-deep-purple hover:scale-105 transition-all duration-300 cursor-pointer active:scale-95">
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-golden-yellow bg-golden-yellow flex items-center justify-center">
                    <stat.icon className="w-6 h-6 sm:w-7 sm:h-7 text-deep-purple" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-golden-yellow group-hover:text-white">{stat.number}</div>
                  <p className="text-charcoal-gray text-xs sm:text-sm group-hover:text-white text-center leading-tight px-2">{stat.description}</p>
                  <p className="text-golden-yellow text-xs group-hover:text-white">{stat.source}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Explanatory Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 md:gap-8 mt-10 sm:mt-12 md:mt-16">
          {factors.map((factor, index) => (
            <div key={index} className="group bg-white border-2 border-red-600 rounded-lg p-5 sm:p-6 shadow-md hover:bg-red-600 hover:scale-105 transition-all duration-300 cursor-pointer active:scale-95">
              <h3 className="text-lg sm:text-xl font-bold text-red-600 mb-3 sm:mb-4 group-hover:text-white">{factor.title}</h3>
              <p className="text-sm sm:text-base text-charcoal-gray leading-relaxed group-hover:text-white">{factor.description}</p>
            </div>
          ))}
        </div>

        {/* Thought Leader Tweets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 md:gap-8 mt-8 sm:mt-10">
          {thoughtLeaders.map((item, index) => (
            <div
              key={index}
              className="bg-white border-2 border-black/70 rounded-lg shadow-xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl flex flex-col h-full"
            >
              <div className="relative pt-6 pb-2 flex items-center justify-center h-[360px] sm:h-[380px]">
                <div className="w-[95%] h-[92%] rounded-xl bg-white shadow-lg flex items-center justify-center">
                  <div className="w-[96%] h-[90%] sm:w-[94%] sm:h-[92%] rounded-lg overflow-hidden flex items-center justify-center">
                    <img
                      src={item.image}
                      alt="Tweet highlighting mental health conversations in tech"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </div>
              </div>
              <div className="px-4 sm:px-5 pb-5 pt-3 space-y-3 flex-1 flex flex-col">
                <div className="bg-off-white border border-red-100 rounded-2xl p-4 shadow-sm flex-1 flex flex-col">
                  <p className="text-sm sm:text-base text-charcoal-gray leading-relaxed">
                    {item.caption}
                  </p>
                  <p className="text-xs sm:text-sm text-red-500 font-medium uppercase tracking-wide mt-4">
                    {item.attribution}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Crisis;

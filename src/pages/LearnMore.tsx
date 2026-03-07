import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  TrendingUp, 
  Bot, 
  Heart, 
  Brain, 
  Shield, 
  Eye, 
  Sprout, 
  AlertCircle,
  Search,
  MessageCircle,
  CheckCircle,
  Smartphone,
  Globe,
  Activity,
  Languages,
  Sparkles
} from "lucide-react";

const LearnMore = () => {
  const navigate = useNavigate();

  const storyCards = [
    {
      icon: TrendingUp,
      title: "Rising Mental Health Crisis",
      description: "45% of young people report mental health struggles. 1 in 7 teens suffer from mental disorders.",
    },
    {
      icon: Bot,
      title: "Unsafe AI Chatbots",
      description: "Existing chatbots lack clinical grounding, produce unsafe responses, and can lead to emotional overdependence.",
    },
    {
      icon: Heart,
      title: "The Need for HOPEr",
      description: "A safe, empathetic AI companion providing verified responses with built-in ethical safeguards.",
    },
  ];

  const objectives = [
    "Provide a calm, minimal, and accessible 24/7 chatbot platform.",
    "Combine clinically verified and spiritual data using RAG (Retrieval-Augmented Generation).",
    "Ensure transparent, source-attributed responses to prevent misinformation.",
    "Include ethical safeguards such as disclaimers and crisis escalation.",
    "Promote accessibility and inclusivity by addressing stigma and resource gaps.",
  ];

  const howItWorksSteps = [
    {
      number: 1,
      icon: MessageCircle,
      title: "User Input",
      description: "A student types a question or shares a concern.",
    },
    {
      number: 2,
      icon: Search,
      title: "Knowledge Retrieval",
      description: "The system searches verified clinical and spiritual sources stored in a Vector Database (Pinecone).",
    },
    {
      number: 3,
      icon: Brain,
      title: "AI Processing",
      description: "A Generative Transformer synthesizes information into a warm, empathetic response.",
    },
    {
      number: 4,
      icon: Shield,
      title: "Safety Checks",
      description: "Output passes through filters that detect unsafe content or distress indicators.",
    },
  ];

  const techStack = [
    { component: "Frontend", description: "React.js, Tailwind CSS for responsive and calming UI" },
    { component: "Backend", description: "Python (FastAPI + LangChain) handling chat logic" },
    { component: "Database", description: "Pinecone Vector DB for semantic search" },
    { component: "AI Framework", description: "RAG + LLM (GPT-based) for contextual accuracy" },
    { component: "Deployment", description: "Hosted on Vercel/Netlify for accessibility" },
    { component: "Ethical Filters", description: "Integrated safety checks and redirection to helplines" },
  ];

  const safeguards = [
    {
      icon: Brain,
      title: "Empathetic Conversations",
      description: "Trained to listen and support, not diagnose.",
    },
    {
      icon: AlertCircle,
      title: "Not Medical Advice Disclaimer",
      description: "Every interaction includes clarity on AI's supportive, non-clinical role.",
    },
    {
      icon: Heart,
      title: "Crisis Redirection",
      description: "Detects distress cues and provides helpline contacts immediately.",
    },
    {
      icon: Eye,
      title: "Source Transparency",
      description: "Users can view where responses come from.",
    },
    {
      icon: Sprout,
      title: "Healthy Boundaries",
      description: "Designed to prevent emotional overdependence on AI.",
    },
  ];

  const timeline = [
    { weeks: "1–2", tasks: "Frontend basics (HTML, CSS, JS), Python fundamentals" },
    { weeks: "3–4", tasks: "React setup + FastAPI endpoints" },
    { weeks: "5–6", tasks: "API integration with Pinecone DB" },
    { weeks: "7–8", tasks: "Building the RAG pipeline" },
    { weeks: "9–10", tasks: "Adding safety filters and UI refinement" },
    { weeks: "11–12", tasks: "Testing, feedback, and deployment" },
  ];

  const researchCards = [
    {
      icon: MessageCircle,
      title: "Survey & Feedback",
      description: "Collected usability insights from student participants through testing.",
    },
    {
      icon: Shield,
      title: "Safety Evaluation",
      description: "Benchmarked against general chatbots to confirm safety improvements.",
    },
    {
      icon: CheckCircle,
      title: "Performance Metrics",
      description: "Validated accuracy, empathy, and reliability across 50+ queries.",
    },
  ];

  const outcomes = [
    "A fully functional web platform providing empathetic AI-based mental health support.",
    "Accurate and transparent responses sourced from verified data.",
    "Ethical, non-judgmental environment for students to express emotions.",
    "Scalable design for schools and universities.",
    "Improved student awareness and comfort around mental wellness.",
  ];

  const futureScope = [
    { icon: Smartphone, title: "Mobile App", description: "On-the-go access for students" },
    { icon: Globe, title: "University Integration", description: "Direct integration with university portals" },
    { icon: Activity, title: "Mindfulness Modules", description: "Guided meditation and wellness tracking" },
    { icon: Languages, title: "Multilingual Support", description: "Breaking language barriers" },
    { icon: Sparkles, title: "Emotion Tracking", description: "Personalized wellness insights" },
  ];

  const references = [
    "RAND Corporation – How Chatbots Respond to Suicide-Related Queries, 2025.",
    "Washington Post – Meta AI Chatbot Fails Safety Tests for Teens, 2025.",
    "arXiv – Technological Folie à Deux: Risks of AI-Induced Overdependence, 2025.",
    "WHO & CDC Reports, 2024–2025 – Youth Mental Health Studies.",
    "GlobeNewswire – Mental Health Chatbots Market Forecast 2025–2033.",
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section - About HOPEr */}
      <section className="bg-gradient-to-b from-soft-lavender to-off-white py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-4xl mx-auto">
            {/* Mission Statement */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-deep-purple">
                About HOPEr: Turning Stress into <span className="text-golden-yellow">Strength</span>
              </h1>
              <p className="text-lg text-charcoal-gray leading-relaxed">
                HOPEr is a safe and empathetic AI companion built to support students' mental well-being. 
                It blends clinically verified mental health knowledge with spiritual wisdom, offering round-the-clock 
                guidance and compassionate conversations — without replacing professional help.
              </p>
              <div className="space-y-3 text-charcoal-gray">
                <p className="flex items-center space-x-2">
                  <span className="text-golden-yellow">•</span>
                  <span>Provide immediate, judgment-free emotional support.</span>
                </p>
                <p className="flex items-center space-x-2">
                  <span className="text-golden-yellow">•</span>
                  <span>Encourage healthy coping strategies and personal growth.</span>
                </p>
                <p className="flex items-center space-x-2">
                  <span className="text-golden-yellow">•</span>
                  <span>Reduce dependence on unsafe, unregulated AI chatbots.</span>
                </p>
                <p className="flex items-center space-x-2">
                  <span className="text-golden-yellow">•</span>
                  <span>Redirect users to professional help when necessary.</span>
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" onClick={() => navigate('/chat')}>
                  Try HOPEr
                </Button>
                <Button size="lg" variant="outline" className="border-2 border-deep-purple">
                  Explore Technology
                </Button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* The Story Behind HOPEr */}
      <section className="py-20 px-4 bg-soft-lavender/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-deep-purple mb-4">
              The Story Behind <span className="text-golden-yellow">HOPEr</span>
            </h2>
            <p className="text-lg text-charcoal-gray max-w-3xl mx-auto">
              Understanding the crisis that inspired our mission
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {storyCards.map((card, index) => (
              <div 
                key={index} 
                className="bg-white border-2 border-deep-purple rounded-lg p-6 lg:p-8 shadow-md hover:bg-deep-purple hover:scale-105 transition-all duration-300 cursor-pointer group"
              >
                <div className="w-16 h-16 bg-golden-yellow rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-white transition-colors duration-300">
                  <card.icon className="w-8 h-8 text-deep-purple" />
                </div>
                <h3 className="text-xl font-bold text-deep-purple mb-4 text-center group-hover:text-white transition-colors duration-300">
                  {card.title}
                </h3>
                <p className="text-charcoal-gray text-center leading-relaxed group-hover:text-white transition-colors duration-300">
                  {card.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-white border-2 border-golden-yellow rounded-lg p-8">
            <h3 className="text-2xl font-bold text-deep-purple mb-4">The Challenge</h3>
            <p className="text-charcoal-gray leading-relaxed mb-6">
              Today's students face increasing levels of academic pressure, exam anxiety, and emotional burnout. 
              According to WHO and CDC (2024–2025):
            </p>
            <ul className="space-y-2 text-charcoal-gray ml-6">
              <li className="flex items-start">
                <span className="text-golden-yellow mr-2">•</span>
                <span>45% of young people report mental health struggles.</span>
              </li>
              <li className="flex items-start">
                <span className="text-golden-yellow mr-2">•</span>
                <span>1 in 7 teens suffer from mental disorders.</span>
              </li>
              <li className="flex items-start">
                <span className="text-golden-yellow mr-2">•</span>
                <span>40% of high schoolers experience persistent sadness or hopelessness.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Mission and Objectives */}
      <section className="py-20 px-4 bg-off-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-deep-purple mb-4">
              Our Mission and Core <span className="text-golden-yellow">Objectives</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
            {/* Left - Mission */}
            <div className="bg-deep-purple rounded-lg p-8 lg:p-10 text-white flex flex-col justify-center">
              <h3 className="text-2xl font-bold mb-6 text-golden-yellow">Mission Statement</h3>
              <p className="text-lg leading-relaxed">
                To build a responsible, inclusive, and safe AI system that promotes mental well-being and 
                empowers students to face stress with strength and hope.
              </p>
            </div>

            {/* Right - Objectives */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-deep-purple mb-6">Objectives</h3>
              {objectives.map((objective, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-golden-yellow rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-deep-purple font-bold">{index + 1}</span>
                  </div>
                  <p className="text-charcoal-gray leading-relaxed">{objective}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How HOPEr Works */}
      <section className="py-20 px-4 bg-soft-lavender/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-deep-purple mb-4">
              How <span className="text-golden-yellow">HOPEr</span> Works
            </h2>
            <p className="text-lg text-charcoal-gray max-w-3xl mx-auto">
              Using Retrieval-Augmented Generation (RAG) pipeline — ensuring every response is accurate, safe, and empathetic.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorksSteps.map((step) => (
              <div 
                key={step.number} 
                className="bg-white border-2 border-deep-purple rounded-lg p-6 text-center relative hover:bg-deep-purple hover:scale-105 transition-all duration-300 cursor-pointer group"
              >
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-golden-yellow rounded-full flex items-center justify-center">
                  <span className="text-deep-purple font-bold text-sm">{step.number}</span>
                </div>
                <div className="w-16 h-16 bg-deep-purple rounded-full flex items-center justify-center mx-auto mb-4 mt-4 group-hover:bg-golden-yellow transition-colors duration-300">
                  <step.icon className="w-8 h-8 text-golden-yellow group-hover:text-deep-purple transition-colors duration-300" />
                </div>
                <h3 className="text-lg font-bold text-deep-purple mb-3 group-hover:text-white transition-colors duration-300">{step.title}</h3>
                <p className="text-sm text-charcoal-gray leading-relaxed group-hover:text-white transition-colors duration-300">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button size="lg" onClick={() => navigate('/chat')}>
              Experience the Process
            </Button>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 px-4 bg-off-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-deep-purple mb-4">
              Our <span className="text-golden-yellow">Technology</span> Stack
            </h2>
          </div>

          <div className="bg-white border-2 border-deep-purple rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-deep-purple text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-lg font-bold">Component</th>
                    <th className="px-6 py-4 text-left text-lg font-bold">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {techStack.map((tech, index) => (
                    <tr 
                      key={index} 
                      className={index % 2 === 0 ? "bg-off-white" : "bg-white"}
                    >
                      <td className="px-6 py-4 font-bold text-deep-purple">{tech.component}</td>
                      <td className="px-6 py-4 text-charcoal-gray">{tech.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-12 bg-soft-lavender/50 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-deep-purple mb-4 text-center">
              The Technology Behind HOPEr
            </h3>
            <p className="text-charcoal-gray leading-relaxed text-center max-w-4xl mx-auto">
              HOPEr uses a RAG Pipeline combining Retrieval and Generation to provide responses grounded in verified knowledge. 
              The Pinecone Vector Database enables semantic search, while FastAPI and React ensure a smooth, 
              responsive user experience with built-in ethical safeguards.
            </p>
          </div>
        </div>
      </section>

      {/* Ethical Safeguards */}
      <section className="py-20 px-4 bg-deep-purple">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Ethical Safeguards & <span className="text-golden-yellow">Safety Features</span>
            </h2>
            <p className="text-lg text-white/90 max-w-3xl mx-auto">
              HOPEr follows a responsible AI framework built on safety, empathy, and transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {safeguards.map((safeguard, index) => (
              <div 
                key={index} 
                className="bg-white/10 backdrop-blur-sm border-2 border-golden-yellow rounded-lg p-6"
              >
                <div className="w-12 h-12 bg-golden-yellow rounded-full flex items-center justify-center mb-4">
                  <safeguard.icon className="w-6 h-6 text-deep-purple" />
                </div>
                <h3 className="text-xl font-bold text-golden-yellow mb-3">{safeguard.title}</h3>
                <p className="text-white/90 leading-relaxed">{safeguard.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-8 border-2 border-golden-yellow">
            <p className="text-lg text-white leading-relaxed">
              "HOPEr follows responsible AI principles — prioritizing empathy, accuracy, and ethical integrity."
            </p>
          </div>
        </div>
      </section>

      {/* Development Timeline */}
      <section className="py-20 px-4 bg-off-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-deep-purple mb-4">
              Development <span className="text-golden-yellow">Timeline</span>
            </h2>
          </div>

          <div className="space-y-6">
            {timeline.map((phase, index) => (
              <div 
                key={index} 
                className="bg-white border-2 border-deep-purple rounded-lg p-6 flex items-center space-x-6 hover:shadow-lg transition-shadow"
              >
                <div className="w-24 h-24 bg-golden-yellow rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-deep-purple">{phase.weeks}</span>
                </div>
                <div className="flex-1">
                  <p className="text-lg text-charcoal-gray leading-relaxed">{phase.tasks}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Research & Validation */}
      <section className="py-20 px-4 bg-soft-lavender/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-deep-purple mb-4">
              Research & <span className="text-golden-yellow">Validation</span>
            </h2>
            <p className="text-lg text-charcoal-gray max-w-3xl mx-auto">
              HOPEr was built through analytical modeling, testing, and user validation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
            {researchCards.map((card, index) => (
              <div 
                key={index} 
                className="bg-white border-2 border-deep-purple rounded-lg p-6 lg:p-8 text-center hover:bg-deep-purple hover:scale-105 transition-all duration-300 cursor-pointer group"
              >
                <div className="w-16 h-16 bg-golden-yellow rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-white transition-colors duration-300">
                  <card.icon className="w-8 h-8 text-deep-purple" />
                </div>
                <h3 className="text-xl font-bold text-deep-purple mb-4 group-hover:text-white transition-colors duration-300">{card.title}</h3>
                <p className="text-charcoal-gray leading-relaxed group-hover:text-white transition-colors duration-300">{card.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-white border-2 border-golden-yellow rounded-lg p-8">
            <h3 className="text-2xl font-bold text-deep-purple mb-6">Methodology Overview</h3>
            <div className="space-y-3 text-charcoal-gray">
              <p className="flex items-center space-x-2">
                <span className="text-golden-yellow">•</span>
                <span><strong>Data Collection:</strong> Built a verified knowledge base from mental health and spiritual texts.</span>
              </p>
              <p className="flex items-center space-x-2">
                <span className="text-golden-yellow">•</span>
                <span><strong>RAG Integration:</strong> Used semantic retrieval to connect user queries with trusted content.</span>
              </p>
              <p className="flex items-center space-x-2">
                <span className="text-golden-yellow">•</span>
                <span><strong>Simulation:</strong> Tested chatbot empathy and safety across 50+ student queries.</span>
              </p>
              <p className="flex items-center space-x-2">
                <span className="text-golden-yellow">•</span>
                <span><strong>Survey Feedback:</strong> Collected usability insights from student participants.</span>
              </p>
              <p className="flex items-center space-x-2">
                <span className="text-golden-yellow">•</span>
                <span><strong>Validation:</strong> Benchmarked against general chatbots to confirm safety and empathy improvements.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Expected Outcomes & Future Scope */}
      <section className="py-20 px-4 bg-off-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-deep-purple mb-4">
              Expected Outcomes & <span className="text-golden-yellow">Future Scope</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left - Outcomes */}
            <div className="bg-white border-2 border-deep-purple rounded-lg p-8">
              <h3 className="text-2xl font-bold text-deep-purple mb-6">Current Deliverables</h3>
              <div className="space-y-4">
                {outcomes.map((outcome, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-golden-yellow flex-shrink-0 mt-1" />
                    <p className="text-charcoal-gray leading-relaxed">{outcome}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Future Scope */}
            <div className="bg-deep-purple rounded-lg p-8">
              <h3 className="text-2xl font-bold text-golden-yellow mb-6">What's Next?</h3>
              <div className="space-y-4">
                {futureScope.map((item, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-golden-yellow rounded-full flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-deep-purple" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1">{item.title}</h4>
                      <p className="text-white/80 text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* References */}
      <section className="py-20 px-4 bg-off-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-deep-purple mb-4">
              <span className="text-golden-yellow">References</span> & Acknowledgments
            </h2>
          </div>

          <div className="bg-white border-2 border-deep-purple rounded-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {references.map((reference, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <span className="text-golden-yellow font-bold">{index + 1}.</span>
                  <p className="text-charcoal-gray text-sm leading-relaxed">{reference}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t-2 border-deep-purple/20 text-center">
              <p className="text-charcoal-gray">
                This project is developed under the <strong>Bachelor of Technology program, AKTU</strong> (2025–2026 session).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-deep-purple">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Explore <span className="text-golden-yellow">HOPEr?</span>
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Experience a compassionate AI built to guide you through life's toughest moments — 
            safely, ethically, and with care.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="text-lg px-8 bg-golden-yellow text-deep-purple hover:bg-golden-yellow/90"
              onClick={() => navigate('/chat')}
            >
              Try HOPEr
            </Button>
            <Button 
              size="lg" 
              className="text-lg px-8 bg-white text-deep-purple hover:bg-white/90"
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LearnMore;


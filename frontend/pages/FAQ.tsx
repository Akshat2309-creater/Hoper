import { useState } from "react";
import { ChevronDown, Mail, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const FAQ = () => {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [showContactDialog, setShowContactDialog] = useState(false);

  const faqs = [
    {
      q: "What is HOPEr?",
      a: "HOPEr is a web-based AI companion designed to support students' mental well-being through safe, empathetic, and verified guidance. It combines clinically grounded knowledge with spiritual insights to help users manage stress, anxiety, and emotional challenges — 24/7."
    },
    {
      q: "Is HOPEr a replacement for therapy or professional counseling?",
      a: "No. HOPEr is not a medical or therapeutic substitute. It provides emotional support and self-reflection tools but always encourages users to seek licensed professional help when needed. Every interaction includes clear disclaimers like \"This is not medical advice.\""
    },
    {
      q: "How does HOPEr ensure that responses are safe and accurate?",
      a: "HOPEr uses a Retrieval-Augmented Generation (RAG) pipeline. This means that all responses are generated from verified clinical and spiritual sources — not random internet data. The system also includes safety filters and an ethical review mechanism to prevent misinformation or unsafe advice."
    },
    {
      q: "What kind of content or knowledge does HOPEr use?",
      a: "The knowledge base includes: Clinically verified mental health resources, Spiritual and mindfulness texts, and Safe coping strategies and emotional wellness practices. This blend ensures that users receive both evidence-based and holistic support."
    },
    {
      q: "Can HOPEr detect if someone is in distress or danger?",
      a: "Yes. HOPEr includes a risk detection module that identifies distress signals in user input (e.g., suicidal ideation, self-harm). When such cues are detected, it redirects the user to professional helplines or emergency resources immediately — ensuring responsible and ethical AI behavior."
    },
    {
      q: "How does HOPEr protect my privacy?",
      a: "HOPEr prioritizes privacy and confidentiality. Conversations are not stored or shared, and no personal information is required to use the chatbot. The system complies with ethical data handling standards and is designed for anonymous, judgment-free interaction."
    },
    {
      q: "What technologies power HOPEr?",
      a: "HOPEr is built using: Frontend (React.js, Tailwind CSS), Backend (FastAPI with Python), Database (Pinecone Vector DB), and AI Pipeline (RAG + Generative Transformer). These technologies together create a seamless, responsive, and safe AI experience."
    },
    {
      q: "How does HOPEr differ from other AI chatbots like ChatGPT or Wysa?",
      a: "Unlike general-purpose chatbots: HOPEr is specifically designed for mental well-being, uses verified, clinically sourced data — not open web data, has built-in ethical safeguards to prevent unsafe advice or unhealthy emotional attachment. HOPEr's focus is on hope, empathy, and emotional safety."
    },
    {
      q: "Who created HOPEr?",
      a: "HOPEr was created by: Akshat Verma (Lead Developer - Frontend & UI/UX), Anmol Pandey (AI Engineer - RAG & Safety Pipeline), and Akshat R. Tripathi (Backend Developer - FastAPI & Database Integration). Under the mentorship of Ms. Pragati Upadhyay, Assistant Professor at AKTU."
    },
    {
      q: "What's next for HOPEr?",
      a: "The team is working on: A mobile version for easier access, University portal integration, Mindfulness and meditation modules, and Multilingual support. The goal is to make HOPEr accessible to every student who needs a moment of calm and hope."
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-soft-lavender to-off-white py-12 sm:py-16 px-4">
        <div className="container mx-auto max-w-5xl text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-deep-purple mb-3 sm:mb-4 px-4">
            Frequently Asked <span className="text-golden-yellow">Questions</span>
          </h1>
          <p className="text-base sm:text-lg text-charcoal-gray max-w-3xl mx-auto px-4">
            Everything you need to know about HOPEr — your safe, empathetic AI companion
          </p>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="bg-off-white py-12 sm:py-16 md:py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`group border-2 rounded-xl mb-4 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden ${
                openIndex === index 
                  ? 'border-golden-yellow bg-gradient-to-r from-deep-purple to-deep-purple/90' 
                  : 'border-deep-purple bg-white hover:border-golden-yellow'
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center gap-3 sm:gap-4 text-left p-4 sm:p-6 transition-all duration-300 active:scale-[0.99]"
              >
                {/* Number Badge */}
                <div className={`flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-base sm:text-lg transition-colors duration-300 ${
                  openIndex === index
                    ? 'bg-golden-yellow text-deep-purple'
                    : 'bg-deep-purple text-white group-hover:bg-golden-yellow group-hover:text-deep-purple'
                }`}>
                  {index + 1}
                </div>
                
                {/* Question */}
                <h3 className={`flex-1 text-base sm:text-lg font-bold pr-2 sm:pr-4 transition-colors duration-300 ${
                  openIndex === index
                    ? 'text-white'
                    : 'text-deep-purple group-hover:text-golden-yellow'
                }`}>
                  {faq.q}
                </h3>
                
                {/* Chevron Icon */}
                <div className={`flex-shrink-0 transition-all duration-300 ${
                  openIndex === index ? 'rotate-180' : 'rotate-0'
                }`}>
                  <ChevronDown className={`w-6 h-6 sm:w-7 sm:h-7 transition-colors duration-300 ${
                    openIndex === index
                      ? 'text-golden-yellow'
                      : 'text-deep-purple group-hover:text-golden-yellow'
                  }`} />
                </div>
              </button>
              
              {/* Answer - with smooth slide animation */}
              <div className={`transition-all duration-300 ease-in-out ${
                openIndex === index 
                  ? 'max-h-96 opacity-100' 
                  : 'max-h-0 opacity-0'
              }`}>
                <div className={`px-4 sm:px-6 pb-4 sm:pb-6 pl-14 sm:pl-20 pt-0 ${
                  openIndex === index ? 'text-white/95' : 'text-charcoal-gray'
                }`}>
                  <p className="leading-relaxed text-sm sm:text-base">
                    {faq.a}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-off-white pb-12 sm:pb-16 md:pb-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="bg-deep-purple text-white text-center py-8 sm:py-10 md:py-12 px-5 sm:px-8 rounded-2xl sm:rounded-3xl shadow-lg">
            <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Still Have Questions?</h3>
            <p className="max-w-2xl mx-auto mb-6 sm:mb-8 text-base sm:text-lg text-white/90 leading-relaxed">
              We'd love to hear from you. Reach out to our team to learn more about HOPEr or collaborate on expanding mental well-being technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-golden-yellow text-charcoal-gray hover:bg-golden-yellow/90 font-semibold text-base sm:text-lg px-6 sm:px-8 active:scale-95 transition-transform w-full sm:w-auto"
                onClick={() => setShowContactDialog(true)}
              >
                Contact Us
              </Button>
              <Button 
                size="lg"
                className="bg-white text-deep-purple hover:bg-white/90 font-semibold text-base sm:text-lg px-6 sm:px-8 active:scale-95 transition-transform w-full sm:w-auto"
                onClick={() => navigate('/chat')}
              >
                Try HOPEr Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Contact Dialog */}
      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent className="sm:max-w-md mx-4">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl font-bold text-deep-purple">Contact Us</DialogTitle>
            <DialogDescription className="text-sm sm:text-base text-charcoal-gray">
              Choose how you'd like to get in touch with us
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 sm:gap-4 py-3 sm:py-4">
            <a
              href="mailto:hoperthechatbot@gmail.com"
              className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-soft-lavender rounded-lg hover:bg-soft-lavender/80 transition-all border-2 border-deep-purple/20 hover:border-golden-yellow active:scale-95"
            >
              <div className="bg-deep-purple p-2 sm:p-3 rounded-full">
                <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-deep-purple text-sm sm:text-base">Email Us</h4>
                <p className="text-xs sm:text-sm text-charcoal-gray truncate">hoperthechatbot@gmail.com</p>
              </div>
            </a>
            <a
              href="tel:+919910498377"
              className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-soft-lavender rounded-lg hover:bg-soft-lavender/80 transition-all border-2 border-deep-purple/20 hover:border-golden-yellow active:scale-95"
            >
              <div className="bg-golden-yellow p-2 sm:p-3 rounded-full">
                <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-deep-purple" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-deep-purple text-sm sm:text-base">Call Us</h4>
                <p className="text-xs sm:text-sm text-charcoal-gray">+91 99104 98377</p>
              </div>
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FAQ;


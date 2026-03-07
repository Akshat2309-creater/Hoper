import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MoodCheckSection from "@/components/MoodCheckSection";
import Crisis from "@/components/Crisis";
import MeetHoper from "@/components/MeetHoper";
import Objectives from "@/components/Objectives";
import HowItWorks from "@/components/HowItWorks";
import AIPipeline from "@/components/AIPipeline";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <MoodCheckSection />
        <Crisis />
        <MeetHoper />
        <Objectives />
        <HowItWorks />
        <AIPipeline />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

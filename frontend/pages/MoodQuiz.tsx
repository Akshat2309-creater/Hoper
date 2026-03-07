import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MoodQuiz from "@/components/mood-quiz/MoodQuiz";

const MoodQuizPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-off-white">
      <Navbar />
      <main className="flex-1">
        <MoodQuiz />
      </main>
      <Footer />
    </div>
  );
};

export default MoodQuizPage;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Index from "./pages/Index";
import ChatPage from "./pages/ChatPage";
import LearnMore from "./pages/LearnMore";
import FAQ from "./pages/FAQ";
import MoodQuizPage from "./pages/MoodQuiz";
import AssessmentPage from "./pages/AssessmentPage";
import MindfulnessPage from "./pages/MindfulnessPage";
import SleepPage from "./pages/SleepPage";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import ThrowbacksPage from "./pages/ThrowbacksPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="hoper-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <LanguageProvider>
          <AuthProvider>
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="/" element={<Index />} />
                  <Route path="/chat" element={<ChatPage />} />
                  <Route path="/learn-more" element={<LearnMore />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/mood-check" element={<MoodQuizPage />} />
                  <Route path="/assessment" element={<AssessmentPage />} />
                  <Route path="/mindfulness" element={<MindfulnessPage />} />
                  <Route path="/sleep" element={<SleepPage />} />
                  <Route path="/throwbacks" element={<ThrowbacksPage />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </LanguageProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

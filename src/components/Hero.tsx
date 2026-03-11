import { FormEvent, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Send } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ChatLaunchCardProps {
  className?: string;
  starterMessage: string;
  setStarterMessage: (value: string) => void;
  onStartChat: (event: FormEvent<HTMLFormElement>) => void;
}

const ChatLaunchCard = ({
  className = "",
  starterMessage,
  setStarterMessage,
  onStartChat,
}: ChatLaunchCardProps) => {
  const typewriterPhrases = useMemo(
    () => [
      "What's on your mind?",
      "How are you feeling today?",
      "Is there something you'd like to share?",
      "What's on your mind?",
    ],
    []
  );
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  useEffect(() => {
    const finalIndex = typewriterPhrases.length - 1;
    const finalPhrase = typewriterPhrases[finalIndex];
    if (starterMessage.length > 0 && !isAnimationComplete) {
      setIsDeleting(false);
      setPhraseIndex(finalIndex);
      setCharIndex(finalPhrase.length);
      setIsAnimationComplete(true);
      return;
    }

    if (isAnimationComplete) return;

    const currentPhrase = typewriterPhrases[phraseIndex];
    let timeout: ReturnType<typeof setTimeout> | undefined;

    if (!isDeleting) {
      if (charIndex < currentPhrase.length) {
        const delay = phraseIndex === 0 && charIndex === 0 ? 200 : 55;
        timeout = setTimeout(() => setCharIndex(prev => prev + 1), delay);
      } else if (phraseIndex === typewriterPhrases.length - 1) {
        timeout = setTimeout(() => setIsAnimationComplete(true), 650);
      } else {
        timeout = setTimeout(() => setIsDeleting(true), 900);
      }
    } else if (charIndex > 0) {
      timeout = setTimeout(() => setCharIndex(prev => prev - 1), 30);
    } else {
      setIsDeleting(false);
      setPhraseIndex(prev => Math.min(prev + 1, typewriterPhrases.length - 1));
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [charIndex, isDeleting, phraseIndex, typewriterPhrases, isAnimationComplete, starterMessage]);

  const labelText = isAnimationComplete
    ? typewriterPhrases[typewriterPhrases.length - 1]
    : typewriterPhrases[phraseIndex].slice(0, Math.min(charIndex, typewriterPhrases[phraseIndex].length));

  return (
    <div className={cn("relative w-full max-w-[360px]", className)}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-br from-soft-lavender/60 via-white to-mint-green/50 opacity-90 blur-2xl"
      />
      <div className="relative overflow-hidden rounded-[24px] border border-deep-purple/20 bg-white/90 backdrop-blur-xl shadow-[0_25px_60px_rgba(108,74,182,0.18)]">
        <div className="relative space-y-6 p-6 sm:p-8">
          <div className="flex flex-col items-center text-center">
            <img
              src="/logo.svg"
              alt="HOPEr Logo"
              className="h-52 w-auto sm:h-60"
              style={{ animation: "float 3s ease-in-out infinite" }}
            />
          </div>
          <form onSubmit={onStartChat} className="space-y-3">
            <div className="space-y-3">
              <label
                htmlFor="hero-chat-starter"
                className="flex min-h-[1.5rem] items-center justify-center text-center text-sm font-medium text-charcoal-gray"
                aria-live="polite"
              >
                {labelText}
              </label>
              <div className="relative">
                <Input
                  id="hero-chat-starter"
                  value={starterMessage}
                  onChange={(event) => setStarterMessage(event.target.value)}
                  placeholder="e.g. I'm feeling overwhelmed with exams..."
                  className="h-12 rounded-xl border border-deep-purple/30 bg-soft-lavender/40 pr-14 text-charcoal-gray placeholder:text-charcoal-gray/60 focus-visible:border-deep-purple/70 focus-visible:ring-2 focus-visible:ring-deep-purple transition-all"
                />
                <Button
                  type="submit"
                  className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg bg-deep-purple text-white hover:bg-deep-purple/90"
                  disabled={!starterMessage.trim()}
                >
                  <span className="sr-only">Start chat</span>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const SUPPORT_URL = "http://localhost:8504/";

const Hero = () => {
  const navigate = useNavigate();
  const [starterMessage, setStarterMessage] = useState("");

  const goToSupport = () => {
    window.open(SUPPORT_URL, "_blank", "noopener,noreferrer");
  };

  const handleStartChat = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedMessage = starterMessage.trim();

    if (trimmedMessage) {
      navigate("/chat", { state: { initialMessage: trimmedMessage } });
      setStarterMessage("");
      return;
    }

    navigate("/chat");
  };
  return (
    <section className="bg-gradient-to-b from-lavender to-background py-12 sm:py-16 md:py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="space-y-10 sm:space-y-12 lg:space-y-0">
          {/* Mobile Layout - Logo Above CTA Buttons */}
          <div className="lg:hidden space-y-6 sm:space-y-8">
            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground text-center px-4">
              Turning moments of stress into steps of hope
              <span className="text-primary"> Matters</span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground text-center px-4">
              A safe, empathetic AI companion providing 24/7 mental health support for students through clinically verified guidance and compassionate conversations.
            </p>

            {/* Chat Launch Card */}
            <div className="flex justify-center px-2">
              <ChatLaunchCard
                starterMessage={starterMessage}
                setStarterMessage={setStarterMessage}
                onStartChat={handleStartChat}
              />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
              <Button 
                size="lg" 
                className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 w-full sm:w-auto active:scale-95 transition-transform" 
                onClick={goToSupport}
              >
                Get Support Now
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 border-2 w-full sm:w-auto active:scale-95 transition-transform" 
                onClick={() => navigate('/learn-more')}
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Desktop Layout - Side by Side */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-10 xl:gap-12 items-center">
            {/* Left Side - Content */}
            <div className="space-y-6 lg:space-y-8">
              {/* Main Heading */}
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground">
                Turning moments of stress into steps of hope
                <span className="text-primary"> Matters</span>
              </h1>

              {/* Subheading */}
              <p className="text-lg lg:text-xl text-muted-foreground">
                A safe, empathetic AI companion providing 24/7 mental health support for students through clinically verified guidance and compassionate conversations.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-6 active:scale-95 transition-transform" 
                  onClick={goToSupport}
                >
                  Get Support Now
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-8 py-6 border-2 active:scale-95 transition-transform" 
                  onClick={() => navigate('/learn-more')}
                >
                  Learn More
                </Button>
              </div>
            </div>

            {/* Right Side - Logo */}
            <div className="flex justify-center lg:justify-end">
              <ChatLaunchCard
                className="max-w-[340px]"
                starterMessage={starterMessage}
                setStarterMessage={setStarterMessage}
                onStartChat={handleStartChat}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

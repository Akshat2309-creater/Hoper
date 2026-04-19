import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Chat from "@/components/Chat";
import { useLanguage } from "@/contexts/LanguageContext";

const SPLASH_MS = 2400;

const EASE_CURVE = "cubic-bezier(0.33, 1, 0.32, 1)";

function SplashLoaderRing({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <div
      className={`motion-reduce:animate-none rounded-full border-2 border-secondary-foreground/18 border-t-primary animate-spin ${className}`}
      style={{ animationDuration: "0.88s" }}
      aria-hidden
    />
  );
}

const ChatPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const [splash, setSplash] = useState(true);

  useEffect(() => {
    const removeSplash = window.setTimeout(() => {
      setSplash(false);
    }, SPLASH_MS);

    return () => {
      window.clearTimeout(removeSplash);
    };
  }, []);

  const initialState = (location.state as { initialMessage?: string } | null) ?? null;
  const initialMessage = initialState?.initialMessage;

  const handleClose = () => {
    navigate("/");
  };

  return (
    <div className="relative h-dvh overflow-hidden bg-background">
      <div
        className={`h-full min-h-0 transition-[opacity] duration-700 ease-out ${
          splash ? "pointer-events-none opacity-0 select-none" : "opacity-100"
        }`}
        style={{ transitionTimingFunction: EASE_CURVE }}
        aria-hidden={splash}
      >
        <Chat isOpen={true} onClose={handleClose} initialMessage={initialMessage} />
      </div>

      {splash && (
        <div
          className="absolute inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
          aria-busy="true"
          aria-live="polite"
        >
          {/* Gradient uses only design tokens from index.css (lavender → background → mint → sky) */}
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(148deg,hsl(var(--lavender))_0%,hsl(var(--background))_36%,hsl(var(--mint))_68%,hsl(var(--sky))_100%)]"
            aria-hidden
          />

          <div className="relative z-10 flex flex-col items-center gap-6 px-8 text-center">
            <img src="/logo.svg" alt="" className="h-20 w-auto sm:h-24" />
            <div className="flex flex-col items-center gap-3">
              <SplashLoaderRing />
              <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-secondary-foreground/55">
                HOPEr
              </span>
              <span className="text-xs font-medium text-secondary-foreground/65">
                {t("chat.splashPreparing")}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;

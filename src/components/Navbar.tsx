import { useState, useEffect, useRef } from "react";
import { Menu, X, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface NavbarProps {
  onOpenChat?: () => void;
}

const SUPPORT_URL = "http://localhost:8504/";

const Navbar = ({ onOpenChat }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  const scrollToSection = (href: string) => {
    // Check if we're on the homepage
    if (window.location.pathname === "/") {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // Navigate to homepage first, then scroll
      navigate("/");
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
    setMobileMenuOpen(false); // Close mobile menu after clicking
  };

  const scrollToTop = () => {
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
    setMobileMenuOpen(false); // Close mobile menu after clicking
  };

  const handleGetStarted = () => {
    navigate("/chat");
    setMobileMenuOpen(false);
  };

  const openSupportChat = () => {
    window.open(SUPPORT_URL, "_blank", "noopener,noreferrer");
  };

  const navLinks = [
    { name: "About", href: "#meet-hoper" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Check In", href: "/assessment", isRoute: true },
    { name: "Mindfulness", href: "/mindfulness", isRoute: true },
    { name: "Sleep", href: "/sleep", isRoute: true },
    { name: "FAQ", href: "/faq", isRoute: true },
    { name: "Contact", href: "#contact" },
  ];

  const { language, setLanguage, t } = useLanguage();
  const languageLabels: Record<string, string> = {
    en: "English",
    hi: "हिन्दी",
    es: "Español",
    fr: "Français",
    ar: "العربية",
  };

  const toggleLanguage = () => {
    const languages: Array<"en" | "hi" | "es" | "fr" | "ar"> = [
      "en",
      "hi",
      "es",
      "fr",
      "ar",
    ];
    const currentIndex = languages.indexOf(language as any);
    const nextIndex = (currentIndex + 1) % languages.length;
    setLanguage(languages[nextIndex]);
  };

  return (
    <>
      <nav className="bg-secondary sticky top-0 z-50 shadow-md px-3 sm:px-4 w-full">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <div className="flex items-center">
              <button
                onClick={scrollToTop}
                className="flex items-center gap-1.5 sm:gap-2 text-secondary-foreground font-bold text-lg sm:text-xl hover:text-primary transition-colors duration-300 active:scale-95"
              >
                <img
                  src="/favicon-icon.svg"
                  alt="HOPEr Logo"
                  className="h-8 w-8 sm:h-10 sm:w-10"
                />
                HOPEr
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() =>
                    link.isRoute
                      ? navigate(link.href)
                      : scrollToSection(link.href)
                  }
                  className="text-secondary-foreground hover:text-primary transition-colors duration-300 font-medium text-sm lg:text-base active:scale-95"
                >
                  {link.name}
                </button>
              ))}
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1 text-secondary-foreground hover:text-primary transition-colors duration-300 font-medium text-sm lg:text-base active:scale-95"
                title="Switch language"
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {languageLabels[language]}
                </span>
              </button>
              <button
                onClick={openSupportChat}
                className="text-secondary-foreground hover:text-primary transition-colors duration-300 font-medium text-sm lg:text-base active:scale-95"
              >
                Chat
              </button>
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:block">
              <Button
                variant="navbar"
                size="default"
                onClick={handleGetStarted}
                className="text-sm lg:text-base px-4 lg:px-6 active:scale-95 transition-transform"
              >
                Get Started
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-secondary-foreground p-2 active:scale-95 transition-transform"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          ref={menuRef}
          className="md:hidden fixed top-16 sm:top-20 left-3 right-3 bg-secondary border border-secondary-foreground/20 rounded-lg shadow-lg z-40"
        >
          <div className="py-3 sm:py-4 px-4 sm:px-6">
            <div className="flex flex-col space-y-3 sm:space-y-4">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => {
                    if (link.isRoute) {
                      navigate(link.href);
                      setMobileMenuOpen(false);
                    } else {
                      scrollToSection(link.href);
                    }
                  }}
                  className="text-secondary-foreground hover:text-primary transition-colors duration-300 font-medium py-2 text-left text-base active:scale-95"
                >
                  {link.name}
                </button>
              ))}
              <button
                onClick={() => {
                  toggleLanguage();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 text-secondary-foreground hover:text-primary transition-colors duration-300 font-medium py-2 text-left text-base active:scale-95"
              >
                <Globe className="w-4 h-4" />
                Switch language ({languageLabels[language]})
              </button>
              <button
                onClick={() => {
                  openSupportChat();
                  setMobileMenuOpen(false);
                }}
                className="text-secondary-foreground hover:text-primary transition-colors duration-300 font-medium py-2 text-left text-base active:scale-95"
              >
                Chat
              </button>
              <Button
                variant="navbar"
                size="default"
                className="w-full mt-2 active:scale-95 transition-transform"
                onClick={handleGetStarted}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;

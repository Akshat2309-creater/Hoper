import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageGlobeMenu } from "@/components/LanguageMenu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";

interface NavbarProps {
  onOpenChat?: () => void;
}

const SUPPORT_URL = "http://localhost:8504/";

const NAV_DROPDOWN_SIDE_OFFSET = 20;
/** Explore menu sits lower than language — larger gap under nav */
const EXPLORE_DROPDOWN_SIDE_OFFSET = 28;

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

  const { setLanguage, t } = useLanguage();

  const primaryScrollLinks = [
    { name: t("nav.about"), href: "#meet-hoper" },
    { name: t("nav.howItWorks"), href: "#how-it-works" },
  ];

  const contactLink = { name: t("nav.contact"), href: "#contact" };

  const featureLinks = [
    { name: t("nav.checkIn"), href: "/assessment", isRoute: true },
    { name: t("nav.mindfulness"), href: "/mindfulness?mode=breathing", isRoute: true },
    { name: t("nav.sleep"), href: "/sleep?step=breathing", isRoute: true },
    { name: t("nav.faq"), href: "/faq", isRoute: true },
  ];
  const navDropdownPanelBase =
    "border border-secondary-foreground/20 bg-secondary p-1.5 text-secondary-foreground shadow-lg rounded-md";
  const exploreMenuClasses = `${navDropdownPanelBase} w-48`;
  const langMenuClasses = `${navDropdownPanelBase} min-w-[10rem]`;
  const navDropdownItemClasses =
    "cursor-pointer rounded-md font-medium text-secondary-foreground focus:bg-primary focus:text-secondary data-[highlighted]:bg-primary data-[highlighted]:text-secondary";

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-secondary-foreground/10 bg-secondary shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-secondary/95">
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
            <div className="hidden md:flex items-center space-x-3 lg:space-x-6">
              {primaryScrollLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  className="text-secondary-foreground hover:text-primary transition-colors duration-300 font-medium text-sm lg:text-base active:scale-95"
                >
                  {link.name}
                </button>
              ))}

              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 text-secondary-foreground hover:text-primary transition-colors duration-300 font-medium text-sm lg:text-base outline-none rounded-md px-1 -mx-1 data-[state=open]:text-primary">
                  {t("nav.explore") || "Explore"}{" "}
                  <ChevronDown className="w-4 h-4 opacity-70" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="bottom"
                  align="end"
                  sideOffset={EXPLORE_DROPDOWN_SIDE_OFFSET}
                  className={exploreMenuClasses}
                >
                  {featureLinks.map((link) => (
                    <DropdownMenuItem
                      key={link.name}
                      onClick={() =>
                        link.isRoute
                          ? navigate(link.href)
                          : scrollToSection(link.href)
                      }
                      className={navDropdownItemClasses}
                    >
                      {link.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <button
                onClick={() => scrollToSection(contactLink.href)}
                className="text-secondary-foreground hover:text-primary transition-colors duration-300 font-medium text-sm lg:text-base active:scale-95"
              >
                {contactLink.name}
              </button>
              <button
                onClick={openSupportChat}
                className="text-secondary-foreground hover:text-primary transition-colors duration-300 font-medium text-sm lg:text-base active:scale-95"
              >
                {t("nav.chat")}
              </button>
            </div>

            {/* Desktop: Start + language */}
            <div className="hidden md:flex items-center gap-0.5 shrink-0">
              <Button
                variant="navbar"
                size="default"
                onClick={handleGetStarted}
                className="text-sm lg:text-base px-4 lg:px-6 active:scale-95 transition-transform"
              >
                {t("nav.getStarted") || "Get Started"}
              </Button>
              <LanguageGlobeMenu
                setLanguage={setLanguage}
                menuClassName={langMenuClasses}
                itemClassName={navDropdownItemClasses}
              />
              <ThemeToggle />
            </div>

            {/* Mobile: language + menu */}
            <div className="flex md:hidden items-center gap-0.5 shrink-0">
              <LanguageGlobeMenu
                setLanguage={setLanguage}
                menuClassName={langMenuClasses}
                itemClassName={navDropdownItemClasses}
              />
              <ThemeToggle />
              <button
                className="text-secondary-foreground p-2 active:scale-95 transition-transform"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          ref={menuRef}
          className="fixed left-3 right-3 top-16 z-40 rounded-xl border border-secondary-foreground/15 bg-secondary/98 shadow-lg backdrop-blur-md sm:top-20 md:hidden"
        >
          <div className="py-3 sm:py-4 px-4 sm:px-6">
            <div className="flex flex-col space-y-3 sm:space-y-4">
              {primaryScrollLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  className="text-secondary-foreground hover:text-primary transition-colors duration-300 font-medium py-2 text-left text-base active:scale-95"
                >
                  {link.name}
                </button>
              ))}

              <div className="border-t border-secondary-foreground/15 pt-2 pb-2">
                <span className="text-sm font-semibold text-secondary-foreground/65 uppercase tracking-wider mb-2 block px-2">
                  {t("nav.explore") || "Explore"}
                </span>
                <div className="flex flex-col space-y-2 pl-4">
                  {featureLinks.map((link) => (
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
                      className="text-secondary-foreground hover:text-primary transition-colors duration-300 font-medium py-1.5 text-left text-sm active:scale-95 rounded-md px-2 -mx-2"
                    >
                      {link.name}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => scrollToSection(contactLink.href)}
                className="text-secondary-foreground hover:text-primary transition-colors duration-300 font-medium py-2 text-left text-base active:scale-95"
              >
                {contactLink.name}
              </button>

              <button
                onClick={() => {
                  openSupportChat();
                  setMobileMenuOpen(false);
                }}
                className="text-secondary-foreground hover:text-primary transition-colors duration-300 font-medium py-2 text-left text-base active:scale-95"
              >
                {t("nav.chat")}
              </button>
              <Button
                variant="navbar"
                size="default"
                className="w-full mt-2 active:scale-95 transition-transform"
                onClick={handleGetStarted}
              >
                {t("nav.getStarted") || "Get Started"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;

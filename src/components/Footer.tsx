import { Heart, Mail, MapPin, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  const scrollToSection = (href: string) => {
    // Check if we're on the homepage
    if (window.location.pathname === '/') {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Navigate to homepage first, then scroll
      navigate('/');
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <footer className="border-t border-border/60 bg-secondary py-10 text-secondary-foreground sm:py-12 px-4 dark:border-border dark:bg-card dark:text-card-foreground">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Brand */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <img src="/logo.svg" alt="HOPEr Logo" className="h-10 sm:h-12 w-auto" />
              <span className="font-bold text-lg sm:text-xl">HOPEr</span>
            </div>
            <p className="text-secondary-foreground/85 text-xs sm:text-sm dark:text-card-foreground/85">
              {t("footer.desc") || "Supporting mental health awareness and providing resources for those in need."}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">{t("footer.quickLinks") || "Quick Links"}</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-secondary-foreground/85 text-xs sm:text-sm dark:text-card-foreground/85">
              <li>
                <button 
                  onClick={() => scrollToSection('#meet-hoper')} 
                  className="hover:text-primary transition-colors text-left active:scale-95"
                >
                  {t("nav.about") || "About Us"}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('#how-it-works')} 
                  className="hover:text-primary transition-colors text-left active:scale-95"
                >
                  {t("nav.howItWorks") || "How It Works"}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('#contact')} 
                  className="hover:text-primary transition-colors text-left active:scale-95"
                >
                  {t("nav.contact") || "Contact"}
                </button>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">{t("footer.resources") || "Resources"}</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-secondary-foreground/85 text-xs sm:text-sm dark:text-card-foreground/85">
              <li><a href="#" className="hover:text-primary transition-colors active:scale-95 inline-block">{t("footer.crisis") || "Crisis Helpline"}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors active:scale-95 inline-block">{t("footer.support") || "Support Groups"}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors active:scale-95 inline-block">{t("footer.blog") || "Blog"}</a></li>
              <li>
                <button 
                  onClick={() => navigate('/faq')} 
                  className="hover:text-primary transition-colors text-left active:scale-95"
                >
                  {t("nav.faq") || "FAQs"}
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">{t("nav.contact") || "Contact"}</h3>
            <ul className="space-y-2 sm:space-y-3 text-secondary-foreground/85 text-xs sm:text-sm dark:text-card-foreground/85">
              <li className="flex items-start space-x-2">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" />
                <a 
                  href="mailto:hoperthechatbot@gmail.com"
                  className="hover:text-primary transition-colors active:scale-95 inline-block break-all"
                >
                  hoperthechatbot@gmail.com
                </a>
              </li>
              <li className="flex items-start space-x-2">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" />
                <a 
                  href="tel:+919910498377"
                  className="hover:text-primary transition-colors active:scale-95 inline-block"
                >
                  +91 99104 98377
                </a>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" />
                <a
                  href="https://www.google.com/maps/search/KCC+INSTITUTE+OF+TECHNOLOGY+%26+MANAGEMENT,+2C,+Vashishth+Rd,+Knowledge+Park+III,+Greater+Noida,+Uttar+Pradesh+201310"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors active:scale-95 inline-block"
                >
                  KCC INSTITUTE OF TECHNOLOGY & MANAGEMENT, 2C, Vashishth Rd, Knowledge Park III, Greater Noida, Uttar Pradesh 201310
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-secondary-foreground/15 pt-6 text-center text-secondary-foreground/70 text-xs sm:text-sm dark:border-border dark:text-muted-foreground sm:pt-8">
          <p>&copy; {currentYear} HOPEr. All rights reserved. Your mental health matters.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

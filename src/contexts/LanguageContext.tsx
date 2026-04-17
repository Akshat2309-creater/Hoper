import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

type Language = "en" | "hi" | "es" | "fr" | "ar";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const defaultContext: LanguageContextType = {
  language: "en",
  setLanguage: () => {},
  t: (key: string) => key,
};

const LanguageContext = createContext<LanguageContextType>(defaultContext);

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navbar
    "nav.about": "About",
    "nav.howItWorks": "How It Works",
    "nav.checkIn": "Check In",
    "nav.mindfulness": "Mindfulness",
    "nav.sleep": "Sleep",
    "nav.faq": "FAQ",
    "nav.contact": "Contact",
    "nav.chat": "Chat with HOPEr",
    // Common
    "common.home": "Home",
    "common.back": "Back",
    "common.next": "Next",
    "common.finish": "Finish",
    "common.skip": "Skip",
    // Assessment
    "assessment.title": "How are you feeling right now?",
    // Mindfulness
    "mindfulness.title": "Mindfulness & Grounding",
    "mindfulness.subtitle":
      "Choose a practice to center yourself. No pressure, no rush.",
    // Sleep
    "sleep.title": "Sleep Wellness",
    "sleep.subtitle": "Wind down for a restful night.",
    // Chat
    "chat.placeholder": "Type your message here...",
    "chat.send": "Send",
  },
  hi: {
    "nav.about": "हमारे बारे में",
    "nav.howItWorks": "कैसे काम करता है",
    "nav.checkIn": "चेक इन",
    "nav.mindfulness": "माइंडफुलनेस",
    "nav.sleep": "नींद",
    "nav.faq": "सवाल-जवाब",
    "nav.contact": "संपर्क",
    "nav.chat": "HOPEr से बात करें",
    "common.home": "होम",
    "common.back": "पीछे",
    "common.next": "आगे",
    "common.finish": "समाप्त",
    "common.skip": "छोड़ें",
    "assessment.title": "आप अभी कैसा महसूस कर रहे हैं?",
    "mindfulness.title": "माइंडफुलनेस और ग्राउंडिंग",
    "mindfulness.subtitle":
      "खुद को केंद्रित करने के लिए एक अभ्यास चुनें। कोई दबाव नहीं, कोई जल्दी नहीं।",
    "sleep.title": "नींद स्वास्थ्य",
    "sleep.subtitle": "आरामदायक रात के लिए तैयार हों।",
    "chat.placeholder": "यहाँ अपना संदेश लिखें...",
    "chat.send": "भेजें",
  },
  es: {
    "nav.about": "Acerca de",
    "nav.howItWorks": "Cómo funciona",
    "nav.checkIn": "Registrarse",
    "nav.mindfulness": "Atención plena",
    "nav.sleep": "Sueño",
    "nav.faq": "Preguntas frecuentes",
    "nav.contact": "Contacto",
    "nav.chat": "Chatea con HOPEr",
    "common.home": "Inicio",
    "common.back": "Atrás",
    "common.next": "Siguiente",
    "common.finish": "Terminar",
    "common.skip": "Saltar",
    "assessment.title": "¿Cómo te sientes ahora?",
    "mindfulness.title": "Atención plena y conexión a tierra",
    "mindfulness.subtitle":
      "Elige una práctica para centrarte. Sin presión, sin prisa.",
    "sleep.title": "Bienestar del sueño",
    "sleep.subtitle": "Relájate para una noche reparadora.",
    "chat.placeholder": "Escribe tu mensaje aquí...",
    "chat.send": "Enviar",
  },
  fr: {
    "nav.about": "À propos",
    "nav.howItWorks": "Comment ça marche",
    "nav.checkIn": "Enregistrement",
    "nav.mindfulness": "Pleine conscience",
    "nav.sleep": "Sommeil",
    "nav.faq": "FAQ",
    "nav.contact": "Contact",
    "nav.chat": "Discuter avec HOPEr",
    "common.home": "Accueil",
    "common.back": "Retour",
    "common.next": "Suivant",
    "common.finish": "Terminer",
    "common.skip": "Sauter",
    "assessment.title": "Comment vous sentez-vous maintenant ?",
    "mindfulness.title": "Pleine conscience et ancrage",
    "mindfulness.subtitle":
      "Choisissez une pratique pour vous recentrer. Pas de pression, pas de précipitation.",
    "sleep.title": "Bien-être du sommeil",
    "sleep.subtitle": "Détendez-vous pour une nuit reposante.",
    "chat.placeholder": "Tapez votre message ici...",
    "chat.send": "Envoyer",
  },
  ar: {
    "nav.about": "معلومات عنا",
    "nav.howItWorks": "كيف يعمل",
    "nav.checkIn": "تسجيل الوصول",
    "nav.mindfulness": "اليقظة",
    "nav.sleep": "النوم",
    "nav.faq": "الأسئلة الشائعة",
    "nav.contact": "اتصل بنا",
    "nav.chat": "تحدث مع HOPEr",
    "common.home": "الرئيسية",
    "common.back": "رجوع",
    "common.next": "التالي",
    "common.finish": "إنهاء",
    "common.skip": "تخطي",
    "assessment.title": "كيف تشعر الآن؟",
    "mindfulness.title": "اليقظة والتأريض",
    "mindfulness.subtitle": "اختر ممارسة لتركيز نفسك. لا ضغط، لا عجلة.",
    "sleep.title": "صحة النوم",
    "sleep.subtitle": "استرخِ ليلة مريحة.",
    "chat.placeholder": "اكتب رسالتك هنا...",
    "chat.send": "إرسال",
  },
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("hoper_language");
    return (saved as Language) || "en";
  });

  useEffect(() => {
    localStorage.setItem("hoper_language", language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language]?.[key] || translations["en"][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

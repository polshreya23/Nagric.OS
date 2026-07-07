import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'hi' | 'ta' | 'te' | 'mr' | 'bn' | 'gu' | 'kn' | 'ml' | 'or' | 'pa' | 'as' | 'ur' | 'sd' | 'ks';

interface AccessibilityContextProps {
  isDrishtiMode: boolean; // Blind Assist
  isSugamyaMode: boolean; // Low Literacy / Iconographic Assist
  currentLanguage: Language;
  toggleDrishtiMode: () => void;
  toggleSugamyaMode: () => void;
  changeLanguage: (lang: Language) => void;
  triggerHaptic: (pattern?: number | number[]) => void;
  playFeedbackAudio: (text: string) => void;
}

const AccessibilityContext = createContext<AccessibilityContextProps | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDrishtiMode, setIsDrishtiMode] = useState(false);
  const [isSugamyaMode, setIsSugamyaMode] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');

  // Load configuration from localstorage (improves offline resilience)
  useEffect(() => {
    const cachedDrishti = localStorage.getItem('drishti_mode') === 'true';
    const cachedSugamya = localStorage.getItem('sugamya_mode') === 'true';
    const cachedLang = localStorage.getItem('user_lang') as Language;

    if (cachedDrishti) setIsDrishtiMode(true);
    if (cachedSugamya) setIsSugamyaMode(true);
    if (cachedLang) setCurrentLanguage(cachedLang);
  }, []);

  const triggerHaptic = (pattern: number | number[] = 50) => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(pattern);
    }
  };

  const playFeedbackAudio = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // Cancel previous speak streams
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Match voice language
      const langMapping: Record<Language, string> = {
        en: 'en-US', hi: 'hi-IN', ta: 'ta-IN', te: 'te-IN', mr: 'mr-IN',
        bn: 'bn-IN', gu: 'gu-IN', kn: 'kn-IN', ml: 'ml-IN', or: 'or-IN',
        pa: 'pa-IN', as: 'as-IN', ur: 'ur-PK', sd: 'sd-IN', ks: 'ks-IN'
      };
      
      utterance.lang = langMapping[currentLanguage] || 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleDrishtiMode = () => {
    triggerHaptic([100, 50, 100]);
    setIsDrishtiMode(prev => {
      const val = !prev;
      localStorage.setItem('drishti_mode', String(val));
      if (val) {
        setIsSugamyaMode(false); // Mutually exclusive assist
        playFeedbackAudio("Drishti mode activated. Double tap any area to input your voice commands.");
      } else {
        playFeedbackAudio("Drishti mode deactivated.");
      }
      return val;
    });
  };

  const toggleSugamyaMode = () => {
    triggerHaptic(80);
    setIsSugamyaMode(prev => {
      const val = !prev;
      localStorage.setItem('sugamya_mode', String(val));
      if (val) {
        setIsDrishtiMode(false);
        playFeedbackAudio("Sugamya low-literacy helper active. Interactive visual icons enabled.");
      } else {
        playFeedbackAudio("Sugamya mode turned off.");
      }
      return val;
    });
  };

  const changeLanguage = (lang: Language) => {
    triggerHaptic(30);
    setCurrentLanguage(lang);
    localStorage.setItem('user_lang', lang);
    const announcements: Record<Language, string> = {
      en: 'Language set to English',
      hi: 'भाषा को हिंदी में बदल दिया गया है',
      ta: 'மொழி தமிழுக்கு மாற்றப்பட்டுள்ளது',
      te: 'భాష తెలుగులోకి మార్చబడింది',
      mr: 'भाषा मराठीमध्ये बदलली आहे',
      bn: 'ভাষা বাংলায় পরিবর্তন করা হয়েছে',
      gu: 'ભાષા ગુજરાતીમાં બદલાઈ ગઈ છે',
      kn: 'ಭಾಷೆಯನ್ನು ಕನ್ನಡಕ್ಕೆ ಬದಲಾಯಿಸಲಾಗಿದೆ',
      ml: 'ഭാഷ മലയാളത്തിലേക്ക് മാറ്റി',
      or: 'ଭାଷା ଓଡ଼ିଆକୁ ପରିବର୍ତ୍ତିତ ହୋଇଛି',
      pa: 'ਭਾਸ਼ਾ ਪੰਜਾਬੀ ਵਿੱਚ ਬਦਲ ਦਿੱਤੀ ਗਈ ਹੈ',
      as: 'ভাষা অসমীয়ালৈ সলনি কৰা হৈছে',
      ur: 'زبان اردو میں تبدیل کر دی گئی ہے',
      sd: 'ٻولي سنڌي ۾ تبديل ڪئي وئي آهي',
      ks: 'زبان چھ کٲشرس منز تبدیل کٔرمژ'
    };
    playFeedbackAudio(announcements[lang] || 'Language updated');
  };

  return (
    <AccessibilityContext.Provider
      value={{
        isDrishtiMode,
        isSugamyaMode,
        currentLanguage,
        toggleDrishtiMode,
        toggleSugamyaMode,
        changeLanguage,
        triggerHaptic,
        playFeedbackAudio
      }}
    >
      <div className={`min-h-screen ${isDrishtiMode ? 'drishti-mode' : ''}`}>
        {children}
      </div>
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used inside AccessibilityProvider');
  }
  return context;
};

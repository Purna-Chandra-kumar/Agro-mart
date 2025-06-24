
interface Translations {
  [key: string]: {
    en: string;
    hi: string;
    te: string;
  };
}

const translations: Translations = {
  // Navigation
  'nav.home': {
    en: 'Home',
    hi: 'होम',
    te: 'హోమ్'
  },
  'nav.dashboard': {
    en: 'Dashboard',
    hi: 'डैशबोर्ड',
    te: 'డాష్‌బోర్డ్'
  },
  'nav.logout': {
    en: 'Logout',
    hi: 'लॉग आउट',
    te: 'లాగ్ అవుట్'
  },
  
  // Auth
  'auth.login': {
    en: 'Login',
    hi: 'लॉग इन',
    te: 'లాగిన్'
  },
  'auth.signup': {
    en: 'Sign Up',
    hi: 'साइन अप',
    te: 'సైన్ అప్'
  },
  'auth.email': {
    en: 'Email',
    hi: 'ईमेल',
    te: 'ఇమెయిల్'
  },
  'auth.password': {
    en: 'Password',
    hi: 'पासवर्ड',
    te: 'పాస్‌వర్డ్'
  },
  
  // Categories
  'category.leafy': {
    en: 'Leafy Greens',
    hi: 'पत्तेदार साग',
    te: 'ఆకుకూరలు'
  },
  'category.root': {
    en: 'Root Vegetables',
    hi: 'जड़ सब्जियां',
    te: 'వేళ్ళకూరలు'
  },
  'category.other': {
    en: 'Other Vegetables',
    hi: 'अन्य सब्जियां',
    te: 'ఇతర కూరగాయలు'
  },
  'category.fruits': {
    en: 'Fruits',
    hi: 'फल',
    te: 'పండ్లు'
  },
  'category.berries': {
    en: 'Berries',
    hi: 'बेर',
    te: 'బెర్రీలు'
  },
  
  // Products
  'product.viewDetails': {
    en: 'View Details',
    hi: 'विवरण देखें',
    te: 'వివరాలు చూడండి'
  },
  'product.price': {
    en: 'Price',
    hi: 'मूल्य',
    te: 'ధర'
  },
  'product.quantity': {
    en: 'Quantity',
    hi: 'मात्रा',
    te: 'పరిమాణం'
  },
  'product.distance': {
    en: 'Distance',
    hi: 'दूरी',
    te: 'దూరం'
  },
  
  // Delivery
  'delivery.hire': {
    en: 'Hire Delivery Partner',
    hi: 'डिलीवरी पार्टनर किराए पर लें',
    te: 'డెలివరీ పార్టనర్‌ను అద్దెకు తీసుకోండి'
  },
  'delivery.direct': {
    en: 'Buy Directly from Farmer',
    hi: 'किसान से सीधे खरीदें',
    te: 'రైతు నుండి నేరుగా కొనండి'
  },
  'delivery.fee': {
    en: 'Delivery Fee',
    hi: 'डिलीवरी शुल्क',
    te: 'డెలివరీ రుసుము'
  },
  
  // Common
  'common.search': {
    en: 'Search',
    hi: 'खोजें',
    te: 'వెతకండి'
  },
  'common.filter': {
    en: 'Filter',
    hi: 'फ़िल्टर',
    te: 'వడపోత'
  },
  'common.add': {
    en: 'Add',
    hi: 'जोड़ें',
    te: 'జోడించు'
  },
  'common.save': {
    en: 'Save',
    hi: 'सेव',
    te: 'సేవ్'
  },
  'common.cancel': {
    en: 'Cancel',
    hi: 'रद्द करें',
    te: 'రద్దు చేయండి'
  }
};

type Language = 'en' | 'hi' | 'te';

class LanguageStore {
  private currentLanguage: Language = 'en';

  constructor() {
    const stored = localStorage.getItem('language') as Language;
    if (stored && ['en', 'hi', 'te'].includes(stored)) {
      this.currentLanguage = stored;
    }
  }

  getCurrentLanguage(): Language {
    return this.currentLanguage;
  }

  setLanguage(lang: Language) {
    this.currentLanguage = lang;
    localStorage.setItem('language', lang);
  }

  translate(key: string): string {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translation[this.currentLanguage] || translation.en || key;
  }

  getLanguages(): { code: Language; name: string; flag: string }[] {
    return [
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
      { code: 'te', name: 'తెలుగు', flag: '🇮🇳' }
    ];
  }
}

export const languageStore = new LanguageStore();
export type { Language };

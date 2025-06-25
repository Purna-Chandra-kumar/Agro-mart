
export type Language = 'en' | 'hi' | 'te';

interface LanguageData {
  code: Language;
  name: string;
  flag: string;
}

interface Translations {
  [key: string]: {
    [lang in Language]: string;
  };
}

const translations: Translations = {
  'nav.logout': {
    en: 'Logout',
    hi: 'लॉगआउट',
    te: 'లాగ్అవుట్'
  },
  'common.search': {
    en: 'Search',
    hi: 'खोजें',
    te: 'వెతకండి'
  },
  'common.add': {
    en: 'Add',
    hi: 'जोड़ें',
    te: 'జోడించు'
  },
  'common.cancel': {
    en: 'Cancel',
    hi: 'रद्द करें',
    te: 'రద్దు చేయి'
  },
  'category.leafy': {
    en: 'Leafy Greens',
    hi: 'पत्तेदार सब्जियां',
    te: 'ఆకు కూరలు'
  },
  'category.root': {
    en: 'Root Vegetables',
    hi: 'जड़ वाली सब्जियां',
    te: 'వేర్ కూరలు'
  },
  'category.other': {
    en: 'Other Vegetables',
    hi: 'अन्य सब्जियां',
    te: 'ఇతర కూరలు'
  },
  'category.fruits': {
    en: 'Fruits',
    hi: 'फल',
    te: 'పండ్లు'
  },
  'category.berries': {
    en: 'Berries',
    hi: 'बेरी',
    te: 'బెర్రీలు'
  },
  'delivery.direct': {
    en: 'Direct Buy',
    hi: 'सीधी खरीदारी',
    te: 'ప్రత్యక్ష కొనుగోలు'
  },
  'delivery.hire': {
    en: 'Hire Delivery',
    hi: 'डिलीवरी बुक करें',
    te: 'డెలివరీ బుక్ చేయండి'
  },
  'delivery.fee': {
    en: 'Delivery Fee',
    hi: 'डिलीवरी शुल्क',
    te: 'డెలివరీ రుసుము'
  },
  'product.quantity': {
    en: 'Quantity',
    hi: 'मात्रा',
    te: 'పరిమాణం'
  }
};

class LanguageStore {
  private currentLanguage: Language = 'en';
  
  private languages: LanguageData[] = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' }
  ];

  getCurrentLanguage(): Language {
    return this.currentLanguage;
  }

  setLanguage(language: Language) {
    this.currentLanguage = language;
    localStorage.setItem('selectedLanguage', language);
  }

  getLanguages(): LanguageData[] {
    return this.languages;
  }

  translate(key: string): string {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translation[this.currentLanguage] || translation.en || key;
  }

  constructor() {
    const savedLanguage = localStorage.getItem('selectedLanguage') as Language;
    if (savedLanguage && ['en', 'hi', 'te'].includes(savedLanguage)) {
      this.currentLanguage = savedLanguage;
    }
  }
}

export const languageStore = new LanguageStore();

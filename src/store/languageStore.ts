
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
  // Navigation
  'nav.logout': {
    en: 'Logout',
    hi: 'लॉगआउट',
    te: 'లాగ్అవుట్'
  },
  // Common
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
  'common.submit': {
    en: 'Submit',
    hi: 'जमा करें',
    te: 'సమర్పించు'
  },
  'common.save': {
    en: 'Save',
    hi: 'सेव करें',
    te: 'సేవ్ చేయి'
  },
  'common.edit': {
    en: 'Edit',
    hi: 'संपादित करें',
    te: 'సవరించు'
  },
  'common.delete': {
    en: 'Delete',
    hi: 'हटाएं',
    te: 'తొలగించు'
  },
  'common.close': {
    en: 'Close',
    hi: 'बंद करें',
    te: 'మూసివేయి'
  },
  'common.name': {
    en: 'Name',
    hi: 'नाम',
    te: 'పేరు'
  },
  'common.email': {
    en: 'Email',
    hi: 'ईमेल',
    te: 'ఇమెయిల్'
  },
  'common.password': {
    en: 'Password',
    hi: 'पासवर्ड',
    te: 'పాస్‌వర్డ్'
  },
  'common.phone': {
    en: 'Phone Number',
    hi: 'फोन नंबर',
    te: 'ఫోన్ నంబర్'
  },
  // Authentication
  'auth.welcome': {
    en: 'Welcome Back',
    hi: 'वापसी पर स्वागत',
    te: 'తిరిగి స్వాగతం'
  },
  'auth.create_account': {
    en: 'Create Account',
    hi: 'खाता बनाएं',
    te: 'ఖాతా సృష్టించండి'
  },
  'auth.signin': {
    en: 'Sign In',
    hi: 'साइन इन करें',
    te: 'సైన్ ఇన్ చేయండి'
  },
  'auth.signup': {
    en: 'Sign Up',
    hi: 'साइन अप करें',
    te: 'సైన్ అప్ చేయండి'
  },
  'auth.buyer': {
    en: 'Buyer',
    hi: 'खरीदार',
    te: 'కొనుగోలుదారు'
  },
  'auth.farmer': {
    en: 'Farmer',
    hi: 'किसान',
    te: 'రైతు'
  },
  'auth.signin_buyer': {
    en: 'Sign in to your buyer account',
    hi: 'अपने खरीदार खाते में साइन इन करें',
    te: 'మీ కొనుగోలుదారు ఖాతాలో సైన్ ఇన్ చేయండి'
  },
  'auth.signin_farmer': {
    en: 'Sign in to your farmer account',
    hi: 'अपने किसान खाते में साइన इन करें',
    te: 'మీ రైతు ఖాతాలో సైన్ ఇన్ చేయండి'
  },
  'auth.create_buyer': {
    en: 'Create a new buyer account',
    hi: 'नया खरीदार खाता बनाएं',
    te: 'కొత్త కొనుగోలుదారు ఖాతా సృష్టించండి'
  },
  'auth.create_farmer': {
    en: 'Create a new farmer account',
    hi: 'नया किसान खाता बनाएं',
    te: 'కొత్త రైతు ఖాతా సృష్టించండి'
  },
  'auth.farmer_name': {
    en: 'Farmer Name',
    hi: 'किसान का नाम',
    te: 'రైతు పేరు'
  },
  'auth.full_name': {
    en: 'Full Name',
    hi: 'पूरा नाम',
    te: 'పూర్తి పేరు'
  },
  'auth.enter_name': {
    en: 'Enter your full name',
    hi: 'अपना पूरा नाम दर्ज करें',
    te: 'మీ పూర్తి పేరు నమోదు చేయండి'
  },
  'auth.enter_farmer_name': {
    en: 'Enter farmer name',
    hi: 'किसान का नाम दर्ज करें',
    te: 'రైతు పేరు నమోదు చేయండి'
  },
  'auth.enter_email': {
    en: 'Enter your email',
    hi: 'अपना ईमेल दर्ज करें',
    te: 'మీ ఇమెయిల్ నమోదు చేయండి'
  },
  'auth.enter_password': {
    en: 'Enter your password',
    hi: 'अपना पासवर्ड दर्ज करें',
    te: 'మీ పాస్‌వర్డ్ నమోదు చేయండి'
  },
  'auth.enter_phone': {
    en: 'Enter your phone number',
    hi: 'अपना फोन नंबर दर्ज करें',
    te: 'మీ ఫోన్ నంబర్ నమోదు చేయండి'
  },
  'auth.aadhar_number': {
    en: 'Aadhar Number',
    hi: 'आधार नंबर',
    te: 'ఆధార్ నంబర్'
  },
  'auth.enter_aadhar': {
    en: 'Enter your 12-digit Aadhar number',
    hi: 'अपना 12-अंकीय आधार नंबर दर्ज करें',
    te: 'మీ 12-అంకెల ఆధార్ నంబర్ నమోదు చేయండి'
  },
  'auth.date_of_birth': {
    en: 'Date of Birth',
    hi: 'जन्म तिथि',
    te: 'జన్మ తేదీ'
  },
  'auth.aadhar_optional': {
    en: 'Aadhar Number (Optional)',
    hi: 'आधार नंबर (वैकल्पिक)',
    te: 'ఆధార్ నంబర్ (ఐచ్ఛికం)'
  },
  'auth.dob_optional': {
    en: 'Date of Birth (Optional)',
    hi: 'जन्म तिथि (वैकल्पिक)',
    te: 'జన్మ తేదీ (ఐచ్ఛికం)'
  },
  'auth.processing': {
    en: 'Processing...',
    hi: 'प्रसंस्करण...',
    te: 'ప్రాసెస్ చేస్తోంది...'
  },
  'auth.create_account_btn': {
    en: 'Create Account',
    hi: 'खाता बनाएं',
    te: 'ఖాతా సృష్టించండి'
  },
  'auth.no_account': {
    en: "Don't have an account? Sign up",
    hi: 'खाता नहीं है? साइन अप करें',
    te: 'ఖాతా లేదా? సైన్ అప్ చేయండి'
  },
  'auth.have_account': {
    en: 'Already have an account? Sign in',
    hi: 'पहले से खाता है? साइन इन करें',
    te: 'ఇప్పటికే ఖాతా ఉందా? సైన్ ఇన్ చేయండి'
  },
  'auth.method_email': {
    en: 'Email & Password',
    hi: 'ईमेल और पासवर्ड',
    te: 'ఇమెయిల్ & పాస్‌వర్డ్'
  },
  'auth.method_aadhar': {
    en: 'Aadhar & Date of Birth',
    hi: 'आधार और जन्म तिथि',
    te: 'ఆధార్ & జన్మ తేదీ'
  },
  // Categories
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
  // Delivery
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
  // Product
  'product.quantity': {
    en: 'Quantity',
    hi: 'मात्रा',
    te: 'పరిమాణం'
  },
  'product.price': {
    en: 'Price',
    hi: 'मूल्य',
    te: 'ధర'
  },
  'product.description': {
    en: 'Description',
    hi: 'विवरण',
    te: 'వివరణ'
  },
  // Profile Form
  'profile.complete': {
    en: 'Complete Your Profile',
    hi: 'अपनी प्रोफ़ाइल पूरी करें',
    te: 'మీ ప్రొఫైల్‌ను పూర్తి చేయండి'
  },
  'profile.before_continue': {
    en: 'Please complete your profile before continuing to your dashboard.',
    hi: 'कृपया अपने डैशबोर्ड में जाने से पहले अपनी प्रोफ़ाइल पूरी करें।',
    te: 'దయచేసి మీ డ్యాష్‌బోర్డ్‌కు వెళ్లే ముందు మీ ప్రొఫైల్‌ను పూర్తి చేయండి.'
  },
  'profile.whatsapp': {
    en: 'WhatsApp Number (Optional)',
    hi: 'व्हाट्सऐप नंबर (वैकल्पिक)',
    te: 'వాట్సాప్ నంబర్ (ఐచ్ఛికం)'
  },
  'profile.enter_whatsapp': {
    en: 'Enter your WhatsApp number',
    hi: 'अपना व्हाट्सऐप नंबर दर्ज करें',
    te: 'మీ వాట్సాప్ నంబర్ నమోదు చేయండి'
  },
  'profile.email_optional': {
    en: 'Email (Optional)',
    hi: 'ईमेल (वैकल्पिक)',
    te: 'ఇమెయిల్ (ఐచ్ఛికం)'
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

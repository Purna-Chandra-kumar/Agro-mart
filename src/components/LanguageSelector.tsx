
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { languageStore, Language } from "@/store/languageStore";
import { Globe } from "lucide-react";

const LanguageSelector = () => {
  const [currentLanguage, setCurrentLanguage] = useState(languageStore.getCurrentLanguage());
  const languages = languageStore.getLanguages();

  const handleLanguageChange = (langCode: string) => {
    const newLang = langCode as Language;
    languageStore.setLanguage(newLang);
    setCurrentLanguage(newLang);
    window.location.reload(); // Reload to update all translations
  };

  const currentLangData = languages.find(lang => lang.code === currentLanguage);

  return (
    <Select value={currentLanguage} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-[140px]">
        <Globe className="h-4 w-4 mr-2" />
        <SelectValue>
          {currentLangData?.flag} {currentLangData?.name}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            <span className="flex items-center">
              <span className="mr-2">{lang.flag}</span>
              {lang.name}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LanguageSelector;

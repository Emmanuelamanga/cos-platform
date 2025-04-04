"use client";

import { useState, useEffect } from "react";
import { Globe } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";

export function LangSwitcher() {
  const [currentLang, setCurrentLang] = useState<string>("en");
  
  // In a real implementation, this would interact with your i18n library
  // For now, it's just a UI component
  
  const languages = [
    { code: "en", name: "English" },
    { code: "sw", name: "Kiswahili" },
  ];
  
  useEffect(() => {
    // In a real implementation, get the language from localStorage or cookies
    const savedLang = localStorage.getItem("language") || "en";
    setCurrentLang(savedLang);
  }, []);
  
  const handleLanguageChange = (langCode: string) => {
    setCurrentLang(langCode);
    localStorage.setItem("language", langCode);
    
    // In a real implementation, this would change the app's language
    // For example, using next-i18next or similar
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 gap-1">
          <Globe className="h-4 w-4" />
          <span className="text-xs font-medium">
            {languages.find(lang => lang.code === currentLang)?.name || "English"}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={currentLang === lang.code ? "bg-muted" : ""}
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

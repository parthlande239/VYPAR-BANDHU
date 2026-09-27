import React, { createContext, useContext, useState, useEffect } from "react";
import { translations } from "../i18n";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    // Persist language in localStorage 
    const [language, setLanguageState] = useState(() => {
        return localStorage.getItem("preferred_language") || "en"; // Defaulting to EN per user request to start clean
    });

    const setLanguage = (lang) => {
        setLanguageState(lang);
        localStorage.setItem("preferred_language", lang);
    };

    // Translation function with optional fallback
    const t = (key, fallback) => {
        const dict = translations[language] || translations["en"];
        if (dict && dict[key]) return dict[key];
        if (translations["en"] && translations["en"][key]) return translations["en"][key];
        return fallback !== undefined ? fallback : key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);

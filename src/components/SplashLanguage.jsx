import React from "react";
import { useApp } from "../context/AppContext";
import { useLanguage } from "../context/LanguageContext";
import { Leaf, Mic, Sparkles } from "lucide-react";

const languages = [
    { code: "hi", native: "हिन्दी", en: "Hindi" },
    { code: "en", native: "English", en: "English" },
    { code: "mr", native: "मराठी", en: "Marathi" },
    { code: "ta", native: "தமிழ்", en: "Tamil" },
    { code: "te", native: "తెలుగు", en: "Telugu" },
    { code: "bn", native: "বাংলা", en: "Bengali" },
    { code: "gu", native: "ગુજરાતી", en: "Gujarati" },
    { code: "kn", native: "ಕನ್ನಡ", en: "Kannada" },
];

export default function SplashLanguage({ onDone }) {
    const { language, setLanguage, t } = useLanguage();

    const pick = (code) => {
        setLanguage(code);
        onDone();
    };

    return (
        <div className="min-h-screen bg-cream-100 flex flex-col items-center justify-center px-4 py-10 animate-fade-up">
            {/* Logo */}
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-terra-500 to-marigold-500 flex items-center justify-center shadow-warm-lg mb-6">
                <Leaf className="w-10 h-10 text-white stroke-[2.5]" />
            </div>

            <h1 className="font-heading text-4xl font-extrabold text-charcoal-600 text-center">
                व्यापार <span className="text-terra-500">बंधु</span>
            </h1>
            <p className="text-sm text-charcoal-400 font-body mt-2 mb-8 text-center max-w-xs">
                {t("splash.subtitle")}
            </p>

            {/* Language grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-lg mb-8">
                {languages.map((lang) => {
                    return (
                        <button
                            key={lang.code}
                            onClick={() => pick(lang.code)}
                            className={`card-warm p-4 text-center space-y-1 group relative transition-all active:scale-95 ${language === lang.code ? "!border-terra-500 !shadow-warm bg-terra-500/5 ring-2 ring-terra-500/30" : ""
                                }`}
                        >
                            <span className="font-heading text-lg font-bold text-charcoal-600 block group-hover:text-terra-500 transition-colors">
                                {lang.native}
                            </span>
                            <span className="text-[11px] text-charcoal-400 font-body block">{lang.en}</span>
                        </button>
                    );
                })}
            </div>

            {/* Voice option */}
            <button
                onClick={() => pick("hi")}
                className="flex items-center gap-2 bg-terra-500 text-white font-heading font-bold px-6 py-3.5 rounded-2xl shadow-warm hover:shadow-warm-lg active:scale-95 transition-all text-sm"
            >
                <Mic className="w-4 h-4" /> {t("splash.voice")}
            </button>

            {/* Trust line */}
            <p className="text-xs text-charcoal-300 font-body mt-6 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-marigold-500" /> SIH Hackathon Demo — AI-Powered Rural Micro-Enterprise Guide
            </p>
        </div>
    );
}

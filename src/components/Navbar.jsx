import React from "react";
import { useApp } from "../context/AppContext";
import { useLanguage } from "../context/LanguageContext";
import { Mic, Globe, Home, Leaf } from "lucide-react";

export default function Navbar() {
    const { activeScreen, setActiveScreen, triggerVoiceModal } = useApp();
    const { language, setLanguage, t } = useLanguage();

    return (
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-warmgray-200 shadow-warm-sm">
            <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
                {/* Brand */}
                <button
                    onClick={() => setActiveScreen("home")}
                    className="flex items-center gap-2.5 group focus:outline-none"
                >
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-terra-500 to-marigold-500 flex items-center justify-center shadow-warm transition-transform group-hover:scale-105 group-active:scale-95">
                        <Leaf className="w-5 h-5 text-white stroke-[2.5]" />
                    </div>
                    <div className="text-left">
                        <span className="font-heading font-extrabold text-lg text-charcoal-600 leading-none tracking-tight">
                            {t("app.name").split(" ")[0]} <span className="text-terra-500">{t("app.name").split(" ")[1] || ""}</span>
                        </span>
                        <p className="text-[10px] text-charcoal-300 font-body font-medium leading-none mt-0.5">
                            Your business, made simple
                        </p>
                    </div>
                </button>

                {/* Controls */}
                <div className="flex items-center gap-2">
                    {/* Voice */}
                    <button
                        onClick={() => triggerVoiceModal(t("voice.askHelp"))}
                        className="flex items-center gap-1.5 bg-terra-500 hover:bg-terra-600 active:scale-95 text-white font-heading font-bold text-xs px-3 py-2 rounded-2xl shadow-warm-sm transition-all"
                    >
                        <Mic className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{t("nav.speak")}</span>
                    </button>

                    {/* Language */}
                    <div className="flex items-center bg-warmgray-100 rounded-2xl px-2.5 py-1.5 border border-warmgray-200">
                        <Globe className="w-3.5 h-3.5 text-charcoal-300 mr-1" />
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="bg-transparent text-xs font-semibold text-charcoal-500 focus:outline-none cursor-pointer font-body"
                        >
                            <option value="hi">हिन्दी</option>
                            <option value="en">English</option>
                            <option value="mr">मराठी</option>
                            <option value="ta">தமிழ்</option>
                            <option value="te">తెలుగు</option>
                            <option value="bn">বাংলা</option>
                            <option value="gu">ગુજરાતી</option>
                            <option value="kn">ಕನ್ನಡ</option>
                        </select>
                    </div>

                    {/* Home shortcut — only when not on home */}
                    {activeScreen !== "home" && (
                        <button
                            onClick={() => setActiveScreen("home")}
                            className="p-2 text-charcoal-300 hover:text-terra-500 bg-warmgray-100 hover:bg-warmgray-200 rounded-2xl border border-warmgray-200 transition-colors active:scale-95"
                        >
                            <Home className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}

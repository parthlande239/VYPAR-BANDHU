import React, { useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import DemoToggle from "./components/DemoToggle";

// Layout
import Sidebar from "./components/Sidebar";
import BottomNav from "./components/BottomNav";
import VoiceModal from "./components/VoiceModal";

// Onboarding
import SplashLanguage from "./components/SplashLanguage";
import MockLogin from "./components/MockLogin";

// Screens
import HomeScreen from "./components/HomeScreen";
import ConversationalIntake from "./components/ConversationalIntake";
import Module1Feasibility from "./components/Module1Feasibility";
import Module2FinancialCalculator from "./components/Module2FinancialCalculator";
import Module3SchemeAdvisor from "./components/Module3SchemeAdvisor";
import DashboardExisting from "./components/DashboardExisting";
import ExpertCommunity from "./components/ExpertCommunity";
import MyRecords from "./components/MyRecords";
import AskBandhu, { ChatBubbleButton } from "./components/AskBandhu";
import { LanguageProvider, useLanguage } from "./context/LanguageContext";
import { Mic, Globe, CheckCircle2 } from "lucide-react";

export const SUPPORTED_LANGUAGES = [
    { code: "hi", native: "हिन्दी", en: "Hindi" },
    { code: "en", native: "English", en: "English" },
    { code: "mr", native: "मराठी", en: "Marathi" },
    { code: "ta", native: "தமிழ்", en: "Tamil" },
    { code: "te", native: "తెలుగు", en: "Telugu" },
    { code: "bn", native: "বাংলা", en: "Bengali" },
    { code: "gu", native: "ગુજરાતી", en: "Gujarati" },
    { code: "kn", native: "ಕನ್ನಡ", en: "Kannada" },
];

/* ── Page header shown inside the right panel ── */
function PageHeader({ title, subtitle }) {
    const { triggerVoiceModal } = useApp();
    const { language, setLanguage, t } = useLanguage();
    return (
        <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-warmgray-200 bg-white/60 backdrop-blur-md sticky top-0 z-20">
            <div>
                <h2 className="font-heading text-base font-bold text-charcoal-600">{title}</h2>
                {subtitle && <p className="text-[11px] text-charcoal-300 font-body">{subtitle}</p>}
            </div>
            <div className="flex items-center gap-2">
                <button onClick={() => triggerVoiceModal(t("nav.pageHelp"))}
                    className="flex items-center gap-1 text-terra-500 bg-terra-500/10 border border-terra-400/30 px-2.5 py-1.5 rounded-xl text-xs font-bold font-body active:scale-95">
                    <Mic className="w-3.5 h-3.5" /> {t("phrase.speakShort")}
                </button>
                <div className="flex items-center bg-warmgray-100 hover:bg-warmgray-200/80 rounded-xl px-2.5 py-1.5 border border-warmgray-200 transition-colors shadow-warm-sm">
                    <Globe className="w-3.5 h-3.5 text-charcoal-400 mr-1.5 shrink-0" />
                    <select value={language} onChange={(e) => setLanguage(e.target.value)}
                        className="bg-transparent text-xs font-bold text-charcoal-600 font-body focus:outline-none cursor-pointer">
                        {SUPPORTED_LANGUAGES.map(lang => (
                            <option key={lang.code} value={lang.code}>{lang.native} ({lang.en})</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}

/* ── Main authenticated app layout ── */
function AuthenticatedApp() {
    const { activeScreen, isChatOpen, setIsChatOpen } = useApp();
    const { t } = useLanguage();

    const SCREEN_TITLES = {
        home: { title: t("screen.home.title"), subtitle: t("screen.home.subtitle") },
        intake: { title: t("screen.intake.title"), subtitle: t("screen.intake.subtitle") },
        feasibility: { title: t("screen.feasibility.title"), subtitle: t("screen.feasibility.subtitle") },
        finance: { title: t("screen.finance.title"), subtitle: t("screen.finance.subtitle") },
        schemes: { title: t("screen.schemes.title"), subtitle: t("screen.schemes.subtitle") },
        dashboard: { title: t("screen.dashboard.title"), subtitle: t("screen.dashboard.subtitle") },
        experts: { title: t("screen.experts.title"), subtitle: t("screen.experts.subtitle") },
        records: { title: t("screen.records.title"), subtitle: t("screen.records.subtitle") },
        chat: { title: t("screen.chat.title"), subtitle: t("screen.chat.subtitle") },
        settings: { title: t("screen.settings.title"), subtitle: t("screen.settings.subtitle") },
    };

    const st = SCREEN_TITLES[activeScreen] || SCREEN_TITLES.home;

    // Temporary settings screen component:
    const SettingsScreen = () => {
        const { language, setLanguage, t: tx } = useLanguage();
        return (
            <div className="max-w-xl mx-auto px-4 py-8 animate-fade-up">
                <div className="card-warm p-6 text-center space-y-4">
                    <h3 className="font-heading text-lg font-bold text-charcoal-600">{t("screen.settings.title")}</h3>
                    <p className="text-sm text-charcoal-400 font-body">{t("screen.settings.subtitle")}</p>

                    <div className="bg-warmgray-100 rounded-2xl p-5 text-left border border-warmgray-200 shadow-inner">
                        <p className="font-semibold text-charcoal-600 mb-3 font-body text-sm flex items-center gap-1.5">
                            <Globe className="w-4 h-4 text-terra-500" /> App Language
                        </p>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                            {SUPPORTED_LANGUAGES.map(lang => {
                                const isActive = language === lang.code;
                                return (
                                    <button
                                        key={lang.code}
                                        onClick={() => setLanguage(lang.code)}
                                        className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all active:scale-95 shadow-warm-sm ${isActive
                                            ? "border-terra-500 bg-terra-500/10 text-terra-600"
                                            : "bg-white border-warmgray-200 text-charcoal-400 hover:border-warmgray-300 hover:text-charcoal-600"
                                            }`}
                                    >
                                        {isActive && <CheckCircle2 className="w-4 h-4 absolute top-2 right-2 text-terra-500 hidden" />}
                                        <span className={`font-heading font-bold text-sm ${isActive ? "text-terra-600" : "text-charcoal-600"}`}>{lang.native}</span>
                                        <span className="text-[10px] font-body mt-0.5">{lang.en}</span>
                                    </button>
                                );
                            })}
                        </div>
                        <p className="text-xs text-charcoal-300 mt-4 font-body text-center bg-white p-2 border border-warmgray-200 rounded-lg">Language choice updates immediately across the menu and dashboard ⚡</p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex min-h-screen bg-cream-100">
            <DemoToggle isDemoMode={useApp().isDemoMode} />

            {/* Desktop Sidebar */}
            <Sidebar />

            {/* Main content area */}
            <div className="flex-1 md:ml-64 lg:ml-72 flex flex-col pb-20 md:pb-0">
                {/* Page Header */}
                <PageHeader title={st.title} subtitle={st.subtitle} />

                {/* Voice Modal */}
                <VoiceModal />

                {/* Screen content */}
                <main className="flex-1">
                    {activeScreen === "home" && <HomeScreen />}
                    {activeScreen === "intake" && <ConversationalIntake />}
                    {activeScreen === "feasibility" && <Module1Feasibility />}
                    {activeScreen === "finance" && <Module2FinancialCalculator />}
                    {activeScreen === "schemes" && <Module3SchemeAdvisor />}
                    {activeScreen === "dashboard" && <DashboardExisting />}
                    {activeScreen === "experts" && <ExpertCommunity />}
                    {activeScreen === "records" && <MyRecords />}
                    {activeScreen === "chat" && <AskBandhu embedded />}
                    {activeScreen === "settings" && <SettingsScreen />}
                </main>
            </div>

            {/* Mobile Bottom Tab Nav */}
            <BottomNav />

            {/* Floating chat bubble (hidden when chat page is active) */}
            {activeScreen !== "chat" && !isChatOpen && (
                <ChatBubbleButton onClick={() => setIsChatOpen(true)} />
            )}
            {activeScreen !== "chat" && isChatOpen && <AskBandhu />}
        </div>
    );
}

/* ── Root App with onboarding flow ── */
function AppRoot() {
    const { isAuthenticated } = useApp();
    const [splashDone, setSplashDone] = useState(false);

    if (!splashDone) return <SplashLanguage onDone={() => setSplashDone(true)} />;
    if (!isAuthenticated) return <MockLogin />;
    return <AuthenticatedApp />;
}

export default function App() {
    return (
        <LanguageProvider>
            <AppProvider>
                <AppRoot />
            </AppProvider>
        </LanguageProvider>
    );
}

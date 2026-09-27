import React from "react";
import { useApp } from "../context/AppContext";
import {
    Home, Store, Calculator, Landmark,
    FileText, MessageSquare, UserCheck, Settings, LogOut, Leaf, Globe
} from "lucide-react";

import { useLanguage } from "../context/LanguageContext";

export default function Sidebar() {
    const { activeScreen, setActiveScreen, profile, logout, businesses, currentBusinessId, setCurrentBusinessId, addBusiness } = useApp();
    const { t, language, setLanguage } = useLanguage();

    const navItems = [
        { id: "home", label: t("nav.home"), icon: Home },
        { id: "dashboard", label: t("nav.dashboard"), icon: Store },
        { id: "finance", label: t("nav.finance"), icon: Calculator },
        { id: "schemes", label: t("nav.schemes"), icon: Landmark },
        { id: "records", label: t("nav.records"), icon: FileText },
        { id: "experts", label: t("nav.community"), icon: UserCheck },
        { id: "chat", label: t("nav.chat"), icon: MessageSquare },
    ];

    return (
        <aside className="w-64 lg:w-72 bg-white border-r border-warmgray-200 h-screen fixed left-0 top-0 flex flex-col z-30 shadow-warm-lg hidden md:flex">
            {/* Brand */}
            <div className="p-6 border-b border-warmgray-200 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-terra-500 to-marigold-500 flex items-center justify-center shadow-warm">
                        <Leaf className="w-5 h-5 text-white stroke-[2.5]" />
                    </div>
                    <div>
                        <h1 className="font-heading font-extrabold text-xl text-charcoal-600 leading-none">
                            {t("app.name").split(" ")[0]} <span className="text-terra-500">{t("app.name").split(" ")[1] || ""}</span>
                        </h1>
                        <p className="text-[10px] text-charcoal-300 font-body font-medium leading-none mt-1">
                            Your business, made simple
                        </p>
                    </div>
                </div>
            </div>

            {/* User Info (Multi-Business Selector) */}
            <div className="p-4 mx-3 mt-4 bg-warmgray-100 rounded-2xl border border-warmgray-200">
                <label className="text-[10px] uppercase font-bold text-charcoal-400 font-body mb-2 block">{t("multi.currentBusiness")}</label>
                <select
                    className="w-full bg-white border border-warmgray-200 rounded-lg p-2 font-heading text-sm font-bold text-charcoal-600 focus:outline-none focus:ring-1 focus:ring-terra-500"
                    value={currentBusinessId}
                    onChange={(e) => {
                        if (e.target.value === "ADD_NEW") {
                            addBusiness({
                                phone: profile.phone, name: profile.name,
                                businessType: "new", businessCategoryKey: "dairy",
                                location: profile.location, ownCapital: 10000,
                                currentMonthlyIncome: 0, currentMonthlyExpenses: 0,
                                hasExistingLoan: false, existingLoanAmount: 0,
                            });
                            setActiveScreen("intake");
                        } else {
                            setCurrentBusinessId(e.target.value);
                        }
                    }}
                >
                    {businesses.map(b => (
                        <option key={b.id} value={b.id}>
                            {b.name ? `${b.name} (${t(b.businessCategoryKey) || b.businessCategoryKey})` : t("nav.guest")}
                        </option>
                    ))}
                    <option value="ADD_NEW" className="font-bold text-terra-500">{t("multi.addBusiness")}</option>
                </select>
                <p className="text-[10px] text-charcoal-400 font-body truncate mt-2">
                    {profile.businessType === "new" ? t("nav.newBusiness") : t("nav.existingBusiness")}
                </p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 custom-scrollbar">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeScreen === item.id || (item.id === "dashboard" && activeScreen === "feasibility"); // group related
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveScreen(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-body text-sm font-bold active:scale-[0.98] ${isActive
                                ? "bg-terra-500/10 text-terra-600 border border-terra-500/20"
                                : "text-charcoal-500 hover:bg-warmgray-100 border border-transparent"
                                }`}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : "stroke-[2] text-charcoal-400"}`} />
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Footer / Language & Settings */}
            <div className="p-4 border-t border-warmgray-200 shrink-0 space-y-2">
                <div className="flex items-center gap-2 bg-warmgray-100 rounded-xl px-2.5 py-1.5 border border-warmgray-200 shadow-inner">
                    <Globe className="w-3.5 h-3.5 text-charcoal-400 shrink-0" />
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="bg-transparent text-xs font-bold text-charcoal-600 font-body focus:outline-none w-full cursor-pointer"
                    >
                        <option value="hi">हिन्दी (Hindi)</option>
                        <option value="en">English</option>
                        <option value="mr">मराठी (Marathi)</option>
                        <option value="ta">தமிழ் (Tamil)</option>
                        <option value="te">తెలుగు (Telugu)</option>
                        <option value="bn">বাংলা (Bengali)</option>
                        <option value="gu">ગુજરાતી (Gujarati)</option>
                        <option value="kn">ಕನ್ನಡ (Kannada)</option>
                    </select>
                </div>
                <button onClick={() => setActiveScreen("settings")} className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl font-body text-sm font-semibold transition-colors ${activeScreen === "settings" ? "bg-terra-500/10 text-terra-600 border border-terra-500/20" : "text-charcoal-500 hover:bg-warmgray-100"}`}>
                    <Settings className="w-4 h-4 text-charcoal-400" /> {t("nav.settings")}
                </button>
                <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-red-500 hover:bg-red-50 font-body text-sm font-semibold transition-colors">
                    <LogOut className="w-4 h-4 text-red-400" /> {t("nav.logout")}
                </button>
            </div>
        </aside>
    );
}

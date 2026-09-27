import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
    Home, Store, Calculator, FileText, MessageSquare,
    Menu, X, Landmark, UserCheck, Settings, LogOut, Leaf
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function BottomNav() {
    const { activeScreen, setActiveScreen, setIsChatOpen, isChatOpen, profile, logout } = useApp();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { t } = useLanguage();

    const tabs = [
        { id: "home", icon: Home, label: t("nav.home") },
        { id: "finance", icon: Calculator, label: t("nav.finance").split(" ")[0] },
        { id: "records", icon: FileText, label: t("nav.records").split(" ")[1] || t("nav.records") },
        { id: "chat", icon: MessageSquare, label: t("nav.chat").split(" ")[0] },
    ];

    const drawerItems = [
        { id: "home", icon: Home, label: t("nav.home") },
        { id: "dashboard", icon: Store, label: t("nav.dashboard") },
        { id: "finance", icon: Calculator, label: t("nav.finance") },
        { id: "schemes", icon: Landmark, label: t("nav.schemes") },
        { id: "records", icon: FileText, label: t("nav.records") },
        { id: "experts", icon: UserCheck, label: t("nav.community") },
        { id: "chat", icon: MessageSquare, label: t("nav.chat") },
    ];

    const go = (id) => { setActiveScreen(id); setDrawerOpen(false); };

    return (
        <>
            {/* Bottom Tab Bar (mobile only) */}
            <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-warmgray-200 px-2 py-2 md:hidden shadow-warm-lg">
                <div className="flex items-center justify-around max-w-md mx-auto">
                    {tabs.map((t) => {
                        const Icon = t.icon;
                        const isActive = activeScreen === t.id;
                        return (
                            <button key={t.id} onClick={() => go(t.id)}
                                className={`flex flex-col items-center py-1 px-3 rounded-2xl transition-all font-body active:scale-95 ${isActive ? "text-terra-600 bg-terra-500/10" : "text-charcoal-400"
                                    }`}>
                                <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : ""}`} />
                                <span className="text-[10px] mt-0.5 font-bold">{t.label}</span>
                            </button>
                        );
                    })}
                    {/* Hamburger for drawer */}
                    <button onClick={() => setDrawerOpen(true)}
                        className="flex flex-col items-center py-1 px-3 rounded-2xl text-charcoal-400 active:scale-95 transition-all">
                        <Menu className="w-5 h-5" />
                        <span className="text-[10px] mt-0.5 font-bold font-body">{t("nav.more")}</span>
                    </button>
                </div>
            </nav>

            {/* Drawer Overlay (mobile) */}
            {drawerOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div className="absolute inset-0 bg-charcoal-700/40 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
                    <div className="absolute right-0 top-0 bottom-0 w-72 bg-white shadow-warm-lg animate-fade-up flex flex-col">
                        {/* Drawer header */}
                        <div className="p-5 border-b border-warmgray-200 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-terra-500 to-marigold-500 flex items-center justify-center">
                                    <Leaf className="w-4 h-4 text-white" />
                                </div>
                                <span className="font-heading font-bold text-charcoal-600">{t("app.name")}</span>
                            </div>
                            <button onClick={() => setDrawerOpen(false)} className="p-1.5 rounded-full bg-warmgray-100 text-charcoal-400 hover:text-charcoal-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* User info */}
                        <div className="p-4 mx-3 mt-3 bg-warmgray-100 rounded-2xl border border-warmgray-200">
                            <p className="font-heading text-sm font-bold text-charcoal-600 truncate">{profile.name || t("nav.guest")}</p>
                            <p className="text-xs text-charcoal-400 font-body">{profile.businessType === "new" ? t("nav.newBusiness") : t("nav.existingBusiness")}</p>
                        </div>

                        {/* Nav items */}
                        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                            {drawerItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = activeScreen === item.id;
                                return (
                                    <button key={item.id} onClick={() => go(item.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-body text-sm font-bold active:scale-[0.98] ${isActive ? "bg-terra-500/10 text-terra-600" : "text-charcoal-500 hover:bg-warmgray-100"
                                            }`}>
                                        <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : "text-charcoal-400"}`} />
                                        <span>{item.label}</span>
                                    </button>
                                );
                            })}
                        </nav>

                        <div className="p-4 border-t border-warmgray-200 space-y-2">
                            <button onClick={() => { setDrawerOpen(false); setActiveScreen('settings'); }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-charcoal-500 hover:bg-warmgray-100 font-body text-sm font-semibold transition-colors">
                                <Settings className="w-4 h-4 text-charcoal-400" /> {t("nav.settings")}
                            </button>
                            <button onClick={() => { logout(); setDrawerOpen(false); }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-500 hover:bg-red-50 font-body text-sm font-semibold transition-colors">
                                <LogOut className="w-4 h-4 text-red-400" /> {t("nav.logout")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

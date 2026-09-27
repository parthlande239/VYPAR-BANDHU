import React from "react";
import { useApp } from "../context/AppContext";
import {
    Rocket, Store, TrendingUp, BadgeIndianRupee,
    AlertTriangle, Landmark, UserCheck, ChevronRight,
    Mic, Sparkles
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function HomeScreen() {
    const { setActiveScreen, setIntentGoal, triggerVoiceModal } = useApp();
    const { t } = useLanguage();

    const go = (screen, goal) => { setIntentGoal(goal); setActiveScreen(screen); };

    const cards = [
        { id: "start", icon: Rocket, emoji: "🟢", bg: "bg-forest-500", ring: "ring-forest-400/30", title: t("home.card.start"), sub: t("home.card.startSub"), screen: "intake", goal: "start" },
        { id: "exist", icon: Store, emoji: "🔵", bg: "bg-blue-500", ring: "ring-blue-400/30", title: t("home.card.exist"), sub: t("home.card.existSub"), screen: "intake", goal: "existing" },
        { id: "grow", icon: TrendingUp, emoji: "🟡", bg: "bg-marigold-500", ring: "ring-marigold-400/30", title: t("home.card.grow"), sub: t("home.card.growSub"), screen: "feasibility", goal: "grow" },
        { id: "money", icon: BadgeIndianRupee, emoji: "🟠", bg: "bg-terra-500", ring: "ring-terra-400/30", title: t("home.card.money"), sub: t("home.card.moneySub"), screen: "finance", goal: "money" },
        { id: "problem", icon: AlertTriangle, emoji: "🔴", bg: "bg-red-500", ring: "ring-red-400/30", title: t("home.card.problem"), sub: t("home.card.problemSub"), screen: "dashboard", goal: "problem" },
        { id: "scheme", icon: Landmark, emoji: "🟣", bg: "bg-purple-500", ring: "ring-purple-400/30", title: t("home.card.scheme"), sub: t("home.card.schemeSub"), screen: "schemes", goal: "schemes" },
        { id: "expert", icon: UserCheck, emoji: "⚪", bg: "bg-charcoal-400", ring: "ring-charcoal-300/30", title: t("home.card.expert"), sub: t("home.card.expertSub"), screen: "experts", goal: "expert" },
    ];

    return (
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-7 animate-fade-up">
            {/* Hero banner */}
            <div className="relative bg-gradient-to-br from-terra-500 via-terra-600 to-marigold-500 rounded-4xl p-7 text-white shadow-warm-lg overflow-hidden">
                {/* Decorative circle */}
                <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -left-6 -bottom-6 w-32 h-32 bg-marigold-400/20 rounded-full blur-xl pointer-events-none" />

                <div className="relative z-10">
                    <div className="badge bg-white/20 text-white border border-white/30 mb-3 text-[11px]">
                        <Sparkles className="w-3 h-3" /> SIH Hackathon Demo
                    </div>
                    <h1 className="font-heading text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight">
                        {t("home.hero.title")}
                    </h1>
                    <p className="text-sm text-white/85 mt-2 max-w-md font-body leading-relaxed">
                        {t("home.hero.sub")}
                    </p>

                    <button
                        onClick={() => triggerVoiceModal(t("home.hero.voice"))}
                        className="mt-4 bg-white text-terra-600 font-heading font-bold px-5 py-3 rounded-2xl flex items-center gap-2 shadow-warm hover:shadow-warm-lg active:scale-95 transition-all text-sm"
                    >
                        <Mic className="w-4 h-4" /> {t("home.hero.voice")}
                    </button>
                </div>
            </div>

            {/* Action card grid */}
            <div>
                <h2 className="font-heading text-base font-bold text-charcoal-400 mb-3 px-1">
                    {t("home.section.todo")}
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {cards.map((c, i) => {
                        const Icon = c.icon;
                        return (
                            <button
                                key={c.id}
                                onClick={() => go(c.screen, c.goal)}
                                className="card-warm p-4 text-left flex flex-col items-start gap-3 group"
                                style={{ animationDelay: `${i * 0.06}s` }}
                            >
                                {/* Icon circle */}
                                <div className={`w-14 h-14 rounded-2xl ${c.bg} ring-4 ${c.ring} flex items-center justify-center shadow-warm-sm transition-transform group-hover:scale-105 group-active:scale-95`}>
                                    <Icon className="w-6 h-6 text-white stroke-[2]" />
                                </div>
                                {/* Label */}
                                <div>
                                    <h3 className="font-heading text-sm font-bold text-charcoal-600 leading-snug">
                                        {c.title}
                                    </h3>
                                    <p className="text-xs text-charcoal-300 font-body mt-0.5">
                                        {c.sub}
                                    </p>
                                </div>
                                {/* Arrow hint */}
                                <div className="self-end mt-auto">
                                    <ChevronRight className="w-4 h-4 text-warmgray-300 group-hover:text-terra-500 transition-colors" />
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Trust footer */}
            <p className="text-center text-xs text-charcoal-300 font-body pb-2">
                {t("home.footer")}
            </p>
        </div>
    );
}

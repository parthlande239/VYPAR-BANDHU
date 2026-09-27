import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { useLanguage } from "../context/LanguageContext";
import { BUSINESS_CATEGORIES } from "../config/businessRules";
import {
    Users, CheckCircle, AlertCircle, TrendingUp, ShieldAlert,
    Tag, Calendar, Sparkles, ArrowRight, Info, Compass
} from "lucide-react";

export default function Module1Feasibility() {
    const { profile, selectBusinessCategory, setActiveScreen } = useApp();
    const { t } = useLanguage();
    const [radius, setRadius] = useState(5);

    const key = profile.businessCategoryKey || "dairy";
    const cat = BUSINESS_CATEGORIES[key] || BUSINESS_CATEGORIES.dairy;
    const reach = Math.round(cat.mockPopulationReach * (radius === 10 ? 1.85 : 1));

    const densityColors = { green: "bg-forest-500/10 text-forest-500 border-forest-400/30", yellow: "bg-marigold-500/10 text-marigold-600 border-marigold-400/30", red: "bg-red-500/10 text-red-600 border-red-400/30" };
    const dc = densityColors[cat.densityBadgeColor] || densityColors.yellow;

    return (
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-5 animate-fade-up">
            {/* Sample-data badge */}
            <div className="flex items-center gap-2 bg-marigold-500/10 border border-marigold-400/30 rounded-2xl px-4 py-3 text-xs text-marigold-600 font-semibold font-body">
                <Info className="w-4 h-4 shrink-0" />
                <span>{t("feas.sampleNotice")}</span>
            </div>

            {/* Header */}
            <div className="card-warm p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <span className="text-4xl">{cat.icon}</span>
                        <div>
                            <h1 className="font-heading text-2xl font-extrabold text-charcoal-600">{t("business.categories." + key) || cat.hindiName}</h1>
                            <p className="text-xs text-charcoal-300 font-body">{cat.name} • {t("feas.marketAnalysis")}</p>
                        </div>
                    </div>
                    <select value={key} onChange={(e) => selectBusinessCategory(e.target.value)}
                        className="bg-warmgray-100 text-sm font-body font-semibold text-charcoal-500 px-3 py-2 rounded-2xl border border-warmgray-200 focus:outline-none focus:ring-2 focus:ring-terra-500/30 cursor-pointer">
                        {Object.entries(BUSINESS_CATEGORIES).map(([k, c]) => (
                            <option key={k} value={k}>{c.icon} {t("business.categories." + k) || c.hindiName}</option>
                        ))}
                    </select>
                </div>
                {profile.location && (
                    <p className="text-sm text-charcoal-400 mt-3 font-body">
                        📍 {t("feas.location")} <strong className="text-charcoal-600">{profile.location || t("feas.yourVillage")}</strong> {t("feas.nearby")}
                    </p>
                )}
            </div>

            {/* Market reach & competitor density */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="card-warm p-5 space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="font-heading text-sm font-bold text-charcoal-500 flex items-center gap-1.5">
                            <Users className="w-4 h-4 text-forest-500" /> {t("feas.customerReach")}
                        </h3>
                        <div className="flex bg-warmgray-100 rounded-xl p-0.5 text-xs border border-warmgray-200">
                            {[5, 10].map((r) => (
                                <button key={r} onClick={() => setRadius(r)}
                                    className={`px-2.5 py-1 rounded-lg font-bold transition-all ${radius === r ? "bg-terra-500 text-white shadow-warm-sm" : "text-charcoal-300"}`}>
                                    {r} km
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="bg-cream-100 rounded-2xl p-4 border border-warmgray-200 flex items-center justify-between">
                        <div>
                            <p className="text-3xl font-heading font-extrabold text-charcoal-600">~{reach.toLocaleString("en-IN")}</p>
                            <p className="text-xs text-charcoal-300 font-body">{t("feas.potentialCustomers")}</p>
                        </div>
                        <span className="text-3xl">🎯</span>
                    </div>
                </div>

                <div className="card-warm p-5 space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="font-heading text-sm font-bold text-charcoal-500 flex items-center gap-1.5">
                            <Compass className="w-4 h-4 text-blue-500" /> {t("feas.competitorLevel")}
                        </h3>
                        <span className={`badge border ${dc}`}>{cat.competitorDensity}</span>
                    </div>
                    <div className="bg-cream-100 rounded-2xl p-4 border border-warmgray-200 space-y-2">
                        <p className="text-xs text-charcoal-400 font-body">
                            {cat.competitorDensity === "Low" ? t("feas.densityLow") : cat.competitorDensity === "Medium" ? t("feas.densityMedium") : t("feas.densityHigh")}
                        </p>
                        <div className="w-full bg-warmgray-200 h-2.5 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${cat.densityBadgeColor === "green" ? "bg-forest-500 w-1/3" : cat.densityBadgeColor === "yellow" ? "bg-marigold-500 w-2/3" : "bg-red-500 w-full"}`} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Opportunities */}
            <div className="card-warm p-5 space-y-3">
                <h3 className="font-heading text-sm font-bold text-charcoal-500 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-marigold-500" /> {t("feas.opportunityFinder")}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {cat.opportunities.map((opp, i) => (
                        <div key={i} className="bg-marigold-500/5 border border-marigold-400/20 rounded-2xl p-4 flex items-start gap-3">
                            <span className="w-7 h-7 rounded-full bg-marigold-500/20 text-marigold-600 font-bold text-xs flex items-center justify-center shrink-0 font-heading">{i + 1}</span>
                            <p className="text-xs text-charcoal-500 font-body leading-relaxed">{opp}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* SWOT — 4 color-coded cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                    { title: t("feas.swot.good"), en: "What's good", text: cat.swot.good, color: "border-forest-400/30 bg-forest-500/5", icon: CheckCircle, iconColor: "text-forest-500" },
                    { title: t("feas.swot.difficult"), en: "What's difficult", text: cat.swot.difficult, color: "border-marigold-400/30 bg-marigold-500/5", icon: AlertCircle, iconColor: "text-marigold-600" },
                    { title: t("feas.swot.opportunity"), en: "Opportunity", text: cat.swot.opportunity, color: "border-blue-400/30 bg-blue-500/5", icon: TrendingUp, iconColor: "text-blue-500" },
                    { title: t("feas.swot.threat"), en: "Watch out for", text: cat.swot.wrong, color: "border-red-400/30 bg-red-500/5", icon: ShieldAlert, iconColor: "text-red-500" },
                ].map((s, i) => {
                    const Icon = s.icon;
                    return (
                        <div key={i} className={`rounded-3xl p-4 border ${s.color}`}>
                            <div className="flex items-center gap-1.5 mb-2">
                                <Icon className={`w-4 h-4 ${s.iconColor}`} />
                                <span className="font-heading text-xs font-bold text-charcoal-500">{s.title}</span>
                                <span className="text-[10px] text-charcoal-300 font-body">({s.en})</span>
                            </div>
                            <p className="text-xs text-charcoal-400 font-body leading-relaxed">{s.text}</p>
                        </div>
                    );
                })}
            </div>

            {/* Price advisor & seasonality */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="card-warm p-5 space-y-3">
                    <h3 className="font-heading text-sm font-bold text-charcoal-500 flex items-center gap-1.5">
                        <Tag className="w-4 h-4 text-terra-500" /> {t("feas.priceAdvice")}
                    </h3>
                    <div className="bg-cream-100 rounded-2xl p-4 border border-warmgray-200 space-y-2">
                        <p className="text-xs text-charcoal-300 font-body">{t("feas.marketRate")}</p>
                        <p className="text-sm font-bold text-charcoal-600 font-body">{cat.priceRange}</p>
                        <div className="pt-2 border-t border-warmgray-200">
                            <p className="text-xs text-terra-500 font-semibold font-body">{t("feas.suggestedPrice")}</p>
                            <p className="text-base font-heading font-extrabold text-terra-600 mt-0.5">{cat.suggestedStartingPrice}</p>
                        </div>
                    </div>
                </div>

                <div className="card-warm p-5 space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="font-heading text-sm font-bold text-charcoal-500 flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-purple-500" /> {t("feas.seasonCalendar")}
                        </h3>
                        <div className="flex items-center gap-2 text-[10px] font-body">
                            <span className="flex items-center gap-1 text-forest-500"><span className="w-2 h-2 rounded-full bg-forest-500" /> High</span>
                            <span className="flex items-center gap-1 text-red-500"><span className="w-2 h-2 rounded-full bg-red-500" /> Risk</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-12 gap-0.5 items-end h-20 pt-2 pb-1 border-b border-warmgray-200">
                        {cat.seasonality.map((m, i) => (
                            <div key={i} className="flex flex-col items-center gap-1">
                                <div className={`w-full rounded-t transition-all ${m.level === "High" ? "bg-forest-500" : m.level === "Normal" ? "bg-blue-400" : "bg-red-400"}`}
                                    style={{ height: `${m.score}%` }} />
                                <span className="text-[8px] text-charcoal-300 font-body font-semibold">{m.month}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA → Module 2 */}
            <div className="bg-gradient-to-r from-terra-500 to-marigold-500 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-warm-lg text-white">
                <div>
                    <h3 className="font-heading text-lg font-bold">
                        {t("feas.ctaTitle")}
                    </h3>
                    <p className="text-xs text-white/80 mt-0.5 font-body">{t("feas.ctaSub")}</p>
                </div>
                <button onClick={() => setActiveScreen("finance")}
                    className="w-full sm:w-auto shrink-0 bg-white text-terra-600 font-heading font-bold px-6 py-3 rounded-2xl shadow-warm flex items-center justify-center gap-2 text-sm active:scale-95 transition-all hover:shadow-warm-lg">
                    {t("feas.viewLoan")} <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
            </div>
        </div>
    );
}

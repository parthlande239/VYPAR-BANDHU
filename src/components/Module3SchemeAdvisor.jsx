import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { useLanguage } from "../context/LanguageContext";
import { GOVERNMENT_SCHEMES_LIST } from "../config/businessRules";
import { ExternalLink, Gift, ArrowRight, Filter, Sparkles } from "lucide-react";

export default function Module3SchemeAdvisor() {
    const { profile, updateProfileField, setActiveScreen, triggerVoiceModal } = useApp();
    const { t, language } = useLanguage();
    const [filter, setFilter] = useState("all");

    const filtered = GOVERNMENT_SCHEMES_LIST.filter((s) => filter === "all" || s.category === filter);
    const applySubsidy = (amt) => { updateProfileField("grantSubsidy", amt); setActiveScreen("finance"); };

    return (
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-5 animate-fade-up">
            {/* Header */}
            <div className="card-warm p-6">
                <div className="flex items-center gap-3">
                    <span className="text-4xl">🏛️</span>
                    <div>
                        <h1 className="font-heading text-xl font-extrabold text-charcoal-600">{t("sch.title")}</h1>
                        <p className="text-xs text-charcoal-300 font-body">{t("sch.sub")}</p>
                    </div>
                </div>
            </div>

            {/* Subsidy reducer */}
            <div className="card-warm p-5 space-y-3">
                <h3 className="font-heading text-sm font-bold text-charcoal-500 flex items-center gap-1.5">
                    <Gift className="w-4 h-4 text-purple-500" /> {t("sch.benTitle")}
                </h3>
                <p className="text-xs text-charcoal-300 font-body">{t("sch.benSub")}</p>
                <div className="flex flex-col sm:flex-row items-center gap-3 bg-cream-100 p-4 rounded-2xl border border-warmgray-200">
                    <div className="flex-1 w-full">
                        <label className="block text-[11px] text-charcoal-300 mb-1 font-body">{t("sch.estSub")}</label>
                        <div className="relative">
                            <span className="absolute left-3 top-2 text-purple-500 font-bold text-sm">₹</span>
                            <input type="number" value={profile.grantSubsidy}
                                onChange={(e) => updateProfileField("grantSubsidy", Number(e.target.value))}
                                placeholder="25,000"
                                className="w-full bg-white border border-warmgray-200 rounded-xl pl-7 pr-3 py-2 text-charcoal-600 font-bold text-sm font-body focus:outline-none focus:ring-2 focus:ring-terra-500/20"
                            />
                        </div>
                    </div>
                    <button onClick={() => applySubsidy(profile.grantSubsidy)}
                        className="btn-primary !text-xs w-full sm:w-auto flex items-center justify-center gap-1.5 shrink-0 mt-auto">
                        {t("sch.viewCalc")} <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Filter tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                <Filter className="w-3.5 h-3.5 text-charcoal-300 shrink-0" />
                {[
                    { val: "all", label: t("sch.all") },
                    { val: "general", label: t("sch.mudra") },
                    { val: "women_shg", label: t("sch.women") },
                ].map((f) => (
                    <button key={f.val} onClick={() => setFilter(f.val)}
                        className={`px-3 py-1.5 rounded-xl font-bold font-body whitespace-nowrap transition-all ${filter === f.val ? "bg-terra-500 text-white shadow-warm-sm" : "bg-warmgray-100 text-charcoal-300 border border-warmgray-200 hover:border-warmgray-300"
                            }`}>
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Scheme cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filtered.map((s) => (
                    <div key={s.id} className="card-warm p-5 space-y-3 flex flex-col justify-between">
                        <div className="space-y-2">
                            <span className="badge bg-terra-500/10 text-terra-600 border border-terra-400/30 text-[10px]">{s.category}</span>
                            <h3 className="font-heading text-base font-bold text-charcoal-600">{t("schemes." + s.id, language === "hi" ? s.hindiName : s.name)}</h3>
                            <p className="text-xs text-charcoal-300 font-body">{language === "hi" ? s.name : s.hindiName}</p>
                            <div className="grid grid-cols-2 gap-2 text-xs font-body pt-1">
                                <div className="bg-cream-100 p-2.5 rounded-xl border border-warmgray-200">
                                    <span className="text-charcoal-300">{t("sch.maxLoan")}</span>
                                    <p className="font-bold text-forest-600">{s.maxLoan}</p>
                                </div>
                                <div className="bg-cream-100 p-2.5 rounded-xl border border-warmgray-200">
                                    <span className="text-charcoal-300">{t("sch.subsidy")}</span>
                                    <p className="font-bold text-purple-600">{s.subsidy}</p>
                                </div>
                            </div>
                            <div className="text-xs space-y-1 font-body">
                                <p><strong className="text-charcoal-500">{t("sch.elig")}</strong> <span className="text-charcoal-400">{s.eligibility}</span></p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {s.documents.map((d, i) => (
                                        <span key={i} className="bg-warmgray-100 text-charcoal-400 text-[10px] px-2 py-0.5 rounded border border-warmgray-200">{d}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="pt-2 border-t border-warmgray-200 flex items-center justify-between">
                            <button onClick={() => applySubsidy(25000)} className="text-xs text-forest-600 hover:underline font-bold flex items-center gap-1 font-body">
                                <Gift className="w-3 h-3" /> {t("sch.addSub")}
                            </button>
                            <a href={s.officialLink} target="_blank" rel="noreferrer"
                                className="text-xs text-charcoal-300 hover:text-charcoal-500 flex items-center gap-1 bg-warmgray-100 px-2.5 py-1 rounded-lg border border-warmgray-200 font-body">
                                {t("sch.portal")} <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

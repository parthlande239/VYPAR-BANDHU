import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { BUSINESS_CATEGORIES } from "../config/businessRules";
import { Mic, ArrowRight, ArrowLeft, MapPin, Sparkles } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function ConversationalIntake() {
    const { profile, updateProfileField, selectBusinessCategory, setActiveScreen, intentGoal, triggerVoiceModal } = useApp();
    const { t } = useLanguage();
    const [step, setStep] = useState(1);
    const total = 4;

    const next = () => {
        if (step < total) return setStep(step + 1);
        if (intentGoal === "existing" || profile.businessType === "existing") return setActiveScreen("dashboard");
        if (intentGoal === "money") return setActiveScreen("finance");
        setActiveScreen("feasibility");
    };
    const back = () => (step > 1 ? setStep(step - 1) : setActiveScreen("home"));

    const questions = [
        t("q.nameLocation") || "Hello! Tell us your name and village 🙏",
        t("q.businessType") || "What type of business do you want to start?",
        t("q.capital") || "How much capital (in ₹) do you have?",
        t("q.existingLoan") || "Do you have any existing loan outstanding?",
    ];
    const subtext = [
        "Tell us your name, preferred language, and village/district.",
        "Select your business category and whether it is new or existing.",
        "Enter your own margin capital to calculate project capacity.",
        "Do you have any existing ongoing loan installments?",
    ];

    return (
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-5 animate-fade-up">
            {/* Progress header */}
            <div className="card-warm p-4 flex items-center justify-between">
                <button onClick={back} className="flex items-center gap-1 text-charcoal-300 hover:text-terra-500 text-xs font-semibold font-body transition-colors">
                    <ArrowLeft className="w-4 h-4" /> {t("btn.back")}
                </button>
                <span className="font-heading text-sm font-bold text-terra-500">
                    {t("intake.step")} {step} / {total}
                </span>
                <button
                    onClick={() => triggerVoiceModal(`Step ${step}`)}
                    className="flex items-center gap-1 text-xs font-bold text-terra-500 bg-terra-500/10 px-2.5 py-1.5 rounded-xl font-body"
                >
                    <Mic className="w-3.5 h-3.5" /> {t("phrase.speakShort")}
                </button>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-warmgray-200 rounded-full h-2 overflow-hidden">
                <div
                    className="h-full rounded-full bg-gradient-to-r from-terra-500 to-marigold-500 transition-all duration-500 ease-out"
                    style={{ width: `${(step / total) * 100}%` }}
                />
            </div>

            {/* Chat bubble — Bandhu avatar */}
            <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-terra-500 to-marigold-500 flex items-center justify-center text-white text-xl shrink-0 shadow-warm-sm">
                    🤝
                </div>
                <div className="card-warm p-5 flex-1 rounded-tl-md">
                    <p className="font-heading text-base font-bold text-charcoal-600">{questions[step - 1]}</p>
                    <p className="text-xs text-charcoal-300 mt-1 font-body">{subtext[step - 1]}</p>
                </div>
            </div>

            {/* Input area */}
            <div className="card-warm p-6 space-y-5">

                {/* STEP 1 — name & location */}
                {step === 1 && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-charcoal-400 mb-1.5 font-body">{t("intake.label.name")}</label>
                            <input
                                type="text" value={profile.name}
                                onChange={(e) => updateProfileField("name", e.target.value)}
                                placeholder={t("intake.placeholder.name")}
                                className="w-full bg-warmgray-100 border border-warmgray-200 rounded-2xl px-4 py-3 text-charcoal-600 focus:outline-none focus:ring-2 focus:ring-terra-500/30 focus:border-terra-500 text-sm font-body"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-charcoal-400 mb-1.5 font-body">{t("intake.label.location")}</label>
                            <div className="relative">
                                <MapPin className="w-4 h-4 text-charcoal-300 absolute left-3.5 top-3.5" />
                                <input
                                    type="text" value={profile.location}
                                    onChange={(e) => updateProfileField("location", e.target.value)}
                                    placeholder={t("intake.placeholder.location")}
                                    className="w-full bg-warmgray-100 border border-warmgray-200 rounded-2xl pl-10 pr-4 py-3 text-charcoal-600 focus:outline-none focus:ring-2 focus:ring-terra-500/30 focus:border-terra-500 text-sm font-body"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 2 — business type & category */}
                {step === 2 && (
                    <div className="space-y-5">
                        <div>
                            <label className="block text-xs font-semibold text-charcoal-400 mb-2 font-body">{t("q.businessAge")}</label>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { val: "new", emoji: "🌱", key: "opt.new" },
                                    { val: "existing", emoji: "🏬", key: "opt.existing" },
                                ].map((o) => (
                                    <button key={o.val} onClick={() => updateProfileField("businessType", o.val)}
                                        className={`p-4 rounded-2xl border-2 text-left flex items-center gap-3 transition-all active:scale-[0.97]
                      ${profile.businessType === o.val
                                                ? "border-terra-500 bg-terra-500/5 shadow-warm-sm"
                                                : "border-warmgray-200 bg-white hover:border-warmgray-300"}`}
                                    >
                                        <span className="text-2xl">{o.emoji}</span>
                                        <div>
                                            <div className="text-sm font-heading font-bold text-charcoal-600">{t(o.key)}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-charcoal-400 mb-2 font-body">{t("intake.label.selectCategory")}</label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                                {Object.entries(BUSINESS_CATEGORIES).map(([key, cat]) => (
                                    <button key={key} onClick={() => selectBusinessCategory(key)}
                                        className={`p-3.5 rounded-2xl border-2 text-left transition-all active:scale-[0.97]
                      ${profile.businessCategoryKey === key
                                                ? "border-terra-500 bg-terra-500/5 shadow-warm-sm"
                                                : "border-warmgray-200 bg-white hover:border-warmgray-300"}`}
                                    >
                                        <span className="text-2xl block mb-1">{cat.icon}</span>
                                        <div className="font-heading text-xs font-bold text-charcoal-600 leading-snug">{t("business.categories." + key) || cat.hindiName}</div>
                                        <div className="text-[10px] text-charcoal-300 font-body mt-0.5">{cat.name}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 3 — capital */}
                {step === 3 && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-charcoal-400 mb-1.5 font-body">
                                {t("intake.label.ownSavings")}
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-3 text-terra-500 font-bold text-base">₹</span>
                                <input type="number" value={profile.ownCapital}
                                    onChange={(e) => updateProfileField("ownCapital", Number(e.target.value))}
                                    className="w-full bg-warmgray-100 border border-warmgray-200 rounded-2xl pl-9 pr-4 py-3 text-charcoal-600 text-lg font-bold font-body focus:outline-none focus:ring-2 focus:ring-terra-500/30 focus:border-terra-500"
                                />
                            </div>
                            <p className="text-xs text-terra-500 mt-1.5 flex items-center gap-1 font-body">
                                <Sparkles className="w-3.5 h-3.5" />
                                ₹{(profile.ownCapital || 0).toLocaleString("en-IN")} {t("intake.label.savings")} = ₹{((profile.ownCapital || 0) / 0.1).toLocaleString("en-IN")} {t("intake.label.projectCapacity")}
                            </p>
                        </div>
                        {profile.businessType === "existing" && (
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-charcoal-400 mb-1 font-body">{t("intake.label.monthlyIncome")}</label>
                                    <input type="number" value={profile.currentMonthlyIncome}
                                        onChange={(e) => updateProfileField("currentMonthlyIncome", Number(e.target.value))}
                                        className="w-full bg-warmgray-100 border border-warmgray-200 rounded-2xl px-3 py-2.5 text-sm font-body"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-charcoal-400 mb-1 font-body">{t("intake.label.monthlyExpense")}</label>
                                    <input type="number" value={profile.currentMonthlyExpenses}
                                        onChange={(e) => updateProfileField("currentMonthlyExpenses", Number(e.target.value))}
                                        className="w-full bg-warmgray-100 border border-warmgray-200 rounded-2xl px-3 py-2.5 text-sm font-body"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* STEP 4 — existing loan */}
                {step === 4 && (
                    <div className="space-y-4">
                        <label className="block text-xs font-semibold text-charcoal-400 mb-2 font-body">
                            {t("intake.label.existingLoan")}
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { val: false, label: t("intake.opt.no"), emoji: "✅" },
                                { val: true, label: t("intake.opt.yes"), emoji: "📋" },
                            ].map((o) => (
                                <button key={String(o.val)} onClick={() => updateProfileField("hasExistingLoan", o.val)}
                                    className={`p-4 rounded-2xl border-2 text-center font-heading font-bold transition-all active:scale-[0.97]
                    ${profile.hasExistingLoan === o.val
                                            ? "border-terra-500 bg-terra-500/5 shadow-warm-sm"
                                            : "border-warmgray-200 bg-white hover:border-warmgray-300"}`}
                                >
                                    <span className="text-xl block mb-1">{o.emoji}</span>
                                    {o.label}
                                </button>
                            ))}
                        </div>
                        {profile.hasExistingLoan && (
                            <div>
                                <label className="block text-xs font-semibold text-charcoal-400 mb-1 font-body">{t("intake.label.emiAmount")}</label>
                                <input type="number" value={profile.existingLoanAmount}
                                    onChange={(e) => updateProfileField("existingLoanAmount", Number(e.target.value))}
                                    placeholder="₹ 2,000"
                                    className="w-full bg-warmgray-100 border border-warmgray-200 rounded-2xl px-4 py-3 text-sm font-body"
                                />
                            </div>
                        )}
                    </div>
                )}

                {/* Nav buttons */}
                <div className="pt-3 flex items-center gap-3 border-t border-warmgray-200">
                    <button onClick={() => triggerVoiceModal(t("voice.tapToSpeak"))}
                        className="btn-subtle flex items-center gap-1.5 text-xs !px-4">
                        <Mic className="w-4 h-4 text-terra-500" /> {t("phrase.speakShort")}
                    </button>
                    <button onClick={next} className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm">
                        {step === total ? `${t("btn.submit")} →` : `${t("btn.next")} →`}
                    </button>
                </div>
            </div>
        </div>
    );
}

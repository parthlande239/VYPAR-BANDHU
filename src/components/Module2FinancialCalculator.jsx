import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { useLanguage } from "../context/LanguageContext";
import { calculateFinancials, BUSINESS_CATEGORIES } from "../config/businessRules";
import {
    Calculator, ShieldCheck, ArrowRight, Sparkles,
    CheckCircle, ChevronDown, ChevronUp, RefreshCw,
    Gift, ArrowDown
} from "lucide-react";

export default function Module2FinancialCalculator() {
    const { profile, updateProfileField, selectBusinessCategory, setActiveScreen, triggerVoiceModal } = useApp();
    const { t } = useLanguage();
    const [showMath, setShowMath] = useState(true);

    const fin = calculateFinancials({
        ownCapital: profile.ownCapital,
        equipment: profile.equipmentCost,
        stock: profile.stockCost,
        setup: profile.setupCost,
        workingCapital: profile.workingCapitalCost,
        subsidy: profile.grantSubsidy,
        moratoriumOption: profile.moratoriumOption,
    });
    const cat = BUSINESS_CATEGORIES[profile.businessCategoryKey] || BUSINESS_CATEGORIES.dairy;

    const fmt = (n) => (n || 0).toLocaleString("en-IN");

    const decisionColors = {
        green: "bg-forest-500/10 border-forest-400/30 text-forest-600",
        yellow: "bg-marigold-500/10 border-marigold-400/30 text-marigold-600",
        orange: "bg-terra-500/10 border-terra-400/30 text-terra-600",
    };
    const dc = decisionColors[fin.loanDecisionBadge] || decisionColors.orange;

    return (
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-5 animate-fade-up">
            {/* Real math notice */}
            <div className="flex items-center gap-2.5 bg-forest-500/10 border border-forest-400/30 rounded-2xl px-4 py-3 text-xs text-forest-600 font-semibold font-body">
                <ShieldCheck className="w-5 h-5 shrink-0" />
                <span><strong>{t("fin.notice")}</strong></span>
            </div>

            {/* Header */}
            <div className="card-warm p-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-terra-500 to-marigold-500 flex items-center justify-center text-white text-2xl shadow-warm-sm">🧮</div>
                    <div>
                        <h1 className="font-heading text-xl sm:text-2xl font-extrabold text-charcoal-600">
                            {t("fin.title")}
                        </h1>
                        <p className="text-xs text-charcoal-300 font-body">{cat.icon} {t("business.categories." + profile.businessCategoryKey, cat.name)} • {t("fin.sub")}</p>
                    </div>
                </div>
            </div>

            {/* ── VISUAL STEP FLOW ── */}

            {/* STEP 1 → Own capital input */}
            <div className="card-warm p-6 space-y-4 relative">
                <div className="badge bg-terra-500/10 text-terra-600 border border-terra-400/30 text-[11px]">
                    {t("fin.step1")}
                </div>
                <h2 className="font-heading text-base font-bold text-charcoal-600 flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-terra-500" /> {t("fin.capitalTitle")}
                </h2>

                {/* Own capital */}
                <div className="bg-terra-500/5 border border-terra-400/20 rounded-2xl p-4 space-y-2">
                    <label className="block text-xs font-bold text-terra-600 uppercase tracking-wider font-body">
                        {t("fin.ownCap")}
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-2.5 text-terra-500 font-bold text-lg">₹</span>
                        <input type="number" value={profile.ownCapital}
                            onChange={(e) => updateProfileField("ownCapital", Number(e.target.value))}
                            className="w-full bg-white border border-warmgray-200 rounded-2xl pl-9 pr-4 py-3 text-xl font-extrabold text-charcoal-600 font-body focus:outline-none focus:ring-2 focus:ring-terra-500/30 focus:border-terra-500"
                        />
                    </div>
                    <p className="text-xs text-terra-500 font-body">
                        {t("fin.projCap")} <strong>₹{fmt(fin.maxProjectCostCapacity)}</strong> | {t("fin.maxLoan")} <strong>₹{fmt(fin.maxFinancingCapacity)}</strong>
                    </p>
                </div>

                {/* Breakdown */}
                <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-charcoal-400 font-body">{t("fin.breakdownTitle")}</p>
                        <button onClick={() => selectBusinessCategory(profile.businessCategoryKey)}
                            className="text-[11px] text-terra-500 hover:underline flex items-center gap-1 font-body font-semibold">
                            <RefreshCw className="w-3 h-3" /> {t("fin.standardRates")}
                        </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {[
                            { field: "equipmentCost", label: t("fin.eq") },
                            { field: "stockCost", label: t("fin.st") },
                            { field: "setupCost", label: t("fin.set") },
                            { field: "workingCapitalCost", label: t("fin.wc") },
                        ].map((f) => (
                            <div key={f.field}>
                                <label className="block text-[11px] text-charcoal-300 mb-1 font-body">{f.label}</label>
                                <input type="number" value={profile[f.field]}
                                    onChange={(e) => updateProfileField(f.field, Number(e.target.value))}
                                    className="w-full bg-warmgray-100 border border-warmgray-200 rounded-xl px-3 py-2 text-charcoal-600 font-bold text-sm font-body focus:outline-none focus:ring-2 focus:ring-terra-500/20"
                                />
                            </div>
                        ))}
                    </div>
                    {/* Subsidy */}
                    <div className="bg-warmgray-100 rounded-2xl p-3.5 border border-warmgray-200 flex flex-col sm:flex-row items-center gap-3">
                        <div className="flex items-center gap-2 flex-1">
                            <Gift className="w-4 h-4 text-purple-500 shrink-0" />
                            <div>
                                <span className="text-xs font-bold text-charcoal-500 font-body">{t("fin.subTitle")}</span>
                                <p className="text-[10px] text-charcoal-300 font-body">{t("fin.subHelp")}</p>
                            </div>
                        </div>
                        <div className="relative w-full sm:w-44">
                            <span className="absolute left-3 top-2 text-charcoal-300 text-xs font-body">₹</span>
                            <input type="number" value={profile.grantSubsidy}
                                onChange={(e) => updateProfileField("grantSubsidy", Number(e.target.value))}
                                placeholder="0"
                                className="w-full bg-white border border-warmgray-200 rounded-xl pl-7 pr-3 py-1.5 text-charcoal-600 font-bold text-xs font-body focus:outline-none focus:ring-2 focus:ring-terra-500/20"
                            />
                        </div>
                    </div>
                </div>

                {/* Connector arrow */}
                <div className="flex justify-center pt-1"><ArrowDown className="w-5 h-5 text-warmgray-300" /></div>
            </div>

            {/* STEP 2 → Loan decision & safe borrowing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Decision card */}
                <div className="card-warm p-5 space-y-3">
                    <div className="badge bg-terra-500/10 text-terra-600 border border-terra-400/30 text-[11px]">{t("fin.step2")}</div>
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-charcoal-300 uppercase tracking-wider font-body">{t("fin.loanDec")}</span>
                        <span className={`badge border ${dc}`}>
                            {fin.loanDecisionCategory === "no_loan" ? t("fin.decision.noLoan", "No Loan") : fin.loanDecisionCategory === "small_loan" ? t("fin.decision.smallLoan", "Small Loan") : t("fin.decision.loanNeeded", "Loan Needed")}
                        </span>
                    </div>
                    <p className="font-heading text-base font-bold text-charcoal-600">{t("fin.loanDecision." + fin.loanDecisionCategory, fin.loanDecisionText)}</p>
                    <div className="bg-cream-100 rounded-2xl p-3.5 border border-warmgray-200 space-y-1.5 text-xs text-charcoal-400 font-body">
                        <div className="flex justify-between"><span>{t("fin.totalNeed", "Total Need")}:</span><span className="font-bold text-charcoal-600">₹{fmt(fin.actualNeed)}</span></div>
                        {fin.subsidy > 0 && <div className="flex justify-between text-purple-500"><span>{t("fin.subsidyLabel", "Subsidy")}:</span><span>- ₹{fmt(fin.subsidy)}</span></div>}
                        <div className="flex justify-between"><span>{t("fin.ownSavingsLabel", "Own Savings")}:</span><span className="font-bold text-forest-600">- ₹{fmt(fin.capital)}</span></div>
                        <div className="pt-1.5 border-t border-warmgray-200 flex justify-between font-bold text-sm text-charcoal-600">
                            <span>{t("fin.gapLabel", "Loan Gap")}:</span>
                            <span className="text-terra-600">₹{fmt(fin.loanNeedGap)}</span>
                        </div>
                    </div>
                </div>

                {/* Safe borrowing card */}
                <div className="card-warm p-5 space-y-3">
                    <h3 className="flex items-center gap-1.5 font-heading text-sm font-bold text-charcoal-500">
                        <ShieldCheck className="w-4 h-4 text-forest-500" /> {t("fin.safeBorrow")}
                    </h3>
                    <p className="text-xs text-charcoal-400 font-body">
                        {t("fin.maxEligible")} <strong className="text-charcoal-600">₹{fmt(fin.maxAllowedByScheme)}</strong>
                    </p>
                    <div className="bg-forest-500/5 border border-forest-400/20 rounded-2xl p-4">
                        <p className="text-[11px] text-forest-600 font-bold uppercase tracking-wider font-body">{t("fin.recBorrow")}</p>
                        <p className="text-3xl font-heading font-extrabold text-charcoal-600 mt-1">₹{fmt(fin.recommendedBorrowing)}</p>
                        <p className="text-[11px] text-charcoal-300 font-body mt-1">
                            {t("fin.recSub")}
                        </p>
                    </div>
                </div>
            </div>

            {/* Connector */}
            <div className="flex justify-center"><ArrowDown className="w-5 h-5 text-warmgray-300" /></div>

            {/* STEP 3 → Scheme selection */}
            <div className="bg-gradient-to-br from-cream-200 to-white rounded-3xl p-6 border border-terra-400/20 shadow-warm space-y-4">
                <div className="badge bg-terra-500/10 text-terra-600 border border-terra-400/30 text-[11px]">{t("fin.step3")}</div>
                <div className="flex items-center gap-3">
                    <span className="text-3xl">🏛️</span>
                    <div>
                        <p className="text-[11px] text-terra-500 font-bold uppercase tracking-wider font-body">{t("fin.selScheme")}</p>
                        <h3 className="font-heading text-lg font-extrabold text-charcoal-600">{t("schemeTier." + fin.selectedScheme.id, fin.selectedScheme.name)}</h3>
                    </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-body">
                    {[
                        { label: t("fin.intRate"), val: `${fin.selectedScheme.interestRate}%`, color: "text-forest-600" },
                        { label: t("fin.tenure"), val: `${fin.selectedScheme.tenureYears} yrs`, color: "text-charcoal-600" },
                        { label: t("fin.mora"), val: `${fin.selectedScheme.moratoriumMonths} mo`, color: "text-marigold-600" },
                        { label: t("fin.finType"), val: "upto 90%", color: "text-blue-600" },
                    ].map((m, i) => (
                        <div key={i} className="bg-white rounded-2xl p-3 border border-warmgray-200">
                            <span className="text-charcoal-300">{m.label}</span>
                            <p className={`text-sm font-bold ${m.color} font-heading mt-0.5`}>{m.val}</p>
                        </div>
                    ))}
                </div>
                <div className="bg-white rounded-2xl p-3.5 border border-warmgray-200">
                    <p className="text-[11px] font-bold text-terra-500 mb-1 font-body">{t("fin.keyBen")}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-charcoal-400 font-body">
                        {fin.selectedScheme.keyBenefits.map((b, i) => (
                            <div key={i} className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-forest-500 shrink-0" />{b}</div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex justify-center"><ArrowDown className="w-5 h-5 text-warmgray-300" /></div>

            {/* STEP 4 → EMI calculator */}
            <div className="card-warm p-6 space-y-5">
                <div className="badge bg-terra-500/10 text-terra-600 border border-terra-400/30 text-[11px]">{t("fin.step4")}</div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                        <h2 className="font-heading text-lg font-bold text-charcoal-600">{t("fin.emiTitle")}</h2>
                        <p className="text-xs text-charcoal-300 font-body">{t("fin.emiSub")}</p>
                    </div>
                    <div className="flex bg-warmgray-100 rounded-xl p-1 text-xs border border-warmgray-200 font-body">
                        {["interest_only", "deferred"].map((opt) => (
                            <button key={opt} onClick={() => updateProfileField("moratoriumOption", opt)}
                                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${profile.moratoriumOption === opt ? "bg-terra-500 text-white shadow-warm-sm" : "text-charcoal-300"}`}>
                                {opt === "interest_only" ? t("fin.intOnly") : t("fin.zeroPay")}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                    {/* Moratorium pay */}
                    <div className="bg-marigold-500/5 p-4 rounded-2xl border border-marigold-400/20">
                        <p className="text-[11px] text-marigold-600 font-bold uppercase tracking-wider font-body">
                            {t("fin.moraPay")} {fin.moratoriumMonths} {t("fin.moraSub")}
                        </p>
                        <p className="text-2xl font-heading font-extrabold text-charcoal-600 mt-1">
                            ₹{fmt(fin.moratoriumMonthlyPayment)} <span className="text-xs font-normal text-charcoal-300">/mo</span>
                        </p>
                    </div>
                    {/* Regular EMI */}
                    <div className="bg-terra-500/5 p-4 rounded-2xl border border-terra-400/20">
                        <p className="text-[11px] text-terra-600 font-bold uppercase tracking-wider font-body">{t("fin.regEmi")}</p>
                        <p className="text-3xl font-heading font-extrabold text-terra-600 mt-1">
                            ₹{fmt(fin.standardEMI)} <span className="text-xs font-normal text-charcoal-300">/mo</span>
                        </p>
                    </div>
                    {/* Total interest */}
                    <div className="bg-cream-100 p-4 rounded-2xl border border-warmgray-200">
                        <p className="text-[11px] text-charcoal-300 font-bold uppercase tracking-wider font-body">{t("fin.totInt")}</p>
                        <p className="text-2xl font-heading font-extrabold text-charcoal-600 mt-1">₹{fmt(fin.totalInterestPaid)}</p>
                    </div>
                </div>
            </div>

            {/* Transparent math accordion */}
            <div className="card-warm p-5 space-y-3">
                <button onClick={() => setShowMath(!showMath)} className="w-full flex items-center justify-between text-left">
                    <span className="font-heading text-sm font-bold text-charcoal-500 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-terra-500" /> {t("fin.stepMath")}
                    </span>
                    {showMath ? <ChevronUp className="w-5 h-5 text-charcoal-300" /> : <ChevronDown className="w-5 h-5 text-charcoal-300" />}
                </button>
            </div>

            {/* Link to schemes */}
            <div className="card-warm p-4 flex items-center justify-between">
                <span className="text-xs text-charcoal-400 font-body">{t("fin.schemeDetail")}</span>
                <button onClick={() => setActiveScreen("schemes")}
                    className="btn-primary !px-5 !py-2.5 !text-xs flex items-center gap-1.5">
                    {t("fin.viewScheme")} <ArrowRight className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
}

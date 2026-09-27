import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Leaf, ShieldCheck, Globe, ArrowRight, Smartphone } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function MockLogin() {
    const { login } = useApp();
    const { language, setLanguage, t } = useLanguage();
    const [step, setStep] = useState("phone"); // phone | otp | mode
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [isNew, setIsNew] = useState(true);

    const sendOtp = () => {
        if (phone.length >= 10) setStep("otp");
    };
    const verifyOtp = () => {
        if (otp.length >= 4) setStep("mode");
    };
    const proceed = () => login(isNew);

    return (
        <div className="min-h-screen bg-cream-100 flex items-center justify-center px-4 py-8 animate-fade-up">
            <div className="w-full max-w-sm space-y-6">
                {/* Brand header */}
                <div className="text-center">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-terra-500 to-marigold-500 flex items-center justify-center shadow-warm mx-auto mb-3">
                        <Leaf className="w-7 h-7 text-white stroke-[2.5]" />
                    </div>
                    <h1 className="font-heading text-2xl font-extrabold text-charcoal-600">
                        {t("app.name").split(" ")[0]} <span className="text-terra-500">{t("app.name").split(" ")[1] || ""}</span>
                    </h1>
                </div>

                {/* Phone entry */}
                {step === "phone" && (
                    <div className="card-warm p-6 space-y-5 animate-scale-in">
                        <div>
                            <h2 className="font-heading text-lg font-bold text-charcoal-600">{t("login.phone.title")}</h2>
                            <p className="text-xs text-charcoal-300 font-body">{t("login.phone.sub")}</p>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                <span className="text-charcoal-400 font-bold text-base font-body">+91</span>
                            </div>
                            <input
                                type="tel" maxLength={10} value={phone}
                                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                                placeholder="98765 43210"
                                className="w-full bg-warmgray-100 border border-warmgray-200 rounded-2xl pl-14 pr-12 py-3.5 text-charcoal-600 text-lg font-bold font-body focus:outline-none focus:ring-2 focus:ring-terra-500/30 focus:border-terra-500 tracking-widest"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                                <Smartphone className="w-5 h-5 text-charcoal-300" />
                            </div>
                        </div>

                        <button onClick={sendOtp}
                            disabled={phone.length < 10}
                            className={`btn-primary w-full flex items-center justify-center gap-2 text-sm ${phone.length < 10 ? "opacity-50 cursor-not-allowed" : ""}`}>
                            {t("login.phone.btn")} <ArrowRight className="w-4 h-4" />
                        </button>

                        <p className="text-xs text-charcoal-300 font-body flex items-center gap-1.5 justify-center">
                            <ShieldCheck className="w-3.5 h-3.5 text-forest-500" /> {t("login.phone.secure")}
                        </p>
                    </div>
                )}

                {/* OTP entry */}
                {step === "otp" && (
                    <div className="card-warm p-6 space-y-5 animate-scale-in">
                        <div>
                            <h2 className="font-heading text-lg font-bold text-charcoal-600">{t("login.otp.title")}</h2>
                            <p className="text-xs text-charcoal-300 font-body">
                                {t("login.otp.sub")}
                            </p>
                        </div>

                        <input
                            type="tel" maxLength={4} value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                            placeholder="● ● ● ●"
                            className="w-full bg-warmgray-100 border border-warmgray-200 rounded-2xl px-4 py-4 text-charcoal-600 text-2xl font-bold font-body text-center tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-terra-500/30 focus:border-terra-500"
                        />

                        <button onClick={verifyOtp}
                            disabled={otp.length < 4}
                            className={`btn-primary w-full flex items-center justify-center gap-2 text-sm ${otp.length < 4 ? "opacity-50 cursor-not-allowed" : ""}`}>
                            {t("login.otp.btn")} <ArrowRight className="w-4 h-4" />
                        </button>

                        <button onClick={() => setStep("phone")}
                            className="w-full text-xs text-terra-500 hover:underline font-body font-semibold text-center">
                            {t("login.otp.change")}
                        </button>
                    </div>
                )}

                {step === "mode" && (
                    <div className="card-warm p-6 space-y-5 animate-scale-in">
                        <div className="text-center">
                            <span className="text-4xl block mb-2">🎉</span>
                            <h2 className="font-heading text-lg font-bold text-charcoal-600">{t("login.mode.title")}</h2>
                            <p className="text-xs text-charcoal-300 font-body">{t("login.mode.sub")}</p>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            {[
                                { val: true, emoji: "🌱", hi: t("login.mode.new"), en: t("login.mode.newSub") },
                                { val: false, emoji: "🏬", hi: t("login.mode.exist"), en: t("login.mode.existSub") },
                            ].map((o) => (
                                <button key={String(o.val)} onClick={() => setIsNew(o.val)}
                                    className={`p-4 rounded-2xl border-2 text-left flex items-center gap-3 transition-all active:scale-[0.97] ${isNew === o.val
                                        ? "border-terra-500 bg-terra-500/5 shadow-warm-sm"
                                        : "border-warmgray-200 bg-white hover:border-warmgray-300"
                                        }`}>
                                    <span className="text-2xl">{o.emoji}</span>
                                    <div>
                                        <div className="text-sm font-heading font-bold text-charcoal-600">{o.hi}</div>
                                        <div className="text-[11px] text-charcoal-300 font-body">{o.en}</div>
                                    </div>
                                </button>
                            ))}
                        </div>

                        <button onClick={proceed} className="btn-primary w-full text-sm flex items-center justify-center gap-2">
                            {t("login.mode.btn")} <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Language toggle */}
                <div className="flex justify-center">
                    <div className="flex items-center bg-white rounded-2xl px-3 py-2 border border-warmgray-200 shadow-warm-sm opacity-0 pointer-events-none">
                        {/* Hidden since they pick on previous screen, but preserving spacing if needed */}
                    </div>
                </div>
            </div>
        </div>
    );
}

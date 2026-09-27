import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { aiService } from "../services/aiService";
import { useLanguage } from "../context/LanguageContext";
import { BUSINESS_CATEGORIES } from "../config/businessRules";
import { Send, X, Leaf, Mic, ArrowRight } from "lucide-react";

export default function AskBandhu({ embedded = false }) {
    const { profile, erpData, language, setActiveScreen, setIsChatOpen, triggerVoiceModal } = useApp();
    const { t } = useLanguage();
    const [isTyping, setIsTyping] = useState(false);

    // Localized greeting chips map
    const greetingChips = {
        en: ["New Business", "Need Loan", "Government Schemes", "Falling Sales"],
        hi: ["नया व्यवसाय", "लोन चाहिए", "सरकारी योजनाएं", "बिक्री घट रही है"],
        mr: ["नवीन व्यवसाय", "कर्ज हवे", "सरकारी योजना", "विक्री घटत आहे"],
        ta: ["புதிய தொழில்", "கடன் வேண்டும்", "அரசு திட்டங்கள்", "விற்பனை குறைகிறது"],
        te: ["కొత్త వ్యాపారం", "రుణం కావాలి", "ప్రభుత్వ పథకాలు", "అమ్మకాలు తగ్గాయి"],
        bn: ["নতুন ব্যবসা", "ঋণ দরকার", "সরকারি প্রকল্প", "বিক্রয় কমছে"],
        gu: ["નવો વ્યવસાય", "લોન જોઈએ", "સરકારી યોજના", "વેચાણ ઘટ્યું"],
        kn: ["ಹೊಸ ವ್ಯಾಪಾರ", "ಸಾಲ ಬೇಕು", "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು", "ಮಾರಾಟ ಕಡಿಮೆಯಾಗಿದೆ"],
    };
    const categoryName = profile.businessCategoryKey ? t(`business.categories.${profile.businessCategoryKey}`) : "";
    const greeting = `${t("screen.chat.subtitle")}\n\n${profile.name ? `${profile.name} — ` : ""}${categoryName}\n\n${t("voice.tapToSpeak")}`;
    const [messages, setMessages] = useState([
        { id: 1, from: "bot", text: greeting, chips: greetingChips[language] || greetingChips.en },
    ]);
    const [input, setInput] = useState("");
    const endRef = useRef(null);

    useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

    const handleSend = async (text) => {
        const userText = text || input.trim();
        if (!userText) return;
        const userMsg = { id: Date.now(), from: "user", text: userText };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        try {
            const result = await aiService.generateResponse(userText, { profile, erpData, language, messages });
            const botMsg = { id: Date.now() + 1, from: "bot", text: result.text, chips: result.chips, nav: result.nav };
            setMessages((prev) => [...prev, botMsg]);
        } catch (error) {
            console.error("[Bandhu AI] Chat failed:", error);
            const botMsg = {
                id: Date.now() + 1,
                from: "bot",
                text: t("chat.unavailable") || "Bandhu AI is temporarily unavailable. Please try again in a moment.",
                isError: true,
                retryText: userText
            };
            setMessages((prev) => [...prev, botMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleChip = (chip) => {
        handleSend(chip);
    };

    const handleNav = (screen) => {
        setActiveScreen(screen);
        if (!embedded) setIsChatOpen(false);
    };

    const chatBody = (
        <div className="flex flex-col h-full">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => (
                    <div key={msg.id}>
                        <div className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                            {msg.from === "bot" && (
                                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-terra-500 to-marigold-500 flex items-center justify-center text-white text-sm shrink-0 mr-2 shadow-warm-sm mt-1">🤝</div>
                            )}
                            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm font-body whitespace-pre-line ${msg.from === "user"
                                ? "bg-terra-500 text-white rounded-br-md"
                                : msg.isError
                                    ? "bg-red-50 border border-red-200 text-red-600 rounded-bl-md shadow-warm-sm"
                                    : "bg-white border border-warmgray-200 text-charcoal-600 rounded-bl-md shadow-warm-sm"
                                }`}>
                                {msg.text}
                                {msg.isError && msg.retryText && (
                                    <button onClick={() => handleSend(msg.retryText)}
                                        className="mt-2 block bg-terra-500 text-white px-4 py-1.5 rounded-xl text-xs font-bold hover:bg-terra-600 transition-colors active:scale-95">
                                        Retry
                                    </button>
                                )}
                            </div>
                        </div>
                        {/* Quick-reply chips */}
                        {msg.chips && (
                            <div className="flex flex-wrap gap-1.5 mt-2 ml-10">
                                {msg.chips.map((chip, i) => (
                                    <button key={i} onClick={() => handleChip(chip)}
                                        className="bg-terra-500/10 text-terra-600 border border-terra-400/30 px-3 py-1.5 rounded-xl text-xs font-bold font-body hover:bg-terra-500/20 transition-colors active:scale-95">
                                        {chip}
                                    </button>
                                ))}
                            </div>
                        )}
                        {/* Navigation CTA */}
                        {msg.nav && (
                            <div className="ml-10 mt-1.5">
                                    <button onClick={() => handleNav(msg.nav)}
                                        className="btn-primary !text-xs !px-3 !py-1.5 flex items-center gap-1">
                                        {t("nav.open") || "खोलें"} <ArrowRight className="w-3 h-3" />
                                    </button>
                            </div>
                        )}
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-terra-500 to-marigold-500 flex items-center justify-center text-white text-sm shrink-0 mr-2 shadow-warm-sm mt-1">🤝</div>
                        <div className="bg-white border border-warmgray-200 text-charcoal-400 rounded-2xl rounded-bl-md px-4 py-3 shadow-warm-sm flex gap-1 items-center h-10 w-16 justify-center">
                            <span className="w-1.5 h-1.5 bg-charcoal-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                            <span className="w-1.5 h-1.5 bg-charcoal-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                            <span className="w-1.5 h-1.5 bg-charcoal-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                        </div>
                    </div>
                )}
                <div ref={endRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-warmgray-200 bg-cream-50 shrink-0">
                <div className="flex items-center gap-2 max-w-lg mx-auto">
                    <button onClick={() => triggerVoiceModal(t("chat.title") || "बंधु चैट")}
                        className="p-2.5 bg-terra-500/10 text-terra-600 rounded-xl border border-terra-400/30 shrink-0 active:scale-95">
                        <Mic className="w-4 h-4" />
                    </button>
                    <input type="text" value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        placeholder={t("voice.tapToSpeak")}
                        className="flex-1 bg-white border border-warmgray-200 rounded-2xl px-4 py-2.5 text-sm font-body text-charcoal-600 focus:outline-none focus:ring-2 focus:ring-terra-500/30"
                    />
                    <button onClick={() => handleSend()}
                        disabled={!input.trim()}
                        className={`p-2.5 rounded-xl transition-all shrink-0 active:scale-95 ${input.trim() ? "bg-terra-500 text-white shadow-warm-sm" : "bg-warmgray-200 text-charcoal-300"}`}>
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );

    // Embedded (full screen / dedicated page)
    if (embedded) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-6 animate-fade-up">
                <div className="card-warm p-0 overflow-hidden" style={{ height: "calc(100vh - 180px)" }}>
                    {/* Header */}
                    <div className="p-4 border-b border-warmgray-200 bg-white flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-terra-500 to-marigold-500 flex items-center justify-center text-white text-xl shadow-warm-sm">🤝</div>
                            <div>
                                <h2 className="font-heading text-base font-bold text-charcoal-600">{t("chat.title") || "बंधु से बात करें (Ask Bandhu)"}</h2>
                                <p className="text-xs text-charcoal-300 font-body">AI-Powered Business Assistant</p>
                            </div>
                        </div>
                        <button onClick={() => setActiveScreen("home")}
                            className="p-1.5 rounded-full bg-warmgray-100 text-charcoal-400 hover:text-charcoal-600 hover:bg-warmgray-200 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    {chatBody}
                </div>
            </div>
        );
    }

    // Floating bubble
    return (
        <div className="fixed bottom-20 md:bottom-6 right-4 z-50 flex flex-col items-end gap-3">
            {/* Chat window */}
            <div className="w-[340px] sm:w-[380px] bg-cream-100 rounded-3xl shadow-warm-lg border border-warmgray-200 overflow-hidden animate-scale-in flex flex-col"
                style={{ height: 480 }}>
                {/* Chat header */}
                <div className="p-3 border-b border-warmgray-200 bg-white flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-terra-500 to-marigold-500 flex items-center justify-center text-white text-sm shadow-warm-sm shrink-0">🤝</div>
                        <div>
                            <span className="font-heading text-sm font-bold text-charcoal-600">{t("chat.title") || "बंधु चैट"}</span>
                            <span className="text-[10px] text-forest-500 font-body ml-1.5 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-forest-500 inline-block animate-pulse"></span>{t("chat.online") || "ऑनलाइन"}</span>
                        </div>
                    </div>
                    <button onClick={() => setIsChatOpen(false)} className="p-1.5 rounded-full bg-warmgray-100 text-charcoal-400 hover:text-charcoal-600">
                        <X className="w-4 h-4" />
                    </button>
                </div>
                {chatBody}
            </div>
        </div>
    );
}

/* Floating Bubble Button (to be used from App.jsx) */
export function ChatBubbleButton({ onClick }) {
    return (
        <button onClick={onClick}
            className="fixed bottom-20 md:bottom-6 right-4 z-50 w-14 h-14 rounded-2xl bg-gradient-to-br from-terra-500 to-marigold-500 text-white shadow-warm-lg hover:shadow-warm transition-all active:scale-90 flex items-center justify-center text-2xl border-2 border-white/30">
            🤝
        </button>
    );
}

import { calculateFinancials, BUSINESS_CATEGORIES, GOVERNMENT_SCHEMES_LIST } from "../config/businessRules";
import govData from "../data/gov_statistics.json";

const BACKEND_URL  = import.meta.env.VITE_API_URL       || "http://localhost:8080";
const OR_KEY       = import.meta.env.VITE_OPENROUTER_API_KEY || "";
const OR_URL       = "https://openrouter.ai/api/v1/chat/completions";
const OR_MODEL     = "openai/gpt-4o-mini";          // fast, smart, cheap on OpenRouter
const POLL_URL     = "https://text.pollinations.ai/openai"; // free fallback (no key)

// ── helpers ────────────────────────────────────────────────────────────────────
function fmt(n) { return Number(n || 0).toLocaleString("en-IN"); }

async function postChat(url, headers, body, timeoutMs = 25000) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...headers },
            body: JSON.stringify(body),
            signal: ctrl.signal,
        });
        clearTimeout(t);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const text = data?.choices?.[0]?.message?.content;
        if (!text) throw new Error("Empty response");
        return text;
    } catch (e) {
        clearTimeout(t);
        throw e;
    }
}

// ── system prompt ──────────────────────────────────────────────────────────────
function buildSystemPrompt(profile, erpData, language) {
    const cat    = profile?.businessCategoryKey ? BUSINESS_CATEGORIES[profile.businessCategoryKey] : null;
    const catName = cat ? `${cat.name} (${cat.hindiName})` : "General Business";

    let finSnap = "";
    if (profile?.ownCapital) {
        try {
            const f = calculateFinancials({
                ownCapital:     profile.ownCapital       || 0,
                equipment:      profile.equipmentCost    || cat?.defaultEquipment    || 0,
                stock:          profile.stockCost        || cat?.defaultStock        || 0,
                setup:          profile.setupCost        || cat?.defaultSetup        || 0,
                workingCapital: profile.workingCapitalCost || cat?.defaultWorkingCapital || 0,
                subsidy:        profile.grantSubsidy     || 0,
            });
            finSnap = `
Financial snapshot:
• Own capital           : ₹${fmt(f.capital)}
• Project cost capacity : ₹${fmt(f.maxProjectCostCapacity)}
• Loan gap needed       : ₹${fmt(f.loanNeedGap)}
• Recommended borrowing : ₹${fmt(f.recommendedBorrowing)}
• Scheme                : ${f.selectedScheme?.shortName} @ ${f.annualRate}% p.a.
• Monthly EMI           : ₹${fmt(f.standardEMI)}`;
        } catch (_) {}
    }

    let erpSnap = "";
    if (erpData) {
        const sales = (erpData.sales   || []).reduce((s, e) => s + (e.amount || 0), 0);
        const buys  = (erpData.purchases || []).reduce((s, e) => s + (e.amount || 0), 0);
        const recv  = (erpData.ledgers  || []).filter(l => l.type === "receivable" && !l.settled)
                                              .reduce((s, l) => s + (l.amount || 0), 0);
        erpSnap = `
ERP snapshot:
• Recent sales    : ₹${fmt(sales)}
• Recent purchases: ₹${fmt(buys)}
• Pending udhaar  : ₹${fmt(recv)}`;
    }

    const schemes = GOVERNMENT_SCHEMES_LIST.map(s =>
        `• ${s.name}: max ${s.maxLoan}, subsidy ${s.subsidy}, rate ${s.interest}`
    ).join("\n");

    const langMap = {
        en: "English", hi: "Hindi (हिन्दी)", mr: "Marathi (मराठी)",
        ta: "Tamil (தமிழ்)", te: "Telugu (తెలుగు)", bn: "Bengali (বাংলা)",
        gu: "Gujarati (ગુજરાતી)", kn: "Kannada (ಕನ್ನಡ)"
    };

    return `You are Bandhu AI — a friendly, practical business advisor inside Vyapar Bandhu, built for rural Indian micro-entrepreneurs.

USER PROFILE
• Name     : ${profile?.name       || "User"}
• Location : ${profile?.location   || "Rural India"}
• Category : ${catName}
• Type     : ${profile?.businessType || "new"}
• Monthly income  : ₹${fmt(profile?.currentMonthlyIncome)}
• Monthly expenses: ₹${fmt(profile?.currentMonthlyExpenses)}
${finSnap}
${erpSnap}

GOVERNMENT SCHEMES AVAILABLE
${schemes}

MARKET CONTEXT (data.gov.in)
• Rural MUDRA penetration  : ${govData.mudra_loan_stats?.Rural_Penetration || "68%"}
• Avg break-even           : ${govData.local_insights?.average_break_even_months || 8} months
• Survival rate            : ${govData.local_insights?.competitor_survival_rate || "54% over 3 years"}

RESPONSE RULES
1. Always reply in ${langMap[language] || "English"} — the user's chosen language.
2. Be concise (under 200 words) unless a full breakdown is requested.
3. Use empathetic, encouraging "Bandhu" (friend & guide) tone.
4. Only cite the 4 government schemes listed above — never invent figures.
5. When relevant, reference the financial snapshot above for accurate EMI / loan answers.
6. Always end with a practical next step or action.`;
}

// ── nav / chip detection ───────────────────────────────────────────────────────
function navFromMsg(msg) {
    const m = (msg || "").toLowerCase();
    if (/loan|emi|finance|कर्ज|ऋण|वित्त|borrow|lend|किश्त/.test(m))           return "finance";
    if (/scheme|yojna|योजना|mudra|pmegp|subsidy|सब्सिडी/.test(m))             return "schemes";
    if (/sales|revenue|बिक्री|profit|loss|नुकसान|dashboard|erp/.test(m))       return "dashboard";
    if (/start|new business|feasib|नया व्यवसाय|शुरू|market/.test(m))           return "feasibility";
    if (/record|ledger|khata|खाता/.test(m))                                    return "records";
    return null;
}
function chipsFromNav(nav, lang) {
    const sets = {
        finance:     { en:["View EMI","Govt Schemes","Business Plan"],     hi:["EMI देखें","सरकारी योजनाएं","व्यापार योजना"]      },
        schemes:     { en:["MUDRA Loan","PMEGP Subsidy","Calculate EMI"],  hi:["MUDRA लोन","PMEGP सब्सिडी","EMI गणना"]           },
        feasibility: { en:["Need Loan","Market Reach","Govt Schemes"],     hi:["लोन चाहिए","बाज़ार पहुँच","सरकारी योजनाएं"]      },
        dashboard:   { en:["Cut Expenses","Digital Khata","View Schemes"], hi:["खर्च घटाएं","डिजिटल खाता","योजनाएं देखें"]       },
        records:     { en:["Business Health","Need Loan","Dashboard"],     hi:["व्यावसायिक स्वास्थ्य","लोन चाहिए","डैशबोर्ड"] },
    };
    const s = sets[nav];
    if (!s) return ["Need Loan","Govt Schemes","Business Plan"];
    return s[lang] || s.en;
}

// ── offline last-resort ────────────────────────────────────────────────────────
function offlineFallback(profile, language) {
    const n = profile?.name || "";
    const msgs = {
        en: `Hi ${n}! I'm having trouble connecting right now. For loans, visit the Finance section. For government schemes, check the Schemes section.`,
        hi: `नमस्ते ${n}! अभी कनेक्शन में समस्या है। लोन के लिए वित्त, सरकारी योजनाओं के लिए योजनाएं देखें।`,
        mr: `नमस्कार ${n}! कनेक्शनमध्ये समस्या आहे. कर्जासाठी वित्त, योजनांसाठी योजना विभाग पाहा.`,
        ta: `வணக்கம் ${n}! இணைப்பு சிக்கல். கடனுக்கு நிதி, திட்டங்களுக்கு திட்டங்கள் பகுதி பாருங்கள்.`,
        te: `నమస్కారం ${n}! కనెక్షన్ సమస్య. రుణానికి ఆర్థిక, పథకాలకు పథకాల విభాగం చూడండి.`,
        bn: `নমস্কার ${n}! সংযোগ সমস্যা। ঋণের জন্য অর্থ, প্রকল্পের জন্য প্রকল্প বিভাগ দেখুন।`,
        gu: `નમસ્તે ${n}! કનેક્શન સમસ્યા. લોન માટે ફાઇનાન્સ, યોજના માટે સ્કીમ વિભાગ જુઓ.`,
        kn: `ನಮಸ್ಕಾರ ${n}! ಸಂಪರ್ಕ ಸಮಸ್ಯೆ. ಸಾಲಕ್ಕೆ ಹಣಕಾಸು, ಯೋಜನೆಗಳಿಗೆ ಸ್ಕೀಮ್ ವಿಭಾಗ ನೋಡಿ.`,
    };
    return msgs[language] || msgs.en;
}

// ── main service ───────────────────────────────────────────────────────────────
export const aiService = {
    generateResponse: async (message, context) => {
        const { profile, erpData, language, messages } = context;
        const nav    = navFromMsg(message);
        const chips  = chipsFromNav(nav, language);

        // Shared conversation history (last 10 turns)
        const history = (messages || []).slice(-10).map(m => ({
            role:    m.from === "user" ? "user" : "assistant",
            content: String(m.text || ""),
        }));
        const systemPrompt = buildSystemPrompt(profile, erpData, language);

        // ── Layer 1: Spring Boot backend (when running) ──────────────────────
        try {
            const ctrl = new AbortController();
            const t    = setTimeout(() => ctrl.abort(), 4000);
            const payload = {
                message, language,
                conversationId: context.conversationId || ("conv_" + Date.now()),
                context: { profile, erpData },
                messages: (messages || []).map(m => ({ from: String(m.from || "user"), text: String(m.text || "") })),
            };
            const res = await fetch(`${BACKEND_URL}/api/v1/ai/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
                signal: ctrl.signal,
            });
            clearTimeout(t);
            const data = await res.json();
            if (res.ok && data.success) {
                return { text: data.message, nav, chips };
            }
        } catch (_) {
            // Backend offline — continue to next layer
        }

        // ── Layer 2: OpenRouter (uses your API key) ──────────────────────────
        if (OR_KEY) {
            try {
                const text = await postChat(OR_URL, {
                    "Authorization":       `Bearer ${OR_KEY}`,
                    "HTTP-Referer":        "https://vyaparbandhu.app",
                    "X-Title":             "Vyapar Bandhu",
                }, {
                    model: OR_MODEL,
                    messages: [
                        { role: "system",  content: systemPrompt },
                        ...history,
                        { role: "user",    content: message },
                    ],
                    max_tokens: 600,
                    temperature: 0.7,
                });
                return { text, nav, chips };
            } catch (orErr) {
                console.warn("[Bandhu AI] OpenRouter failed:", orErr.message);
                // Fall through to Pollinations
            }
        }

        // ── Layer 3: Pollinations (free, no key) ─────────────────────────────
        try {
            const text = await postChat(POLL_URL, {}, {
                model: "openai",
                messages: [
                    { role: "system",  content: systemPrompt },
                    ...history.slice(-6),
                    { role: "user",    content: message },
                ],
            });
            return { text, nav, chips };
        } catch (pollErr) {
            console.error("[Bandhu AI] All providers failed:", pollErr.message);
        }

        // ── Layer 4: Offline static fallback ────────────────────────────────
        return {
            text:  offlineFallback(profile, language),
            nav,
            chips,
        };
    },

    checkHealth: async () => {
        // Quick ping — returns which provider is active
        if (OR_KEY) {
            try {
                await postChat(OR_URL, {
                    "Authorization": `Bearer ${OR_KEY}`,
                    "HTTP-Referer":  "https://vyaparbandhu.app",
                    "X-Title":       "Vyapar Bandhu",
                }, {
                    model: OR_MODEL,
                    messages: [{ role: "user", content: "ping" }],
                    max_tokens: 3,
                }, 6000);
                return { available: true, provider: "openrouter", model: OR_MODEL };
            } catch (_) {}
        }
        return { available: false, provider: "unreachable", model: "unknown" };
    },
};

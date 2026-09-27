import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { useLanguage } from "../context/LanguageContext";
import { UserCheck, MessageSquare, X, PlusCircle, ThumbsUp, Send, PhoneCall, CheckCircle } from "lucide-react";

export default function ExpertCommunity() {
    const { triggerVoiceModal } = useApp();
    const { t } = useLanguage();
    const [selected, setSelected] = useState(null);
    const [booked, setBooked] = useState(false);
    const [askOpen, setAskOpen] = useState(false);
    const [qText, setQText] = useState("");

    const experts = [
        { id: 1, icon: "👨‍🌾", name: t("exp.1.name") || "डॉ. सतीश शर्मा", role: t("exp.1.role") || "KVK डेयरी विशेषज्ञ", exp: "15 " + t("exp.years", "वर्ष"), loc: t("exp.1.loc") || "होशंगाबाद", spec: t("exp.1.spec") || "डेयरी, पशुपालन, दुग्ध प्रसंस्करण", time: t("exp.1.time") || "आज शाम 4-6 बजे", rating: "4.9 ★" },
        { id: 2, icon: "👩‍💼", name: t("exp.2.name") || "सुनीता पटेल", role: t("exp.2.role") || "वरिष्ठ बैंक मित्र", exp: "10 " + t("exp.years", "वर्ष"), loc: t("exp.2.loc") || "पिपरिया", spec: t("exp.2.spec") || "मुद्रा, PMEGP लोन, क्रेडिट गारंटी", time: t("exp.2.time") || "कल सुबह 11 बजे", rating: "4.8 ★" },
        { id: 3, icon: "🏪", name: t("exp.3.name") || "रमेश यादव", role: t("exp.3.role") || "सफल ग्रामीण उद्यमी", exp: "12 " + t("exp.years", "वर्ष"), loc: t("exp.3.loc") || "इटारसी", spec: t("exp.3.spec") || "किराना मार्जिन, थोक खरीद, UPI", time: t("exp.3.time") || "रविवार 10 बजे", rating: "5.0 ★" },
        { id: 4, icon: "🧵", name: t("exp.4.name") || "प्रिया विश्वकर्मा", role: t("exp.4.role") || "SHG / ONDC ट्रेनर", exp: "8 " + t("exp.years", "वर्ष"), loc: t("exp.4.loc") || "भोपाल", spec: t("exp.4.spec") || "महिला SHG, सिलाई, ONDC बिक्री", time: t("exp.4.time") || "सोमवार 3 बजे", rating: "4.9 ★" },
    ];

    const [posts, setPosts] = useState([
        { id: 1, author: t("post.1.author") || "सुरेश वर्मा (दूध उत्पादक)", time: t("post.1.time") || "2 घंटे पहले", q: t("post.1.q") || "गर्मियों में दूध फटने से बचने के लिए कम लागत वाला सोलर चिलर कैसे लगायें?", reply: t("post.1.reply") || "डॉ. शर्मा: 100L सोलर आइस-कैन बॉक्स ₹18K में NABARD सब्सिडी पर उपलब्ध है।", likes: 12, replies: 4 },
        { id: 2, author: t("post.2.author") || "गीता बाई (SHG अध्यक्ष)", time: t("post.2.time") || "5 घंटे पहले", q: t("post.2.q") || "लखपति दीदी योजना में बिना गारंटी कितना लोन मिलता है?", reply: t("post.2.reply") || "बैंक मित्र सुनीता: SHG हेतु ₹5L तक बिना गारंटी 4% ब्याज पर।", likes: 18, replies: 7 },
        { id: 3, author: t("post.3.author") || "मनोज साहू (किराना मालिक)", time: t("post.3.time") || "1 दिन पहले", q: t("post.3.q") || "ग्राहकों की उधारी डूबने से बचने के लिए क्या नियम अपनाएं?", reply: t("post.3.reply") || "रमेश यादव: ₹500 क्रेडिट लिमिट + WhatsApp रिमाइंडर।", likes: 25, replies: 9 },
    ]);

    const book = (exp) => { setSelected(exp); setBooked(false); };
    const confirm = () => { setBooked(true); setTimeout(() => { setSelected(null); setBooked(false); }, 2500); };
    const addQ = () => {
        if (!qText.trim()) return;
        setPosts([{ id: Date.now(), author: t("exp.you") || "आप", time: t("exp.now") || "अभी", q: qText, reply: t("exp.willReply") || "विशेषज्ञ जल्द उत्तर देंगे।", likes: 0, replies: 0 }, ...posts]);
        setQText(""); setAskOpen(false);
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-6 animate-fade-up">
            {/* Header */}
            <div className="card-warm p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <span className="text-4xl">💬</span>
                    <div>
                        <h1 className="font-heading text-xl font-extrabold text-charcoal-600">{t("exp.title")}</h1>
                        <p className="text-xs text-charcoal-300 font-body">{t("exp.sub")}</p>
                    </div>
                </div>
                <button onClick={() => setAskOpen(true)}
                    className="btn-primary !text-xs flex items-center gap-1.5">
                    <PlusCircle className="w-4 h-4" /> {t("exp.ask")}
                </button>
            </div>

            {/* Experts grid */}
            <div>
                <h2 className="font-heading text-base font-bold text-charcoal-500 flex items-center gap-2 mb-3">
                    <UserCheck className="w-5 h-5 text-forest-500" /> {t("exp.talk")}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {experts.map((e) => (
                        <div key={e.id} className="card-warm p-5 flex flex-col justify-between space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-warmgray-100 flex items-center justify-center text-2xl shrink-0 border border-warmgray-200">{e.icon}</div>
                                <div>
                                    <h3 className="font-heading text-sm font-bold text-charcoal-600">{e.name}</h3>
                                    <p className="text-xs text-terra-500 font-semibold font-body">{e.role}</p>
                                    <p className="text-[11px] text-charcoal-300 font-body">{e.exp} • {e.loc}</p>
                                </div>
                            </div>
                            <div className="bg-cream-100 p-3 rounded-xl border border-warmgray-200 text-xs font-body">
                                <p className="text-charcoal-400">{t("exp.spec")} {e.spec}</p>
                                <div className="flex items-center justify-between mt-1 text-[11px]">
                                    <span className="text-charcoal-300">{t("exp.available")} <strong className="text-marigold-600">{e.time}</strong></span>
                                    <span className="text-forest-600 font-bold">{e.rating}</span>
                                </div>
                            </div>
                            <button onClick={() => book(e)}
                                className="btn-subtle w-full flex items-center justify-center gap-2 !text-xs">
                                <PhoneCall className="w-3.5 h-3.5 text-forest-500" /> {t("exp.book")}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Forum */}
            <div>
                <h2 className="font-heading text-base font-bold text-charcoal-500 flex items-center gap-2 mb-3">
                    <MessageSquare className="w-5 h-5 text-purple-500" /> {t("exp.forum")}
                </h2>
                <div className="space-y-3">
                    {posts.map((p) => (
                        <div key={p.id} className="card-warm p-5 space-y-2.5">
                            <div className="flex items-center justify-between text-xs text-charcoal-300 font-body">
                                <span className="font-semibold text-charcoal-400">👤 {p.author}</span>
                                <span>{p.time}</span>
                            </div>
                            <h4 className="text-sm font-heading font-bold text-charcoal-600 leading-snug">"{p.q}"</h4>
                            {p.reply && (
                                <div className="bg-cream-100 p-3 rounded-xl border border-terra-400/20 text-xs font-body">
                                    <p className="font-semibold text-terra-500">{t("exp.expertReply")}</p>
                                    <p className="text-charcoal-400 mt-0.5">{p.reply}</p>
                                </div>
                            )}
                            <div className="flex items-center justify-between text-xs text-charcoal-300 font-body pt-1 border-t border-warmgray-200">
                                <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3 text-forest-500" /> {p.likes}</span>
                                <span className="text-forest-600 font-semibold">{p.replies} {t("exp.answers")}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Booking modal */}
            {selected && (
                <div className="fixed inset-0 z-50 bg-charcoal-700/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-4xl p-6 max-w-sm w-full shadow-warm-lg relative border border-warmgray-200 space-y-4">
                        <button onClick={() => setSelected(null)} className="absolute top-4 right-4 p-2 text-charcoal-300 hover:text-charcoal-500 rounded-full bg-warmgray-100"><X className="w-5 h-5" /></button>
                        {booked ? (
                            <div className="text-center py-6 space-y-3">
                                <CheckCircle className="w-16 h-16 text-forest-500 mx-auto" />
                                <h3 className="font-heading text-xl font-bold text-charcoal-600">{t("exp.callBooked")}</h3>
                                <p className="text-xs text-charcoal-400 font-body">{selected.name} {t("exp.willCall", { time: selected.time })}</p>
                            </div>
                        ) : (
                            <>
                                <h3 className="font-heading text-lg font-bold text-charcoal-600">{t("exp.confirmCall")}</h3>
                                <div className="bg-cream-100 p-4 rounded-2xl border border-warmgray-200 text-xs font-body space-y-1">
                                    <p className="font-bold text-charcoal-600">{selected.name}</p>
                                    <p className="text-terra-500">{selected.role}</p>
                                    <p className="text-charcoal-300">{t("exp.time")}: {selected.time}</p>
                                </div>
                                <button onClick={confirm} className="btn-primary w-full text-sm">✅ {t("exp.confirmBtn")}</button>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Ask question modal */}
            {askOpen && (
                <div className="fixed inset-0 z-50 bg-charcoal-700/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-4xl p-6 max-w-md w-full shadow-warm-lg relative border border-warmgray-200 space-y-4">
                        <button onClick={() => setAskOpen(false)} className="absolute top-4 right-4 p-2 text-charcoal-300 hover:text-charcoal-500 rounded-full bg-warmgray-100"><X className="w-5 h-5" /></button>
                        <h3 className="font-heading text-lg font-bold text-charcoal-600">{t("exp.askQTitle")}</h3>
                        <textarea rows={4} value={qText} onChange={(e) => setQText(e.target.value)}
                            placeholder={t("exp.askQPlaceholder")}
                            className="w-full bg-warmgray-100 border border-warmgray-200 rounded-2xl p-3 text-charcoal-600 text-xs font-body focus:outline-none focus:ring-2 focus:ring-terra-500/20" />
                        <div className="flex gap-2">
                            <button onClick={() => triggerVoiceModal(t("exp.speakQ"))} className="btn-subtle !text-xs flex items-center gap-1">🎤 {t("exp.speakBtn")}</button>
                            <button onClick={addQ} className="btn-primary flex-1 !text-xs flex items-center justify-center gap-1.5"><Send className="w-3.5 h-3.5" /> {t("exp.postBtn")}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

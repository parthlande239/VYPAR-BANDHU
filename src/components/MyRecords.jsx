import React, { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { useLanguage } from "../context/LanguageContext";
import {
    FileText, TrendingUp, ShoppingCart, Package, Users,
    BookOpen, Activity, PlusCircle, Check, AlertTriangle,
    DollarSign, ChevronDown, ChevronUp, Trash2, Bell
} from "lucide-react";

/* ── Tab definitions ── */
const TABS = [
    { id: "sales", icon: TrendingUp },
    { id: "purchases", icon: ShoppingCart },
    { id: "inventory", icon: Package },
    { id: "contacts", icon: Users },
    { id: "ledgers", icon: BookOpen },
    { id: "health", icon: Activity },
];

/* ── Helpers ── */
const fmt = (n) => (n || 0).toLocaleString("en-IN");

export default function MyRecords() {
    const { erpData, setErpData, profile } = useApp();
    const { t } = useLanguage();
    const [tab, setTab] = useState("sales");

    /* ── Derived stats ── */
    const totalSales = useMemo(() => erpData.sales.reduce((s, e) => s + e.amount, 0), [erpData.sales]);
    const totalPurchases = useMemo(() => erpData.purchases.reduce((s, e) => s + e.amount, 0), [erpData.purchases]);
    const cashFlow = totalSales - totalPurchases;
    const lowStockItems = erpData.inventory.filter((i) => i.qty <= i.threshold);
    const pendingReceivables = erpData.ledgers.filter((l) => l.type === "receivable" && !l.settled);
    const pendingPayables = erpData.ledgers.filter((l) => l.type === "payable" && !l.settled);

    /* ── Health score (0-100 from multiple factors) ── */
    const healthScore = useMemo(() => {
        let score = 50;
        if (cashFlow > 0) score += 15; else score -= 10;
        if (totalSales > totalPurchases * 1.3) score += 10;
        if (lowStockItems.length === 0) score += 10; else score -= 5 * lowStockItems.length;
        if (pendingReceivables.length === 0) score += 10; else score -= 3 * pendingReceivables.length;
        if (pendingPayables.length > 0) score -= 5;
        return Math.max(0, Math.min(100, score));
    }, [cashFlow, totalSales, totalPurchases, lowStockItems, pendingReceivables, pendingPayables]);

    const healthColor = healthScore >= 70 ? "#2E7D52" : healthScore >= 45 ? "#E89B1C" : "#DC2626";
    const healthLabel = healthScore >= 70 ? t("rec.healthLabel.good", "Good") : healthScore >= 45 ? t("rec.healthLabel.fair", "Fair") : t("rec.healthLabel.poor", "Needs Attention");

    /* ── Early warnings (pattern-based) ── */
    const warnings = useMemo(() => {
        const w = [];
        if (lowStockItems.length > 0) w.push(`⚠️ ${lowStockItems.length} ${t("rec.warn.lowStock", "items have low stock — reorder immediately!")}`);
        if (pendingReceivables.length > 0) w.push(`📋 ₹${fmt(pendingReceivables.reduce((s, e) => s + e.amount, 0))} ${t("rec.warn.creditDue", "credit pending — collect now!")}`);
        if (cashFlow < 0) w.push(`🔴 ${t("rec.warn.negativeCash", "Your cash flow is negative — expenses exceed sales!")}`);
        if (totalSales < totalPurchases) w.push(`📉 ${t("rec.warn.salesLow", "Sales are lower than purchases this period — increase marketing!")}`);
        return w;
    }, [lowStockItems, pendingReceivables, cashFlow, totalSales, totalPurchases, t]);

    /* ── Data mutation helpers ── */
    const addSale = () => {
        setErpData((prev) => ({
            ...prev,
            sales: [...prev.sales, { id: Date.now(), date: new Date().toISOString().slice(0, 10), item: "नया आइटम", qty: 1, unit: "pc", amount: 0 }],
        }));
    };
    const addPurchase = () => {
        setErpData((prev) => ({
            ...prev,
            purchases: [...prev.purchases, { id: Date.now(), date: new Date().toISOString().slice(0, 10), category: "stock", item: "नई खरीद", amount: 0 }],
        }));
    };
    const addInventory = () => {
        setErpData((prev) => ({
            ...prev,
            inventory: [...prev.inventory, { id: Date.now(), item: "नया आइटम", qty: 0, threshold: 3 }],
        }));
    };
    const addContact = (type) => {
        setErpData((prev) => ({
            ...prev,
            contacts: [...prev.contacts, { id: Date.now(), type, name: "", phone: "" }],
        }));
    };
    const addLedger = (type) => {
        setErpData((prev) => ({
            ...prev,
            ledgers: [...prev.ledgers, { id: Date.now(), type, name: "", amount: 0, dueDate: "", settled: false }],
        }));
    };
    const toggleLedger = (id) => {
        setErpData((prev) => ({
            ...prev,
            ledgers: prev.ledgers.map((l) => (l.id === id ? { ...l, settled: !l.settled } : l)),
        }));
    };
    const updateField = (collection, id, field, value) => {
        setErpData((prev) => ({
            ...prev,
            [collection]: prev[collection].map((item) => (item.id === id ? { ...item, [field]: value } : item)),
        }));
    };
    const removeItem = (collection, id) => {
        setErpData((prev) => ({
            ...prev,
            [collection]: prev[collection].filter((item) => item.id !== id),
        }));
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-5 animate-fade-up">
            {/* Header */}
            <div className="card-warm p-6 flex items-center gap-3">
                <span className="text-4xl">📒</span>
                <div>
                    <h1 className="font-heading text-xl font-extrabold text-charcoal-600">{t("rec.title")}</h1>
                    <p className="text-xs text-charcoal-300 font-body">{t("rec.sub")}</p>
                </div>
            </div>

            {/* Early Warning Banners */}
            {warnings.length > 0 && (
                <div className="space-y-2">
                    {warnings.map((w, i) => (
                        <div key={i} className="bg-red-50 border border-red-200 rounded-2xl p-3 flex items-start gap-2 text-xs text-red-600 font-body font-semibold">
                            <Bell className="w-4 h-4 shrink-0 mt-0.5 text-red-400" /> {w}
                        </div>
                    ))}
                </div>
            )}

            {/* Cash Flow Summary Bar */}
            <div className="grid grid-cols-3 gap-3">
                {[
                    { label: t("rec.totalSales"), val: totalSales, color: "text-forest-600", bg: "bg-forest-500/5 border-forest-400/20" },
                    { label: t("rec.totalPurchases"), val: totalPurchases, color: "text-red-500", bg: "bg-red-50 border-red-200" },
                    { label: t("rec.cashFlow"), val: cashFlow, color: cashFlow >= 0 ? "text-forest-600" : "text-red-500", bg: cashFlow >= 0 ? "bg-forest-500/5 border-forest-400/20" : "bg-red-50 border-red-200" },
                ].map((c, i) => (
                    <div key={i} className={`rounded-2xl p-3 border ${c.bg} text-center`}>
                        <p className="text-[11px] text-charcoal-300 font-body">{c.label}</p>
                        <p className={`text-lg font-heading font-extrabold ${c.color}`}>₹{fmt(c.val)}</p>
                    </div>
                ))}
            </div>

            {/* Tab Nav */}
            <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
                {TABS.map((tItem) => {
                    const Icon = tItem.icon;
                    return (
                        <button key={tItem.id} onClick={() => setTab(tItem.id)}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold font-body whitespace-nowrap transition-all ${tab === tItem.id ? "bg-terra-500 text-white shadow-warm-sm" : "bg-warmgray-100 text-charcoal-400 border border-warmgray-200"
                                }`}>
                            <Icon className="w-3.5 h-3.5" /> {t(`rec.tab.${tItem.id}`)}
                        </button>
                    );
                })}
            </div>

            {/* ─── SALES TAB ─── */}
            {tab === "sales" && (
                <div className="card-warm p-5 space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="font-heading text-sm font-bold text-charcoal-500">📈 {t("rec.tab.sales")}</h3>
                        <button onClick={addSale} className="btn-primary !text-xs !px-3 !py-1.5 flex items-center gap-1"><PlusCircle className="w-3.5 h-3.5" /> {t("rec.add")}</button>
                    </div>
                    <div className="space-y-2">
                        {erpData.sales.map((s) => (
                            <div key={s.id} className="bg-warmgray-100 rounded-xl p-3 border border-warmgray-200 flex flex-col sm:flex-row gap-2 sm:items-center">
                                <input type="date" value={s.date} onChange={(e) => updateField("sales", s.id, "date", e.target.value)}
                                    className="bg-white border border-warmgray-200 rounded-lg px-2 py-1.5 text-xs font-body w-full sm:w-32" />
                                <input type="text" value={s.item} onChange={(e) => updateField("sales", s.id, "item", e.target.value)} placeholder={t("rec.placeholder.item", "Item")}
                                    className="bg-white border border-warmgray-200 rounded-lg px-2 py-1.5 text-xs font-body flex-1" />
                                <input type="number" value={s.qty} onChange={(e) => updateField("sales", s.id, "qty", Number(e.target.value))} placeholder="Qty"
                                    className="bg-white border border-warmgray-200 rounded-lg px-2 py-1.5 text-xs font-body w-16" />
                                <div className="relative">
                                    <span className="absolute left-2 top-1.5 text-xs text-terra-500 font-bold">₹</span>
                                    <input type="number" value={s.amount} onChange={(e) => updateField("sales", s.id, "amount", Number(e.target.value))}
                                        className="bg-white border border-warmgray-200 rounded-lg pl-5 pr-2 py-1.5 text-xs font-body font-bold w-24" />
                                </div>
                                <button onClick={() => removeItem("sales", s.id)} className="text-red-400 hover:text-red-600 p-1"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-charcoal-300 font-body text-right">{t("rec.total", "Total:")} <strong className="text-forest-600">₹{fmt(totalSales)}</strong></p>
                </div>
            )}

            {/* ─── PURCHASES TAB ─── */}
            {tab === "purchases" && (
                <div className="card-warm p-5 space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="font-heading text-sm font-bold text-charcoal-500">🛒 {t("rec.tab.purchases")}</h3>
                        <button onClick={addPurchase} className="btn-primary !text-xs !px-3 !py-1.5 flex items-center gap-1"><PlusCircle className="w-3.5 h-3.5" /> {t("rec.add")}</button>
                    </div>
                    <div className="space-y-2">
                        {erpData.purchases.map((p) => (
                            <div key={p.id} className="bg-warmgray-100 rounded-xl p-3 border border-warmgray-200 flex flex-col sm:flex-row gap-2 sm:items-center">
                                <input type="date" value={p.date} onChange={(e) => updateField("purchases", p.id, "date", e.target.value)}
                                    className="bg-white border border-warmgray-200 rounded-lg px-2 py-1.5 text-xs font-body w-full sm:w-32" />
                                <select value={p.category} onChange={(e) => updateField("purchases", p.id, "category", e.target.value)}
                                    className="bg-white border border-warmgray-200 rounded-lg px-2 py-1.5 text-xs font-body w-full sm:w-28">
                                    <option value="stock">{t("rec.cat.stock", "Stock")}</option>
                                    <option value="rent">{t("rec.cat.rent", "Rent")}</option>
                                    <option value="utilities">{t("rec.cat.utilities", "Utilities")}</option>
                                    <option value="other">{t("rec.cat.other", "Other")}</option>
                                </select>
                                <input type="text" value={p.item} onChange={(e) => updateField("purchases", p.id, "item", e.target.value)} placeholder={t("rec.placeholder.desc", "Description")}
                                    className="bg-white border border-warmgray-200 rounded-lg px-2 py-1.5 text-xs font-body flex-1" />
                                <div className="relative">
                                    <span className="absolute left-2 top-1.5 text-xs text-red-500 font-bold">₹</span>
                                    <input type="number" value={p.amount} onChange={(e) => updateField("purchases", p.id, "amount", Number(e.target.value))}
                                        className="bg-white border border-warmgray-200 rounded-lg pl-5 pr-2 py-1.5 text-xs font-body font-bold w-24" />
                                </div>
                                <button onClick={() => removeItem("purchases", p.id)} className="text-red-400 hover:text-red-600 p-1"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-charcoal-300 font-body text-right">{t("rec.total", "Total:")} <strong className="text-red-500">₹{fmt(totalPurchases)}</strong></p>
                </div>
            )}

            {/* ─── INVENTORY TAB ─── */}
            {tab === "inventory" && (
                <div className="card-warm p-5 space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="font-heading text-sm font-bold text-charcoal-500">📦 {t("rec.tab.inventory")}</h3>
                        <button onClick={addInventory} className="btn-primary !text-xs !px-3 !py-1.5 flex items-center gap-1"><PlusCircle className="w-3.5 h-3.5" /> {t("rec.add")}</button>
                    </div>
                    <div className="space-y-2">
                        {erpData.inventory.map((inv) => {
                            const low = inv.qty <= inv.threshold;
                            return (
                                <div key={inv.id} className={`rounded-xl p-3 border flex flex-col sm:flex-row gap-2 sm:items-center ${low ? "bg-red-50 border-red-200" : "bg-warmgray-100 border-warmgray-200"}`}>
                                    <input type="text" value={inv.item} onChange={(e) => updateField("inventory", inv.id, "item", e.target.value)}
                                        className="bg-white border border-warmgray-200 rounded-lg px-2 py-1.5 text-xs font-body flex-1" />
                                    <div className="flex items-center gap-2">
                                        <label className="text-[11px] text-charcoal-300 font-body">Qty:</label>
                                        <input type="number" value={inv.qty} onChange={(e) => updateField("inventory", inv.id, "qty", Number(e.target.value))}
                                            className="bg-white border border-warmgray-200 rounded-lg px-2 py-1.5 text-xs font-body w-16 font-bold" />
                                        <label className="text-[11px] text-charcoal-300 font-body">Min:</label>
                                        <input type="number" value={inv.threshold} onChange={(e) => updateField("inventory", inv.id, "threshold", Number(e.target.value))}
                                            className="bg-white border border-warmgray-200 rounded-lg px-2 py-1.5 text-xs font-body w-16" />
                                    </div>
                                    {low && <span className="badge bg-red-100 text-red-600 border border-red-200 text-[10px]">⚠️ Low Stock</span>}
                                    <button onClick={() => removeItem("inventory", inv.id)} className="text-red-400 hover:text-red-600 p-1"><Trash2 className="w-3.5 h-3.5" /></button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ─── CONTACTS TAB ─── */}
            {tab === "contacts" && (
                <div className="card-warm p-5 space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="font-heading text-sm font-bold text-charcoal-500">👥 {t("rec.tab.contacts")}</h3>
                        <div className="flex gap-1.5">
                            <button onClick={() => addContact("customer")} className="btn-primary !text-[10px] !px-2 !py-1">{t("rec.addCustomer", "+ Customer")}</button>
                            <button onClick={() => addContact("supplier")} className="btn-subtle !text-[10px] !px-2 !py-1">{t("rec.addSupplier", "+ Supplier")}</button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        {erpData.contacts.map((c) => (
                            <div key={c.id} className="bg-warmgray-100 rounded-xl p-3 border border-warmgray-200 flex flex-col sm:flex-row gap-2 sm:items-center">
                                <span className={`badge text-[10px] ${c.type === "customer" ? "bg-forest-500/10 text-forest-600 border-forest-400/30" : "bg-blue-50 text-blue-600 border-blue-200"} border`}>
                                    {c.type === "customer" ? t("rec.customer", "Customer") : t("rec.supplier", "Supplier")}
                                </span>
                                <input type="text" value={c.name} onChange={(e) => updateField("contacts", c.id, "name", e.target.value)} placeholder={t("rec.placeholder.name", "Name")}
                                    className="bg-white border border-warmgray-200 rounded-lg px-2 py-1.5 text-xs font-body flex-1" />
                                <input type="tel" value={c.phone} onChange={(e) => updateField("contacts", c.id, "phone", e.target.value)} placeholder={t("rec.placeholder.phone", "Phone")}
                                    className="bg-white border border-warmgray-200 rounded-lg px-2 py-1.5 text-xs font-body w-36" />
                                <button onClick={() => removeItem("contacts", c.id)} className="text-red-400 hover:text-red-600 p-1"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ─── LEDGERS TAB ─── */}
            {tab === "ledgers" && (
                <div className="card-warm p-5 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-heading text-sm font-bold text-charcoal-500">📖 {t("rec.tab.ledgers")}</h3>
                        <div className="flex gap-1.5">
                            <button onClick={() => addLedger("receivable")} className="btn-primary !text-[10px] !px-2 !py-1">{t("rec.addReceivable", "+ Credit Given")}</button>
                            <button onClick={() => addLedger("payable")} className="btn-subtle !text-[10px] !px-2 !py-1">{t("rec.addPayable", "+ Debt Owed")}</button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        {erpData.ledgers.map((l) => (
                            <div key={l.id}
                                className={`rounded-xl p-3 border flex flex-col sm:flex-row gap-2 sm:items-center ${l.settled ? "bg-warmgray-100 border-warmgray-200 opacity-60" : l.type === "receivable" ? "bg-forest-500/5 border-forest-400/20" : "bg-red-50 border-red-200"
                                    }`}>
                                <span className={`badge text-[10px] border ${l.type === "receivable" ? "bg-forest-500/10 text-forest-600 border-forest-400/30" : "bg-red-100 text-red-600 border-red-200"}`}>
                                    {l.type === "receivable" ? t("rec.owedToMe", "Receivable (owed to me)") : t("rec.iOwe", "Payable (I owe)")}
                                </span>
                                <input type="text" value={l.name} onChange={(e) => updateField("ledgers", l.id, "name", e.target.value)} placeholder={t("rec.placeholder.name", "Name")}
                                    className="bg-white border border-warmgray-200 rounded-lg px-2 py-1.5 text-xs font-body flex-1" />
                                <div className="relative">
                                    <span className="absolute left-2 top-1.5 text-xs font-bold text-charcoal-400">₹</span>
                                    <input type="number" value={l.amount} onChange={(e) => updateField("ledgers", l.id, "amount", Number(e.target.value))}
                                        className="bg-white border border-warmgray-200 rounded-lg pl-5 pr-2 py-1.5 text-xs font-body w-24 font-bold" />
                                </div>
                                <input type="date" value={l.dueDate} onChange={(e) => updateField("ledgers", l.id, "dueDate", e.target.value)}
                                    className="bg-white border border-warmgray-200 rounded-lg px-2 py-1.5 text-xs font-body w-32" />
                                <button onClick={() => toggleLedger(l.id)}
                                    className={`badge text-[10px] border cursor-pointer ${l.settled ? "bg-warmgray-200 text-charcoal-400 border-warmgray-300" : "bg-forest-500/10 text-forest-600 border-forest-400/30"}`}>
                                    {l.settled ? t("rec.reopen", "↩ Reopen") : t("rec.settle", "✅ Settle")}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ─── HEALTH SCORE TAB ─── */}
            {tab === "health" && (
                <div className="space-y-4">
                    {/* Circular gauge */}
                    <div className="card-warm p-6 flex flex-col items-center text-center space-y-3">
                        <span className="text-xs font-bold text-charcoal-300 uppercase tracking-wider font-body">{t("rec.tab.health")}</span>
                        <div className="relative w-36 h-36 flex items-center justify-center">
                            <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                                <circle cx="60" cy="60" r="50" fill="none" stroke="#EDE5D8" strokeWidth="10" />
                                <circle cx="60" cy="60" r="50" fill="none" stroke={healthColor} strokeWidth="10"
                                    strokeDasharray={`${healthScore * 3.14} 1000`} strokeLinecap="round" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-heading font-extrabold text-charcoal-600">{healthScore}</span>
                                <span className="text-[10px] text-charcoal-300 font-body">/100</span>
                            </div>
                        </div>
                        <span className={`badge border ${healthScore >= 70 ? "bg-forest-500/10 text-forest-600 border-forest-400/30" : healthScore >= 45 ? "bg-marigold-500/10 text-marigold-600 border-marigold-400/30" : "bg-red-50 text-red-600 border-red-200"}`}>
                            {healthLabel}
                        </span>
                        <p className="text-xs text-charcoal-400 font-body max-w-xs">
                            {healthScore >= 70 ? t("rec.healthAdvice.good", "Your business is in good shape! Good time to expand.") : healthScore >= 45 ? t("rec.healthAdvice.fair", "Some improvement needed — see advice below.") : t("rec.healthAdvice.poor", "Urgent improvement needed — focus on stock, credit, and costs!")}
                        </p>
                    </div>

                    {/* Factors breakdown */}
                    <div className="card-warm p-5 space-y-3">
                        <h3 className="font-heading text-sm font-bold text-charcoal-500">📊 {t("rec.healthFactorAnalysis", "Health Factor Breakdown")}</h3>
                        {[
                            { label: t("rec.factor.cashFlow", "Cash Flow"), good: cashFlow > 0, note: cashFlow >= 0 ? `+₹${fmt(cashFlow)} ${t("rec.note.positiveCash", "Positive")}` : `₹${fmt(cashFlow)} ${t("rec.note.negativeCash", "Negative — reduce expenses")}` },
                            { label: t("rec.factor.margin", "Profit Margin"), good: totalSales > totalPurchases * 1.3, note: totalSales > totalPurchases * 1.3 ? t("rec.note.goodMargin", "30%+ margin — Great!") : t("rec.note.lowMargin", "Low margin — increase price or reduce costs") },
                            { label: t("rec.factor.stock", "Stock Level"), good: lowStockItems.length === 0, note: lowStockItems.length === 0 ? t("rec.note.stockAdequate", "All items adequate") : `${lowStockItems.length} ${t("rec.note.stockLow", "items low — reorder")}` },
                            { label: t("rec.factor.credit", "Credit Recovery"), good: pendingReceivables.length === 0, note: pendingReceivables.length === 0 ? t("rec.note.noCreditDue", "No pending receivables") : `${pendingReceivables.length} ${t("rec.note.creditDue", "customers have pending debt")} (₹${fmt(pendingReceivables.reduce((s, l) => s + l.amount, 0))})` },
                        ].map((f, i) => (
                            <div key={i} className={`rounded-xl p-3 border flex items-center gap-3 ${f.good ? "bg-forest-500/5 border-forest-400/20" : "bg-red-50 border-red-200"}`}>
                                {f.good ? <Check className="w-4 h-4 text-forest-500 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />}
                                <div>
                                    <p className="text-xs font-bold text-charcoal-600 font-body">{f.label}</p>
                                    <p className="text-[11px] text-charcoal-400 font-body">{f.note}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

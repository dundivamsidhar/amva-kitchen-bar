"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Users,
  CreditCard,
  BarChart2,
  ArrowLeft,
  RefreshCw,
  ShieldCheck,
  Eye,
  EyeOff,
  LogOut,
  IndianRupee,
  Pencil,
  Check,
  X,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface OrderItem {
  id: number;
  menu_item_name: string;
  quantity: number;
  menu_item_price: number;
}

interface Order {
  id: string;
  table_number: number;
  customer_name: string | null;
  status: string;
  total: number;
  payment_method?: string | null;
  created_at: string;
  order_items: OrderItem[];
}

interface Reservation {
  id: number;
  name: string;
  date: string;
  time: string;
  guests: number;
  status: string;
}

// ─── PIN Screen ───────────────────────────────────────────────────────────────

function PinScreen({ onSuccess }: { onSuccess: () => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [showPin, setShowPin] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const correct = process.env.NEXT_PUBLIC_ADMIN_PIN || "1234";
    if (pin === correct) {
      sessionStorage.setItem("amva_admin", "1");
      onSuccess();
    } else {
      setError(true);
      setPin("");
      setTimeout(() => setError(false), 2000);
    }
  }

  return (
    <div className="min-h-screen bg-[#0d0a04] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-6 mb-10">
          <div className="w-14 h-14 bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center">
            <ShieldCheck className="w-7 h-7 text-brand-gold" />
          </div>
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold text-white">Owner Dashboard</h1>
            <p className="text-white/40 text-sm mt-1">Enter your PIN to continue</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <input
              type={showPin ? "text" : "password"}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter PIN"
              maxLength={8}
              autoFocus
              className={`w-full bg-white/5 border ${
                error ? "border-red-500" : "border-white/10"
              } text-white text-center text-2xl tracking-[0.5em] py-4 px-6 outline-none focus:border-brand-gold transition-colors`}
            />
            <button
              type="button"
              onClick={() => setShowPin((s) => !s)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
            >
              {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {error && (
            <p className="text-red-400 text-xs text-center">Incorrect PIN. Try again.</p>
          )}
          <button
            type="submit"
            className="w-full py-3 bg-brand-gold text-brand-black font-bold tracking-widest uppercase text-sm hover:bg-brand-gold/90 transition-colors"
          >
            Unlock
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  accent = false,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div
      className={`border p-5 flex flex-col gap-2 ${
        accent ? "border-brand-gold/30 bg-brand-gold/5" : "border-white/10 bg-white/[0.02]"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold tracking-[0.15em] uppercase text-white/40">{label}</span>
        {Icon && <Icon className={`w-4 h-4 ${accent ? "text-brand-gold" : "text-white/20"}`} />}
      </div>
      <p className={`font-display text-3xl font-bold ${accent ? "text-brand-gold" : "text-white"}`}>
        {value}
      </p>
      {sub && <p className="text-white/30 text-xs">{sub}</p>}
    </div>
  );
}

// ─── Editable Cost Row ────────────────────────────────────────────────────────

function CostRow({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  hint?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));

  function save() {
    const n = parseFloat(draft);
    if (!isNaN(n) && n >= 0) onChange(n);
    setEditing(false);
  }

  function cancel() {
    setDraft(String(value));
    setEditing(false);
  }

  return (
    <div className="flex items-center justify-between gap-3 py-2.5 border-b border-white/5 last:border-0">
      <div>
        <p className="text-white/70 text-sm">{label}</p>
        {hint && <p className="text-white/25 text-[11px] mt-0.5">{hint}</p>}
      </div>
      {editing ? (
        <div className="flex items-center gap-2">
          <span className="text-white/40 text-sm">₹</span>
          <input
            autoFocus
            type="number"
            min="0"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") cancel(); }}
            className="w-28 bg-white/10 border border-brand-gold/40 text-white text-sm text-right px-2 py-1 outline-none"
          />
          <button onClick={save} className="text-green-400 hover:text-green-300"><Check className="w-4 h-4" /></button>
          <button onClick={cancel} className="text-white/30 hover:text-white/60"><X className="w-4 h-4" /></button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-white font-bold text-sm">₹{value.toLocaleString("en-IN")}</span>
          <button onClick={() => { setDraft(String(value)); setEditing(true); }} className="text-white/20 hover:text-brand-gold transition-colors">
            <Pencil className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Daily P&L Panel ──────────────────────────────────────────────────────────

const PL_STORAGE_KEY = "amva_pl_costs";

interface PLCosts {
  cogsPct: number;       // Food/ingredient cost as % of revenue (default 35%)
  staffWages: number;    // Daily staff wages (₹)
  rent: number;          // Daily rent/lease (₹)
  utilities: number;     // Daily utilities (₹)
  other: number;         // Other daily expenses (₹)
}

const DEFAULT_COSTS: PLCosts = {
  cogsPct: 35,
  staffWages: 8000,
  rent: 5000,
  utilities: 1500,
  other: 500,
};

function DailyPLPanel({ revenue, ordersCount }: { revenue: number; ordersCount: number }) {
  const [costs, setCosts] = useState<PLCosts>(DEFAULT_COSTS);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(PL_STORAGE_KEY);
      if (saved) setCosts({ ...DEFAULT_COSTS, ...JSON.parse(saved) });
    } catch {}
  }, []);

  function updateCost<K extends keyof PLCosts>(key: K, val: number) {
    const next = { ...costs, [key]: val };
    setCosts(next);
    localStorage.setItem(PL_STORAGE_KEY, JSON.stringify(next));
  }

  const cogs = (revenue * costs.cogsPct) / 100;
  const fixedCosts = costs.staffWages + costs.rent + costs.utilities + costs.other;
  const totalCosts = cogs + fixedCosts;
  const grossProfit = revenue - cogs;
  const netProfit = revenue - totalCosts;
  const isProfit = netProfit >= 0;
  const margin = revenue > 0 ? (netProfit / revenue) * 100 : 0;

  return (
    <div className="border border-white/10 bg-white/[0.02] overflow-hidden">
      {/* Header */}
      <div className="bg-brand-dark/60 border-b border-white/10 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IndianRupee className="w-4 h-4 text-brand-gold" />
          <h2 className="text-sm font-bold tracking-widest uppercase text-white">
            Today&apos;s P&amp;L
          </h2>
        </div>
        <span className="text-white/30 text-xs">{new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" })}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-white/5">
        {/* Left — Summary numbers */}
        <div className="p-5 flex flex-col gap-4">
          {/* Revenue hero */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/40 text-xs font-bold tracking-widest uppercase">Total Sales Today</p>
              <p className="font-display text-4xl font-bold text-brand-gold mt-1">
                ₹{revenue.toLocaleString("en-IN")}
              </p>
              <p className="text-white/30 text-xs mt-1">{ordersCount} orders completed</p>
            </div>
            <div
              className={`flex flex-col items-center justify-center w-20 h-20 border-2 ${
                isProfit ? "border-green-500/40 bg-green-500/10" : "border-red-500/40 bg-red-500/10"
              }`}
            >
              {isProfit ? (
                <TrendingUp className="w-5 h-5 text-green-400 mb-1" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-400 mb-1" />
              )}
              <p className={`text-xs font-bold ${isProfit ? "text-green-400" : "text-red-400"}`}>
                {isProfit ? "PROFIT" : "LOSS"}
              </p>
            </div>
          </div>

          {/* P&L breakdown */}
          <div className="flex flex-col gap-0 border border-white/5">
            <div className="flex justify-between items-center px-4 py-2.5 bg-white/[0.02]">
              <span className="text-white/50 text-sm">Revenue</span>
              <span className="text-white font-bold">₹{revenue.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between items-center px-4 py-2.5">
              <span className="text-white/50 text-sm">Food &amp; Ingredient Cost ({costs.cogsPct}%)</span>
              <span className="text-red-400/80 font-bold">− ₹{cogs.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="flex justify-between items-center px-4 py-2.5 bg-white/[0.02] border-t border-white/5">
              <span className="text-white/70 text-sm font-semibold">Gross Profit</span>
              <span className={`font-bold ${grossProfit >= 0 ? "text-green-400" : "text-red-400"}`}>
                ₹{grossProfit.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
              </span>
            </div>
            <div className="flex justify-between items-center px-4 py-2.5">
              <span className="text-white/50 text-sm">Fixed Daily Costs</span>
              <span className="text-red-400/80 font-bold">− ₹{fixedCosts.toLocaleString("en-IN")}</span>
            </div>
            <div
              className={`flex justify-between items-center px-4 py-3 border-t-2 ${
                isProfit ? "border-green-500/30 bg-green-500/5" : "border-red-500/30 bg-red-500/5"
              }`}
            >
              <span className={`font-bold text-sm tracking-wider uppercase ${isProfit ? "text-green-400" : "text-red-400"}`}>
                Net {isProfit ? "Profit" : "Loss"}
              </span>
              <div className="text-right">
                <p className={`font-display text-2xl font-bold ${isProfit ? "text-green-400" : "text-red-400"}`}>
                  {isProfit ? "+" : ""}₹{Math.abs(netProfit).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                </p>
                <p className="text-white/30 text-xs">{margin.toFixed(1)}% margin</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right — Cost inputs */}
        <div className="p-5 flex flex-col gap-3">
          <p className="text-xs font-bold tracking-widest uppercase text-white/40 mb-1">
            Edit Daily Costs <span className="text-white/20 normal-case tracking-normal font-normal">(saved automatically)</span>
          </p>

          {/* COGS % */}
          <div className="flex items-center justify-between gap-3 py-2.5 border-b border-white/5">
            <div>
              <p className="text-white/70 text-sm">Food Cost %</p>
              <p className="text-white/25 text-[11px] mt-0.5">% of revenue for ingredients</p>
            </div>
            <div className="flex items-center gap-1">
              <input
                type="range"
                min="10"
                max="60"
                value={costs.cogsPct}
                onChange={(e) => updateCost("cogsPct", Number(e.target.value))}
                className="w-20 accent-brand-gold"
              />
              <span className="text-brand-gold font-bold text-sm w-10 text-right">{costs.cogsPct}%</span>
            </div>
          </div>

          <CostRow
            label="Staff Wages"
            hint="Daily wages for all staff"
            value={costs.staffWages}
            onChange={(v) => updateCost("staffWages", v)}
          />
          <CostRow
            label="Rent / Lease"
            hint="Daily share of monthly rent"
            value={costs.rent}
            onChange={(v) => updateCost("rent", v)}
          />
          <CostRow
            label="Utilities"
            hint="Electricity, water, gas"
            value={costs.utilities}
            onChange={(v) => updateCost("utilities", v)}
          />
          <CostRow
            label="Other Expenses"
            hint="Packaging, marketing, misc"
            value={costs.other}
            onChange={(v) => updateCost("other", v)}
          />

          {/* Total costs summary */}
          <div className="mt-2 pt-3 border-t border-white/10 flex justify-between items-center">
            <span className="text-white/40 text-xs font-bold tracking-widest uppercase">Total Daily Costs</span>
            <span className="text-white font-bold">₹{totalCosts.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function Dashboard() {
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [todayOrders, setTodayOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayISO = todayStart.toISOString();

    const [{ data: allOrd }, { data: todayOrd }, { data: resv }] = await Promise.all([
      (supabase as any).from("orders").select("*, order_items(*)").order("created_at", { ascending: false }),
      (supabase as any).from("orders").select("*, order_items(*)").gte("created_at", todayISO).order("created_at", { ascending: false }),
      (supabase as any).from("reservations").select("*").order("date", { ascending: true }).order("time", { ascending: true }),
    ]);

    if (allOrd) setAllOrders(allOrd as Order[]);
    if (todayOrd) setTodayOrders(todayOrd as Order[]);
    if (resv) setReservations(resv as Reservation[]);
    setLastRefresh(new Date());
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Derived stats ────────────────────────────────────────────────────────────

  const completedToday = todayOrders.filter((o) => o.status !== "cancelled");
  const revenueToday = completedToday.reduce((s, o) => s + o.total, 0);
  const ordersToday = completedToday.length;

  const statusCounts: Record<string, number> = {};
  for (const o of todayOrders) statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;

  const paymentMap: Record<string, { count: number; revenue: number }> = {};
  for (const o of allOrders.filter((o) => o.status !== "cancelled")) {
    const pm = o.payment_method || "cash";
    if (!paymentMap[pm]) paymentMap[pm] = { count: 0, revenue: 0 };
    paymentMap[pm].count++;
    paymentMap[pm].revenue += o.total;
  }

  const itemCount: Record<string, number> = {};
  for (const o of allOrders) {
    for (const oi of o.order_items) {
      itemCount[oi.menu_item_name] = (itemCount[oi.menu_item_name] || 0) + oi.quantity;
    }
  }
  const topItems = Object.entries(itemCount).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const now = new Date().toISOString().split("T")[0];
  const upcomingResv = reservations.filter((r) => r.date >= now && r.status !== "cancelled").slice(0, 5);

  const STATUS_COLORS_MAP: Record<string, string> = {
    new: "bg-red-500/20 text-red-400",
    acknowledged: "bg-yellow-500/20 text-yellow-400",
    preparing: "bg-blue-400/20 text-blue-400",
    ready: "bg-green-400/20 text-green-400",
    served: "bg-white/10 text-white/40",
    cancelled: "bg-white/5 text-white/20",
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4 mt-8">
        <div className="h-64 bg-white/5 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-28 bg-white/5 animate-pulse" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">

      {/* ── Daily P&L ── */}
      <DailyPLPanel revenue={revenueToday} ordersCount={ordersToday} />

      {/* ── KPI strip ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Revenue Today" value={`₹${revenueToday.toFixed(0)}`} sub="Excl. cancelled" accent icon={TrendingUp} />
        <StatCard label="Orders Today" value={ordersToday} sub={`${todayOrders.filter((o) => o.status === "cancelled").length} cancelled`} icon={ShoppingBag} />
        <StatCard label="Total Orders (All)" value={allOrders.filter((o) => o.status !== "cancelled").length} icon={BarChart2} />
        <StatCard
          label="Total Revenue (All)"
          value={`₹${allOrders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.total, 0).toFixed(0)}`}
          icon={CreditCard}
        />
      </div>

      {/* ── Orders by status ── */}
      <div>
        <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-white/40 mb-3">Orders by Status (Today)</h2>
        <div className="flex flex-wrap gap-3">
          {["new", "acknowledged", "preparing", "ready", "served", "cancelled"].map((s) => (
            <div key={s} className={`px-4 py-3 text-center min-w-[90px] border border-white/5 ${STATUS_COLORS_MAP[s] || "bg-white/5 text-white/40"}`}>
              <p className="text-2xl font-bold font-display">{statusCounts[s] || 0}</p>
              <p className="text-[10px] uppercase tracking-widest mt-1 opacity-70">{s}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Payment breakdown ── */}
      <div>
        <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-white/40 mb-3">Payment Breakdown (All Time)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {Object.entries(paymentMap).length === 0 && <p className="text-white/20 text-sm">No payment data yet.</p>}
          {Object.entries(paymentMap).map(([pm, stats]) => (
            <div key={pm} className="border border-white/10 bg-white/[0.02] p-4">
              <p className="text-xs font-bold tracking-widest uppercase text-white/40 mb-2">{pm}</p>
              <p className="text-xl font-bold text-white font-display">{stats.count} orders</p>
              <p className="text-brand-gold text-sm mt-1">₹{stats.revenue.toFixed(0)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top 5 items */}
        <div>
          <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-white/40 mb-3">Top 5 Items (All Time)</h2>
          <div className="flex flex-col gap-2">
            {topItems.length === 0 && <p className="text-white/20 text-sm">No order data yet.</p>}
            {topItems.map(([name, count], i) => {
              const maxCount = topItems[0]?.[1] || 1;
              return (
                <div key={name} className="flex items-center gap-3">
                  <span className="text-brand-gold font-bold text-sm w-5 text-right shrink-0">{i + 1}</span>
                  <div className="flex-1 relative">
                    <div className="absolute inset-0 bg-brand-gold/10" style={{ width: `${(count / maxCount) * 100}%` }} />
                    <div className="relative flex items-center justify-between px-3 py-2">
                      <span className="text-white text-sm">{name}</span>
                      <span className="text-brand-gold font-bold text-sm">{count}×</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming reservations */}
        <div>
          <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-white/40 mb-3 flex items-center gap-2">
            Upcoming Reservations <Users className="w-3.5 h-3.5" />
          </h2>
          <div className="flex flex-col gap-2">
            {upcomingResv.length === 0 && <p className="text-white/20 text-sm">No upcoming reservations.</p>}
            {upcomingResv.map((r) => (
              <div key={r.id} className="border border-white/10 bg-white/[0.02] px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-white font-medium text-sm">{r.name}</p>
                  <p className="text-white/30 text-xs mt-0.5">{r.date} · {r.time} · {r.guests} guests</p>
                </div>
                <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-1 border ${r.status === "confirmed" ? "border-green-400/30 text-green-400" : "border-yellow-500/30 text-yellow-400"}`}>
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div>
        <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-white/40 mb-3">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                {["Table", "Items", "Total", "Status", "Payment", "Time"].map((h) => (
                  <th key={h} className="text-left text-[10px] font-bold tracking-widest uppercase text-white/30 py-2 pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allOrders.slice(0, 10).map((o) => (
                <tr key={o.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 pr-4 text-white font-medium">T{o.table_number}</td>
                  <td className="py-3 pr-4 text-white/50">
                    {o.order_items.map((oi) => `${oi.quantity}× ${oi.menu_item_name}`).join(", ")}
                  </td>
                  <td className="py-3 pr-4 text-brand-gold font-bold">₹{o.total.toFixed(0)}</td>
                  <td className="py-3 pr-4">
                    <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 ${STATUS_COLORS_MAP[o.status] || "text-white/30"}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-white/40 text-xs uppercase">{o.payment_method || "—"}</td>
                  <td className="py-3 text-white/30 text-xs">
                    {new Date(o.created_at).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {lastRefresh && (
        <p className="text-white/20 text-xs text-right" suppressHydrationWarning>
          Last refreshed: {lastRefresh.toLocaleTimeString("en-IN")}
        </p>
      )}
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [authed, setAuthed] = useState(false);
  const [checked, setChecked] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (sessionStorage.getItem("amva_admin") === "1") setAuthed(true);
    setChecked(true);
  }, []);

  if (!checked) return null;
  if (!authed) return <PinScreen onSuccess={() => setAuthed(true)} />;

  return (
    <div className="min-h-screen bg-[#0d0a04] pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <BarChart2 className="w-5 h-5 text-brand-gold" />
            <h1 className="font-display text-2xl font-bold text-white">Owner Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setRefreshKey((k) => k + 1)}
              className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-white/40 hover:text-white border border-white/10 hover:border-white/30 px-4 py-2 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </button>
            <Link
              href="/admin"
              className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-white/40 hover:text-brand-gold border border-white/10 hover:border-brand-gold/40 px-4 py-2 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Admin
            </Link>
            <button
              onClick={() => { sessionStorage.removeItem("amva_admin"); setAuthed(false); }}
              className="flex items-center gap-1.5 px-3 py-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/60 transition-colors text-xs font-bold uppercase tracking-widest"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>

        <Dashboard key={refreshKey} />
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import {
  ShieldCheck,
  ChefHat,
  Star,
  UtensilsCrossed,
  Eye,
  EyeOff,
  LayoutDashboard,
  LogOut,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface OrderItem {
  id: number;
  menu_item_name: string;
  menu_item_price: number;
  quantity: number;
  notes: string | null;
}

interface Order {
  id: string;
  table_number: number;
  customer_name: string | null;
  status: "new" | "acknowledged" | "preparing" | "ready" | "served" | "cancelled";
  notes: string | null;
  total: number;
  payment_method?: string | null;
  created_at: string;
  order_items: OrderItem[];
}

interface MenuItem {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category_id: number;
  is_available: boolean;
  is_special_today: boolean;
  special_note: string | null;
}

interface MenuCategory {
  id: number;
  name: string;
  slug: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  new: "bg-red-500/20 text-red-400 border border-red-500/30",
  acknowledged: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  preparing: "bg-blue-400/20 text-blue-400 border border-blue-400/30",
  ready: "bg-green-400/20 text-green-400 border border-green-400/30",
  served: "bg-white/10 text-white/40 border border-white/10",
  cancelled: "bg-white/5 text-white/20 border border-white/5",
};

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── PIN Screen ──────────────────────────────────────────────────────────────

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
            <h1 className="font-display text-2xl font-bold text-white">Admin Access</h1>
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

// ─── Tab: Orders ─────────────────────────────────────────────────────────────

function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    const { data } = await (supabase as any)
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });
    if (data) setOrders(data as Order[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  async function changeStatus(orderId: string, status: string) {
    await (supabase as any).from("orders").update({ status }).eq("id", orderId);
    fetchOrders();
  }

  if (loading) {
    return (
      <div className="grid gap-4 mt-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-white/5 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-6 flex flex-col gap-4">
      {orders.length === 0 && (
        <p className="text-white/30 text-center py-12">No orders yet.</p>
      )}
      {orders.map((order) => (
        <div
          key={order.id}
          className="border border-white/10 bg-white/[0.02] p-5 flex flex-col gap-3"
        >
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <span className="font-display text-xl font-bold text-white">
                Table {order.table_number}
              </span>
              {order.customer_name && (
                <span className="text-white/40 text-sm">· {order.customer_name}</span>
              )}
              <span
                className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 ${
                  STATUS_COLORS[order.status] || ""
                }`}
              >
                {order.status}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-white/30 text-xs">{formatTime(order.created_at)}</span>
              {order.payment_method && (
                <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 border border-white/10 text-white/40">
                  {order.payment_method}
                </span>
              )}
              <span className="text-brand-gold font-bold">
                ₹{order.total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Items */}
          <div className="flex flex-wrap gap-2">
            {order.order_items.map((oi) => (
              <span
                key={oi.id}
                className="text-xs px-2 py-1 bg-white/5 text-white/60 border border-white/5"
              >
                {oi.quantity}× {oi.menu_item_name}
              </span>
            ))}
          </div>

          {/* Status change */}
          <div className="flex items-center gap-2">
            <span className="text-white/30 text-xs">Change status:</span>
            <select
              value={order.status}
              onChange={(e) => changeStatus(order.id, e.target.value)}
              className="bg-white/5 border border-white/10 text-white text-xs px-3 py-1.5 outline-none focus:border-brand-gold"
            >
              {["new", "acknowledged", "preparing", "ready", "served", "cancelled"].map(
                (s) => (
                  <option key={s} value={s} className="bg-[#1a1510]">
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                )
              )}
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Tab: Today's Specials ────────────────────────────────────────────────────

function SpecialsTab() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);

  useEffect(() => {
    async function fetch() {
      const { data } = await (supabase as any)
        .from("menu_items")
        .select("id, name, description, price, category_id, is_available, is_special_today, special_note")
        .order("name");
      if (data) setItems(data as MenuItem[]);
      setLoading(false);
    }
    fetch();
  }, []);

  async function toggleSpecial(item: MenuItem) {
    setSaving(item.id);
    const newVal = !item.is_special_today;
    await (supabase as any)
      .from("menu_items")
      .update({ is_special_today: newVal })
      .eq("id", item.id);
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, is_special_today: newVal } : i))
    );
    setSaving(null);
  }

  async function saveNote(item: MenuItem, note: string) {
    setSaving(item.id);
    await (supabase as any)
      .from("menu_items")
      .update({ special_note: note || null })
      .eq("id", item.id);
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, special_note: note || null } : i))
    );
    setSaving(null);
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-28 bg-white/5 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-6">
      <p className="text-white/30 text-sm mb-4">
        {items.filter((i) => i.is_special_today).length} item(s) marked as today&apos;s special
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className={`border p-4 flex flex-col gap-3 transition-colors ${
              item.is_special_today
                ? "border-brand-gold/40 bg-brand-gold/5"
                : "border-white/10 bg-white/[0.02]"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">{item.name}</p>
                <p className="text-white/40 text-xs mt-0.5">₹{item.price}</p>
              </div>
              {/* Toggle switch */}
              <button
                onClick={() => toggleSpecial(item)}
                disabled={saving === item.id}
                className={`relative w-11 h-6 flex-shrink-0 transition-colors rounded-full ${
                  item.is_special_today ? "bg-brand-gold" : "bg-white/10"
                } disabled:opacity-50`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    item.is_special_today ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {item.is_special_today && (
              <div className="flex items-center gap-2">
                <Star className="w-3 h-3 text-brand-gold flex-shrink-0" />
                <input
                  type="text"
                  defaultValue={item.special_note || ""}
                  placeholder="Chef's note (optional)"
                  onBlur={(e) => {
                    if (e.target.value !== (item.special_note || "")) {
                      saveNote(item, e.target.value);
                    }
                  }}
                  className="flex-1 bg-white/5 border border-white/10 text-white text-xs px-2 py-1.5 outline-none focus:border-brand-gold placeholder:text-white/20"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tab: Menu ───────────────────────────────────────────────────────────────

function MenuTab() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);

  useEffect(() => {
    async function fetch() {
      const [{ data: cats }, { data: menuItems }] = await Promise.all([
        (supabase as any).from("menu_categories").select("*").order("display_order"),
        (supabase as any)
          .from("menu_items")
          .select("id, name, price, category_id, is_available, is_special_today, special_note")
          .order("name"),
      ]);
      if (cats) setCategories(cats as MenuCategory[]);
      if (menuItems) setItems(menuItems as MenuItem[]);
      setLoading(false);
    }
    fetch();
  }, []);

  async function toggleAvailable(item: MenuItem) {
    setSaving(item.id);
    const newVal = !item.is_available;
    await (supabase as any)
      .from("menu_items")
      .update({ is_available: newVal })
      .eq("id", item.id);
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, is_available: newVal } : i))
    );
    setSaving(null);
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6 mt-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 bg-white/5 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-6 flex flex-col gap-8">
      {categories.map((cat) => {
        const catItems = items.filter((i) => i.category_id === cat.id);
        if (catItems.length === 0) return null;
        return (
          <div key={cat.id}>
            <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-brand-gold mb-3 flex items-center gap-2">
              {cat.name}
              <span className="text-white/20 font-normal normal-case tracking-normal">
                ({catItems.length} items)
              </span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {catItems.map((item) => (
                <div
                  key={item.id}
                  className={`border px-4 py-3 flex items-center justify-between gap-3 transition-colors ${
                    item.is_available
                      ? "border-white/10 bg-white/[0.02]"
                      : "border-white/5 bg-white/[0.01] opacity-50"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-white text-sm font-medium truncate">{item.name}</p>
                    <p className="text-white/30 text-xs mt-0.5">₹{item.price}</p>
                  </div>
                  <button
                    onClick={() => toggleAvailable(item)}
                    disabled={saving === item.id}
                    title={item.is_available ? "Mark unavailable" : "Mark available"}
                    className={`relative w-11 h-6 flex-shrink-0 transition-colors rounded-full ${
                      item.is_available ? "bg-green-500/70" : "bg-white/10"
                    } disabled:opacity-50`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        item.is_available ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────

const TABS = [
  { id: "orders", label: "Orders", icon: UtensilsCrossed },
  { id: "specials", label: "Today's Specials", icon: Star },
  { id: "menu", label: "Menu", icon: ChefHat },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [checked, setChecked] = useState(false);
  const [tab, setTab] = useState<TabId>("orders");

  useEffect(() => {
    if (sessionStorage.getItem("amva_admin") === "1") {
      setAuthed(true);
    }
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
            <ShieldCheck className="w-5 h-5 text-brand-gold" />
            <h1 className="font-display text-2xl font-bold text-white">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-white/40 hover:text-brand-gold border border-white/10 hover:border-brand-gold/40 px-4 py-2 transition-colors"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Dashboard
            </Link>
            <Link
              href="/kitchen"
              className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-white/40 hover:text-brand-gold border border-white/10 hover:border-brand-gold/40 px-4 py-2 transition-colors"
            >
              <ChefHat className="w-3.5 h-3.5" />
              Kitchen
            </Link>
            <button
              onClick={() => {
                sessionStorage.removeItem("amva_admin");
                setAuthed(false);
              }}
              className="flex items-center gap-1.5 px-3 py-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/60 transition-colors text-xs font-bold uppercase tracking-widest"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex border-b border-white/10 mb-6 gap-0">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-5 py-3 text-xs font-bold tracking-widest uppercase transition-colors border-b-2 -mb-px ${
                tab === id
                  ? "border-brand-gold text-brand-gold"
                  : "border-transparent text-white/40 hover:text-white"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === "orders" && <OrdersTab />}
        {tab === "specials" && <SpecialsTab />}
        {tab === "menu" && <MenuTab />}
      </div>
    </div>
  );
}

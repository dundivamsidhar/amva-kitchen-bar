"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import {
  ChefHat,
  Clock,
  CheckCheck,
  Bell,
  RefreshCw,
  Martini,
  UtensilsCrossed,
  LayoutList,
  Eye,
  EyeOff,
  ConciergeBell,
  LogOut,
} from "lucide-react";
import toast from "react-hot-toast";

// ─── Kitchen PIN Screen ───────────────────────────────────────────────────────

function KitchenPinScreen({ onSuccess }: { onSuccess: () => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [showPin, setShowPin] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const correct = process.env.NEXT_PUBLIC_KITCHEN_PIN || "7410";
    if (pin === correct) {
      sessionStorage.setItem("amva_kitchen", "1");
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
          <div className="w-14 h-14 bg-brand-red/10 border border-brand-red/30 flex items-center justify-center">
            <ConciergeBell className="w-7 h-7 text-brand-red" />
          </div>
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold text-white">Kitchen Access</h1>
            <p className="text-white/40 text-sm mt-1">Staff PIN required to continue</p>
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
              } text-white text-center text-2xl tracking-[0.5em] py-4 px-6 outline-none focus:border-brand-red transition-colors`}
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
            className="w-full py-3 bg-brand-red text-white font-bold tracking-widest uppercase text-sm hover:bg-brand-red/80 transition-colors"
          >
            Enter Kitchen
          </button>
        </form>
      </div>
    </div>
  );
}

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
  created_at: string;
  order_items: OrderItem[];
}

// ─── Bar keyword detection ────────────────────────────────────────────────────

const BAR_KEYWORDS = [
  "Sour",
  "Negroni",
  "Margarita",
  "Old Fashioned",
  "Daiquiri",
  "Rose Garden",
  "Kokum",
  "Lassi",
  "Cooler",
  "Fizz",
  "Lemonade",
  "Draught",
  "Jack Daniel",
  "Sula",
  "Grover",
  "Whiskey",
  "Whisky",
  "Mojito",
  "Gin",
  "Vodka",
  "Rum",
  "Tequila",
  "Beer",
  "Wine",
  "Cocktail",
  "Mocktail",
  "Spritz",
];

function isBarItem(name: string): boolean {
  const lower = name.toLowerCase();
  return BAR_KEYWORDS.some((kw) => lower.includes(kw.toLowerCase()));
}

function isBarOrder(order: Order): boolean {
  return order.order_items.some((oi) => isBarItem(oi.menu_item_name));
}

function isFoodOrder(order: Order): boolean {
  return order.order_items.some((oi) => !isBarItem(oi.menu_item_name));
}

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  new: {
    label: "New",
    color: "border-brand-red bg-brand-red/10 text-brand-red",
    next: "acknowledged" as const,
    action: "Acknowledge",
  },
  acknowledged: {
    label: "Acknowledged",
    color: "border-yellow-500 bg-yellow-500/10 text-yellow-400",
    next: "preparing" as const,
    action: "Start Cooking",
  },
  preparing: {
    label: "Preparing",
    color: "border-blue-400 bg-blue-400/10 text-blue-400",
    next: "ready" as const,
    action: "Mark Ready",
  },
  ready: {
    label: "Ready",
    color: "border-green-400 bg-green-400/10 text-green-400",
    next: "served" as const,
    action: "Mark Served",
  },
  served: {
    label: "Served",
    color: "border-white/20 bg-white/5 text-white/40",
    next: null,
    action: null,
  },
  cancelled: {
    label: "Cancelled",
    color: "border-white/10 bg-white/5 text-white/20",
    next: null,
    action: null,
  },
};

function timeAgo(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

// ─── Order Card ───────────────────────────────────────────────────────────────

function OrderCard({
  order,
  onStatusChange,
}: {
  order: Order;
  onStatusChange: () => void;
}) {
  const cfg = STATUS_CONFIG[order.status];
  const [updating, setUpdating] = useState(false);
  const isNew = order.status === "new";

  async function advanceStatus() {
    if (!cfg.next) return;
    const nextStatus = cfg.next;
    setUpdating(true);
    const { error } = await (supabase as any)
      .from("orders")
      .update({ status: nextStatus })
      .eq("id", order.id);
    if (!error) {
      toast.success(`Order #${order.table_number} → ${STATUS_CONFIG[nextStatus].label}`);
      onStatusChange();
    } else {
      toast.error("Failed to update status");
    }
    setUpdating(false);
  }

  async function cancelOrder() {
    setUpdating(true);
    await (supabase as any)
      .from("orders")
      .update({ status: "cancelled" })
      .eq("id", order.id);
    onStatusChange();
    setUpdating(false);
  }

  return (
    <div
      className={`border-2 ${cfg.color} p-0 flex flex-col relative ${
        isNew ? "animate-pulse-border" : ""
      }`}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between px-4 py-3 border-b border-white/5 ${
          isNew ? "bg-brand-red/10" : "bg-brand-dark/80"
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="font-display text-2xl font-bold text-white">
            T{order.table_number}
          </span>
          {order.customer_name && (
            <span className="text-white/50 text-sm">· {order.customer_name}</span>
          )}
          {isNew && (
            <span className="flex items-center gap-1 text-brand-red text-xs font-bold animate-bounce">
              <Bell className="w-3 h-3" /> NEW
            </span>
          )}
        </div>
        <span
          className={`text-[10px] font-bold tracking-widest uppercase px-2 py-1 border ${cfg.color}`}
        >
          {cfg.label}
        </span>
      </div>

      {/* Items */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        {order.order_items.map((oi) => (
          <div key={oi.id} className="flex items-start gap-2">
            <span className="text-brand-gold font-bold text-sm w-5 shrink-0">
              {oi.quantity}×
            </span>
            <div>
              <p className="text-white text-sm font-medium">{oi.menu_item_name}</p>
              {oi.notes && (
                <p className="text-yellow-400/70 text-xs mt-0.5">⚠ {oi.notes}</p>
              )}
            </div>
          </div>
        ))}

        {order.notes && (
          <div className="mt-2 p-2 border border-yellow-500/20 bg-yellow-500/5">
            <p className="text-yellow-400/80 text-xs">
              <span className="font-bold">Note:</span> {order.notes}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 pb-4 flex items-center justify-between gap-2 border-t border-white/5 pt-3">
        <div className="flex items-center gap-1.5 text-white/30 text-xs">
          <Clock className="w-3 h-3" />
          {timeAgo(order.created_at)}
        </div>
        <div className="flex gap-2">
          {order.status !== "served" && order.status !== "cancelled" && (
            <button
              onClick={cancelOrder}
              disabled={updating}
              className="text-xs text-white/20 hover:text-brand-red transition-colors px-2 py-1 border border-white/5 hover:border-brand-red/30"
            >
              Cancel
            </button>
          )}
          {cfg.next && (
            <button
              onClick={advanceStatus}
              disabled={updating}
              className={`text-xs font-bold px-3 py-1.5 transition-all disabled:opacity-50 ${
                isNew
                  ? "bg-brand-red text-white hover:bg-brand-red-light"
                  : order.status === "ready"
                  ? "bg-green-600 text-white hover:bg-green-500"
                  : "bg-brand-gold text-brand-black hover:bg-brand-gold-light"
              }`}
            >
              {updating ? "..." : cfg.action}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Order Group ──────────────────────────────────────────────────────────────

function OrderGroup({
  status,
  orders,
  onStatusChange,
}: {
  status: string;
  orders: Order[];
  onStatusChange: () => void;
}) {
  if (orders.length === 0) return null;
  const cfg = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <h2
          className={`text-xs font-bold tracking-[0.2em] uppercase ${
            cfg.color.split(" ")[2]
          }`}
        >
          {cfg.label}
        </h2>
        <span className={`text-xs font-bold px-2 py-0.5 border ${cfg.color}`}>
          {orders.length}
        </span>
        <div className="flex-1 h-px bg-white/5" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} onStatusChange={onStatusChange} />
        ))}
      </div>
    </div>
  );
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ACTIVE_STATUSES = ["new", "acknowledged", "preparing", "ready"];
const ALL_STATUSES = [...ACTIVE_STATUSES, "served"];

type KitchenTab = "all" | "food" | "bar";

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function KitchenPage() {
  const [authed, setAuthed] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("amva_kitchen") === "1") {
      setAuthed(true);
    }
    setChecked(true);
    document.body.classList.add("kitchen-portal");
    return () => { document.body.classList.remove("kitchen-portal"); };
  }, []);

  if (!checked) return null;
  if (!authed) return <KitchenPinScreen onSuccess={() => setAuthed(true)} />;

  function handleSignOut() {
    sessionStorage.removeItem("amva_kitchen");
    setAuthed(false);
  }

  return <KitchenDisplay onSignOut={handleSignOut} />;
}

function KitchenDisplay({ onSignOut }: { onSignOut: () => void }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [servedToday, setServedToday] = useState(0);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"active" | "all">("active");
  const [kitchenTab, setKitchenTab] = useState<KitchenTab>("all");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchOrders = useCallback(async () => {
    const statuses = view === "active" ? ACTIVE_STATUSES : ALL_STATUSES;
    const { data, error } = await (supabase as any)
      .from("orders")
      .select("*, order_items(*)")
      .in("status", statuses)
      .order("created_at", { ascending: true });

    if (!error && data) {
      setOrders(data as Order[]);
      setLastUpdated(new Date());
    }

    // Served count today
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const { count } = await (supabase as any)
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("status", "served")
      .gte("created_at", todayStart.toISOString());
    if (count !== null) setServedToday(count);

    setLoading(false);
  }, [view]);

  useEffect(() => {
    fetchOrders();

    const channel = supabase
      .channel("kitchen-orders")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            toast(
              `🔔 New order — Table ${(payload.new as Order).table_number}!`,
              { duration: 6000, style: { fontWeight: "bold", fontSize: "15px" } }
            );
          }
          fetchOrders();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "order_items" },
        () => { fetchOrders(); }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchOrders]);

  // ── Stats ──────────────────────────────────────────────────────────────────

  const newCount = orders.filter((o) => o.status === "new").length;
  const preparingCount = orders.filter((o) => o.status === "preparing").length;
  const readyCount = orders.filter((o) => o.status === "ready").length;

  // ── Filter by tab ─────────────────────────────────────────────────────────

  function filterByTab(list: Order[]): Order[] {
    if (kitchenTab === "food") return list.filter(isFoodOrder);
    if (kitchenTab === "bar") return list.filter(isBarOrder);
    return list;
  }

  const displayedOrders = filterByTab(orders);

  return (
    <div className="min-h-screen bg-brand-black pt-20">
      {/* Stats bar */}
      <div className="bg-brand-dark/80 border-b border-white/5 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-4 flex-wrap">
          <div
            className={`flex items-center gap-2 px-4 py-2 border text-sm font-bold ${
              newCount > 0
                ? "border-brand-red/40 bg-brand-red/10 text-brand-red"
                : "border-white/5 text-white/20"
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>{newCount} New</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 border border-blue-400/20 text-blue-400/70 text-sm font-bold">
            <ChefHat className="w-3.5 h-3.5" />
            {preparingCount} Preparing
          </div>
          <div
            className={`flex items-center gap-2 px-4 py-2 border text-sm font-bold ${
              readyCount > 0
                ? "border-green-400/40 bg-green-400/10 text-green-400"
                : "border-white/5 text-white/20"
            }`}
          >
            <CheckCheck className="w-3.5 h-3.5" />
            {readyCount} Ready
          </div>
          <div className="flex items-center gap-2 px-4 py-2 border border-white/5 text-white/30 text-sm font-bold">
            <CheckCheck className="w-3.5 h-3.5" />
            {servedToday} Served today
          </div>
        </div>
      </div>

      {/* KDS Header */}
      <div className="sticky top-16 z-30 bg-brand-dark/95 backdrop-blur-md border-b border-white/5 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <ChefHat className="w-5 h-5 text-brand-gold" />
            <h1 className="font-display text-lg font-bold text-white">Kitchen Display</h1>
            {newCount > 0 && (
              <span className="bg-brand-red text-white text-xs font-bold px-2.5 py-1 animate-pulse">
                {newCount} NEW
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Food / Bar / All tab bar */}
            <div className="flex border border-white/10">
              {(
                [
                  { id: "all" as KitchenTab, label: "All Orders", icon: LayoutList },
                  { id: "food" as KitchenTab, label: "Food", icon: UtensilsCrossed },
                  { id: "bar" as KitchenTab, label: "Bar", icon: Martini },
                ] as const
              ).map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setKitchenTab(id)}
                  className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${
                    kitchenTab === id
                      ? "bg-brand-gold text-brand-black"
                      : "text-white/40 hover:text-white"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>

            {/* Active / All toggle */}
            <div className="flex border border-white/10">
              {(["active", "all"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${
                    view === v
                      ? "bg-white/10 text-white"
                      : "text-white/40 hover:text-white"
                  }`}
                >
                  {v === "active" ? "Active" : "All Today"}
                </button>
              ))}
            </div>

            <button
              onClick={fetchOrders}
              className="text-white/30 hover:text-white transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            {lastUpdated && (
              <span
                className="text-white/20 text-xs hidden sm:block"
                suppressHydrationWarning
              >
                Updated {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={onSignOut}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/60 transition-colors text-xs font-bold uppercase tracking-widest"
              title="Sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-48 bg-brand-dark border border-white/5 animate-pulse"
              />
            ))}
          </div>
        ) : displayedOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <CheckCheck className="w-12 h-12 text-white/10" />
            <p className="text-white/30 text-lg font-display">All clear — no orders</p>
            <p className="text-white/20 text-sm">
              {kitchenTab !== "all"
                ? `No ${kitchenTab} orders right now`
                : "New orders will appear here instantly"}
            </p>
          </div>
        ) : (
          <>
            {ACTIVE_STATUSES.map((status) => (
              <OrderGroup
                key={status}
                status={status}
                orders={displayedOrders.filter((o) => o.status === status)}
                onStatusChange={fetchOrders}
              />
            ))}

            {view === "all" && (
              <OrderGroup
                status="served"
                orders={displayedOrders.filter((o) => o.status === "served")}
                onStatusChange={fetchOrders}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

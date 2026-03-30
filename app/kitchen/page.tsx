"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { ChefHat, Clock, CheckCheck, Flame, Bell, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

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

const STATUS_CONFIG = {
  new:          { label: "New",         color: "border-brand-red bg-brand-red/10 text-brand-red",       next: "acknowledged",  action: "Acknowledge" },
  acknowledged: { label: "Acknowledged",color: "border-yellow-500 bg-yellow-500/10 text-yellow-400",    next: "preparing",     action: "Start Cooking" },
  preparing:    { label: "Preparing",   color: "border-blue-400 bg-blue-400/10 text-blue-400",           next: "ready",         action: "Mark Ready" },
  ready:        { label: "Ready",       color: "border-green-400 bg-green-400/10 text-green-400",        next: "served",        action: "Mark Served" },
  served:       { label: "Served",      color: "border-white/20 bg-white/5 text-white/40",               next: null,            action: null },
  cancelled:    { label: "Cancelled",   color: "border-white/10 bg-white/5 text-white/20",               next: null,            action: null },
};

function timeAgo(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

function OrderCard({ order, onStatusChange }: { order: Order; onStatusChange: () => void }) {
  const cfg = STATUS_CONFIG[order.status];
  const [updating, setUpdating] = useState(false);
  const isNew = order.status === "new";

  async function advanceStatus() {
    if (!cfg.next) return;
    setUpdating(true);
    const { error } = await supabase
      .from("orders")
      .update({ status: cfg.next })
      .eq("id", order.id);
    if (!error) {
      toast.success(`Order #${order.table_number} → ${STATUS_CONFIG[cfg.next as keyof typeof STATUS_CONFIG].label}`);
      onStatusChange();
    } else {
      toast.error("Failed to update status");
    }
    setUpdating(false);
  }

  async function cancelOrder() {
    setUpdating(true);
    await supabase.from("orders").update({ status: "cancelled" }).eq("id", order.id);
    onStatusChange();
    setUpdating(false);
  }

  return (
    <div className={`border-2 ${cfg.color} p-0 flex flex-col relative ${isNew ? "animate-pulse-border" : ""}`}>
      {/* Card header */}
      <div className={`flex items-center justify-between px-4 py-3 border-b border-white/5 ${isNew ? "bg-brand-red/10" : "bg-brand-dark/80"}`}>
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
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-1 border ${cfg.color}`}>
            {cfg.label}
          </span>
        </div>
      </div>

      {/* Items */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        {order.order_items.map((oi) => (
          <div key={oi.id} className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2">
              <span className="text-brand-gold font-bold text-sm w-5 shrink-0">{oi.quantity}×</span>
              <div>
                <p className="text-white text-sm font-medium">{oi.menu_item_name}</p>
                {oi.notes && (
                  <p className="text-yellow-400/70 text-xs mt-0.5">⚠ {oi.notes}</p>
                )}
              </div>
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

const ACTIVE_STATUSES = ["new", "acknowledged", "preparing", "ready"];
const ALL_STATUSES = [...ACTIVE_STATUSES, "served"];

export default function KitchenPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"active" | "all">("active");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchOrders = useCallback(async () => {
    const statuses = view === "active" ? ACTIVE_STATUSES : ALL_STATUSES;
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .in("status", statuses)
      .order("created_at", { ascending: true });

    if (!error && data) {
      setOrders(data as Order[]);
      setLastUpdated(new Date()); // client-only, safe after mount
    }
    setLoading(false);
  }, [view]);

  useEffect(() => {
    fetchOrders();

    // Supabase Realtime subscription — new orders appear instantly
    const channel = supabase
      .channel("kitchen-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, (payload) => {
        if (payload.eventType === "INSERT") {
          toast(
            `🔔 New order — Table ${(payload.new as Order).table_number}!`,
            { duration: 6000, style: { fontWeight: "bold", fontSize: "15px" } }
          );
        }
        fetchOrders();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "order_items" }, () => {
        fetchOrders();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchOrders]);

  const newCount = orders.filter((o) => o.status === "new").length;

  return (
    <div className="min-h-screen bg-brand-black pt-20">
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

          <div className="flex items-center gap-3">
            {/* View toggle */}
            <div className="flex border border-white/10">
              {(["active", "all"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${
                    view === v ? "bg-brand-gold text-brand-black" : "text-white/40 hover:text-white"
                  }`}
                >
                  {v === "active" ? "Active" : "All Today"}
                </button>
              ))}
            </div>

            {/* Stats */}
            <div className="hidden sm:flex items-center gap-4 text-xs text-white/30">
              {ACTIVE_STATUSES.map((s) => {
                const count = orders.filter((o) => o.status === s).length;
                const cfg = STATUS_CONFIG[s as keyof typeof STATUS_CONFIG];
                return count > 0 ? (
                  <span key={s} className={`font-bold ${cfg.color.split(" ")[2]}`}>
                    {count} {cfg.label}
                  </span>
                ) : null;
              })}
            </div>

            <button onClick={fetchOrders} className="text-white/30 hover:text-white transition-colors" title="Refresh">
              <RefreshCw className="w-4 h-4" />
            </button>
            {lastUpdated && (
              <span className="text-white/20 text-xs hidden sm:block" suppressHydrationWarning>
                Updated {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-brand-dark border border-white/5 animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <CheckCheck className="w-12 h-12 text-white/10" />
            <p className="text-white/30 text-lg font-display">All clear — no active orders</p>
            <p className="text-white/20 text-sm">New orders will appear here instantly</p>
          </div>
        ) : (
          <>
            {/* Group by status */}
            {ACTIVE_STATUSES.filter(s => view === "all" || s !== "served").map((status) => {
              const group = orders.filter((o) => o.status === status);
              if (group.length === 0) return null;
              const cfg = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];
              return (
                <div key={status} className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <h2 className={`text-xs font-bold tracking-[0.2em] uppercase ${cfg.color.split(" ")[2]}`}>
                      {cfg.label}
                    </h2>
                    <span className={`text-xs font-bold px-2 py-0.5 border ${cfg.color}`}>
                      {group.length}
                    </span>
                    <div className="flex-1 h-px bg-white/5" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {group.map((order) => (
                      <OrderCard key={order.id} order={order} onStatusChange={fetchOrders} />
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Served section */}
            {view === "all" && (
              (() => {
                const served = orders.filter(o => o.status === "served");
                if (served.length === 0) return null;
                return (
                  <div className="mb-8 opacity-50">
                    <div className="flex items-center gap-3 mb-4">
                      <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-white/30">Served</h2>
                      <span className="text-xs font-bold px-2 py-0.5 border border-white/10 text-white/30">{served.length}</span>
                      <div className="flex-1 h-px bg-white/5" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {served.map((order) => (
                        <OrderCard key={order.id} order={order} onStatusChange={fetchOrders} />
                      ))}
                    </div>
                  </div>
                );
              })()
            )}
          </>
        )}
      </div>
    </div>
  );
}

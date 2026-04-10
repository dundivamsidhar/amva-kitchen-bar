"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Script from "next/script";
import { Minus, Plus, Trash2, ChefHat, ShoppingBag, CreditCard, Smartphone, Banknote, CheckCircle2, Clock, UtensilsCrossed, Bell, Truck, Star } from "lucide-react";
import { useCart } from "@/lib/CartContext";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import UpiModal from "@/components/UpiModal";

type PaymentMethod = "upi" | "card" | "cash";

const PAYMENT_OPTIONS: { id: PaymentMethod; label: string; sub: string; icon: React.ReactNode }[] = [
  {
    id: "upi",
    label: "UPI / QR",
    sub: "Google Pay · PhonePe · Paytm · Any UPI",
    icon: <Smartphone className="w-5 h-5" />,
  },
  {
    id: "card",
    label: "Card / Net Banking",
    sub: "Visa · Mastercard · RuPay · Net Banking",
    icon: <CreditCard className="w-5 h-5" />,
  },
  {
    id: "cash",
    label: "Cash at Table",
    sub: "Pay when your order arrives",
    icon: <Banknote className="w-5 h-5" />,
  },
];

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

// ─── Order Status Tracker ─────────────────────────────────────────────────────

const STATUS_STEPS = [
  { key: "new",          label: "Order Received",  icon: Bell },
  { key: "acknowledged", label: "Acknowledged",    icon: CheckCircle2 },
  { key: "preparing",    label: "Preparing",       icon: ChefHat },
  { key: "ready",        label: "Ready",           icon: UtensilsCrossed },
  { key: "served",       label: "Delivered",       icon: Truck },
] as const;

const STATUS_ORDER = STATUS_STEPS.map((s) => s.key);

function StarRating({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-white/40 text-xs font-bold uppercase tracking-widest">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i)}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(0)}
            className="p-1 transition-transform active:scale-110"
          >
            <Star
              className="w-7 h-7 transition-colors"
              fill={(hovered || value) >= i ? "#D4A017" : "transparent"}
              stroke={(hovered || value) >= i ? "#D4A017" : "rgba(255,255,255,0.2)"}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

function FeedbackForm({ orderId, onDone }: { orderId: string; onDone: () => void }) {
  const [food, setFood] = useState(0);
  const [service, setService] = useState(0);
  const [ambience, setAmbience] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch("/api/submit-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          foodRating: food || null,
          serviceRating: service || null,
          ambienceRating: ambience || null,
          comment: comment.trim() || null,
        }),
      });
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="w-full border border-brand-gold/20 bg-brand-gold/5 p-6 flex flex-col items-center gap-3 text-center">
        <span className="text-3xl">🙏</span>
        <p className="font-display text-xl font-bold text-white">Thank you for your feedback!</p>
        <p className="text-white/40 text-sm">Your thoughts help us improve every day.</p>
        <button onClick={onDone} className="btn-primary text-xs mt-2">Done</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full border border-white/10 bg-white/[0.02] p-6 flex flex-col gap-6">
      <div className="text-center">
        <p className="font-display text-xl font-bold text-white">How was your experience?</p>
        <p className="text-white/40 text-sm mt-1">Rate your meal & share your thoughts</p>
      </div>

      {/* Star ratings */}
      <div className="grid grid-cols-3 gap-4">
        <StarRating value={food} onChange={setFood} label="Food" />
        <StarRating value={service} onChange={setService} label="Service" />
        <StarRating value={ambience} onChange={setAmbience} label="Ambience" />
      </div>

      {/* Comment */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Tell us more — what did you love? What can we improve?"
        rows={3}
        className="w-full bg-brand-dark border border-white/10 text-white placeholder:text-white/20 text-sm p-4 resize-none focus:outline-none focus:border-brand-gold/50 transition-colors"
      />

      <div className="flex gap-3 justify-end">
        <button type="button" onClick={onDone} className="btn-ghost text-xs">Skip</button>
        <button
          type="submit"
          disabled={submitting || (!food && !service && !ambience && !comment.trim())}
          className="btn-primary text-xs disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitting ? "Submitting…" : "Submit Feedback"}
        </button>
      </div>
    </form>
  );
}

function OrderStatusTracker({ orderId, tableNumber, paymentMethod, onNewOrder, onOrderMore }: {
  orderId: string;
  tableNumber: number | string;
  paymentMethod: string;
  onNewOrder: () => void;
  onOrderMore: () => void;
}) {
  const [status, setStatus] = useState<string>("new");
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchStatus() {
      const { data } = await (supabase as any)
        .from("orders").select("status").eq("id", orderId).single();
      if (!cancelled && data) setStatus(data.status);
    }

    fetchStatus();

    // Poll every 5 seconds as reliable fallback (row-level filter on
    // postgres_changes requires REPLICA IDENTITY FULL which may not be set)
    const poll = setInterval(fetchStatus, 5000);

    // Also subscribe without row filter — fire only when our order matches
    const channelName = `order-status-${orderId}-${Date.now()}`;
    const channel = (supabase as any)
      .channel(channelName)
      .on("postgres_changes", {
        event: "UPDATE",
        schema: "public",
        table: "orders",
      }, (payload: { new: { id: string; status: string } }) => {
        if (!cancelled && payload.new.id === orderId) {
          setStatus(payload.new.status);
        }
      })
      .subscribe();

    return () => {
      cancelled = true;
      clearInterval(poll);
      (supabase as any).removeChannel(channel);
    };
  }, [orderId]);

  const currentIdx = STATUS_ORDER.indexOf(status as typeof STATUS_ORDER[number]);
  const isServed = status === "served";

  // Auto-show feedback form when order is served
  useEffect(() => {
    if (isServed) {
      const timer = setTimeout(() => setShowFeedback(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [isServed]);

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center px-4 pt-20 pb-12">
      <div className="max-w-md w-full flex flex-col items-center gap-8">
        {/* Icon */}
        <div className={`w-20 h-20 border-2 flex items-center justify-center transition-colors ${
          isServed ? "bg-green-500/10 border-green-500/40" : "bg-brand-gold/10 border-brand-gold/40"
        }`}>
          {isServed
            ? <CheckCircle2 className="w-9 h-9 text-green-400" />
            : <Clock className="w-9 h-9 text-brand-gold animate-pulse" />
          }
        </div>

        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-white">
            {isServed ? "Enjoy your meal!" : "Order Placed!"}
          </h2>
          <p className="text-white/50 text-sm mt-2">
            Table <span className="text-brand-gold font-bold">{tableNumber}</span>
            {" · "}
            {paymentMethod === "cash" ? "Pay at table" : paymentMethod.toUpperCase()}
          </p>
        </div>

        {/* Step tracker */}
        <div className="w-full flex flex-col gap-0">
          {STATUS_STEPS.map((step, idx) => {
            const done = idx < currentIdx;
            const active = idx === currentIdx;
            const Icon = step.icon;
            return (
              <div key={step.key} className="flex items-start gap-4">
                {/* Line + dot */}
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                    done    ? "bg-brand-gold border-brand-gold"
                    : active ? "bg-brand-gold/10 border-brand-gold animate-pulse"
                    :          "bg-white/5 border-white/15"
                  }`}>
                    <Icon className={`w-3.5 h-3.5 ${done || active ? "text-brand-gold" : "text-white/20"}`} />
                  </div>
                  {idx < STATUS_STEPS.length - 1 && (
                    <div className={`w-0.5 h-8 transition-colors ${done ? "bg-brand-gold" : "bg-white/10"}`} />
                  )}
                </div>
                {/* Label */}
                <div className="pt-1.5 pb-6">
                  <p className={`text-sm font-semibold ${done || active ? "text-white" : "text-white/30"}`}>
                    {step.label}
                  </p>
                  {active && !isServed && (
                    <p className="text-brand-gold/70 text-xs mt-0.5">In progress…</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Feedback form — shown 1.5s after served */}
        {isServed && showFeedback && (
          <FeedbackForm
            orderId={orderId}
            onDone={onNewOrder}
          />
        )}

        <div className="flex gap-3 flex-wrap justify-center">
          {!isServed && (
            <button onClick={onOrderMore} className="btn-primary text-xs">
              + Order More
            </button>
          )}
          {isServed && !showFeedback && (
            <button onClick={onNewOrder} className="btn-primary text-xs">
              New Order
            </button>
          )}
          <Link href="/" className="btn-ghost text-xs">Back to Home</Link>
        </div>
        {!isServed && (
          <p className="text-white/25 text-xs text-center mt-2">
            Clicking &ldquo;Order More&rdquo; lets you add items to a new order for the same table
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Order Page ───────────────────────────────────────────────────────────────

export default function OrderPage() {
  const { cart, removeFromCart, updateQuantity, updateNotes, clearCart, total, count } = useCart();
  const [tableNumber, setTableNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [placing, setPlacing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [upiConfirming, setUpiConfirming] = useState(false);
  const [tableError, setTableError] = useState(false);
  const tableInputRef = useRef<HTMLInputElement>(null);

  // Restore order session from localStorage on mount
  useEffect(() => {
    try {
      // Check active order session first
      const saved = localStorage.getItem("amva_order_session");
      if (saved) {
        const { id, table, payment, name } = JSON.parse(saved);
        if (id && table) {
          setOrderId(id);
          setTableNumber(String(table));
          setPaymentMethod(payment ?? "cash");
          if (name) setCustomerName(name);
          return;
        }
      }
      // No active session — form shows empty (fresh order)
    } catch { /* ignore */ }
  }, []);

  // Helper to save/clear order session
  function saveOrderSession(id: string, table: string, payment: PaymentMethod) {
    localStorage.setItem("amva_order_session", JSON.stringify({ id, table, payment, name: customerName }));
  }
  function clearOrderSession() {
    localStorage.removeItem("amva_order_session");
  }
  function startReorder() {
    // tableNumber, customerName, paymentMethod are already in React state —
    // just clear the session and show the form. No navigation needed.
    clearOrderSession();
    setOrderId(null);
    // tableNumber, customerName, paymentMethod stay as-is (already set)
  }

  // ── Save order to Supabase after payment confirmed ──────────────────────────
  async function saveOrderToKitchen(paymentRef: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: order, error: orderError } = await (supabase as any)
      .from("orders")
      .insert({
        table_number: parseInt(tableNumber),
        customer_name: customerName || null,
        notes: orderNotes || null,
        total,
        status: "new",
        payment_method: paymentMethod,
        payment_ref: paymentRef,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: itemsError } = await (supabase as any).from("order_items").insert(
      cart.map((c) => ({
        order_id: order.id,
        menu_item_id: null,          // static menu — no DB row; name+price stored directly
        menu_item_name: c.item.name,
        menu_item_price: c.item.price,
        quantity: c.quantity,
        notes: c.notes || null,
      }))
    );

    if (itemsError) throw itemsError;

    // Send order notification email to restaurant (fire and forget)
    fetch("/api/send-order-confirmation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: order.id,
        customerName: customerName || null,
        tableNumber,
        items: cart.map((c) => ({
          name: c.item.name,
          quantity: c.quantity,
          price: c.item.price,
          notes: c.notes || null,
        })),
        total,
        paymentMethod,
      }),
    }).catch(() => {}); // silently ignore email errors

    return order.id;
  }

  // ── Razorpay checkout flow ───────────────────────────────────────────────────
  async function openRazorpay() {
    // Create order on server
    const res = await fetch("/api/create-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: total }),
    });
    const rzpOrder = await res.json();

    if (rzpOrder.demo) {
      // No real Razorpay keys yet — skip to cash-style confirmation
      toast("Demo mode — add Razorpay keys to go live", { icon: "ℹ️" });
      const id = await saveOrderToKitchen("demo");
      setOrderId(id);
      saveOrderSession(id, tableNumber, paymentMethod);
      clearCart();
      toast.success("Order sent to kitchen!");
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: rzpOrder.amount,
      currency: "INR",
      name: "AmVa Kitchen & Bar",
      description: `Table ${tableNumber} — ${count} item${count !== 1 ? "s" : ""}`,
      order_id: rzpOrder.id,
      prefill: { name: customerName || "Guest" },
      theme: { color: "#D4A017" },
      handler: async (response: { razorpay_payment_id: string }) => {
        try {
          const id = await saveOrderToKitchen(response.razorpay_payment_id);
          setOrderId(id);
          saveOrderSession(id, tableNumber, paymentMethod);
          clearCart();
          toast.success("Payment successful! Order sent to kitchen.");
        } catch {
          toast.error("Order save failed. Please show payment receipt to staff.");
        }
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  }

  // ── Place order ──────────────────────────────────────────────────────────────
  async function placeOrder() {
    if (!tableNumber) {
      setTableError(true);
      toast.error("Please enter your table number");
      tableInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      tableInputRef.current?.focus();
      return;
    }
    setTableError(false);
    if (cart.length === 0) { toast.error("Your order is empty"); return; }

    setPlacing(true);
    try {
      if (paymentMethod === "cash") {
        const id = await saveOrderToKitchen("cash");
        setOrderId(id);
        saveOrderSession(id, tableNumber, paymentMethod);
        clearCart();
        toast.success("Order sent to kitchen!");
        setPlacing(false);
      } else if (paymentMethod === "upi") {
        setPlacing(false);
        setShowUpiModal(true); // show QR modal
      } else {
        await openRazorpay();
        setPlacing(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to place order. Please try again.");
      setPlacing(false);
    }
  }

  // Called when user taps "I've Paid" in UPI modal
  async function handleUpiConfirm() {
    setUpiConfirming(true);
    try {
      const id = await saveOrderToKitchen("upi");
      setShowUpiModal(false);
      setOrderId(id);
      saveOrderSession(id, tableNumber, paymentMethod);
      clearCart();
      toast.success("Order confirmed! Sent to kitchen.");
    } catch {
      toast.error("Failed to save order. Please show payment to staff.");
    } finally {
      setUpiConfirming(false);
    }
  }

  // ── Success screen with live status tracker ──────────────────────────────────
  if (orderId) {
    return <OrderStatusTracker
      orderId={orderId}
      tableNumber={tableNumber}
      paymentMethod={paymentMethod}
      onNewOrder={() => {
        clearOrderSession();
        setOrderId(null);
        setTableNumber("");
        setCustomerName("");
        setOrderNotes("");
      }}
      onOrderMore={() => {
        startReorder();
        // Form shows immediately with pre-filled table/name — no navigation needed
        // Customer uses "Browse Menu" from the empty cart to add items
      }}
    />;
  }

  return (
    <>
      {/* Load Razorpay checkout script */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      {/* UPI Payment Modal */}
      {showUpiModal && (
        <UpiModal
          amount={total}
          onConfirm={handleUpiConfirm}
          onCancel={() => setShowUpiModal(false)}
          confirming={upiConfirming}
        />
      )}

      <div className="min-h-screen bg-brand-black pt-20">
        <div className="container-custom py-12 max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-10">
            <ShoppingBag className="w-6 h-6 text-brand-gold" />
            <h1 className="font-display text-3xl font-bold text-white">Your Order</h1>
            {count > 0 && <span className="text-white/30 text-sm">{count} items</span>}
          </div>

          {cart.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center gap-6">
              <ShoppingBag className="w-12 h-12 text-white/10" />
              {tableNumber ? (
                <>
                  <p className="text-white/50 text-lg">Table <span className="text-brand-gold font-bold">{tableNumber}</span> — ready for your next order</p>
                  <p className="text-white/30 text-sm">Browse the menu and add items, then come back to place your order</p>
                </>
              ) : (
                <p className="text-white/30 text-lg">Your order is empty</p>
              )}
              <Link href="/menu" className="btn-primary text-xs">Browse Menu</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* ── Cart items ── */}
              <div className="lg:col-span-3 flex flex-col gap-0 border border-white/5">
                {cart.map((cartItem) => (
                  <div key={cartItem.item.id} className="p-4 border-b border-white/5 last:border-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="text-white font-semibold text-sm">{cartItem.item.name}</p>
                        <p className="text-brand-gold text-sm mt-0.5">
                          ₹{cartItem.item.price} × {cartItem.quantity} ={" "}
                          <span className="font-bold">₹{(cartItem.item.price * cartItem.quantity).toFixed(0)}</span>
                        </p>
                      </div>
                      <button onClick={() => removeFromCart(cartItem.item.id)} className="text-white/20 hover:text-brand-red transition-colors mt-0.5">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3 mt-3">
                      <button onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity - 1)} className="w-9 h-9 sm:w-7 sm:h-7 border border-white/10 flex items-center justify-center text-white/50 hover:border-brand-gold hover:text-brand-gold transition-colors">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-white font-bold w-5 text-center">{cartItem.quantity}</span>
                      <button onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity + 1)} className="w-9 h-9 sm:w-7 sm:h-7 border border-white/10 flex items-center justify-center text-white/50 hover:border-brand-gold hover:text-brand-gold transition-colors">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Special request for this item..."
                      value={cartItem.notes}
                      onChange={(e) => updateNotes(cartItem.item.id, e.target.value)}
                      className="mt-3 w-full bg-brand-dark border border-white/5 text-white/60 placeholder:text-white/20 text-xs py-2 px-3 focus:outline-none focus:border-brand-gold/30 transition-colors"
                    />
                  </div>
                ))}
              </div>

              {/* ── Sidebar ── */}
              <div className="lg:col-span-2 flex flex-col gap-4">
                {/* Table info */}
                <div className="border border-white/5 p-5 flex flex-col gap-4 bg-brand-dark/50">
                  <h3 className="text-white font-bold text-sm tracking-wider uppercase">Table Details</h3>
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold tracking-widest uppercase flex items-center gap-2">
                        <span className={tableError ? "text-red-400" : "text-white/40"}>Table Number</span>
                        <span className="text-red-400">*</span>
                        {tableError && <span className="text-red-400 text-[10px] normal-case tracking-normal font-normal">— required</span>}
                      </label>
                      <input
                        ref={tableInputRef}
                        type="number" min="1" max="50"
                        value={tableNumber}
                        onChange={(e) => { setTableNumber(e.target.value); setTableError(false); }}
                        placeholder="e.g. 7"
                        className={`bg-brand-dark border text-white placeholder:text-white/20 text-sm py-3 px-4 focus:outline-none transition-all ${
                          tableError
                            ? "border-red-500 ring-1 ring-red-500/40 placeholder:text-red-400/40"
                            : "border-white/10 focus:border-brand-gold/60"
                        }`}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-white/40 text-xs font-bold tracking-widest uppercase">Your Name (optional)</label>
                      <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="So we can call your name" className="bg-brand-dark border border-white/10 text-white placeholder:text-white/20 text-sm py-3 px-4 focus:outline-none focus:border-brand-gold/60 transition-colors" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-white/40 text-xs font-bold tracking-widest uppercase">Order Notes</label>
                      <textarea value={orderNotes} onChange={(e) => setOrderNotes(e.target.value)} placeholder="Allergies, dietary needs..." rows={2} className="bg-brand-dark border border-white/10 text-white placeholder:text-white/20 text-sm py-3 px-4 focus:outline-none focus:border-brand-gold/60 transition-colors resize-none" />
                    </div>
                  </div>
                </div>

                {/* ── Payment Method ── */}
                <div className="border border-white/5 p-5 bg-brand-dark/50">
                  <h3 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Payment Method</h3>
                  <div className="flex flex-col gap-2">
                    {PAYMENT_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setPaymentMethod(opt.id)}
                        className={`flex items-center gap-3 p-3 border transition-all text-left ${
                          paymentMethod === opt.id
                            ? "border-brand-gold bg-brand-gold/10 text-white"
                            : "border-white/10 text-white/50 hover:border-white/30"
                        }`}
                      >
                        <div className={`shrink-0 ${paymentMethod === opt.id ? "text-brand-gold" : "text-white/30"}`}>
                          {opt.icon}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{opt.label}</p>
                          <p className="text-[11px] text-white/40 mt-0.5">{opt.sub}</p>
                        </div>
                        {paymentMethod === opt.id && (
                          <div className="ml-auto w-4 h-4 rounded-full bg-brand-gold flex items-center justify-center shrink-0">
                            <div className="w-2 h-2 rounded-full bg-brand-black" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="border border-white/5 p-5 bg-brand-dark/50">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-white/50 text-sm">Subtotal</span>
                    <span className="text-white font-bold">₹{total.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/5">
                    <span className="text-white/50 text-sm">GST (5%)</span>
                    <span className="text-white/50 text-sm">Included</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white font-bold">Total</span>
                    <span className="text-brand-gold font-display text-2xl font-bold">₹{total.toFixed(0)}</span>
                  </div>
                </div>

                <button
                  onClick={placeOrder}
                  disabled={placing || cart.length === 0}
                  className="btn-primary justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {placing ? (
                    "Processing..."
                  ) : paymentMethod === "cash" ? (
                    <><ChefHat className="w-4 h-4" /> Send to Kitchen</>
                  ) : (
                    <><CreditCard className="w-4 h-4" /> Pay ₹{total.toFixed(0)}</>
                  )}
                </button>

                <Link href="/menu" className="btn-ghost justify-center text-xs">Add More Items</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

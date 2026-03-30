"use client";

import { useState } from "react";
import Link from "next/link";
import { Minus, Plus, Trash2, ChefHat, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function OrderPage() {
  const { cart, removeFromCart, updateQuantity, updateNotes, clearCart, total, count } = useCart();
  const [tableNumber, setTableNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [placing, setPlacing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  async function placeOrder() {
    if (!tableNumber) {
      toast.error("Please enter your table number");
      return;
    }
    if (cart.length === 0) {
      toast.error("Your order is empty");
      return;
    }
    setPlacing(true);
    try {
      // Create the order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          table_number: parseInt(tableNumber),
          customer_name: customerName || null,
          notes: orderNotes || null,
          total,
          status: "new",
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Insert all order items
      const { error: itemsError } = await supabase.from("order_items").insert(
        cart.map((c) => ({
          order_id: order.id,
          menu_item_id: c.item.id,
          menu_item_name: c.item.name,
          menu_item_price: c.item.price,
          quantity: c.quantity,
          notes: c.notes || null,
        }))
      );

      if (itemsError) throw itemsError;

      setOrderId(order.id);
      clearCart();
      toast.success("Order sent to kitchen!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  }

  // Success screen
  if (orderId) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center px-4 pt-20">
        <div className="max-w-md w-full text-center flex flex-col items-center gap-6">
          <div className="w-20 h-20 bg-brand-gold/10 border-2 border-brand-gold/40 flex items-center justify-center">
            <ChefHat className="w-9 h-9 text-brand-gold" />
          </div>
          <h2 className="font-display text-4xl font-bold text-white">
            Order Received!
          </h2>
          <p className="text-white/50 leading-relaxed">
            Your order has been sent to the kitchen. Table{" "}
            <span className="text-brand-gold font-bold">{tableNumber}</span> —
            our chef is on it. We&apos;ll bring it to you shortly.
          </p>
          <div className="w-full p-4 border border-brand-gold/20 bg-brand-dark/50 text-left">
            <p className="text-white/30 text-xs">Order reference:</p>
            <p className="text-brand-gold/70 text-xs font-mono mt-0.5 break-all">{orderId}</p>
          </div>
          <div className="flex gap-3 flex-wrap justify-center">
            <Link href="/menu" className="btn-primary text-xs">
              Order More
            </Link>
            <Link href="/" className="btn-ghost text-xs">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-black pt-20">
      <div className="container-custom py-12 max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <ShoppingBag className="w-6 h-6 text-brand-gold" />
          <h1 className="font-display text-3xl font-bold text-white">Your Order</h1>
          {count > 0 && (
            <span className="text-white/30 text-sm">{count} items</span>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center gap-6">
            <ShoppingBag className="w-12 h-12 text-white/10" />
            <p className="text-white/30 text-lg">Your order is empty</p>
            <Link href="/menu" className="btn-primary text-xs">
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Cart items */}
            <div className="lg:col-span-3 flex flex-col gap-0 border border-white/5">
              {cart.map((cartItem) => (
                <div
                  key={cartItem.item.id}
                  className="p-4 border-b border-white/5 last:border-0"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-white font-semibold text-sm">
                        {cartItem.item.name}
                      </p>
                      <p className="text-brand-gold text-sm mt-0.5">
                        ₹{cartItem.item.price} × {cartItem.quantity} ={" "}
                        <span className="font-bold">
                          ₹{(cartItem.item.price * cartItem.quantity).toFixed(0)}
                        </span>
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(cartItem.item.id)}
                      className="text-white/20 hover:text-brand-red transition-colors mt-0.5"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity - 1)}
                      className="w-7 h-7 border border-white/10 flex items-center justify-center text-white/50 hover:border-brand-gold hover:text-brand-gold transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-white font-bold w-5 text-center">
                      {cartItem.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity + 1)}
                      className="w-7 h-7 border border-white/10 flex items-center justify-center text-white/50 hover:border-brand-gold hover:text-brand-gold transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Item notes */}
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

            {/* Summary + submit */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {/* Table info */}
              <div className="border border-white/5 p-5 flex flex-col gap-4 bg-brand-dark/50">
                <h3 className="text-white font-bold text-sm tracking-wider uppercase">
                  Table Details
                </h3>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-white/40 text-xs font-bold tracking-widest uppercase">
                      Table Number *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      placeholder="e.g. 7"
                      className="bg-brand-dark border border-white/10 text-white placeholder:text-white/20 text-sm py-3 px-4 focus:outline-none focus:border-brand-gold/60 transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-white/40 text-xs font-bold tracking-widest uppercase">
                      Your Name (optional)
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="So we can call your name"
                      className="bg-brand-dark border border-white/10 text-white placeholder:text-white/20 text-sm py-3 px-4 focus:outline-none focus:border-brand-gold/60 transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-white/40 text-xs font-bold tracking-widest uppercase">
                      Order Notes
                    </label>
                    <textarea
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      placeholder="Allergies, dietary needs..."
                      rows={2}
                      className="bg-brand-dark border border-white/10 text-white placeholder:text-white/20 text-sm py-3 px-4 focus:outline-none focus:border-brand-gold/60 transition-colors resize-none"
                    />
                  </div>
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
                  <span className="text-brand-gold font-display text-2xl font-bold">
                    ₹{total.toFixed(0)}
                  </span>
                </div>
              </div>

              <button
                onClick={placeOrder}
                disabled={placing || cart.length === 0}
                className="btn-primary justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {placing ? (
                  "Sending to Kitchen..."
                ) : (
                  <>
                    <ChefHat className="w-4 h-4" />
                    Send to Kitchen
                  </>
                )}
              </button>

              <Link href="/menu" className="btn-ghost justify-center text-xs">
                Add More Items
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

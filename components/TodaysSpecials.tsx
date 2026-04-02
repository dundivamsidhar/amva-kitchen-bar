"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/lib/CartContext";
import type { MenuItem } from "@/lib/database.types";
import { Star, ShoppingBag, Flame } from "lucide-react";

// Category badges (approximate mapping by category_id — adjustable)
const CATEGORY_LABELS: Record<number, string> = {
  1: "Starters",
  2: "Mains",
  3: "Breads",
  4: "Desserts",
  5: "Beverages",
  6: "Cocktails",
  7: "Mocktails",
  8: "Wines",
};

export default function TodaysSpecials() {
  const [specials, setSpecials] = useState<MenuItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetch() {
      const { data } = await (supabase as any)
        .from("menu_items")
        .select("*")
        .eq("is_special_today", true)
        .eq("is_available", true)
        .order("name");
      if (data) setSpecials(data as MenuItem[]);
      setLoaded(true);
    }
    fetch();
  }, []);

  if (!loaded || specials.length === 0) return null;

  return (
    <section className="py-16 bg-[#0d0a04] relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-gold/[0.03] to-transparent pointer-events-none" />

      <div className="container-custom relative">
        {/* Section header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Star className="w-4 h-4 text-brand-gold fill-brand-gold" />
            <span className="text-xs font-bold tracking-[0.35em] uppercase text-brand-gold">
              Today&apos;s Specials
            </span>
            <Star className="w-4 h-4 text-brand-gold fill-brand-gold" />
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold">
            <span className="bg-gradient-to-r from-brand-gold via-yellow-300 to-brand-gold bg-clip-text text-transparent">
              Chef&apos;s Picks for Today
            </span>
          </h2>
          <p className="text-white/40 text-sm mt-2">
            Handpicked by our kitchen — available today only
          </p>
        </div>

        {/* Cards — horizontal scroll on mobile, 3-col grid on desktop */}
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-3 md:overflow-visible md:pb-0 scrollbar-hide">
          {specials.map((item) => (
            <div
              key={item.id}
              className="snap-start flex-shrink-0 w-72 md:w-auto border border-brand-gold/25 bg-white/[0.02] flex flex-col overflow-hidden hover:border-brand-gold/50 transition-colors group"
            >
              {/* Gold accent bar */}
              <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-brand-gold to-transparent" />

              <div className="p-5 flex flex-col gap-3 flex-1">
                {/* Category + spice */}
                <div className="flex items-center gap-2">
                  {CATEGORY_LABELS[item.category_id] && (
                    <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 border border-brand-gold/20 text-brand-gold/70">
                      {CATEGORY_LABELS[item.category_id]}
                    </span>
                  )}
                  {item.is_vegetarian && (
                    <span className="text-[10px] font-bold text-green-500 border border-green-500/20 px-1.5 py-0.5">
                      VEG
                    </span>
                  )}
                  {item.spice_level && item.spice_level > 0 && (
                    <span className="flex items-center gap-0.5 text-orange-400">
                      {Array.from({ length: item.spice_level }).map((_, i) => (
                        <Flame key={i} className="w-3 h-3 fill-orange-400" />
                      ))}
                    </span>
                  )}
                </div>

                {/* Name */}
                <h3 className="font-display text-lg font-bold text-white group-hover:text-brand-gold transition-colors leading-tight">
                  {item.name}
                </h3>

                {/* Special note */}
                {item.special_note && (
                  <p className="text-brand-gold/70 text-xs italic flex items-start gap-1.5">
                    <Star className="w-3 h-3 text-brand-gold fill-brand-gold shrink-0 mt-0.5" />
                    {item.special_note}
                  </p>
                )}

                {/* Description */}
                {item.description && (
                  <p className="text-white/40 text-sm leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                )}

                {/* Price + CTA */}
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
                  <span className="font-display text-xl font-bold text-brand-gold">
                    ₹{item.price}
                  </span>
                  <button
                    onClick={() => addToCart(item)}
                    className="flex items-center gap-2 bg-brand-gold text-brand-black text-xs font-bold tracking-widest uppercase px-4 py-2 hover:bg-brand-gold/90 transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

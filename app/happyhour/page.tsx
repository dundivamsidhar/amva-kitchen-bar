"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Check } from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";
import { useCart } from "@/lib/CartContext";
import toast from "react-hot-toast";

const DEALS = [
  {
    time: "12pm – 7pm",
    days: "Mon – Fri",
    offer: "2 for 1",
    detail: "All signature cocktails, all afternoon. Every weekday without exception.",
    accent: "#D4A017",
  },
  {
    time: "11am – 1pm",
    days: "Saturday & Sunday",
    offer: "Brunch Bottomless",
    detail: "Unlimited cocktails with any brunch plate. 90-minute sittings.",
    accent: "#D4A017",
  },
  {
    time: "10pm – 1am",
    days: "Fri & Sat",
    offer: "Late Night",
    detail: "Selected cocktails at ₹499. The night is still young — and so is the bar.",
    accent: "#D4A017",
  },
];

const COCKTAILS = [
  { id: 24, name: "AmVa Sour",               happyPrice: 349, originalPrice: 695, desc: "Bourbon · Tamarind · Curry Leaf",         category_id: 6 },
  { id: 25, name: "Hyderabad Negroni",        happyPrice: 375, originalPrice: 745, desc: "Empress Gin · Campari · Cardamom",        category_id: 6 },
  { id: 26, name: "Masala Chai Old Fashioned",happyPrice: 375, originalPrice: 745, desc: "Woodford · Chai Reduction · Star Anise",  category_id: 6 },
  { id: 27, name: "Mango Lassi Margarita",    happyPrice: 349, originalPrice: 695, desc: "Patrón · Alphonso Mango · Saffron",       category_id: 6 },
  { id: 28, name: "Kokum Spritz",             happyPrice: 299, originalPrice: 595, desc: "Prosecco · Kokum · Rose · Mint",          category_id: 6 },
  { id: 29, name: "Smoked Paan Mojito",       happyPrice: 299, originalPrice: 595, desc: "White Rum · Paan · Lime · Smoked Sugar",  category_id: 6 },
];

export default function HappyHourPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { addToCart } = useCart();
  const [added, setAdded] = useState<number | null>(null);

  function handleAdd(c: typeof COCKTAILS[0]) {
    addToCart({
      id: c.id,
      category_id: c.category_id,
      name: c.name,
      description: c.desc,
      price: c.happyPrice,
      image_url: null,
      tags: ["happy-hour"],
      is_available: true,
      is_featured: false,
      is_vegetarian: false,
      is_vegan: false,
      spice_level: 0,
      is_special_today: false,
      special_note: "Happy Hour price",
      created_at: "",
    });
    toast.success(`${c.name} added!`);
    setAdded(c.id);
    setTimeout(() => setAdded(null), 1800);
  }

  const bg = isDark ? "#0A0806" : "#fdf9f3";
  const cardBg = isDark ? "#120E09" : "#f5ede0";
  const headingColor = isDark ? "#ffffff" : "#1c1407";
  const textColor = isDark ? "rgba(255,255,255,0.50)" : "rgba(28,20,7,0.55)";
  const borderColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(28,20,7,0.08)";
  const subColor = isDark ? "rgba(255,255,255,0.25)" : "rgba(28,20,7,0.30)";

  return (
    <main style={{ background: bg }}>

      {/* ── Hero ── */}
      <section className="relative min-h-[55vh] flex flex-col justify-end overflow-hidden bg-[#0A0806]">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=1800&q=80')`,
            }}
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #0A0806 0%, rgba(10,8,6,0.75) 50%, rgba(10,8,6,0.40) 100%)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(10,8,6,0.60), transparent 60%)" }} />
        </div>

        <div className="relative z-10 max-w-screen-xl mx-auto w-full px-6 md:px-12 lg:px-20 pb-16 md:pb-20 pt-32">
          <p className="text-[10px] font-black tracking-[0.45em] uppercase text-brand-gold mb-4">
            AmVa Kitchen & Bar
          </p>
          <h1
            className="font-display font-black leading-none text-white"
            style={{ fontSize: "clamp(3.5rem, 11vw, 9rem)" }}
          >
            HAPPY
            <br />
            <span className="text-brand-gold">HOUR.</span>
          </h1>
          <p className="text-white/50 text-base mt-5 max-w-md">
            Because great cocktails shouldn&apos;t wait for a special occasion.
          </p>
        </div>
      </section>

      {/* ── Hero statement ── */}
      <section
        className="py-16 md:py-20 text-center px-6"
        style={{ background: isDark ? "#0d0a07" : "#f0e8da", borderBottom: `1px solid ${borderColor}` }}
      >
        <p className="text-[10px] font-black tracking-[0.45em] uppercase text-brand-gold mb-5">
          It&apos;s Always the Right Time
        </p>
        <h2
          className="font-display font-black leading-tight max-w-3xl mx-auto mb-6"
          style={{ fontSize: "clamp(2rem, 5vw, 4rem)", color: headingColor }}
        >
          2 for 1 cocktails,
          <br />
          <span className="text-brand-gold">all afternoon. Every day.</span>
        </h2>
        <p
          className="max-w-2xl mx-auto text-base md:text-lg leading-relaxed mb-10"
          style={{ color: textColor }}
        >
          From long lunches to after-work catch-ups, AmVa&apos;s Happy Hour is built for every mood.
          Hyderabadi cocktails, Indian pantry ingredients, premium spirits — at prices that make you stay for one more.
        </p>
        <Link
          href="/reservations"
          className="inline-flex items-center gap-3 bg-brand-gold text-brand-black text-[11px] font-black tracking-[0.28em] uppercase px-8 py-4 hover:bg-[#F0C040] transition-all duration-300"
        >
          Reserve Your Spot
        </Link>
      </section>

      {/* ── Deal cards ── */}
      <section className="py-16 md:py-20 max-w-screen-xl mx-auto px-6 md:px-12">
        <p className="text-[10px] font-black tracking-[0.45em] uppercase text-brand-gold mb-3">
          The Offers
        </p>
        <h2
          className="font-display font-black leading-none mb-10"
          style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", color: headingColor }}
        >
          Pick Your <span className="text-brand-gold">Hour.</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: borderColor }}>
          {DEALS.map((deal) => (
            <div key={deal.time} className="flex flex-col p-8 md:p-10 gap-4 group" style={{ background: cardBg }}>
              <div>
                <p className="text-brand-gold text-[10px] font-black tracking-[0.35em] uppercase mb-1">
                  {deal.days}
                </p>
                <p style={{ color: subColor }} className="text-xs tracking-widest">
                  {deal.time}
                </p>
              </div>
              <div className="w-8 h-px bg-brand-gold/40" />
              <h3
                className="font-display font-black leading-tight"
                style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", color: headingColor }}
              >
                {deal.offer}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: textColor }}>
                {deal.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Cocktails on offer ── */}
      <section
        className="py-16 md:py-20"
        style={{ background: isDark ? "#0d0a07" : "#f0e8da" }}
      >
        <div className="max-w-screen-xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <p className="text-[10px] font-black tracking-[0.45em] uppercase text-brand-gold mb-3">
                What&apos;s Pouring
              </p>
              <h2
                className="font-display font-black leading-none"
                style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", color: headingColor }}
              >
                Happy Hour <span className="text-brand-gold">Menu.</span>
              </h2>
            </div>
            <Link
              href="/menu#cocktails"
              className="inline-flex items-center gap-3 text-[11px] font-black tracking-[0.25em] uppercase border border-brand-gold text-brand-gold px-6 py-3 hover:bg-brand-gold hover:text-brand-black transition-all duration-300 self-start md:self-auto"
            >
              Full Cocktail Menu
            </Link>
          </div>

          {/* Cocktail list */}
          <div className="border-t" style={{ borderColor }}>
            {COCKTAILS.map((c, i) => (
              <div
                key={c.name}
                className="flex items-center justify-between py-5 border-b gap-4 group hover:border-brand-gold/30 transition-colors"
                style={{ borderColor }}
              >
                {/* Number + name + desc */}
                <div className="flex items-center gap-5 min-w-0">
                  <span className="text-xs font-bold font-display w-5 flex-shrink-0" style={{ color: subColor }}>
                    0{i + 1}
                  </span>
                  <div className="min-w-0">
                    <span
                      className="font-display text-lg md:text-xl font-black group-hover:text-brand-gold transition-colors block"
                      style={{ color: headingColor }}
                    >
                      {c.name}
                    </span>
                    <p className="text-xs mt-0.5 truncate" style={{ color: subColor }}>{c.desc}</p>
                  </div>
                </div>

                {/* Price + Add button */}
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs line-through" style={{ color: subColor }}>₹{c.originalPrice}</p>
                    <p className="font-display font-black text-brand-gold text-lg">₹{c.happyPrice}</p>
                  </div>
                  {/* Mobile price */}
                  <p className="font-display font-black text-brand-gold text-base sm:hidden">₹{c.happyPrice}</p>

                  {/* Add button */}
                  <button
                    onClick={() => handleAdd(c)}
                    className="w-10 h-10 flex items-center justify-center flex-shrink-0 transition-all duration-300 active:scale-90"
                    style={{
                      background: added === c.id ? "#D4A017" : "transparent",
                      border: added === c.id ? "2px solid #D4A017" : `2px solid ${isDark ? "rgba(255,255,255,0.15)" : "rgba(28,20,7,0.18)"}`,
                      color: added === c.id ? "#0A0806" : isDark ? "rgba(255,255,255,0.50)" : "rgba(28,20,7,0.50)",
                    }}
                    aria-label={`Add ${c.name} to order`}
                  >
                    {added === c.id
                      ? <Check className="w-4 h-4" />
                      : <Plus className="w-4 h-4" />
                    }
                  </button>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 text-xs italic" style={{ color: subColor }}>
            * Happy Hour prices apply during designated hours only. Subject to availability. Cannot be combined with other offers.
          </p>
        </div>
      </section>

      {/* ── CTA strip ── */}
      <section
        className="py-14 md:py-16 text-center px-6"
        style={{ background: isDark ? "#0A0806" : "#fdf9f3", borderTop: `1px solid ${borderColor}` }}
      >
        <h2
          className="font-display font-black leading-none mb-4"
          style={{ fontSize: "clamp(2rem, 5vw, 4rem)", color: headingColor }}
        >
          Don&apos;t Miss <span className="text-brand-gold">Last Round.</span>
        </h2>
        <p className="mb-8 text-sm" style={{ color: textColor }}>
          Walk-ins welcome. But booking guarantees your seat at the bar.
        </p>
        <Link
          href="/reservations"
          className="inline-flex items-center gap-3 bg-brand-gold text-brand-black text-[11px] font-black tracking-[0.28em] uppercase px-8 py-4 hover:bg-[#F0C040] transition-all duration-300"
        >
          Book a Table
        </Link>
      </section>

    </main>
  );
}

"use client";

import Link from "next/link";
import { useTheme } from "@/lib/ThemeContext";

const COCKTAILS = [
  {
    name: "AmVa Sour",
    desc: "Bourbon · Tamarind · Curry Leaf · Smoked Chilli",
    price: "₹695",
  },
  {
    name: "Hyderabad Negroni",
    desc: "Empress Gin · Campari · Cardamom Vermouth",
    price: "₹745",
  },
  {
    name: "Masala Chai Old Fashioned",
    desc: "Woodford Reserve · Chai Reduction · Star Anise Smoke",
    price: "₹745",
  },
  {
    name: "Mango Lassi Margarita",
    desc: "Patrón Silver · Alphonso Mango · Saffron · Tajín",
    price: "₹695",
  },
];

export default function CocktailBanner() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section className="relative overflow-hidden" style={{ background: isDark ? "#0A0806" : "#1a0e06" }}>

      {/* Full-bleed background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=1800&q=80')`,
        }}
      />
      {/* Always keep dark overlay here — bar section looks better dark in both modes */}
      <div className="absolute inset-0" style={{ background: isDark ? "rgba(10,8,6,0.88)" : "rgba(10,5,2,0.82)" }} />

      <div className="relative z-10 max-w-screen-xl mx-auto px-6 md:px-12 py-24 md:py-32">

        {/* Section header */}
        <div className="mb-16 md:mb-20">
          <p className="text-[10px] font-black tracking-[0.45em] uppercase text-brand-gold mb-5">
            The Bar Programme
          </p>
          <h2
            className="font-display font-black leading-none text-white"
            style={{ fontSize: "clamp(2.8rem, 7.5vw, 8rem)" }}
          >
            COCKTAILS THAT
            <br />
            <span className="text-brand-gold">SPEAK HYDERABADI.</span>
          </h2>
          <p className="text-white/35 max-w-md mt-6 text-sm leading-relaxed">
            Our bar team reinvents Indian pantry staples — tamarind, kokum,
            curry leaf, chai masala — into drinks that are unmistakably ours.
          </p>
        </div>

        {/* Cocktail list — editorial line format */}
        <div className="border-t border-white/10">
          {COCKTAILS.map((c, i) => (
            <div
              key={c.name}
              className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6 md:py-7 border-b border-white/10 hover:border-brand-gold/40 transition-all duration-300 cursor-default"
            >
              <div className="flex items-baseline gap-5">
                <span className="text-white/20 text-xs font-bold w-6 flex-shrink-0 font-display">
                  0{i + 1}
                </span>
                <span className="font-display text-xl md:text-2xl lg:text-3xl font-black text-white group-hover:text-brand-gold transition-colors duration-300">
                  {c.name}
                </span>
              </div>
              <div className="flex items-center gap-6 md:gap-10 pl-11 sm:pl-0">
                <span className="text-white/30 text-sm hidden md:block flex-1 text-right">
                  {c.desc}
                </span>
                <span className="font-display text-2xl md:text-3xl font-black text-brand-gold flex-shrink-0">
                  {c.price}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 md:mt-14">
          <Link
            href="/menu#cocktails"
            className="inline-flex items-center gap-4 border border-brand-gold text-brand-gold text-[11px] font-black tracking-[0.3em] uppercase px-8 py-4 hover:bg-brand-gold hover:text-brand-black transition-all duration-300"
          >
            Full Drinks Menu
          </Link>
        </div>
      </div>
    </section>
  );
}

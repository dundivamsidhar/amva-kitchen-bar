"use client";

import Link from "next/link";
import { useTheme } from "@/lib/ThemeContext";

export default function Hero() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section className="relative min-h-screen flex flex-col justify-end overflow-hidden bg-[#0A0806]">

      {/* Background image — always visible */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=85')`,
          }}
        />

        {/* Dark mode: heavy dark overlay from bottom + left */}
        {isDark && (
          <>
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #0A0806 0%, rgba(10,8,6,0.75) 45%, rgba(10,8,6,0.25) 75%, transparent)" }} />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(10,8,6,0.85) 0%, rgba(10,8,6,0.40) 45%, transparent 70%)" }} />
          </>
        )}

        {/* Light mode: gentle warm overlay — shows image, creates readable text zone at bottom/left */}
        {!isDark && (
          <>
            {/* Warm honey tint over whole image */}
            <div className="absolute inset-0" style={{ background: "rgba(240,200,120,0.12)" }} />
            {/* Strong bottom fade for text legibility */}
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(253,249,240,0.96) 0%, rgba(253,249,240,0.80) 30%, rgba(253,249,240,0.30) 60%, transparent 80%)" }} />
            {/* Left fade for text legibility */}
            <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(253,249,240,0.88) 0%, rgba(253,249,240,0.45) 40%, transparent 65%)" }} />
          </>
        )}
      </div>

      {/* Vertical text — right side */}
      <div className="absolute top-1/2 right-8 md:right-14 -translate-y-1/2 z-10 hidden lg:flex flex-col items-center gap-4">
        <div className="w-px h-20" style={{ background: isDark ? "rgba(255,255,255,0.15)" : "rgba(28,20,7,0.12)" }} />
        <p
          className="text-[10px] font-bold tracking-[0.45em] uppercase"
          style={{
            color: isDark ? "rgba(255,255,255,0.25)" : "rgba(28,20,7,0.25)",
            writingMode: "vertical-lr",
          }}
        >
          Jubilee Hills · Hyderabad · Est. 2025
        </p>
        <div className="w-px h-20" style={{ background: isDark ? "rgba(255,255,255,0.15)" : "rgba(28,20,7,0.12)" }} />
      </div>

      {/* Main content — bottom-pinned */}
      <div className="relative z-10 max-w-screen-xl mx-auto w-full px-6 md:px-12 lg:px-20 pb-16 md:pb-24">

        {/* Eyebrow */}
        <p className="text-[10px] font-black tracking-[0.45em] uppercase text-brand-gold mb-6 md:mb-8">
          Hyderabad&apos;s Finest · Est. 2025
        </p>

        {/* Headline */}
        <h1 className="font-display font-black leading-[0.85] tracking-tight mb-8 md:mb-10">
          <span
            className="block"
            style={{
              fontSize: "clamp(4rem, 13vw, 11rem)",
              color: isDark ? "#ffffff" : "#1c1407",
            }}
          >
            BOLD
          </span>
          <span
            className="block text-brand-gold"
            style={{ fontSize: "clamp(4rem, 13vw, 11rem)" }}
          >
            FLAVOURS.
          </span>
          <span
            className="block"
            style={{
              fontSize: "clamp(1.8rem, 6vw, 5.5rem)",
              color: isDark ? "rgba(255,255,255,0.18)" : "rgba(28,20,7,0.18)",
            }}
          >
            BOLDER DRINKS.
          </span>
        </h1>

        {/* Tagline */}
        <div className="flex items-center gap-5 mb-10 max-w-md">
          <div className="h-px bg-brand-gold/50 w-10 flex-shrink-0" />
          <p
            className="text-sm md:text-base leading-relaxed"
            style={{ color: isDark ? "rgba(255,255,255,0.50)" : "rgba(28,20,7,0.60)" }}
          >
            Deccan cuisine reimagined — where the spice trade meets the cocktail bar.
          </p>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-wrap gap-4 mb-14 md:mb-16">
          <Link
            href="/reservations"
            className="bg-brand-gold text-brand-black text-[11px] font-black tracking-[0.25em] uppercase px-8 py-4 hover:bg-[#F0C040] active:scale-95 transition-all duration-300"
          >
            Reserve a Table
          </Link>
          <Link
            href="/menu"
            className="text-[11px] font-bold tracking-[0.25em] uppercase px-8 py-4 transition-all duration-300"
            style={{
              border: isDark ? "1px solid rgba(255,255,255,0.22)" : "1px solid rgba(28,20,7,0.28)",
              color: isDark ? "#ffffff" : "#1c1407",
            }}
          >
            View Menu
          </Link>
        </div>

        {/* Info strip */}
        <div
          className="pt-7 flex flex-wrap gap-8 md:gap-16"
          style={{ borderTop: isDark ? "1px solid rgba(255,255,255,0.10)" : "1px solid rgba(28,20,7,0.12)" }}
        >
          {[
            { label: "Open", value: "Mon–Sun, 12pm – 1am" },
            { label: "Location", value: "Jubilee Hills, Hyderabad" },
            { label: "Reservations", value: "040-2233-4455" },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col gap-1">
              <span className="text-[10px] font-black tracking-[0.35em] uppercase text-brand-gold/70">
                {label}
              </span>
              <span
                className="text-sm"
                style={{ color: isDark ? "rgba(255,255,255,0.50)" : "rgba(28,20,7,0.60)" }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

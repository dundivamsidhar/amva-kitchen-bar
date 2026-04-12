"use client";

import Link from "next/link";
import { useTheme } from "@/lib/ThemeContext";

export default function Hero() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section
      className="relative min-h-screen flex flex-col justify-end overflow-hidden"
      style={{ background: isDark ? "#0A0806" : "#fdf9f3" }}
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=85')`,
          }}
        />
        {/* Multi-layer gradient for depth */}
        <div
          className="absolute inset-0"
          style={{
            background: isDark
              ? "linear-gradient(to top, #0A0806, rgba(10,8,6,0.70) 50%, rgba(10,8,6,0.30))"
              : "linear-gradient(to top, rgba(253,249,243,0.97), rgba(253,249,243,0.75) 50%, rgba(253,249,243,0.35))",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: isDark
              ? "linear-gradient(to right, rgba(10,8,6,0.80), rgba(10,8,6,0.25), transparent)"
              : "linear-gradient(to right, rgba(253,249,243,0.85), rgba(253,249,243,0.30), transparent)",
          }}
        />
      </div>

      {/* Vertical text — right side */}
      <div className="absolute top-1/2 right-8 md:right-14 -translate-y-1/2 z-10 hidden lg:flex flex-col items-center gap-4">
        <div
          className="w-px h-20"
          style={{ background: isDark ? "rgba(255,255,255,0.15)" : "rgba(28,20,7,0.15)" }}
        />
        <p
          className="text-[10px] font-bold tracking-[0.45em] uppercase"
          style={{
            color: isDark ? "rgba(255,255,255,0.25)" : "rgba(28,20,7,0.30)",
            writingMode: "vertical-lr",
          }}
        >
          Jubilee Hills · Hyderabad · Est. 2025
        </p>
        <div
          className="w-px h-20"
          style={{ background: isDark ? "rgba(255,255,255,0.15)" : "rgba(28,20,7,0.15)" }}
        />
      </div>

      {/* Main content */}
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
              color: isDark ? "rgba(255,255,255,0.20)" : "rgba(28,20,7,0.18)",
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
            style={{ color: isDark ? "rgba(255,255,255,0.45)" : "rgba(28,20,7,0.55)" }}
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
              border: isDark ? "1px solid rgba(255,255,255,0.20)" : "1px solid rgba(28,20,7,0.25)",
              color: isDark ? "#ffffff" : "#1c1407",
            }}
          >
            View Menu
          </Link>
        </div>

        {/* Info strip */}
        <div
          className="pt-7 flex flex-wrap gap-8 md:gap-16"
          style={{ borderTop: isDark ? "1px solid rgba(255,255,255,0.10)" : "1px solid rgba(28,20,7,0.10)" }}
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
                style={{ color: isDark ? "rgba(255,255,255,0.50)" : "rgba(28,20,7,0.55)" }}
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

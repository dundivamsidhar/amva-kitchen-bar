"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/lib/ThemeContext";

export default function AboutStrip() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const bg = isDark ? "#0A0806" : "#fdf9f3";
  const headingColor = isDark ? "#ffffff" : "#1c1407";
  const textColor = isDark ? "rgba(255,255,255,0.45)" : "rgba(28,20,7,0.55)";
  const borderColor = isDark ? "rgba(255,255,255,0.10)" : "rgba(28,20,7,0.10)";
  const subColor = isDark ? "rgba(255,255,255,0.25)" : "rgba(28,20,7,0.30)";

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2">

      {/* Image — full bleed */}
      <div className="relative h-[45vw] lg:h-auto order-2 lg:order-1 overflow-hidden" style={{ minHeight: "320px", maxHeight: "520px" }}>
        <Image
          src="https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=1200&q=85"
          alt="AmVa Kitchen & Bar interior"
          fill
          className="object-cover object-center"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background: isDark
              ? "linear-gradient(to right, transparent, transparent, rgba(10,8,6,0.5) 80%, #0A0806)"
              : "linear-gradient(to right, transparent, transparent, rgba(253,249,243,0.4) 80%, #fdf9f3)",
          }}
        />
        <div className="absolute bottom-6 left-6">
          <span className="bg-brand-gold text-brand-black text-[10px] font-black tracking-[0.3em] uppercase px-4 py-2">
            Jubilee Hills, Hyderabad
          </span>
        </div>
      </div>

      {/* Text panel */}
      <div
        className="order-1 lg:order-2 flex items-center px-8 md:px-12 lg:px-14 py-12 lg:py-16"
        style={{ background: bg }}
      >
        <div className="w-full max-w-lg">

          <p className="text-[10px] font-black tracking-[0.45em] uppercase text-brand-gold mb-6">
            Our Story
          </p>

          <h2
            className="font-display font-black leading-none mb-8"
            style={{ fontSize: "clamp(2rem, 4vw, 3.8rem)", color: headingColor }}
          >
            HYDERABAD&apos;S
            <br />
            <span className="text-brand-gold">NEW</span>
            <br />
            CLASSIC.
          </h2>

          <div className="w-10 h-px bg-brand-gold/50 mb-8" />

          <p className="leading-relaxed text-[15px] mb-5" style={{ color: textColor }}>
            AmVa Kitchen & Bar was born from a simple belief — that the
            Deccan&apos;s rich culinary heritage deserves a modern stage.
            Named after our founders Amritha &amp; Vamsi.
          </p>
          <p className="leading-relaxed text-[15px] mb-10" style={{ color: textColor }}>
            Bold Hyderabadi flavours, coastal spice routes, and a cocktail
            programme that treats Indian ingredients as seriously as any
            premium spirit. One restaurant. One city. No compromises.
          </p>

          {/* Stats */}
          <div
            className="grid grid-cols-3 gap-6 pt-8 mb-10"
            style={{ borderTop: `1px solid ${borderColor}` }}
          >
            {[
              { num: "120+", label: "Dishes" },
              { num: "40+", label: "Cocktails" },
              { num: "200", label: "Covers" },
            ].map(({ num, label }) => (
              <div key={label}>
                <div className="font-display text-3xl md:text-4xl font-black text-brand-gold">
                  {num}
                </div>
                <div
                  className="text-[10px] tracking-[0.25em] uppercase mt-1.5"
                  style={{ color: subColor }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/about"
            className="inline-flex items-center gap-4 text-[11px] font-black tracking-[0.28em] uppercase transition-colors group hover:text-brand-gold"
            style={{ color: headingColor }}
          >
            Discover Our Story
            <span className="w-8 h-px bg-current transition-all duration-300 group-hover:w-14" />
          </Link>
        </div>
      </div>
    </section>
  );
}

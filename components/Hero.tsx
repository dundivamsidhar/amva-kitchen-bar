"use client";

import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";

export default function Hero() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1544148103-0773bf10d330?w=1800&q=80')`,
        }}
      />

      {/* Gradient overlays — theme-aware via inline styles */}
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? "rgba(10,8,6,0.70)"
            : "rgba(253,249,243,0.72)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? "linear-gradient(to bottom, rgba(10,8,6,0.6), transparent, rgba(10,8,6,1))"
            : "linear-gradient(to bottom, rgba(253,249,243,0.5), transparent, rgba(253,249,243,0.85))",
        }}
      />
      {isDark && (
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(10,8,6,0.8), rgba(10,8,6,0.2), rgba(10,8,6,0.4))" }} />
      )}

      {/* Noise texture */}
      <div className="absolute inset-0 bg-noise opacity-30" />

      {/* Content */}
      <div className="relative z-10 container-custom text-center flex flex-col items-center gap-6 pt-20">
        <p className="section-label animate-fade-in">Hyderabad · Est. 2025</p>

        <h1
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-none tracking-tight animate-fade-up"
          style={{ color: isDark ? "#ffffff" : "#1c1407" }}
        >
          Bold Flavours.
          <br />
          <span className="text-gradient-gold">Bolder Drinks.</span>
        </h1>

        <p
          className="max-w-xl text-lg md:text-xl leading-relaxed animate-fade-up"
          style={{ color: isDark ? "rgba(255,255,255,0.70)" : "rgba(28,20,7,0.70)" }}
        >
          Deccan cuisine reimagined — where the spice trade meets the cocktail
          bar. One address. Hyderabad&apos;s only.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-4 animate-fade-up">
          <Link href="/reservations" className="btn-primary">
            Reserve Your Table
          </Link>
          <Link
            href="/menu"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 font-bold text-sm tracking-widest uppercase transition-all duration-300 active:scale-95"
            style={{
              border: isDark ? "2px solid rgba(255,255,255,0.30)" : "2px solid rgba(28,20,7,0.30)",
              color: isDark ? "#ffffff" : "#1c1407",
            }}
          >
            Explore the Menu
          </Link>
        </div>

        {/* Quick info bar */}
        <div
          className="mt-12 mb-16 grid grid-cols-3 gap-8 md:gap-16 pt-8 w-full max-w-2xl animate-fade-in"
          style={{ borderTop: isDark ? "1px solid rgba(255,255,255,0.10)" : "1px solid rgba(28,20,7,0.12)" }}
        >
          <div className="flex flex-col items-center gap-1">
            <span className="text-brand-gold text-xs font-bold tracking-widest uppercase">
              Open
            </span>
            <span style={{ color: isDark ? "rgba(255,255,255,0.60)" : "rgba(28,20,7,0.55)" }} className="text-sm">Mon–Sun</span>
            <span style={{ color: isDark ? "#ffffff" : "#1c1407" }} className="text-sm font-medium">12pm – 1am</span>
          </div>
          <div
            className="flex flex-col items-center gap-1 px-4"
            style={{ borderLeft: isDark ? "1px solid rgba(255,255,255,0.10)" : "1px solid rgba(28,20,7,0.12)", borderRight: isDark ? "1px solid rgba(255,255,255,0.10)" : "1px solid rgba(28,20,7,0.12)" }}
          >
            <span className="text-brand-gold text-xs font-bold tracking-widest uppercase">
              Location
            </span>
            <span style={{ color: isDark ? "rgba(255,255,255,0.60)" : "rgba(28,20,7,0.55)" }} className="text-sm">Jubilee Hills</span>
            <span style={{ color: isDark ? "#ffffff" : "#1c1407" }} className="text-sm font-medium">Hyderabad</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-brand-gold text-xs font-bold tracking-widest uppercase">
              Call Us
            </span>
            <span style={{ color: isDark ? "rgba(255,255,255,0.60)" : "rgba(28,20,7,0.55)" }} className="text-sm">Reservations</span>
            <a
              href="tel:+914022334455"
              className="text-sm font-medium hover:text-brand-gold transition-colors"
              style={{ color: isDark ? "#ffffff" : "#1c1407" }}
            >
              040-2233-4455
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ArrowDown className="w-5 h-5 text-brand-gold/60" />
      </div>
    </section>
  );
}

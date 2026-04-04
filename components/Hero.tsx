"use client";

import Link from "next/link";
import { ArrowDown } from "lucide-react";

export default function Hero() {
  return (
    <section className="preserve-dark relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1544148103-0773bf10d330?w=1800&q=80')`,
        }}
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-brand-black/70" />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-black/60 via-transparent to-brand-black" />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-black/80 via-brand-black/20 to-brand-black/40" />

      {/* Noise texture */}
      <div className="absolute inset-0 bg-noise opacity-30" />

      {/* Content */}
      <div className="relative z-10 container-custom text-center flex flex-col items-center gap-6 pt-20">
        <p className="section-label animate-fade-in">Hyderabad · Est. 2025</p>

        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-none tracking-tight animate-fade-up">
          Bold Flavours.
          <br />
          <span className="text-gradient-gold">Bolder Drinks.</span>
        </h1>

        <p className="max-w-xl text-white/70 text-lg md:text-xl leading-relaxed animate-fade-up">
          Deccan cuisine reimagined — where the spice trade meets the cocktail
          bar. One address. Hyderabad&apos;s only.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-4 animate-fade-up">
          <Link href="/reservations" className="btn-primary">
            Reserve Your Table
          </Link>
          <Link href="/menu" className="btn-ghost">
            Explore the Menu
          </Link>
        </div>

        {/* Quick info bar */}
        <div className="mt-12 grid grid-cols-3 gap-8 md:gap-16 border-t border-white/10 pt-8 w-full max-w-2xl animate-fade-in">
          <div className="flex flex-col items-center gap-1">
            <span className="text-brand-gold text-xs font-bold tracking-widest uppercase">
              Open
            </span>
            <span className="text-white/60 text-sm">Mon–Sun</span>
            <span className="text-white text-sm font-medium">12pm – 1am</span>
          </div>
          <div className="flex flex-col items-center gap-1 border-x border-white/10 px-4">
            <span className="text-brand-gold text-xs font-bold tracking-widest uppercase">
              Location
            </span>
            <span className="text-white/60 text-sm">Jubilee Hills</span>
            <span className="text-white text-sm font-medium">Hyderabad</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-brand-gold text-xs font-bold tracking-widest uppercase">
              Call Us
            </span>
            <span className="text-white/60 text-sm">Reservations</span>
            <a
              href="tel:+914022334455"
              className="text-white text-sm font-medium hover:text-brand-gold transition-colors"
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

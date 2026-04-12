"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-end overflow-hidden bg-[#0A0806]">

      {/* Background image */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=85')`,
          }}
        />
        {/* Multi-layer gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0806] via-[#0A0806]/65 to-[#0A0806]/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0806]/75 via-[#0A0806]/20 to-transparent" />
      </div>

      {/* Vertical text — right side */}
      <div className="absolute top-1/2 right-8 md:right-14 -translate-y-1/2 z-10 hidden lg:flex flex-col items-center gap-4">
        <div className="w-px h-20 bg-white/15" />
        <p
          className="text-[10px] font-bold tracking-[0.45em] uppercase text-white/25"
          style={{ writingMode: "vertical-lr" }}
        >
          Jubilee Hills · Hyderabad · Est. 2025
        </p>
        <div className="w-px h-20 bg-white/15" />
      </div>

      {/* Main content — pinned to bottom */}
      <div className="relative z-10 max-w-screen-xl mx-auto w-full px-6 md:px-12 lg:px-20 pb-16 md:pb-24">

        {/* Eyebrow */}
        <p className="text-[10px] font-black tracking-[0.45em] uppercase text-brand-gold mb-6 md:mb-8">
          Hyderabad&apos;s Finest · Est. 2025
        </p>

        {/* Headline */}
        <h1 className="font-display font-black leading-[0.85] tracking-tight mb-8 md:mb-10">
          <span
            className="block text-white"
            style={{ fontSize: "clamp(4rem, 13vw, 11rem)" }}
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
            className="block text-white/20"
            style={{ fontSize: "clamp(1.8rem, 6vw, 5.5rem)" }}
          >
            BOLDER DRINKS.
          </span>
        </h1>

        {/* Tagline */}
        <div className="flex items-center gap-5 mb-10 max-w-md">
          <div className="h-px bg-brand-gold/50 w-10 flex-shrink-0" />
          <p className="text-white/45 text-sm md:text-base leading-relaxed">
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
            className="border border-white/20 text-white text-[11px] font-bold tracking-[0.25em] uppercase px-8 py-4 hover:border-white/50 hover:bg-white/5 transition-all duration-300"
          >
            View Menu
          </Link>
        </div>

        {/* Info strip */}
        <div className="border-t border-white/8 pt-7 flex flex-wrap gap-8 md:gap-16">
          {[
            { label: "Open", value: "Mon–Sun, 12pm – 1am" },
            { label: "Location", value: "Jubilee Hills, Hyderabad" },
            { label: "Reservations", value: "040-2233-4455" },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col gap-1">
              <span className="text-[10px] font-black tracking-[0.35em] uppercase text-brand-gold/70">
                {label}
              </span>
              <span className="text-white/50 text-sm">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

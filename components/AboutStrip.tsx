import Image from "next/image";
import Link from "next/link";

export default function AboutStrip() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[85vh]">

      {/* Image — full bleed, no gaps */}
      <div className="relative h-[55vw] lg:h-auto order-2 lg:order-1 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=1200&q=85"
          alt="AmVa Kitchen & Bar interior"
          fill
          className="object-cover object-center"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        {/* Subtle right-edge fade into dark text panel */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0A0806]/60 lg:to-[#0A0806]" />
        {/* Bottom label */}
        <div className="absolute bottom-6 left-6">
          <span className="bg-brand-gold text-brand-black text-[10px] font-black tracking-[0.3em] uppercase px-4 py-2">
            Jubilee Hills, Hyderabad
          </span>
        </div>
      </div>

      {/* Text panel */}
      <div className="order-1 lg:order-2 bg-[#0A0806] flex items-center px-8 md:px-14 lg:px-16 py-20 lg:py-28">
        <div className="w-full max-w-lg">

          {/* Eyebrow */}
          <p className="text-[10px] font-black tracking-[0.45em] uppercase text-brand-gold mb-6">
            Our Story
          </p>

          {/* Big headline */}
          <h2
            className="font-display font-black leading-none mb-8 text-white"
            style={{ fontSize: "clamp(3rem, 5.5vw, 5.5rem)" }}
          >
            HYDERABAD&apos;S
            <br />
            <span className="text-brand-gold">NEW</span>
            <br />
            CLASSIC.
          </h2>

          <div className="w-10 h-px bg-brand-gold/50 mb-8" />

          <p className="text-white/45 leading-relaxed text-[15px] mb-5">
            AmVa Kitchen & Bar was born from a simple belief — that the
            Deccan&apos;s rich culinary heritage deserves a modern stage.
            Named after our founders Amritha &amp; Vamsi.
          </p>
          <p className="text-white/45 leading-relaxed text-[15px] mb-10">
            Bold Hyderabadi flavours, coastal spice routes, and a cocktail
            programme that treats Indian ingredients as seriously as any
            premium spirit. One restaurant. One city. No compromises.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 border-t border-white/10 pt-8 mb-10">
            {[
              { num: "120+", label: "Dishes" },
              { num: "40+", label: "Cocktails" },
              { num: "200", label: "Covers" },
            ].map(({ num, label }) => (
              <div key={label}>
                <div className="font-display text-3xl md:text-4xl font-black text-brand-gold">
                  {num}
                </div>
                <div className="text-white/25 text-[10px] tracking-[0.25em] uppercase mt-1.5">
                  {label}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <Link
            href="/about"
            className="inline-flex items-center gap-4 text-[11px] font-black tracking-[0.28em] uppercase text-white hover:text-brand-gold transition-colors group"
          >
            Discover Our Story
            <span className="w-8 h-px bg-current transition-all duration-300 group-hover:w-14" />
          </Link>
        </div>
      </div>
    </section>
  );
}

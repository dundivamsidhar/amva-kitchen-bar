"use client";

import Image from "next/image";

const FOUNDERS = [
  {
    name: "Vamsi Dundi",
    title: "Co-Founder & Executive Chef",
    quote:
      "Every dish we serve carries the soul of Hyderabad — I want guests to taste our city's history in every bite.",
    photo: "/founders/vamsi.jpg",
    detail:
      "Trained in classical Indian and European techniques, Vamsi brings 15+ years of culinary craft to every plate at AmVa.",
    initial: "V",
  },
  {
    name: "Amar",
    title: "Co-Founder & Creative Director",
    quote:
      "AmVa is more than a restaurant — it's an experience. Every corner, every cocktail, every candle tells a story.",
    photo: "/founders/amar.jpg",
    detail:
      "With a background in hospitality design and bar culture, Amar shapes the atmosphere that makes AmVa unmistakable.",
    initial: "A",
  },
];

export default function FoundersSection() {
  return (
    <section className="bg-[#0A0806] py-24 md:py-32 overflow-hidden">
      <div className="max-w-screen-xl mx-auto px-6 md:px-12">

        {/* Header */}
        <div className="mb-16 md:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-[10px] font-black tracking-[0.45em] uppercase text-brand-gold mb-5">
              The People Behind AmVa
            </p>
            <h2
              className="font-display font-black leading-none text-white"
              style={{ fontSize: "clamp(3rem, 7vw, 7rem)" }}
            >
              MEET THE
              <br />
              <span className="text-brand-gold">FOUNDERS.</span>
            </h2>
          </div>
          <p className="text-white/25 text-sm max-w-xs leading-relaxed">
            One vision. One city. No compromises.
          </p>
        </div>

        {/* Founder cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5">
          {FOUNDERS.map((f) => (
            <div key={f.name} className="group bg-[#0A0806]">

              {/* Portrait */}
              <div
                className="relative overflow-hidden"
                style={{ aspectRatio: "3/4" }}
              >
                {/* Fallback background pattern */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "repeating-linear-gradient(45deg, #111008 0px, #111008 10px, #0d0b06 10px, #0d0b06 20px)",
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className="font-display font-black text-white/4 select-none"
                      style={{ fontSize: "clamp(8rem, 25vw, 18rem)" }}
                    >
                      {f.initial}
                    </span>
                  </div>
                </div>

                {/* Actual photo (hidden on error) */}
                <Image
                  src={f.photo}
                  alt={f.name}
                  fill
                  className="object-cover object-top grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />

                {/* Bottom gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0806] via-[#0A0806]/30 to-transparent" />

                {/* Title badge */}
                <div className="absolute top-5 left-5">
                  <span className="text-[10px] font-black tracking-[0.3em] uppercase text-brand-gold border border-brand-gold/30 px-3 py-1.5 bg-[#0A0806]/75 backdrop-blur-sm">
                    {f.title}
                  </span>
                </div>
              </div>

              {/* Content block */}
              <div className="p-8 md:p-10 border-t border-white/5">
                <h3 className="font-display text-3xl md:text-4xl font-black text-white mb-4">
                  {f.name}
                </h3>
                <div className="w-8 h-px bg-brand-gold mb-6" />
                <p className="text-white/45 text-sm leading-relaxed italic mb-5">
                  &ldquo;{f.quote}&rdquo;
                </p>
                <p className="text-white/22 text-xs leading-relaxed">
                  {f.detail}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom tagline */}
        <div className="mt-14 text-center">
          <p className="text-[10px] tracking-[0.5em] uppercase text-white/15">
            One vision · One city · No compromises
          </p>
        </div>
      </div>
    </section>
  );
}

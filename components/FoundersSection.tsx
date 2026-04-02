"use client";

import Image from "next/image";

const FOUNDERS = [
  {
    name: "Vamsi Dundi",
    title: "Co-Founder & Executive Chef",
    quote: "Every dish we serve carries the soul of Hyderabad — I want guests to taste our city's history in every bite.",
    photo: "/founders/vamsi.jpg",
    detail: "Trained in classical Indian and European techniques, Vamsi brings 15+ years of culinary craft to every plate at AmVa.",
  },
  {
    name: "Amar",
    title: "Co-Founder & Creative Director",
    quote: "AmVa is more than a restaurant — it's an experience. Every corner, every cocktail, every candle tells a story.",
    photo: "/founders/amar.jpg",
    detail: "With a background in hospitality design and bar culture, Amar shapes the atmosphere that makes AmVa unmistakable.",
  },
];

export default function FoundersSection() {
  return (
    <section className="py-24 bg-brand-black overflow-hidden">
      <div className="container-custom">

        {/* Header */}
        <div className="text-center mb-16 flex flex-col items-center gap-4">
          <p className="section-label">The People Behind AmVa</p>
          <h2 className="section-title text-white">
            Meet Our
            <br />
            <span className="text-gradient-gold">Founders</span>
          </h2>
          <div className="w-16 h-px bg-brand-gold/40 mt-2" />
        </div>

        {/* Founder cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 max-w-5xl mx-auto">
          {FOUNDERS.map((founder) => (
            <div key={founder.name} className="group relative bg-brand-dark overflow-hidden">

              {/* Portrait */}
              <div className="relative h-[520px] overflow-hidden bg-brand-black">
                <Image
                  src={founder.photo}
                  alt={founder.name}
                  fill
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
                {/* Fallback pattern when no photo */}
                <div className="absolute inset-0 flex items-center justify-center"
                  style={{background: "repeating-linear-gradient(45deg, #1a1208 0px, #1a1208 10px, #0d0a04 10px, #0d0a04 20px)"}}>
                  <div className="flex flex-col items-center gap-3 opacity-30">
                    <div className="w-24 h-24 rounded-full border-2 border-brand-gold/40 flex items-center justify-center">
                      <span className="font-display text-4xl font-bold text-brand-gold">
                        {founder.name.charAt(0)}
                      </span>
                    </div>
                    <span className="text-brand-gold/40 text-xs tracking-widest uppercase">Photo coming soon</span>
                  </div>
                </div>
                {/* Strong bottom gradient for text legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/50 to-transparent" />

                {/* Chef coat badge */}
                <div className="absolute top-5 left-5">
                  <div className="flex items-center gap-2 bg-brand-black/70 backdrop-blur-sm border border-brand-gold/30 px-3 py-1.5">
                    <span className="text-brand-gold text-[10px]">✦</span>
                    <span className="text-brand-gold/80 text-[10px] font-bold tracking-[0.25em] uppercase">
                      {founder.title.split("&")[1]?.trim() || founder.title}
                    </span>
                  </div>
                </div>

                {/* Name + title at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="font-display text-3xl font-bold text-white mb-1">
                    {founder.name}
                  </h3>
                  <p className="text-brand-gold text-xs font-bold tracking-[0.25em] uppercase mb-4">
                    {founder.title}
                  </p>
                  <div className="w-10 h-px bg-brand-gold mb-4" />
                  <p className="text-white/60 text-sm leading-relaxed italic">
                    &ldquo;{founder.quote}&rdquo;
                  </p>
                </div>
              </div>

              {/* Detail strip */}
              <div className="px-8 py-6 border-t border-white/5 bg-brand-dark">
                <p className="text-white/40 text-sm leading-relaxed">
                  {founder.detail}
                </p>
              </div>

            </div>
          ))}
        </div>

        {/* Bottom tagline */}
        <div className="mt-16 text-center">
          <p className="text-white/20 text-xs tracking-[0.4em] uppercase">
            One vision · One city · No compromises
          </p>
        </div>

      </div>
    </section>
  );
}

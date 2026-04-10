"use client";

import Image from "next/image";
import { useTheme } from "@/lib/ThemeContext";

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
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section className="py-24 overflow-hidden" style={{ background: isDark ? "#0A0806" : "#fdf9f3" }}>
      <div className="container-custom">

        {/* Header */}
        <div className="text-center mb-16 flex flex-col items-center gap-4">
          <p className="section-label">The People Behind AmVa</p>
          <h2 className="section-title" style={{ color: isDark ? "#ffffff" : "#1c1407" }}>
            Meet Our
            <br />
            <span className="text-gradient-gold">Founders</span>
          </h2>
          <div className="w-16 h-px bg-brand-gold/40 mt-2" />
        </div>

        {/* Founder cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px max-w-5xl mx-auto" style={{ background: isDark ? "rgba(255,255,255,0.05)" : "rgba(28,20,7,0.08)" }}>
          {FOUNDERS.map((founder) => (
            <div key={founder.name} className="group relative overflow-hidden" style={{ background: isDark ? "#120E09" : "#f5ede0" }}>

              {/* Portrait */}
              <div className="relative h-[320px] sm:h-[420px] md:h-[520px] overflow-hidden" style={{ background: isDark ? "#0A0806" : "#ede0cc" }}>
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
                  style={{ background: isDark
                    ? "repeating-linear-gradient(45deg, #1a1208 0px, #1a1208 10px, #0d0a04 10px, #0d0a04 20px)"
                    : "repeating-linear-gradient(45deg, #e8d5b8 0px, #e8d5b8 10px, #dfc9a8 10px, #dfc9a8 20px)" }}>
                  <div className="flex flex-col items-center gap-3 opacity-30">
                    <div className="w-24 h-24 rounded-full border-2 border-brand-gold/40 flex items-center justify-center">
                      <span className="font-display text-4xl font-bold text-brand-gold">
                        {founder.name.charAt(0)}
                      </span>
                    </div>
                    <span className="text-brand-gold/40 text-xs tracking-widest uppercase">Photo coming soon</span>
                  </div>
                </div>
                {/* Bottom gradient for text legibility */}
                <div className="absolute inset-0" style={{ background: isDark
                  ? "linear-gradient(to top, #0A0806, rgba(10,8,6,0.5), transparent)"
                  : "linear-gradient(to top, #f5ede0, rgba(245,237,224,0.5), transparent)" }} />

                {/* Badge */}
                <div className="absolute top-5 left-5">
                  <div className="flex items-center gap-2 backdrop-blur-sm border px-3 py-1.5"
                    style={{ background: isDark ? "rgba(10,8,6,0.70)" : "rgba(245,237,224,0.80)", borderColor: "rgba(212,160,23,0.30)" }}>
                    <span className="text-brand-gold text-xs">✦</span>
                    <span className="text-xs font-bold tracking-[0.25em] uppercase" style={{ color: isDark ? "rgba(212,160,23,0.80)" : "#8a6d1a" }}>
                      {founder.title.split("&")[1]?.trim() || founder.title}
                    </span>
                  </div>
                </div>

                {/* Name + title at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8">
                  <h3 className="font-display text-3xl font-bold mb-1" style={{ color: isDark ? "#ffffff" : "#1c1407" }}>
                    {founder.name}
                  </h3>
                  <p className="text-brand-gold text-xs font-bold tracking-[0.25em] uppercase mb-4">
                    {founder.title}
                  </p>
                  <div className="w-10 h-px bg-brand-gold mb-4" />
                  <p className="text-sm leading-relaxed italic" style={{ color: isDark ? "rgba(255,255,255,0.60)" : "rgba(28,20,7,0.60)" }}>
                    &ldquo;{founder.quote}&rdquo;
                  </p>
                </div>
              </div>

              {/* Detail strip */}
              <div className="px-4 sm:px-8 py-4 sm:py-6 border-t" style={{ borderColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(28,20,7,0.08)", background: isDark ? "#120E09" : "#f5ede0" }}>
                <p className="text-sm leading-relaxed" style={{ color: isDark ? "rgba(255,255,255,0.40)" : "rgba(28,20,7,0.55)" }}>
                  {founder.detail}
                </p>
              </div>

            </div>
          ))}
        </div>

        {/* Bottom tagline */}
        <div className="mt-16 text-center">
          <p className="text-xs tracking-[0.4em] uppercase" style={{ color: isDark ? "rgba(255,255,255,0.20)" : "rgba(28,20,7,0.30)" }}>
            One vision · One city · No compromises
          </p>
        </div>

      </div>
    </section>
  );
}

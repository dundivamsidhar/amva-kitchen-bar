"use client";

import Image from "next/image";
import { useTheme } from "@/lib/ThemeContext";

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
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const bg = isDark ? "#0A0806" : "#fdf9f3";
  const cardBg = isDark ? "#0A0806" : "#f5ede0";
  const headingColor = isDark ? "#ffffff" : "#1c1407";
  const textColor = isDark ? "rgba(255,255,255,0.45)" : "rgba(28,20,7,0.55)";
  const subColor = isDark ? "rgba(255,255,255,0.20)" : "rgba(28,20,7,0.25)";
  const borderColor = isDark ? "rgba(255,255,255,0.05)" : "rgba(28,20,7,0.08)";
  const dividerColor = isDark ? "rgba(255,255,255,0.05)" : "rgba(28,20,7,0.08)";
  const patternA = isDark ? "#111008" : "#e8d5b8";
  const patternB = isDark ? "#0d0b06" : "#dfc9a8";

  return (
    <section className="py-24 md:py-32 overflow-hidden" style={{ background: bg }}>
      <div className="max-w-screen-xl mx-auto px-6 md:px-12">

        {/* Header */}
        <div className="mb-16 md:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-[10px] font-black tracking-[0.45em] uppercase text-brand-gold mb-5">
              The People Behind AmVa
            </p>
            <h2
              className="font-display font-black leading-none"
              style={{ fontSize: "clamp(3rem, 7vw, 7rem)", color: headingColor }}
            >
              MEET THE
              <br />
              <span className="text-brand-gold">FOUNDERS.</span>
            </h2>
          </div>
          <p className="text-sm max-w-xs leading-relaxed" style={{ color: subColor }}>
            One vision. One city. No compromises.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ background: dividerColor }}>
          {FOUNDERS.map((f) => (
            <div key={f.name} className="group" style={{ background: cardBg }}>

              {/* Portrait */}
              <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
                {/* Fallback pattern */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `repeating-linear-gradient(45deg, ${patternA} 0px, ${patternA} 10px, ${patternB} 10px, ${patternB} 20px)`,
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className="font-display font-black select-none"
                      style={{
                        fontSize: "clamp(8rem, 25vw, 18rem)",
                        color: isDark ? "rgba(255,255,255,0.04)" : "rgba(28,20,7,0.06)",
                      }}
                    >
                      {f.initial}
                    </span>
                  </div>
                </div>

                {/* Photo */}
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
                <div
                  className="absolute inset-0"
                  style={{
                    background: isDark
                      ? "linear-gradient(to top, #0A0806, rgba(10,8,6,0.3), transparent)"
                      : "linear-gradient(to top, #f5ede0, rgba(245,237,224,0.3), transparent)",
                  }}
                />

                {/* Badge */}
                <div className="absolute top-5 left-5">
                  <span
                    className="text-[10px] font-black tracking-[0.3em] uppercase text-brand-gold border border-brand-gold/30 px-3 py-1.5 backdrop-blur-sm"
                    style={{ background: isDark ? "rgba(10,8,6,0.75)" : "rgba(245,237,224,0.85)" }}
                  >
                    {f.title}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 md:p-10" style={{ borderTop: `1px solid ${borderColor}` }}>
                <h3
                  className="font-display text-3xl md:text-4xl font-black mb-4"
                  style={{ color: headingColor }}
                >
                  {f.name}
                </h3>
                <div className="w-8 h-px bg-brand-gold mb-6" />
                <p className="text-sm leading-relaxed italic mb-5" style={{ color: textColor }}>
                  &ldquo;{f.quote}&rdquo;
                </p>
                <p className="text-xs leading-relaxed" style={{ color: subColor }}>
                  {f.detail}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Tagline */}
        <div className="mt-14 text-center">
          <p className="text-[10px] tracking-[0.5em] uppercase" style={{ color: subColor }}>
            One vision · One city · No compromises
          </p>
        </div>
      </div>
    </section>
  );
}

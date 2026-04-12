"use client";

import { useTheme } from "@/lib/ThemeContext";

const FOUNDERS = [
  {
    name: "Vamsi Dundi",
    title: "Co-Founder & Executive Chef",
    quote: "Every dish carries the soul of Hyderabad — I want guests to taste our city's history in every bite.",
    detail: "15+ years of culinary craft. Classical Indian and European training.",
    initial: "V",
  },
  {
    name: "Amar",
    title: "Co-Founder & Creative Director",
    quote: "AmVa is more than a restaurant — it's an experience. Every corner, every cocktail tells a story.",
    detail: "Hospitality design and bar culture. Shapes everything unmistakably AmVa.",
    initial: "A",
  },
];

export default function FoundersSection() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const bg = isDark ? "#0A0806" : "#fdf9f3";
  const cardBg = isDark ? "#120E09" : "#f5ede0";
  const headingColor = isDark ? "#ffffff" : "#1c1407";
  const textColor = isDark ? "rgba(255,255,255,0.45)" : "rgba(28,20,7,0.55)";
  const subColor = isDark ? "rgba(255,255,255,0.22)" : "rgba(28,20,7,0.30)";
  const borderColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(28,20,7,0.08)";

  return (
    <section className="py-20 md:py-24" style={{ background: bg }}>
      <div className="max-w-screen-xl mx-auto px-6 md:px-12">

        {/* Header */}
        <div className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-black tracking-[0.45em] uppercase text-brand-gold mb-3">
              The People Behind AmVa
            </p>
            <h2
              className="font-display font-black leading-none"
              style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)", color: headingColor }}
            >
              Meet Our <span className="text-brand-gold">Founders.</span>
            </h2>
          </div>
          <p className="text-sm max-w-xs leading-relaxed" style={{ color: subColor }}>
            One vision. One city. No compromises.
          </p>
        </div>

        {/* Founder cards — compact horizontal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ background: borderColor }}>
          {FOUNDERS.map((f) => (
            <div
              key={f.name}
              className="flex gap-6 p-8 md:p-10 group"
              style={{ background: cardBg }}
            >
              {/* Initial avatar */}
              <div
                className="w-14 h-14 flex-shrink-0 flex items-center justify-center border border-brand-gold/30"
                style={{ background: isDark ? "rgba(212,160,23,0.08)" : "rgba(212,160,23,0.10)" }}
              >
                <span className="font-display text-2xl font-black text-brand-gold">
                  {f.initial}
                </span>
              </div>

              {/* Text */}
              <div className="flex flex-col gap-3 min-w-0">
                <div>
                  <h3
                    className="font-display text-xl font-black leading-tight"
                    style={{ color: headingColor }}
                  >
                    {f.name}
                  </h3>
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-brand-gold/70 mt-1">
                    {f.title}
                  </p>
                </div>

                <div className="w-8 h-px bg-brand-gold/40" />

                <p className="text-sm leading-relaxed italic" style={{ color: textColor }}>
                  &ldquo;{f.quote}&rdquo;
                </p>

                <p className="text-xs leading-relaxed" style={{ color: subColor }}>
                  {f.detail}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

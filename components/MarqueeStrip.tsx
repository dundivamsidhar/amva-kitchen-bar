"use client";

import { useTheme } from "@/lib/ThemeContext";

export default function MarqueeStrip() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const items = [
    "Deccan Cuisine",
    "Signature Cocktails",
    "Jubilee Hills",
    "Est. 2025",
    "Open 12pm – 1am",
    "Hyderabad's Finest",
    "120+ Dishes",
    "40+ Cocktails",
  ];

  const repeated = [...items, ...items, ...items, ...items];

  return (
    <div
      className="py-3.5 overflow-hidden"
      style={{ background: isDark ? "#D4A017" : "#D4A017" }}
    >
      <div className="flex animate-marquee whitespace-nowrap will-change-transform">
        {repeated.map((item, i) => (
          <span
            key={i}
            className="text-brand-black text-[11px] font-black tracking-[0.3em] uppercase mx-6 flex-shrink-0"
          >
            {item}
            <span className="mx-5 opacity-35">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/lib/ThemeContext";

const HIGHLIGHTS = [
  {
    label: "Every Sunday",
    headline: "Brunch Like\nYou Mean It.",
    body: "Start your Sunday right — bottomless mimosas, slow-cooked Hyderabadi breakfast platters, and a vibe that makes you forget it's a weekday tomorrow. Our Sunday Brunch runs from 11am and it books out fast.",
    cta: { label: "Book Sunday Brunch", href: "/reservations" },
    image: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=900&q=85",
    imageAlt: "AmVa Sunday Brunch spread",
    imageLeft: true,
  },
  {
    label: "Friday & Saturday",
    headline: "Nights Worth\nRemembering.",
    body: "As the sun goes down, AmVa transforms. Our resident DJs take over, the cocktail bar hits its stride, and Jubilee Hills comes alive. Late-night bites, signature drinks, and an atmosphere you won't find anywhere else in the city.",
    cta: { label: "Reserve Your Night", href: "/reservations" },
    image: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=900&q=85",
    imageAlt: "AmVa night atmosphere",
    imageLeft: false,
  },
  {
    label: "The Signature",
    headline: "The Dum\nBiryani Story.",
    body: "Every grain of our Dum Biryani is a decision. Aged Basmati. A sealed handi. Slow coal heat. A recipe that took months to get right — and one bite to fall in love with. This isn't biryani. This is Hyderabad.",
    cta: { label: "Explore the Menu", href: "/menu" },
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=900&q=85",
    imageAlt: "AmVa Dum Biryani",
    imageLeft: true,
  },
];

interface HighlightProps {
  item: (typeof HIGHLIGHTS)[0];
  isDark: boolean;
}

function HighlightBlock({ item, isDark }: HighlightProps) {
  const bg = isDark ? "#0A0806" : "#fdf9f3";
  const headingColor = isDark ? "#1c1407" : "#1c1407";
  const textColor = isDark ? "rgba(255,255,255,0.50)" : "rgba(28,20,7,0.55)";
  const sectionBg = isDark ? "#120E09" : "#f5ede0";

  const textBlock = (
    <div
      className="flex flex-col justify-center px-8 md:px-12 lg:px-16 py-16 lg:py-24"
      style={{ background: sectionBg }}
    >
      <div className="max-w-lg mx-auto lg:mx-0">
        <p className="text-[10px] font-black tracking-[0.45em] uppercase text-brand-gold mb-5">
          {item.label}
        </p>

        <h2
          className="font-display font-black leading-none mb-7"
          style={{
            fontSize: "clamp(2.8rem, 5vw, 5rem)",
            color: isDark ? "#ffffff" : "#1c1407",
          }}
        >
          {item.headline.split("\n").map((line, i) => (
            <span key={i} className="block">
              {i === 1 ? <span className="text-brand-gold">{line}</span> : line}
            </span>
          ))}
        </h2>

        <div className="w-10 h-px bg-brand-gold/50 mb-7" />

        <p
          className="text-[15px] leading-relaxed mb-9"
          style={{ color: textColor }}
        >
          {item.body}
        </p>

        <Link
          href={item.cta.href}
          className="inline-flex items-center gap-4 text-[11px] font-black tracking-[0.28em] uppercase border border-brand-gold text-brand-gold px-7 py-3.5 hover:bg-brand-gold hover:text-brand-black transition-all duration-300"
        >
          {item.cta.label}
        </Link>
      </div>
    </div>
  );

  const imageBlock = (
    <div className="relative h-[55vw] lg:h-auto overflow-hidden">
      <Image
        src={item.image}
        alt={item.imageAlt}
        fill
        className="object-cover object-center transition-transform duration-700 hover:scale-105"
        sizes="(max-width: 1024px) 100vw, 50vw"
      />
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? "linear-gradient(to bottom, transparent 60%, rgba(18,14,9,0.4))"
            : "linear-gradient(to bottom, transparent 60%, rgba(245,237,224,0.3))",
        }}
      />
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[520px]">
      {item.imageLeft ? (
        <>
          <div className="order-2 lg:order-1">{imageBlock}</div>
          <div className="order-1 lg:order-2">{textBlock}</div>
        </>
      ) : (
        <>
          <div className="order-2 lg:order-1">{textBlock}</div>
          <div className="order-1 lg:order-2">{imageBlock}</div>
        </>
      )}
    </div>
  );
}

export default function HighlightsSection() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section className="overflow-hidden">
      {HIGHLIGHTS.map((item, i) => (
        <div
          key={item.label}
          style={{
            borderTop: i === 0
              ? "none"
              : isDark
              ? "1px solid rgba(255,255,255,0.05)"
              : "1px solid rgba(28,20,7,0.07)",
          }}
        >
          <HighlightBlock item={item} isDark={isDark} />
        </div>
      ))}
    </section>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/CartContext";
import { useTheme } from "@/lib/ThemeContext";
import toast from "react-hot-toast";

const ITEMS = [
  {
    id: 15,
    name: "Dum",
    name2: "Biryani",
    sub: "Mutton · Aged Basmati · Sealed Handi",
    price: "₹695",
    tag: "SIGNATURE",
    accent: "#D4A017",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1400&q=90",
    overlay: "rgba(20,8,0,0.55)",
    category_id: 4,
  },
  {
    id: 24,
    name: "AmVa",
    name2: "Sour",
    sub: "Bourbon · Tamarind · Curry Leaf",
    price: "₹695",
    tag: "BESTSELLER",
    accent: "#E63950",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1400&q=90",
    overlay: "rgba(20,0,5,0.55)",
    category_id: 6,
  },
  {
    id: 9,
    name: "Dum Ka",
    name2: "Gosht",
    sub: "Slow-cooked Lamb · 8 hours · Deccan spice",
    price: "₹695",
    tag: "CHEF'S SPECIAL",
    accent: "#0EC4BF",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=1400&q=90",
    overlay: "rgba(0,15,14,0.55)",
    category_id: 3,
  },
  {
    id: 8,
    name: "Grill",
    name2: "Platter",
    sub: "Tandoori · Seekh · Fish Tikka · Lamb",
    price: "₹1295",
    tag: "FOR THE TABLE",
    accent: "#FF8C00",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1400&q=90",
    overlay: "rgba(20,6,0,0.55)",
    category_id: 2,
  },
  {
    id: 20,
    name: "Double Ka",
    name2: "Meetha",
    sub: "Rose water · Pistachios · Silver leaf",
    price: "₹295",
    tag: "MUST TRY",
    accent: "#D4A017",
    image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=1400&q=90",
    overlay: "rgba(15,10,0,0.55)",
    category_id: 5,
  },
];

export default function MenuShowcase() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const { addToCart } = useCart();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);

  const item = ITEMS[idx];
  const HOLD = 3800;

  useEffect(() => {
    setVisible(false);
    setProgress(0);
    const t1 = setTimeout(() => {
      setVisible(true);
      // start progress
      const start = Date.now();
      progressRef.current = setInterval(() => {
        const elapsed = Date.now() - start;
        setProgress(Math.min((elapsed / HOLD) * 100, 100));
      }, 30);
    }, 100);

    intervalRef.current = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx((p) => (p + 1) % ITEMS.length);
        if (progressRef.current) clearInterval(progressRef.current);
      }, 500);
    }, HOLD + 100);

    return () => {
      clearTimeout(t1);
      clearTimeout(intervalRef.current!);
      clearInterval(progressRef.current!);
    };
  }, [idx]);

  function handleAdd() {
    addToCart({
      id: item.id,
      category_id: item.category_id,
      name: `${item.name} ${item.name2}`,
      description: item.sub,
      price: parseFloat(item.price.replace("₹", "").replace(",", "")),
      image_url: item.image,
      tags: [],
      is_available: true,
      is_featured: true,
      is_vegetarian: false,
      is_vegan: false,
      spice_level: 1,
      is_special_today: false,
      special_note: null,
      created_at: "",
    });
    toast.success(`${item.name} ${item.name2} added!`);
  }

  return (
    <section className="relative w-full overflow-hidden" style={{ height: "100svh", background: isDark ? "#000" : "#fdf9f3" }}>

      {/* BG image */}
      <div
        className="absolute inset-0"
        style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 0.5s ease",
        }}
      >
        <Image
          key={item.image}
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
          priority
          sizes="100vw"
          style={{
            transform: visible ? "scale(1.04)" : "scale(1)",
            transition: "transform 4s ease-out",
          }}
        />
        <div className="absolute inset-0" style={{ background: isDark ? item.overlay : "rgba(253,249,243,0.45)" }} />
        <div className="absolute inset-0" style={{ background: isDark ? "linear-gradient(to top, #000, rgba(0,0,0,0.1), rgba(0,0,0,0.3))" : "linear-gradient(to top, rgba(253,249,243,0.95), rgba(253,249,243,0.1), rgba(253,249,243,0.3))" }} />
        <div className="absolute inset-0" style={{ background: isDark ? "linear-gradient(to right, rgba(0,0,0,0.6), transparent)" : "linear-gradient(to right, rgba(253,249,243,0.5), transparent)" }} />
      </div>

      {/* Noise */}
      <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none z-10" />

      {/* TAG */}
      <div className="absolute top-28 left-8 md:left-16 z-20">
        <span
          className="text-[10px] md:text-xs font-black tracking-[0.5em] uppercase px-3 py-1.5 border-2"
          style={{
            color: item.accent,
            borderColor: item.accent,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateX(0)" : "translateX(-20px)",
            transition: "all 0.4s ease 0.1s",
            display: "inline-block",
          }}
        >
          {item.tag}
        </span>
      </div>

      {/* COUNTER */}
      <div className="absolute top-28 right-8 md:right-16 z-20 text-right leading-none">
        <span className="font-display font-black" style={{ fontSize: "clamp(4rem,10vw,8rem)", color: isDark ? "rgba(255,255,255,0.10)" : "rgba(28,20,7,0.10)" }}>
          {String(idx + 1).padStart(2, "0")}
        </span>
        <span className="font-display font-black text-2xl md:text-3xl" style={{ color: isDark ? "rgba(255,255,255,0.10)" : "rgba(28,20,7,0.10)" }}>
          /{String(ITEMS.length).padStart(2, "0")}
        </span>
      </div>

      {/* MAIN TEXT */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end pb-32 md:pb-24 px-8 md:px-16">

        {/* Line 1 */}
        <div className="overflow-hidden">
          <h1
            className="font-display font-black leading-none"
            style={{ color: isDark ? "#ffffff" : "#1c1407",
              fontSize: "clamp(4.5rem, 14vw, 13rem)",
              transform: visible ? "translateY(0)" : "translateY(110%)",
              opacity: visible ? 1 : 0,
              transition: "transform 0.65s cubic-bezier(0.16,1,0.3,1) 0.05s, opacity 0.3s ease 0.05s",
              letterSpacing: "-0.02em",
            }}
          >
            {item.name}
          </h1>
        </div>

        {/* Line 2 — accent colour */}
        <div className="overflow-hidden -mt-2 md:-mt-4">
          <h1
            className="font-display font-black leading-none"
            style={{
              fontSize: "clamp(4.5rem, 14vw, 13rem)",
              color: item.accent,
              transform: visible ? "translateY(0)" : "translateY(110%)",
              opacity: visible ? 1 : 0,
              transition: "transform 0.65s cubic-bezier(0.16,1,0.3,1) 0.18s, opacity 0.3s ease 0.18s",
              letterSpacing: "-0.02em",
            }}
          >
            {item.name2}
          </h1>
        </div>

        {/* Sub */}
        <p
          className="mt-4 font-light tracking-[0.25em] uppercase text-sm md:text-base"
          style={{ color: isDark ? "rgba(255,255,255,0.50)" : "rgba(28,20,7,0.55)" }}
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateX(0)" : "translateX(-24px)",
            transition: "all 0.5s ease 0.35s",
          }}
        >
          {item.sub}
        </p>

        {/* Price + buttons */}
        <div
          className="mt-6 flex flex-wrap items-center gap-4"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.5s ease 0.45s",
          }}
        >
          <span
            className="font-display font-black"
            style={{ fontSize: "clamp(2rem,5vw,3.5rem)", color: item.accent }}
          >
            {item.price}
          </span>

          <button
            onClick={handleAdd}
            className="px-7 py-3.5 font-black text-xs tracking-[0.25em] uppercase text-black transition-all duration-200 hover:scale-105 active:scale-95"
            style={{ background: item.accent }}
          >
            Add to Order
          </button>

          <Link
            href="/menu"
            className="px-7 py-3.5 font-black text-xs tracking-[0.25em] uppercase border-2 transition-colors"
            style={{ color: isDark ? "#ffffff" : "#1c1407", borderColor: isDark ? "rgba(255,255,255,0.25)" : "rgba(28,20,7,0.30)" }}
          >
            Full Menu
          </Link>
        </div>
      </div>

      {/* Dot nav */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
        {ITEMS.map((it, i) => (
          <button
            key={i}
            onClick={() => {
              if (progressRef.current) clearInterval(progressRef.current);
              if (intervalRef.current) clearTimeout(intervalRef.current);
              setVisible(false);
              setTimeout(() => setIdx(i), 300);
            }}
            className="transition-all duration-300 rounded-full"
            style={{
              width: i === idx ? "2rem" : "0.45rem",
              height: "0.45rem",
              background: i === idx ? it.accent : (isDark ? "rgba(255,255,255,0.25)" : "rgba(28,20,7,0.20)"),
            }}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] z-20" style={{ background: isDark ? "rgba(255,255,255,0.05)" : "rgba(28,20,7,0.08)" }}>
        <div
          className="h-full"
          style={{
            width: `${progress}%`,
            background: item.accent,
            transition: "width 0.03s linear",
          }}
        />
      </div>

      {/* Scroll hint */}
      <div
        className="absolute bottom-16 right-8 md:right-16 z-20 flex flex-col items-center gap-1"
        style={{ opacity: visible ? 0.4 : 0, transition: "opacity 0.5s" }}
      >
        <div className="w-px h-10 animate-pulse" style={{ background: isDark ? "rgba(255,255,255,0.40)" : "rgba(28,20,7,0.30)" }} />
        <span className="text-[9px] tracking-[0.3em] uppercase rotate-90 mt-2" style={{ color: isDark ? "rgba(255,255,255,0.40)" : "rgba(28,20,7,0.30)" }}>Scroll</span>
      </div>
    </section>
  );
}

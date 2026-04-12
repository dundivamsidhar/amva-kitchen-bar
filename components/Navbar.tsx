"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ShoppingBag, Sun, Moon } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { useTheme } from "@/lib/ThemeContext";

const NAV_LINKS = [
  { label: "Menu", href: "/menu" },
  { label: "Happy Hour", href: "/happyhour" },
  { label: "About", href: "/about" },
  { label: "Find Us", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled
          ? "bg-[#0A0806]/96 backdrop-blur-md border-b border-white/5 py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-screen-xl mx-auto px-6 md:px-12 flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          className="font-display text-2xl font-black tracking-[0.12em] text-white hover:text-brand-gold transition-colors duration-300"
        >
          AM<span className="text-brand-gold">VA</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[11px] font-bold tracking-[0.28em] uppercase text-white/45 hover:text-white transition-colors duration-300"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop right */}
        <div className="hidden md:flex items-center gap-5">
          {/* Theme toggle */}
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="w-9 h-9 flex items-center justify-center border border-white/10 text-white/40 hover:border-brand-gold hover:text-brand-gold transition-all duration-300"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <Link
            href="/order"
            className="relative text-white/40 hover:text-white transition-colors duration-300"
            aria-label="Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-brand-gold text-brand-black text-[9px] font-black flex items-center justify-center rounded-full">
                {count}
              </span>
            )}
          </Link>
          <Link
            href="/reservations"
            className="border border-brand-gold text-brand-gold text-[11px] font-black tracking-[0.22em] uppercase px-7 py-3 hover:bg-brand-gold hover:text-brand-black transition-all duration-300"
          >
            Reserve
          </Link>
        </div>

        {/* Mobile right */}
        <div className="md:hidden flex items-center gap-5">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="text-white/50 hover:text-brand-gold transition-colors"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <Link href="/order" className="relative text-white/50" aria-label="Cart">
            <ShoppingBag className="w-5 h-5" />
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-brand-gold text-brand-black text-[9px] font-black flex items-center justify-center rounded-full">
                {count}
              </span>
            )}
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="text-white p-1"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile full-screen drawer */}
      <div
        className={`md:hidden fixed inset-0 bg-[#0A0806] z-40 flex flex-col transition-all duration-500 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-6 border-b border-white/5">
          <Link
            href="/"
            className="font-display text-2xl font-black tracking-[0.12em] text-white"
            onClick={() => setOpen(false)}
          >
            AM<span className="text-brand-gold">VA</span>
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex flex-col px-8 pt-10 gap-1">
          {[...NAV_LINKS, { label: "Reserve", href: "/reservations" }].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`font-display font-black leading-tight py-4 border-b border-white/5 transition-colors ${
                link.label === "Reserve"
                  ? "text-brand-gold text-5xl border-none mt-2"
                  : "text-white hover:text-brand-gold text-4xl"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto px-8 pb-12 flex flex-col gap-3">
          <div className="h-px bg-white/5 mb-4" />
          {[
            ["Kitchen Display", "/kitchen"],
            ["Admin Panel", "/admin"],
            ["Staff Portal", "/staff"],
          ].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/15 hover:text-white/35 transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}

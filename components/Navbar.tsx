"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, UtensilsCrossed, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/CartContext";

const NAV_LINKS = [
  { label: "Menu", href: "/menu" },
  { label: "Cocktails", href: "/menu#cocktails" },
  { label: "About", href: "/about" },
  { label: "Find Us", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { count } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-brand-black/95 backdrop-blur-md border-b border-white/5 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container-custom flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <div className="w-8 h-8 bg-brand-gold flex items-center justify-center">
            <UtensilsCrossed className="w-4 h-4 text-brand-black" />
          </div>
          <span className="font-display text-xl font-bold text-white tracking-wider">
            AmVa<span className="text-brand-gold">.</span>
          </span>
        </Link>

        {/* Desktop nav — always visible on md+ */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-bold tracking-[0.2em] uppercase text-white/70 hover:text-brand-gold transition-colors duration-200 whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA + Cart */}
        <div className="hidden md:flex items-center gap-3 flex-shrink-0">
          {/* Cart icon */}
          <Link
            href="/order"
            className="relative w-10 h-10 flex items-center justify-center border border-white/10 text-white/60 hover:border-brand-gold hover:text-brand-gold transition-colors"
            aria-label="View cart"
          >
            <ShoppingBag className="w-4 h-4" />
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-brand-gold text-brand-black text-[10px] font-bold flex items-center justify-center rounded-full">
                {count}
              </span>
            )}
          </Link>
          <Link
            href="/reservations"
            className="btn-primary text-xs py-3 px-6 whitespace-nowrap"
          >
            Book a Table
          </Link>
        </div>

        {/* Mobile right side */}
        <div className="md:hidden flex items-center gap-3">
          <Link href="/order" className="relative text-white/60" aria-label="View cart">
            <ShoppingBag className="w-5 h-5" />
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-brand-gold text-brand-black text-[9px] font-bold flex items-center justify-center rounded-full">
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

      {/* Mobile menu drawer */}
      {open && (
        <div className="md:hidden bg-brand-dark/98 backdrop-blur-md border-t border-white/5 mt-2">
          <nav className="container-custom py-6 flex flex-col gap-5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm font-bold tracking-[0.2em] uppercase text-white/80 hover:text-brand-gold transition-colors"
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/reservations"
              onClick={() => setOpen(false)}
              className="btn-primary text-xs mt-2 self-start"
            >
              Book a Table
            </Link>

            {/* Divider */}
            <div className="h-px bg-white/5 mt-2" />

            {/* Staff links */}
            <div className="flex flex-col gap-3">
              <Link
                href="/kitchen"
                onClick={() => setOpen(false)}
                className="text-xs font-bold tracking-[0.15em] uppercase text-white/25 hover:text-white/50 transition-colors"
              >
                Kitchen Display
              </Link>
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="text-xs font-bold tracking-[0.15em] uppercase text-white/25 hover:text-white/50 transition-colors"
              >
                Admin Panel
              </Link>
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="text-xs font-bold tracking-[0.15em] uppercase text-white/25 hover:text-white/50 transition-colors"
              >
                Dashboard
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

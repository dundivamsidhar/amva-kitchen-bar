import Link from "next/link";
import { UtensilsCrossed, Instagram, Facebook, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-brand-black border-t border-white/5">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-brand-gold flex items-center justify-center">
                <UtensilsCrossed className="w-4 h-4 text-brand-black" />
              </div>
              <span className="font-display text-xl font-bold text-white tracking-wider">
                AmVa<span className="text-brand-gold">.</span>
              </span>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed">
              Bold Deccan flavours. Signature cocktails. Hyderabad&apos;s own.
            </p>
            <div className="flex gap-3 mt-2">
              <a
                href="#"
                className="w-9 h-9 border border-white/10 flex items-center justify-center text-white/40 hover:border-brand-gold hover:text-brand-gold transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 border border-white/10 flex items-center justify-center text-white/40 hover:border-brand-gold hover:text-brand-gold transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 border border-white/10 flex items-center justify-center text-white/40 hover:border-brand-gold hover:text-brand-gold transition-colors"
                aria-label="Twitter / X"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Explore */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white text-xs font-bold tracking-[0.2em] uppercase">
              Explore
            </h4>
            <nav className="flex flex-col gap-3">
              {[
                ["Menu", "/menu"],
                ["Cocktails & Bar", "/menu#cocktails"],
                ["Reservations", "/reservations"],
                ["About Us", "/about"],
                ["Find Us", "/contact"],
              ].map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="text-white/40 text-sm hover:text-brand-gold transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white text-xs font-bold tracking-[0.2em] uppercase">
              Visit
            </h4>
            <div className="flex flex-col gap-2 text-white/40 text-sm">
              <p>Plot 42, Road 10</p>
              <p>Jubilee Hills</p>
              <p>Hyderabad, TS 500033</p>
              <a
                href="tel:+914022334455"
                className="hover:text-brand-gold transition-colors mt-2"
              >
                040-2233-4455
              </a>
              <a
                href="mailto:hello@amvakitchen.in"
                className="hover:text-brand-gold transition-colors"
              >
                hello@amvakitchen.in
              </a>
            </div>
          </div>

          {/* Hours */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white text-xs font-bold tracking-[0.2em] uppercase">
              Hours
            </h4>
            <div className="flex flex-col gap-2 text-white/40 text-sm">
              <div className="flex justify-between gap-4">
                <span>Mon – Thu</span>
                <span>12pm – 11:30pm</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Fri – Sat</span>
                <span>12pm – 1am</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Sunday</span>
                <span>11am – 11pm</span>
              </div>
              <p className="text-brand-gold/60 text-xs mt-2">
                Sunday Brunch from 11am
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/25 text-xs">
            © {new Date().getFullYear()} AmVa Kitchen & Bar. All rights
            reserved. Hyderabad, India.
          </p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Use"].map((label) => (
              <Link
                key={label}
                href="#"
                className="text-white/25 text-xs hover:text-white/50 transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

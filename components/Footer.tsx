import Link from "next/link";
import { Instagram, Facebook, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#060503] border-t border-white/5">
      <div className="max-w-screen-xl mx-auto px-6 md:px-12">

        {/* Big brand name — decorative */}
        <div className="border-b border-white/5 py-12 md:py-16 overflow-hidden">
          <div
            className="font-display font-black text-white/5 leading-none select-none"
            style={{ fontSize: "clamp(5rem, 18vw, 14rem)" }}
          >
            AMVA
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 py-14 md:py-16">

          {/* Brand col */}
          <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
            <Link
              href="/"
              className="font-display text-xl font-black tracking-[0.12em] text-white hover:text-brand-gold transition-colors"
            >
              AM<span className="text-brand-gold">VA</span>
            </Link>
            <p className="text-white/30 text-sm leading-relaxed">
              Bold Deccan flavours. Signature cocktails. Hyderabad&apos;s own.
            </p>
            <div className="flex gap-3 mt-2">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 border border-white/8 flex items-center justify-center text-white/25 hover:border-brand-gold hover:text-brand-gold transition-all duration-300"
                  aria-label="Social"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white/20 text-[10px] font-black tracking-[0.35em] uppercase">
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
                  className="text-white/35 text-sm hover:text-white transition-colors duration-200"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Visit */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white/20 text-[10px] font-black tracking-[0.35em] uppercase">
              Visit
            </h4>
            <div className="flex flex-col gap-2 text-sm">
              <p className="text-white/35">Plot 42, Road 10</p>
              <p className="text-white/35">Jubilee Hills</p>
              <p className="text-white/35">Hyderabad, TS 500033</p>
              <a
                href="tel:+914022334455"
                className="text-white/35 hover:text-white transition-colors mt-2"
              >
                040-2233-4455
              </a>
              <a
                href="mailto:hello@amvakitchen.in"
                className="text-white/35 hover:text-white transition-colors"
              >
                hello@amvakitchen.in
              </a>
            </div>
          </div>

          {/* Hours */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white/20 text-[10px] font-black tracking-[0.35em] uppercase">
              Hours
            </h4>
            <div className="flex flex-col gap-2.5 text-sm">
              {[
                ["Mon – Thu", "12pm – 11:30pm"],
                ["Fri – Sat", "12pm – 1am"],
                ["Sunday", "11am – 11pm"],
              ].map(([day, time]) => (
                <div key={day} className="flex justify-between gap-4">
                  <span className="text-white/35">{day}</span>
                  <span className="text-white/20">{time}</span>
                </div>
              ))}
              <p className="text-brand-gold/45 text-xs mt-2">
                Sunday Brunch from 11am
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 py-7 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/18 text-xs">
            © {new Date().getFullYear()} AmVa Kitchen & Bar. All rights reserved. Hyderabad, India.
          </p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Use"].map((label) => (
              <Link
                key={label}
                href="#"
                className="text-white/18 text-xs hover:text-white/40 transition-colors"
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

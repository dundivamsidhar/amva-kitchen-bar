"use client";

import { MapPin, Phone, Clock, Mail } from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/lib/ThemeContext";

export default function LocationSection() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section className="py-24" id="location" style={{ background: isDark ? "#120E09" : "#f5ede0" }}>
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Info */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <p className="section-label">Find Us</p>
              <h2 className="section-title" style={{ color: isDark ? "#ffffff" : "#1c1407" }}>
                One Address.
                <br />
                <span className="text-gradient-gold">Hyderabad.</span>
              </h2>
              <div className="divider-gold" />
            </div>

            <div className="flex flex-col gap-6">
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: "rgba(212,160,23,0.10)", border: "1px solid rgba(212,160,23,0.20)" }}>
                  <MapPin className="w-4 h-4 text-brand-gold" />
                </div>
                <div>
                  <p className="font-semibold mb-1" style={{ color: isDark ? "#ffffff" : "#1c1407" }}>Address</p>
                  <p className="text-sm leading-relaxed" style={{ color: isDark ? "rgba(255,255,255,0.50)" : "rgba(28,20,7,0.55)" }}>
                    AmVa Kitchen & Bar<br />
                    Plot 42, Road 10, Jubilee Hills<br />
                    Hyderabad, Telangana 500033
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: "rgba(212,160,23,0.10)", border: "1px solid rgba(212,160,23,0.20)" }}>
                  <Clock className="w-4 h-4 text-brand-gold" />
                </div>
                <div>
                  <p className="font-semibold mb-1" style={{ color: isDark ? "#ffffff" : "#1c1407" }}>Hours</p>
                  <div className="text-sm space-y-0.5" style={{ color: isDark ? "rgba(255,255,255,0.50)" : "rgba(28,20,7,0.55)" }}>
                    <p>Monday – Thursday: 12pm – 11:30pm</p>
                    <p>Friday – Saturday: 12pm – 1am</p>
                    <p>Sunday: 11am – 11pm (Brunch from 11am)</p>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: "rgba(212,160,23,0.10)", border: "1px solid rgba(212,160,23,0.20)" }}>
                  <Phone className="w-4 h-4 text-brand-gold" />
                </div>
                <div>
                  <p className="font-semibold mb-1" style={{ color: isDark ? "#ffffff" : "#1c1407" }}>Phone</p>
                  <a href="tel:+914022334455" className="text-sm hover:text-brand-gold transition-colors"
                    style={{ color: isDark ? "rgba(255,255,255,0.50)" : "rgba(28,20,7,0.55)" }}>
                    040-2233-4455
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: "rgba(212,160,23,0.10)", border: "1px solid rgba(212,160,23,0.20)" }}>
                  <Mail className="w-4 h-4 text-brand-gold" />
                </div>
                <div>
                  <p className="font-semibold mb-1" style={{ color: isDark ? "#ffffff" : "#1c1407" }}>Email</p>
                  <a href="mailto:hello@amvakitchen.in" className="text-sm hover:text-brand-gold transition-colors"
                    style={{ color: isDark ? "rgba(255,255,255,0.50)" : "rgba(28,20,7,0.55)" }}>
                    hello@amvakitchen.in
                  </a>
                </div>
              </div>
            </div>

            <Link href="/reservations" className="btn-primary self-start">
              Reserve a Table
            </Link>
          </div>

          {/* Map embed */}
          <div className="relative">
            <div className="aspect-square overflow-hidden"
              style={{ background: isDark ? "#2A2218" : "#e8d5b8", border: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(28,20,7,0.10)" }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30452.12345!2d78.4072!3d17.4326!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb90a8736e0001%3A0xc8e77e8d55a43f00!2sJubilee%20Hills%2C%20Hyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, filter: isDark ? "invert(90%) hue-rotate(180deg)" : "none" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="AmVa Kitchen & Bar location"
              />
            </div>

            {/* Overlay card */}
            <div className="absolute -bottom-6 -left-6 bg-brand-gold p-5 max-w-[200px]">
              <p className="text-brand-black text-xs font-bold tracking-widest uppercase mb-1">
                Valet Available
              </p>
              <p className="text-brand-black/70 text-xs">
                Free valet parking for all guests
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

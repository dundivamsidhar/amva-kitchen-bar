import LocationSection from "@/components/LocationSection";
import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-brand-black pt-20">
      {/* Header */}
      <div className="relative py-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=1400&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-brand-black/80" />
        <div className="relative container-custom text-center flex flex-col items-center gap-4">
          <p className="section-label">Get in Touch</p>
          <h1 className="section-title text-white">Find AmVa</h1>
          <p className="text-white/50 max-w-md">
            One location. Jubilee Hills, Hyderabad. We&apos;re here every day
            from noon to midnight.
          </p>
        </div>
      </div>

      <LocationSection />

      {/* Quick CTA */}
      <div className="py-16 bg-brand-dark border-t border-white/5">
        <div className="container-custom flex flex-col items-center text-center gap-6">
          <h2 className="font-display text-3xl font-bold text-white">
            Want to{" "}
            <span className="text-gradient-gold">book a table?</span>
          </h2>
          <p className="text-white/40 max-w-sm text-sm">
            Reservations are recommended, especially on weekends. Walk-ins
            welcome subject to availability.
          </p>
          <Link href="/reservations" className="btn-primary">
            Make a Reservation
          </Link>
        </div>
      </div>
    </div>
  );
}

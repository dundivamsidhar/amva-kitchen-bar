import Image from "next/image";
import Link from "next/link";

export default function AboutStrip() {
  return (
    <section className="py-0 bg-brand-dark overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
        {/* Image side */}
        <div className="relative h-80 lg:h-auto order-2 lg:order-1">
          <Image
            src="https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=900&q=80"
            alt="AmVa Kitchen & Bar interior"
            fill
            className="object-cover"
            sizes="50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-brand-dark/80 lg:to-brand-dark" />
          {/* Floating label */}
          <div className="absolute bottom-8 left-8 bg-brand-gold px-4 py-2">
            <span className="text-brand-black text-xs font-bold tracking-widest uppercase">
              Jubilee Hills, Hyderabad
            </span>
          </div>
        </div>

        {/* Text side */}
        <div className="order-1 lg:order-2 flex items-center px-8 md:px-16 py-16 lg:py-24 bg-brand-dark">
          <div className="max-w-md flex flex-col gap-6">
            <p className="section-label">Our Story</p>
            <h2 className="section-title text-white leading-tight">
              Hyderabad&apos;s
              <br />
              <span className="text-gradient-gold">New Classic</span>
            </h2>
            <div className="divider-gold" />
            <p className="text-white/60 leading-relaxed">
              AmVa Kitchen & Bar was born from a simple belief — that the
              Deccan&apos;s rich culinary heritage deserves a modern stage.
              Named after our founders Amritha &amp; Vamsi, we bring together
              bold Hyderabadi flavours, coastal spice routes, and a cocktail
              programme that treats Indian ingredients as seriously as any
              premium spirit.
            </p>
            <p className="text-white/60 leading-relaxed">
              One restaurant. One city. No compromises.
            </p>
            <div className="flex gap-4 mt-2">
              <Link href="/about" className="btn-outline text-xs py-3 px-6">
                Our Story
              </Link>
              <Link
                href="/reservations"
                className="btn-primary text-xs py-3 px-6"
              >
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

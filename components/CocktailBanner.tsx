import Link from "next/link";

export default function CocktailBanner() {
  const cocktails = [
    {
      name: "AmVa Sour",
      desc: "Bourbon · Tamarind · Curry Leaf · Smoked Chilli",
      price: "₹695",
    },
    {
      name: "Hyderabad Negroni",
      desc: "Empress Gin · Campari · Cardamom Vermouth",
      price: "₹745",
    },
    {
      name: "Masala Chai Old Fashioned",
      desc: "Woodford Reserve · Chai Reduction · Star Anise Smoke",
      price: "₹745",
    },
    {
      name: "Mango Lassi Margarita",
      desc: "Patrón Silver · Alphonso Mango · Saffron · Tajín",
      price: "₹695",
    },
  ];

  return (
    <section
      className="relative py-28 overflow-hidden"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=1800&q=80')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-brand-black/85" />
      <div className="absolute inset-0 bg-noise opacity-20" />

      <div className="relative z-10 container-custom">
        <div className="flex flex-col items-center text-center gap-4 mb-16">
          <p className="section-label">The Bar Programme</p>
          <h2 className="section-title text-white">
            Cocktails That Speak
            <br />
            <span className="text-gradient-gold">Hyderabadi</span>
          </h2>
          <p className="text-white/50 max-w-md mt-2">
            Our bar team reinvents Indian pantry staples — tamarind, kokum,
            curry leaf, chai masala — into drinks that are unmistakably ours.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
          {cocktails.map((c) => (
            <div
              key={c.name}
              className="bg-brand-black/60 backdrop-blur-sm p-8 flex flex-col gap-3 border border-white/5 hover:border-brand-gold/30 transition-colors group"
            >
              <span className="font-display text-2xl font-bold text-white group-hover:text-gradient-gold transition-all">
                {c.name}
              </span>
              <span className="text-white/40 text-sm leading-relaxed">
                {c.desc}
              </span>
              <span className="text-brand-gold font-bold text-lg mt-auto pt-4">
                {c.price}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link href="/menu#cocktails" className="btn-outline">
            Full Drinks Menu
          </Link>
        </div>
      </div>
    </section>
  );
}

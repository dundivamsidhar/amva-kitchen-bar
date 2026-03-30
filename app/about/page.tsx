import Image from "next/image";
import Link from "next/link";

const TEAM = [
  {
    name: "Amritha Reddy",
    role: "Co-Founder & Creative Director",
    bio: "Former hospitality consultant who spent a decade in London and Singapore before bringing the best of global dining back to Hyderabad.",
    img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
  },
  {
    name: "Vamsi Dundi",
    role: "Co-Founder & Operations",
    bio: "A Hyderabadi at heart with a passion for building experiences that feel both rooted in tradition and thrillingly new.",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
  },
  {
    name: "Chef Rajan Pillai",
    role: "Executive Head Chef",
    bio: "Trained at the Culinary Institute of America and shaped by kitchens in Mumbai, Dubai, and Hyderabad. His cooking is instinct over recipe.",
    img: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&q=80",
  },
  {
    name: "Zara Khan",
    role: "Head Bartender",
    bio: "Award-winning mixologist who built the AmVa cocktail programme from scratch, treating Indian ingredients like premium spirits.",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
  },
];

const VALUES = [
  {
    icon: "🌶️",
    title: "Seasonality First",
    desc: "Our menu changes with the seasons. We source ingredients from Telangana farms and coastal markets, so what you eat is always at peak flavour.",
  },
  {
    icon: "🥃",
    title: "The Indian Bar",
    desc: "We treat tamarind, kokum, curry leaf, and masala as seriously as any premium spirit. Every cocktail is a conversation with India's pantry.",
  },
  {
    icon: "🕯️",
    title: "Every Night Counts",
    desc: "Whether you're here for a Tuesday lunch or a Saturday celebration, the experience never changes. Every table gets our best.",
  },
  {
    icon: "🌱",
    title: "Responsible Hospitality",
    desc: "We compost kitchen waste, work with local suppliers, and donate surplus food through Hyderabad's community kitchens.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-brand-black pt-20">
      {/* Hero */}
      <section className="relative h-[60vh] flex items-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=1400&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-black/50 to-brand-black" />
        <div className="relative container-custom pb-16 flex flex-col gap-4">
          <p className="section-label">Our Story</p>
          <h1 className="section-title text-white max-w-2xl">
            Born in Hyderabad.
            <br />
            <span className="text-gradient-gold">Built for Hyderabad.</span>
          </h1>
        </div>
      </section>

      {/* Origin story */}
      <section className="py-20">
        <div className="container-custom grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col gap-6">
            <p className="text-white/60 text-lg leading-relaxed">
              AmVa Kitchen & Bar is named after its founders — Amritha and
              Vamsi — two Hyderabadis who spent years eating in the world&apos;s
              best restaurants before realising what was missing: a modern,
              unapologetically Indian bar and kitchen in their own city.
            </p>
            <p className="text-white/60 leading-relaxed">
              We opened in Jubilee Hills because it&apos;s where Hyderabad
              eats, drinks, and stays out late. The space took over two years
              to design — every material sourced locally, every light chosen
              to make the food look as good as it tastes.
            </p>
            <p className="text-white/60 leading-relaxed">
              We have one restaurant. We plan to keep it that way. Quality
              over quantity is not a marketing line for us — it&apos;s the
              reason we exist.
            </p>
            <div className="divider-gold" />
            <div className="flex gap-12">
              <div>
                <p className="font-display text-4xl font-bold text-brand-gold">2025</p>
                <p className="text-white/40 text-sm mt-1">Year Founded</p>
              </div>
              <div>
                <p className="font-display text-4xl font-bold text-brand-gold">1</p>
                <p className="text-white/40 text-sm mt-1">Location. Always.</p>
              </div>
              <div>
                <p className="font-display text-4xl font-bold text-brand-gold">80+</p>
                <p className="text-white/40 text-sm mt-1">Menu Items</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80"
                alt="AmVa Kitchen & Bar dining room"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-brand-gold p-5 max-w-[180px]">
              <p className="text-brand-black font-bold text-lg font-display leading-tight">
                Jubilee Hills<br />Hyderabad
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-brand-dark">
        <div className="container-custom">
          <div className="flex flex-col items-center text-center gap-4 mb-14">
            <p className="section-label">What We Stand For</p>
            <h2 className="section-title text-white">
              Our <span className="text-gradient-gold">Values</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="bg-brand-dark p-8 flex flex-col gap-4 hover:bg-brand-gray transition-colors"
              >
                <span className="text-4xl">{v.icon}</span>
                <h3 className="font-display text-xl font-bold text-white">
                  {v.title}
                </h3>
                <p className="text-white/40 text-sm leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="container-custom">
          <div className="flex flex-col items-center text-center gap-4 mb-14">
            <p className="section-label">The People</p>
            <h2 className="section-title text-white">
              Meet the <span className="text-gradient-gold">Team</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {TEAM.map((person) => (
              <div key={person.name} className="flex flex-col gap-4 group">
                <div className="relative aspect-[3/4] overflow-hidden bg-brand-dark">
                  <Image
                    src={person.img}
                    alt={person.name}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 via-transparent to-transparent" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-white">
                    {person.name}
                  </h3>
                  <p className="text-brand-gold text-xs font-bold tracking-wider uppercase mt-0.5">
                    {person.role}
                  </p>
                  <p className="text-white/40 text-sm leading-relaxed mt-2">
                    {person.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-brand-dark border-t border-white/5">
        <div className="container-custom flex flex-col items-center text-center gap-6">
          <h2 className="section-title text-white">
            Ready to <span className="text-gradient-gold">Taste It?</span>
          </h2>
          <p className="text-white/50 max-w-md">
            The best way to understand AmVa is to come in. Book a table and
            let us show you what Hyderabad tastes like.
          </p>
          <div className="flex gap-4 flex-wrap justify-center">
            <Link href="/reservations" className="btn-primary">
              Book a Table
            </Link>
            <Link href="/menu" className="btn-outline">
              View Menu
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

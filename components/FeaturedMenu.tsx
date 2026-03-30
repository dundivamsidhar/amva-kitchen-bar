"use client";

import Image from "next/image";
import Link from "next/link";
import { Flame } from "lucide-react";
import type { MenuItem, MenuCategory } from "@/lib/database.types";

interface Props {
  items: (MenuItem & { menu_categories: MenuCategory })[];
}

function SpiceLevel({ level }: { level: number | null }) {
  if (!level) return null;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 3 }).map((_, i) => (
        <Flame
          key={i}
          className={`w-3 h-3 ${i < level ? "text-brand-red" : "text-white/10"}`}
        />
      ))}
    </div>
  );
}

function MenuItemCard({
  item,
}: {
  item: MenuItem & { menu_categories: MenuCategory };
}) {
  const IMAGE_FALLBACKS: Record<string, string> = {
    starters:
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80",
    "sharing-plates":
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80",
    mains:
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80",
    "biryani-rice":
      "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80",
    desserts:
      "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&q=80",
    cocktails:
      "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&q=80",
    mocktails:
      "https://images.unsplash.com/photo-1546173159-315724a31696?w=600&q=80",
    "wines-spirits":
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&q=80",
  };

  const imgSrc =
    item.image_url ||
    IMAGE_FALLBACKS[item.menu_categories?.slug ?? "mains"] ||
    IMAGE_FALLBACKS["mains"];

  return (
    <div className="menu-card cursor-pointer">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={imgSrc}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-card-gradient" />

        {/* Tags */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {item.tags?.slice(0, 2).map((tag) => (
            <span key={tag} className="tag-pill bg-brand-black/80">
              {tag.replace("-", " ")}
            </span>
          ))}
          {item.is_vegetarian && (
            <span className="tag-pill bg-green-900/80 border-green-500/40 text-green-400">
              veg
            </span>
          )}
        </div>

        {/* Price at bottom */}
        <div className="absolute bottom-3 right-3">
          <span className="font-display text-xl font-bold text-brand-gold">
            ₹{item.price}
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-bold text-white leading-tight">
            {item.name}
          </h3>
          <SpiceLevel level={item.spice_level} />
        </div>
        {item.description && (
          <p className="text-white/50 text-sm leading-relaxed line-clamp-2">
            {item.description}
          </p>
        )}
        <p className="text-brand-gold/60 text-xs font-bold tracking-widest uppercase mt-1">
          {item.menu_categories?.name}
        </p>
      </div>
    </div>
  );
}

export default function FeaturedMenu({ items }: Props) {
  return (
    <section className="py-24 bg-brand-black">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-16">
          <div className="flex flex-col gap-4">
            <p className="section-label">From Our Kitchen</p>
            <h2 className="section-title text-white">
              Why People Come
              <br />
              <span className="text-gradient-gold">Back Every Time</span>
            </h2>
          </div>
          <div className="flex flex-col gap-3 max-w-xs">
            <div className="divider-gold" />
            <p className="text-white/50 text-sm leading-relaxed">
              Signatures from our head chef — dishes that define AmVa Kitchen &
              Bar.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
          {items.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link href="/menu" className="btn-outline">
            See Full Menu
          </Link>
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { Flame } from "lucide-react";
import type { MenuItem, MenuCategory } from "@/lib/database.types";

// Luxury hotel / ambience images — no food photos
const AMBIENCE_IMAGES = [
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=85", // grand hotel lobby chandelier
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=85", // luxury pool / fountain
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=85", // hotel lobby pillars
  "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&q=85", // candlelit fine-dining table
  "https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=800&q=85", // moody dark bar lounge
  "https://images.unsplash.com/photo-1510627489930-0c1b0bfb6785?w=800&q=85", // luxury fountain courtyard
];

interface Props {
  items: (MenuItem & { menu_categories: MenuCategory })[];
}

function SpiceLevel({ level }: { level: number | null }) {
  if (!level) return null;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 3 }).map((_, i) => (
        <Flame key={i} className={`w-3 h-3 ${i < level ? "text-brand-red" : "text-white/20"}`} />
      ))}
    </div>
  );
}

function MenuItemCard({
  item,
  index,
}: {
  item: MenuItem & { menu_categories: MenuCategory };
  index: number;
}) {
  const bgImage = AMBIENCE_IMAGES[index % AMBIENCE_IMAGES.length];

  return (
    <div className="group relative overflow-hidden cursor-pointer">
      {/* Ambience background */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={bgImage}
          alt="AmVa Kitchen ambience"
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/60 to-brand-black/20" />
        <div className="absolute inset-0 bg-brand-black/30" />

        {/* Category badge top-left */}
        <div className="absolute top-4 left-4">
          <span className="text-[10px] font-black tracking-[0.3em] uppercase text-brand-gold/80 border border-brand-gold/30 px-2.5 py-1 bg-brand-black/60 backdrop-blur-sm">
            {item.menu_categories?.name}
          </span>
        </div>

        {/* Tags top-right */}
        <div className="absolute top-4 right-4 flex flex-col gap-1 items-end">
          {item.tags?.slice(0, 1).map((tag) => (
            <span key={tag} className="text-[9px] font-bold tracking-widest uppercase text-white/50 bg-white/5 border border-white/10 px-2 py-0.5">
              {tag.replace(/-/g, " ")}
            </span>
          ))}
          {item.is_vegetarian && (
            <span className="text-[9px] font-bold tracking-widest uppercase text-green-400/80 bg-green-900/20 border border-green-500/20 px-2 py-0.5">
              {item.is_vegan ? "vegan" : "veg"}
            </span>
          )}
        </div>

        {/* Item info at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col gap-2">
          <h3 className="font-display text-xl font-bold text-white leading-tight">
            {item.name}
          </h3>
          {item.description && (
            <p className="text-white/50 text-xs leading-relaxed line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {item.description}
            </p>
          )}
          <div className="flex items-center justify-between mt-1">
            <SpiceLevel level={item.spice_level} />
            <span className="font-display text-2xl font-black text-brand-gold">
              ₹{item.price}
            </span>
          </div>
        </div>
      </div>

      {/* Gold bottom border accent on hover */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
    </div>
  );
}

export default function FeaturedMenu({ items }: Props) {
  return (
    <section className="py-24 bg-brand-black">
      <div className="container-custom">
        {/* Header */}
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

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
          {items.map((item, i) => (
            <MenuItemCard key={item.id} item={item} index={i} />
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

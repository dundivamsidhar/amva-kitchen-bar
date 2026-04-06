"use client";

import { useState, useEffect } from "react";
import { Flame, Leaf, Search, Plus, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { MenuItem, MenuCategory } from "@/lib/database.types";
import { useCart } from "@/lib/CartContext";
import toast from "react-hot-toast";
import menuFallback from "@/lib/menu-fallback.json";

// ── Static fallback data (loaded from JSON — shown when Supabase is not connected) ──
const STATIC_CATEGORIES = menuFallback.categories as MenuCategory[];
const STATIC_ITEMS = menuFallback.items as MenuItem[];
// ─────────────────────────────────────────────────────────────────────────────

function SpiceLevel({ level }: { level: number | null }) {
  if (!level) return null;
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3].map((i) => (
        <Flame
          key={i}
          className={`w-3.5 h-3.5 ${i <= level ? "text-brand-red" : "text-white/10"}`}
        />
      ))}
    </div>
  );
}

function MenuItemRow({ item }: { item: MenuItem; categorySlug: string }) {
  const { addToCart, cart } = useCart();
  const [added, setAdded] = useState(false);
  const inCart = cart.find((c) => c.item.id === item.id);

  function handleAdd() {
    addToCart(item);
    setAdded(true);
    toast.success(`${item.name} added to order`);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="group py-5 border-b border-white/5 last:border-0 hover:bg-white/[0.025] transition-colors px-3 -mx-3">
      <div className="flex items-start gap-3 justify-between">
        {/* Left: name + description */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-display text-base font-bold text-white leading-tight">
              {item.name}
            </h3>
            {item.is_vegetarian && (
              <div className="flex items-center gap-1 text-green-400 shrink-0">
                <Leaf className="w-3 h-3" />
                <span className="text-[9px] font-bold uppercase tracking-wider">
                  {item.is_vegan ? "Vegan" : "Veg"}
                </span>
              </div>
            )}
          </div>
          {item.description && (
            <p className="text-white/40 text-sm leading-relaxed mt-1 line-clamp-2">
              {item.description}
            </p>
          )}
          <div className="flex items-center gap-2.5 mt-2 flex-wrap">
            <SpiceLevel level={item.spice_level} />
            {item.tags?.slice(0, 2).map((tag) => (
              <span key={tag} className="text-[9px] font-bold tracking-widest uppercase text-brand-gold/40 border border-brand-gold/15 px-1.5 py-0.5">
                {tag.replace(/-/g, " ")}
              </span>
            ))}
            {inCart && (
              <span className="text-[9px] font-bold tracking-widest uppercase text-brand-gold bg-brand-gold/10 border border-brand-gold/30 px-1.5 py-0.5">
                {inCart.quantity} in order
              </span>
            )}
          </div>
        </div>

        {/* Right: price + add button */}
        <div className="flex items-center gap-3 shrink-0 pl-4">
          <span className="text-brand-gold font-display font-bold text-lg">₹{item.price}</span>
          <button
            onClick={handleAdd}
            className={`w-8 h-8 flex items-center justify-center border transition-all duration-200 ${
              added
                ? "border-green-500 bg-green-500/20 text-green-400"
                : "border-brand-gold/40 text-brand-gold hover:bg-brand-gold hover:text-brand-black"
            }`}
            title="Add to order"
          >
            {added ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MenuPage() {
  const [categories, setCategories] = useState<MenuCategory[]>(STATIC_CATEGORIES);
  const [items, setItems] = useState<MenuItem[]>(STATIC_ITEMS);
  const [activeCategory, setActiveCategory] = useState<string>("starters");
  const [search, setSearch] = useState("");
  const [vegOnly, setVegOnly] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [catRes, itemRes] = await Promise.all([
          supabase.from("menu_categories").select("*").order("display_order"),
          supabase.from("menu_items").select("*").eq("is_available", true),
        ]);
        if (catRes.data && catRes.data.length > 0) setCategories(catRes.data);
        if (itemRes.data && itemRes.data.length > 0) setItems(itemRes.data);
      } catch {
        // Keep static data
      }
    }
    load();
  }, []);

  const activecat = categories.find((c) => c.slug === activeCategory);
  const filtered = items
    .filter((i) => i.category_id === activecat?.id)
    .filter((i) => !vegOnly || i.is_vegetarian)
    .filter(
      (i) =>
        !search ||
        i.name.toLowerCase().includes(search.toLowerCase()) ||
        i.description?.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="min-h-screen bg-brand-black pt-20">
      {/* Hero */}
      <div className="relative py-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1400&q=80')` }}
        />
        <div className="absolute inset-0 bg-brand-black/80" />
        <div className="relative container-custom text-center flex flex-col items-center gap-4">
          <p className="section-label">AmVa Kitchen & Bar</p>
          <h1 className="section-title text-white">Our Menu</h1>
          <p className="text-white/50 max-w-md">
            From Hyderabadi classics to coastal specialties — every dish tells a story.
          </p>
        </div>
      </div>

      {/* Category tabs */}
      <div className="sticky top-16 z-40 bg-brand-dark/95 backdrop-blur-md border-b border-white/5">
        <div className="container-custom overflow-x-auto">
          <div className="flex gap-0 min-w-max py-0">
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setActiveCategory(cat.slug)}
                className={`px-5 py-4 text-xs font-bold tracking-[0.15em] uppercase transition-all whitespace-nowrap border-b-2 ${
                  activeCategory === cat.slug
                    ? "border-brand-gold text-brand-gold"
                    : "border-transparent text-white/40 hover:text-white/70"
                }`}
              >
                <span className="mr-1.5">{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="container-custom py-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Search dishes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-brand-dark border border-white/10 text-white/80 placeholder:text-white/20 text-sm py-3 pl-10 pr-4 focus:outline-none focus:border-brand-gold/50 transition-colors"
          />
        </div>
        <button
          onClick={() => setVegOnly(!vegOnly)}
          className={`flex items-center gap-2 text-xs font-bold tracking-widest uppercase px-4 py-3 border transition-colors ${
            vegOnly
              ? "border-green-500 text-green-400 bg-green-500/10"
              : "border-white/10 text-white/40 hover:border-white/30"
          }`}
        >
          <Leaf className="w-3.5 h-3.5" />
          Veg Only
        </button>
      </div>

      {/* Menu items */}
      <div className="container-custom pb-24">
        <div className="flex items-center gap-4 mb-6">
          <h2 className="font-display text-2xl font-bold text-white">
            {activecat?.icon} {activecat?.name}
          </h2>
          <span className="text-white/30 text-sm">{filtered.length} items</span>
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center text-white/30">
            <p className="text-lg">No items found</p>
            <p className="text-sm mt-2">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
            <div>
              {filtered.slice(0, Math.ceil(filtered.length / 2)).map((item) => (
                <MenuItemRow key={item.id} item={item} categorySlug={activeCategory} />
              ))}
            </div>
            <div>
              {filtered.slice(Math.ceil(filtered.length / 2)).map((item) => (
                <MenuItemRow key={item.id} item={item} categorySlug={activeCategory} />
              ))}
            </div>
          </div>
        )}

        {/* Allergen note */}
        <div className="mt-12 p-5 border border-white/5 bg-brand-dark/50">
          <p className="text-white/30 text-xs leading-relaxed">
            <span className="text-white/50 font-bold">Allergen advice: </span>
            Some dishes contain nuts, gluten, dairy, shellfish, or eggs. Please inform your server
            of any allergies or dietary requirements before ordering. All prices include GST.
          </p>
        </div>
      </div>
    </div>
  );
}

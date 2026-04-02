"use client";

import { useState, useEffect } from "react";
import { Flame, Leaf, Search, Plus, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { MenuItem, MenuCategory } from "@/lib/database.types";
import { useCart } from "@/lib/CartContext";
import toast from "react-hot-toast";

// ── Static fallback data (shown when Supabase is not connected) ──────────────
const STATIC_CATEGORIES: MenuCategory[] = [
  { id: 1, name: "Starters", slug: "starters", icon: "🥗", display_order: 1, created_at: "" },
  { id: 2, name: "Sharing Plates", slug: "sharing-plates", icon: "🫕", display_order: 2, created_at: "" },
  { id: 3, name: "Mains", slug: "mains", icon: "🍛", display_order: 3, created_at: "" },
  { id: 4, name: "Biryani & Rice", slug: "biryani-rice", icon: "🍚", display_order: 4, created_at: "" },
  { id: 5, name: "Desserts", slug: "desserts", icon: "🍮", display_order: 5, created_at: "" },
  { id: 6, name: "Signature Cocktails", slug: "cocktails", icon: "🍹", display_order: 6, created_at: "" },
  { id: 7, name: "Mocktails", slug: "mocktails", icon: "🥤", display_order: 7, created_at: "" },
  { id: 8, name: "Wines & Spirits", slug: "wines-spirits", icon: "🍷", display_order: 8, created_at: "" },
];

const STATIC_ITEMS: MenuItem[] = [
  // Starters (category_id: 1)
  { id: 1, category_id: 1, name: "Hyderabadi Galouti Kebab", description: "Melt-in-your-mouth minced lamb patties with saffron & rose petal chutney", price: 495, image_url: null, tags: ["chef-special", "gluten-free"], is_available: true, is_featured: true, is_vegetarian: false, is_vegan: false, spice_level: 1, is_special_today: false, special_note: null, created_at: "" },
  { id: 2, category_id: 1, name: "Paneer Tikka 65", description: "Chargrilled cottage cheese in smoky spiced marinade, mint yoghurt dip", price: 395, image_url: null, tags: ["vegetarian", "chef-special"], is_available: true, is_featured: true, is_vegetarian: true, is_vegan: false, spice_level: 2, is_special_today: false, special_note: null, created_at: "" },
  { id: 3, category_id: 1, name: "Crispy Lotus Stems", description: "Flash-fried lotus root, chilli-lime salt, tamarind glaze", price: 345, image_url: null, tags: ["vegan", "gluten-free"], is_available: true, is_featured: false, is_vegetarian: true, is_vegan: true, spice_level: 1, is_special_today: false, special_note: null, created_at: "" },
  { id: 4, category_id: 1, name: "Prawn Koliwada", description: "Mumbai-style battered prawns, kokum mayo, curry leaf oil", price: 545, image_url: null, tags: ["seafood"], is_available: true, is_featured: false, is_vegetarian: false, is_vegan: false, spice_level: 2, is_special_today: false, special_note: null, created_at: "" },
  { id: 5, category_id: 1, name: "Dal Shorba", description: "Velvet lentil broth, smoked butter, crispy shallots", price: 225, image_url: null, tags: ["vegetarian"], is_available: true, is_featured: false, is_vegetarian: true, is_vegan: false, spice_level: 0, is_special_today: false, special_note: null, created_at: "" },

  // Sharing Plates (category_id: 2)
  { id: 6, category_id: 2, name: "Mezze of the Deccan", description: "Baingan bharta, walnut chutney, pomegranate raita, mini naan basket", price: 695, image_url: null, tags: ["vegetarian", "sharing"], is_available: true, is_featured: false, is_vegetarian: true, is_vegan: false, spice_level: 1, is_special_today: false, special_note: null, created_at: "" },
  { id: 7, category_id: 2, name: "Chaat Board", description: "Pani puri, sev puri, dahi vada, papdi chaat — street food all on one board", price: 595, image_url: null, tags: ["vegetarian", "street-food"], is_available: true, is_featured: true, is_vegetarian: true, is_vegan: false, spice_level: 1, is_special_today: false, special_note: null, created_at: "" },
  { id: 8, category_id: 2, name: "Mixed Grill Platter", description: "Tandoori chicken, seekh kebab, fish tikka, lamb chops, green chutney & pickles", price: 1295, image_url: null, tags: ["mixed", "tandoor"], is_available: true, is_featured: true, is_vegetarian: false, is_vegan: false, spice_level: 2, is_special_today: false, special_note: null, created_at: "" },

  // Mains (category_id: 3)
  { id: 9, category_id: 3, name: "Dum Ka Gosht", description: "Slow-cooked Hyderabadi lamb curry, caramelised onion, stone-flower spice", price: 695, image_url: null, tags: ["signature", "gluten-free"], is_available: true, is_featured: true, is_vegetarian: false, is_vegan: false, spice_level: 2, is_special_today: false, special_note: null, created_at: "" },
  { id: 10, category_id: 3, name: "Butter Chicken — AmVa Style", description: "Tandoor-roasted chicken in smoked tomato & fenugreek sauce, finishing butter", price: 595, image_url: null, tags: ["bestseller"], is_available: true, is_featured: true, is_vegetarian: false, is_vegan: false, spice_level: 1, is_special_today: false, special_note: null, created_at: "" },
  { id: 11, category_id: 3, name: "Coastal Prawn Masala", description: "Konkan-style tiger prawns, raw mango, coconut milk curry, appam", price: 745, image_url: null, tags: ["seafood", "gluten-free"], is_available: true, is_featured: false, is_vegetarian: false, is_vegan: false, spice_level: 3, is_special_today: false, special_note: null, created_at: "" },
  { id: 12, category_id: 3, name: "Wild Mushroom & Truffle Kofta", description: "Handmade mushroom dumplings in makhani sauce, truffle oil finish", price: 545, image_url: null, tags: ["vegetarian", "chef-special"], is_available: true, is_featured: false, is_vegetarian: true, is_vegan: false, spice_level: 1, is_special_today: false, special_note: null, created_at: "" },
  { id: 13, category_id: 3, name: "Raan-e-Deccan", description: "Whole slow-roasted lamb shoulder (serves 2–3), pomegranate jus, roomali roti", price: 1895, image_url: null, tags: ["sharing", "signature", "pre-order"], is_available: true, is_featured: false, is_vegetarian: false, is_vegan: false, spice_level: 2, is_special_today: false, special_note: null, created_at: "" },
  { id: 14, category_id: 3, name: "Paneer Lababdar", description: "Rich tomato-cashew gravy, chargrilled cottage cheese, fresh cream", price: 495, image_url: null, tags: ["vegetarian"], is_available: true, is_featured: false, is_vegetarian: true, is_vegan: false, spice_level: 1, is_special_today: false, special_note: null, created_at: "" },

  // Biryani & Rice (category_id: 4)
  { id: 15, category_id: 4, name: "Hyderabadi Dum Biryani — Mutton", description: "The original — aged basmati, whole spices, slow-steamed in sealed handi", price: 695, image_url: null, tags: ["signature", "bestseller"], is_available: true, is_featured: true, is_vegetarian: false, is_vegan: false, spice_level: 2, is_special_today: false, special_note: null, created_at: "" },
  { id: 16, category_id: 4, name: "Hyderabadi Dum Biryani — Chicken", description: "Classic kachchi method, caramelised onion, mint, saffron", price: 595, image_url: null, tags: ["signature", "bestseller"], is_available: true, is_featured: true, is_vegetarian: false, is_vegan: false, spice_level: 2, is_special_today: false, special_note: null, created_at: "" },
  { id: 17, category_id: 4, name: "Veg Dum Biryani", description: "Garden vegetables, paneer, saffron, dry fruits, dum sealed", price: 495, image_url: null, tags: ["vegetarian"], is_available: true, is_featured: false, is_vegetarian: true, is_vegan: false, spice_level: 1, is_special_today: false, special_note: null, created_at: "" },
  { id: 18, category_id: 4, name: "Prawn Dum Biryani", description: "Tiger prawns, coastal spices, coconut, fresh coriander", price: 795, image_url: null, tags: ["seafood", "signature"], is_available: true, is_featured: false, is_vegetarian: false, is_vegan: false, spice_level: 2, is_special_today: false, special_note: null, created_at: "" },
  { id: 19, category_id: 4, name: "Jeera Rice", description: "Basmati rice tempered with cumin, ghee & fresh herbs", price: 175, image_url: null, tags: ["vegetarian", "side"], is_available: true, is_featured: false, is_vegetarian: true, is_vegan: false, spice_level: 0, is_special_today: false, special_note: null, created_at: "" },

  // Desserts (category_id: 5)
  { id: 20, category_id: 5, name: "Double Ka Meetha", description: "Hyderabadi bread pudding, rose water, pistachios, silver leaf", price: 295, image_url: null, tags: ["signature", "vegetarian"], is_available: true, is_featured: true, is_vegetarian: true, is_vegan: false, spice_level: 0, is_special_today: false, special_note: null, created_at: "" },
  { id: 21, category_id: 5, name: "Gulab Jamun Cheesecake", description: "Cardamom cream cheese, gulab jamun insert, rose coulis", price: 345, image_url: null, tags: ["fusion", "vegetarian"], is_available: true, is_featured: true, is_vegetarian: true, is_vegan: false, spice_level: 0, is_special_today: false, special_note: null, created_at: "" },
  { id: 22, category_id: 5, name: "Kulfi on a Stick", description: "Pistachio & rose, mango & chilli, or malai — choose your flavour", price: 225, image_url: null, tags: ["vegetarian", "gluten-free"], is_available: true, is_featured: false, is_vegetarian: true, is_vegan: false, spice_level: 0, is_special_today: false, special_note: null, created_at: "" },
  { id: 23, category_id: 5, name: "Warm Chocolate Fondant", description: "Dark chocolate lava cake, saffron ice cream, gold leaf", price: 375, image_url: null, tags: ["vegetarian"], is_available: true, is_featured: false, is_vegetarian: true, is_vegan: false, spice_level: 0, is_special_today: false, special_note: null, created_at: "" },

  // Cocktails (category_id: 6)
  { id: 24, category_id: 6, name: "AmVa Sour", description: "Maker's Mark bourbon, fresh tamarind, curry leaf syrup, egg white, smoked chilli rim", price: 695, image_url: null, tags: ["signature", "bestseller"], is_available: true, is_featured: true, is_vegetarian: true, is_vegan: false, spice_level: 0, is_special_today: false, special_note: null, created_at: "" },
  { id: 25, category_id: 6, name: "Hyderabad Negroni", description: "Empress 1908 gin, Campari, cardamom-infused vermouth, charred orange", price: 745, image_url: null, tags: ["signature"], is_available: true, is_featured: true, is_vegetarian: true, is_vegan: false, spice_level: 0, is_special_today: false, special_note: null, created_at: "" },
  { id: 26, category_id: 6, name: "Mango Lassi Margarita", description: "Patrón Silver, Alphonso mango, saffron sugar, Tajín rim", price: 695, image_url: null, tags: ["seasonal", "fusion"], is_available: true, is_featured: false, is_vegetarian: true, is_vegan: false, spice_level: 0, is_special_today: false, special_note: null, created_at: "" },
  { id: 27, category_id: 6, name: "Masala Chai Old Fashioned", description: "Woodford Reserve, spiced chai reduction, Angostura bitters, star anise smoke", price: 745, image_url: null, tags: ["signature", "chef-special"], is_available: true, is_featured: true, is_vegetarian: true, is_vegan: false, spice_level: 0, is_special_today: false, special_note: null, created_at: "" },
  { id: 28, category_id: 6, name: "Rose Garden", description: "Hendrick's gin, lychee, rose water, St-Germain, elderflower foam", price: 695, image_url: null, tags: ["floral"], is_available: true, is_featured: false, is_vegetarian: true, is_vegan: false, spice_level: 0, is_special_today: false, special_note: null, created_at: "" },
  { id: 29, category_id: 6, name: "Kokum Daiquiri", description: "Havana Club 3yr, kokum shrub, cane syrup, lime, activated charcoal salt", price: 645, image_url: null, tags: ["tropical"], is_available: true, is_featured: false, is_vegetarian: true, is_vegan: false, spice_level: 0, is_special_today: false, special_note: null, created_at: "" },

  // Mocktails (category_id: 7)
  { id: 30, category_id: 7, name: "Virgin AmVa Sour", description: "Tamarind, curry leaf soda, ginger, lime, egg white foam", price: 395, image_url: null, tags: ["signature", "non-alcoholic"], is_available: true, is_featured: true, is_vegetarian: true, is_vegan: true, spice_level: 0, is_special_today: false, special_note: null, created_at: "" },
  { id: 31, category_id: 7, name: "Spiced Watermelon Cooler", description: "Fresh watermelon, jalapeño, mint, black salt, soda", price: 345, image_url: null, tags: ["refreshing", "non-alcoholic"], is_available: true, is_featured: false, is_vegetarian: true, is_vegan: true, spice_level: 1, is_special_today: false, special_note: null, created_at: "" },
  { id: 32, category_id: 7, name: "Turmeric Ginger Fizz", description: "Cold-pressed turmeric, ginger, lemon, honey, ginger beer", price: 345, image_url: null, tags: ["wellness", "non-alcoholic"], is_available: true, is_featured: false, is_vegetarian: true, is_vegan: true, spice_level: 0, is_special_today: false, special_note: null, created_at: "" },
  { id: 33, category_id: 7, name: "Mango Chilli Lemonade", description: "Alphonso mango purée, chilli, basil, lemon, sparkling water", price: 345, image_url: null, tags: ["tropical", "non-alcoholic"], is_available: true, is_featured: false, is_vegetarian: true, is_vegan: true, spice_level: 1, is_special_today: false, special_note: null, created_at: "" },

  // Wines & Spirits (category_id: 8)
  { id: 34, category_id: 8, name: "Sula Vineyards Rasa Cabernet Sauvignon", description: "Rich blackberry, spice finish — Nashik Valley", price: 595, image_url: null, tags: ["indian-wine", "red"], is_available: true, is_featured: false, is_vegetarian: true, is_vegan: false, spice_level: 0, is_special_today: false, special_note: null, created_at: "" },
  { id: 35, category_id: 8, name: "Grover Zampa Chardonnay", description: "Crisp citrus, light oak — Nandi Hills", price: 545, image_url: null, tags: ["indian-wine", "white"], is_available: true, is_featured: false, is_vegetarian: true, is_vegan: false, spice_level: 0, is_special_today: false, special_note: null, created_at: "" },
  { id: 36, category_id: 8, name: "Kingfisher Ultra Draught", description: "330ml | Chilled & fresh", price: 250, image_url: null, tags: ["beer"], is_available: true, is_featured: false, is_vegetarian: true, is_vegan: false, spice_level: 0, is_special_today: false, special_note: null, created_at: "" },
  { id: 37, category_id: 8, name: "Jack Daniel's — House Pour", description: "30ml | Tennessee whiskey", price: 450, image_url: null, tags: ["spirits"], is_available: true, is_featured: false, is_vegetarian: true, is_vegan: false, spice_level: 0, is_special_today: false, special_note: null, created_at: "" },
];

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

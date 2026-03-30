import Hero from "@/components/Hero";
import FeaturedMenu from "@/components/FeaturedMenu";
import AboutStrip from "@/components/AboutStrip";
import CocktailBanner from "@/components/CocktailBanner";
import LocationSection from "@/components/LocationSection";
import { supabase } from "@/lib/supabase";
import type { MenuItem, MenuCategory } from "@/lib/database.types";

async function getFeaturedItems(): Promise<
  (MenuItem & { menu_categories: MenuCategory })[]
> {
  try {
    const { data, error } = await supabase
      .from("menu_items")
      .select("*, menu_categories(*)")
      .eq("is_featured", true)
      .eq("is_available", true)
      .limit(6);

    if (error) throw error;
    return (data as (MenuItem & { menu_categories: MenuCategory })[]) ?? [];
  } catch {
    // Return placeholder data if Supabase is not yet connected
    return PLACEHOLDER_FEATURED;
  }
}

// Placeholder data for when Supabase is not yet connected
const PLACEHOLDER_FEATURED: (MenuItem & { menu_categories: MenuCategory })[] =
  [
    {
      id: 1,
      category_id: 1,
      name: "Hyderabadi Galouti Kebab",
      description:
        "Melt-in-your-mouth minced lamb patties with saffron & rose petal chutney",
      price: 495,
      image_url: null,
      tags: ["chef-special", "gluten-free"],
      is_available: true,
      is_featured: true,
      is_vegetarian: false,
      is_vegan: false,
      spice_level: 1,
      created_at: new Date().toISOString(),
      menu_categories: {
        id: 1,
        name: "Starters",
        slug: "starters",
        icon: "🥗",
        display_order: 1,
        created_at: new Date().toISOString(),
      },
    },
    {
      id: 2,
      category_id: 1,
      name: "Paneer Tikka 65",
      description:
        "Chargrilled cottage cheese in smoky spiced marinade, mint yoghurt dip",
      price: 395,
      image_url: null,
      tags: ["vegetarian", "chef-special"],
      is_available: true,
      is_featured: true,
      is_vegetarian: true,
      is_vegan: false,
      spice_level: 2,
      created_at: new Date().toISOString(),
      menu_categories: {
        id: 1,
        name: "Starters",
        slug: "starters",
        icon: "🥗",
        display_order: 1,
        created_at: new Date().toISOString(),
      },
    },
    {
      id: 9,
      category_id: 3,
      name: "Dum Ka Gosht",
      description:
        "Slow-cooked Hyderabadi lamb curry, caramelised onion, stone-flower spice",
      price: 695,
      image_url: null,
      tags: ["signature", "gluten-free"],
      is_available: true,
      is_featured: true,
      is_vegetarian: false,
      is_vegan: false,
      spice_level: 2,
      created_at: new Date().toISOString(),
      menu_categories: {
        id: 3,
        name: "Mains",
        slug: "mains",
        icon: "🍛",
        display_order: 3,
        created_at: new Date().toISOString(),
      },
    },
    {
      id: 15,
      category_id: 4,
      name: "Hyderabadi Dum Biryani — Mutton",
      description:
        "The original — aged basmati, whole spices, slow-steamed in sealed handi",
      price: 695,
      image_url: null,
      tags: ["signature", "bestseller"],
      is_available: true,
      is_featured: true,
      is_vegetarian: false,
      is_vegan: false,
      spice_level: 2,
      created_at: new Date().toISOString(),
      menu_categories: {
        id: 4,
        name: "Biryani & Rice",
        slug: "biryani-rice",
        icon: "🍚",
        display_order: 4,
        created_at: new Date().toISOString(),
      },
    },
    {
      id: 21,
      category_id: 5,
      name: "Double Ka Meetha",
      description:
        "Hyderabadi bread pudding, rose water, pistachios, silver leaf",
      price: 295,
      image_url: null,
      tags: ["signature", "vegetarian"],
      is_available: true,
      is_featured: true,
      is_vegetarian: true,
      is_vegan: false,
      spice_level: 0,
      created_at: new Date().toISOString(),
      menu_categories: {
        id: 5,
        name: "Desserts",
        slug: "desserts",
        icon: "🍮",
        display_order: 5,
        created_at: new Date().toISOString(),
      },
    },
    {
      id: 25,
      category_id: 6,
      name: "AmVa Sour",
      description:
        "Maker's Mark bourbon, fresh tamarind, curry leaf syrup, egg white, smoked chilli rim",
      price: 695,
      image_url: null,
      tags: ["signature", "bestseller"],
      is_available: true,
      is_featured: true,
      is_vegetarian: true,
      is_vegan: false,
      spice_level: 0,
      created_at: new Date().toISOString(),
      menu_categories: {
        id: 6,
        name: "Signature Cocktails",
        slug: "cocktails",
        icon: "🍹",
        display_order: 6,
        created_at: new Date().toISOString(),
      },
    },
  ];

export default async function HomePage() {
  const featuredItems = await getFeaturedItems();

  return (
    <>
      <Hero />
      <FeaturedMenu items={featuredItems} />
      <AboutStrip />
      <CocktailBanner />
      <LocationSection />
    </>
  );
}

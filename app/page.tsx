import Hero from "@/components/Hero";
import MarqueeStrip from "@/components/MarqueeStrip";
import AboutStrip from "@/components/AboutStrip";
import MenuShowcase from "@/components/MenuShowcase";
import CocktailBanner from "@/components/CocktailBanner";
import TodaysSpecials from "@/components/TodaysSpecials";
import FoundersSection from "@/components/FoundersSection";
import LocationSection from "@/components/LocationSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <MarqueeStrip />
      <AboutStrip />
      <MenuShowcase />
      <CocktailBanner />
      <TodaysSpecials />
      <FoundersSection />
      <LocationSection />
    </>
  );
}

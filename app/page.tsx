import Hero from "@/components/Hero";
import TodaysSpecials from "@/components/TodaysSpecials";
import MenuShowcase from "@/components/MenuShowcase";
import AboutStrip from "@/components/AboutStrip";
import FoundersSection from "@/components/FoundersSection";
import LocationSection from "@/components/LocationSection";

export default function HomePage() {
  return (
    <>
      <MenuShowcase />
      <Hero />
      <TodaysSpecials />
      <AboutStrip />
      <FoundersSection />
      <LocationSection />
    </>
  );
}

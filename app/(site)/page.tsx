import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import ServicesSection from "@/components/sections/ServicesSection";
import JourneySection from "@/components/sections/JourneySection";
import TherapistsSection from "@/components/sections/TherapistsSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import CTASection from "@/components/sections/CTASection";

export const metadata: Metadata = {
  title: "Serenity Wellness Spa | Melbourne's Premier Healing Sanctuary",
  description:
    "Find your stillness at Serenity — Melbourne's most serene wellness spa. Swedish massage, deep tissue, hot stone, aromatherapy, prenatal care and more in South Yarra.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesSection />
      <JourneySection />
      <TherapistsSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}

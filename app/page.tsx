import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import PopularDestinations from "@/components/home/PopularDestinations";
import BookingTimeline from "@/components/home/BookingTimeline";
import Testimonials from "@/components/home/Testimonials";
import Statistics from "@/components/home/Statistics";
import FAQ from "@/components/home/FAQ";
import CTABanner from "@/components/home/CTABanner";

export const metadata: Metadata = {
  title: "CoolTrips — Premium Flight Search & Travel Agency",
  description: "Search and compare flights with CoolTrips. Our travel experts personally book your ticket at the best price. Serving 85+ countries.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <WhyChooseUs />
      <PopularDestinations />
      <BookingTimeline />
      <Statistics />
      <Testimonials />
      <FAQ />
      <CTABanner />
    </>
  );
}

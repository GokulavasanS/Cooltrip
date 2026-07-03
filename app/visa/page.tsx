import type { Metadata } from "next";
import VisaHero from "@/components/visa/VisaHero";
import VisaChecker from "@/components/visa/VisaChecker";
import VisaCTA from "@/components/visa/VisaCTA";

export const metadata: Metadata = {
  title: "Visa Information & Checker",
  description:
    "Check visa requirements for your destination. Get expert visa assistance from CoolTrips for tourist, business, student, and work visas.",
  keywords: [
    "visa check",
    "visa requirements",
    "travel visa",
    "visa assistance",
    "visa on arrival",
    "cooltrips visa",
  ],
};

export default function VisaPage() {
  return (
    <>
      <VisaHero />
      <VisaChecker />
      <VisaCTA />
    </>
  );
}

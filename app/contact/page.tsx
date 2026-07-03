import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";
import BusinessHours from "@/components/contact/BusinessHours";
import MapEmbed from "@/components/contact/MapEmbed";
import FAQSnippet from "@/components/contact/FAQSnippet";
import WhatsAppButton from "@/components/contact/WhatsAppButton";
import EmergencySupport from "@/components/contact/EmergencySupport";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the CoolTrips team. We're available 24/7 on WhatsApp and respond to all enquiries within 30 minutes.",
};

export default function ContactPage() {
  return (
    <>
      <div className="min-h-screen gradient-hero pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="mb-12 text-center">
            <p className="text-[#4F8CFF] font-semibold text-sm uppercase tracking-widest mb-3">Contact</p>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">Let&apos;s plan your trip.</h1>
            <p className="text-gray-500 text-lg max-w-lg mx-auto">
              Our travel team responds within 30 minutes. Reach us via WhatsApp, email, or the form below.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column: Contact info, hours, map, emergency */}
            <div className="space-y-5">
              <ContactInfo />
              <BusinessHours />
              <MapEmbed />
              <EmergencySupport />
            </div>

            {/* Right column: Form + FAQ */}
            <div className="lg:col-span-2 space-y-5">
              <ContactForm />
              <FAQSnippet />
            </div>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp CTA */}
      <WhatsAppButton />
    </>
  );
}

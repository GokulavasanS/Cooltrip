"use client";

import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919876543210";
  const url = `https://wa.me/${number}?text=Hi%20CoolTrips!%20I%27d%20like%20to%20enquire%20about%20flights.`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 btn-whatsapp flex items-center gap-2.5 px-5 py-3 shadow-2xl"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-5 h-5" />
      <span className="font-semibold text-sm">Chat on WhatsApp</span>
    </a>
  );
}

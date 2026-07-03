"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const faqs = [
  { q: "How do I complete my booking?", a: "After submitting your details, our team contacts you via WhatsApp within 30 minutes to confirm payment and issue your ticket." },
  { q: "Is there any service fee?", a: "CoolTrips charges a minimal service fee of ₹299 per booking, which includes full travel assistance and 24/7 support." },
  { q: "Can I get a refund if I cancel?", a: "Refunds depend on the airline's fare rules. Our team will guide you through the cancellation process and any applicable refunds." },
  { q: "Do you assist with visa applications?", a: "Yes, we provide guidance and document checklists for visa applications to most popular destinations." },
];

export default function FAQSnippet() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="glass p-7">
      <h3 className="font-bold text-gray-900 mb-5">Quick Answers</h3>
      <div className="space-y-2">
        {faqs.map((f, i) => (
          <div key={i} className="border border-gray-100 rounded-2xl overflow-hidden">
            <button
              className="w-full flex justify-between items-center p-4 text-left gap-3"
              onClick={() => setOpen(open === i ? null : i)}
            >
              <span className="font-medium text-gray-900 text-sm">{f.q}</span>
              <ChevronDown className={`w-4 h-4 text-[#4F8CFF] shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="px-4 pb-4 text-gray-500 text-sm leading-relaxed">{f.a}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}

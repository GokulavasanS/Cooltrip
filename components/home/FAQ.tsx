"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { fadeUp, staggerContainer } from "@/utils/animation";

const faqs = [
  {
    q: "Is CoolTrips a ticket booking website?",
    a: "No. CoolTrips is a travel agency. You search and select your preferred flight, submit your details, and our expert team personally books the ticket for you. This ensures you get the best price and dedicated support.",
  },
  {
    q: "How long does it take to get my ticket after submitting a request?",
    a: "Our team responds within 30 minutes via WhatsApp. Most tickets are confirmed and issued within 2–4 hours, depending on the airline and your payment.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept UPI, NEFT/RTGS, credit/debit cards, and net banking. Our team will share secure payment details once they confirm your booking.",
  },
  {
    q: "Can I book for multiple passengers?",
    a: "Absolutely. You can specify the number of adults and children in the search form. Our team handles group bookings of any size.",
  },
  {
    q: "What if I need to cancel or change my flight?",
    a: "Contact us on WhatsApp or call our support line. We'll handle the cancellation or change request directly with the airline on your behalf. Refund policies depend on the airline's fare rules.",
  },
  {
    q: "Do you offer international flights?",
    a: "Yes! We cover 85+ countries and work with all major international airlines including Emirates, Qatar Airways, Singapore Airlines, and more.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="glass overflow-hidden">
      <button
        className="w-full flex items-center justify-between p-6 text-left gap-4"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="font-semibold text-gray-900 dark:text-white">{q}</span>
        <ChevronDown className={`w-5 h-5 text-[#4F8CFF] shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-6 pb-6 text-gray-500 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-100 dark:border-white/10 pt-4">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  return (
    <section className="py-24 bg-white dark:bg-gray-950">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="text-center mb-12"
        >
          <motion.p variants={fadeUp} className="text-[#4F8CFF] font-semibold text-sm uppercase tracking-widest mb-3">FAQ</motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">Common questions.</motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="space-y-3"
        >
          {faqs.map((f) => (
            <motion.div key={f.q} variants={fadeUp}>
              <FAQItem q={f.q} a={f.a} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

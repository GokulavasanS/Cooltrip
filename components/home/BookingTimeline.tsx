"use client";

import { motion } from "framer-motion";
import { Search, MousePointer, FileText, PhoneCall, CheckCircle } from "lucide-react";
import { fadeUp, staggerContainer } from "@/utils/animation";

const steps = [
  { icon: Search, title: "Search Flights", desc: "Enter your origin, destination, dates and passenger details." },
  { icon: MousePointer, title: "Choose a Flight", desc: "Compare prices, airlines, stops, and cabin classes side by side." },
  { icon: FileText, title: "Fill Passenger Details", desc: "Enter your name, contact, and travel preferences in seconds." },
  { icon: PhoneCall, title: "Agency Contacts You", desc: "Our travel expert reaches out via WhatsApp to confirm everything." },
  { icon: CheckCircle, title: "Ticket Confirmed", desc: "Your ticket is issued and sent to your email. Bon voyage! ✈" },
];

export default function BookingTimeline() {
  return (
    <section id="how-it-works" className="py-24 gradient-section">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.p variants={fadeUp} className="text-[#4F8CFF] font-semibold text-sm uppercase tracking-widest mb-3">
            How It Works
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-bold text-gray-900">
            Book in 5 simple steps.
          </motion.h2>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="space-y-4"
        >
          {steps.map((step, i) => (
            <motion.div key={step.title} variants={fadeUp} className="flex gap-5">
              {/* Connector column */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#4F8CFF] to-[#62D4E3] flex items-center justify-center shadow-lg shrink-0 z-10">
                  <step.icon className="w-5 h-5 text-white" />
                </div>
                {i < steps.length - 1 && (
                  <div className="w-0.5 flex-1 bg-gradient-to-b from-[#4F8CFF]/50 to-[#62D4E3]/30 mt-2 mb-0" />
                )}
              </div>
              {/* Content */}
              <div className="glass p-5 flex-1 mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-[#4F8CFF] bg-[#4F8CFF]/10 px-2 py-0.5 rounded-full">Step {i + 1}</span>
                </div>
                <h3 className="font-bold text-gray-900 text-lg">{step.title}</h3>
                <p className="text-gray-500 text-sm mt-1">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

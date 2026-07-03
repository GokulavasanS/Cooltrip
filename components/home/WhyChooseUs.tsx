"use client";

import { motion } from "framer-motion";
import { DollarSign, ShieldCheck, Zap, Headphones, Clock, User } from "lucide-react";
import { fadeUp, staggerContainer } from "@/utils/animation";

const features = [
  {
    icon: DollarSign,
    title: "Affordable Prices",
    desc: "We compare across hundreds of airlines to get you the best fare, every time.",
    color: "from-blue-500 to-cyan-400",
  },
  {
    icon: ShieldCheck,
    title: "Verified Airlines",
    desc: "Only IATA-certified airlines. Your safety and comfort is our top priority.",
    color: "from-emerald-500 to-teal-400",
  },
  {
    icon: Zap,
    title: "Fast Response",
    desc: "Our team responds within 30 minutes on WhatsApp, 7 days a week.",
    color: "from-amber-500 to-orange-400",
  },
  {
    icon: Headphones,
    title: "Travel Assistance",
    desc: "From visa guidance to seat selection, we assist at every step of your journey.",
    color: "from-purple-500 to-pink-400",
  },
  {
    icon: Clock,
    title: "24×7 Support",
    desc: "Round-the-clock travel support for emergencies, rebookings, and queries.",
    color: "from-rose-500 to-red-400",
  },
  {
    icon: User,
    title: "Personalised Service",
    desc: "Every booking is handled by a dedicated travel expert, not a chatbot.",
    color: "from-indigo-500 to-blue-400",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-24 gradient-section">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.p variants={fadeUp} className="text-[#4F8CFF] font-semibold text-sm uppercase tracking-widest mb-3">
            Why CoolTrips
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Travel smarter, not harder.
          </motion.h2>
          <motion.p variants={fadeUp} className="text-gray-500 text-lg max-w-xl mx-auto">
            We combine technology with human expertise to deliver a travel experience that feels effortless.
          </motion.p>
        </motion.div>

        {/* Feature grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              className="glass p-7 hover-lift group cursor-default"
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                <f.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

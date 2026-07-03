"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { fadeUp, staggerContainer } from "@/utils/animation";

const testimonials = [
  {
    name: "Priya Sharma",
    location: "Chennai → Dubai",
    rating: 5,
    text: "CoolTrips found me a flight ₹8,000 cheaper than what I found on my own. The WhatsApp confirmation was so quick!",
    avatar: "PS",
    color: "from-blue-500 to-cyan-400",
  },
  {
    name: "Rajesh Kumar",
    location: "Bengaluru → Singapore",
    rating: 5,
    text: "I was hesitant about a travel agency at first, but their team was incredibly responsive. Ticket in hand within 2 hours.",
    avatar: "RK",
    color: "from-purple-500 to-pink-400",
  },
  {
    name: "Ananya Iyer",
    location: "Mumbai → London",
    rating: 5,
    text: "The personalized service is what sets CoolTrips apart. They even reminded me about my check-in. Exceptional!",
    avatar: "AI",
    color: "from-emerald-500 to-teal-400",
  },
  {
    name: "Karthik Venkat",
    location: "Hyderabad → Maldives",
    rating: 5,
    text: "Best travel agency I've used. Affordable prices and a team that actually cares. Booked through them 3 times now.",
    avatar: "KV",
    color: "from-amber-500 to-orange-400",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="text-center mb-14"
        >
          <motion.p variants={fadeUp} className="text-[#4F8CFF] font-semibold text-sm uppercase tracking-widest mb-3">
            Testimonials
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-bold text-gray-900">
            Loved by travelers across India.
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {testimonials.map((t) => (
            <motion.div key={t.name} variants={fadeUp} className="glass p-6 hover-lift flex flex-col gap-4">
              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              {/* Text */}
              <p className="text-gray-600 text-sm leading-relaxed flex-1">&quot;{t.text}&quot;</p>
              {/* Author */}
              <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                  <div className="text-gray-400 text-xs">{t.location}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Globe, Clock, FileText } from "lucide-react";
import { fadeUp, staggerContainer } from "@/utils/animation";

const features = [
  { icon: ShieldCheck, label: "Visa Guidance", desc: "Expert assistance for all visa types" },
  { icon: Globe, label: "Global Coverage", desc: "85+ countries & destinations" },
  { icon: Clock, label: "Quick Processing", desc: "Hassle-free document support" },
];

export default function VisaHero() {
  return (
    <section className="relative min-h-[70vh] gradient-hero overflow-hidden flex items-center pt-24">
      {/* Blobs */}
      <div className="blob blob-blue blob-animate w-[500px] h-[500px] -top-40 -right-24 opacity-40" />
      <div
        className="blob blob-cyan blob-animate w-[350px] h-[350px] bottom-0 -left-24 opacity-30"
        style={{ animationDelay: "2s" }}
      />

      <div className="max-w-7xl mx-auto px-6 py-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="z-10"
          >
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6 text-sm font-medium text-accent"
            >
              <FileText className="w-4 h-4" />
              Visa Services
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-5xl md:text-6xl font-bold leading-[1.1] text-gray-900 dark:text-white mb-5"
            >
              Simplifying
              <br />
              <span className="gradient-text">Global Travel</span>
              <br />
              One Visa at a Time
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed mb-8 max-w-lg"
            >
              Check visa requirements instantly and get expert guidance for a smooth journey to your dream destination.
            </motion.p>

            {/* Features */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-5">
              {features.map((f) => (
                <div key={f.label} className="flex items-center gap-2.5 glass px-4 py-3">
                  <f.icon className="w-5 h-5 text-accent shrink-0" />
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white text-sm">{f.label}</div>
                    <div className="text-gray-400 dark:text-gray-500 text-xs">{f.desc}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.15 }}
            className="relative z-10 hidden lg:block"
          >
            <div className="glass p-8">
              <div className="flex items-center gap-4 mb-6">
                <FileText className="w-8 h-8 text-accent" />
                <div>
                  <div className="font-bold text-gray-900 dark:text-white text-lg">Quick Visa Check</div>
                  <div className="text-gray-400 dark:text-gray-500 text-sm">Find requirements in seconds</div>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { label: "Tourist Visa", time: "3–15 days" },
                  { label: "Business Visa", time: "5–20 days" },
                  { label: "Student Visa", time: "15–45 days" },
                  { label: "Transit Visa", time: "1–7 days" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-white/10 last:border-0"
                  >
                    <span className="text-sm text-gray-600 dark:text-gray-300">{item.label}</span>
                    <span className="text-xs font-semibold text-accent bg-accent/10 px-2.5 py-0.5 rounded-full">
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

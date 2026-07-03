"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Plane } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { fadeUp, staggerContainer } from "@/utils/animation";

export default function CTABanner() {
  return (
    <section className="py-24 gradient-section">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="gradient-cta rounded-3xl p-14 text-center relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Plane className="w-4 h-4" />
              Start Your Journey Today
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-bold text-white mb-4">
              Ready to find your<br />perfect flight?
            </motion.h2>
            <motion.p variants={fadeUp} className="text-white/80 text-lg mb-10 max-w-xl mx-auto">
              Search thousands of flights and let our travel experts handle the booking. No hidden fees, no hassle.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4 justify-center">
              <Link
                href={ROUTES.flights}
                className="bg-white text-[#4F8CFF] font-bold px-8 py-4 rounded-2xl hover:bg-gray-50 transition-all flex items-center gap-2 hover:scale-105 shadow-xl"
              >
                Search Flights Now
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href={ROUTES.contact}
                className="bg-white/20 backdrop-blur text-white font-semibold px-8 py-4 rounded-2xl hover:bg-white/30 transition-all border border-white/30"
              >
                Talk to an Expert
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

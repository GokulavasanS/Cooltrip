"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock, Plane, Users } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { fadeUp, staggerContainer } from "@/utils/animation";
import HeroSearchForm from "./HeroSearchForm";

const stats = [
  { icon: Users, label: "Happy Travelers", value: "50K+" },
  { icon: MapPin, label: "Destinations", value: "120+" },
  { icon: Plane, label: "Airline Partners", value: "500+" },
  { icon: Clock, label: "Support", value: "24/7" },
];

const airlines = ["IndiGo", "Air India", "Vistara", "Emirates", "Qatar", "Lufthansa"];

export default function Hero() {
  return (
    <section className="relative min-h-screen gradient-hero overflow-hidden flex items-center">
      {/* Background blobs */}
      <div className="blob blob-blue blob-animate w-[600px] h-[600px] -top-32 -right-32 opacity-50" />
      <div
        className="blob blob-cyan blob-animate w-[400px] h-[400px] bottom-0 -left-20 opacity-40"
        style={{ animationDelay: "2s" }}
      />

      <div className="max-w-7xl mx-auto px-6 pt-24 pb-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* ── Left column ── */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="z-10"
          >
            {/* ── SVG Flight Path ── */}
            <motion.div
  variants={fadeUp}
  className="relative h-[125px] w-full max-w-[520px] mb-4 -ml-2 pointer-events-none select-none"
>
  <svg
    viewBox="0 0 620 125"
    className="w-full h-full overflow-visible"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <filter id="planeShadow">
        <feDropShadow
          dx="0"
          dy="3"
          stdDeviation="4"
          floodOpacity="0.18"
        />
      </filter>
    </defs>

    {/* Flight Path */}
    <path
      id="flightPath"
      d="
      M15 78
      C55 55 95 55 135 74
      S215 104 255 74
      S335 44 385 72
      C425 95 450 40 470 18
      C490 5 525 18 510 45
      C495 70 455 60 470 25
      C485 -10 545 40 600 24
      "
      fill="none"
      stroke="#4F8CFF"
      strokeWidth="2"
      strokeDasharray="6 10"
      strokeLinecap="round"
      opacity=".75"
    />

    {/* Small starting plane */}
    <g transform="translate(12 68) rotate(50)">
      <svg width="18" height="18" viewBox="0 0 24 24">
        <path
          fill="#4F8CFF"
          d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0011.5 2A1.5 1.5 0 0010 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5L21 16z"
          opacity=".55"
        />
      </svg>
    </g>

    {/* Animated Plane */}
    <g filter="url(#planeShadow)">
      <animateMotion
        dur="7s"
        repeatCount="indefinite"
        rotate="auto"
        keyPoints="0;1"
        keyTimes="0;1"
      >
        <mpath href="#flightPath" />
      </animateMotion>

      <g transform="translate(-13 -13) rotate(90 15 12)">
        <svg width="30" height="35" viewBox="0 0 20 24">
          <path
            fill="#4F8CFF"
            d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0011.5 2A1.5 1.5 0 0010 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5L21 16z"
          />
        </svg>
      </g>
    </g>
  </svg>
</motion.div>

            {/* Badge */}
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6 text-sm font-medium text-[#4F8CFF]"
            >
              <span className="w-2 h-2 bg-[#4F8CFF] rounded-full animate-pulse" />
              India&apos;s Premium Travel Partner
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              className="text-5xl md:text-6xl font-bold leading-[1.1] text-gray-900 dark:text-white mb-5"
            >
              Your Journey
              <br />
              Begins With
              <br />
              <span className="gradient-text">Better Travel.</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-gray-500 text-lg leading-relaxed mb-8 max-w-md">
              Find the best flights, explore amazing destinations, and let our travel experts handle the rest.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4 mb-10">
              <Link
                href={ROUTES.flights}
                className="btn-primary flex items-center gap-2 px-7 py-3.5 text-base"
              >
                Search Flights <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#destinations"
                className="btn-secondary flex items-center gap-2 px-7 py-3.5 text-base"
              >
                Explore Destinations
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-6 mb-8">
              {stats.map((s) => (
                <div key={s.label} className="flex items-center gap-2">
                  <s.icon className="w-4 h-4 text-[#4F8CFF]" />
                  <span className="font-bold text-gray-900 dark:text-white text-sm">{s.value}</span>
                  <span className="text-gray-400 text-sm">{s.label}</span>
                </div>
              ))}
            </motion.div>

            {/* Airline logos strip */}
            <motion.div variants={fadeUp}>
              <p className="text-gray-400 text-xs uppercase tracking-widest mb-3 font-semibold">
                Trusted by passengers on
              </p>
              <div className="flex flex-wrap gap-3">
                {airlines.map((name) => (
                  <span
                    key={name}
                    className="px-3 py-1.5 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-lg text-xs font-semibold text-gray-600 dark:text-gray-300 shadow-sm"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* ── Right column ── */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.15 }}
            className="relative z-10 hidden lg:block"
          >
            {/* Hero image */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/40 mb-[-60px]">
              <Image
                src="/hero-travel.png"
                alt="Travel the world with CoolTrips"
                width={660}
                height={380}
                className="object-cover w-full"
                priority
              />
              {/* Overlay for readability */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
            </div>

            {/* Search form card — overlapping the image bottom */}
            <div className="relative z-10 mx-4">
              <HeroSearchForm />
            </div>
          </motion.div>
        </div>

        {/* Mobile: search form below hero content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 lg:hidden"
        >
          <HeroSearchForm />
        </motion.div> 
      </div>
    </section>
  );
}

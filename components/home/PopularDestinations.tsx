"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { fadeUp, staggerContainer } from "@/utils/animation";
import { ROUTES } from "@/constants/routes";
import { formatINR } from "@/utils/currency";

const destinations = [
  {
    name: "Dubai",
    country: "UAE",
    code: "DXB",
    img: "/dest-dubai.png",
    from: 24999,
    tag: "Most Popular",
  },
  {
    name: "Singapore",
    country: "Singapore",
    code: "SIN",
    img: "/dest-singapore.png",
    from: 29999,
    tag: "Best Value",
  },
  {
    name: "Bali",
    country: "Indonesia",
    code: "DPS",
    img: "/dest-bali.png",
    from: 33999,
    tag: "Trending",
  },
  {
    name: "London",
    country: "United Kingdom",
    code: "LHR",
    img: "/dest-london.png",
    from: 59999,
    tag: "Europe",
  },
  {
    name: "Paris",
    country: "France",
    code: "CDG",
    img: "/dest-paris.png",
    from: 57999,
    tag: "Romance",
  },
  {
    name: "Tokyo",
    country: "Japan",
    code: "NRT",
    img: "/dest-tokyo.png",
    from: 49999,
    tag: "Asia",
  },
  {
    name: "Maldives",
    country: "Maldives",
    code: "MLE",
    img: "/dest-maldives.png",
    from: 19999,
    tag: "Beach",
  },
];

export default function PopularDestinations() {
  return (
    <section id="destinations" className="py-24 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4"
        >
          <div>
            <motion.p variants={fadeUp} className="text-[#4F8CFF] font-semibold text-sm uppercase tracking-widest mb-3">
              Popular Destinations
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Where will you go next?
            </motion.h2>
          </div>
          <motion.div variants={fadeUp}>
            <Link href={ROUTES.flights} className="btn-secondary flex items-center gap-2 text-sm">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </motion.div>

        {/* ── Bento Grid ── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-4 grid-rows-[auto] gap-4"
        >
          {/* [1] Hero card — Dubai — spans 2 cols × 2 rows */}
          <motion.div variants={fadeUp} className="col-span-2 row-span-2">
            <BentoCard d={destinations[0]} className="h-[420px]" />
          </motion.div>

          {/* [2] Singapore — tall right */}
          <motion.div variants={fadeUp} className="col-span-1 row-span-1">
            <BentoCard d={destinations[1]} className="h-[200px]" />
          </motion.div>

          {/* [3] Bali — tall right */}
          <motion.div variants={fadeUp} className="col-span-1 row-span-1">
            <BentoCard d={destinations[2]} className="h-[200px]" />
          </motion.div>

          {/* [4] London — wide bottom-right (spans 2 cols) */}
          <motion.div variants={fadeUp} className="col-span-2 row-span-1">
            <BentoCard d={destinations[3]} className="h-[200px]" wide />
          </motion.div>

          {/* [5] Paris — narrow */}
          <motion.div variants={fadeUp} className="col-span-1 row-span-1">
            <BentoCard d={destinations[4]} className="h-[200px]" />
          </motion.div>

          {/* [6] Tokyo — narrow */}
          <motion.div variants={fadeUp} className="col-span-1 row-span-1">
            <BentoCard d={destinations[5]} className="h-[200px]" />
          </motion.div>

          {/* [7] Maldives — spans 2 cols wide */}
          <motion.div variants={fadeUp} className="col-span-2 row-span-1">
            <BentoCard d={destinations[6]} className="h-[200px]" wide />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function BentoCard({
  d,
  className = "",
  wide = false,
}: {
  d: (typeof destinations)[0];
  className?: string;
  wide?: boolean;
}) {
  return (
    <Link href={ROUTES.flights} className="block group h-full">
      <div className={`relative overflow-hidden rounded-3xl w-full hover-lift ${className}`}>
        <Image
          src={d.img}
          alt={d.name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />

        {/* Tag badge */}
        {d.tag && (
          <div className="absolute top-4 left-4">
            <span className="px-2.5 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider rounded-full border border-white/30">
              {d.tag}
            </span>
          </div>
        )}

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="flex items-end justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-white/80 text-xs mb-1">
                <MapPin className="w-3 h-3 shrink-0" />
                <span className="truncate">{d.country}</span>
              </div>
              <h3 className={`text-white font-bold leading-tight ${wide ? "text-2xl" : "text-xl"}`}>
                {d.name}
              </h3>
            </div>
            <div className="text-right shrink-0">
              <div className="text-white/70 text-[10px] uppercase tracking-wider">From</div>
              <div className={`text-white font-bold ${wide ? "text-lg" : "text-base"}`}>
                {formatINR(d.from)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

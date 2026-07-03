"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { fadeUp, staggerContainer } from "@/utils/animation";
import { ROUTES } from "@/constants/routes";
import { formatINR } from "@/utils/currency";

const destinations = [
  { name: "Dubai", country: "UAE", code: "DXB", img: "/dest-dubai.png", from: 18500 },
  { name: "Singapore", country: "Singapore", code: "SIN", img: "/dest-singapore.png", from: 14200 },
  { name: "Bali", country: "Indonesia", code: "DPS", img: "/dest-bali.png", from: 12800 },
  { name: "London", country: "United Kingdom", code: "LHR", img: "/dest-london.png", from: 42000 },
  { name: "Paris", country: "France", code: "CDG", img: "/dest-paris.png", from: 38500 },
  { name: "Tokyo", country: "Japan", code: "NRT", img: "/dest-tokyo.png", from: 36000 },
  { name: "Maldives", country: "Maldives", code: "MLE", img: "/dest-maldives.png", from: 9800 },
];

export default function PopularDestinations() {
  return (
    <section className="py-24 bg-white">
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
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-bold text-gray-900">
              Where will you go next?
            </motion.h2>
          </div>
          <motion.div variants={fadeUp}>
            <Link href={ROUTES.flights} className="btn-secondary flex items-center gap-2 text-sm">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Destination cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {/* Large featured card */}
          <motion.div variants={fadeUp} className="sm:col-span-2 row-span-2">
            <DestCard d={destinations[0]} large />
          </motion.div>
          {/* Regular cards */}
          {destinations.slice(1, 4).map((d) => (
            <motion.div key={d.code} variants={fadeUp}>
              <DestCard d={d} />
            </motion.div>
          ))}
          {/* Wide card */}
          <motion.div variants={fadeUp} className="sm:col-span-2">
            <DestCard d={destinations[4]} wide />
          </motion.div>
          {destinations.slice(5).map((d) => (
            <motion.div key={d.code} variants={fadeUp}>
              <DestCard d={d} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function DestCard({ d, large, wide }: { d: typeof destinations[0]; large?: boolean; wide?: boolean }) {
  return (
    <Link href={ROUTES.flights} className="block group">
      <div className={`relative overflow-hidden rounded-3xl ${large ? "h-[420px]" : wide ? "h-48" : "h-52"} hover-lift`}>
        <Image
          src={d.img}
          alt={d.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-white/80 text-xs mb-1">
                <MapPin className="w-3 h-3" />
                {d.country}
              </div>
              <h3 className="text-white font-bold text-xl">{d.name}</h3>
            </div>
            <div className="text-right">
              <div className="text-white/70 text-xs">From</div>
              <div className="text-white font-bold text-base">{formatINR(d.from)}</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

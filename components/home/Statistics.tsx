"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/utils/animation";

const stats = [
  { label: "Flights Assisted", value: 12000, suffix: "+" },
  { label: "Happy Travelers", value: 50000, suffix: "+" },
  { label: "Countries Covered", value: 85, suffix: "+" },
  { label: "Support Rating", value: 4.9, suffix: "/5", decimal: true },
];

function Counter({ target, suffix, decimal }: { target: number; suffix: string; decimal?: boolean }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1800;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current = Math.min(current + increment, target);
            setCount(decimal ? Math.round(current * 10) / 10 : Math.floor(current));
            if (current >= target) clearInterval(timer);
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, decimal]);

  return (
    <div ref={ref} className="text-5xl font-bold gradient-text">
      {decimal ? count.toFixed(1) : count.toLocaleString("en-IN")}
      {suffix}
    </div>
  );
}

export default function Statistics() {
  return (
    <section className="py-24 gradient-cta relative overflow-hidden">
      {/* Subtle overlay pattern */}
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }}
      />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center"
        >
          {stats.map((s) => (
            <motion.div key={s.label} variants={fadeUp} className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-3xl p-8">
              <Counter target={s.value} suffix={s.suffix} decimal={s.decimal} />
              <div className="text-white/80 text-sm font-medium mt-2">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

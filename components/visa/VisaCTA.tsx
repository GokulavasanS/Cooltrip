"use client";

import { motion } from "framer-motion";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { fadeUp } from "@/utils/animation";

const COMPANY_EMAIL = "reservation@cooltrip.org | visa@cooltrip.org";

export default function VisaCTA() {
  const handleEmail = () => {
    const subject = encodeURIComponent("Visa Assistance Enquiry");
    const body = encodeURIComponent(
      "Hi CoolTrips,\n\nI'd like to get more information about visa assistance. Please contact me with the available options.\n\nThanks!"
    );
    window.open(`mailto:${COMPANY_EMAIL}?subject=${subject}&body=${body}`, "_blank");
  };

  return (
    <section className="py-24 gradient-section">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12 } },
          }}
        >
          <motion.p
            variants={fadeUp}
            className="text-accent font-semibold text-sm uppercase tracking-widest mb-3"
          >
            Need Help?
          </motion.p>

          <motion.h2
            variants={fadeUp}
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Get in Touch with Our Visa Experts
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto mb-10"
          >
            Not sure about the visa process? Our team is here to help you every step of the way.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="flex flex-wrap justify-center gap-4"
          >
            <button
              onClick={handleEmail}
              className="btn-primary flex items-center gap-2.5 px-7 py-3.5 text-base"
            >
              <Mail className="w-5 h-5" />
              Enquire via Email
            </button>
            <a
              href="tel:+919876543210"
              className="btn-secondary flex items-center gap-2.5 px-7 py-3.5 text-base"
            >
              <Phone className="w-5 h-5" />
              Call Us Now
            </a>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-400 dark:text-gray-500"
          >
            <span className="flex items-center gap-1.5">
              <Mail className="w-4 h-4" /> {COMPANY_EMAIL}
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="w-4 h-4" /> +91 98765 43210
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, Plane, ArrowRight, Clock } from "lucide-react";
import { useFlightStore } from "@/store/flightStore";
import { useUIStore } from "@/store/uiStore";
import { formatINR } from "@/utils/currency";
import { formatDate } from "@/utils/date";
import { formatDuration, stopsLabel } from "@/utils/time";
import { Flight } from "@/types/flight";

// Map destination codes to available local images
const DEST_IMAGES: Record<string, string> = {
  DXB: "/dest-dubai.png",
  SIN: "/dest-singapore.png",
  DPS: "/dest-bali.png",
  LHR: "/dest-london.png",
  CDG: "/dest-paris.png",
  NRT: "/dest-tokyo.png",
  HND: "/dest-tokyo.png",
  MLE: "/dest-maldives.png",
};
const DEFAULT_IMG = "/hero-travel.png";

export default function SelectionPanel() {
  const { selectedFlight, setSelectedFlight } = useFlightStore();
  const { openPassengerModal } = useUIStore();

  return (
    <AnimatePresence>
      {selectedFlight && (
        <motion.aside
          key="selection-panel"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 24 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-72 shrink-0 sticky top-24 h-fit self-start"
        >
          <PanelCard
            flight={selectedFlight}
            onClose={() => setSelectedFlight(null)}
            onContinue={openPassengerModal}
          />
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

function PanelCard({
  flight: f,
  onClose,
  onContinue,
}: {
  flight: Flight;
  onClose: () => void;
  onContinue: () => void;
}) {
  const destImg = DEST_IMAGES[f.destinationCode] ?? DEFAULT_IMG;
  const baseFare = f.baseFare ?? Math.round(f.fare * 0.852);
  const taxes = f.taxes ?? (f.fare - baseFare);

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <span className="font-bold text-gray-900 text-base">Your Selection</span>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          aria-label="Clear selection"
        >
          <X className="w-3.5 h-3.5 text-gray-500" />
        </button>
      </div>

      {/* Destination image */}
      <div className="relative h-36">
        <Image src={destImg} alt={f.destination} fill sizes="288px" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4 flex items-center gap-2 text-white">
          <span className="font-bold text-sm">{f.originCode}</span>
          <ArrowRight className="w-3.5 h-3.5 shrink-0" />
          <span className="font-bold text-sm">{f.destinationCode}</span>
        </div>
      </div>

      <div className="p-5">
        {/* Airline row */}
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
          <div className="w-9 h-9 rounded-xl bg-[#4F8CFF]/10 flex items-center justify-center shrink-0">
            <Plane className="w-4 h-4 text-[#4F8CFF]" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">{f.airline}</p>
            <p className="text-gray-400 text-xs">{f.flightNumber}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs text-gray-400">{formatDate(f.departureDate)}</p>
            <p className="text-xs text-gray-400">{f.cabin}</p>
          </div>
        </div>

        {/* Route row */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="font-bold text-gray-900 text-2xl leading-none">{f.departureTime}</p>
            <p className="text-gray-400 text-xs mt-1">{f.originCode}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-1 text-gray-400 text-xs justify-center">
              <Clock className="w-3 h-3" />
              {formatDuration(f.durationMinutes)}
            </div>
            <div className="h-px w-16 bg-gray-200 my-1 mx-auto" />
            <p className="text-gray-400 text-xs">{stopsLabel(f.stops)}</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-gray-900 text-2xl leading-none">{f.arrivalTime}</p>
            <p className="text-gray-400 text-xs mt-1">{f.destinationCode}</p>
          </div>
        </div>

        {/* Price summary */}
        <div className="bg-gray-50 rounded-2xl p-4 mb-4">
          <p className="font-semibold text-gray-900 text-sm mb-3">Price Summary</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Base Fare</span>
              <span className="font-medium text-gray-900">{formatINR(baseFare)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Taxes &amp; Fees</span>
              <span className="font-medium text-gray-900">{formatINR(taxes)}</span>
            </div>
            <div className="flex justify-between font-bold border-t border-gray-200 pt-2 mt-2">
              <span className="text-gray-900">Total</span>
              <span className="text-[#4F8CFF] text-base">{formatINR(f.fare)}</span>
            </div>
          </div>
          <p className="text-gray-400 text-xs text-right mt-1">per person</p>
        </div>

        {/* CTA */}
        <button
          onClick={onContinue}
          className="btn-primary w-full py-3 flex items-center justify-center gap-2 text-sm"
        >
          Continue to Passenger Details
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

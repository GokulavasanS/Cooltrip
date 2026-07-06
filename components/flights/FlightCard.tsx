"use client";

import { motion } from "framer-motion";
import { Plane, Clock, CheckCircle } from "lucide-react";
import { Flight } from "@/types/flight";
import { formatINR } from "@/utils/currency";
import { formatDuration, stopsLabel } from "@/utils/time";
import { stopsColor } from "@/utils/flight";
import { useFlightStore } from "@/store/flightStore";
import { useUIStore } from "@/store/uiStore";
import { fadeUp } from "@/utils/animation";

interface FlightCardProps {
  flight: Flight;
}

export default function FlightCard({ flight }: FlightCardProps) {
  const { setSelectedFlight } = useFlightStore();
  const { openPassengerModal } = useUIStore();

  const handleSelect = () => {
    setSelectedFlight(flight);
    openPassengerModal();
  };

  return (
    <motion.div
      variants={fadeUp}
      className="glass p-5 md:p-6 hover-lift group"
    >
      <div className="flex flex-col md:flex-row md:items-center gap-5">
        {/* Airline */}
        <div className="flex items-center gap-3 md:w-36 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4F8CFF]/20 to-[#62D4E3]/20 flex items-center justify-center">
            <Plane className="w-5 h-5 text-[#4F8CFF]" />
          </div>
          <div>
            <div className="font-semibold text-gray-900 dark:text-white text-sm">{flight.airline}</div>
            <div className="text-gray-400 dark:text-gray-500 text-xs">{flight.flightNumber}</div>
          </div>
        </div>

        {/* Route & Time */}
        <div className="flex-1 flex items-center gap-4">
          {/* Departure */}
          <div className="text-center">
            <div className="font-bold text-gray-900 dark:text-white text-xl">{flight.departureTime}</div>
            <div className="text-gray-400 dark:text-gray-500 text-xs font-medium">{flight.originCode}</div>
          </div>

          {/* Duration line */}
          <div className="flex-1 flex flex-col items-center gap-1 min-w-0">
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${stopsColor(flight.stops)}`}>
              {stopsLabel(flight.stops)}
            </span>
            <div className="w-full flex items-center gap-1">
              <div className="h-px flex-1 bg-gray-200 dark:bg-white/10" />
              <Plane className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600 rotate-90" />
              <div className="h-px flex-1 bg-gray-200 dark:bg-white/10" />
            </div>
            <div className="flex items-center gap-1 text-gray-400 dark:text-gray-500 text-xs">
              <Clock className="w-3 h-3" />
              {formatDuration(flight.durationMinutes)}
            </div>
          </div>

          {/* Arrival */}
          <div className="text-center">
            <div className="font-bold text-gray-900 dark:text-white text-xl">{flight.arrivalTime}</div>
            <div className="text-gray-400 dark:text-gray-500 text-xs font-medium">{flight.destinationCode}</div>
          </div>
        </div>

        {/* Cabin & Refundable */}
        <div className="flex flex-row md:flex-col items-center md:items-end gap-3 md:gap-1">
          <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/10 px-2.5 py-1 rounded-lg font-medium">
            {flight.cabin}
          </span>
          {flight.refundable && (
            <span className="flex items-center gap-1 text-green-600 dark:text-green-400 text-xs font-medium">
              <CheckCircle className="w-3.5 h-3.5" /> Refundable
            </span>
          )}
          {flight.seatsLeft <= 5 && (
            <span className="text-amber-600 dark:text-amber-400 text-xs font-medium">
              {flight.seatsLeft} seats left
            </span>
          )}
        </div>

        {/* Price & CTA */}
        <div className="flex md:flex-col items-center md:items-end gap-4 md:gap-2 md:pl-4 md:border-l md:border-gray-100 dark:md:border-white/10">
          <div className="text-right">
            <div className="font-bold text-gray-900 dark:text-white text-2xl">{formatINR(flight.fare)}</div>
            <div className="text-gray-400 dark:text-gray-500 text-xs">per person</div>
          </div>
          <button
            onClick={handleSelect}
            className="btn-primary text-sm px-5 py-2.5 whitespace-nowrap"
          >
            Select Flight
          </button>
        </div>
      </div>
    </motion.div>
  );
}

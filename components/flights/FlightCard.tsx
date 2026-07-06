"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, Clock, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Flight } from "@/types/flight";
import { formatINR } from "@/utils/currency";
import { formatDuration, stopsLabel } from "@/utils/time";
import { stopsColor } from "@/utils/flight";
import { useFlightStore } from "@/store/flightStore";
import { useUIStore } from "@/store/uiStore";
import { fadeUp } from "@/utils/animation";
import { flightService } from "@/services/api/flight";

interface FlightCardProps {
  flight: Flight;
}

export default function FlightCard({ flight }: FlightCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const { selectFlightForLeg, currentLegIndex, searchLegs, setIsSearching, setResults, setSearchError } = useFlightStore();
  const { openPassengerModal } = useUIStore();

  const handleSelect = async () => {
    selectFlightForLeg(flight);
    
    // The store advances the index. We get the fresh state to check if we need to search.
    const state = useFlightStore.getState();
    
    if (state.currentLegIndex > currentLegIndex && state.currentLegIndex < state.searchLegs.length) {
      // Fetch next leg
      state.setIsSearching(true);
      try {
        const { flights, error } = await flightService.search(state.searchLegs[state.currentLegIndex]);
        state.setResults(flights);
        state.setSearchError(error);
      } catch (err) {
        state.setSearchError("Error searching next leg.");
      } finally {
        state.setIsSearching(false);
      }
    }
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
          <div className="text-right flex-1 md:flex-none">
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

      {/* View Details Toggle */}
      <button 
        onClick={() => setShowDetails(!showDetails)}
        className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#4F8CFF] hover:text-[#3a7aee] transition-colors"
      >
        {showDetails ? "Hide Details" : "View Details"}
        {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {/* Expanded Details */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/10 flex flex-col gap-4">
              {flight.segments?.map((seg, i) => (
                <div key={i} className="flex gap-4 items-start relative">
                  {/* Timeline line */}
                  {i < flight.segments.length - 1 && (
                    <div className="absolute left-[15px] top-8 bottom-[-24px] w-0.5 bg-gray-200 dark:bg-white/10" />
                  )}
                  
                  <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-white/10 flex items-center justify-center shrink-0 z-10">
                    <Plane className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                  </div>
                  
                  <div className="flex-1 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white text-sm">{seg.airline}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{seg.flightNumber} • {seg.cabin}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-xs font-medium">
                          <Clock className="w-3 h-3" />
                          {formatDuration(seg.durationMinutes)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-3">
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white text-base">{seg.departureTime}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{seg.originCode}</p>
                      </div>
                      <div className="flex-1 border-t border-dashed border-gray-300 dark:border-gray-600" />
                      <div className="text-right">
                        <p className="font-bold text-gray-900 dark:text-white text-base">{seg.arrivalTime}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{seg.destinationCode}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Detailed Fare Breakdown */}
              <div className="mt-2 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-sm mb-1">Fare Breakdown</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Base: {formatINR(flight.baseFare ?? 0)} • Taxes: {formatINR(flight.taxes ?? 0)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Price</p>
                  <p className="font-bold text-[#4F8CFF] text-lg">{formatINR(flight.fare)}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, PlaneTakeoff } from "lucide-react";
import { useFlightStore } from "@/store/flightStore";
import { SortOption } from "@/types/flight";
import FlightCard from "./FlightCard";
import FlightSortBar from "./FlightSortBar";
import FlightFilters from "./FlightFilters";
import LoadingSkeleton from "@/components/shared/LoadingSkeleton";
import EmptyState from "@/components/shared/EmptyState";
import { sortFlights } from "@/utils/price";
import { filterFlights } from "@/utils/flight";
import { formatDateShort } from "@/utils/date";
import { staggerContainer } from "@/utils/animation";

export default function FlightResults() {
  const { results, isSearching, searchParams, searchError, searchLegs, currentLegIndex } = useFlightStore();
  const [sort, setSort] = useState<SortOption>("cheapest");
  const [filters, setFilters] = useState({
    maxPrice: 999999,
    stops: null as number | null,
    cabin: null as string | null,
    refundable: false,
    airlines: [] as string[],
  });

  const displayed = useMemo(() => {
    const filtered = filterFlights(results, filters);
    return sortFlights(filtered, sort);
  }, [results, filters, sort]);

  if (!searchParams) return null;

  return (
    <div className="mt-8">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar filters */}
        <div className="lg:w-64 shrink-0">
          <FlightFilters onFilterChange={setFilters} />
        </div>

        {/* Results */}
        <div className="flex-1">
          {isSearching ? (
            <LoadingSkeleton />
          ) : searchError ? (
            /* ── API error / no flights banner ───────────────────────── */
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center text-center py-16 px-6 bg-white dark:bg-gray-900 rounded-2xl border border-orange-100 dark:border-orange-900/50 shadow-sm"
            >
              <div className="w-16 h-16 rounded-2xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center mb-5">
                <AlertTriangle className="w-8 h-8 text-orange-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Flights Not Available
              </h3>
              <p className="text-gray-500 text-sm max-w-md leading-relaxed">
                {searchError}
              </p>
              <div className="mt-6 flex items-center gap-2 text-xs text-gray-400">
                <PlaneTakeoff className="w-4 h-4" />
                <span>Try adjusting your dates, route, or passenger count.</span>
              </div>
            </motion.div>
          ) : results.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {searchLegs && searchLegs.length > 1 && currentLegIndex < searchLegs.length && (
                <div className="mb-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-white/10">
                  <h2 className="text-lg font-bold text-[#4F8CFF]">
                    Step {currentLegIndex + 1} of {searchLegs.length}: Select Flight ({searchLegs[currentLegIndex].originCode} → {searchLegs[currentLegIndex].destinationCode})
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {formatDateShort(searchLegs[currentLegIndex].departureDate)}
                  </p>
                </div>
              )}
              <FlightSortBar value={sort} onChange={setSort} count={displayed.length} />
              {displayed.length === 0 ? (
                <EmptyState />
              ) : (
                <motion.div
                  key={sort + JSON.stringify(filters)}
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="space-y-4"
                >
                  {displayed.map((flight) => (
                    <FlightCard key={flight.id} flight={flight} />
                  ))}
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

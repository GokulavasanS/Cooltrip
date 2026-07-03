"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useFlightStore } from "@/store/flightStore";
import { SortOption } from "@/types/flight";
import FlightCard from "./FlightCard";
import FlightSortBar from "./FlightSortBar";
import FlightFilters from "./FlightFilters";
import LoadingSkeleton from "@/components/shared/LoadingSkeleton";
import EmptyState from "@/components/shared/EmptyState";
import { sortFlights } from "@/utils/price";
import { filterFlights } from "@/utils/flight";
import { staggerContainer } from "@/utils/animation";

export default function FlightResults() {
  const { results, isSearching, searchParams } = useFlightStore();
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
          ) : results.length === 0 ? (
            <EmptyState />
          ) : (
            <>
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

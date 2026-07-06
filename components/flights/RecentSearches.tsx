"use client";

import { useRecentSearches } from "@/hooks/useRecentSearches";
import { useFlightStore } from "@/store/flightStore";
import { flightService } from "@/services/api/flight";
import { Clock, X } from "lucide-react";

export default function RecentSearches() {
  const { recentSearches, clearRecentSearches } = useRecentSearches();
  const { setResults, setSearchParams, setIsSearching, setSearchError } = useFlightStore();

  if (recentSearches.length === 0) return null;

  const replay = async (params: typeof recentSearches[0]) => {
    setIsSearching(true);
    setSearchError(null);

    let generatedLegs: import("@/types/flight").FlightSearchParams[] = [];
    if (params.tripType === "one-way") {
      generatedLegs = [{ ...params, tripType: "one-way", returnDate: undefined }];
    } else if (params.tripType === "round-trip") {
      generatedLegs = [
        { ...params, tripType: "one-way", returnDate: undefined },
        {
          ...params,
          origin: params.destination,
          originCode: params.destinationCode,
          destination: params.origin,
          destinationCode: params.originCode,
          departureDate: params.returnDate!,
          tripType: "one-way",
          returnDate: undefined,
        },
      ];
    } else if (params.tripType === "multi-city" && params.multiCityLegs) {
      generatedLegs = params.multiCityLegs.map((leg) => ({
        ...params,
        origin: leg.origin,
        originCode: leg.originCode,
        destination: leg.destination,
        destinationCode: leg.destinationCode,
        departureDate: leg.departureDate,
        tripType: "one-way",
        returnDate: undefined,
        multiCityLegs: undefined,
      }));
    }

    setSearchParams(params, generatedLegs);
    try {
      const { flights, error: apiError } = await flightService.search(generatedLegs[0]);
      setResults(flights);
      setSearchError(apiError);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mt-4">
      <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
        <Clock className="w-3.5 h-3.5" /> Recent:
      </span>
      {recentSearches.map((s, i) => (
        <button
          key={i}
          onClick={() => replay(s)}
          className="inline-flex items-center gap-1.5 text-xs font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 hover:border-[#4F8CFF]/40 hover:text-[#4F8CFF] text-gray-600 dark:text-gray-300 px-3 py-1.5 rounded-full transition-all"
        >
          {s.originCode} → {s.destinationCode}
          <span className="text-gray-300">·</span>
          {s.cabin}
        </button>
      ))}
      <button
        onClick={clearRecentSearches}
        className="text-gray-300 hover:text-gray-500 transition-colors"
        title="Clear recent searches"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

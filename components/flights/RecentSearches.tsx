"use client";

import { useRecentSearches } from "@/hooks/useRecentSearches";
import { useFlightStore } from "@/store/flightStore";
import { flightService } from "@/services/api/flight";
import { Clock, X } from "lucide-react";

export default function RecentSearches() {
  const { recentSearches, clearRecentSearches } = useRecentSearches();
  const { setResults, setSearchParams, setIsSearching } = useFlightStore();

  if (recentSearches.length === 0) return null;

  const replay = async (params: typeof recentSearches[0]) => {
    setIsSearching(true);
    setSearchParams(params);
    try {
      const results = await flightService.search(params);
      setResults(results);
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
          className="inline-flex items-center gap-1.5 text-xs font-medium bg-white border border-gray-200 hover:border-[#4F8CFF]/40 hover:text-[#4F8CFF] text-gray-600 px-3 py-1.5 rounded-full transition-all"
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

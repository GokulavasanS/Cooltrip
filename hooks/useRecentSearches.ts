"use client";

import { useUserStore } from "@/store/userStore";
import { FlightSearchParams } from "@/types/flight";

export function useRecentSearches() {
  const { recentSearches, addRecentSearch, clearRecentSearches } = useUserStore();
  return { recentSearches, addRecentSearch, clearRecentSearches };
}

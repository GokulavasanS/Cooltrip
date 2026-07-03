import { create } from "zustand";
import { persist } from "zustand/middleware";
import { FlightSearchParams } from "@/types/flight";

interface UserStore {
  recentSearches: FlightSearchParams[];
  addRecentSearch: (p: FlightSearchParams) => void;
  clearRecentSearches: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      recentSearches: [],
      addRecentSearch: (p) => {
        const existing = get().recentSearches;
        // Keep last 5, deduplicate by origin+destination
        const filtered = existing.filter(
          (s) => !(s.originCode === p.originCode && s.destinationCode === p.destinationCode)
        );
        set({ recentSearches: [p, ...filtered].slice(0, 5) });
      },
      clearRecentSearches: () => set({ recentSearches: [] }),
    }),
    { name: "cooltrips-recent-searches" }
  )
);

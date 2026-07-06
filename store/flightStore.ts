import { create } from "zustand";
import { Flight, FlightSearchParams } from "@/types/flight";

interface FlightStore {
  searchParams: FlightSearchParams | null;
  searchLegs: FlightSearchParams[];
  currentLegIndex: number;
  selectedFlights: Flight[];
  results: Flight[];
  isSearching: boolean;
  searchError: string | null;

  setSearchParams: (p: FlightSearchParams, legs: FlightSearchParams[]) => void;
  setResults: (r: Flight[]) => void;
  selectFlightForLeg: (flight: Flight) => void;
  clearSelection: () => void;
  setIsSearching: (v: boolean) => void;
  setSearchError: (e: string | null) => void;
}

export const useFlightStore = create<FlightStore>((set, get) => ({
  searchParams: null,
  searchLegs: [],
  currentLegIndex: 0,
  selectedFlights: [],
  results: [],
  isSearching: false,
  searchError: null,

  setSearchParams: (p, legs) =>
    set({
      searchParams: p,
      searchLegs: legs,
      currentLegIndex: 0,
      selectedFlights: [],
      results: [],
    }),
  setResults: (r) => set({ results: r }),
  selectFlightForLeg: (flight) => {
    const { selectedFlights, currentLegIndex, searchLegs } = get();
    const newSelected = [...selectedFlights];
    newSelected[currentLegIndex] = flight;

    // Auto advance if there are more legs
    if (currentLegIndex < searchLegs.length - 1) {
      set({
        selectedFlights: newSelected,
        currentLegIndex: currentLegIndex + 1,
        results: [],
        searchError: null,
      });
    } else {
      set({ selectedFlights: newSelected });
    }
  },
  clearSelection: () =>
    set({
      selectedFlights: [],
      currentLegIndex: 0,
      results: [],
    }),
  setIsSearching: (v) => set({ isSearching: v }),
  setSearchError: (e) => set({ searchError: e }),
}));

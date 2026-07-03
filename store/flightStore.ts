import { create } from "zustand";
import { Flight, FlightSearchParams } from "@/types/flight";

interface FlightStore {
  searchParams: FlightSearchParams | null;
  results: Flight[];
  selectedFlight: Flight | null;
  isSearching: boolean;
  setSearchParams: (p: FlightSearchParams) => void;
  setResults: (r: Flight[]) => void;
  setSelectedFlight: (f: Flight | null) => void;
  setIsSearching: (v: boolean) => void;
}

export const useFlightStore = create<FlightStore>((set) => ({
  searchParams: null,
  results: [],
  selectedFlight: null,
  isSearching: false,
  setSearchParams: (p) => set({ searchParams: p }),
  setResults: (r) => set({ results: r }),
  setSelectedFlight: (f) => set({ selectedFlight: f }),
  setIsSearching: (v) => set({ isSearching: v }),
}));

"use client";

import { useState, useCallback } from "react";
import { Airport } from "@/types/airport";
import { searchAirports } from "@/services/api/airport";

export function useAirportSearch() {
  const [results, setResults] = useState<Airport[]>([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (query: string) => {
    if (query.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    const found = await searchAirports(query);
    setResults(found);
    setLoading(false);
  }, []);

  const clear = useCallback(() => setResults([]), []);

  return { results, loading, search, clear };
}

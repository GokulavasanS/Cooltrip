import { Flight } from "@/types/flight";

/** Get colour class for stops badge */
export function stopsColor(stops: number): string {
  if (stops === 0) return "text-green-600 bg-green-50";
  if (stops === 1) return "text-amber-600 bg-amber-50";
  return "text-red-600 bg-red-50";
}

/** Filter flights by filter state */
export function filterFlights(
  flights: Flight[],
  filters: {
    maxPrice: number;
    stops: number | null; // null = all
    cabin: string | null;
    refundable: boolean;
    airlines: string[];
  }
): Flight[] {
  return flights.filter((f) => {
    if (f.fare > filters.maxPrice) return false;
    if (filters.stops !== null && f.stops !== filters.stops) return false;
    if (filters.cabin && f.cabin !== filters.cabin) return false;
    if (filters.refundable && !f.refundable) return false;
    if (filters.airlines.length > 0 && !filters.airlines.includes(f.airline)) return false;
    return true;
  });
}

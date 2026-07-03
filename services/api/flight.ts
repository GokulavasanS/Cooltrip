import { Flight, FlightSearchParams } from "@/types/flight";

/**
 * Client-side flight service.
 * All calls go through /api/flights/search which handles Amadeus vs. mock internally.
 */
export const flightService = {
  search: async (params: FlightSearchParams): Promise<Flight[]> => {
    const qs = new URLSearchParams({
      origin: params.originCode,
      destination: params.destinationCode,
      departureDate: params.departureDate,
      adults: String(params.adults),
      children: String(params.children),
      cabin: params.cabin,
    });

    const res = await fetch(`/api/flights/search?${qs}`);

    if (!res.ok) throw new Error("Flight search failed");

    return res.json() as Promise<Flight[]>;
  },
};

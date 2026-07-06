import { Flight, FlightSearchParams } from "@/types/flight";

/**
 * Client-side flight service.
 * All calls go through /api/flights/search which uses SerpAPI internally.
 * Returns { flights, error } — callers should surface the error to the user
 * rather than silently falling back to mock data.
 */
export const flightService = {
  search: async (
    params: FlightSearchParams
  ): Promise<{ flights: Flight[]; error: string | null }> => {
    const qs = new URLSearchParams({
      origin:        params.originCode,
      destination:   params.destinationCode,
      departureDate: params.departureDate,
      adults:        String(params.adults),
      children:      String(params.children),
      cabin:         params.cabin,
      tripType:      params.tripType,
    });

    if (params.returnDate) {
      qs.set("returnDate", params.returnDate);
    }

    if (params.tripType === "multi-city" && params.multiCityLegs?.length) {
      qs.set("multiCityLegs", JSON.stringify(params.multiCityLegs));
    }

    const res = await fetch(`/api/flights/search?${qs}`);

    if (!res.ok) {
      return {
        flights: [],
        error: "Flight search failed. Please try again.",
      };
    }

    const data = await res.json() as { flights: Flight[]; error: string | null };
    return data;
  },
};

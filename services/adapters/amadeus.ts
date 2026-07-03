// Amadeus API adapter — placeholder for future integration
// https://developers.amadeus.com/

import { Flight, FlightSearchParams } from "@/types/flight";

export async function amadeusSearchFlights(_params: FlightSearchParams): Promise<Flight[]> {
  // TODO: Implement using AMADEUS_CLIENT_ID + AMADEUS_CLIENT_SECRET from env
  throw new Error("Amadeus adapter not yet implemented");
}

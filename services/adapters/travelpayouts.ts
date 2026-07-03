// TravelPayouts API adapter — placeholder for future integration
// https://www.travelpayouts.com/

import { Flight, FlightSearchParams } from "@/types/flight";

export async function travelpayoutsSearchFlights(_params: FlightSearchParams): Promise<Flight[]> {
  // TODO: Implement using TRAVELPAYOUTS_TOKEN from env
  throw new Error("TravelPayouts adapter not yet implemented");
}

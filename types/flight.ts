// Trip type
export type TripType = "one-way" | "round-trip" | "multi-city";

// Cabin class
export type CabinClass = "Economy" | "Premium Economy" | "Business" | "First";

// A single leg for multi-city trips
export interface MultiCityLeg {
  originCode: string;
  origin: string;
  destinationCode: string;
  destination: string;
  departureDate: string; // ISO date string
}

// Search parameters submitted by user
export interface FlightSearchParams {
  origin: string;
  originCode: string;
  destination: string;
  destinationCode: string;
  departureDate: string; // ISO date string
  returnDate?: string;
  adults: number;
  children: number;
  cabin: CabinClass;
  tripType: TripType;
  multiCityLegs?: MultiCityLeg[];
}

// A single flight result
export interface Flight {
  id: string;
  airline: string;
  airlineCode: string;
  flightNumber: string;
  origin: string;
  originCode: string;
  destination: string;
  destinationCode: string;
  departureTime: string; // "HH:mm"
  arrivalTime: string;   // "HH:mm"
  departureDate: string; // ISO date
  arrivalDate: string;
  durationMinutes: number;
  stops: number;
  stopCities?: string[];
  cabin: CabinClass;
  fare: number;     // INR total
  baseFare?: number; // INR base (before taxes)
  taxes?: number;    // INR taxes
  refundable: boolean;
  seatsLeft: number;
}

// Sort options
export type SortOption = "cheapest" | "fastest" | "earliest" | "latest" | "best";

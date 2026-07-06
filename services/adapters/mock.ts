import { Flight, FlightSearchParams } from "@/types/flight";
import { AIRLINES } from "@/constants/airlines";

/** Generate a realistic mock flight for a given route */
function makeFlight(
  params: FlightSearchParams,
  overrides: {
    id: string;
    airline: string;
    airlineCode: string;
    flightNumber: string;
    departureTime: string;
    arrivalTime: string;
    durationMinutes: number;
    stops: number;
    fare: number;
    refundable: boolean;
    stopCities?: string[];
    arrivalDate?: string;
  }
): Flight {
  return {
    origin: params.origin,
    originCode: params.originCode,
    destination: params.destination,
    destinationCode: params.destinationCode,
    departureDate: params.departureDate,
    arrivalDate: overrides.arrivalDate ?? params.departureDate,
    cabin: params.cabin,
    seatsLeft: Math.floor(Math.random() * 8) + 1,
    segments: [],
    layovers: [],
    baseFare: overrides.fare,
    taxes: 0,
    ...overrides,
  };
}

/** Returns mock flight results based on search params */
export async function mockSearchFlights(params: FlightSearchParams): Promise<Flight[]> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 1200));

  const flights: Flight[] = [
    makeFlight(params, {
      id: "f1",
      airline: "IndiGo",
      airlineCode: "6E",
      flightNumber: "6E-204",
      departureTime: "06:00",
      arrivalTime: "09:30",
      durationMinutes: 210,
      stops: 0,
      fare: 8500,
      refundable: false,
    }),
    makeFlight(params, {
      id: "f2",
      airline: "Air India",
      airlineCode: "AI",
      flightNumber: "AI-101",
      departureTime: "09:15",
      arrivalTime: "13:00",
      durationMinutes: 225,
      stops: 0,
      fare: 11200,
      refundable: true,
    }),
    makeFlight(params, {
      id: "f3",
      airline: "Emirates",
      airlineCode: "EK",
      flightNumber: "EK-521",
      departureTime: "11:30",
      arrivalTime: "16:45",
      durationMinutes: 195,
      stops: 1,
      stopCities: ["Dubai"],
      fare: 14800,
      refundable: true,
    }),
    makeFlight(params, {
      id: "f4",
      airline: "Qatar Airways",
      airlineCode: "QR",
      flightNumber: "QR-538",
      departureTime: "14:00",
      arrivalTime: "20:30",
      durationMinutes: 270,
      stops: 1,
      stopCities: ["Doha"],
      fare: 13500,
      refundable: false,
    }),
    makeFlight(params, {
      id: "f5",
      airline: "Vistara",
      airlineCode: "UK",
      flightNumber: "UK-878",
      departureTime: "17:45",
      arrivalTime: "21:00",
      durationMinutes: 195,
      stops: 0,
      fare: 9800,
      refundable: false,
    }),
    makeFlight(params, {
      id: "f6",
      airline: "Singapore Airlines",
      airlineCode: "SQ",
      flightNumber: "SQ-422",
      departureTime: "22:00",
      arrivalTime: "07:30",
      durationMinutes: 330,
      stops: 1,
      stopCities: ["Singapore"],
      fare: 17200,
      refundable: true,
      arrivalDate: params.departureDate,
    }),
    makeFlight(params, {
      id: "f7",
      airline: "SpiceJet",
      airlineCode: "SG",
      flightNumber: "SG-113",
      departureTime: "05:00",
      arrivalTime: "08:15",
      durationMinutes: 195,
      stops: 0,
      fare: 7200,
      refundable: false,
    }),
    makeFlight(params, {
      id: "f8",
      airline: "Turkish Airlines",
      airlineCode: "TK",
      flightNumber: "TK-724",
      departureTime: "03:30",
      arrivalTime: "12:00",
      durationMinutes: 390,
      stops: 2,
      stopCities: ["Istanbul", "Frankfurt"],
      fare: 19800,
      refundable: true,
    }),
  ];

  // Filter by cabin if needed (mock just returns all, real API handles it)
  return flights;
}

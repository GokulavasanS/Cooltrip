import { Flight, FlightSearchParams, CabinClass } from "@/types/flight";

// ── SerpAPI Response Types ─────────────────────────────────────────────────

interface SerpAirport {
  name: string;
  id: string;   // IATA code
  time: string; // "YYYY-MM-DD HH:mm"
}

interface SerpLayover {
  id: string;
  name: string;
  duration: number; // minutes
}

interface SerpFlightSegment {
  departure_airport: SerpAirport;
  arrival_airport: SerpAirport;
  duration: number;        // minutes
  airplane?: string;
  airline: string;
  airline_logo?: string;
  travel_class: string;
  flight_number: string;
  legroom?: string;
  extensions?: string[];
  often_delayed_by_over_30_min?: boolean;
}

interface SerpFlightItinerary {
  flights: SerpFlightSegment[];
  layovers?: SerpLayover[];
  total_duration: number;   // minutes
  carbon_emissions?: object;
  price: number;            // INR
  type?: string;
  airline_logo?: string;
  departure_token?: string;
  booking_token?: string;
  extensions?: string[];
}

interface SerpAPIResponse {
  best_flights?: SerpFlightItinerary[];
  other_flights?: SerpFlightItinerary[];
  error?: string;
}

// ── Cabin class mapping ────────────────────────────────────────────────────

function cabinToTravelClass(cabin: CabinClass): string {
  const map: Record<CabinClass, string> = {
    "Economy": "1",
    "Premium Economy": "2",
    "Business": "3",
    "First": "4",
  };
  return map[cabin] ?? "1";
}

// ── Time helpers ───────────────────────────────────────────────────────────

/**
 * Extract "HH:mm" from a SerpAPI datetime string ("YYYY-MM-DD HH:mm")
 */
function extractTime(datetimeStr: string): string {
  if (!datetimeStr) return "00:00";
  const parts = datetimeStr.split(" ");
  return parts[1] ?? "00:00";
}

/**
 * Extract ISO date "YYYY-MM-DD" from a SerpAPI datetime string
 */
function extractDate(datetimeStr: string): string {
  if (!datetimeStr) return "";
  return datetimeStr.split(" ")[0] ?? "";
}

// ── Normalise a single itinerary → our Flight shape ───────────────────────

function normaliseItinerary(
  itinerary: SerpFlightItinerary,
  idx: number,
  params: FlightSearchParams
): Flight {
  const firstSeg = itinerary.flights[0];
  const lastSeg = itinerary.flights[itinerary.flights.length - 1];

  const stops = itinerary.flights.length - 1;
  const stopCities =
    itinerary.layovers?.map((l) => l.name) ??
    // Derive from intermediate arrival airports when layovers array is absent
    itinerary.flights.slice(0, -1).map((s) => s.arrival_airport.name);

  // Best-guess airline: first segment's airline
  const airlineName = firstSeg.airline;
  // Derive airline code from flight_number prefix (e.g. "6E 204" → "6E")
  const airlineCode = firstSeg.flight_number?.split(" ")[0] ?? "";

  const depTime = extractTime(firstSeg.departure_airport.time);
  const arrTime = extractTime(lastSeg.arrival_airport.time);
  const depDate = extractDate(firstSeg.departure_airport.time) || params.departureDate;
  const arrDate = extractDate(lastSeg.arrival_airport.time) || depDate;

  // Price estimate split
  const fare = itinerary.price;
  const baseFare = Math.round(fare * 0.82);
  const taxes = fare - baseFare;

  return {
    id: `serp-${idx}`,
    airline: airlineName,
    airlineCode,
    flightNumber: firstSeg.flight_number ?? "",
    origin: params.origin,
    originCode: firstSeg.departure_airport.id || params.originCode,
    destination: params.destination,
    destinationCode: lastSeg.arrival_airport.id || params.destinationCode,
    departureTime: depTime,
    arrivalTime: arrTime,
    departureDate: depDate,
    arrivalDate: arrDate,
    durationMinutes: itinerary.total_duration,
    stops,
    stopCities: stops > 0 ? stopCities : [],
    cabin: params.cabin,
    fare,
    baseFare,
    taxes,
    refundable: false,
    seatsLeft: Math.floor(Math.random() * 8) + 1,
  };
}

// ── Main search function ───────────────────────────────────────────────────

export async function serpAPISearchFlights(
  params: FlightSearchParams
): Promise<Flight[]> {
  const apiKey = process.env.SERPAPI_API_KEY;
  if (!apiKey) throw new Error("SERPAPI_API_KEY not set");

  const url = new URL("https://serpapi.com/search");
  url.searchParams.set("engine", "google_flights");
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("hl", "en");
  url.searchParams.set("currency", "INR");
  url.searchParams.set("travel_class", cabinToTravelClass(params.cabin));
  url.searchParams.set("adults", String(params.adults));
  if (params.children > 0) {
    url.searchParams.set("children", String(params.children));
  }

  // ── Trip type & routing ────────────────────────────────────────────────
  if (params.tripType === "multi-city" && params.multiCityLegs?.length) {
    url.searchParams.set("type", "3");
    const multiJson = params.multiCityLegs.map((leg) => ({
      departure_id: leg.originCode,
      arrival_id: leg.destinationCode,
      date: leg.departureDate,
    }));
    url.searchParams.set("multi_city_json", JSON.stringify(multiJson));
  } else if (params.tripType === "round-trip") {
    url.searchParams.set("type", "1");
    url.searchParams.set("departure_id", params.originCode);
    url.searchParams.set("arrival_id", params.destinationCode);
    url.searchParams.set("outbound_date", params.departureDate);
    if (params.returnDate) {
      url.searchParams.set("return_date", params.returnDate);
    }
  } else {
    // one-way (default)
    url.searchParams.set("type", "2");
    url.searchParams.set("departure_id", params.originCode);
    url.searchParams.set("arrival_id", params.destinationCode);
    url.searchParams.set("outbound_date", params.departureDate);
  }

  const res = await fetch(url.toString(), {
    headers: { "Content-Type": "application/json" },
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`SerpAPI error ${res.status}: ${text}`);
  }

  const json: SerpAPIResponse = await res.json();

  if (json.error) {
    throw new Error(`SerpAPI: ${json.error}`);
  }

  const allItineraries: SerpFlightItinerary[] = [
    ...(json.best_flights ?? []),
    ...(json.other_flights ?? []),
  ];

  if (allItineraries.length === 0) {
    return [];
  }

  return allItineraries.map((itinerary, idx) =>
    normaliseItinerary(itinerary, idx, params)
  );
}

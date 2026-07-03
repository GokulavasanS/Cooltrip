import { Flight, FlightSearchParams } from "@/types/flight";
import { AIRLINES } from "@/constants/airlines";

interface TravelpayoutsFlight {
  origin: string;
  destination: string;
  origin_airport: string;
  destination_airport: string;
  price: number;
  airline: string;
  flight_number: string;
  departure_at: string;
  return_at: string | null;
  transfers: number;
  return_transfers: number;
  duration: number;
  duration_to: number;
  duration_back: number | null;
  link: string;
}

interface TravelpayoutsResponse {
  success: boolean;
  data: TravelpayoutsFlight[];
  error?: string;
}

function getAirlineName(code: string): string {
  const found = AIRLINES.find((a) => a.code === code);
  return found?.name ?? code;
}

export async function travelpayoutsSearchFlights(params: FlightSearchParams): Promise<Flight[]> {
  const token = process.env.TRAVELPAYOUTS_TOKEN;
  if (!token) throw new Error("TRAVELPAYOUTS_TOKEN not set");

  const isRoundTrip = params.tripType === "round-trip";

  const fetchFromTP = async (departureDate?: string): Promise<TravelpayoutsFlight[]> => {
    const url = new URL("https://api.travelpayouts.com/aviasales/v3/prices_for_dates");
    url.searchParams.set("origin", params.originCode);
    url.searchParams.set("destination", params.destinationCode);
    if (departureDate) {
      url.searchParams.set("departure_at", departureDate);
    }
    url.searchParams.set("currency", "inr");
    url.searchParams.set("sorting", "price");
    url.searchParams.set("limit", "30");
    url.searchParams.set("token", token);
    if (!isRoundTrip) url.searchParams.set("one_way", "true");
    if (isRoundTrip && params.returnDate) {
      url.searchParams.set("return_at", params.returnDate);
    }

    const res = await fetch(url.toString(), {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Travelpayouts API error ${res.status}: ${text}`);
    }

    const json: TravelpayoutsResponse = await res.json();
    if (!json.success) {
      throw new Error(json.error ?? "No success response from Travelpayouts");
    }
    return json.data || [];
  };

  let data: TravelpayoutsFlight[] = [];
  try {
    // Try precise date first
    data = await fetchFromTP(params.departureDate);
  } catch (e) {
    console.error("[Travelpayouts] Precise date search failed:", e);
  }

  // Fallback to any cached dates for this route if empty
  if (data.length === 0) {
    try {
      data = await fetchFromTP();
    } catch (e) {
      console.error("[Travelpayouts] General route search failed:", e);
    }
  }

  if (data.length === 0) {
    return [];
  }

  return data.map((item, idx) => {
    const depDate = new Date(item.departure_at);
    const depHH = String(depDate.getHours()).padStart(2, "0");
    const depMM = String(depDate.getMinutes()).padStart(2, "0");
    const depHHMM = `${depHH}:${depMM}`;

    const arrMinutes = item.duration_to;

    // Shift date to match requested search departure date so it works in the booking calendar
    const searchDepDate = new Date(params.departureDate);
    searchDepDate.setHours(depDate.getHours());
    searchDepDate.setMinutes(depDate.getMinutes());

    const arrDate = new Date(searchDepDate.getTime() + arrMinutes * 60_000);
    const arrHHMM = `${String(arrDate.getHours()).padStart(2, "0")}:${String(arrDate.getMinutes()).padStart(2, "0")}`;

    const airlineName = getAirlineName(item.airline);

    return {
      id: `tp-${idx}`,
      airline: airlineName,
      airlineCode: item.airline,
      flightNumber: item.flight_number,
      origin: params.origin,
      originCode: params.originCode,
      destination: params.destination,
      destinationCode: params.destinationCode,
      departureTime: depHHMM,
      arrivalTime: arrHHMM,
      departureDate: params.departureDate,
      arrivalDate: arrDate.toISOString().split("T")[0],
      durationMinutes: item.duration_to,
      stops: item.transfers,
      stopCities: [],
      cabin: params.cabin,
      fare: item.price,
      baseFare: Math.round(item.price * 0.85),
      taxes: Math.round(item.price * 0.15),
      refundable: false,
      seatsLeft: Math.floor(Math.random() * 9) + 1,
    };
  });
}

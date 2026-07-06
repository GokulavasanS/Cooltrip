import { Flight, CabinClass } from "@/types/flight";

/** Parse ISO 8601 duration like "PT4H30M" → minutes */
function parseDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return 0;
  return parseInt(match[1] || "0") * 60 + parseInt(match[2] || "0");
}

const CABIN_MAP: Record<string, CabinClass> = {
  ECONOMY: "Economy",
  PREMIUM_ECONOMY: "Premium Economy",
  BUSINESS: "Business",
  FIRST: "First",
};

/** Map a single Amadeus FlightOffer object to our internal Flight type */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapAmadeusOffer(offer: any, dictionaries: any): Flight {
  const itinerary = offer.itineraries[0];
  const segments = itinerary.segments;
  const firstSeg = segments[0];
  const lastSeg = segments[segments.length - 1];

  const carrierCode: string = firstSeg.carrierCode;
  const airlineName: string = dictionaries?.carriers?.[carrierCode] || carrierCode;

  // Times: "2026-07-04T06:20:00" → "06:20"
  const departureAt: string = firstSeg.departure.at;
  const arrivalAt: string = lastSeg.arrival.at;

  const departureTime = departureAt.substring(11, 16);
  const arrivalTime = arrivalAt.substring(11, 16);
  const departureDate = departureAt.substring(0, 10);
  const arrivalDate = arrivalAt.substring(0, 10);

  // Stop cities = intermediate arrival IATA codes
  const stopCities: string[] = segments
    .slice(0, -1)
    .map((s: any) => s.arrival.iataCode);

  const fare = Math.round(parseFloat(offer.price.total || "0"));
  const baseFare = Math.round(parseFloat(offer.price.base || offer.price.total || "0"));
  const taxes = Math.max(0, fare - baseFare);

  const cabinCode: string =
    offer.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin || "ECONOMY";

  return {
    id: offer.id,
    airline: airlineName,
    airlineCode: carrierCode,
    flightNumber: `${carrierCode} ${firstSeg.number}`,
    origin: firstSeg.departure.iataCode,
    originCode: firstSeg.departure.iataCode,
    destination: lastSeg.arrival.iataCode,
    destinationCode: lastSeg.arrival.iataCode,
    departureTime,
    arrivalTime,
    departureDate,
    arrivalDate,
    durationMinutes: parseDuration(itinerary.duration),
    stops: segments.length - 1,
    stopCities: stopCities.length > 0 ? stopCities : undefined,
    segments: [],
    layovers: [],
    cabin: CABIN_MAP[cabinCode] ?? "Economy",
    fare,
    baseFare,
    taxes,
    refundable: false,
    seatsLeft: offer.numberOfBookableSeats ?? 9,
  };
}

import { NextRequest, NextResponse } from "next/server";
import { mapAmadeusOffer } from "@/utils/amadeusMapper";
import { mockSearchFlights } from "@/services/adapters/mock";
import { CabinClass, FlightSearchParams } from "@/types/flight";

const CABIN_TO_AMADEUS: Record<string, string> = {
  Economy: "ECONOMY",
  "Premium Economy": "PREMIUM_ECONOMY",
  Business: "BUSINESS",
  First: "FIRST",
};

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;

  const originCode = sp.get("origin") ?? "";
  const destinationCode = sp.get("destination") ?? "";
  const departureDate = sp.get("departureDate") ?? "";
  const adults = sp.get("adults") ?? "1";
  const children = sp.get("children") ?? "0";
  const cabin = (sp.get("cabin") ?? "Economy") as CabinClass;

  if (!originCode || !destinationCode || !departureDate) {
    return NextResponse.json({ error: "Missing required params" }, { status: 400 });
  }

  // --- Live Amadeus path ---
  if (process.env.AMADEUS_CLIENT_ID && process.env.AMADEUS_CLIENT_SECRET) {
    try {
      // Dynamic import so SDK only loads server-side when creds are present
      const Amadeus = (await import("amadeus")).default;

      const amadeus = new Amadeus({
        clientId: process.env.AMADEUS_CLIENT_ID,
        clientSecret: process.env.AMADEUS_CLIENT_SECRET,
        // 'test' uses test.api.amadeus.com; 'production' for live data
        hostname: (process.env.AMADEUS_ENV ?? "test") as "test" | "production",
      });

      const params: Record<string, string> = {
        originLocationCode: originCode,
        destinationLocationCode: destinationCode,
        departureDate,
        adults,
        currencyCode: "INR",
        max: "20",
      };

      if (parseInt(children) > 0) params.children = children;
      if (CABIN_TO_AMADEUS[cabin]) params.travelClass = CABIN_TO_AMADEUS[cabin];

      const response = await amadeus.shopping.flightOffersSearch.get(params);
      const result = response.result as { data: unknown[]; dictionaries: unknown };

      const flights = (result.data ?? []).map((offer) =>
        mapAmadeusOffer(offer, result.dictionaries)
      );

      return NextResponse.json(flights);
    } catch (err) {
      console.error("[Amadeus] Error:", err);
      // Fall through to mock on error so the UI stays usable
    }
  }

  // --- Mock fallback path ---
  const mockParams: FlightSearchParams = {
    origin: originCode,
    originCode,
    destination: destinationCode,
    destinationCode,
    departureDate,
    adults: parseInt(adults),
    children: parseInt(children),
    cabin,
    tripType: "one-way",
  };

  const flights = await mockSearchFlights(mockParams);
  return NextResponse.json(flights);
}

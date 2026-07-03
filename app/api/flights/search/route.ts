import { NextRequest, NextResponse } from "next/server";
import { travelpayoutsSearchFlights } from "@/services/adapters/travelpayouts";
import { mockSearchFlights } from "@/services/adapters/mock";
import { CabinClass, FlightSearchParams } from "@/types/flight";

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

  const searchParams: FlightSearchParams = {
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

  // --- Travelpayouts live path ---
  if (process.env.TRAVELPAYOUTS_TOKEN) {
    try {
      console.log(`[API] Searching Travelpayouts for ${originCode} -> ${destinationCode} on ${departureDate}...`);
      const flights = await travelpayoutsSearchFlights(searchParams);
      console.log(`[API] Travelpayouts returned ${flights ? flights.length : 0} flights.`);
      return NextResponse.json(flights || []);
    } catch (err) {
      console.error("[API] Travelpayouts Error:", err);
      return NextResponse.json([]);
    }
  }

  // --- Mock fallback path (only if no token is configured) ---
  console.log("[API] Returning mock flights fallback.");
  const flights = await mockSearchFlights(searchParams);
  return NextResponse.json(flights);
}

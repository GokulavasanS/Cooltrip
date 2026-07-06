import { NextRequest, NextResponse } from "next/server";
import { serpAPISearchFlights } from "@/services/adapters/serpapi";
import { CabinClass, FlightSearchParams, MultiCityLeg, TripType } from "@/types/flight";

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;

  const originCode       = sp.get("origin")        ?? "";
  const destinationCode  = sp.get("destination")   ?? "";
  const departureDate    = sp.get("departureDate")  ?? "";
  const returnDate       = sp.get("returnDate")     ?? undefined;
  const adults           = sp.get("adults")         ?? "1";
  const children         = sp.get("children")       ?? "0";
  const cabin            = (sp.get("cabin")         ?? "Economy") as CabinClass;
  const tripType         = (sp.get("tripType")      ?? "one-way") as TripType;
  const multiCityRaw     = sp.get("multiCityLegs");

  // ── Validation ─────────────────────────────────────────────────────────
  if (tripType !== "multi-city" && (!originCode || !destinationCode || !departureDate)) {
    return NextResponse.json(
      { error: "Missing required params", flights: [] },
      { status: 400 }
    );
  }

  // ── Parse multi-city legs ───────────────────────────────────────────────
  let multiCityLegs: MultiCityLeg[] | undefined;
  if (tripType === "multi-city" && multiCityRaw) {
    try {
      multiCityLegs = JSON.parse(multiCityRaw) as MultiCityLeg[];
    } catch {
      return NextResponse.json(
        { error: "Invalid multiCityLegs format", flights: [] },
        { status: 400 }
      );
    }
    if (!multiCityLegs?.length) {
      return NextResponse.json(
        { error: "Multi-city requires at least one leg", flights: [] },
        { status: 400 }
      );
    }
  }

  const searchParams: FlightSearchParams = {
    origin:          originCode,
    originCode,
    destination:     destinationCode,
    destinationCode,
    departureDate,
    returnDate:      tripType === "round-trip" ? returnDate : undefined,
    adults:          parseInt(adults),
    children:        parseInt(children),
    cabin,
    tripType,
    multiCityLegs,
  };

  // ── No API key configured → return an explicit "not available" message ──
  if (!process.env.SERPAPI_API_KEY) {
    console.warn("[API] SERPAPI_API_KEY not configured — returning empty results.");
    return NextResponse.json({
      flights: [],
      error: "Flight search is not available at the moment. Please try again later.",
    });
  }

  // ── Live SerpAPI path ───────────────────────────────────────────────────
  try {
    console.log(
      `[API] SerpAPI search: ${originCode} → ${destinationCode} (${tripType}) on ${departureDate}`
    );
    const flights = await serpAPISearchFlights(searchParams);
    console.log(`[API] SerpAPI returned ${flights.length} flights.`);

    if (flights.length === 0) {
      return NextResponse.json({
        flights: [],
        error: "No flights found for your search. Please try different dates or airports.",
      });
    }

    return NextResponse.json({ flights, error: null });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[API] SerpAPI Error:", message);

    return NextResponse.json({
      flights: [],
      error: "Unable to fetch flights right now. Please try again in a moment.",
    });
  }
}

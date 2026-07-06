import { NextResponse } from "next/server";
// @ts-ignore
import airportData from "airport-data";
import { Airport } from "@/types/airport";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query || query.length < 2) {
    return NextResponse.json({ airports: [] });
  }

  const q = query.toLowerCase();

  // Filter airport-data
  // We only care about airports that have an IATA code (commercial flights)
  const results = airportData
    .filter((a: any) => 
      a.iata && 
      a.iata !== "\\N" && // some datasets use \N for null
      (
        a.iata.toLowerCase().includes(q) ||
        (a.city && a.city.toLowerCase().includes(q)) ||
        (a.name && a.name.toLowerCase().includes(q)) ||
        (a.country && a.country.toLowerCase().includes(q))
      )
    )
    .slice(0, 10)
    .map((a: any): Airport => ({
      code: a.iata,
      name: a.name,
      city: a.city,
      country: a.country,
    }));

  return NextResponse.json({ airports: results });
}

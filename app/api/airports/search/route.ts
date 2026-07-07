import { NextResponse } from "next/server";
import airportData from "airport-data";
import { Airport } from "@/types/airport";
import { AIRPORTS } from "@/constants/airports";

// ---------- Types ----------

/** Shape of raw entries coming from the `airport-data` package. */
interface RawAirportRecord {
  iata?: string;
  name?: string;
  city?: string;
  country?: string;
}

/** An airport enriched with precomputed lowercase fields for fast matching. */
interface IndexedAirport extends Airport {
  _code: string;
  _city: string;
  _name: string;
  _country: string;
}

// ---------- Config ----------

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 25;
const MIN_QUERY_LENGTH = 2;

// ---------- Build a single deduplicated, indexed dataset ONCE at module load ----------
// This is the expensive part (normalizing potentially thousands of records),
// so we pay that cost a single time per server instance instead of per request.

function buildIndex(): IndexedAirport[] {
  const seen = new Set<string>();
  const index: IndexedAirport[] = [];

  const addEntry = (airport: Airport) => {
    const code = airport.code?.trim();
    if (!code || seen.has(code)) return;

    seen.add(code);
    index.push({
      ...airport,
      _code: code.toLowerCase(),
      _city: (airport.city || "").toLowerCase(),
      _name: (airport.name || "").toLowerCase(),
      _country: (airport.country || "").toLowerCase(),
    });
  };

  // Curated list wins on collisions because it's added first.
  for (const airport of AIRPORTS) {
    addEntry(airport);
  }

  for (const raw of airportData as RawAirportRecord[]) {
    if (!raw.iata || raw.iata === "\\N") continue;
    addEntry({
      code: raw.iata,
      name: raw.name || "",
      city: raw.city || "",
      country: raw.country || "",
    });
  }

  return index;
}

// Lazily built, cached across warm invocations of this module.
let airportIndex: IndexedAirport[] | null = null;

function getAirportIndex(): IndexedAirport[] {
  if (!airportIndex) {
    airportIndex = buildIndex();
  }
  return airportIndex;
}

// ---------- Relevance scoring ----------
// Higher is better. Returns null when the record doesn't match at all.

function scoreAirport(airport: IndexedAirport, q: string): number | null {
  const { _code, _city, _name, _country } = airport;

  if (_code === q) return 100;
  if (_code.startsWith(q)) return 90;
  if (_city.startsWith(q)) return 80;
  if (_name.startsWith(q)) return 70;
  if (_country.startsWith(q)) return 60;
  if (_code.includes(q)) return 50;
  if (_city.includes(q)) return 40;
  if (_name.includes(q)) return 30;
  if (_country.includes(q)) return 20;

  return null;
}

function stripIndexFields({ _code, _city, _name, _country, ...airport }: IndexedAirport): Airport {
  return airport;
}

// ---------- Handler ----------

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawQuery = searchParams.get("q");
    const query = rawQuery?.trim().toLowerCase() ?? "";

    if (query.length < MIN_QUERY_LENGTH) {
      return NextResponse.json({ airports: [] });
    }

    const limitParam = Number(searchParams.get("limit"));
    const limit =
      Number.isFinite(limitParam) && limitParam > 0
        ? Math.min(Math.floor(limitParam), MAX_LIMIT)
        : DEFAULT_LIMIT;

    const index = getAirportIndex();

    const scored: { airport: IndexedAirport; score: number }[] = [];
    for (const airport of index) {
      const score = scoreAirport(airport, query);
      if (score !== null) {
        scored.push({ airport, score });
      }
    }

    scored.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      // Tie-break alphabetically for stable, predictable ordering.
      return a.airport._city.localeCompare(b.airport._city);
    });

    const airports = scored.slice(0, limit).map(({ airport }) => stripIndexFields(airport));

    return NextResponse.json({ airports });
  } catch (error) {
    console.error("[/api/airports] search failed:", error);
    return NextResponse.json(
      { airports: [], error: "Failed to search airports." },
      { status: 500 }
    );
  }
}
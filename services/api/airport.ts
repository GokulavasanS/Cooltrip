import { Airport } from "@/types/airport";
import { AIRPORTS } from "@/constants/airports";

/** Search airports by query string (code, city, or name) */
export async function searchAirports(query: string): Promise<Airport[]> {
  if (query.length < 2) return [];
  const q = query.toLowerCase();
  return AIRPORTS.filter(
    (a) =>
      a.code.toLowerCase().includes(q) ||
      a.city.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      a.country.toLowerCase().includes(q)
  ).slice(0, 8);
}

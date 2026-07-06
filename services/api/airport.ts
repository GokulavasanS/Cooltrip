import { Airport } from "@/types/airport";
import { AIRPORTS } from "@/constants/airports";

/** Search airports by query string (code, city, or name) */
export async function searchAirports(query: string): Promise<Airport[]> {
  if (query.length < 2) return [];
  
  try {
    const res = await fetch(`/api/airports/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) return [];
    
    const data = await res.json();
    return data.airports || [];
  } catch (error) {
    console.error("Error fetching airports:", error);
    return [];
  }
}

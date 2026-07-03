import { Flight } from "@/types/flight";

/** Sort flights by chosen option */
export function sortFlights(flights: Flight[], by: string): Flight[] {
  const arr = [...flights];
  switch (by) {
    case "cheapest":
      return arr.sort((a, b) => a.fare - b.fare);
    case "fastest":
      return arr.sort((a, b) => a.durationMinutes - b.durationMinutes);
    case "earliest":
      return arr.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
    case "latest":
      return arr.sort((a, b) => b.departureTime.localeCompare(a.departureTime));
    case "best":
      // Best = cheapest + fastest combined score
      return arr.sort((a, b) => (a.fare / 10000 + a.durationMinutes / 60) - (b.fare / 10000 + b.durationMinutes / 60));
    default:
      return arr;
  }
}

import { Flight } from "@/types/flight";
import { PassengerSchema } from "@/lib/validators";
import { formatINR } from "./currency";
import { formatDate } from "./date";

/** Build a prefilled WhatsApp message URL for a flight booking request */
export function buildWhatsAppURL(flight: Flight, passenger: PassengerSchema): string {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919876543210";
  const msg = [
    `Hi CoolTrips! I'd like to book a flight. ✈`,
    ``,
    `*Flight Details*`,
    `Route: ${flight.originCode} → ${flight.destinationCode}`,
    `Date: ${formatDate(flight.departureDate)}`,
    `Departure: ${flight.departureTime} | Arrival: ${flight.arrivalTime}`,
    `Airline: ${flight.airline} (${flight.flightNumber})`,
    `Cabin: ${flight.cabin}`,
    `Fare: ${formatINR(flight.fare)} per person`,
    ``,
    `*Passenger Details*`,
    `Name: ${passenger.fullName}`,
    `Email: ${passenger.email}`,
    `Phone: +91${passenger.phone}`,
    `Nationality: ${passenger.nationality}`,
    `Passengers: ${passenger.passengers}`,
    passenger.passportNo ? `Passport: ${passenger.passportNo}` : "",
    passenger.specialRequests ? `Special Requests: ${passenger.specialRequests}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;
}

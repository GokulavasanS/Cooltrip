import { PassengerSchema } from "@/lib/validators";
import { Flight } from "@/types/flight";

/** Submit passenger request — currently logs; wire to DB in production */
export async function submitPassengerRequest(
  passenger: PassengerSchema,
  flight: Flight
): Promise<void> {
  // TODO: POST to /api/passenger → save to DB via Prisma
  console.log("Passenger request submitted:", { passenger, flight });
  await new Promise((r) => setTimeout(r, 600));
}

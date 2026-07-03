import { Flight } from "./flight";

export type RequestStatus = "NEW" | "CONTACTED" | "CONFIRMED" | "CANCELLED";

export interface PassengerRequest {
  id: string;
  fullName: string;
  email: string;
  phone: string;           // 10-digit, stored without +91
  nationality: string;
  passportNo?: string;
  passengers: number;
  specialRequests?: string;
  flight: Flight;          // snapshot of selected flight
  status: RequestStatus;
  createdAt: string;
}

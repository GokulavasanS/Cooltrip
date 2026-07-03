export interface PassengerForm {
  fullName: string;
  email: string;
  phone: string;        // 10 digits, +91 prefix shown in UI
  nationality: string;
  passportNo?: string;
  passengers: number;
  specialRequests?: string;
  agreeToTerms: boolean;
}

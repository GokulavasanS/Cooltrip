import { PhoneCall } from "lucide-react";

export default function EmergencySupport() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919876543210";

  return (
    <div className="bg-gradient-to-br from-red-50 to-rose-50 border border-red-100 rounded-2xl p-5 flex items-start gap-4">
      <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center shrink-0 animate-pulse">
        <PhoneCall className="w-5 h-5 text-white" />
      </div>
      <div>
        <div className="font-bold text-red-700 text-sm mb-0.5">24/7 Emergency Travel Support</div>
        <p className="text-red-600 text-xs leading-relaxed mb-2">
          Missed flight? Booking issue? Our emergency line is available round the clock.
        </p>
        <a
          href={`https://wa.me/${number}?text=Hi%20CoolTrips%2C%20I%20need%20emergency%20travel%20assistance.`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-700 hover:underline"
        >
          Contact Emergency Support →
        </a>
      </div>
    </div>
  );
}

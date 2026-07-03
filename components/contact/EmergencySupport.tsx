import { PhoneCall } from "lucide-react";

export default function EmergencySupport() {
  return (
    <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30 border border-red-100 dark:border-red-900/50 rounded-2xl p-5 flex items-start gap-4">
      <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center shrink-0 animate-pulse">
        <PhoneCall className="w-5 h-5 text-white" />
      </div>
      <div className="min-w-0">
        <div className="font-bold text-red-700 dark:text-red-400 text-sm mb-0.5">24/7 Emergency Travel Support</div>
        <p className="text-red-600 dark:text-red-300/80 text-xs leading-relaxed mb-2">
          Missed flight? Booking issue? Our emergency line is available round the clock.
        </p>
        <a
          href="tel:+919940033117"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-700 dark:text-red-400 hover:underline"
        >
          +91 99400 33117 — Call Now →
        </a>
      </div>
    </div>
  );
}

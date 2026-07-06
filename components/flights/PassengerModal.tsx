"use client";

import { useState } from "react";
import emailjs from "@emailjs/browser";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Plane, Clock, CheckCircle } from "lucide-react";
import { useFlightStore } from "@/store/flightStore";
import { useUIStore } from "@/store/uiStore";
import { Flight } from "@/types/flight";
import { passengerSchema, PassengerSchema } from "@/lib/validators";
import { submitPassengerRequest } from "@/services/api/passenger";
import { formatINR } from "@/utils/currency";
import { formatDate } from "@/utils/date";
import { formatDuration, stopsLabel } from "@/utils/time";
import { COUNTRIES } from "@/constants/countries";
import { slideInRight } from "@/utils/animation";

const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? "";
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_BOOKING ?? "";
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? "";

export default function PassengerModal() {
  const { selectedFlights, clearSelection } = useFlightStore();
  const { isPassengerModalOpen, closePassengerModal } = useUIStore();
  const [submitted, setSubmitted] = useState(false);
  const [emailError, setEmailError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PassengerSchema>({
    resolver: zodResolver(passengerSchema),
    defaultValues: { passengers: 1 },
  });

  const onSubmit = async (data: PassengerSchema) => {
    if (!selectedFlights || selectedFlights.length === 0) return;
    setEmailError("");

    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      setEmailError("Email service is not configured. Please contact us at reservation@cooltrip.org.");
      return;
    }

    try {
      await submitPassengerRequest(data, selectedFlights);

      const grandTotalFare = selectedFlights.reduce((sum, f) => sum + f.fare, 0);

      // Build a multi-line formatted string to support 1-N legs smoothly in EmailJS
      const fullItineraryText = selectedFlights
        .map((f, i) => 
`Leg ${i + 1}: ${f.origin} (${f.originCode}) → ${f.destination} (${f.destinationCode})
Date: ${formatDate(f.departureDate)}
Departure: ${f.departureTime} | Arrival: ${f.arrivalTime}
Airline: ${f.airline} (${f.flightNumber})
Cabin: ${f.cabin}
Leg Fare: ${formatINR(f.fare)}`)
        .join("\n\n");

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          full_name: data.fullName,
          email: data.email,
          phone: `+91 ${data.phone}`,
          nationality: data.nationality,
          passport_no: data.passportNo ?? "Not provided",
          passengers: data.passengers,
          special_requests: data.specialRequests ?? "None",
          
          full_itinerary: fullItineraryText,
          grand_total_fare: formatINR(grandTotalFare),
          
          to_email: "Reservation@cooltrip.org",
        },
        EMAILJS_PUBLIC_KEY
      );

      setSubmitted(true);
    } catch (err) {
      console.error("[EmailJS] Booking send error:", err);
      setEmailError("Failed to send your request. Please try again or contact us at reservation@cooltrip.org.");
    }
  };

  const handleClose = () => {
    closePassengerModal();
    clearSelection();
    setTimeout(() => { reset(); setSubmitted(false); setEmailError(""); }, 400);
  };

  if (!isPassengerModalOpen || selectedFlights.length === 0) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Panel */}
        <motion.div
          variants={slideInRight}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="relative ml-auto w-full max-w-xl h-full bg-white dark:bg-gray-900 shadow-2xl overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white/90 dark:bg-gray-900/95 backdrop-blur z-10 px-6 py-4 border-b border-gray-100 dark:border-white/10 flex items-center justify-between">
            <h2 className="font-bold text-gray-900 dark:text-white text-lg">Passenger Details</h2>
            <button onClick={handleClose} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="p-6">
            {submitted ? (
              <SuccessView onClose={handleClose} />
            ) : (
              <>
                {/* Flight summary */}
                <FlightSummary flights={selectedFlights} />

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Your Information</h3>

                  <Field label="Full Name" error={errors.fullName?.message}>
                    <input {...register("fullName")} className="input-glass" placeholder="As on passport" />
                  </Field>

                  <Field label="Email Address" error={errors.email?.message}>
                    <input {...register("email")} type="email" className="input-glass" placeholder="you@example.com" />
                  </Field>

                  <Field label="Mobile Number" error={errors.phone?.message}>
                    <div className="flex gap-2 items-center">
                      <span className="input-glass shrink-0 text-center text-gray-600 font-medium text-sm px-3 py-3" style={{ width: "64px" }}>
                        +91
                      </span>
                      <input
                        {...register("phone")}
                        type="tel"
                        className="input-glass flex-1 min-w-0"
                        placeholder="9876543210"
                        maxLength={10}
                      />
                    </div>
                  </Field>

                  <Field label="Nationality" error={errors.nationality?.message}>
                    <select {...register("nationality")} className="input-glass">
                      <option value="">Select nationality</option>
                      {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </Field>

                  <Field label="Passport Number (Optional)">
                    <input {...register("passportNo")} className="input-glass" placeholder="AB1234567" />
                  </Field>

                  <Field label="Number of Passengers" error={errors.passengers?.message}>
                    <select {...register("passengers", { valueAsNumber: true })} className="input-glass">
                      {[1,2,3,4,5,6,7,8,9].map((n) => <option key={n} value={n}>{n} Passenger{n > 1 ? "s" : ""}</option>)}
                    </select>
                  </Field>

                  <Field label="Special Requests (Optional)">
                    <textarea
                      {...register("specialRequests")}
                      className="input-glass resize-none"
                      rows={3}
                      placeholder="Wheelchair assistance, meal preference, etc."
                    />
                  </Field>

                  {/* Terms */}
                  <div className="flex items-start gap-2.5 pt-1">
                    <input
                      {...register("agreeToTerms")}
                      type="checkbox"
                      id="terms"
                      className="mt-0.5 accent-[#4F8CFF]"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      I agree to the <span className="text-[#4F8CFF] cursor-pointer">Terms &amp; Conditions</span>. I understand that CoolTrips will contact me via email to complete this booking.
                    </label>
                  </div>
                  {errors.agreeToTerms && (
                    <p className="text-red-500 text-xs">{errors.agreeToTerms.message}</p>
                  )}

                  {emailError && (
                    <p className="text-red-500 text-sm font-medium">{emailError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full py-3.5 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Sending..." : "Submit Booking Request"}
                  </button>
                </form>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

function FlightSummary({ flights }: { flights: Flight[] }) {
  if (!flights || flights.length === 0) return null;
  return (
    <div className="space-y-4">
      {flights.map((flight, i) => (
        <div key={i} className="bg-gradient-to-br from-[#4F8CFF]/8 to-[#62D4E3]/8 border border-[#4F8CFF]/15 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Plane className="w-4 h-4 text-[#4F8CFF]" />
            <span className="font-semibold text-gray-900 dark:text-white text-sm">Flight {i + 1} of {flights.length}</span>
          </div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-bold text-gray-900 dark:text-white text-2xl">{flight.departureTime}</div>
              <div className="text-gray-500 text-sm">{flight.originCode} · {flight.origin}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-400 text-xs flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDuration(flight.durationMinutes)}
              </div>
              <div className="text-xs text-gray-400">{stopsLabel(flight.stops)}</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-gray-900 dark:text-white text-2xl">{flight.arrivalTime}</div>
              <div className="text-gray-500 text-sm">{flight.destinationCode} · {flight.destination}</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-gray-500 border-t border-gray-100 pt-3">
            <span>{flight.airline} · {flight.flightNumber}</span>
            <span>{flight.cabin}</span>
            <span>{formatDate(flight.departureDate)}</span>
            <span className="ml-auto font-bold text-[#4F8CFF] text-base">{formatINR(flight.fare)}</span>
          </div>
        </div>
      ))}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 flex justify-between items-center font-bold text-gray-900 dark:text-white">
        <span>Grand Total</span>
        <span className="text-xl text-[#4F8CFF]">{formatINR(flights.reduce((s, f) => s + f.fare, 0))}</span>
      </div>
    </div>
  );
}

function SuccessView({ onClose }: { onClose: () => void }) {
  return (
    <div className="text-center py-12 px-4">
      <div className="success-icon w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
        <CheckCircle className="w-10 h-10 text-white" />
      </div>
      <h3 className="font-bold text-gray-900 dark:text-white text-2xl mb-3">Request Sent!</h3>
      <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-2">
        Thank you! We have received your details. Our team will contact you shortly.
      </p>
      <p className="text-gray-400 dark:text-gray-500 text-sm mb-8">Our team will respond within 24 hours.</p>
      <button onClick={onClose} className="btn-secondary px-8 py-3">
        Close
      </button>
    </div>
  );
}

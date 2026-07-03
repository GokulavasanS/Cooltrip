"use client";

import { useState } from "react";
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
import { buildWhatsAppURL } from "@/utils/whatsapp";
import { COUNTRIES } from "@/constants/countries";
import { slideInRight } from "@/utils/animation";

export default function PassengerModal() {
  const { selectedFlight, setSelectedFlight } = useFlightStore();
  const { isPassengerModalOpen, closePassengerModal } = useUIStore();
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PassengerSchema>({
    resolver: zodResolver(passengerSchema),
    defaultValues: { passengers: 1 },
  });

  const onSubmit = async (data: PassengerSchema) => {
    if (!selectedFlight) return;
    await submitPassengerRequest(data, selectedFlight);
    setSubmitted(true);
    // Open WhatsApp after a short delay so user sees the success animation first
    setTimeout(() => {
      window.open(buildWhatsAppURL(selectedFlight, data), "_blank");
    }, 1800);
  };

  const handleClose = () => {
    closePassengerModal();
    setSelectedFlight(null);
    setTimeout(() => { reset(); setSubmitted(false); }, 400);
  };

  if (!isPassengerModalOpen || !selectedFlight) return null;

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
          className="relative ml-auto w-full max-w-xl h-full bg-white shadow-2xl overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white/90 backdrop-blur z-10 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900 text-lg">Passenger Details</h2>
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
                <FlightSummary flight={selectedFlight} />

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
                  <h3 className="font-semibold text-gray-900">Your Information</h3>

                  <Field label="Full Name" error={errors.fullName?.message}>
                    <input {...register("fullName")} className="input-glass" placeholder="As on passport" />
                  </Field>

                  <Field label="Email Address" error={errors.email?.message}>
                    <input {...register("email")} type="email" className="input-glass" placeholder="you@example.com" />
                  </Field>

                  <Field label="Mobile Number" error={errors.phone?.message}>
                    <div className="flex gap-2 items-center">
                      <span className="input-glass w-16 text-center text-gray-600 font-medium shrink-0">+91</span>
                      <input
                        {...register("phone")}
                        type="tel"
                        className="input-glass flex-1"
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
                    <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                      I agree to the <span className="text-[#4F8CFF] cursor-pointer">Terms & Conditions</span>. I understand that CoolTrips will contact me via WhatsApp to complete this booking.
                    </label>
                  </div>
                  {errors.agreeToTerms && (
                    <p className="text-red-500 text-xs">{errors.agreeToTerms.message}</p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full py-3.5 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Request via WhatsApp"}
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

function FlightSummary({ flight }: { flight: Flight }) {
  if (!flight) return null;
  return (
    <div className="bg-gradient-to-br from-[#4F8CFF]/8 to-[#62D4E3]/8 border border-[#4F8CFF]/15 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Plane className="w-4 h-4 text-[#4F8CFF]" />
        <span className="font-semibold text-gray-900 text-sm">Selected Flight</span>
      </div>
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="font-bold text-gray-900 text-2xl">{flight.departureTime}</div>
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
          <div className="font-bold text-gray-900 text-2xl">{flight.arrivalTime}</div>
          <div className="text-gray-500 text-sm">{flight.destinationCode} · {flight.destination}</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-3 text-xs text-gray-500 border-t border-gray-100 pt-3">
        <span>{flight.airline} · {flight.flightNumber}</span>
        <span>{flight.cabin}</span>
        <span>{formatDate(flight.departureDate)}</span>
        <span className="ml-auto font-bold text-[#4F8CFF] text-base">{formatINR(flight.fare)}<span className="text-xs font-normal text-gray-400">/person</span></span>
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
      <h3 className="font-bold text-gray-900 text-2xl mb-3">Request Submitted!</h3>
      <p className="text-gray-500 leading-relaxed mb-2">
        Thank you for choosing CoolTrips. Opening WhatsApp to connect with our travel team...
      </p>
      <p className="text-gray-400 text-sm mb-8">Our expert will confirm your booking within 30 minutes.</p>
      <button onClick={onClose} className="btn-secondary px-8 py-3">
        Close
      </button>
    </div>
  );
}

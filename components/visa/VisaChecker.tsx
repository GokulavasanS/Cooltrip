"use client";

import { useState } from "react";
import emailjs from "@emailjs/browser";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Globe,
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  Briefcase,
  ChevronDown,
  ShieldCheck,
  AlertTriangle,
  Send,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { COUNTRIES } from "@/constants/countries";
import { fadeUp, staggerContainer } from "@/utils/animation";

const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_VISA!;
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;

const purposes = [
  { value: "tourist", label: "Tourist" },
  { value: "business", label: "Business" },
  { value: "student", label: "Student" },
  { value: "work", label: "Work" },
  { value: "transit", label: "Transit" },
];

const countryCodes = [
  { code: "+91", label: "IN +91" },
  { code: "+1", label: "US +1" },
  { code: "+44", label: "UK +44" },
  { code: "+61", label: "AU +61" },
  { code: "+971", label: "AE +971" },
  { code: "+65", label: "SG +65" },
  { code: "+60", label: "MY +60" },
  { code: "+66", label: "TH +66" },
  { code: "+94", label: "LK +94" },
  { code: "+977", label: "NP +977" },
  { code: "+880", label: "BD +880" },
  { code: "+960", label: "MV +960" },
  { code: "+966", label: "SA +966" },
  { code: "+974", label: "QA +974" },
  { code: "+965", label: "KW +965" },
  { code: "+973", label: "BH +973" },
  { code: "+968", label: "OM +968" },
  { code: "+64", label: "NZ +64" },
  { code: "+27", label: "ZA +27" },
  { code: "+39", label: "IT +39" },
  { code: "+34", label: "ES +34" },
  { code: "+31", label: "NL +31" },
  { code: "+33", label: "FR +33" },
  { code: "+49", label: "DE +49" },
  { code: "+81", label: "JP +81" },
  { code: "+82", label: "KR +82" },
  { code: "+84", label: "VN +84" },
];

type VisaStatus = "visa_free" | "visa_on_arrival" | "visa_required" | "no_visa";

const VISA_DATA: Record<string, { status: VisaStatus; note: string }> = {
  "United Arab Emirates": { status: "visa_on_arrival", note: "Visa on arrival for many nationalities. 30–60 days stay permitted depending on passport." },
  "Singapore": { status: "visa_free", note: "Visa-free entry for most nationalities. 30 days stay permitted." },
  "Thailand": { status: "visa_free", note: "Visa-free for many nationalities. 30–60 days stay permitted." },
  "Maldives": { status: "visa_on_arrival", note: "Visa on arrival for all nationalities. 30 days stay permitted." },
  "United Kingdom": { status: "visa_required", note: "Standard visitor visa required. Processing time: 15–30 days." },
  "United States": { status: "visa_required", note: "B1/B2 visitor visa required. Appointment wait times vary by location." },
  "France": { status: "visa_required", note: "Schengen visa required. Processing time: 15 calendar days." },
  "Japan": { status: "visa_required", note: "Visa required for most nationalities. Processing time: 5–7 working days." },
  "Malaysia": { status: "visa_free", note: "Visa-free entry for many nationalities. 30–90 days stay permitted." },
  "Sri Lanka": { status: "visa_on_arrival", note: "Visa on arrival or ETA available for most nationalities." },
  "Indonesia": { status: "visa_on_arrival", note: "Visa on arrival available for most nationalities. 30 days stay." },
  "Australia": { status: "visa_required", note: "Visitor visa (subclass 600) required. Processing time: 15–30 days." },
  "Canada": { status: "visa_required", note: "Temporary resident visa required. Processing time varies." },
  "Germany": { status: "visa_required", note: "Schengen visa required. Processing time: 15 calendar days." },
  "Italy": { status: "visa_required", note: "Schengen visa required. Appointment booking required." },
  "Switzerland": { status: "visa_required", note: "Schengen visa required. Processing time: 15 days." },
  "Netherlands": { status: "visa_required", note: "Schengen visa required. Processing time: 15 days." },
  "Qatar": { status: "visa_free", note: "Visa-free for many nationalities. 30 days stay permitted." },
  "Oman": { status: "visa_on_arrival", note: "Visa on arrival for many nationalities. 30 days stay." },
  "Kuwait": { status: "visa_required", note: "Visa required. E-visa available for some nationalities." },
  "South Korea": { status: "visa_required", note: "Visa required for most nationalities. K-ETA available for some." },
  "Vietnam": { status: "visa_free", note: "Visa-free for limited stay. E-visa also available for most." },
  "Nepal": { status: "visa_free", note: "Visa-free for Indian passport holders. Visa on arrival for others." },
  "Bhutan": { status: "visa_free", note: "Visa-free for Indian passport holders. Entry permit issued at border." },
  "Mauritius": { status: "visa_free", note: "Visa-free for most nationalities. 60–90 days stay." },
  "Seychelles": { status: "visa_free", note: "Visa-free for all nationalities. Travel authorization required." },
  "Saudi Arabia": { status: "visa_required", note: "Visa required. E-visa and visa on arrival available for some." },
  "New Zealand": { status: "visa_required", note: "Electronic Travel Authority (NZeTA) required for most." },
  "South Africa": { status: "visa_required", note: "Visa required for most nationalities. Processing time: 5–15 days." },
  "Spain": { status: "visa_required", note: "Schengen visa required. Processing time: 15 days." },
  "Bahrain": { status: "visa_on_arrival", note: "Visa on arrival or E-visa available for many nationalities." },
  "Bangladesh": { status: "visa_on_arrival", note: "Visa on arrival for many nationalities. 30 days stay." },
};

function getVisaStatus(nationality: string, destination: string): { status: VisaStatus; note: string } | null {
  if (!nationality || !destination) return null;
  if (nationality === destination) {
    return { status: "no_visa", note: "Domestic travel — no visa required. Happy journey!" };
  }
  return VISA_DATA[destination] ?? {
    status: "visa_required",
    note: "Visa requirements vary by nationality. Our visa specialists can help determine exactly what you need.",
  };
}

interface FormData {
  fullName: string;
  email: string;
  phoneCode: string;
  phoneNumber: string;
  nationality: string;
  destination: string;
  purpose: string;
  travelDate: string;
  lengthOfStay: string;
}

const initialForm: FormData = {
  fullName: "",
  email: "",
  phoneCode: "+91",
  phoneNumber: "",
  nationality: "",
  destination: "",
  purpose: "",
  travelDate: "",
  lengthOfStay: "",
};

export default function VisaChecker() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [result, setResult] = useState<{ status: VisaStatus; note: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState("");

  const update = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setResult(null);
  };

  const validate = (): boolean => {
    const errs: Partial<Record<keyof FormData, string>> = {};
    if (!form.fullName.trim()) errs.fullName = "Full name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email";
    if (!form.phoneNumber.trim()) errs.phoneNumber = "Phone number is required";
    else if (!/^\d{4,15}$/.test(form.phoneNumber.replace(/[\s-]/g, ""))) errs.phoneNumber = "Enter a valid phone number";
    if (!form.nationality) errs.nationality = "Select your nationality";
    if (!form.destination) errs.destination = "Select your destination";
    if (!form.purpose) errs.purpose = "Select purpose of travel";
    if (!form.travelDate) errs.travelDate = "Select travel date";
    if (!form.lengthOfStay.trim()) errs.lengthOfStay = "Enter length of stay";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const sendEmail = async (visaStatus: string, visaNote: string) => {
    setSubmitting(true);
    setEmailError("");
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          full_name: form.fullName,
          email: form.email,
          phone: `${form.phoneCode} ${form.phoneNumber}`,
          nationality: form.nationality,
          destination: form.destination,
          purpose: purposes.find((p) => p.value === form.purpose)?.label ?? form.purpose,
          travel_date: form.travelDate,
          length_of_stay: form.lengthOfStay,
          visa_status: visaStatus,
          visa_note: visaNote,
          to_email: "Reservation@cooltrip.org",
        },
        EMAILJS_PUBLIC_KEY
      );
      setEmailSent(true);
    } catch {
      setEmailError("Failed to send enquiry. Please try again or contact us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCheck = async () => {
    if (!validate()) return;
    const visa = getVisaStatus(form.nationality, form.destination);
    setResult(visa);
    // Send email with visa check details
    await sendEmail(
      visa?.status ?? "unknown",
      visa?.note ?? ""
    );
  };

  const handleEnquire = async () => {
    if (result) {
      await sendEmail(result.status, result.note);
    }
  };

  const needsVisa = result?.status === "visa_required";
  const noVisaNeeded = result?.status === "no_visa" || result?.status === "visa_free" || result?.status === "visa_on_arrival";

  return (
    <section className="py-24">
      <div className="max-w-5xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="text-center mb-14"
        >
          <motion.p variants={fadeUp} className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">
            Visa Checker
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Check Visa Requirements
          </motion.h2>
          <motion.p variants={fadeUp} className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Enter your details below to find out the visa requirements for your destination.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Form — 3/5 width */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={staggerContainer}
            className="lg:col-span-3 glass p-6 md:p-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <motion.div variants={fadeUp} className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                  <User className="w-3.5 h-3.5 inline mr-1.5" />
                  Full Name
                </label>
                <input
                  value={form.fullName}
                  onChange={(e) => update("fullName", e.target.value)}
                  className="input-glass"
                  placeholder="As on passport"
                />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
              </motion.div>

              {/* Email */}
              <motion.div variants={fadeUp}>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                  <Mail className="w-3.5 h-3.5 inline mr-1.5" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className="input-glass"
                  placeholder="you@example.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </motion.div>

              {/* Phone */}
              <motion.div variants={fadeUp}>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                  <Phone className="w-3.5 h-3.5 inline mr-1.5" />
                  Phone Number
                </label>
                <div className="flex gap-2 items-center">
                  <div className="relative shrink-0">
                    <select
                      value={form.phoneCode}
                      onChange={(e) => update("phoneCode", e.target.value)}
                      className="input-glass appearance-none pr-6 pl-2 text-sm"
                      style={{ width: "90px" }}
                    >
                      {countryCodes.map((c) => (
                        <option key={c.code} value={c.code}>{c.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                  </div>
                  <input
                    type="tel"
                    value={form.phoneNumber}
                    onChange={(e) => update("phoneNumber", e.target.value.replace(/[^0-9-]/g, ""))}
                    className="input-glass flex-1 min-w-0"
                    placeholder="Phone number"
                  />
                </div>
                {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
              </motion.div>

              {/* Nationality */}
              <motion.div variants={fadeUp}>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                  <Globe className="w-3.5 h-3.5 inline mr-1.5" />
                  Nationality
                </label>
                <div className="relative">
                  <select
                    value={form.nationality}
                    onChange={(e) => update("nationality", e.target.value)}
                    className="input-glass appearance-none w-full"
                  >
                    <option value="">Select nationality</option>
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                {errors.nationality && <p className="text-red-500 text-xs mt-1">{errors.nationality}</p>}
              </motion.div>

              {/* Destination */}
              <motion.div variants={fadeUp}>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                  <Globe className="w-3.5 h-3.5 inline mr-1.5" />
                  Destination Country
                </label>
                <div className="relative">
                  <select
                    value={form.destination}
                    onChange={(e) => update("destination", e.target.value)}
                    className="input-glass appearance-none w-full"
                  >
                    <option value="">Select destination</option>
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                {errors.destination && <p className="text-red-500 text-xs mt-1">{errors.destination}</p>}
              </motion.div>

              {/* Purpose of Travel */}
              <motion.div variants={fadeUp}>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                  <Briefcase className="w-3.5 h-3.5 inline mr-1.5" />
                  Purpose of Travel
                </label>
                <div className="relative">
                  <select
                    value={form.purpose}
                    onChange={(e) => update("purpose", e.target.value)}
                    className="input-glass appearance-none w-full"
                  >
                    <option value="">Select purpose</option>
                    {purposes.map((p) => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                {errors.purpose && <p className="text-red-500 text-xs mt-1">{errors.purpose}</p>}
              </motion.div>

              {/* Travel Date */}
              <motion.div variants={fadeUp}>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                  <Calendar className="w-3.5 h-3.5 inline mr-1.5" />
                  Intended Travel Date
                </label>
                <input
                  type="date"
                  value={form.travelDate}
                  onChange={(e) => update("travelDate", e.target.value)}
                  className="input-glass"
                  min={new Date().toISOString().split("T")[0]}
                />
                {errors.travelDate && <p className="text-red-500 text-xs mt-1">{errors.travelDate}</p>}
              </motion.div>

              {/* Length of Stay */}
              <motion.div variants={fadeUp}>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                  <Clock className="w-3.5 h-3.5 inline mr-1.5" />
                  Length of Stay
                </label>
                <input
                  value={form.lengthOfStay}
                  onChange={(e) => update("lengthOfStay", e.target.value)}
                  className="input-glass"
                  placeholder="e.g., 7 days, 2 weeks, 1 month"
                />
                {errors.lengthOfStay && <p className="text-red-500 text-xs mt-1">{errors.lengthOfStay}</p>}
              </motion.div>
            </div>

            {/* Check button */}
            <motion.div variants={fadeUp} className="mt-6">
              {emailError && <p className="text-red-500 text-sm mb-3">{emailError}</p>}
              <button
                onClick={handleCheck}
                disabled={submitting}
                className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 text-base disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>Sending...</>
                ) : (
                  <><Search className="w-4 h-4" /> Check Visa Requirements</>
                )}
              </button>
            </motion.div>
          </motion.div>

          {/* Result — 2/5 width sidebar */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={staggerContainer}
            className="lg:col-span-2"
          >
            <AnimatePresence mode="wait">
              {emailSent ? (
                <motion.div
                  key="success"
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="glass p-6 md:p-8 text-center"
                >
                  <div className="success-icon w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Details Received!</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    Thank you! We have received your details. Our team will contact you shortly.
                  </p>
                  {result && (
                    <div className={`mt-5 p-4 rounded-xl text-sm text-left ${
                      noVisaNeeded
                        ? "bg-green-50 dark:bg-green-900/20 border border-green-200 text-green-800 dark:text-green-300"
                        : "bg-amber-50 dark:bg-amber-900/20 border border-amber-200 text-amber-800 dark:text-amber-300"
                    }`}>
                      <p className="font-semibold mb-1">
                        {result.status === "no_visa" && "No Visa Required"}
                        {result.status === "visa_free" && "Visa-Free Travel"}
                        {result.status === "visa_on_arrival" && "Visa on Arrival"}
                        {result.status === "visa_required" && "Visa Required"}
                      </p>
                      <p className="leading-relaxed">{result.note}</p>
                    </div>
                  )}
                </motion.div>
              ) : result ? (
                <motion.div
                  key="result"
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className={`glass p-6 md:p-8 ${
                    noVisaNeeded
                      ? "border-l-4 border-l-green-500"
                      : needsVisa
                      ? "border-l-4 border-l-amber-500"
                      : ""
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${
                      noVisaNeeded
                        ? "bg-green-100 dark:bg-green-900/40"
                        : needsVisa
                        ? "bg-amber-100 dark:bg-amber-900/40"
                        : "bg-accent/10"
                    }`}
                  >
                    {noVisaNeeded ? (
                      <ShieldCheck className="w-7 h-7 text-green-600 dark:text-green-400" />
                    ) : (
                      <AlertTriangle className="w-7 h-7 text-amber-600 dark:text-amber-400" />
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {result.status === "no_visa" && "No Visa Required"}
                    {result.status === "visa_free" && "Visa-Free Travel"}
                    {result.status === "visa_on_arrival" && "Visa on Arrival"}
                    {result.status === "visa_required" && "Visa Required"}
                  </h3>

                  {/* Note */}
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6">
                    {result.note}
                  </p>

                  {/* Enquire Now button for visa_required */}
                  {needsVisa && (
                    <motion.div variants={fadeUp}>
                      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 rounded-xl p-4 mb-4">
                        <p className="text-amber-800 dark:text-amber-300 text-sm leading-relaxed">
                          A visa is required for your trip. Our visa specialists can assist you with the application process.
                        </p>
                      </div>
                      <button
                        onClick={handleEnquire}
                        disabled={submitting}
                        className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {submitting ? (
                          <>Sending...</>
                        ) : (
                          <>Enquire Now <ArrowRight className="w-4 h-4" /></>
                        )}
                      </button>
                    </motion.div>
                  )}

                  {/* For visa-free / visa-on-arrival */}
                  {noVisaNeeded && (
                    <motion.div variants={fadeUp}>
                      <button
                        onClick={handleEnquire}
                        disabled={submitting}
                        className="btn-secondary w-full mt-3 py-3 flex items-center justify-center gap-2 disabled:opacity-60"
                      >
                        {submitting ? "Sending..." : <>Have questions? Enquire via Email <ArrowRight className="w-4 h-4" /></>}
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="glass p-6 md:p-8 text-center"
                >
                  <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-5">
                    <Search className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    Ready to Check?
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                    Fill in your travel details on the left and click &ldquo;Check Visa Requirements&rdquo; to see the result here.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

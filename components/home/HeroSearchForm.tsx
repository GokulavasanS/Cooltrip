"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftRight, Search, ChevronDown, Plus, Trash2 } from "lucide-react";
import { Airport } from "@/types/airport";
import { CabinClass, FlightSearchParams, MultiCityLeg, TripType } from "@/types/flight";
import { useFlightStore } from "@/store/flightStore";
import { useUserStore } from "@/store/userStore";
import { flightService } from "@/services/api/flight";
import { todayISO } from "@/utils/date";
import AirportAutocomplete from "@/components/shared/AirportAutocomplete";

const CABINS: CabinClass[] = ["Economy", "Premium Economy", "Business", "First"];
const TABS: { label: string; value: TripType }[] = [
  { label: "One Way", value: "one-way" },
  { label: "Round Trip", value: "round-trip" },
  { label: "Multi-City", value: "multi-city" },
];

// ── Multi-city leg row ──────────────────────────────────────────────────────
interface LegState {
  origin: Airport | null;
  destination: Airport | null;
  date: string;
}

function makeLeg(): LegState {
  return { origin: null, destination: null, date: todayISO() };
}

export default function HeroSearchForm() {
  const router = useRouter();
  const { setResults, setSearchParams, setIsSearching, setSearchError } = useFlightStore();
  const { addRecentSearch } = useUserStore();

  const [tripType, setTripType] = useState<TripType>("one-way");
  const [origin, setOrigin] = useState<Airport | null>(null);
  const [destination, setDestination] = useState<Airport | null>(null);
  const [departDate, setDepartDate] = useState(todayISO());
  const [returnDate, setReturnDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [cabin, setCabin] = useState<CabinClass>("Economy");
  const [error, setError] = useState("");

  // ── Multi-city legs ────────────────────────────────────────────────────
  const [legs, setLegs] = useState<LegState[]>([makeLeg(), makeLeg()]);

  const updateLeg = (idx: number, patch: Partial<LegState>) => {
    setLegs((prev) => prev.map((l, i) => (i === idx ? { ...l, ...patch } : l)));
  };
  const addLeg = () => {
    if (legs.length < 5) setLegs((prev) => [...prev, makeLeg()]);
  };
  const removeLeg = (idx: number) => {
    if (legs.length > 2) setLegs((prev) => prev.filter((_, i) => i !== idx));
  };

  const swap = () => {
    const t = origin;
    setOrigin(destination);
    setDestination(t);
  };

  const handleSearch = async () => {
    setError("");

    if (tripType === "multi-city") {
      for (let i = 0; i < legs.length; i++) {
        if (!legs[i].origin || !legs[i].destination) {
          setError(`Please select both airports for flight ${i + 1}.`);
          return;
        }
        if (legs[i].origin?.code === legs[i].destination?.code) {
          setError(`Origin and destination cannot be the same for flight ${i + 1}.`);
          return;
        }
      }
    } else {
      if (!origin || !destination) {
        setError("Please select both origin and destination.");
        return;
      }
      if (origin.code === destination.code) {
        setError("Origin and destination cannot be the same.");
        return;
      }
    }

    const multiCityLegs: MultiCityLeg[] | undefined =
      tripType === "multi-city"
        ? legs.map((l) => ({
            originCode:      l.origin!.code,
            origin:          l.origin!.city,
            destinationCode: l.destination!.code,
            destination:     l.destination!.city,
            departureDate:   l.date,
          }))
        : undefined;

    const firstLeg = multiCityLegs?.[0];

    const params: FlightSearchParams = {
      origin:          tripType === "multi-city" ? (firstLeg?.origin ?? "") : origin!.city,
      originCode:      tripType === "multi-city" ? (firstLeg?.originCode ?? "") : origin!.code,
      destination:     tripType === "multi-city" ? (firstLeg?.destination ?? "") : destination!.city,
      destinationCode: tripType === "multi-city" ? (firstLeg?.destinationCode ?? "") : destination!.code,
      departureDate:   tripType === "multi-city" ? (firstLeg?.departureDate ?? todayISO()) : departDate,
      returnDate:      tripType === "round-trip" ? returnDate : undefined,
      adults,
      children: 0,
      cabin,
      tripType,
      multiCityLegs,
    };

    setSearchParams(params);
    setSearchError(null);
    addRecentSearch(params);
    setIsSearching(true);
    router.push("/flights");

    try {
      const { flights, error: apiError } = await flightService.search(params);
      setResults(flights);
      setSearchError(apiError);
    } catch {
      setResults([]);
      setSearchError("Something went wrong while searching for flights. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-white/10 p-6 w-full">
      {/* Tabs */}
      <div className="flex gap-1 mb-5 bg-gray-100 p-1 rounded-xl">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTripType(t.value)}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
              tripType === t.value
                ? "bg-white text-[#4F8CFF] shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Multi-city legs ─────────────────────────────────────────────── */}
      {tripType === "multi-city" ? (
        <div className="space-y-3 mb-3">
          {legs.map((leg, idx) => (
            <div
              key={idx}
              className="p-3 bg-gray-50 rounded-2xl border border-gray-200 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#4F8CFF] uppercase tracking-wider">
                  Flight {idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeLeg(idx)}
                  disabled={legs.length <= 2}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Origin / Destination */}
              <div className="flex gap-2">
                <div className="flex-1">
                  <AirportAutocomplete
                    id={`hero-mc-origin-${idx}`}
                    label="From"
                    placeholder="City or airport"
                    value={leg.origin}
                    onChange={(a) => updateLeg(idx, { origin: a })}
                  />
                </div>
                <div className="flex-1">
                  <AirportAutocomplete
                    id={`hero-mc-dest-${idx}`}
                    label="To"
                    placeholder="City or airport"
                    value={leg.destination}
                    onChange={(a) => updateLeg(idx, { destination: a })}
                  />
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Date
                </label>
                <input
                  type="date"
                  className="input-glass"
                  value={leg.date}
                  min={todayISO()}
                  onChange={(e) => updateLeg(idx, { date: e.target.value })}
                />
              </div>
            </div>
          ))}

          {legs.length < 5 && (
            <button
              type="button"
              onClick={addLeg}
              className="flex items-center gap-2 text-sm font-semibold text-[#4F8CFF] hover:text-[#3a7aee] transition-colors"
            >
              <Plus className="w-4 h-4" /> Add another flight
            </button>
          )}
        </div>
      ) : (
        /* ── Standard one-way / round-trip ────────────────────────────── */
        <>
          {/* Origin / Destination with swap */}
          <div className="relative flex gap-2 mb-3 items-end">
            <div className="flex-1">
              <AirportAutocomplete
                id="hero-origin"
                label="From"
                placeholder="City or airport"
                value={origin}
                onChange={setOrigin}
              />
            </div>
            <button
              type="button"
              onClick={swap}
              className="w-9 h-9 mb-0.5 shrink-0 bg-gray-100 hover:bg-[#4F8CFF]/10 border border-gray-200 rounded-xl flex items-center justify-center transition-colors self-end"
              style={{ marginBottom: "2px" }}
            >
              <ArrowLeftRight className="w-4 h-4 text-[#4F8CFF]" />
            </button>
            <div className="flex-1">
              <AirportAutocomplete
                id="hero-destination"
                label="To"
                placeholder="City or airport"
                value={destination}
                onChange={setDestination}
              />
            </div>
          </div>

          {/* Departure date */}
          <div className="mb-3">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Departure Date
            </label>
            <input
              type="date"
              className="input-glass"
              value={departDate}
              min={todayISO()}
              onChange={(e) => setDepartDate(e.target.value)}
            />
          </div>

          {/* Return date (round-trip only) */}
          {tripType === "round-trip" && (
            <div className="mb-3">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Return Date
              </label>
              <input
                type="date"
                className="input-glass"
                value={returnDate}
                min={departDate}
                onChange={(e) => setReturnDate(e.target.value)}
              />
            </div>
          )}
        </>
      )}

      {/* Passengers + Cabin */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Passengers
          </label>
          <div className="relative">
            <select
              className="input-glass appearance-none"
              value={adults}
              onChange={(e) => setAdults(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                <option key={n} value={n}>
                  {n} Adult{n > 1 ? "s" : ""}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Cabin Class
          </label>
          <div className="relative">
            <select
              className="input-glass appearance-none"
              value={cabin}
              onChange={(e) => setCabin(e.target.value as CabinClass)}
            >
              {CABINS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {error && <p className="text-red-500 text-xs mb-3">{error}</p>}

      <button
        onClick={handleSearch}
        className="btn-primary w-full py-3.5 flex items-center justify-center gap-2"
      >
        <Search className="w-4 h-4" />
        Search Flights
      </button>
    </div>
  );
}

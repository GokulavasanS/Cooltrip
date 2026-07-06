"use client";

import { useState } from "react";
import { ArrowLeftRight, Search, ChevronDown, Edit2, Plus, Trash2 } from "lucide-react";
import { Airport } from "@/types/airport";
import { CabinClass, TripType, FlightSearchParams, MultiCityLeg } from "@/types/flight";
import { useFlightStore } from "@/store/flightStore";
import { useUserStore } from "@/store/userStore";
import { flightService } from "@/services/api/flight";
import { todayISO, formatDateShort } from "@/utils/date";
import AirportAutocomplete from "@/components/shared/AirportAutocomplete";

const CABINS: CabinClass[] = ["Economy", "Premium Economy", "Business", "First"];

// ── Multi-city leg row ──────────────────────────────────────────────────────
interface LegState {
  origin: Airport | null;
  destination: Airport | null;
  date: string;
}

function makeLeg(date?: string): LegState {
  return { origin: null, destination: null, date: date ?? todayISO() };
}

export default function SearchPanel() {
  const { setResults, setSearchParams, setIsSearching, setSearchError, searchParams } =
    useFlightStore();
  const { addRecentSearch } = useUserStore();
  const [expanded, setExpanded] = useState(!searchParams);

  // ── Form state — pre-fill from last search ─────────────────────────────
  const [tripType, setTripType] = useState<TripType>(
    searchParams?.tripType ?? "one-way"
  );
  const [origin, setOrigin] = useState<Airport | null>(
    searchParams
      ? { code: searchParams.originCode, city: searchParams.origin, name: "", country: "" }
      : null
  );
  const [destination, setDestination] = useState<Airport | null>(
    searchParams
      ? {
          code: searchParams.destinationCode,
          city: searchParams.destination,
          name: "",
          country: "",
        }
      : null
  );
  const [departDate, setDepartDate] = useState(
    searchParams?.departureDate ?? todayISO()
  );
  const [returnDate, setReturnDate] = useState(searchParams?.returnDate ?? "");
  const [adults, setAdults] = useState(searchParams?.adults ?? 1);
  const [children, setChildren] = useState(searchParams?.children ?? 0);
  const [cabin, setCabin] = useState<CabinClass>(searchParams?.cabin ?? "Economy");
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

  const swapAirports = () => {
    const t = origin;
    setOrigin(destination);
    setDestination(t);
  };

  // ── Handle search ──────────────────────────────────────────────────────
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
        setError("Please select both airports.");
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
      children,
      cabin,
      tripType,
      multiCityLegs,
    };

    setIsSearching(true);
    setSearchError(null);
    setSearchParams(params);
    addRecentSearch(params);
    setExpanded(false);

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

  // ── Collapsed summary bar ──────────────────────────────────────────────
  if (!expanded && searchParams) {
    const isMC = searchParams.tripType === "multi-city";
    return (
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-white">
          {isMC ? (
            <span>
              Multi-City &nbsp;·&nbsp;{" "}
              {searchParams.multiCityLegs?.length ?? 0} legs
            </span>
          ) : (
            <>
              <span>{searchParams.originCode}</span>
              <ArrowLeftRight className="w-4 h-4 text-[#4F8CFF]" />
              <span>{searchParams.destinationCode}</span>
            </>
          )}
        </div>
        <span className="text-gray-400 text-sm">·</span>
        <span className="text-gray-700 text-sm">
          {formatDateShort(searchParams.departureDate)}
        </span>
        <span className="text-gray-400 text-sm">·</span>
        <span className="text-gray-700 text-sm">
          {searchParams.adults} Passenger{searchParams.adults > 1 ? "s" : ""},{" "}
          {searchParams.cabin}
        </span>
        <button
          onClick={() => setExpanded(true)}
          className="ml-auto flex items-center gap-1.5 text-sm font-semibold text-[#4F8CFF] hover:underline"
        >
          <Edit2 className="w-3.5 h-3.5" /> Edit Search
        </button>
      </div>
    );
  }

  // ── Expanded full form ─────────────────────────────────────────────────
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-white/10 p-5 shadow-sm">
      {/* Trip type tabs */}
      <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-xl w-fit">
        {(["one-way", "round-trip", "multi-city"] as TripType[]).map((t) => (
          <button
            key={t}
            onClick={() => setTripType(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all capitalize ${
              tripType === t
                ? "bg-white dark:bg-gray-800 text-[#4F8CFF] shadow-sm"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            {t === "one-way" ? "One Way" : t === "round-trip" ? "Round Trip" : "Multi-City"}
          </button>
        ))}
      </div>

      {/* ── Multi-city legs ─────────────────────────────────────────────── */}
      {tripType === "multi-city" ? (
        <div className="space-y-3 mb-3">
          {legs.map((leg, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto_auto] gap-3 items-end p-3 bg-gray-50 rounded-xl border border-gray-200"
            >
              {/* Leg label */}
              <div className="md:col-span-4">
                <span className="text-xs font-bold text-[#4F8CFF] uppercase tracking-wider">
                  Flight {idx + 1}
                </span>
              </div>

              {/* Origin */}
              <AirportAutocomplete
                id={`mc-origin-${idx}`}
                label="From"
                placeholder="City or airport"
                value={leg.origin}
                onChange={(a) => updateLeg(idx, { origin: a })}
              />

              {/* Destination */}
              <AirportAutocomplete
                id={`mc-dest-${idx}`}
                label="To"
                placeholder="City or airport"
                value={leg.destination}
                onChange={(a) => updateLeg(idx, { destination: a })}
              />

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

              {/* Remove */}
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => removeLeg(idx)}
                  disabled={legs.length <= 2}
                  className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Remove flight"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
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
        /* ── Standard one-way / round-trip grid ──────────────────────── */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
          {/* Origin */}
          <div className="relative">
            <AirportAutocomplete
              id="sp-origin"
              label="From"
              placeholder="City or airport"
              value={origin}
              onChange={setOrigin}
            />
            <button
              type="button"
              onClick={swapAirports}
              className="hidden md:flex absolute -right-4 top-7 z-20 w-8 h-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-full shadow-sm items-center justify-center hover:bg-[#4F8CFF]/10 transition-all"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-[#4F8CFF]" />
            </button>
          </div>

          {/* Destination */}
          <AirportAutocomplete
            id="sp-destination"
            label="To"
            placeholder="City or airport"
            value={destination}
            onChange={setDestination}
          />

          {/* Departure */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Departure
            </label>
            <input
              type="date"
              className="input-glass"
              value={departDate}
              min={todayISO()}
              onChange={(e) => setDepartDate(e.target.value)}
            />
          </div>

          {/* Return */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Return{" "}
              {tripType === "one-way" && (
                <span className="text-gray-300">(optional)</span>
              )}
            </label>
            <input
              type="date"
              className="input-glass disabled:opacity-40"
              value={returnDate}
              min={departDate}
              disabled={tripType === "one-way"}
              onChange={(e) => setReturnDate(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* ── Passengers + Cabin + Search ──────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 items-end">
        {/* Adults */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Adults
          </label>
          <div className="relative">
            <select
              className="input-glass appearance-none w-full"
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

        {/* Children */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Children
          </label>
          <div className="relative">
            <select
              className="input-glass appearance-none"
              value={children}
              onChange={(e) => setChildren(Number(e.target.value))}
            >
              {[0, 1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n} Child{n !== 1 ? "ren" : ""}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Cabin */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Cabin
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

        {/* Search */}
        <button
          onClick={handleSearch}
          className="btn-primary flex items-center justify-center gap-2 py-3 w-full"
        >
          <Search className="w-4 h-4" />
          Search
        </button>
      </div>

      {error && <p className="mt-3 text-sm text-red-500 font-medium">{error}</p>}
    </div>
  );
}

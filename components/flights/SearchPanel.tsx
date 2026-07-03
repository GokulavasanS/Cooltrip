"use client";

import { useState } from "react";
import { ArrowLeftRight, Search, ChevronDown, Edit2 } from "lucide-react";
import { Airport } from "@/types/airport";
import { CabinClass, TripType, FlightSearchParams } from "@/types/flight";
import { useFlightStore } from "@/store/flightStore";
import { useUserStore } from "@/store/userStore";
import { flightService } from "@/services/api/flight";
import { todayISO, formatDateShort } from "@/utils/date";
import AirportAutocomplete from "@/components/shared/AirportAutocomplete";

const CABINS: CabinClass[] = ["Economy", "Premium Economy", "Business", "First"];

export default function SearchPanel() {
  const { setResults, setSearchParams, setIsSearching, searchParams } = useFlightStore();
  const { addRecentSearch } = useUserStore();
  const [expanded, setExpanded] = useState(!searchParams); // expanded when no prior search

  // Form state — pre-fill from last search if available
  const [tripType, setTripType] = useState<TripType>(searchParams?.tripType ?? "one-way");
  const [origin, setOrigin] = useState<Airport | null>(
    searchParams ? { code: searchParams.originCode, city: searchParams.origin, name: "", country: "" } : null
  );
  const [destination, setDestination] = useState<Airport | null>(
    searchParams ? { code: searchParams.destinationCode, city: searchParams.destination, name: "", country: "" } : null
  );
  const [departDate, setDepartDate] = useState(searchParams?.departureDate ?? todayISO());
  const [returnDate, setReturnDate] = useState(searchParams?.returnDate ?? "");
  const [adults, setAdults] = useState(searchParams?.adults ?? 1);
  const [children, setChildren] = useState(searchParams?.children ?? 0);
  const [cabin, setCabin] = useState<CabinClass>(searchParams?.cabin ?? "Economy");
  const [error, setError] = useState("");

  const swapAirports = () => {
    const t = origin;
    setOrigin(destination);
    setDestination(t);
  };

  const handleSearch = async () => {
    if (!origin || !destination) {
      setError("Please select both airports.");
      return;
    }
    if (origin.code === destination.code) {
      setError("Origin and destination cannot be the same.");
      return;
    }
    setError("");

    const params: FlightSearchParams = {
      origin: origin.city,
      originCode: origin.code,
      destination: destination.city,
      destinationCode: destination.code,
      departureDate: departDate,
      returnDate: tripType === "round-trip" ? returnDate : undefined,
      adults,
      children,
      cabin,
      tripType,
    };

    setIsSearching(true);
    setSearchParams(params);
    addRecentSearch(params);
    setExpanded(false);

    try {
      const results = await flightService.search(params);
      setResults(results);
    } catch {
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // ── Collapsed summary bar ──
  if (!expanded && searchParams) {
    return (
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 font-bold text-gray-900">
          <span>{searchParams.originCode}</span>
          <ArrowLeftRight className="w-4 h-4 text-[#4F8CFF]" />
          <span>{searchParams.destinationCode}</span>
        </div>
        <span className="text-gray-400 text-sm">·</span>
        <span className="text-gray-700 text-sm">{formatDateShort(searchParams.departureDate)}</span>
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

  // ── Expanded full form ──
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
      {/* Trip type */}
      <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-xl w-fit">
        {(["one-way", "round-trip"] as TripType[]).map((t) => (
          <button
            key={t}
            onClick={() => setTripType(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all capitalize ${
              tripType === t ? "bg-white text-[#4F8CFF] shadow-sm" : "text-gray-500"
            }`}
          >
            {t === "one-way" ? "One Way" : "Round Trip"}
          </button>
        ))}
      </div>

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
            className="hidden md:flex absolute -right-4 top-7 z-20 w-8 h-8 bg-white border border-gray-200 rounded-full shadow-sm items-center justify-center hover:bg-[#4F8CFF]/10 transition-all"
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
            {tripType === "one-way" && <span className="text-gray-300">(optional)</span>}
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

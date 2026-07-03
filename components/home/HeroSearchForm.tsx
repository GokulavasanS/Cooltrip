"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftRight, Search, ChevronDown } from "lucide-react";
import { Airport } from "@/types/airport";
import { CabinClass, FlightSearchParams, TripType } from "@/types/flight";
import { useFlightStore } from "@/store/flightStore";
import { useUserStore } from "@/store/userStore";
import { flightService } from "@/services/api/flight";
import { todayISO } from "@/utils/date";
import AirportAutocomplete from "@/components/shared/AirportAutocomplete";

const CABINS: CabinClass[] = ["Economy", "Premium Economy", "Business", "First"];
const TABS: { label: string; value: TripType }[] = [
  { label: "One Way", value: "one-way" },
  { label: "Round Trip", value: "round-trip" },
];

export default function HeroSearchForm() {
  const router = useRouter();
  const { setResults, setSearchParams, setIsSearching } = useFlightStore();
  const { addRecentSearch } = useUserStore();

  const [tripType, setTripType] = useState<TripType>("one-way");
  const [origin, setOrigin] = useState<Airport | null>(null);
  const [destination, setDestination] = useState<Airport | null>(null);
  const [departDate, setDepartDate] = useState(todayISO());
  const [adults, setAdults] = useState(1);
  const [cabin, setCabin] = useState<CabinClass>("Economy");
  const [error, setError] = useState("");

  const swap = () => {
    const t = origin;
    setOrigin(destination);
    setDestination(t);
  };

  const handleSearch = async () => {
    if (!origin || !destination) {
      setError("Please select both origin and destination.");
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
      adults,
      children: 0,
      cabin,
      tripType,
    };

    setSearchParams(params);
    addRecentSearch(params);
    setIsSearching(true);
    router.push("/flights");

    try {
      const results = await flightService.search(params);
      setResults(results);
    } catch {
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 w-full">
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

      {/* Date */}
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
                <option key={c} value={c}>{c}</option>
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

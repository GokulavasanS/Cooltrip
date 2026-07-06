"use client";

import { useState } from "react";
import { useFlightStore } from "@/store/flightStore";
import { AIRLINES } from "@/constants/airlines";

interface Filters {
  maxPrice: number;
  stops: number | null;
  cabin: string | null;
  refundable: boolean;
  airlines: string[];
}

interface FlightFiltersProps {
  onFilterChange: (f: Filters) => void;
}

const MAX_PRICE = 200000;

export default function FlightFilters({ onFilterChange }: FlightFiltersProps) {
  const { results } = useFlightStore();
  const maxFare = results.length > 0 ? Math.max(...results.map((r) => r.fare)) : MAX_PRICE;

  const [maxPrice, setMaxPrice] = useState(maxFare);
  const [stops, setStops] = useState<number | null>(null);
  const [cabin, setCabin] = useState<string | null>(null);
  const [refundable, setRefundable] = useState(false);
  const [airlines, setAirlines] = useState<string[]>([]);

  const presentAirlines = [...new Set(results.map((r) => r.airline))];

  const apply = (patch: Partial<Filters>) => {
    const next = { maxPrice, stops, cabin, refundable, airlines, ...patch };
    setMaxPrice(next.maxPrice);
    setStops(next.stops);
    setCabin(next.cabin);
    setRefundable(next.refundable);
    setAirlines(next.airlines);
    onFilterChange(next);
  };

  const toggleAirline = (name: string) => {
    const next = airlines.includes(name)
      ? airlines.filter((a) => a !== name)
      : [...airlines, name];
    apply({ airlines: next });
  };

  return (
    <div className="glass p-5 space-y-6">
      <h3 className="font-bold text-gray-900 dark:text-white">Filters</h3>

      {/* Price */}
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-500 dark:text-gray-400 font-medium">Max Price</span>
          <span className="font-bold text-[#4F8CFF]">₹{maxPrice.toLocaleString("en-IN")}</span>
        </div>
        <input
          type="range"
          min={5000}
          max={maxFare}
          step={1000}
          value={maxPrice}
          onChange={(e) => apply({ maxPrice: Number(e.target.value) })}
          className="w-full accent-[#4F8CFF]"
        />
      </div>

      {/* Stops */}
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Stops</p>
        <div className="space-y-1.5">
          {[
            { label: "Any", value: null },
            { label: "Non-stop", value: 0 },
            { label: "1 Stop", value: 1 },
            { label: "2+ Stops", value: 2 },
          ].map((opt) => (
            <label key={String(opt.value)} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="stops"
                checked={stops === opt.value}
                onChange={() => apply({ stops: opt.value })}
                className="accent-[#4F8CFF]"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Airlines */}
      {presentAirlines.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Airlines</p>
          <div className="space-y-1.5">
            {presentAirlines.map((name) => (
              <label key={name} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={airlines.includes(name)}
                  onChange={() => toggleAirline(name)}
                  className="accent-[#4F8CFF]"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                  {name}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Refundable */}
      <label className="flex items-center gap-2.5 cursor-pointer">
        <input
          type="checkbox"
          checked={refundable}
          onChange={(e) => apply({ refundable: e.target.checked })}
          className="accent-[#4F8CFF]"
        />
        <span className="text-sm text-gray-700 dark:text-gray-300">Refundable only</span>
      </label>

      {/* Reset */}
      <button
        onClick={() => {
          setMaxPrice(maxFare);
          setStops(null);
          setCabin(null);
          setRefundable(false);
          setAirlines([]);
          onFilterChange({ maxPrice: maxFare, stops: null, cabin: null, refundable: false, airlines: [] });
        }}
        className="text-sm text-[#4F8CFF] hover:underline font-medium"
      >
        Reset filters
      </button>
    </div>
  );
}

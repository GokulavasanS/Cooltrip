"use client";

import { SortOption } from "@/types/flight";

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: "Cheapest", value: "cheapest" },
  { label: "Fastest", value: "fastest" },
  { label: "Earliest", value: "earliest" },
  { label: "Latest", value: "latest" },
  { label: "Best Value", value: "best" },
];

interface FlightSortBarProps {
  value: SortOption;
  onChange: (v: SortOption) => void;
  count: number;
}

export default function FlightSortBar({ value, onChange, count }: FlightSortBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
      <p className="text-sm text-gray-500 font-medium">
        <span className="font-bold text-gray-900">{count}</span> flights found
      </p>
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 flex-wrap">
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              value === opt.value
                ? "bg-white text-[#4F8CFF] shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

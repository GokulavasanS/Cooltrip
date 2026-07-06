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
      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
        <span className="font-bold text-gray-900 dark:text-white">{count}</span> flights found
      </p>
      <div className="flex gap-1 bg-gray-100 dark:bg-white/5 rounded-xl p-1 flex-wrap">
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              value === opt.value
                ? "bg-white dark:bg-white/10 text-[#4F8CFF] shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

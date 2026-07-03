"use client";

import { useState, useRef, useEffect } from "react";
import { MapPin, X } from "lucide-react";
import { Airport } from "@/types/airport";
import { useAirportSearch } from "@/hooks/useAirportSearch";

interface AirportAutocompleteProps {
  id: string;
  label: string;
  placeholder: string;
  value: Airport | null;
  onChange: (airport: Airport) => void;
}

export default function AirportAutocomplete({ id, label, placeholder, value, onChange }: AirportAutocompleteProps) {
  const [query, setQuery] = useState(value ? `${value.city} (${value.code})` : "");
  const [open, setOpen] = useState(false);
  const { results, search, clear } = useAirportSearch();
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync when value changes externally
  useEffect(() => {
    setQuery(value ? `${value.city} (${value.code})` : "");
  }, [value]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleInput = (val: string) => {
    setQuery(val);
    setOpen(true);
    search(val);
  };

  const handleSelect = (airport: Airport) => {
    onChange(airport);
    setQuery(`${airport.city} (${airport.code})`);
    setOpen(false);
    clear();
  };

  const handleClear = () => {
    setQuery("");
    clear();
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <label htmlFor={id} className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <div className="relative flex items-center">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4F8CFF] pointer-events-none z-10" />
        <input
          id={id}
          type="text"
          className="input-glass pl-9 pr-8 w-full"
          placeholder={placeholder}
          value={query}
          onChange={(e) => handleInput(e.target.value)}
          onFocus={() => { if (query) setOpen(true); }}
          autoComplete="off"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 glass rounded-2xl overflow-hidden z-50 shadow-xl">
          {results.map((airport) => (
            <button
              key={airport.code}
              type="button"
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#4F8CFF]/8 text-left transition-colors"
              onClick={() => handleSelect(airport)}
            >
              <span className="w-10 h-10 rounded-xl bg-[#4F8CFF]/10 text-[#4F8CFF] font-bold text-sm flex items-center justify-center shrink-0">
                {airport.code}
              </span>
              <div>
                <div className="font-medium text-gray-900 text-sm">{airport.city}</div>
                <div className="text-gray-400 text-xs truncate max-w-[200px]">{airport.name}</div>
              </div>
              <div className="ml-auto text-gray-400 text-xs">{airport.country}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

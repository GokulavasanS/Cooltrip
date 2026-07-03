import type { Metadata } from "next";
import SearchPanel from "@/components/flights/SearchPanel";
import FlightResults from "@/components/flights/FlightResults";
import PassengerModal from "@/components/flights/PassengerModal";
import SelectionPanel from "@/components/flights/SelectionPanel";
import RecentSearches from "@/components/flights/RecentSearches";

export const metadata: Metadata = {
  title: "Flight Search",
  description:
    "Search and compare thousands of flights. Find the best price and let CoolTrips handle your booking personally.",
};

export default function FlightsPage() {
  return (
    <>
      <div className="min-h-screen bg-gray-50 pt-20">
        {/* Search bar */}
        <div className="bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-xs text-gray-400">Home</span>
              <span className="text-gray-300 text-xs">/</span>
              <span className="text-xs text-gray-600 font-medium">Flight Search</span>
            </div>
            <SearchPanel />
            <RecentSearches />
          </div>
        </div>

        {/* Results + selection panel */}
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex gap-6 items-start">
            {/* Main results (filters + cards) */}
            <div className="flex-1 min-w-0">
              <FlightResults />
            </div>

            {/* Sticky selection panel — only visible on lg+ */}
            <div className="hidden lg:block">
              <SelectionPanel />
            </div>
          </div>
        </div>
      </div>

      {/* Passenger form modal (used on mobile + after CTA in selection panel) */}
      <PassengerModal />
    </>
  );
}

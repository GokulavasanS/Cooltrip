import { Plane, Compass } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="glass py-16 px-6 text-center border border-gray-100/50 shadow-xl relative overflow-hidden rounded-3xl">
      {/* Background radial highlight */}
      <div className="absolute inset-0 bg-radial-at-t from-[#4F8CFF]/5 via-transparent to-transparent pointer-events-none" />
      
      {/* Dynamic Animated Radar/Scanner Circle */}
      <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
        {/* Pulse effect */}
        <div className="absolute inset-0 rounded-full bg-[#4F8CFF]/5 border border-[#4F8CFF]/10 animate-ping duration-[3000ms]" />
        <div className="absolute w-16 h-16 rounded-full bg-[#62D4E3]/10 border border-[#62D4E3]/20 animate-pulse" />
        
        {/* Plane icon rotated */}
        <div className="z-10 w-12 h-12 rounded-2xl bg-gradient-to-br from-[#4F8CFF] to-[#62D4E3] shadow-lg flex items-center justify-center transform -rotate-45 hover:rotate-12 transition-transform duration-500">
          <Plane className="w-6 h-6 text-white" />
        </div>
      </div>

      <h3 className="font-bold text-gray-900 dark:text-white text-2xl mb-3 tracking-tight">
        Sky is Clear (No Flights Found)
      </h3>
      
      <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed mb-6">
        We checked the skies and couldn&apos;t find any cached flight prices for this exact route and date. Every seat seems to have taken wing on this schedule!
      </p>

      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl text-xs text-gray-600 dark:text-gray-400 font-medium shadow-sm">
        <Compass className="w-3.5 h-3.5 text-[#4F8CFF] shrink-0" />
        <span>Try adjusting filters, or explore different dates and nearby airports.</span>
      </div>
    </div>
  );
}

import { Plane } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="glass py-20 text-center">
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center mx-auto mb-6">
        <Plane className="w-10 h-10 text-gray-300" />
      </div>
      <h3 className="font-bold text-gray-900 text-xl mb-2">No flights found</h3>
      <p className="text-gray-400 text-sm max-w-xs mx-auto">
        Try adjusting your search filters or choosing different dates and airports.
      </p>
    </div>
  );
}

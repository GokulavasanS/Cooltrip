export default function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="glass p-6 space-y-3">
          <div className="flex gap-4">
            <div className="skeleton w-10 h-10 rounded-xl shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-4 w-32 rounded" />
              <div className="skeleton h-3 w-20 rounded" />
            </div>
            <div className="skeleton h-8 w-24 rounded-xl" />
          </div>
          <div className="flex gap-4 items-center">
            <div className="skeleton h-6 w-16 rounded" />
            <div className="skeleton h-2 flex-1 rounded-full" />
            <div className="skeleton h-6 w-16 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

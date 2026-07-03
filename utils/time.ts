/** Convert total minutes to "2h 30m" format */
export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

/** Return stop label: "Non-stop", "1 Stop", "2 Stops" */
export function stopsLabel(stops: number): string {
  if (stops === 0) return "Non-stop";
  return stops === 1 ? "1 Stop" : `${stops} Stops`;
}

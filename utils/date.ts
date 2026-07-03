import { format, parseISO } from "date-fns";

/** Format ISO date string to "15 Jul 2025" */
export function formatDate(iso: string): string {
  return format(parseISO(iso), "dd MMM yyyy");
}

/** Format ISO date string to "Mon, 15 Jul" */
export function formatDateShort(iso: string): string {
  return format(parseISO(iso), "EEE, dd MMM");
}

/** Return today's ISO date string */
export function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

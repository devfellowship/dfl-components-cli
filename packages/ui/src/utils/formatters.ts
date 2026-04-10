/**
 * Shared formatters — ported from dfl-learn/formatters.ts
 * Identical patterns found across dfl-financing, dfl-payments, dfl-learn, dfl-documents.
 */

/** Format a number as BRL currency: R$ 1.234,56 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

/** Format an ISO date string as DD/MM/YYYY HH:MM */
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Format an ISO date string as DD/MM/YYYY (date only) */
export function formatDateShort(date: string): string {
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/** Format an ISO date string as "abr. 2026" */
export function formatMonthYear(date: string): string {
  return new Date(date).toLocaleDateString("pt-BR", {
    month: "short",
    year: "numeric",
  });
}

/**
 * Format a date as relative time: "3 minutes ago", "2 days ago", etc.
 * Language: English (suitable for international UIs).
 */
export function formatRelativeTime(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return `${years} ${years === 1 ? "year" : "years"} ago`;
  if (months > 0) return `${months} ${months === 1 ? "month" : "months"} ago`;
  if (days > 0) return `${days} ${days === 1 ? "day" : "days"} ago`;
  if (hours > 0) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  if (minutes > 0) return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  return `${seconds} ${seconds === 1 ? "second" : "seconds"} ago`;
}

/** Shorten a UUID-style id to "xxxxxxxx...xxxxxxxx" */
export function shortenId(id: string): string {
  return `${id.slice(0, 8)}...${id.slice(-8)}`;
}

/** Format seconds to mm:ss or hh:mm:ss */
export function formatDuration(seconds: number): string {
  if (!seconds) return "00:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

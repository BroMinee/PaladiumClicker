"use client";

/**
 * This component is an attempt to display the date in the client side timezone, since the server side is in UTC.
 * @param timestamp The timestamp to display, in seconds
 * @param withTime Whether to display the time as well (hours and minutes)
 */
export function QdfDate({
  timestamp,
  withTime = false,
}: {
  timestamp: number;
  withTime?: boolean;
}) {
  const formatted = new Date(timestamp * 1000).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    ...(withTime && { hour: "2-digit", minute: "2-digit" }),
  });

  return <>{formatted}</>;
}

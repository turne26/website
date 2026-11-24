"use client";
/*
 * "N people are already on the Turne waitlist." Uses the live count from StatsProvider and
 * stays hidden until it is a number worth showing a brand. Never shows the placeholder figure.
 */
import { useStats } from "@/components/live";

const MIN_TO_SHOW = 1000;

export function AudienceNote() {
  const { count, live, values } = useStats();
  if (!live || count < MIN_TO_SHOW) return null;
  return (
    <p className="b-audience"><b>{values.count}</b> people are already on the Turne waitlist, waiting for launch.</p>
  );
}

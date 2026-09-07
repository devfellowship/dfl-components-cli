// Origin: agent
import React from "react";
import { Check, Globe, Lock, Star, BookOpen, Play, Circle, CircleHelp, Clock, Link, ExternalLink, type LucideIcon } from "lucide-react";
import type { RoadmapLegend as Legend, RoadmapTone } from "./contract";
import { toneStyle } from "./appearance";
// Explicit registry keeps the root bundle small. Unknown authored glyphs show a question mark.
const glyphs: Record<string, LucideIcon> = { check: Check, globe: Globe, lock: Lock, star: Star, "book-open": BookOpen, play: Play, circle: Circle, clock: Clock, link: Link, "external-link": ExternalLink };
export function RoadmapBadge({ name = "check", tone = "neutral", label, className = "" }: { name?: string; tone?: RoadmapTone; label?: string; className?: string }) {
  const Glyph = glyphs[name] ?? CircleHelp;
  return <span aria-label={label} aria-hidden={label ? undefined : true} style={toneStyle(tone)} className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-[var(--c-roadmap-border)] bg-[var(--c-roadmap-node-bg)] text-[var(--c-roadmap-node-fg)] ${className}`}><Glyph size={12} aria-hidden="true" /></span>;
}
export function RoadmapLegendView({ legend, testIdPrefix = "roadmap" }: { legend: Legend; testIdPrefix?: string }) {
  return <aside data-testid={`${testIdPrefix}-legend`} aria-label="Legend" className="min-w-0 rounded-[var(--radius)] border-2 border-[var(--c-roadmap-border)] bg-[var(--c-roadmap-neutral-bg)] p-3 text-[var(--c-roadmap-neutral-fg)]">
    <ul className="m-0 flex list-none flex-wrap gap-3 p-0">{legend.entries.map(entry => <li key={entry.id} className="flex min-w-0 items-center gap-2 text-xs leading-normal"><RoadmapBadge name={entry.icon} tone={entry.tone} /><span className="[overflow-wrap:anywhere]">{entry.label}</span></li>)}</ul>
  </aside>;
}

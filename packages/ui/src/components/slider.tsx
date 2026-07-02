"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "../lib/utils";

/**
 * Slider — DFL Design System v0
 *
 * Tokens consumed (Layer 3 — see tokens.css → --c-slider-*):
 *   --c-slider-track-h             track height              4px
 *   --c-slider-track-bg            empty track fill          → --s-border-subtle
 *   --c-slider-range-bg            filled range fill         → --s-brand-solid
 *   --c-slider-thumb-size          thumb diameter            20px
 *   --c-slider-thumb-bg            thumb fill                → --s-surface-page
 *   --c-slider-thumb-border        thumb border color        → --s-brand-solid
 *   --c-slider-thumb-shadow        base drop shadow
 *   --c-slider-thumb-hover-shadow  hover halo (7px amber rgba)
 *   --c-slider-thumb-focus-shadow  DS uniform ring (0 0 0 2px bg + 0 0 0 3px amber)
 *
 * States:
 *   hover    → amber-400 border + soft 7px rgba halo via --c-slider-thumb-hover-shadow
 *   focus    → DS uniform box-shadow ring, transition:none (instant per DS spec)
 *   disabled → opacity-50, pointer-events-none, not-allowed cursor
 *
 * @param showTicks  Render tick marks below the track at each step boundary.
 *                   Ticks before the current value are amber-tinted.
 */
function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  step = 1,
  showTicks = false,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root> & {
  showTicks?: boolean;
}) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max],
  );

  // Tick positions as percentages 0–100
  const tickPositions = React.useMemo<number[]>(() => {
    if (!showTicks || !step || step <= 0) return [];
    const range = max - min;
    if (range <= 0) return [];
    const positions: number[] = [];
    for (let v = min; v <= max + Number.EPSILON; v += step) {
      positions.push(((Math.min(v, max) - min) / range) * 100);
    }
    return positions;
  }, [showTicks, step, min, max]);

  // Threshold for amber-tinted ticks: everything up to first thumb value
  const fillPct = React.useMemo(() => {
    const first = _values[0] ?? min;
    return ((first - min) / (max - min)) * 100;
  }, [_values, min, max]);

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      step={step}
      className={cn(
        "relative flex w-full touch-none items-center select-none",
        "data-[disabled]:opacity-50 data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed",
        "data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44",
        "data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          // 4px slim track (down from h-4 / 16px) via DS token
          "bg-[var(--c-slider-track-bg)] relative grow overflow-visible rounded-full",
          "data-[orientation=horizontal]:h-[var(--c-slider-track-h)] data-[orientation=horizontal]:w-full",
          "data-[orientation=vertical]:h-full data-[orientation=vertical]:w-[var(--c-slider-track-h)]",
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className="bg-[var(--c-slider-range-bg)] absolute rounded-full data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
        />

        {/* Tick marks — rendered when showTicks=true and tick count is reasonable (≤ 51) */}
        {tickPositions.length > 0 && tickPositions.length <= 51 && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0"
            style={{ top: "calc(100% + 5px)" }}
          >
            {tickPositions.map((pct) => (
              <div
                key={pct}
                className={cn(
                  "absolute top-0 h-1 w-px -translate-x-1/2",
                  pct <= fillPct + Number.EPSILON
                    ? "bg-[var(--c-slider-range-bg)] opacity-45"
                    : "bg-[var(--s-border-strong)]",
                )}
                style={{ left: `${pct}%` }}
              />
            ))}
          </div>
        )}
      </SliderPrimitive.Track>

      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          className={cn(
            // shape + size via DS tokens
            "block shrink-0 rounded-full outline-none",
            "size-[var(--c-slider-thumb-size)]",
            // colors via DS tokens
            "bg-[var(--c-slider-thumb-bg)]",
            "border-2 border-[var(--c-slider-thumb-border)]",
            // base drop shadow
            "shadow-[var(--c-slider-thumb-shadow)]",
            // smooth transition for hover only
            "transition-[box-shadow,border-color] duration-[120ms] ease-out",
            // hover: brighter amber border + soft rgba halo (replaces old ring-4)
            "hover:border-[var(--s-brand-hover)]",
            "hover:shadow-[var(--c-slider-thumb-hover-shadow)]",
            // focus: DS uniform ring via box-shadow, instant (no transition per DS spec)
            "focus-visible:shadow-[var(--c-slider-thumb-focus-shadow)]",
            "focus-visible:transition-none",
            // disabled
            "disabled:pointer-events-none disabled:cursor-not-allowed",
          )}
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };

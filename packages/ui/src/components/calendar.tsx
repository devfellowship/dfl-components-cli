import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "../lib/utils";

/**
 * Calendar — DFL Design System v0
 *
 * Tokens consumed (Layer 3 — component knobs):
 *   --c-cal-{bg,border,radius,padding}
 *   --c-cal-nav-btn-{bg,bg-hover,fg,fg-hover,border,border-hover,radius}
 *   --c-cal-{caption-fg,head-fg}
 *   --c-cal-day-{radius,fg,bg-hover,fg-outside}
 *   --c-cal-day-today-{bg,fg,border}    ← tinted, NOT filled (distinct from selected)
 *   --c-cal-day-selected-{bg,fg,bg-hover}
 *   --c-cal-range-{mid,end}-{bg,fg}
 *   --c-cal-day-disabled-fg
 *
 * Focus ring: box-shadow 0 0 0 2px --c-cal-bg, 0 0 0 3px #E07A4A applied to
 * nav buttons and day cells via :focus-visible (uniform DS amber spec).
 *
 * Key fixes vs. vanilla shadcn:
 *   - Today uses tinted bg + border, NOT the same solid fill as selected.
 *   - Nav buttons use surface-elevation tokens, NOT raw opacity tricks.
 *   - Disabled days use --s-ink-disabled at 0.45, cursor:not-allowed.
 *   - Range mid uses amber-14% tint with zero radius; start/end have
 *     half-rounded corners per DS radius spec.
 */
export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "p-[var(--c-cal-padding)] bg-[var(--c-cal-bg)] border border-[var(--c-cal-border)] rounded-[var(--c-cal-radius)]",
        className,
      )}
      classNames={{
        months: "flex flex-col sm:flex-row gap-4",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium text-[var(--c-cal-caption-fg)]",
        nav: "flex items-center gap-1",
        nav_button: cn(
          // size + layout
          "h-7 w-7 p-0 inline-flex items-center justify-center cursor-pointer",
          // surface — uses nav-btn tokens, NOT raw opacity
          "rounded-[var(--c-cal-nav-btn-radius)] border border-[var(--c-cal-nav-btn-border)]",
          "bg-[var(--c-cal-nav-btn-bg)] text-[var(--c-cal-nav-btn-fg)]",
          // hover — surface-elevation hierarchy, NOT opacity-50 → opacity-100
          "hover:bg-[var(--c-cal-nav-btn-bg-hover)] hover:text-[var(--c-cal-nav-btn-fg-hover)]",
          "hover:border-[var(--c-cal-nav-btn-border-hover)]",
          // focus ring — uniform DS amber spec (box-shadow: 0 0 0 2px bg, 0 0 0 3px amber)
          "focus-visible:outline-none",
          "focus-visible:shadow-[0_0_0_2px_var(--c-cal-bg),0_0_0_3px_#E07A4A]",
          "transition-[background-color,color,border-color] duration-[120ms]",
          "disabled:pointer-events-none disabled:opacity-40",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse",
        head_row: "flex",
        head_cell:
          "text-[var(--c-cal-head-fg)] rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: cn(
          "h-9 w-9 text-center text-sm p-0 relative",
          // range mid cells: the amber-tint band is applied at cell level so
          // adjacent mid-buttons form a visually continuous strip.
          "[&:has([aria-selected].day-range-middle)]:bg-[var(--c-cal-range-mid-bg)]",
          // range end: right-side cap rounding at cell level
          "[&:has([aria-selected].day-range-end)]:rounded-r-[var(--c-cal-day-radius)]",
          // first/last non-middle selected cells: left/right cap rounding
          "first:[&:has([aria-selected]:not(.day-range-middle))]:rounded-l-[var(--c-cal-day-radius)]",
          "last:[&:has([aria-selected]:not(.day-range-middle))]:rounded-r-[var(--c-cal-day-radius)]",
          "focus-within:relative focus-within:z-20",
        ),
        day: cn(
          "h-9 w-9 p-0 font-normal inline-flex items-center justify-center cursor-pointer",
          // base surface
          "rounded-[var(--c-cal-day-radius)] bg-transparent text-[var(--c-cal-day-fg)]",
          "hover:bg-[var(--c-cal-day-bg-hover)]",
          "aria-selected:opacity-100",
          // focus ring — uniform DS amber spec
          "focus-visible:outline-none focus-visible:relative focus-visible:z-10",
          "focus-visible:shadow-[0_0_0_2px_var(--c-cal-bg),0_0_0_3px_#E07A4A]",
          "transition-[background-color,color,border-color] duration-[120ms]",
        ),
        // Selected: solid amber fill + dark inverse text.
        // Uses ! to win when today is also selected (today uses tinted bg, must yield).
        day_selected: cn(
          "!bg-[var(--c-cal-day-selected-bg)] !text-[var(--c-cal-day-selected-fg)] font-semibold",
          "hover:!bg-[var(--c-cal-day-selected-bg-hover)] hover:!text-[var(--c-cal-day-selected-fg)]",
          "!border-transparent",
          "focus-visible:!bg-[var(--c-cal-day-selected-bg)] focus-visible:!text-[var(--c-cal-day-selected-fg)]",
        ),
        // Today: amber 12%-opacity tinted bg + 30% amber border.
        // Visually DISTINCT from selected (tint vs solid fill).
        // When today is also selected, day_selected's ! overrides win.
        day_today: cn(
          "bg-[var(--c-cal-day-today-bg)] text-[var(--c-cal-day-today-fg)] font-medium",
          "border border-[var(--c-cal-day-today-border)]",
        ),
        day_outside: cn(
          "day-outside text-[var(--c-cal-day-fg-outside)] opacity-100",
          // outside days inside a range: show dimmed tint
          "aria-selected:bg-[var(--c-cal-range-mid-bg)] aria-selected:text-[var(--c-cal-day-fg-outside)] aria-selected:opacity-60",
        ),
        // Disabled: --s-ink-disabled at 0.45, cursor:not-allowed, no hover bg.
        // NOT the raw opacity-50 class — uses the DS disabled ink token.
        day_disabled: cn(
          "text-[var(--c-cal-day-disabled-fg)] opacity-45",
          "cursor-not-allowed disabled:cursor-not-allowed",
          "hover:!bg-transparent",
        ),
        // Range middle: amber-14% tint, zero radius (continuous square interior strip).
        // Uses ! to override the base rounded and hover-bg from `day`.
        day_range_middle: cn(
          "!bg-[var(--c-cal-range-mid-bg)] !text-[var(--c-cal-range-mid-fg)]",
          "!rounded-none",
          "hover:!bg-[var(--c-cal-range-mid-bg)]",
        ),
        // Range start: solid amber fill, left-rounded + right-square cap.
        day_range_start: cn(
          "!bg-[var(--c-cal-range-end-bg)] !text-[var(--c-cal-range-end-fg)] font-semibold",
          "!rounded-l-[var(--c-cal-day-radius)] !rounded-r-none",
          "hover:!bg-[var(--c-cal-day-selected-bg-hover)]",
        ),
        // Range end: solid amber fill, right-rounded + left-square cap.
        // The `day-range-end` CSS class is kept for the cell-level
        // [&:has([aria-selected].day-range-end)] selector above.
        day_range_end: cn(
          "day-range-end",
          "!bg-[var(--c-cal-range-end-bg)] !text-[var(--c-cal-range-end-fg)] font-semibold",
          "!rounded-r-[var(--c-cal-day-radius)] !rounded-l-none",
          "hover:!bg-[var(--c-cal-day-selected-bg-hover)]",
        ),
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };

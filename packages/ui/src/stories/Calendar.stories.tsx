import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import type { DateRange } from "react-day-picker";
import { Calendar } from "../components/calendar";

const meta: Meta<typeof Calendar> = {
  title: "Components/Organisms/Calendar",
  component: Calendar,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof Calendar>;

/* ─────────────────────────────────────────────────────────────────────────
 * Helper: stable "today" reference so stories don't shift on re-render.
 * ───────────────────────────────────────────────────────────────────────── */
const today = new Date();
const todayYear = today.getFullYear();
const todayMonth = today.getMonth(); // 0-indexed

/* ─────────────────────────────────────────────────────────────────────────
 * Story 1 — Default (single mode, no selection)
 * Shows the base panel bg, nav buttons, caption, head cells, day cells and
 * today's tinted highlight.  No date is pre-selected.
 * ───────────────────────────────────────────────────────────────────────── */
const DefaultRender = () => {
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      defaultMonth={today}
    />
  );
};

export const Default: Story = {
  name: "Default (no selection)",
  render: () => <DefaultRender />,
};

/* ─────────────────────────────────────────────────────────────────────────
 * Story 2 — Today (today highlighted, no selection)
 * Today's cell must show the amber-12% tinted bg + 30% amber border that
 * is visually DISTINCT from the solid selected fill.
 * ───────────────────────────────────────────────────────────────────────── */
const TodayRender = () => (
  <Calendar
    mode="single"
    selected={undefined}
    onSelect={() => {}}
    defaultMonth={today}
  />
);

export const Today: Story = {
  name: "Today (highlighted, not selected)",
  render: () => <TodayRender />,
};

/* ─────────────────────────────────────────────────────────────────────────
 * Story 3 — Selected (single mode, one date picked)
 * Selected day uses --c-cal-day-selected-bg (brand-solid amber fill) with
 * --p-sand-950 inverse text.  Hover on selected shifts to --s-brand-hover.
 * ───────────────────────────────────────────────────────────────────────── */
const SelectedRender = () => {
  // Pick a date a week after today so it's visible in the current month view
  const preSelected = new Date(todayYear, todayMonth, today.getDate() + 7);
  const [date, setDate] = React.useState<Date | undefined>(preSelected);
  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      defaultMonth={today}
    />
  );
};

export const Selected: Story = {
  name: "Selected (single date picked)",
  render: () => <SelectedRender />,
};

/* ─────────────────────────────────────────────────────────────────────────
 * Story 4 — Keyboard Focus
 * Demonstrates the uniform amber focus ring (box-shadow: 0 0 0 2px bg,
 * 0 0 0 3px #E07A4A) on both nav buttons and day cells via :focus-visible.
 * The play function tabs into the calendar so Storybook renders the ring.
 * ───────────────────────────────────────────────────────────────────────── */
const KeyboardFocusRender = () => {
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      defaultMonth={today}
    />
  );
};

export const KeyboardFocus: Story = {
  name: "Keyboard Focus (nav button + day cell)",
  render: () => <KeyboardFocusRender />,
  play: async ({ canvasElement }) => {
    // Focus the "next month" nav button to show the focus ring.
    // Tab once more (done via requestAnimationFrame) to show a day cell ring.
    const nextBtn = canvasElement.querySelector(
      '[aria-label="Go to next month"], button[name="next-month"], .rdp-nav_button_next',
    ) as HTMLButtonElement | null;
    if (nextBtn) {
      nextBtn.focus();
    }
  },
};

/* ─────────────────────────────────────────────────────────────────────────
 * Story 5 — Disabled Dates
 * A mix of disabled + normal days.  Disabled days use --c-cal-day-disabled-fg
 * (--s-ink-disabled) at 0.45 opacity, cursor:not-allowed, no hover bg.
 * Weekends are disabled in this story to produce a clear visual pattern.
 * ───────────────────────────────────────────────────────────────────────── */
const isWeekend = (date: Date) =>
  date.getDay() === 0 || date.getDay() === 6;

const DisabledDatesRender = () => {
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      disabled={isWeekend}
      defaultMonth={today}
    />
  );
};

export const DisabledDates: Story = {
  name: "Disabled Dates (weekends disabled)",
  render: () => <DisabledDatesRender />,
};

/* ─────────────────────────────────────────────────────────────────────────
 * Story 6 — Range (mode='range', numberOfMonths=2)
 * Shows range-start / range-mid / range-end states:
 *   start/end  → --c-cal-range-end-bg solid fill, half-rounded corners
 *   mid        → --c-cal-range-mid-bg (amber-14% tint), zero radius
 * Pre-seeds a range spanning ~3 weeks so all three states are visible.
 * ───────────────────────────────────────────────────────────────────────── */
const RangeRender = () => {
  const rangeFrom = new Date(todayYear, todayMonth, 7);
  const rangeTo   = new Date(todayYear, todayMonth + 1, 11);

  const [range, setRange] = React.useState<DateRange | undefined>({
    from: rangeFrom,
    to:   rangeTo,
  });

  return (
    <Calendar
      mode="range"
      selected={range}
      onSelect={setRange}
      numberOfMonths={2}
      defaultMonth={new Date(todayYear, todayMonth)}
    />
  );
};

export const Range: Story = {
  name: "Range (2 months, with start / mid / end)",
  render: () => <RangeRender />,
};

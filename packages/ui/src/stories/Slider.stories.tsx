import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Slider } from "../components/slider";

const meta: Meta<typeof Slider> = {
  title: "Components/Atoms/Slider",
  component: Slider,
};

export default meta;
type Story = StoryObj<typeof Slider>;

/**
 * Single thumb at 40%, 4px track height, amber fill, --c-slider-* tokens applied.
 */
export const Default: Story = {
  render: () => (
    <Slider defaultValue={[40]} max={100} step={1} className="w-[320px]" />
  ),
};

/**
 * Dual thumbs at 20%–70%, amber inter-thumb fill, --c-slider-* tokens applied.
 */
export const Range: Story = {
  render: () => (
    <Slider defaultValue={[20, 70]} max={100} step={1} className="w-[320px]" />
  ),
};

/**
 * Frozen hover state: amber-400 border + soft 7px rgba(224,122,74,0.18) halo.
 * A scoped CSS override forces the hover visual for Storybook documentation.
 */
export const Hover: Story = {
  render: () => (
    <>
      <style>{`
        .ds-slider-hover-frozen [data-slot="slider-thumb"] {
          border-color: var(--s-brand-hover) !important;
          box-shadow: var(--c-slider-thumb-hover-shadow) !important;
          transition: none !important;
        }
      `}</style>
      <div className="ds-slider-hover-frozen">
        <Slider defaultValue={[62]} max={100} step={1} className="w-[320px]" />
      </div>
    </>
  ),
};

/**
 * Keyboard-focused thumb: DS uniform ring (0 0 0 2px page-bg, 0 0 0 3px amber).
 * Value tooltip is shown above the thumb to document the focused interaction.
 * The first thumb is programmatically focused on mount.
 */
export const Focused: Story = {
  render: () => <FocusedSlider />,
};

function FocusedSlider() {
  const [values, setValues] = React.useState([55]);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const thumb = containerRef.current?.querySelector<HTMLButtonElement>(
      '[data-slot="slider-thumb"]',
    );
    thumb?.focus();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", paddingTop: "32px", width: "320px" }}
    >
      {/* Value tooltip — surfaces on focus per DS spec */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: `${values[0]}%`,
          transform: "translateX(-50%)",
          background: "var(--s-surface-elevated)",
          border: "1px solid var(--s-border-strong)",
          color: "var(--s-ink-primary)",
          fontSize: "11px",
          fontFamily: "var(--s-font-mono)",
          fontWeight: 500,
          padding: "3px 8px",
          borderRadius: "4px",
          whiteSpace: "nowrap",
          pointerEvents: "none",
          zIndex: 2,
        }}
      >
        {values[0]}
      </div>
      <Slider
        value={values}
        onValueChange={setValues}
        max={100}
        step={1}
        className="w-[320px]"
      />
    </div>
  );
}

/**
 * Single thumb at 30%, opacity-50, pointer-events-none, not-allowed cursor.
 */
export const Disabled: Story = {
  render: () => (
    <Slider
      defaultValue={[30]}
      max={100}
      step={1}
      disabled
      className="w-[320px]"
    />
  ),
};

/**
 * step=25 with five tick marks at 0/25/50/75/100.
 * Ticks at or before the thumb value (50) are amber-tinted; remaining use border-subtle.
 */
export const Step: Story = {
  render: () => (
    <div style={{ paddingBottom: "16px" }}>
      <Slider
        defaultValue={[50]}
        min={0}
        max={100}
        step={25}
        showTicks
        className="w-[320px]"
      />
    </div>
  ),
};

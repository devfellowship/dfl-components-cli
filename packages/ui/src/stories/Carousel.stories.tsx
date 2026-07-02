import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselDots,
} from "../components/carousel";
import { Card, CardContent } from "../components/card";

/**
 * Carousel — DFL Design System v0
 *
 * One story = one state (per DS "1 story = 1 state" rule).
 *
 * Token audit:
 *   --c-carousel-nav-{bg,border,fg}         → default nav button (elevated bg, subtle border)
 *   --c-carousel-nav-{bg,border,fg}-hover   → hover + focus-visible (brand-subtle, amber ink)
 *   --c-carousel-nav-fg-disabled            → disabled state (ink-disabled, no opacity hack)
 *   --c-carousel-dot-{bg,active}            → pagination indicators
 *   Carousel region: tabIndex={0} + ds-focus-ring for keyboard users (Arrow keys navigate)
 *   Nav buttons: ds-focus-ring on :focus-visible (amber outline via .ds-focus-ring rule)
 *
 * Stories:
 *   Default        — slide 1 active, prev disabled, next enabled
 *   Mid            — middle slide, both nav buttons enabled
 *   Last           — last slide, next disabled
 *   NavButtonFocus — next button focused (amber ring + brand-hover state)
 *   Vertical       — orientation="vertical", up/down arrows, slide 1
 *   MultiItem      — basis-1/3 items per view, dots show page count (not slide count)
 */

const meta: Meta<typeof Carousel> = {
  title: "Components/Organisms/Carousel",
  component: Carousel,
};

export default meta;
type Story = StoryObj<typeof Carousel>;

/** Shared helper: N numbered slide cards */
const NumberedSlides = ({ count = 5 }: { count?: number }) => (
  <CarouselContent>
    {Array.from({ length: count }).map((_, index) => (
      <CarouselItem key={index}>
        <div className="p-1">
          <Card>
            <CardContent className="flex aspect-square items-center justify-center p-6">
              <span className="text-4xl font-semibold">{index + 1}</span>
            </CardContent>
          </Card>
        </div>
      </CarouselItem>
    ))}
  </CarouselContent>
);

/**
 * Default — slide 1 active.
 * Prev button: disabled (ink-disabled, transparent bg, border unchanged — no opacity hack).
 * Next button: enabled (elevated bg, subtle border, secondary ink).
 * Dots: first dot active (brand-solid/amber), rest inactive.
 */
export const Default: Story = {
  render: () => (
    <Carousel className="w-full max-w-xs" opts={{ startIndex: 0 }}>
      <NumberedSlides />
      <CarouselPrevious />
      <CarouselNext />
      <CarouselDots />
    </Carousel>
  ),
};

/**
 * Mid — middle slide active, both nav buttons enabled.
 * Shows the "both enabled" state: prev + next receive full nav button styling.
 * Hover treatment visible on interaction: brand-subtle bg + brand-border + amber-400 arrow.
 * Dot 3 active.
 */
export const Mid: Story = {
  render: () => (
    <Carousel className="w-full max-w-xs" opts={{ startIndex: 2 }}>
      <NumberedSlides />
      <CarouselPrevious />
      <CarouselNext />
      <CarouselDots />
    </Carousel>
  ),
};

/**
 * Last — last slide active.
 * Next button: disabled (ink-disabled color, transparent bg, border unchanged — NOT opacity).
 * Prev button: enabled.
 * Last dot active.
 */
export const Last: Story = {
  render: () => (
    <Carousel className="w-full max-w-xs" opts={{ startIndex: 4 }}>
      <NumberedSlides />
      <CarouselPrevious />
      <CarouselNext />
      <CarouselDots />
    </Carousel>
  ),
};

/**
 * NavButtonFocus — next button receives keyboard focus.
 * Shows the uniform DFL focus ring: amber outline via .ds-focus-ring:focus-visible.
 * Button also gains brand-subtle bg + brand-border + amber-400 arrow on focus.
 * Focus is applied via React.useEffect to simulate keyboard focus state in the story.
 */
const NavButtonFocusDemo = () => {
  const nextRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    // Simulate keyboard focus so the story renders with the focus state visible.
    nextRef.current?.focus();
  }, []);

  return (
    <Carousel className="w-full max-w-xs" opts={{ startIndex: 2 }}>
      <NumberedSlides />
      <CarouselPrevious />
      <CarouselNext ref={nextRef} />
      <CarouselDots />
    </Carousel>
  );
};

export const NavButtonFocus: Story = {
  render: () => <NavButtonFocusDemo />,
};

/**
 * Vertical — orientation="vertical".
 * Up/down arrow buttons positioned above/below the track.
 * Slide 1 active: up (prev) button disabled, down (next) enabled.
 * Keyboard: ArrowUp = prev, ArrowDown = next.
 */
export const Vertical: Story = {
  render: () => (
    <Carousel
      orientation="vertical"
      className="w-full max-w-xs"
      opts={{ startIndex: 0 }}
    >
      <CarouselContent className="h-[240px]">
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} className="pt-0">
            <div className="p-1 h-full">
              <Card className="h-full">
                <CardContent className="flex h-full items-center justify-center p-6">
                  <span className="text-4xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
      <CarouselDots />
    </Carousel>
  ),
};

/**
 * MultiItem — three items visible per view (basis-1/3 + gap).
 * 6 slides / 3 per page = 2 scroll snaps.
 * Dots reflect page count (2 dots), not slide count (6).
 * The 4th item peeks at the right edge in a real scrollable context.
 */
export const MultiItem: Story = {
  render: () => (
    <Carousel
      className="w-full max-w-sm"
      opts={{ startIndex: 0, align: "start" }}
    >
      <CarouselContent className="-ml-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <CarouselItem key={index} className="basis-1/3 pl-2">
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-4">
                  <span className="text-2xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
      {/* CarouselDots reads scrollSnapList().length → 2 snaps for 6 slides / 3 per page */}
      <CarouselDots />
    </Carousel>
  ),
};

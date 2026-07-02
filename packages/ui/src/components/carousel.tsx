"use client";

import * as React from "react";
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react";
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from "lucide-react";

import { cn } from "../lib/utils";

/**
 * Carousel — DFL Design System v0
 *
 * Tokens consumed:
 *   --c-carousel-nav-{bg,border,fg}            default nav button state
 *   --c-carousel-nav-{bg,border,fg}-hover      hover + focus state
 *   --c-carousel-nav-fg-disabled               disabled arrow color (no opacity hack)
 *   --c-carousel-dot-{bg,active}               pagination indicator
 *   --c-carousel-{dot-radius,radius}            shape knobs
 *   backed by --s-surface-elevated, --s-ink-*, --s-brand-*, --s-border-*
 *
 * New in this revision:
 *   • Nav buttons styled with --c-carousel-nav-* tokens (amber hover/focus, no generic outline)
 *   • Carousel region receives tabIndex={0} + ds-focus-ring for keyboard users
 *   • Nav buttons receive ds-focus-ring for uniform DFL amber outline on :focus-visible
 *   • CarouselDots — pagination indicators that auto-detect scroll-snap count
 *   • Vertical orientation: ArrowUp/ArrowDown navigation (horizontal: ArrowLeft/ArrowRight)
 */

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
};

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context;
}

function Carousel({
  orientation = "horizontal",
  opts,
  setApi,
  plugins,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & CarouselProps) {
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y",
    },
    plugins,
  );
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const onSelect = React.useCallback((api: CarouselApi) => {
    if (!api) return;
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = React.useCallback(() => {
    api?.scrollNext();
  }, [api]);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (orientation === "vertical") {
        if (event.key === "ArrowUp") {
          event.preventDefault();
          scrollPrev();
        } else if (event.key === "ArrowDown") {
          event.preventDefault();
          scrollNext();
        }
      } else {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          scrollPrev();
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          scrollNext();
        }
      }
    },
    [scrollPrev, scrollNext, orientation],
  );

  React.useEffect(() => {
    if (!api || !setApi) return;
    setApi(api);
  }, [api, setApi]);

  React.useEffect(() => {
    if (!api) return;
    onSelect(api);
    api.on("reInit", onSelect);
    api.on("select", onSelect);

    return () => {
      api?.off("select", onSelect);
    };
  }, [api, onSelect]);

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api: api,
        opts,
        orientation:
          orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }}
    >
      {/*
       * tabIndex={0}: makes the region keyboard-focusable so Arrow keys navigate slides.
       * ds-focus-ring: applies the DFL uniform amber focus ring on :focus-visible.
       * outline-none: suppresses the default browser focus rectangle (ds-focus-ring takes over).
       */}
      <div
        onKeyDownCapture={handleKeyDown}
        className={cn("relative outline-none ds-focus-ring", className)}
        role="region"
        aria-roledescription="carousel"
        data-slot="carousel"
        tabIndex={0}
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

function CarouselContent({ className, ...props }: React.ComponentProps<"div">) {
  const { carouselRef, orientation } = useCarousel();

  return (
    <div
      ref={carouselRef}
      className="overflow-hidden"
      data-slot="carousel-content"
    >
      <div
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className,
        )}
        {...props}
      />
    </div>
  );
}

function CarouselItem({ className, ...props }: React.ComponentProps<"div">) {
  const { orientation } = useCarousel();

  return (
    <div
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className,
      )}
      {...props}
    />
  );
}

/**
 * CarouselPrevious
 *
 * Styled with --c-carousel-nav-* tokens (not the generic Button variant="outline").
 * States:
 *   default  → elevated bg, subtle border, secondary ink
 *   hover    → brand-subtle bg, brand-border, amber-hover ink
 *   focus    → same as hover + ds-focus-ring outline
 *   disabled → transparent bg, subtle border, ink-disabled (no opacity hack)
 */
const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();

  return (
    <button
      ref={ref}
      data-slot="carousel-previous"
      aria-label="Previous slide"
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      className={cn(
        // shape + layout
        "absolute size-8 rounded-full",
        "inline-flex items-center justify-center",
        // default state — DS tokens
        "border border-[var(--c-carousel-nav-border)]",
        "bg-[var(--c-carousel-nav-bg)]",
        "text-[var(--c-carousel-nav-fg)]",
        // motion
        "transition-[border-color,background-color,color]",
        "duration-[var(--p-duration-fast)]",
        // hover — brand-subtle bg + brand-border + amber ink
        "hover:bg-[var(--c-carousel-nav-bg-hover)]",
        "hover:border-[var(--c-carousel-nav-border-hover)]",
        "hover:text-[var(--c-carousel-nav-fg-hover)]",
        // focus-visible — same as hover + ds-focus-ring (see tokens.css)
        "outline-none ds-focus-ring",
        "focus-visible:bg-[var(--c-carousel-nav-bg-hover)]",
        "focus-visible:border-[var(--c-carousel-nav-border-hover)]",
        "focus-visible:text-[var(--c-carousel-nav-fg-hover)]",
        // disabled — ink-disabled, transparent bg, border unchanged; no opacity hack
        "disabled:pointer-events-none",
        "disabled:bg-transparent",
        "disabled:border-[var(--c-carousel-nav-border)]",
        "disabled:text-[var(--c-carousel-nav-fg-disabled)]",
        // positioning
        orientation === "horizontal"
          ? "top-1/2 -left-12 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2",
        className,
      )}
      {...props}
    >
      {orientation === "horizontal" ? (
        <ArrowLeft className="size-4" aria-hidden="true" />
      ) : (
        <ArrowUp className="size-4" aria-hidden="true" />
      )}
      <span className="sr-only">Previous slide</span>
    </button>
  );
});
CarouselPrevious.displayName = "CarouselPrevious";

/**
 * CarouselNext
 *
 * Mirror of CarouselPrevious. Disabled when no more slides to scroll.
 */
const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel();

  return (
    <button
      ref={ref}
      data-slot="carousel-next"
      aria-label="Next slide"
      disabled={!canScrollNext}
      onClick={scrollNext}
      className={cn(
        "absolute size-8 rounded-full",
        "inline-flex items-center justify-center",
        "border border-[var(--c-carousel-nav-border)]",
        "bg-[var(--c-carousel-nav-bg)]",
        "text-[var(--c-carousel-nav-fg)]",
        "transition-[border-color,background-color,color]",
        "duration-[var(--p-duration-fast)]",
        "hover:bg-[var(--c-carousel-nav-bg-hover)]",
        "hover:border-[var(--c-carousel-nav-border-hover)]",
        "hover:text-[var(--c-carousel-nav-fg-hover)]",
        "outline-none ds-focus-ring",
        "focus-visible:bg-[var(--c-carousel-nav-bg-hover)]",
        "focus-visible:border-[var(--c-carousel-nav-border-hover)]",
        "focus-visible:text-[var(--c-carousel-nav-fg-hover)]",
        "disabled:pointer-events-none",
        "disabled:bg-transparent",
        "disabled:border-[var(--c-carousel-nav-border)]",
        "disabled:text-[var(--c-carousel-nav-fg-disabled)]",
        orientation === "horizontal"
          ? "top-1/2 -right-12 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2",
        className,
      )}
      {...props}
    >
      {orientation === "horizontal" ? (
        <ArrowRight className="size-4" aria-hidden="true" />
      ) : (
        <ArrowDown className="size-4" aria-hidden="true" />
      )}
      <span className="sr-only">Next slide</span>
    </button>
  );
});
CarouselNext.displayName = "CarouselNext";

/**
 * CarouselDots
 *
 * Pagination indicators. Auto-detects scroll-snap count from the embla API
 * so it reflects "page count" in multi-item views (e.g. 6 slides / 3-per-page = 2 dots),
 * not raw slide count. Hidden (returns null) when there is only 1 snap.
 *
 * Tokens: --c-carousel-dot-{bg,active,radius}
 */
function CarouselDots({ className }: { className?: string }) {
  const { api } = useCarousel();
  const [count, setCount] = React.useState(0);
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    const updateCount = () => setCount(api.scrollSnapList().length);
    const updateCurrent = () => setCurrent(api.selectedScrollSnap());

    updateCount();
    updateCurrent();

    api.on("reInit", updateCount);
    api.on("reInit", updateCurrent);
    api.on("select", updateCurrent);

    return () => {
      api.off("reInit", updateCount);
      api.off("reInit", updateCurrent);
      api.off("select", updateCurrent);
    };
  }, [api]);

  if (count <= 1) return null;

  return (
    <div
      className={cn("flex justify-center gap-1.5 mt-3.5", className)}
      aria-hidden="true"
      data-slot="carousel-dots"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-1.5 rounded-full transition-[background-color,width]",
            "duration-[var(--p-duration-fast)]",
            i === current
              ? "w-[18px] bg-[var(--c-carousel-dot-active)]"
              : "w-1.5 bg-[var(--c-carousel-dot-bg)]",
          )}
        />
      ))}
    </div>
  );
}

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
};

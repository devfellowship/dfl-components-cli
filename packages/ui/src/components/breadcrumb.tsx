import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { ChevronRight, MoreHorizontal } from "lucide-react";

import { cn } from "../lib/utils";

/*
 * Breadcrumb — DS v0 token-aware.
 *
 * Consumes Layer-3 component tokens (--c-breadcrumb-*) which resolve to
 * Layer-2 semantic tokens (--s-*). Never references raw Tailwind palette
 * classes like `text-muted-foreground` or `text-foreground`.
 *
 * Focus ring: THE ONE UNIFORM AMBER RING across all interactive elements —
 *   box-shadow: 0 0 0 2px var(--s-surface-page), 0 0 0 3px #E07A4A
 * Consistent with Button, Input, Checkbox and every other DS interactive atom.
 */

const Breadcrumb = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<"nav"> & {
    separator?: React.ReactNode;
  }
>(({ ...props }, ref) => <nav ref={ref} aria-label="breadcrumb" {...props} />);
Breadcrumb.displayName = "Breadcrumb";

const BreadcrumbList = React.forwardRef<HTMLOListElement, React.ComponentPropsWithoutRef<"ol">>(
  ({ className, ...props }, ref) => (
    <ol
      ref={ref}
      className={cn(
        "flex flex-wrap items-center break-words",
        "gap-[var(--c-breadcrumb-gap)]",
        "text-[var(--c-breadcrumb-font-size)] font-[var(--c-breadcrumb-font-weight)]",
        className,
      )}
      {...props}
    />
  ),
);
BreadcrumbList.displayName = "BreadcrumbList";

const BreadcrumbItem = React.forwardRef<HTMLLIElement, React.ComponentPropsWithoutRef<"li">>(
  ({ className, ...props }, ref) => (
    <li
      ref={ref}
      className={cn("inline-flex items-center gap-[var(--c-breadcrumb-gap)]", className)}
      {...props}
    />
  ),
);
BreadcrumbItem.displayName = "BreadcrumbItem";

const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a"> & {
    asChild?: boolean;
  }
>(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      ref={ref}
      className={cn(
        // Color via component tokens
        "text-[var(--c-breadcrumb-link-fg)]",
        "hover:text-[var(--c-breadcrumb-link-fg-hover)]",
        // Transition — 120ms ease-out per DS spec
        "transition-colors duration-[120ms] ease-out",
        // Shape for focus ring containment
        "rounded-[var(--c-breadcrumb-radius)] outline-none",
        // THE ONE UNIFORM AMBER FOCUS RING
        "focus-visible:text-[var(--c-breadcrumb-link-fg-hover)]",
        "focus-visible:shadow-[0_0_0_2px_var(--s-surface-page),0_0_0_3px_#E07A4A]",
        className,
      )}
      {...props}
    />
  );
});
BreadcrumbLink.displayName = "BreadcrumbLink";

const BreadcrumbPage = React.forwardRef<HTMLSpanElement, React.ComponentPropsWithoutRef<"span">>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn(
        // ink-primary + weight-500 to signal "you are here"
        "text-[var(--c-breadcrumb-page-fg)] font-[var(--c-breadcrumb-page-weight)]",
        className,
      )}
      {...props}
    />
  ),
);
BreadcrumbPage.displayName = "BreadcrumbPage";

const BreadcrumbSeparator = ({ children, className, ...props }: React.ComponentProps<"li">) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn(
      "text-[var(--c-breadcrumb-separator-fg)]",
      "[&>svg]:w-[var(--c-breadcrumb-separator-size)] [&>svg]:h-[var(--c-breadcrumb-separator-size)]",
      className,
    )}
    {...props}
  >
    {children ?? <ChevronRight />}
  </li>
);
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

/*
 * BreadcrumbEllipsis — interactive collapse button.
 *
 * Changed from a presentational <span role="presentation"> (hidden from AT,
 * no interactive affordance) to a proper <button> with:
 *   - aria-label for screen readers
 *   - hover: surface-elevated bg + ink-secondary icon color
 *   - focus-visible: the ONE uniform amber ring
 *
 * Props type changed from ComponentProps<"span"> to ComponentProps<"button">
 * to match the semantic change.
 */
const BreadcrumbEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"button">) => (
  <button
    type="button"
    aria-label="Mostrar itens ocultos"
    className={cn(
      // Size + shape — 28×28px touch target, radius-sm
      "flex items-center justify-center",
      "w-[var(--c-breadcrumb-ellipsis-size)] h-[var(--c-breadcrumb-ellipsis-size)]",
      "rounded-[var(--c-breadcrumb-ellipsis-radius)]",
      // Idle color
      "text-[var(--c-breadcrumb-link-fg)]",
      // Hover — surface-elevated bg lifts the button visually
      "hover:bg-[var(--s-surface-elevated)] hover:text-[var(--c-breadcrumb-link-fg-hover)]",
      // Transition — 120ms ease-out per DS spec
      "transition-colors duration-[120ms] ease-out",
      // THE ONE UNIFORM AMBER FOCUS RING
      "outline-none",
      "focus-visible:bg-[var(--s-surface-elevated)] focus-visible:text-[var(--c-breadcrumb-link-fg-hover)]",
      "focus-visible:shadow-[0_0_0_2px_var(--s-surface-page),0_0_0_3px_#E07A4A]",
      className,
    )}
    {...props}
  >
    <MoreHorizontal className="h-3.5 w-3.5" />
    <span className="sr-only">Mais</span>
  </button>
);
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis";

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};

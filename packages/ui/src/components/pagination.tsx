import * as React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";

import { cn } from "../lib/utils";

// ─── Pagination root ────────────────────────────────────────────────────────

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

// ─── List wrapper ───────────────────────────────────────────────────────────

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn(
        "flex flex-row items-center gap-[var(--c-pagination-gap)]",
        className,
      )}
      {...props}
    />
  );
}

// ─── List item ──────────────────────────────────────────────────────────────

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

// ─── Page link tile ─────────────────────────────────────────────────────────
//
//  isActive=false → ghost tile: transparent bg, muted fg, hover elevates bg
//  isActive=true  → solid amber fill (--c-pagination-active-bg), dark fg
//  Focus ring     → DS spec: box-shadow 0 0 0 2px bg-gap + 0 0 0 3px amber

type PaginationLinkProps = {
  isActive?: boolean;
} & React.ComponentProps<"a">;

function PaginationLink({
  className,
  isActive,
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        // Layout — fixed square tile
        "inline-flex items-center justify-center",
        "size-[var(--c-pagination-item-size)]",
        "rounded-[var(--c-pagination-item-radius)]",
        // Typography
        "text-[length:var(--c-pagination-item-font)]",
        "font-[number:var(--c-pagination-item-weight)]",
        // Motion
        "transition-[background-color,color] duration-[120ms]",
        "select-none no-underline",
        // Inactive / ghost state
        !isActive && [
          "bg-transparent",
          "text-[color:var(--c-pagination-item-fg)]",
          "hover:bg-[var(--c-pagination-item-bg-hover)]",
          "hover:text-[color:var(--c-pagination-item-fg-hover)]",
          "cursor-pointer",
        ],
        // Active state — solid amber fill, dark foreground
        isActive && [
          "bg-[var(--c-pagination-active-bg)]",
          "text-[color:var(--c-pagination-active-fg)]",
          "font-[number:var(--c-pagination-active-weight)]",
          "cursor-default pointer-events-none",
        ],
        // DS uniform focus ring: 2px bg-colour gap + 3px amber halo
        "focus-visible:outline-none",
        "focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_3px_var(--s-border-focus)]",
        className,
      )}
      {...props}
    />
  );
}

// ─── Nav controls (Previous / Next) ─────────────────────────────────────────
//
//  disabled=true  → renders <span aria-disabled="true" role="link">
//                   opacity --c-pagination-disabled-opacity, pointer-events-none
//  disabled=false → renders <a> with hover + DS focus ring

type PaginationNavProps = {
  disabled?: boolean;
} & React.ComponentProps<"a">;

// Shared Tailwind classes for both nav variants (enabled and disabled)
const paginationNavBase = [
  "inline-flex items-center gap-[5px]",
  "h-[var(--c-pagination-item-size)] px-[10px]",
  "rounded-[var(--c-pagination-nav-radius)]",
  "bg-transparent border-none",
  "text-[color:var(--c-pagination-nav-fg)]",
  "text-[length:var(--c-pagination-item-font)]",
  "font-[number:var(--c-pagination-item-weight)]",
  "transition-[background-color,color] duration-[120ms]",
  "select-none whitespace-nowrap no-underline",
] as const;

function PaginationPrevious({
  className,
  disabled = false,
  ...props
}: PaginationNavProps) {
  const cls = cn(
    paginationNavBase,
    !disabled && [
      "cursor-pointer",
      "hover:bg-[var(--c-pagination-nav-bg-hover)]",
      "hover:text-[color:var(--c-pagination-nav-fg-hover)]",
      "focus-visible:outline-none",
      "focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_3px_var(--s-border-focus)]",
    ],
    disabled && [
      "opacity-[var(--c-pagination-disabled-opacity)]",
      "pointer-events-none cursor-not-allowed",
    ],
    className,
  );

  const inner = (
    <>
      <ChevronLeftIcon className="size-[14px] shrink-0" aria-hidden="true" />
      <span className="hidden sm:block">Previous</span>
    </>
  );

  if (disabled) {
    return (
      <span
        aria-disabled="true"
        role="link"
        data-slot="pagination-previous"
        className={cls}
      >
        {inner}
      </span>
    );
  }

  return (
    <a
      aria-label="Go to previous page"
      data-slot="pagination-previous"
      className={cls}
      {...props}
    >
      {inner}
    </a>
  );
}

function PaginationNext({
  className,
  disabled = false,
  ...props
}: PaginationNavProps) {
  const cls = cn(
    paginationNavBase,
    !disabled && [
      "cursor-pointer",
      "hover:bg-[var(--c-pagination-nav-bg-hover)]",
      "hover:text-[color:var(--c-pagination-nav-fg-hover)]",
      "focus-visible:outline-none",
      "focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_3px_var(--s-border-focus)]",
    ],
    disabled && [
      "opacity-[var(--c-pagination-disabled-opacity)]",
      "pointer-events-none cursor-not-allowed",
    ],
    className,
  );

  const inner = (
    <>
      <span className="hidden sm:block">Next</span>
      <ChevronRightIcon className="size-[14px] shrink-0" aria-hidden="true" />
    </>
  );

  if (disabled) {
    return (
      <span
        aria-disabled="true"
        role="link"
        data-slot="pagination-next"
        className={cls}
      >
        {inner}
      </span>
    );
  }

  return (
    <a
      aria-label="Go to next page"
      data-slot="pagination-next"
      className={cls}
      {...props}
    >
      {inner}
    </a>
  );
}

// ─── Ellipsis ────────────────────────────────────────────────────────────────

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn(
        "inline-flex size-[var(--c-pagination-item-size)] items-center justify-center",
        "text-[color:var(--c-pagination-ellipsis-fg)] text-[13px]",
        "select-none",
        className,
      )}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};

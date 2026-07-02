import * as React from "react";

import { cn } from "../lib/utils";

/**
 * Table — DFL Design System v0 (token-native refactor)
 *
 * Tokens consumed (Layer 3 → Layer 2):
 *   --c-table-header-fg           → --s-ink-muted         header cell text
 *   --c-table-header-bg           → transparent            header cell bg
 *   --c-table-divider             → --s-border-subtle      row separator lines
 *   --c-table-row-hover-bg        → --s-surface-raised     tbody row hover bg
 *   --c-table-row-selected-bg     → --s-brand-subtle       selected row amber wash
 *   --c-table-row-selected-border → --s-brand-border       selected row 2px left signal
 *   --c-table-caption-fg          → --s-ink-muted          caption / empty-state text
 *
 * Body cell default ink: --s-ink-secondary (#c9c0b4)
 *
 * Numeric / ID cell conventions (applied by consumer via className):
 *   font-mono text-[var(--s-ink-primary)]            — ID cells  (JetBrains Mono)
 *   font-mono text-[var(--s-ink-primary)] text-right — amount cells (JetBrains Mono)
 *
 * Focus ring for interactive table elements (sort buttons, row-action icons):
 *   Use <Button variant="ghost"> or <IconButton variant="ghost"> — both carry
 *   the uniform DS amber double-shadow ring on :focus-visible automatically.
 */

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full overflow-auto">
      <table
        ref={ref}
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  ),
);
Table.displayName = "Table";

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <thead
      ref={ref}
      className={cn(
        // Use component token for divider (replaces raw `border-b`)
        "[&_tr]:border-b [&_tr]:border-[var(--c-table-divider)]",
        className,
      )}
      {...props}
    />
  ),
);
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody
      ref={ref}
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  ),
);
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tfoot
      ref={ref}
      className={cn(
        // Border via component token (replaces raw `border-t`)
        "border-t border-[var(--c-table-divider)]",
        // Subtle raised-surface overlay — consistent with DS footer treatment
        // (rgba literal: p-sand-700 at 50% opacity — no token for this overlay yet)
        "bg-[rgba(42,38,34,0.5)]",
        "font-medium",
        "[&>tr]:last:border-b-0",
        className,
      )}
      {...props}
    />
  ),
);
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        // Row divider via component token (replaces raw `border-b`)
        "border-b border-[var(--c-table-divider)]",
        // Smooth bg transition on hover / selection
        "transition-colors duration-[120ms]",
        // Hover: lift to raised surface (replaces `hover:bg-muted/50`)
        "hover:bg-[var(--c-table-row-hover-bg)]",
        // Selected: brand-subtle amber wash + 2 px left-border brand signal
        // (replaces generic `data-[state=selected]:bg-muted`)
        "data-[state=selected]:bg-[var(--c-table-row-selected-bg)]",
        "data-[state=selected]:border-l-2",
        "data-[state=selected]:border-l-[var(--c-table-row-selected-border)]",
        className,
      )}
      {...props}
    />
  ),
);
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        "h-10 px-4 text-left align-middle",
        // DS header typography
        "text-[12px] font-medium tracking-[0.2px] whitespace-nowrap select-none",
        // Component token (replaces `text-muted-foreground`)
        "text-[var(--c-table-header-fg)]",
        "bg-[var(--c-table-header-bg)]",
        "[&:has([role=checkbox])]:pr-0",
        className,
      )}
      {...props}
    />
  ),
);
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td
      ref={ref}
      className={cn(
        "px-4 py-3 align-middle",
        // Body cell default ink — secondary so IDs/amounts (ink-primary) stand out
        "text-[var(--s-ink-secondary)]",
        "[&:has([role=checkbox])]:pr-0",
        className,
      )}
      {...props}
    />
  ),
);
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
  ({ className, ...props }, ref) => (
    <caption
      ref={ref}
      className={cn(
        "mt-2.5 text-[12px] text-left",
        // Component token (replaces `text-muted-foreground`)
        "text-[var(--c-table-caption-fg)]",
        className,
      )}
      {...props}
    />
  ),
);
TableCaption.displayName = "TableCaption";

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };

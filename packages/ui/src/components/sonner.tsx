"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

/**
 * DFL-branded Sonner toast wrapper.
 *
 * Consumes --c-toast-* component tokens (Layer 3 in tokens.css) and maps
 * them to Sonner's CSS-variable API so that:
 *   - Base surface, border, radius, and shadow come from DS tokens.
 *   - Semantic toast types (success/error/info/warning) use DFL palette tints
 *     (--c-toast-{type}-bg/border) instead of Sonner's library defaults.
 *   - The action [data-button] renders amber (#E07A4A) with brand border and
 *     hover fill, replacing Sonner's grey default.
 *   - Both [data-button] and [data-close-button] carry the uniform amber focus
 *     ring (box-shadow: 0 0 0 2px bg-gap, 0 0 0 3px #E07A4A) on :focus-visible.
 *   - A 3px colored left accent stripe is applied per toast type via
 *     [data-sonner-toast][data-type="..."]::before.
 *
 * The <style> block is injected once per SonnerToaster mount. Sonner is
 * typically rendered as a singleton (one <SonnerToaster> per app root), so
 * duplication is not a concern in practice.
 */

/** Global CSS targeting Sonner's internal data-attributes for DFL styling. */
const TOASTER_CSS = `
  /* ── Action button: amber colour + border + hover fill + focus ring ── */
  .toaster [data-button] {
    color: var(--c-toast-action-fg) !important;
    background: transparent !important;
    border: 1px solid var(--c-toast-action-border) !important;
    border-radius: var(--p-radius-md) !important;
    font-size: 12px !important;
    font-weight: 500 !important;
    transition: background var(--p-duration-fast) !important;
  }
  .toaster [data-button]:hover {
    background: var(--c-toast-action-bg-hover) !important;
  }
  .toaster [data-button]:focus-visible {
    outline: none !important;
    box-shadow: var(--c-toast-focus-ring) !important;
    background: var(--c-toast-action-bg-hover) !important;
  }

  /* ── Close button: amber focus ring ── */
  .toaster [data-close-button]:focus-visible {
    outline: none !important;
    box-shadow: var(--c-toast-focus-ring) !important;
    border-radius: var(--p-radius-sm) !important;
  }

  /* ── Left accent stripe per toast type ── */
  .toaster [data-sonner-toast] {
    position: relative;
    overflow: hidden;
  }
  .toaster [data-sonner-toast]::before {
    content: '';
    position: absolute;
    inset-block: 0;
    left: 0;
    width: 3px;
    background: var(--s-border-subtle);
    border-radius: var(--c-toast-radius) 0 0 var(--c-toast-radius);
  }
  .toaster [data-sonner-toast][data-type="success"]::before {
    background: var(--s-success-solid);
  }
  .toaster [data-sonner-toast][data-type="error"]::before {
    background: var(--s-danger-solid);
  }
  .toaster [data-sonner-toast][data-type="info"]::before {
    background: var(--s-info-solid);
  }
  .toaster [data-sonner-toast][data-type="warning"]::before {
    background: var(--s-warning-solid);
  }

  /* ── Icon vertical alignment: pin the leading icon to the title row ── */
  .toaster [data-sonner-toast] {
    align-items: flex-start;
  }
  .toaster [data-sonner-toast] [data-icon] {
    align-self: flex-start;
    margin-top: 1px;
  }
  /* Per-type icon colour so the icon matches the toast intent. */
  .toaster [data-sonner-toast][data-type="success"] [data-icon] { color: var(--s-success-fg); }
  .toaster [data-sonner-toast][data-type="error"]   [data-icon] { color: var(--s-danger-fg); }
  .toaster [data-sonner-toast][data-type="info"]    [data-icon] { color: var(--s-info-fg); }
  .toaster [data-sonner-toast][data-type="warning"] [data-icon] { color: var(--s-warning-fg); }

  /* ── Action button follows the toast variant colour (was always amber) ── */
  .toaster [data-sonner-toast][data-type="success"] [data-button] {
    color: var(--s-success-fg) !important;
    border-color: var(--c-toast-success-border) !important;
  }
  .toaster [data-sonner-toast][data-type="success"] [data-button]:hover {
    background: var(--c-toast-success-bg) !important;
  }
  .toaster [data-sonner-toast][data-type="error"] [data-button] {
    color: var(--s-danger-fg) !important;
    border-color: var(--c-toast-danger-border) !important;
  }
  .toaster [data-sonner-toast][data-type="error"] [data-button]:hover {
    background: var(--c-toast-danger-bg) !important;
  }
  .toaster [data-sonner-toast][data-type="info"] [data-button] {
    color: var(--s-info-fg) !important;
    border-color: var(--c-toast-info-border) !important;
  }
  .toaster [data-sonner-toast][data-type="info"] [data-button]:hover {
    background: var(--c-toast-info-bg) !important;
  }
  .toaster [data-sonner-toast][data-type="warning"] [data-button] {
    color: var(--s-warning-fg) !important;
    border-color: var(--c-toast-warning-border) !important;
  }
  .toaster [data-sonner-toast][data-type="warning"] [data-button]:hover {
    background: var(--c-toast-warning-bg) !important;
  }
`;

const SonnerToaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <>
      <style>{TOASTER_CSS}</style>
      <Sonner
        theme={theme as ToasterProps["theme"]}
        className="toaster group"
        style={
          {
            /* Base */
            "--normal-bg": "var(--c-toast-bg)",
            "--normal-text": "var(--c-toast-title-fg)",
            "--normal-border": "var(--c-toast-border)",
            /* Semantic type surfaces */
            "--success-bg": "var(--c-toast-success-bg)",
            "--success-border": "var(--c-toast-success-border)",
            "--error-bg": "var(--c-toast-error-bg)",
            "--error-border": "var(--c-toast-error-border)",
            "--info-bg": "var(--c-toast-info-bg)",
            "--info-border": "var(--c-toast-info-border)",
            "--warning-bg": "var(--c-toast-warning-bg)",
            "--warning-border": "var(--c-toast-warning-border)",
            /* Shape */
            "--border-radius": "var(--c-toast-radius)",
          } as React.CSSProperties
        }
        {...props}
      />
    </>
  );
};

export { SonnerToaster };

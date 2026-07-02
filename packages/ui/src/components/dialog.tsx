import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "../lib/utils";

/**
 * Dialog — DFL Design System v0
 *
 * Token changes vs vanilla shadcn (v1.1.0):
 *   - Overlay: bg-[var(--c-dialog-scrim)] — warm rgba(10,9,8,0.72) vs cold bg-black/80
 *   - Panel bg:     bg-[var(--c-dialog-bg)]       (--s-surface-raised)
 *   - Panel border: border-[var(--c-dialog-border)] (--s-border-subtle)
 *   - Panel radius: rounded-[var(--c-dialog-radius)] (--p-radius-xl = 14px) vs sm:rounded-lg (8px)
 *   - Panel shadow: shadow-[var(--c-dialog-shadow)] (--p-shadow-overlay) vs shadow-lg
 *   - Close button focus ring: 0 0 0 2px --c-dialog-bg, 0 0 0 3px #E07A4A (uniform DFL ring)
 *
 * Added props on DialogContent:
 *   showClose?:      false hides the close button (e.g. loading / in-progress states)
 *   autoFocusClose?: true auto-focuses the close button on mount (focus-ring stories)
 */

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-[var(--c-dialog-scrim)]",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

interface DialogContentProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  /**
   * When false the close button is not rendered.
   * Use for in-progress / loading states where dismissal must be prevented.
   * @default true
   */
  showClose?: boolean;
  /**
   * When true the close button receives autoFocus on mount so the focus ring is
   * immediately visible (useful for focus-ring stories / a11y demos).
   * @default false
   */
  autoFocusClose?: boolean;
}

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ className, children, showClose = true, autoFocusClose = false, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg",
        "translate-x-[-50%] translate-y-[-50%] gap-4 p-6",
        /* ── DS v0 component tokens ── */
        "bg-[var(--c-dialog-bg)]",
        "border border-[var(--c-dialog-border)]",
        "rounded-[var(--c-dialog-radius)]",
        "shadow-[var(--c-dialog-shadow)]",
        /* ── animation ── */
        "duration-200",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
        "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
        className,
      )}
      {...props}
    >
      {children}
      {showClose && (
        <DialogPrimitive.Close
          autoFocus={autoFocusClose}
          className={cn(
            "absolute right-3 top-3",
            "flex h-7 w-7 items-center justify-center",
            "rounded-[var(--p-radius-md)]",
            "text-[var(--s-ink-muted)] opacity-70",
            "transition-[background-color,color,box-shadow] duration-150",
            "hover:bg-[var(--s-surface-elevated)] hover:text-[var(--s-ink-primary)] hover:opacity-100",
            /* uniform DFL focus ring: 2px gap (dialog-bg) + 1px amber #E07A4A */
            "focus-visible:outline-none focus-visible:opacity-100",
            "focus-visible:shadow-[0_0_0_2px_var(--c-dialog-bg),_0_0_0_3px_#E07A4A]",
            "disabled:pointer-events-none",
          )}
        >
          <X className="h-3.5 w-3.5" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      )}
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-2", className)}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-[16px] font-semibold leading-snug tracking-tight text-[var(--s-ink-primary)]",
      className,
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("mt-1.5 text-[13px] leading-normal text-[var(--s-ink-muted)]", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};

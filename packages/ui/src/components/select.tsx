import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

import { cn } from "../lib/utils";

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

/**
 * SelectTrigger — DFL Design System v0
 *
 * Design changes vs shadcn baseline:
 *  - Focus ring: canonical DFL `outline: 1px solid #E07A4A; outline-offset: 3px`
 *    via `.ds-focus-ring` class (no shadcn `ring-*` utilities).
 *  - bg: --c-select-bg (sand-850), border: --c-select-border (sand-700)
 *  - Hover: border escalates to --c-select-border-hover (sand-600)
 *  - Open state: amber border + amber outline ring + chevron rotates 180° to amber
 *  - Disabled: opacity 0.45 (spec), cursor not-allowed
 *  - Error: border switches to --c-select-border-error (danger-solid)
 *  - Chevron: --c-select-icon-color (sand-400); escalates on hover/open
 */
interface SelectTriggerProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> {
  /** When true, the trigger displays the error border (--c-select-border-error). */
  error?: boolean;
}

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(({ className, children, error, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      // Layout
      "group flex h-10 w-full items-center justify-between",
      "rounded-[var(--c-select-radius)] border px-3 py-2 text-sm",
      // Surface + text
      "bg-[var(--c-select-bg)] text-[var(--c-select-fg)]",
      // Border default
      "border-[var(--c-select-border)]",
      // Transition
      "transition-[border-color] duration-[var(--p-duration-fast)]",
      // Hover — border escalates to sand-600
      "hover:border-[var(--c-select-border-hover)]",
      // Focus-visible — canonical DFL ring (.ds-focus-ring rule in tokens.css)
      // Also escalate border to amber on keyboard focus
      "ds-focus-ring focus-visible:border-[var(--c-select-border-focus)]",
      // Open state — amber border + amber outline ring; chevron handled via group-data-* on child
      "data-[state=open]:border-[var(--c-select-border-focus)]",
      "data-[state=open]:outline data-[state=open]:outline-1",
      "data-[state=open]:[outline-color:var(--c-select-border-focus)]",
      "data-[state=open]:[outline-offset:3px]",
      // Disabled
      "disabled:cursor-not-allowed disabled:opacity-45",
      // Error (override border; suppress hover escalation so danger color persists)
      error && "border-[var(--c-select-border-error)] hover:border-[var(--c-select-border-error)]",
      // Value span clamp
      "[&>span]:line-clamp-1",
      className,
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown
        className={cn(
          "h-4 w-4 shrink-0",
          // Default icon color token (replaces raw opacity-50)
          "text-[var(--c-select-icon-color)]",
          // Hover — escalate to secondary ink (trigger has `group`)
          "group-hover:text-[var(--c-select-icon-color-hover)]",
          // Open — rotate 180° + amber tint (via group-data-[state=open] on trigger)
          "transition-transform duration-[var(--p-duration-fast)]",
          "group-data-[state=open]:rotate-180",
          "group-data-[state=open]:text-[var(--s-brand-solid)]",
        )}
      />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1 text-[var(--c-select-icon-color)]", className)}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1 text-[var(--c-select-icon-color)]", className)}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        // Surface — component tokens (replaces bare bg-popover / shadow-md)
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden",
        "bg-[var(--c-select-menu-bg)]",
        "border border-[var(--c-select-menu-border)]",
        "rounded-[var(--c-select-menu-radius)]",
        "shadow-[var(--c-select-menu-shadow)]",
        "text-[var(--c-select-fg)]",
        // Radix state-driven animations
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className,
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn(
      "px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.06em]",
      "text-[var(--c-select-label-fg)]",
      className,
    )}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      // Layout — 36px left gutter for check icon
      "relative flex w-full cursor-default select-none items-center",
      "rounded-[var(--p-radius-sm)] py-2 pl-9 pr-2 text-sm",
      "outline-none",
      // Default text (replaces muted-foreground fallthrough)
      "text-[var(--c-select-item-fg)]",
      // Highlighted / keyboard-focused — sand-850 bg (NOT amber; amber is reserved for selected)
      "focus:bg-[var(--c-select-item-bg-hover)] focus:text-[var(--c-select-item-fg-hover)]",
      // Selected — amber-10% bg + primary text (check icon goes amber via its own class)
      "data-[state=checked]:bg-[var(--c-select-item-bg-selected)] data-[state=checked]:text-[var(--s-ink-primary)]",
      // Disabled
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-45",
      className,
    )}
    {...props}
  >
    {/* Check icon gutter — amber when item is selected */}
    <span className="absolute left-2.5 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4 text-[var(--c-select-item-check-color)]" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-[var(--c-select-separator-color)]", className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};

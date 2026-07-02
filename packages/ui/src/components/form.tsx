import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import { Controller, ControllerProps, FieldPath, FieldValues, FormProvider, useFormContext } from "react-hook-form";

import { cn } from "../lib/utils";
import { Label } from "./label";

/**
 * Form — DFL Design System v0
 *
 * Thin React Hook Form wrapper (FormProvider + Controller). Composes
 * FormItem, FormLabel, FormControl, FormDescription, FormMessage.
 *
 * Tokens consumed (Layer 3 → Layer 2 → Layer 1):
 *   --c-form-gap              (8px, p-space-2)  — gap between label/control/hint/message
 *   --c-form-section-gap      (20px, p-space-5) — gap between FormItems in a <form>
 *   --c-form-label-fg         (s-ink-secondary) — label default colour
 *   --c-form-label-error-fg   (s-danger-fg)     — label colour when field has error
 *   --c-form-description-fg   (s-ink-muted)     — helper text below the control
 *   --c-form-message-error-fg (s-danger-fg)     — validation-error message colour
 */

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue);

/**
 * FormItem — vertical flex stack.
 * Gap is driven by --c-form-gap (replaces the Tailwind `space-y-2` utility).
 */
const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const id = React.useId();

    return (
      <FormItemContext.Provider value={{ id }}>
        <div ref={ref} className={cn("flex flex-col gap-[var(--c-form-gap)]", className)} {...props} />
      </FormItemContext.Provider>
    );
  },
);
FormItem.displayName = "FormItem";

/**
 * FormLabel — wraps the DS Label.
 * Error state switches colour from --c-form-label-fg (→ --s-ink-secondary)
 * to --c-form-label-error-fg (→ --s-danger-fg, #e89898 — the softer danger-fg
 * tint) instead of leaking the Tailwind alias `text-destructive`
 * (→ --destructive → --s-danger-solid, full-saturation #e07a7a).
 */
const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();

  return (
    <Label
      ref={ref}
      className={cn(
        error ? "text-[var(--c-form-label-error-fg)]" : "text-[var(--c-form-label-fg)]",
        className,
      )}
      htmlFor={formItemId}
      {...props}
    />
  );
});
FormLabel.displayName = "FormLabel";

const FormControl = React.forwardRef<React.ElementRef<typeof Slot>, React.ComponentPropsWithoutRef<typeof Slot>>(
  ({ ...props }, ref) => {
    const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

    return (
      <Slot
        ref={ref}
        id={formItemId}
        aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
        aria-invalid={!!error}
        {...props}
      />
    );
  },
);
FormControl.displayName = "FormControl";

/**
 * FormDescription — helper text below the control.
 * Uses --c-form-description-fg (→ --s-ink-muted) instead of the Tailwind
 * alias `text-muted-foreground`.
 */
const FormDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    const { formDescriptionId } = useFormField();

    return (
      <p
        ref={ref}
        id={formDescriptionId}
        className={cn("text-[12px] text-[var(--c-form-description-fg)]", className)}
        {...props}
      />
    );
  },
);
FormDescription.displayName = "FormDescription";

/**
 * FormMessage — validation-error text.
 * Uses --c-form-message-error-fg (→ --s-danger-fg, #e89898) instead of the
 * Tailwind alias `text-destructive` (→ --s-danger-solid, #e07a7a).
 */
const FormMessage = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => {
    const { error, formMessageId } = useFormField();
    const body = error ? String(error?.message) : children;

    if (!body) {
      return null;
    }

    return (
      <p
        ref={ref}
        id={formMessageId}
        className={cn("text-[12px] font-medium text-[var(--c-form-message-error-fg)]", className)}
        {...props}
      >
        {body}
      </p>
    );
  },
);
FormMessage.displayName = "FormMessage";

export { useFormField, Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormField };

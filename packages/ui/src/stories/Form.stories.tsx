import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/form";
import { Input } from "../components/input";
import { Button } from "../components/button";

const meta: Meta<typeof Form> = {
  title: "Components/Organisms/Form",
  component: Form,
};

export default meta;
type Story = StoryObj<typeof Form>;

// Shared zod schema — mirrored as RHF native rules (no @hookform/resolvers dep).
const schema = z.object({
  username: z.string().min(2, "Mínimo de 2 caracteres."),
});
type FormValues = z.infer<typeof schema>;

// ─── Shared form layout style ─────────────────────────────────────────────────
// Uses --c-form-section-gap for the gap between FormItems (replaces inline gap:"16px").
const formStyle: React.CSSProperties = { display: "grid", gap: "var(--c-form-section-gap)", maxWidth: 320 };

// ─── 1. BasicForm ─────────────────────────────────────────────────────────────

function BasicFormDemo() {
  const form = useForm<FormValues>({ defaultValues: { username: "" } });
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(() => {})}
        style={formStyle}
      >
        <FormField
          control={form.control}
          name="username"
          rules={{ minLength: { value: 2, message: "Mínimo de 2 caracteres." } }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="peduarte" {...field} />
              </FormControl>
              <FormDescription>Este é seu nome público.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Enviar</Button>
      </form>
    </Form>
  );
}

/**
 * Default empty state — demonstrates --c-form-gap (8px between label/control/hint)
 * and --c-form-section-gap (20px between FormItems) replacing hard-coded values.
 */
export const BasicForm: Story = {
  render: () => <BasicFormDemo />,
};

// ─── 2. Focused ───────────────────────────────────────────────────────────────

function FocusedDemo() {
  const form = useForm<FormValues>({ defaultValues: { username: "" } });
  return (
    <Form {...form}>
      <form style={formStyle}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                {/* autoFocus triggers :focus-visible — shows the amber DS ring */}
                <Input placeholder="peduarte" autoFocus {...field} />
              </FormControl>
              <FormDescription>Este é seu nome público.</FormDescription>
            </FormItem>
          )}
        />
        <Button type="submit">Enviar</Button>
      </form>
    </Form>
  );
}

/**
 * Focused state — the amber DS focus ring (2px bg-gap + 1px #E07A4A) is visible
 * on the input. autoFocus triggers :focus-visible on mount.
 */
export const Focused: Story = {
  render: () => <FocusedDemo />,
};

// ─── 3. Filled ────────────────────────────────────────────────────────────────

function FilledDemo() {
  const form = useForm<FormValues>({ defaultValues: { username: "tainan" } });
  return (
    <Form {...form}>
      <form style={formStyle}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Este é seu nome público.</FormDescription>
            </FormItem>
          )}
        />
        <Button type="submit">Enviar</Button>
      </form>
    </Form>
  );
}

/**
 * Filled / valid state — the field contains a valid value; border-color
 * shifts to --c-input-border-hover on hover, no error indicators shown.
 */
export const Filled: Story = {
  render: () => <FilledDemo />,
};

// ─── 4. WithValidationError ───────────────────────────────────────────────────

function ValidationErrorDemo() {
  const form = useForm<FormValues>({ defaultValues: { username: "a" } });
  // Set the error on mount so the invalid state is visible immediately.
  React.useEffect(() => {
    form.setError("username", { type: "manual", message: "Mínimo de 2 caracteres." });
  }, [form]);
  return (
    <Form {...form}>
      <form style={formStyle}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Enviar</Button>
      </form>
    </Form>
  );
}

/**
 * Validation-error state — FormLabel colour uses --c-form-label-error-fg
 * (→ --s-danger-fg #e89898) and FormMessage uses --c-form-message-error-fg
 * (→ --s-danger-fg #e89898). Both are the softer danger-fg tint rather than
 * the full-saturation --s-danger-solid #e07a7a leaked by `text-destructive`.
 */
export const WithValidationError: Story = {
  render: () => <ValidationErrorDemo />,
};

// ─── 5. ErrorFocused ─────────────────────────────────────────────────────────

function ErrorFocusedDemo() {
  const form = useForm<FormValues>({ defaultValues: { username: "a" } });
  React.useEffect(() => {
    form.setError("username", { type: "manual", message: "Mínimo de 2 caracteres." });
  }, [form]);
  return (
    <Form {...form}>
      <form style={formStyle}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                {/*
                 * autoFocus + aria-invalid=true (set by FormControl when error exists)
                 * triggers the danger ring: --s-danger-solid (#e07a7a) replacing
                 * the former near-invisible --s-danger-subtle ring.
                 */}
                <Input autoFocus {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Enviar</Button>
      </form>
    </Form>
  );
}

/**
 * Error + focused state — the danger ring (--s-danger-solid, #e07a7a) is shown
 * instead of the brand-amber ring. This combination exercises the
 * `aria-invalid:focus-visible:ring-[var(--s-danger-solid)]` fix in input.tsx
 * (previously used the near-invisible --s-danger-subtle).
 */
export const ErrorFocused: Story = {
  render: () => <ErrorFocusedDemo />,
};

// ─── 6. Submitting ───────────────────────────────────────────────────────────

function SubmittingDemo() {
  const form = useForm<FormValues>({ defaultValues: { username: "peduarte" } });
  return (
    <Form {...form}>
      <form style={formStyle}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input disabled {...field} />
              </FormControl>
              {/*
               * FormDescription uses --c-form-description-fg (→ --s-ink-muted)
               * instead of the former `text-muted-foreground` Tailwind alias.
               */}
              <FormDescription>Este é seu nome público.</FormDescription>
            </FormItem>
          )}
        />
        <Button type="submit" loading>
          Salvando
        </Button>
      </form>
    </Form>
  );
}

/**
 * Submitting state — fields disabled, submit button in loading variant.
 * FormDescription colour uses --c-form-description-fg (→ --s-ink-muted)
 * instead of the Tailwind alias `text-muted-foreground`.
 */
export const Submitting: Story = {
  render: () => <SubmittingDemo />,
};

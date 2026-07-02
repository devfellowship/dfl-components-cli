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

// zod schema mirrored into react-hook-form native rules (no @hookform/resolvers dep).
const schema = z.object({
  username: z.string().min(2, "Mínimo de 2 caracteres."),
});
type FormValues = z.infer<typeof schema>;

function BasicFormDemo() {
  const form = useForm<FormValues>({ defaultValues: { username: "" } });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => {})} style={{ display: "grid", gap: "16px", maxWidth: 320 }}>
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

/** A basic single-field form wired with react-hook-form. */
export const BasicForm: Story = {
  render: () => <BasicFormDemo />,
};

function ValidationErrorDemo() {
  const form = useForm<FormValues>({ defaultValues: { username: "a" } });
  // Set the error on mount so the invalid state is visible in the story.
  React.useEffect(() => {
    form.setError("username", { type: "manual", message: "Mínimo de 2 caracteres." });
  }, [form]);
  return (
    <Form {...form}>
      <form style={{ display: "grid", gap: "16px", maxWidth: 320 }}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="peduarte" {...field} />
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

/** The invalid state — the field renders its validation error message. */
export const WithValidationError: Story = {
  render: () => <ValidationErrorDemo />,
};

function SubmittingDemo() {
  const form = useForm<FormValues>({ defaultValues: { username: "peduarte" } });
  return (
    <Form {...form}>
      <form style={{ display: "grid", gap: "16px", maxWidth: 320 }}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="peduarte" disabled {...field} />
              </FormControl>
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

/** The submitting state — fields disabled and submit in its loading state. */
export const Submitting: Story = {
  render: () => <SubmittingDemo />,
};

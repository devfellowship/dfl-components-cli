// @vitest-environment jsdom
/**
 * Select — regression tests for the bubble-input empty-value echo.
 *
 * Production incident, 2026-08-21 (`marques-boxing-monorepo`, guard commit
 * `df55d95`): the student plan picker cleared itself every time the edit
 * dialog opened.
 *
 * Radix keeps a hidden native `<select>` for form support. When the Radix value
 * changes it assigns `select.value` AND dispatches a real `change` event, and
 * its own `onChange` reports `event.target.value` back through
 * `onValueChange`. The `<option>` list only registers a render later (Radix
 * mounts the closed menu into a `DocumentFragment` created in a layout effect),
 * so the browser resolves the assignment to `""` and that empty string reaches
 * the consumer — wiping a controlled value that was set asynchronously.
 *
 * The tests below drive the exact sequence: mount, then land the value from a
 * later commit, then land the options one commit after that.
 *
 * NOTE: the `<form>` wrapper is REQUIRED to reproduce. Radix renders the bubble
 * input only when the Select is a form control, so a Select outside a form
 * never had the bug and these tests would pass vacuously without it.
 *
 * Uses plain DOM assertions (no jest-dom matchers), matching this repo's RTL
 * test convention.
 */
import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../select";

type Plan = { id: string; name: string };

const PLANS: Plan[] = [
  { id: "plan-a", name: "Plan A" },
  { id: "plan-b", name: "Plan B" },
];

/**
 * Models the edit dialog that found the bug: a controlled Select whose value
 * arrives from a fetch after mount, with the option list arriving one commit
 * later. `commitValue` / `commitPlans` let each test step one commit at a time.
 */
function AsyncHydratedForm({
  onValueChange,
  allowEmptyValue,
}: {
  onValueChange: (next: string) => void;
  allowEmptyValue?: boolean;
}) {
  const [value, setValue] = React.useState("");
  const [plans, setPlans] = React.useState<Plan[]>([]);

  commitValue = setValue;
  commitPlans = setPlans;

  return (
    <form>
      <Select
        value={value}
        allowEmptyValue={allowEmptyValue}
        onValueChange={(next) => {
          onValueChange(next);
          setValue(next);
        }}
      >
        <SelectTrigger aria-label="Plan">
          <SelectValue placeholder="No plan" />
        </SelectTrigger>
        <SelectContent>
          {plans.map((plan) => (
            <SelectItem key={plan.id} value={plan.id}>
              {plan.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </form>
  );
}

let commitValue!: (next: string) => void;
let commitPlans!: (next: Plan[]) => void;

/** The hidden native <select> Radix renders for form support. */
function bubbleInput(): HTMLSelectElement {
  const select = document.querySelector("select[aria-hidden='true']");
  if (!select) throw new Error("Radix bubble input not found — the guard test cannot run");
  return select as HTMLSelectElement;
}

describe("Select — async hydration of a controlled value", () => {
  it("keeps a value set after mount when the options arrive one render later", () => {
    const onValueChange = vi.fn();
    render(<AsyncHydratedForm onValueChange={onValueChange} />);

    // The record loads: the value lands while the option list is still empty.
    act(() => {
      commitValue("plan-b");
    });
    // The option list loads one commit later.
    act(() => {
      commitPlans(PLANS);
    });

    expect(onValueChange).not.toHaveBeenCalledWith("");
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole("combobox").textContent).toBe("Plan B");
  });

  it("keeps the value when the options are already present", () => {
    const onValueChange = vi.fn();
    render(<AsyncHydratedForm onValueChange={onValueChange} />);

    act(() => {
      commitPlans(PLANS);
    });
    act(() => {
      commitValue("plan-a");
    });

    expect(onValueChange).not.toHaveBeenCalledWith("");
    expect(screen.getByRole("combobox").textContent).toBe("Plan A");
  });

  it("still reports a real selection that comes through the native select", () => {
    const onValueChange = vi.fn();
    render(<AsyncHydratedForm onValueChange={onValueChange} />);

    act(() => {
      commitPlans(PLANS);
    });

    // A non-empty value is never an echo — it must always reach the consumer.
    const select = bubbleInput();
    act(() => {
      select.value = "plan-a";
      select.dispatchEvent(new Event("change", { bubbles: true }));
    });

    expect(onValueChange).toHaveBeenCalledWith("plan-a");
    expect(screen.getByRole("combobox").textContent).toBe("Plan A");
  });

  it("lets the empty value through when allowEmptyValue is set", () => {
    const onValueChange = vi.fn();
    render(<AsyncHydratedForm onValueChange={onValueChange} allowEmptyValue />);

    act(() => {
      commitValue("plan-b");
    });
    act(() => {
      commitPlans(PLANS);
    });

    // Escape hatch: the consumer opted back in to the pre-guard behaviour.
    expect(onValueChange).toHaveBeenCalledWith("");
  });
});

describe("Select — real user selection", () => {
  it("propagates the value the user picks from the open menu", async () => {
    // Radix needs these three in jsdom to open its menu.
    Element.prototype.hasPointerCapture ??= () => false;
    Element.prototype.releasePointerCapture ??= () => {};
    Element.prototype.scrollIntoView ??= () => {};

    const { default: userEvent } = await import("@testing-library/user-event");
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<AsyncHydratedForm onValueChange={onValueChange} />);

    act(() => {
      commitPlans(PLANS);
    });

    await user.click(screen.getByRole("combobox"));
    await user.click(await screen.findByRole("option", { name: "Plan B" }));

    expect(onValueChange).toHaveBeenCalledWith("plan-b");
    expect(onValueChange).not.toHaveBeenCalledWith("");
    expect(screen.getByRole("combobox").textContent).toBe("Plan B");
  });
});

describe("Select — uncontrolled usage is unchanged", () => {
  it("does not intercept anything when the Select is uncontrolled", () => {
    const onValueChange = vi.fn();

    function Uncontrolled() {
      return (
        <form>
          <Select defaultValue="plan-a" onValueChange={onValueChange}>
            <SelectTrigger aria-label="Plan">
              <SelectValue placeholder="No plan" />
            </SelectTrigger>
            <SelectContent>
              {PLANS.map((plan) => (
                <SelectItem key={plan.id} value={plan.id}>
                  {plan.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </form>
      );
    }

    render(<Uncontrolled />);
    expect(screen.getByRole("combobox").textContent).toBe("Plan A");

    const select = bubbleInput();
    act(() => {
      select.value = "plan-b";
      select.dispatchEvent(new Event("change", { bubbles: true }));
    });

    expect(onValueChange).toHaveBeenCalledWith("plan-b");
  });
});

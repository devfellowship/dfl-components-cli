---
"@devfellowship/components": patch
---

fix(select): ignore the empty bubble-input echo before the options register

`Select` no longer clears a controlled value that is set asynchronously.

Radix keeps a hidden native `<select>` so the component works in a form. When
the Radix value changes, that input assigns `select.value` and dispatches a real
`change` event, and reports `event.target.value` back through `onValueChange`.
The `<option>` list only registers a render later, so the browser resolves the
assignment to `""`. That empty string reached the consumer and wiped a value the
app had just set from a fetch or a hydration effect.

The DS `Select` now drops an `onValueChange("")` call when the component is
controlled, the current `value` is not empty, and `allowEmptyValue` is not set.
A user selection can never produce `""`, because Radix requires every
`SelectItem` to carry a non-empty value.

Pass the new `allowEmptyValue` prop to opt out and receive every value,
including `""`. Uncontrolled usage is unchanged.

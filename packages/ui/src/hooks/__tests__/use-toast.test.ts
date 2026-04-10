import { describe, it, expect } from "vitest";
import { reducer } from "../use-toast";

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

describe("toast reducer", () => {
  const emptyState = { toasts: [] };

  it("adds a toast", () => {
    const toast = { id: "1", title: "Hello", open: true };
    const next = reducer(emptyState, { type: actionTypes.ADD_TOAST, toast });
    expect(next.toasts).toHaveLength(1);
    expect(next.toasts[0].title).toBe("Hello");
  });

  it("limits to TOAST_LIMIT (1)", () => {
    const t1 = { id: "1", title: "First", open: true };
    const t2 = { id: "2", title: "Second", open: true };
    const s1 = reducer(emptyState, { type: actionTypes.ADD_TOAST, toast: t1 });
    const s2 = reducer(s1, { type: actionTypes.ADD_TOAST, toast: t2 });
    expect(s2.toasts).toHaveLength(1);
    expect(s2.toasts[0].id).toBe("2");
  });

  it("updates a toast by id", () => {
    const toast = { id: "1", title: "Old", open: true };
    const s1 = reducer(emptyState, { type: actionTypes.ADD_TOAST, toast });
    const s2 = reducer(s1, {
      type: actionTypes.UPDATE_TOAST,
      toast: { id: "1", title: "New" },
    });
    expect(s2.toasts[0].title).toBe("New");
  });

  it("removes all toasts", () => {
    const toast = { id: "1", title: "Test", open: true };
    const s1 = reducer(emptyState, { type: actionTypes.ADD_TOAST, toast });
    const s2 = reducer(s1, { type: actionTypes.REMOVE_TOAST });
    expect(s2.toasts).toHaveLength(0);
  });

  it("removes a specific toast by id", () => {
    const t1 = { id: "1", title: "T1", open: true };
    const s1 = reducer(emptyState, { type: actionTypes.ADD_TOAST, toast: t1 });
    const s2 = reducer(s1, { type: actionTypes.REMOVE_TOAST, toastId: "1" });
    expect(s2.toasts).toHaveLength(0);
  });
});

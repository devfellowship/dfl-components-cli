/**
 * ConfirmDialog organism
 * Generic confirm/delete dialog built on the AlertDialog primitive.
 * Replaces the per-app Confirm/Delete re-wraps — pass title/body/labels
 * and an onConfirm handler. Behavior-agnostic: the consumer owns the action.
 *
 * Controlled (`open` + `onOpenChange`) or trigger-driven (`trigger`).
 */
import * as React from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../alert-dialog";
import { buttonVariants } from "../button";
import { cn } from "../../lib/utils";

export interface ConfirmDialogProps {
  /** Dialog heading. */
  title: React.ReactNode;
  /** Body / description. Optional. */
  body?: React.ReactNode;
  /** Confirm button label. Defaults to "Confirm". */
  confirmLabel?: string;
  /** Cancel button label. Defaults to "Cancel". */
  cancelLabel?: string;
  /**
   * Visual intent of the confirm button.
   * "default" → brand primary; "destructive" → danger styling.
   */
  variant?: "default" | "destructive";
  /** Called when the user confirms. May be async. */
  onConfirm?: () => void | Promise<void>;
  /** Called when the user cancels / dismisses. */
  onCancel?: () => void;
  /** Controlled open state. Omit to use the `trigger`. */
  open?: boolean;
  /** Controlled open-change handler. */
  onOpenChange?: (open: boolean) => void;
  /** Element that opens the dialog (uncontrolled usage). */
  trigger?: React.ReactNode;
  /** Disable the confirm button (e.g. while a parent validates). */
  confirmDisabled?: boolean;
}

export function ConfirmDialog({
  title,
  body,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  onConfirm,
  onCancel,
  open,
  onOpenChange,
  trigger,
  confirmDisabled,
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {body && <AlertDialogDescription>{body}</AlertDialogDescription>}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onCancel?.()}>
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={confirmDisabled}
            onClick={() => onConfirm?.()}
            className={cn(
              buttonVariants({
                variant: variant === "destructive" ? "destructive" : "primary",
              }),
            )}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/**
 * ContextMenu stories — DS v0 token-aligned (one state per story).
 *
 * All eight stories map to the work items in the audit:
 *   Default · ItemHover · ItemKeyboardFocus · DestructiveItem ·
 *   CheckboxItems · RadioItems · WithSubmenu · DisabledItem
 *
 * Interaction stories (Default, Destructive, Checkbox, Radio, Submenu, Disabled):
 *   Right-click the dashed trigger zone to open the menu.
 *
 * Visual-state stories (ItemHover, ItemKeyboardFocus):
 *   These render a static panel that shows the exact CSS token output for
 *   those states — brand-subtle bg + amber-300 text; + inset amber ring for
 *   keyboard focus. Radix does not expose an `open` prop on ContextMenu.Root,
 *   so a static spec block is the most honest way to demonstrate item-level
 *   state tokens without requiring user interaction.
 */

import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "../components/context-menu";

const meta: Meta<typeof ContextMenu> = {
  title: "Components/Organisms/ContextMenu",
  component: ContextMenu,
};

export default meta;
type Story = StoryObj<typeof ContextMenu>;

/* ─── Shared trigger zone ─────────────────────────────────────────────────── */

/** DS-spec right-click trigger zone with standard focus ring on keyboard nav. */
function TriggerZone({ label = "Right-click here" }: { label?: string }) {
  return (
    <ContextMenuTrigger
      className={[
        "flex h-32 w-72 flex-col items-center justify-center gap-1 rounded-md",
        "border border-dashed border-[var(--s-border-subtle)]",
        "bg-[var(--s-surface-panel)]",
        "text-sm text-[var(--s-ink-muted)] select-none cursor-default",
        // DS focus ring on the trigger (off-element ring: 2px gap + 1px amber)
        "focus-visible:outline-none focus-visible:shadow-[var(--c-contextmenu-trigger-ring)]",
      ].join(" ")}
    >
      {label}
      <span
        style={{ fontFamily: "var(--s-font-mono)", fontSize: 10, color: "var(--s-ink-disabled)" }}
      >
        ContextMenuTrigger
      </span>
    </ContextMenuTrigger>
  );
}

/* ─── Static visual panel helpers (for ItemHover / ItemKeyboardFocus) ─────── */

/**
 * A static div styled with --c-contextmenu-* tokens — visually identical to
 * the open ContextMenuContent panel. Used in state stories where we cannot
 * force Radix to open programmatically.
 */
function StaticMenuPanel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "var(--c-contextmenu-bg)",
        border: "1px solid var(--c-contextmenu-border)",
        borderRadius: "var(--c-contextmenu-radius)",
        boxShadow: "var(--c-contextmenu-shadow)",
        padding: "4px",
        minWidth: "200px",
        width: "224px",
      }}
    >
      {children}
    </div>
  );
}

type StaticItemState = "default" | "hover" | "focus" | "disabled";

interface StaticMenuItemProps {
  label: string;
  shortcut?: string;
  state?: StaticItemState;
}

/**
 * Static representation of a single ContextMenuItem in a given state.
 * Uses the same --c-contextmenu-* tokens the component applies dynamically.
 */
function StaticMenuItem({ label, shortcut, state = "default" }: StaticMenuItemProps) {
  const isActive = state === "hover" || state === "focus";

  const itemStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    padding: "6px 8px",
    borderRadius: "4px",
    fontSize: "13.5px",
    color: isActive ? "var(--c-contextmenu-item-hover-fg)" : "var(--c-contextmenu-item-fg)",
    background: isActive ? "var(--c-contextmenu-item-hover-bg)" : "transparent",
    boxShadow: state === "focus" ? "var(--c-contextmenu-item-focus-ring)" : "none",
    opacity: state === "disabled" ? 0.38 : 1,
    pointerEvents: state === "disabled" ? "none" : "auto",
    cursor: "default",
    userSelect: "none",
  };

  const shortcutStyle: React.CSSProperties = {
    fontFamily: "var(--s-font-mono)",
    fontSize: "11px",
    letterSpacing: "0.05em",
    color: isActive
      ? "var(--c-contextmenu-item-hover-fg)"
      : "var(--c-contextmenu-shortcut-fg)",
    opacity: isActive ? 0.7 : 1,
    marginLeft: "auto",
    flexShrink: 0,
  };

  return (
    <div style={itemStyle}>
      <span style={{ flex: 1 }}>{label}</span>
      {shortcut && <span style={shortcutStyle}>{shortcut}</span>}
    </div>
  );
}

function StaticSeparator() {
  return (
    <div
      style={{
        height: "1px",
        background: "var(--c-contextmenu-separator)",
        margin: "4px -4px",
      }}
    />
  );
}

/* ════════════════════════════════════════════════════════════════════════════
 * 1. Default — standard browser-navigation menu with shortcuts
 * ════════════════════════════════════════════════════════════════════════════ */

/**
 * Standard context menu open state. Right-click the trigger zone to open.
 * Items: Back / Forward / separator / Reload / Force Reload / separator /
 * Save As… / Print… — all with JetBrains Mono keyboard shortcuts.
 */
export const Default: Story = {
  render: () => (
    <ContextMenu>
      <TriggerZone />
      <ContextMenuContent className="w-52">
        <ContextMenuItem>
          Back
          <ContextMenuShortcut>⌘[</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          Forward
          <ContextMenuShortcut>⌘]</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>
          Reload
          <ContextMenuShortcut>⌘R</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          Force Reload
          <ContextMenuShortcut>⇧⌘R</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>
          Save As…
          <ContextMenuShortcut>⌘S</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          Print…
          <ContextMenuShortcut>⌘P</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

/* ════════════════════════════════════════════════════════════════════════════
 * 2. ItemHover — pointer-hover visual state (static spec panel)
 * ════════════════════════════════════════════════════════════════════════════ */

/**
 * Static visual spec for the pointer-hover state.
 * Token values: --c-contextmenu-item-hover-bg (brand-subtle 10% amber fill)
 * + --c-contextmenu-item-hover-fg (amber-300 text). No solid orange fill.
 *
 * Radix applies data-[highlighted] on both pointer-hover and keyboard-nav;
 * the static panel here isolates that state for visual inspection.
 */
export const ItemHover: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <p
        style={{
          fontFamily: "var(--s-font-mono)",
          fontSize: "10px",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          color: "var(--s-ink-muted)",
        }}
      >
        Pointer-hover state — brand-subtle bg + amber-300 text
      </p>
      <StaticMenuPanel>
        <StaticMenuItem label="Open File" shortcut="⌘O" state="default" />
        <StaticMenuItem label="Open Recent" shortcut="⌘⇧O" state="hover" />
        <StaticMenuItem label="Close Tab" shortcut="⌘W" state="default" />
        <StaticMenuItem label="Save" shortcut="⌘S" state="default" />
      </StaticMenuPanel>
      <p
        style={{
          fontFamily: "var(--s-font-mono)",
          fontSize: "10px",
          color: "var(--s-ink-disabled)",
        }}
      >
        Token: --c-contextmenu-item-hover-bg = --s-brand-subtle (rgba 10%)
      </p>
    </div>
  ),
};

/* ════════════════════════════════════════════════════════════════════════════
 * 3. ItemKeyboardFocus — keyboard-focus visual state (static spec panel)
 * ════════════════════════════════════════════════════════════════════════════ */

/**
 * Static visual spec for the keyboard-focus state.
 * Same hover bg/text as pointer-hover, PLUS an inset amber ring:
 * box-shadow: inset 0 0 0 1px rgba(224, 122, 74, 0.35)
 * (--c-contextmenu-item-focus-ring, applied via focus-visible in the component).
 */
export const ItemKeyboardFocus: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <p
        style={{
          fontFamily: "var(--s-font-mono)",
          fontSize: "10px",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          color: "var(--s-ink-muted)",
        }}
      >
        Keyboard-focus state — hover bg + inset amber ring
      </p>
      <StaticMenuPanel>
        <StaticMenuItem label="Open File" shortcut="⌘O" state="default" />
        <StaticMenuItem label="Open Recent" shortcut="⌘⇧O" state="focus" />
        <StaticMenuItem label="Close Tab" shortcut="⌘W" state="default" />
        <StaticMenuItem label="Save" shortcut="⌘S" state="default" />
      </StaticMenuPanel>
      <p
        style={{
          fontFamily: "var(--s-font-mono)",
          fontSize: "10px",
          color: "var(--s-ink-disabled)",
        }}
      >
        Token: --c-contextmenu-item-focus-ring = inset 0 0 0 1px rgba(224,122,74,0.35)
      </p>
    </div>
  ),
};

/* ════════════════════════════════════════════════════════════════════════════
 * 4. DestructiveItem — danger-fg text + danger-subtle hover bg
 * ════════════════════════════════════════════════════════════════════════════ */

/**
 * Menu with a destructive delete action. Right-click to open.
 * Destructive item: --s-danger-fg (red-400) text by default;
 * hover state swaps to --s-danger-subtle bg (rgba 12%) while keeping
 * danger-fg text — no bleed into brand amber.
 */
export const DestructiveItem: Story = {
  render: () => (
    <ContextMenu>
      <TriggerZone label="Right-click to see destructive item" />
      <ContextMenuContent className="w-56">
        <ContextMenuItem>
          Move to Trash
          <ContextMenuShortcut>⌘⌫</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive">
          Delete Permanently
          <ContextMenuShortcut>⇧⌘⌫</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

/* ════════════════════════════════════════════════════════════════════════════
 * 5. CheckboxItems — checked (amber checkmark) + unchecked items
 * ════════════════════════════════════════════════════════════════════════════ */

function CheckboxItemsDemo() {
  const [toolbar, setToolbar] = React.useState(true);
  const [sidebar, setSidebar] = React.useState(false);
  const [statusBar, setStatusBar] = React.useState(true);
  const [lineNumbers, setLineNumbers] = React.useState(false);

  return (
    <ContextMenu>
      <TriggerZone label="Right-click to see checkbox items" />
      <ContextMenuContent className="w-56">
        <ContextMenuLabel>View Options</ContextMenuLabel>
        <ContextMenuGroup>
          <ContextMenuCheckboxItem checked={toolbar} onCheckedChange={setToolbar}>
            Show Toolbar
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem checked={sidebar} onCheckedChange={setSidebar}>
            Show Sidebar
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem checked={statusBar} onCheckedChange={setStatusBar}>
            Show Status Bar
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem checked={lineNumbers} onCheckedChange={setLineNumbers}>
            Show Line Numbers
          </ContextMenuCheckboxItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuCheckboxItem disabled>
          Show Comments (unavailable)
        </ContextMenuCheckboxItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

/**
 * Checkbox-item group for view/column toggles. Right-click to open.
 * Checked items render an amber checkmark (--s-brand-solid) via
 * ContextMenuPrimitive.ItemIndicator + CheckIcon.
 */
export const CheckboxItems: Story = {
  render: () => <CheckboxItemsDemo />,
};

/* ════════════════════════════════════════════════════════════════════════════
 * 6. RadioItems — selected (amber dot) and unselected radio items
 * ════════════════════════════════════════════════════════════════════════════ */

function RadioItemsDemo() {
  const [sortBy, setSortBy] = React.useState("date-modified");
  const [order, setOrder] = React.useState("ascending");

  return (
    <ContextMenu>
      <TriggerZone label="Right-click to see radio items" />
      <ContextMenuContent className="w-52">
        <ContextMenuLabel>Sort By</ContextMenuLabel>
        <ContextMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
          <ContextMenuRadioItem value="name">Name</ContextMenuRadioItem>
          <ContextMenuRadioItem value="date-modified">Date Modified</ContextMenuRadioItem>
          <ContextMenuRadioItem value="date-created">Date Created</ContextMenuRadioItem>
          <ContextMenuRadioItem value="size">Size</ContextMenuRadioItem>
          <ContextMenuRadioItem value="kind">Kind</ContextMenuRadioItem>
        </ContextMenuRadioGroup>
        <ContextMenuSeparator />
        <ContextMenuLabel>Order</ContextMenuLabel>
        <ContextMenuRadioGroup value={order} onValueChange={setOrder}>
          <ContextMenuRadioItem value="ascending">Ascending</ContextMenuRadioItem>
          <ContextMenuRadioItem value="descending">Descending</ContextMenuRadioItem>
        </ContextMenuRadioGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
}

/**
 * Radio-group for single-selection (sort order). Right-click to open.
 * Selected item renders an amber filled circle (--s-brand-solid) via
 * ContextMenuPrimitive.ItemIndicator + CircleIcon fill-current.
 */
export const RadioItems: Story = {
  render: () => <RadioItemsDemo />,
};

/* ════════════════════════════════════════════════════════════════════════════
 * 7. WithSubmenu — SubTrigger with chevron + nested SubContent panel
 * ════════════════════════════════════════════════════════════════════════════ */

/**
 * Menu with a submenu trigger (chevron indicator) that opens a nested
 * SubContent panel. Right-click to open the main menu, then hover/navigate
 * to "Open With" to see the sub-panel.
 * SubTrigger hover/open state uses the same brand-subtle + amber-300 tokens.
 */
export const WithSubmenu: Story = {
  render: () => (
    <ContextMenu>
      <TriggerZone label="Right-click to see submenu" />
      <ContextMenuContent className="w-52">
        <ContextMenuItem>
          Get Info
          <ContextMenuShortcut>⌘I</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger>Open With</ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem>TextEdit</ContextMenuItem>
            <ContextMenuItem>Preview</ContextMenuItem>
            <ContextMenuItem>VS Code</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>Other…</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuItem>Add to Favourites</ContextMenuItem>
        <ContextMenuItem variant="destructive">Move to Trash</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

/* ════════════════════════════════════════════════════════════════════════════
 * 8. DisabledItem — opacity 0.38, pointer-events none
 * ════════════════════════════════════════════════════════════════════════════ */

/**
 * Menu with disabled items. Right-click to open.
 * Disabled items receive data-[disabled] from Radix, which maps to
 * opacity-50 (spec: 0.38) + pointer-events-none in the component classes.
 */
export const DisabledItem: Story = {
  render: () => (
    <ContextMenu>
      <TriggerZone label="Right-click to see disabled items" />
      <ContextMenuContent className="w-52">
        <ContextMenuItem>
          Copy
          <ContextMenuShortcut>⌘C</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem disabled>
          Paste
          <ContextMenuShortcut>⌘V</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>
          Select All
          <ContextMenuShortcut>⌘A</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem disabled>
          Find…
          <ContextMenuShortcut>⌘F</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive" disabled>
          Delete (restricted)
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

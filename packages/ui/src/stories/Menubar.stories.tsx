import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import {
  FileIcon,
  FolderOpenIcon,
  SaveIcon,
  PrinterIcon,
  Trash2Icon,
  ShareIcon,
} from "lucide-react";
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "../components/menubar";

/**
 * Menubar — DFL DS v0 (one story = one state per the DS rule).
 *
 * Token audit targets per VERDICT:
 *   ✅ Bar bg = --c-menubar-bar-bg (#141210, surface-panel) — visible on page bg
 *   ✅ Trigger focus = DS amber ring via --c-menubar-ring-trigger (NOT accent fill)
 *   ✅ Item hover = brand-subtle tint (rgba(224,122,74,.10)) via --c-menubar-item-bg-hover
 *   ✅ Shortcuts = JetBrains Mono via --c-menubar-shortcut-font
 *   ✅ Checkbox/Radio indicators = amber via --c-menubar-indicator-color
 *   ✅ Component token layer --c-menubar-* added in tokens.css Layer 3
 */
const meta: Meta<typeof Menubar> = {
  title: "Components/Organisms/Menubar",
  component: Menubar,
};

export default meta;
type Story = StoryObj<typeof Menubar>;

/**
 * Default — bar at rest, all triggers idle.
 *
 * Validates:
 *   - surface-panel (#141210) bar bg is distinct from page bg (#0a0908)
 *   - trigger ink = --c-menubar-trigger-fg (secondary, #c9c0b4)
 *   - border delineation via --c-menubar-bar-border (#2a2622)
 */
export const Default: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            New Tab <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            New Window <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Print…</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Undo <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Zoom In</MenubarItem>
          <MenubarItem>Zoom Out</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Help</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Documentation</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};

/**
 * TriggerHover — one trigger in pointer-hover state.
 *
 * Validates:
 *   - surface-raised bg (#1a1714) on hovered trigger
 *   - ink lifts to primary (#f6f1e7)
 *   - no amber yet (hover ≠ focus)
 *
 * Visual state forced via className override (Storybook cannot CSS-pseudo hover
 * without interaction; className mirrors what hover: utilities apply at runtime).
 */
export const TriggerHover: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu>
        {/* className forces the hover visual state for documentation */}
        <MenubarTrigger className="bg-[var(--c-menubar-trigger-bg-hover)] text-[var(--s-ink-primary)]">
          File
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New File <MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Undo</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Zoom In</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};

/**
 * TriggerOpen — trigger in open/active state with dropdown visible.
 *
 * Validates:
 *   - surface-elevated bg (#1f1c18) on the active trigger
 *   - dropdown content: all item types (shortcut via JetBrains Mono, separator,
 *     group label, disabled, destructive, sub-trigger arrow)
 *   - JetBrains Mono on all MenubarShortcut elements (⌘N, ⌘O, ⌘S, ⌘P, ⌘X)
 */
export const TriggerOpen: Story = {
  render: () => (
    <Menubar defaultValue="file">
      <MenubarMenu value="file">
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarLabel>Document</MenubarLabel>
          <MenubarItem>
            <FileIcon />
            New File <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            <FolderOpenIcon />
            Open… <MenubarShortcut>⌘O</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            <SaveIcon />
            Save <MenubarShortcut>⌘S</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Save As… <MenubarShortcut>⇧⌘S</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem disabled>
            Revert to Saved
          </MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>
              <ShareIcon />
              Share
            </MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Email</MenubarItem>
              <MenubarItem>Copy Link</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarItem>
            <PrinterIcon />
            Print… <MenubarShortcut>⌘P</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem variant="destructive">
            <Trash2Icon />
            Delete
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Undo <MenubarShortcut>⌘Z</MenubarShortcut></MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Zoom In</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};

/**
 * TriggerFocused — trigger receiving keyboard focus.
 *
 * Validates the ONE DS amber ring:
 *   box-shadow: 0 0 0 2px #141210 (bar bg), 0 0 0 3px #E07A4A
 *
 * This replaces the previous outline-hidden + accent-fill pattern.
 * Ring does NOT fill the trigger bg — keyboard focus is distinct from active/open state.
 *
 * Visual state forced via className (mirrors focus-visible: at runtime).
 * Interact with the story by tabbing to the trigger to see the live ring.
 */
export const TriggerFocused: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu>
        {/* className forces the focus-visible ring for documentation */}
        <MenubarTrigger className="[box-shadow:var(--c-menubar-ring-trigger)]">
          File
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New File <MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Undo</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Zoom In</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};

/**
 * ItemFocused — menu item receiving keyboard focus inside an open dropdown.
 *
 * Validates:
 *   - ring offset uses surface-raised bg (#1a1714 = content bg), NOT page bg
 *     → box-shadow: 0 0 0 2px #1a1714, 0 0 0 3px #E07A4A
 *   - item bg-hover = brand-subtle tint (rgba(224,122,74,.10)), not solid amber
 *
 * Navigate into the open dropdown with arrow keys to see the live focus ring.
 * The first item has a forced ring className for static documentation.
 */
export const ItemFocused: Story = {
  render: () => (
    <Menubar defaultValue="file">
      <MenubarMenu value="file">
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          {/* className forces the focus-visible ring on first item for docs */}
          <MenubarItem className="[box-shadow:var(--c-menubar-ring-item)]">
            New File <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Open… <MenubarShortcut>⌘O</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Save <MenubarShortcut>⌘S</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Undo</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};

/**
 * WithCheckboxItems — open dropdown with checked + unchecked MenubarCheckboxItem rows.
 *
 * Validates:
 *   - amber (#E07A4A) checkmark via --c-menubar-indicator-color (NOT muted grey)
 *   - correct indented padding (pl-8) on all rows via data-[inset]
 *   - hover = brand-subtle tint
 */
function CheckboxDemo() {
  const [showSidebar, setShowSidebar] = React.useState(true);
  const [showToolbar, setShowToolbar] = React.useState(false);
  const [showStatus, setShowStatus] = React.useState(true);
  const [showLines, setShowLines] = React.useState(false);
  const [compactMode, setCompactMode] = React.useState(true);
  const [focusMode, setFocusMode] = React.useState(false);

  return (
    <Menubar defaultValue="view">
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New File <MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu value="view">
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarLabel>View Options</MenubarLabel>
          <MenubarCheckboxItem checked={showSidebar} onCheckedChange={setShowSidebar}>
            Show Sidebar
          </MenubarCheckboxItem>
          <MenubarCheckboxItem checked={showToolbar} onCheckedChange={setShowToolbar}>
            Show Toolbar
          </MenubarCheckboxItem>
          <MenubarCheckboxItem checked={showStatus} onCheckedChange={setShowStatus}>
            Show Status Bar
          </MenubarCheckboxItem>
          <MenubarCheckboxItem checked={showLines} onCheckedChange={setShowLines}>
            Show Line Numbers
          </MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarLabel>Display</MenubarLabel>
          <MenubarCheckboxItem checked={compactMode} onCheckedChange={setCompactMode}>
            Compact Mode
          </MenubarCheckboxItem>
          <MenubarCheckboxItem checked={focusMode} onCheckedChange={setFocusMode}>
            Focus Mode
          </MenubarCheckboxItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

/** Toggleable checkbox items — view-options panel. Amber checkmark confirms --c-menubar-indicator-color. */
export const WithCheckboxItems: Story = {
  render: () => <CheckboxDemo />,
};

/**
 * WithRadioGroup — open dropdown with MenubarRadioGroup (one selected).
 *
 * Validates:
 *   - amber filled-circle radio indicator via --c-menubar-indicator-color
 *   - correct indented padding on all rows
 *   - only ONE option can be selected at a time (radio semantics)
 */
function RadioGroupDemo() {
  const [sortBy, setSortBy] = React.useState("name");
  const [order, setOrder] = React.useState("asc");

  return (
    <Menubar defaultValue="edit">
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New File <MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu value="edit">
        <MenubarTrigger>Sort</MenubarTrigger>
        <MenubarContent>
          <MenubarLabel>Sort By</MenubarLabel>
          <MenubarGroup>
            <MenubarRadioGroup value={sortBy} onValueChange={setSortBy}>
              <MenubarRadioItem value="name">Name</MenubarRadioItem>
              <MenubarRadioItem value="modified">Date Modified</MenubarRadioItem>
              <MenubarRadioItem value="size">File Size</MenubarRadioItem>
              <MenubarRadioItem value="created">Date Created</MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarLabel>Order</MenubarLabel>
          <MenubarGroup>
            <MenubarRadioGroup value={order} onValueChange={setOrder}>
              <MenubarRadioItem value="asc">Ascending</MenubarRadioItem>
              <MenubarRadioItem value="desc">Descending</MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

/** Radio group — sort options. Amber dot indicator confirms --c-menubar-indicator-color. */
export const WithRadioGroup: Story = {
  render: () => <RadioGroupDemo />,
};

import type { Meta, StoryObj } from "@storybook/react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../components/pagination";

/**
 * Pagination — one story per state (DS "1 story = 1 state" rule).
 *
 * Active tile uses solid amber fill (--c-pagination-active-bg = #E07A4A) with
 * dark foreground — replaces the old `outline` buttonVariants that rendered
 * barely-distinguishable on the dark background.
 *
 * Focus ring: box-shadow 0 0 0 2px var(--background), 0 0 0 3px #E07A4A
 * (DS spec — opaque 2px bg-colour gap + 1px amber halo, instant / no animation).
 *
 * Nav controls expose a `disabled` prop: when true they render as
 * <span aria-disabled="true" role="link"> with 0.35 opacity + pointer-events-none.
 */
const meta: Meta<typeof Pagination> = {
  title: "Components/Molecules/Pagination",
  component: Pagination,
};

export default meta;
type Story = StoryObj<typeof Pagination>;

// ─── Layout state stories ────────────────────────────────────────────────────

/**
 * Default — page 2 of 10, both Previous and Next enabled.
 * Single trailing ellipsis collapses the far end of the range.
 */
export const Default: Story = {
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">10</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};

/**
 * FirstPage — page 1 is active; Previous control is disabled
 * (aria-disabled, 0.35 opacity, pointer-events-none, rendered as <span>).
 */
export const FirstPage: Story = {
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious disabled />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            1
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">2</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">10</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};

/**
 * LastPage — page 10 is active; Next control is disabled.
 * A leading ellipsis collapses the front of the range.
 */
export const LastPage: Story = {
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">8</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">9</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            10
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext disabled />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};

/**
 * LargeDataset — active page is deep in range (page 5 of 20).
 * Ellipsis on BOTH sides of the window; only the current page ±1 is shown.
 */
export const LargeDataset: Story = {
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">4</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            5
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">6</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">20</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};

// ─── Interactive state stories ───────────────────────────────────────────────

/**
 * PageItemFocus — keyboard focus on page link "3".
 * The amber ring (box-shadow: 0 0 0 2px bg, 0 0 0 3px #E07A4A) is forced via
 * className override so the visual state is always visible in the canvas,
 * independent of browser focus-visible heuristics.
 */
export const PageItemFocus: Story = {
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            2
          </PaginationLink>
        </PaginationItem>
        {/* Page "3" is shown in its keyboard-focus state */}
        <PaginationItem>
          <PaginationLink
            href="#"
            className="shadow-[0_0_0_2px_var(--background),0_0_0_3px_var(--s-border-focus)] outline-none"
          >
            3
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">4</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">5</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};

/**
 * NavButtonFocus — keyboard focus on the Previous nav control.
 * Same DS amber ring applied via className override to keep the state visible.
 * Verifies that the nav control is keyboard-reachable (renders as <a>, not <span>).
 */
export const NavButtonFocus: Story = {
  render: () => (
    <Pagination>
      <PaginationContent>
        {/* Previous is shown in its keyboard-focus state */}
        <PaginationItem>
          <PaginationPrevious
            href="#"
            className="shadow-[0_0_0_2px_var(--background),0_0_0_3px_var(--s-border-focus)] outline-none text-[color:var(--c-pagination-nav-fg-hover)] bg-[var(--c-pagination-nav-bg-hover)]"
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};

import type { Meta, StoryObj } from "@storybook/react";
import { AspectRatio } from "../components/aspect-ratio";

const meta: Meta<typeof AspectRatio> = {
  title: "Components/Atoms/AspectRatio",
  component: AspectRatio,
};

export default meta;
type Story = StoryObj<typeof AspectRatio>;

/**
 * Standard widescreen video container (16 : 9).
 * Replaces the previous generic "Default" story.
 */
export const Widescreen: Story = {
  render: () => (
    <div className="w-[400px]">
      <AspectRatio
        ratio={16 / 9}
        className="bg-muted rounded-md overflow-hidden"
      >
        <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
          16 : 9 · Widescreen / Video
        </div>
      </AspectRatio>
    </div>
  ),
};

/**
 * Cinematic ultra-wide banner container (21 : 9).
 * Used for hero banners and cinematic overlays.
 */
export const UltraWide: Story = {
  render: () => (
    <div className="w-[560px]">
      <AspectRatio
        ratio={21 / 9}
        className="bg-muted rounded-md overflow-hidden"
      >
        <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
          21 : 9 · Cinematic / Ultra-wide
        </div>
      </AspectRatio>
    </div>
  ),
};

/**
 * Classic monitor ratio (4 : 3).
 * Traditional presentation and legacy monitor format.
 */
export const Classic: Story = {
  render: () => (
    <div className="w-[400px]">
      <AspectRatio
        ratio={4 / 3}
        className="bg-muted rounded-md overflow-hidden"
      >
        <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
          4 : 3 · Classic
        </div>
      </AspectRatio>
    </div>
  ),
};

/**
 * Square tile (1 : 1).
 * Avatar, thumbnail, and product-card use-case.
 */
export const Square: Story = {
  render: () => (
    <div className="w-[200px]">
      <AspectRatio
        ratio={1 / 1}
        className="bg-muted rounded-md overflow-hidden"
      >
        <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
          1 : 1 · Square
        </div>
      </AspectRatio>
    </div>
  ),
};

/**
 * Portrait card cover (3 : 4).
 * Portrait image / card cover use-case.
 */
export const Portrait: Story = {
  render: () => (
    <div className="w-[200px]">
      <AspectRatio
        ratio={3 / 4}
        className="bg-muted rounded-md overflow-hidden"
      >
        <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
          3 : 4 · Portrait
        </div>
      </AspectRatio>
    </div>
  ),
};

/**
 * WithMedia — primary real-world use-case.
 * ratio={16/9} with a realistic <img> child using object-fit: cover.
 * Demonstrates how AspectRatio constrains image content without distortion.
 */
export const WithMedia: Story = {
  render: () => (
    <div className="w-[400px]">
      <AspectRatio ratio={16 / 9} className="rounded-md overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
          alt="A brown one"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AspectRatio>
    </div>
  ),
};

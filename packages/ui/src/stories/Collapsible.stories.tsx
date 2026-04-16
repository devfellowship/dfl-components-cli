import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../components/collapsible";
import { Button } from "../components/button";
import { ChevronsUpDown } from "lucide-react";

const meta: Meta<typeof Collapsible> = {
  title: "Primitivos/Collapsible",
  component: Collapsible,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Collapsible>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <Collapsible open={open} onOpenChange={setOpen} className="w-[320px] space-y-2">
        <div className="flex items-center justify-between gap-4 rounded-md border px-4 py-2">
          <span className="text-sm font-semibold">@devfellowship/components</span>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-9 p-0">
              <ChevronsUpDown className="h-4 w-4" />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="space-y-2">
          <div className="rounded-md border px-4 py-2 text-sm">button</div>
          <div className="rounded-md border px-4 py-2 text-sm">card</div>
          <div className="rounded-md border px-4 py-2 text-sm">dialog</div>
        </CollapsibleContent>
      </Collapsible>
    );
  },
};

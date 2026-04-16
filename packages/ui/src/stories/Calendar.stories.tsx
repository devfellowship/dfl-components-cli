import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Calendar } from "../components/calendar";

const meta: Meta<typeof Calendar> = {
  title: "Primitivos/Calendar",
  component: Calendar,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Calendar>;

const DefaultRender = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border"
    />
  );
};

export const Default: Story = {
  render: () => <DefaultRender />,
};

const RangeRender = () => {
  const [range, setRange] = React.useState<{ from?: Date; to?: Date } | undefined>(
    { from: new Date(), to: undefined },
  );
  return (
    <Calendar
      mode="range"
      selected={range as { from: Date; to?: Date }}
      onSelect={setRange}
      className="rounded-md border"
      numberOfMonths={2}
    />
  );
};

export const Range: Story = {
  render: () => <RangeRender />,
};

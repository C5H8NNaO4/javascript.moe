import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { ActionButton } from "@/components/ActionButton";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Buttons/ActionButton",
  component: ActionButton,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onClick: fn() },
} satisfies Meta<typeof ActionButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Constructive: Story = {
  args: {
    icon: "FaPlus",
    children: "Create",
    constructive: true,
  },
};

export const Destructive: Story = {
  args: {
    icon: "FaTrash",
    children: "Delete",
    level: 1,
  },
};

export const Confirm: Story = {
  args: {
    promptTitle: "Confirm",
    promptText: "Delete?",
    icon: "FaTrash",
    children: "Delete",
    level: 2,
  },
};
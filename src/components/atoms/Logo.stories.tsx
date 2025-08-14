import type { Meta, StoryObj } from "@storybook/react";
import { Logo } from "./Logo";

const meta: Meta<typeof Logo> = {
  title: "Atoms/Logo",
  component: Logo,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "The Century360 logo component - a reusable wordmark that maintains consistent branding across the application.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    // Add any props here when Logo component has them
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const InHeader: Story = {
  args: {},
  decorators: [
    Story => (
      <header className="bg-white border-b p-4">
        <Story />
      </header>
    ),
  ],
};

export const InFooter: Story = {
  args: {},
  decorators: [
    Story => (
      <footer className="bg-gray-100 border-t p-4">
        <Story />
      </footer>
    ),
  ],
};

export const Large: Story = {
  args: {},
  decorators: [
    Story => (
      <div className="text-4xl">
        <Story />
      </div>
    ),
  ],
};

export const Small: Story = {
  args: {},
  decorators: [
    Story => (
      <div className="text-sm">
        <Story />
      </div>
    ),
  ],
};

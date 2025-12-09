import { Meta, StoryObj } from '@storybook/react';
import { Button } from '../button';

const meta = {
  title: 'Shadcn/button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: [
        'primary',
        'secondary',
        'emerald',
        'slate',
        'lilac',
        'cobalt',
        'mint',
        'outline',
        'outlineDestructive',
        'destructive',
        'ghost',
        'link',
      ],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'icon'],
    },
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

// Variant
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Formance Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Formance Button',
  },
};

export const Emerald: Story = {
  args: {
    variant: 'emerald',
    children: 'Formance Button',
  },
};

export const Slate: Story = {
  args: {
    variant: 'slate',
    children: 'Formance Button',
  },
};

export const Lilac: Story = {
  args: {
    variant: 'lilac',
    children: 'Formance Button',
  },
};

export const Cobalt: Story = {
  args: {
    variant: 'cobalt',
    children: 'Formance Button',
  },
};

export const Mint: Story = {
  args: {
    variant: 'mint',
    children: 'Formance Button',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Formance Button',
  },
};

export const OutlineDestructive: Story = {
  args: {
    variant: 'outlineDestructive',
    children: 'Formance Button',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Formance Button',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Formance Button',
  },
};

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Formance Button',
  },
};

// Size
export const SizeLarge: Story = {
  args: {
    size: 'lg',
    children: 'Formance Button',
  },
};

export const SizeMedium: Story = {
  args: {
    size: 'md',
    children: 'Formance Button',
  },
};

export const SizeSmall: Story = {
  args: {
    size: 'sm',
    children: 'Formance Button',
  },
};

export const SizeIcon: Story = {
  args: {
    size: 'icon-md',
    children: '<>',
  },
};

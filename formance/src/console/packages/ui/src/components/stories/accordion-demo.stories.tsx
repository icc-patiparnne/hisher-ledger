import React from 'react';

import { Meta, StoryObj } from '@storybook/react';
import { AccordionDemo } from '../demo/accordion-demo';

const meta = {
  title: 'Shadcn/accordion',
  component: AccordionDemo,
  parameters: {},
} satisfies Meta<typeof AccordionDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Accordion: Story = {
  args: {},
};

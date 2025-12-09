import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from '../description-list';

const meta = {
  title: 'Shadcn/description-list',
  component: () => (
    <DescriptionList>
      <DescriptionTerm>Customer</DescriptionTerm>
      <DescriptionDetails>Michael Foster</DescriptionDetails>

      <DescriptionTerm>Event</DescriptionTerm>
      <DescriptionDetails>Bear Hug: Live in Concert</DescriptionDetails>

      <DescriptionTerm>Amount</DescriptionTerm>
      <DescriptionDetails>$150.00 USD</DescriptionDetails>

      <DescriptionTerm>Amount after exchange rate</DescriptionTerm>
      <DescriptionDetails>US$150.00 &rarr; CA$199.79</DescriptionDetails>

      <DescriptionTerm>Fee</DescriptionTerm>
      <DescriptionDetails>$4.79 USD</DescriptionDetails>

      <DescriptionTerm>Net</DescriptionTerm>
      <DescriptionDetails>$1,955.00</DescriptionDetails>
    </DescriptionList>
  ),
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

// Variant
export const Default: Story = {
  args: {},
};

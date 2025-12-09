import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import {
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyH4,
  TypographyP,
  TypographyLarge,
  TypographySmall,
  TypographyLead,
  TypographyBlockquote,
  TypographyInlineCode,
  TypographyList,
  TypographyListItem,
  TypographyH5,
} from '../../typography';

const meta = {
  title: 'Typography/Typography',
  component: TypographyH1,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof TypographyH1>;
export default meta;

type Story = StoryObj<typeof meta>;

export const H1: Story = {
  args: {
    children: 'Taxing Laughter: The Joke Tax Chronicles',
  },
};
export const H2: Story = {
  args: {
    ...H1.args,
    children: 'The People of the Kingdom',
  },
  render: (args) => <TypographyH2>{args.children}</TypographyH2>,
};
export const H3: Story = {
  args: { ...H1.args, children: 'The Joke Tax' },
  render: (args) => <TypographyH3>{args.children}</TypographyH3>,
};
export const H4: Story = {
  args: { ...H1.args, children: 'People stopped telling jokes' },
  render: (args) => <TypographyH4>{args.children}</TypographyH4>,
};
export const P: Story = {
  args: {
    ...H1.args,
    children:
      'The king, seeing how much happier his subjects were, realized the error of his ways and repealed the joke tax.',
  },
  render: (args) => <TypographyP>{args.children}</TypographyP>,
};
export const Blockquote: Story = {
  args: {
    ...H1.args,
    children:
      '"After all," he said, "everyone enjoys a good joke, so it`s only fair that they should pay for the privilege."',
  },
  render: (args) => (
    <TypographyBlockquote>{args.children}</TypographyBlockquote>
  ),
};
// export const Table: Story = {
//   render: (args) => <TypographyTable />,
// };
export const List: Story = {
  render: (args) => (
    <TypographyList>
      <TypographyListItem>1st level of puns: 5 gold coins</TypographyListItem>
      <TypographyListItem>2nd level of jokes: 10 gold coins</TypographyListItem>
      <TypographyListItem>
        3rd level of one-liners : 20 gold coins
      </TypographyListItem>
    </TypographyList>
  ),
};
export const InlineCode: Story = {
  args: {
    ...H1.args,
    children: '@radix-ui/react-alert-dialog',
  },
  render: (args) => (
    <TypographyInlineCode>{args.children}</TypographyInlineCode>
  ),
};
export const Lead: Story = {
  args: {
    ...H1.args,
    children:
      ' A modal dialog that interrupts the user with important content and expects a response.',
  },
  render: (args) => <TypographyLead>{args.children}</TypographyLead>,
};
export const Large: Story = {
  args: {
    ...H1.args,
    children: 'Are you sure absolutely sure?',
  },
  render: (args) => <TypographyLarge>{args.children}</TypographyLarge>,
};
export const Small: Story = {
  args: {
    ...H1.args,
    children: 'Email address',
  },
  render: (args) => <TypographySmall>{args.children}</TypographySmall>,
};

export const History: Story = {
  render: (args) => (
    <div className="space-y-4">
      <TypographyH1>This is the TypographyH1</TypographyH1>
      <TypographyH2>This is the TypographyH2</TypographyH2>
      <TypographyH3>This is the TypographyH3</TypographyH3>
      <TypographyH4>This is the TypographyH4</TypographyH4>
      <TypographyH5>This is the TypographyH5</TypographyH5>
      <TypographyP>This is the TypographyP</TypographyP>
      <TypographyBlockquote>
        This is a TypographyBlockquote here, it can be used to quote someone or
        something.
      </TypographyBlockquote>
      <TypographyList>
        <TypographyListItem>
          This is a TypographyListItem here, it can be used to list items.
        </TypographyListItem>
        <TypographyListItem>
          This is a TypographyListItem here, it can be used to list items.
        </TypographyListItem>
        <TypographyListItem>
          This is a TypographyListItem here, it can be used to list items.
        </TypographyListItem>
      </TypographyList>
      <TypographyInlineCode>
        This is a TypographyInlineCode here, it can be used to display code.
      </TypographyInlineCode>
      <TypographyLead>
        This is a TypographyLead here, it can be used to display a lead.
      </TypographyLead>
      <TypographyLarge>
        This is a TypographyLarge here, it can be used to display a large text.
      </TypographyLarge>
      <TypographySmall>
        This is a TypographySmall here, it can be used to display a small text.
      </TypographySmall>
    </div>
  ),
};

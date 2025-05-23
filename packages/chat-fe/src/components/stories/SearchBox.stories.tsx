import type { Meta, StoryObj } from '@storybook/react';

import SearchBox from '../Sidebar/SearchBox';

const meta: Meta<typeof SearchBox> = {
  component: SearchBox,
};

export default meta;
type Story = StoryObj<typeof SearchBox>;

export const Default: Story = {}; 
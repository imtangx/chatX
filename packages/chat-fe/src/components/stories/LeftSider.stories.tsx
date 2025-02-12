import type { Meta, StoryObj } from '@storybook/react';

import LeftSider from '../Sidebar/LeftSider';

const meta: Meta<typeof LeftSider> = {
  component: LeftSider,
};

export default meta;
type Story = StoryObj<typeof LeftSider>;

export const Default: Story = {}; 
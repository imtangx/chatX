import type { Meta, StoryObj } from '@storybook/react';

import MessageInputBox from '../Chat/MessageInputBox';

const meta: Meta<typeof MessageInputBox> = {
  component: MessageInputBox,
};

export default meta;
type Story = StoryObj<typeof MessageInputBox>;

export const Default: Story = {};

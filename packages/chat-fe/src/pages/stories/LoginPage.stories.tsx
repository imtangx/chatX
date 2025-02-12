import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';

import LoginPage from '../LoginPage';

const meta: Meta<typeof LoginPage> = {
  component: LoginPage,
  decorators: [
    Story => (
      //  使用 BrowserRouter 组件包裹 Story 组件，提供路由上下文
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof LoginPage>;

export const Default: Story = {}; 
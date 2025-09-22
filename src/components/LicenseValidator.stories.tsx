import type { Meta, StoryObj } from '@storybook/react';
import LicenseValidator from './LicenseValidator';

const meta: Meta<typeof LicenseValidator> = {
  title: 'Components/LicenseValidator',
  component: LicenseValidator,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

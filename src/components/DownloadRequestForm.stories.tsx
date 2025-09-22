import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import DownloadRequestForm from './DownloadRequestForm';

const meta: Meta<typeof DownloadRequestForm> = {
  title: 'Components/DownloadRequestForm',
  component: DownloadRequestForm,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

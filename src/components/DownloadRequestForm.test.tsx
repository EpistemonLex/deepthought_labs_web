import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DownloadRequestForm from './DownloadRequestForm';
import * as sovereign from '@/lib/api/sovereign';
import { ApiError } from '@/lib/api';

// Mock the sovereign module
vi.mock('@/lib/api/sovereign', async () => {
  return {
    requestDownload: vi.fn(),
  };
});

// Mock window.open
global.window = Object.create(window);
const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null);


describe('DownloadRequestForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the form correctly', () => {
    render(<DownloadRequestForm />);
    expect(screen.getByLabelText(/license key/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/product id/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/version/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/platform/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /request download/i })).toBeInTheDocument();
  });

  it('shows loading state and calls the API on submit', async () => {
    const requestDownloadSpy = vi.spyOn(sovereign, 'requestDownload');
    render(<DownloadRequestForm />);

    fireEvent.change(screen.getByLabelText(/license key/i), { target: { value: 'test-key' } });
    fireEvent.change(screen.getByLabelText(/product id/i), { target: { value: 'test-product' } });
    fireEvent.change(screen.getByLabelText(/version/i), { target: { value: '1.0' } });
    fireEvent.change(screen.getByLabelText(/platform/i), { target: { value: 'windows' } });
    fireEvent.click(screen.getByRole('button', { name: /request download/i }));

    expect(screen.getByRole('button', { name: /requesting.../i })).toBeDisabled();

    await waitFor(() => {
        expect(requestDownloadSpy).toHaveBeenCalledWith('test-key', 'test-product', '1.0', 'windows');
    });
  });

  it('displays download info on success and allows download', async () => {
    const mockResponse = {
      status: 'success',
      message: 'Download token generated.',
      download_token: 'abc-123',
      file_name: 'deepthought-v1.0-windows.zip',
      file_size: 12345678,
    };
    (sovereign.requestDownload as vi.Mock).mockResolvedValue(mockResponse);

    render(<DownloadRequestForm />);

    fireEvent.change(screen.getByLabelText(/license key/i), { target: { value: 'valid-key' } });
    fireEvent.change(screen.getByLabelText(/product id/i), { target: { value: 'prod-1' } });
    fireEvent.change(screen.getByLabelText(/version/i), { target: { value: '1.0' } });
    fireEvent.change(screen.getByLabelText(/platform/i), { target: { value: 'windows' } });
    fireEvent.click(screen.getByRole('button', { name: /request download/i }));

    await waitFor(() => {
      expect(screen.getByText('Download Ready')).toBeInTheDocument();
      expect(screen.getByText('File: deepthought-v1.0-windows.zip')).toBeInTheDocument();
      expect(screen.getByText('Size: 11.77 MB')).toBeInTheDocument();
    });

    const downloadButton = screen.getByRole('button', { name: /download now/i });
    fireEvent.click(downloadButton);
    expect(windowOpenSpy).toHaveBeenCalledWith('http://localhost:8000/api/v1/downloads/retrieve/abc-123', '_blank');
  });

  it('displays an error message when the request fails', async () => {
    const mockError = new ApiError('This license is not eligible for downloads.', 403);
    (sovereign.requestDownload as vi.Mock).mockRejectedValue(mockError);

    render(<DownloadRequestForm />);

    fireEvent.change(screen.getByLabelText(/license key/i), { target: { value: 'ineligible-key' } });
    fireEvent.change(screen.getByLabelText(/product id/i), { target: { value: 'prod-1' } });
    fireEvent.change(screen.getByLabelText(/version/i), { target: { value: '1.0' } });
    fireEvent.change(screen.getByLabelText(/platform/i), { target: { value: 'windows' } });
    fireEvent.click(screen.getByRole('button', { name: /request download/i }));

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
      expect(screen.getByText('This license is not eligible for downloads.')).toBeInTheDocument();
    });
  });
});

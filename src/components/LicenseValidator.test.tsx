import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LicenseValidator from './LicenseValidator';
import * as sovereign from '@/lib/api/sovereign';
import { ApiError } from '@/lib/api';

// Mock the sovereign module
vi.mock('@/lib/api/sovereign', async () => {
  return {
    validateLicense: vi.fn(),
  };
});

// Mock navigator
Object.defineProperty(navigator, 'userAgent', {
  value: 'Test Agent',
  writable: true,
});
Object.defineProperty(navigator, 'language', {
  value: 'en-US',
  writable: true,
});


describe('LicenseValidator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the form correctly', () => {
    render(<LicenseValidator />);
    expect(screen.getByLabelText(/license key/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/product id/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /validate license/i })).toBeInTheDocument();
  });

  it('shows loading state and calls the API on submit', async () => {
    const validateLicenseSpy = vi.spyOn(sovereign, 'validateLicense');
    render(<LicenseValidator />);

    fireEvent.change(screen.getByLabelText(/license key/i), { target: { value: 'test-key' } });
    fireEvent.change(screen.getByLabelText(/product id/i), { target: { value: 'test-product' } });
    fireEvent.click(screen.getByRole('button', { name: /validate license/i }));

    expect(screen.getByRole('button', { name: /validating.../i })).toBeDisabled();

    await waitFor(() => {
        expect(validateLicenseSpy).toHaveBeenCalledWith('test-key', 'test-product', { agent: 'Test Agent', lang: 'en-US' });
    });
  });

  it('displays a success message when validation is successful', async () => {
    const mockResponse = {
      status: 'valid',
      message: 'License is valid',
      tier: 'Pro',
      expires_at: '2025-12-31T23:59:59Z',
    };
    (sovereign.validateLicense as vi.Mock).mockResolvedValue(mockResponse);

    render(<LicenseValidator />);

    fireEvent.change(screen.getByLabelText(/license key/i), { target: { value: 'valid-key' } });
    fireEvent.change(screen.getByLabelText(/product id/i), { target: { value: 'prod-1' } });
    fireEvent.click(screen.getByRole('button', { name: /validate license/i }));

    await waitFor(() => {
      expect(screen.getByText('License is valid')).toBeInTheDocument();
      expect(screen.getByText('Tier: Pro')).toBeInTheDocument();
      expect(screen.getByText(/Expires: 12\/31\/2025/)).toBeInTheDocument();
    });
  });

  it('displays an error message when validation fails', async () => {
    const mockError = new ApiError('Invalid license key.', 404);
    (sovereign.validateLicense as vi.Mock).mockRejectedValue(mockError);

    render(<LicenseValidator />);

    fireEvent.change(screen.getByLabelText(/license key/i), { target: { value: 'invalid-key' } });
    fireEvent.change(screen.getByLabelText(/product id/i), { target: { value: 'prod-1' } });
    fireEvent.click(screen.getByRole('button', { name: /validate license/i }));

    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText('Invalid license key.')).toBeInTheDocument();
    });
  });
});

// src/app/sovereign-utility/page.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SovereignUtilityPage from './page';

// Mock the child components
vi.mock('@/components/LicenseValidator', () => ({
  __esModule: true,
  default: () => <div>Mocked License Validator</div>,
}));

vi.mock('@/components/DownloadRequestForm', () => ({
  __esModule: true,
  default: () => <div>Mocked Download Request Form</div>,
}));

describe('Sovereign Utility Page', () => {
  it('renders the LicenseValidator and DownloadRequestForm components', () => {
    render(<SovereignUtilityPage />);

    expect(screen.getByText('Sovereign Utility')).toBeInTheDocument();
    expect(screen.getByText('Mocked License Validator')).toBeInTheDocument();
    expect(screen.getByText('Mocked Download Request Form')).toBeInTheDocument();
  });
});

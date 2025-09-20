import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import UKWFrameworkPage from './page';

// Mock the Header component to isolate the page component for this test
vi.mock('../../components/Header', () => {
  return {
    default: () => {
      return <div>Mocked Header</div>;
    },
  };
});

describe('UKWFrameworkPage', () => {
  it('should render the main heading', () => {
    render(<UKWFrameworkPage />);

    const heading = screen.getByRole('heading', {
      level: 1,
      name: /The Universal Knowledge Work Framework/
    });

    expect(heading).toBeInTheDocument();
  });
});

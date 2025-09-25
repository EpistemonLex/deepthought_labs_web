// src/app/page.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import HomePage from './page';

// Mock the Header component as it's not the focus of this test
vi.mock('../components/Header', () => ({
  __esModule: true,
  default: () => <header>Mocked Header</header>,
}));

describe('Homepage', () => {
  it('renders the main heading and the whitepaper link', () => {
    render(<HomePage />);

    // Check for the main heading
    expect(
      screen.getByRole('heading', {
        name: /First, We Deconstruct./i,
        level: 2,
      }),
    ).toBeInTheDocument();

    // Check for the link to the whitepaper
    const whitepaperLink = screen.getByRole('button', {
      name: /\[ Notify Me When the Interactive Demo is Live \]/i,
    });
    expect(whitepaperLink).toBeInTheDocument();
  });
});

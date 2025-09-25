// src/app/page.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import HomePage from './page';

// Mock the Header component as it's not the focus of this test
vi.mock('../components/Header', () => ({
  __esModule: true,
  default: () => <header>Mocked Header</header>,
}));

vi.mock('../components/ChaosToClarityStoryboard', () => ({
  __esModule: true,
  default: () => <div>Mocked Storyboard</div>,
}));

describe('Homepage', () => {
  it('renders the header, storyboard, and footer', () => {
    render(<HomePage />);

    expect(screen.getByRole('banner')).toHaveTextContent('Mocked Header');
    expect(screen.getByRole('main')).toHaveTextContent('Mocked Storyboard');
    expect(screen.getByRole('contentinfo')).toHaveTextContent(
      'DeepThought Labs',
    );
  });
});

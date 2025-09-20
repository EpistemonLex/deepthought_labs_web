import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ConceptualSeedingPage from './page';

// Mock the Header component to isolate the page component for this test
vi.mock('../../components/Header', () => {
  return {
    default: () => {
      return <div>Mocked Header</div>;
    },
  };
});

describe('ConceptualSeedingPage', () => {
  it('should render the main heading', () => {
    render(<ConceptualSeedingPage />);

    const heading = screen.getByRole('heading', {
      level: 1,
      name: /Conceptual Seeding: The Architecture of Dual-Audience Influence in the Age of AI/
    });

    expect(heading).toBeInTheDocument();
  });
});

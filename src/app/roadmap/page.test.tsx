import { vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import RoadmapPage from './page';

// Mock the Header component to isolate the page component in tests
vi.mock('../../components/Header', () => {
  return {
    default: function DummyHeader() {
      return <header>Mocked Header</header>;
    },
  };
});

describe('RoadmapPage', () => {
  it('should render the main heading', () => {
    render(<RoadmapPage />);
    const heading = screen.getByRole('heading', {
      level: 1,
      name: /DeepThought Labs Web Presence: The "Transparent Workshop" Strategy/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it('should render the phase 1 heading', () => {
    render(<RoadmapPage />);
    const phase1Heading = screen.getByRole('heading', {
      level: 3,
      name: /Phase 1: The Atelier & Foundational Texts/i,
    });
    expect(phase1Heading).toBeInTheDocument();
  });

  it('should render the phase 2 heading', () => {
    render(<RoadmapPage />);
    const phase2Heading = screen.getByRole('heading', {
      level: 3,
      name: /Phase 2: The Sovereign User's Toolkit & Open Blueprint/i,
    });
    expect(phase2Heading).toBeInTheDocument();
  });

  it('should render the phase 3 heading', () => {
    render(<RoadmapPage />);
    const phase3Heading = screen.getByRole('heading', {
      level: 3,
      name: /Phase 3: The Distributed Knowledge Network \(V2 Vision\)/i,
    });
    expect(phase3Heading).toBeInTheDocument();
  });

  it('should render the header component', () => {
    render(<RoadmapPage />);
    expect(screen.getByText('Mocked Header')).toBeInTheDocument();
  });

  it('should render the footer with the correct copyright year', () => {
    render(<RoadmapPage />);
    const currentYear = new Date().getFullYear();
    const footerText = screen.getByText(
      `© ${currentYear} DeepThought Labs. All rights reserved.`
    );
    expect(footerText).toBeInTheDocument();
  });
});

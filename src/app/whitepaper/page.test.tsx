import { vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import WhitepaperPage from './page';

// Mock the Header component
vi.mock('../../components/Header', () => {
  return {
    default: function DummyHeader() {
      return <header>Mocked Header</header>;
    },
  };
});

describe('WhitepaperPage', () => {
  it('should render the main heading', () => {
    render(<WhitepaperPage />);
    const heading = screen.getByRole('heading', {
      level: 1,
      name: /The Architecture of Synthesis: A Deep Analysis of the 'DeepThought' Application/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it('should render the section on Deconstructing the Philosophy', () => {
    render(<WhitepaperPage />);
    const sectionHeading = screen.getByRole('heading', {
      level: 2,
      name: /Deconstructing the 'Architecture of Synthesis' Philosophy/i,
    });
    expect(sectionHeading).toBeInTheDocument();
  });

  it('should render the section on Synthesis and Emergent Design', () => {
    render(<WhitepaperPage />);
    const sectionHeading = screen.getByRole('heading', {
      level: 2,
      name: /Synthesis and Emergent Design: An Evolutionary Paradigm/i,
    });
    expect(sectionHeading).toBeInTheDocument();
  });

  it('should render the section on Core Principles of Implementation', () => {
    render(<WhitepaperPage />);
    const sectionHeading = screen.getByRole('heading', {
      level: 2,
      name: /Core Principles of Implementation: Composition and Componentization/i,
    });
    expect(sectionHeading).toBeInTheDocument();
  });

  it('should render the header component', () => {
    render(<WhitepaperPage />);
    expect(screen.getByText('Mocked Header')).toBeInTheDocument();
  });

  it('should render the footer with the correct copyright year', () => {
    render(<WhitepaperPage />);
    const currentYear = new Date().getFullYear();
    const footerText = screen.getByText(
      `© ${currentYear} DeepThought Labs. All rights reserved.`
    );
    expect(footerText).toBeInTheDocument();
  });
});

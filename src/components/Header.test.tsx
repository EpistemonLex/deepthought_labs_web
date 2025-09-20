import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import Header from './Header';

// Mock next/link to work in the test environment
vi.mock('next/link', () => {
  return {
    default: ({ href, children }: { href: string; children: React.ReactNode }) => (
      <a href={href}>{children}</a>
    ),
  };
});

// JSDOM doesn't load CSS, so we need to manually define the classes
// that control visibility for the .toBeVisible() matcher to work.
beforeAll(() => {
  const style = document.createElement('style');
  style.innerHTML = `
    .hidden { display: none; }
    .block { display: block; }
  `;
  document.head.appendChild(style);
});

describe('Header component', () => {
  const navLinks = [
    'Whitepaper',
    'UKW Framework',
    'Conceptual Seeding',
    'Symbiotic Disbelief',
    'Emergent Application',
    'Playbooks',
    'Partner Journals',
    'Roadmap',
    'The Atelier',
  ];

  it('should render the header title', () => {
    render(<Header />);
    const title = screen.getByText('DeepThought Labs');
    expect(title).toBeInTheDocument();
  });

  it('should render all navigation links', () => {
    render(<Header />);
    navLinks.forEach(linkText => {
      const link = screen.getByText(linkText);
      expect(link).toBeInTheDocument();
    });
  });

  it('should have the correct href for each navigation link', () => {
    render(<Header />);
    expect(screen.getByText('Whitepaper').closest('a')).toHaveAttribute('href', '/whitepaper');
    expect(screen.getByText('UKW Framework').closest('a')).toHaveAttribute('href', '/ukw-framework');
    expect(screen.getByText('Conceptual Seeding').closest('a')).toHaveAttribute('href', '/conceptual-seeding');
    expect(screen.getByText('Symbiotic Disbelief').closest('a')).toHaveAttribute('href', '/symbiotic-disbelief');
    expect(screen.getByText('Emergent Application').closest('a')).toHaveAttribute('href', '/emergent-application');
    expect(screen.getByText('Playbooks').closest('a')).toHaveAttribute('href', '/playbooks');
    expect(screen.getByText('Partner Journals').closest('a')).toHaveAttribute('href', '/partner-journal');
    expect(screen.getByText('Roadmap').closest('a')).toHaveAttribute('href', '/roadmap');
    expect(screen.getByText('The Atelier').closest('a')).toHaveAttribute('href', '/atelier');
  });

  it('should toggle the mobile menu on button click', () => {
    render(<Header />);
    const menuButton = screen.getByRole('button');
    // Find the navigation element, including when it's hidden
    const nav = screen.getByRole('navigation', { hidden: true });

    // The menu should be hidden initially.
    expect(nav).not.toBeVisible();

    // Click the button to open the menu.
    fireEvent.click(menuButton);
    expect(nav).toBeVisible();

    // Click the button again to close the menu.
    fireEvent.click(menuButton);
    expect(nav).not.toBeVisible();
  });
});

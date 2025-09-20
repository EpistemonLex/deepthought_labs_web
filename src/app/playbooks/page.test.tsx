import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PlaybooksPage from './page';

// Mock the Header component
vi.mock('../../components/Header', () => ({
  default: () => <div>Mocked Header</div>,
}));

// Mock the next/link component
vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

describe('PlaybooksPage', () => {
  it('should render the main heading and subheading', () => {
    render(<PlaybooksPage />);

    const heading = screen.getByRole('heading', { level: 1, name: /The Open Blueprint/ });
    expect(heading).toBeInTheDocument();

    const subheading = screen.getByText(/A collection of playbooks for integrating DeepThought/);
    expect(subheading).toBeInTheDocument();
  });

  it('should render links to all available playbooks', () => {
    render(<PlaybooksPage />);

    const logseqLink = screen.getByRole('heading', {
      level: 2,
      name: /Integrating DeepThought with Logseq/,
    });
    expect(logseqLink).toBeInTheDocument();
    expect(logseqLink.closest('a')).toHaveAttribute('href', '/playbooks/logseq-integration');

    const libreOfficeLink = screen.getByRole('heading', {
      level: 2,
      name: /Automating LibreOffice Workflows with DeepThought Agents/,
    });
    expect(libreOfficeLink).toBeInTheDocument();
    expect(libreOfficeLink.closest('a')).toHaveAttribute('href', '/playbooks/libreoffice-automation');
  });
});

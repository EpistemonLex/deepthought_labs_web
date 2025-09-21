// src/app/canon/page.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import CanonIndexPage from './page';
import fs from 'fs';

// Mock the Header component
vi.mock('../../components/Header', () => ({
  __esModule: true,
  default: () => <header>Mocked Header</header>,
}));

// Mock the entire fs module
vi.mock('fs');

const mockManifest = [
  {
    title: 'Document 1',
    category: 'Category A',
    slug: 'doc-1',
    markdown_file: 'path/to/doc1.md',
    podcast_file: 'podcast1.mp3',
    abstract: 'Abstract for document 1.',
  },
  {
    title: 'Document 2',
    category: 'Category B',
    slug: 'doc-2',
    markdown_file: 'path/to/doc2.md',
    podcast_file: '',
    abstract: 'Abstract for document 2.',
  },
  {
    title: 'Document 3',
    category: 'Category A',
    slug: 'doc-3',
    markdown_file: 'path/to/doc3.md',
    podcast_file: 'podcast3.mp3',
    abstract: 'Abstract for document 3.',
  },
];

describe('Canon Index Page', () => {
  beforeEach(() => {
    // Cast readFileSync to a mock function type and provide the mock implementation
    (fs.readFileSync as vi.Mock).mockReturnValue(JSON.stringify(mockManifest));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders documents grouped by category', () => {
    render(<CanonIndexPage />);

    expect(screen.getByText('Category A')).toBeInTheDocument();
    expect(screen.getByText('Category B')).toBeInTheDocument();

    // Check for document titles within their categories
    const categoryA = screen.getByText('Category A').closest('div');
    expect(categoryA).toHaveTextContent('Document 1');
    expect(categoryA).toHaveTextContent('Document 3');

    const categoryB = screen.getByText('Category B').closest('div');
    expect(categoryB).toHaveTextContent('Document 2');
  });

  it('displays title, abstract, and podcast indicator correctly', () => {
    render(<CanonIndexPage />);

    // Test Document 1 (with podcast)
    const doc1Link = screen.getByText('Document 1').closest('a');
    expect(doc1Link).toHaveAttribute('href', '/canon/doc-1');
    expect(doc1Link).toHaveTextContent('Abstract for document 1.');
    expect(doc1Link).toHaveTextContent('Podcast Available');

    // Test Document 2 (without podcast)
    const doc2Link = screen.getByText('Document 2').closest('a');
    expect(doc2Link).not.toHaveTextContent('Podcast Available');
  });
});

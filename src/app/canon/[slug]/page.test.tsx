// src/app/canon/[slug]/page.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import CanonDocumentPage from './page';
import fs from 'fs';
import { notFound } from 'next/navigation';
import matter from 'gray-matter';

// Mock dependencies
vi.mock('../../../components/Header', () => ({
  __esModule: true,
  default: () => <header>Mocked Header</header>,
}));
vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
}));
vi.mock('fs');
vi.mock('gray-matter');

const mockedFs = fs as vi.Mocked<typeof fs>;
const mockedMatter = matter as unknown as vi.Mocked<typeof matter>;

const mockManifest = [
  {
    title: 'Test Document',
    category: 'Testing',
    slug: 'test-doc',
    markdown_file: 'src/canon/docs/test-doc.md',
    podcast_file: 'test-podcast.mp3',
    abstract: 'An abstract for our test document.',
  },
];

const mockMarkdownContent = '## Markdown Content\n\nThis is the body of the document.';

describe('Canon Document Page', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the document content when a document is found', () => {
    // Arrange: Mock the file system and gray-matter
    mockedFs.readFileSync.mockImplementation((path) => {
      if (path.toString().includes('publication_manifest.json')) {
        return JSON.stringify(mockManifest);
      }
      if (path.toString().includes('test-doc.md')) {
        return mockMarkdownContent;
      }
      return '';
    });
    mockedFs.existsSync.mockReturnValue(true);
    mockedMatter.mockReturnValue({
      content: mockMarkdownContent,
      data: {},
      excerpt: '',
      isEmpty: false
    });

    // Act
    render(<CanonDocumentPage params={{ slug: 'test-doc' }} />);

    // Assert
    expect(screen.getByRole('heading', { name: 'Test Document', level: 1 })).toBeInTheDocument();
    expect(screen.getByText('Category: Testing')).toBeInTheDocument();
    expect(screen.getByText('An abstract for our test document.')).toBeInTheDocument();
    // In jsdom, the <audio> element may not be fully accessible.
    // A more reliable test is to check for the heading of the podcast section.
    expect(screen.getByRole('heading', { name: 'Listen to the Podcast' })).toBeInTheDocument();
    // Check for rendered markdown content (ReactMarkdown output)
    expect(screen.getByText('Markdown Content')).toBeInTheDocument();
  });

  it('calls notFound when the document does not exist in the manifest', () => {
    // Arrange
    mockedFs.readFileSync.mockReturnValue(JSON.stringify(mockManifest));

    // Act & Assert
    // The notFound function from Next.js throws a specific error, which we catch.
    expect(() => render(<CanonDocumentPage params={{ slug: 'non-existent' }} />)).toThrow();
    expect(notFound).toHaveBeenCalled();
  });

  it('calls notFound when the markdown file does not exist', () => {
    // Arrange
    mockedFs.readFileSync.mockReturnValue(JSON.stringify(mockManifest));
    mockedFs.existsSync.mockReturnValue(false); // Simulate file not existing

    // Act & Assert
    expect(() => render(<CanonDocumentPage params={{ slug: 'test-doc' }} />)).toThrow();
    expect(notFound).toHaveBeenCalled();
  });
});

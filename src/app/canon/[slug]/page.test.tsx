// src/app/canon/[slug]/page.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import CanonDocumentPage, { generateStaticParams } from './page';
import { notFound } from 'next/navigation';
import * as contentUtils from '../../../lib/content-utils';
import matter from 'gray-matter';

// Mock dependencies
vi.mock('../../../components/Header', () => ({
  __esModule: true,
  default: () => <header>Mocked Header</header>,
}));
vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
}));
vi.mock('../../../lib/content-utils');
vi.mock('gray-matter');

const mockedContentUtils = contentUtils as vi.Mocked<typeof contentUtils>;
const mockedMatter = matter as unknown as vi.Mocked<typeof matter>;

describe('Canon Document Page', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Page Rendering', () => {
    it('renders the document content when a document is found', () => {
      // Arrange
      const mockRawContent = '## Markdown Content\n\nThis is the body of the document.';
      const mockParsedContent = 'Parsed Markdown Content';
      const mockDocData = {
        title: 'Test Document',
        category: 'Testing',
        slug: 'test-doc',
        markdown_file: 'test.md',
        podcast_file: 'test-podcast.mp3',
        abstract: 'An abstract for our test document.',
        content: mockRawContent,
      };

      mockedContentUtils.getDocument.mockReturnValue(mockDocData);
      mockedMatter.mockReturnValue({
          content: mockParsedContent,
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
      expect(screen.getByRole('heading', { name: 'Listen to the Podcast' })).toBeInTheDocument();
      expect(screen.getByText(mockParsedContent)).toBeInTheDocument();
    });

    it('calls notFound when getDocument returns null', () => {
      // Arrange
      mockedContentUtils.getDocument.mockReturnValue(null);

      // Act & Assert
      // The notFound() function throws an error, so we test that the component throws.
      expect(() => render(<CanonDocumentPage params={{ slug: 'non-existent' }} />)).toThrow();
      expect(notFound).toHaveBeenCalled();
    });
  });

  describe('generateStaticParams', () => {
    it('should return an array of slugs from the manifest', async () => {
      // Arrange
      const mockManifest = [
        { slug: 'doc-1', title: 'Doc 1', category: 'Cat 1', markdown_file: '1.md', podcast_file: '', abstract: '' },
        { slug: 'doc-2', title: 'Doc 2', category: 'Cat 2', markdown_file: '2.md', podcast_file: '', abstract: '' },
      ];
      mockedContentUtils.getManifest.mockReturnValue(mockManifest);

      // Act
      const params = await generateStaticParams();

      // Assert
      expect(params).toEqual([
        { slug: 'doc-1' },
        { slug: 'doc-2' },
      ]);
      expect(mockedContentUtils.getManifest).toHaveBeenCalledOnce();
    });
  });
});

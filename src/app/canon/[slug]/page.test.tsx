// src/app/canon/[slug]/page.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import CanonDocumentPage, { generateStaticParams } from './page';
import { notFound } from 'next/navigation';
import * as contentUtils from '../../../lib/content-utils';

// Mock dependencies
vi.mock('../../../components/Header', () => ({
  __esModule: true,
  default: () => <header>Mocked Header</header>,
}));
vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
}));
vi.mock('../../../lib/content-utils');

const mockedContentUtils = contentUtils as vi.Mocked<typeof contentUtils>;

describe('Canon Document Page', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Page Rendering', () => {
    it('renders the document content when a document is found', async () => {
      // Arrange
      const mockDocData = {
        title: 'Test Document',
        category: 'Testing',
        slug: 'test-doc',
        markdown_file: 'test.md',
        podcast_file: 'test-podcast.mp3',
        abstract: 'An abstract for our test document.',
        content: '## Markdown Content\n\nThis is the body of the document.',
      };
      mockedContentUtils.getDocument.mockResolvedValue(mockDocData);

      // Act
      // Await the component because it's an async Server Component
      const PageComponent = await CanonDocumentPage({ params: { slug: 'test-doc' } });
      render(PageComponent);

      // Assert
      expect(screen.getByRole('heading', { name: 'Test Document', level: 1 })).toBeInTheDocument();
      expect(screen.getByText('Category: Testing')).toBeInTheDocument();
      expect(screen.getByText('An abstract for our test document.')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Listen to the Podcast' })).toBeInTheDocument();
      // Note: ReactMarkdown's output might not be a direct text match.
      // We check for a key part of the content instead.
      expect(screen.getByText('This is the body of the document.')).toBeInTheDocument();
    });

    it('calls notFound when getDocument returns null', async () => {
      // Arrange
      mockedContentUtils.getDocument.mockResolvedValue(null);

      // Act & Assert
      // We expect the async component function itself to throw the error triggered by notFound()
      await expect(CanonDocumentPage({ params: { slug: 'non-existent' } }))
        .rejects
        .toThrow();
      
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

import { describe, it, expect, vi } from 'vitest';
import { getDocument, getManifest, getMarkdownFilePath } from './content-utils';
import fs from 'fs';
import path from 'path';

vi.mock('fs', () => ({
  default: {
    existsSync: vi.fn(),
    readFileSync: vi.fn(),
    promises: {
      readFile: vi.fn(),
    },
  },
}));

const mockManifest = [
  {
    title: 'Test Doc 1',
    category: 'Category A',
    slug: 'test-doc-1',
    markdown_file: 'test-doc-1.md',
    podcast_file: 'test-doc-1.mp3',
    abstract: 'This is a test document.',
  },
  {
    title: 'Test Doc 2',
    category: 'Category B',
    slug: 'test-doc-2',
    markdown_file: 'test-doc-2.md',
    podcast_file: '',
    abstract: 'This is another test document.',
  },
];

describe('Content Utils', () => {
  describe('getManifest', () => {
    it('should return the manifest', () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(JSON.stringify(mockManifest));
      const manifest = getManifest();
      expect(manifest).toEqual(mockManifest);
    });
  });

  describe('getMarkdownFilePath', () => {
    it('should return the correct file path for a given slug', () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(JSON.stringify(mockManifest));
      const filePath = getMarkdownFilePath('test-doc-1');
      const expectedPath = path.resolve(process.cwd(), 'src', 'canon', 'test-doc-1.md');
      expect(filePath).toBe(expectedPath);
    });

    it('should return null if the slug is not found', () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(JSON.stringify(mockManifest));
      const filePath = getMarkdownFilePath('non-existent-slug');
      expect(filePath).toBeNull();
    });
  });

  describe('getDocument', () => {
    it('should return the document content for a given slug', async () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(JSON.stringify(mockManifest));
      fs.promises.readFile.mockResolvedValue('## Test Content');
      const doc = await getDocument('test-doc-1');
      expect(doc).toBeDefined();
      expect(doc.title).toBe('Test Doc 1');
      expect(doc.content).toBe('## Test Content');
    });

    it('should return null if the document is not found', async () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(JSON.stringify(mockManifest));
      const doc = await getDocument('non-existent-slug');
      expect(doc).toBeNull();
    });

    it('should return null if the markdown file does not exist', async () => {
        fs.existsSync.mockImplementation((p) => {
            // manifest exists, but markdown file does not
            return p.endsWith('publication_manifest.json')
        });
        fs.readFileSync.mockReturnValue(JSON.stringify(mockManifest));
        const doc = await getDocument('test-doc-1');
        expect(doc).toBeNull();
    });
  });
});
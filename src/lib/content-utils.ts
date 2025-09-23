// src/lib/content-utils.ts
import fs from 'fs';
import path from 'path';

export interface DocumentManifestEntry {
  title: string;
  category: string;
  slug:string;
  markdown_file: string;
  podcast_file: string;
  abstract: string;
}

export function getManifest(): DocumentManifestEntry[] {
  const manifestPath = path.join(process.cwd(), 'src', 'canon', 'publication_manifest.json');
  if (!fs.existsSync(manifestPath)) {
    // During build, process.cwd() might be different. Let's try to be more robust.
    const altManifestPath = path.join(process.cwd(), 'src/canon/publication_manifest.json');
    if(!fs.existsSync(altManifestPath)) {
      throw new Error('Publication manifest not found at ' + manifestPath + ' or ' + altManifestPath);
    }
    const manifestContents = fs.readFileSync(altManifestPath, 'utf8');
    return JSON.parse(manifestContents);
  }
  const manifestContents = fs.readFileSync(manifestPath, 'utf8');
  return JSON.parse(manifestContents);
}

export function getMarkdownFilePath(slug: string): string | null {
  const manifest = getManifest();
  const docEntry = manifest.find((doc) => doc.slug === slug);

  if (!docEntry || !docEntry.markdown_file) {
    console.error(`No manifest entry or markdown file path for slug: ${slug}`);
    return null;
  }

  // Resolve the markdown file path relative to the manifest's directory.
  const manifestPath = path.join(process.cwd(), 'src', 'canon', 'publication_manifest.json');
  const manifestDir = path.dirname(manifestPath);
  const filePath = path.resolve(manifestDir, docEntry.markdown_file);

  return filePath;
}

export async function getDocument(slug: string) {
    const manifest = getManifest();
    const docEntry = manifest.find((doc) => doc.slug === slug);

    if (!docEntry) {
        return null;
    }

    const filePath = path.resolve(path.join(process.cwd(), 'src', 'canon'), docEntry.markdown_file);

    if (!fs.existsSync(filePath)) {
        console.error(`Markdown file not found for slug ${slug} at path: ${filePath}`);
        return null;
    }

    const fileContents = await fs.promises.readFile(filePath, 'utf8');

    return {
        ...docEntry,
        content: fileContents, // Raw content, matter will parse it in the page
    };
}

// src/app/canon/page.tsx
import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import Header from '../../components/Header';

interface DocumentManifestEntry {
  title: string;
  category: string;
  slug: string;
  markdown_file: string;
  podcast_file: string;
  abstract: string;
}

// Function to read the manifest
function getManifest(): DocumentManifestEntry[] {
  const manifestPath = path.join(process.cwd(), 'src/canon/publication_manifest.json');
  const manifestContents = fs.readFileSync(manifestPath, 'utf8');
  return JSON.parse(manifestContents);
}

export default function CanonIndex() {
  const documents = getManifest();

  // Group documents by category
  const documentsByCategory = documents.reduce((acc, doc) => {
    (acc[doc.category] = acc[doc.category] || []).push(doc);
    return acc;
  }, {} as Record<string, DocumentManifestEntry[]>);

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Header />
      <main className="container mx-auto px-6 py-20">
        <div className="text-center mb-12">
            <h1 className="text-6xl font-extrabold">The Canon</h1>
            <p className="mt-4 text-xl text-gray-400">
                The foundational philosophical and architectural texts of DeepThought Labs.
            </p>
        </div>
        <div className="max-w-4xl mx-auto">
          {Object.entries(documentsByCategory).map(([category, docs]) => (
            <div key={category} className="mb-10">
              <h2 className="text-4xl font-bold text-blue-400 mb-6">{category}</h2>
              <ul className="space-y-4">
                {docs.map((doc) => (
                  <li key={doc.slug} className="bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200">
                    <Link href={`/canon/${doc.slug}`} className="block p-6">
                      <h3 className="text-2xl font-bold text-white">{doc.title}</h3>
                      <p className="text-gray-400 mt-2 line-clamp-2">{doc.abstract}</p>
                      {doc.podcast_file && (
                        <span className="mt-3 inline-block bg-green-600 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">Podcast Available</span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>
      <footer className="bg-gray-900 py-10 mt-20 border-t border-gray-800">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} DeepThought Labs. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

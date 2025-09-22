// src/app/canon/[slug]/page.tsx
import matter from 'gray-matter';
import ReactMarkdown from 'react-markdown';
import { notFound } from 'next/navigation';
import Header from '../../../components/Header';
import { getManifest, getDocument as getDocumentData } from '../../../lib/content-utils';

// This function tells Next.js which slugs (routes) to pre-render at build time.
export async function generateStaticParams() {
  const manifest = getManifest();
  return manifest.map((doc) => ({
    slug: doc.slug,
  }));
}

// This function fetches and prepares the data for a specific document.
function getDocument(slug: string) {
    const docData = getDocumentData(slug);

    if (!docData) {
        return null;
    }

    // Metadata is from the manifest, content is from the markdown file.
    const { content: rawContent, ...meta } = docData;
    const { content: parsedContent } = matter(rawContent);

    return {
        ...meta,
        content: parsedContent,
    };
}

export default function CanonDocument({ params }: { params: { slug: string } }) {
  const doc = getDocument(params.slug);

  if (!doc) {
    notFound();
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Header />
      <main className="container mx-auto px-6 py-20">
        <article className="prose prose-invert lg:prose-xl mx-auto">
          <h1>{doc.title}</h1>
          <p className="text-gray-400 mb-4">Category: {doc.category}</p>
          <div className="text-gray-300 mb-8 italic">
            <p>{doc.abstract}</p>
          </div>
          {doc.podcast_file && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">Listen to the Podcast</h2>
              <audio controls className="w-full">
                <source src={`/podcasts/${doc.podcast_file}`} type="audio/mpeg" />
                <track kind="captions" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
          <ReactMarkdown>{doc.content}</ReactMarkdown>
        </article>
      </main>
      <footer className="bg-gray-900 py-10 border-t border-gray-800">
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

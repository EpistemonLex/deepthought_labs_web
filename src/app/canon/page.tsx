// src/app/canon/page.tsx
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import Header from '../../components/Header';

// This function fetches the metadata for all documents.
function getAllDocuments() {
  const canonDir = path.join(process.cwd(), 'src/canon');
  const filenames = fs.readdirSync(canonDir);

  const documents = filenames.map((filename) => {
    const filePath = path.join(canonDir, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContents);

    return {
      slug: filename.replace(/\.md$/, ''),
      title: data.title,
      date: data.date_published,
    };
  });

  // Sort documents by date, newest first
  return documents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export default function CanonIndex() {
  const documents = getAllDocuments();

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
          <ul className="space-y-4">
            {documents.map((doc) => (
              <li key={doc.slug} className="bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200">
                <Link href={`/canon/${doc.slug}`} className="block p-6">
                  <h2 className="text-2xl font-bold text-blue-400 hover:text-blue-300">{doc.title}</h2>
                  <p className="text-gray-400 mt-2">
                    Published on: {new Date(doc.date).toLocaleDateString()}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
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

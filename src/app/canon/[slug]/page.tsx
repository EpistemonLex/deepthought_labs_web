// src/app/canon/[slug]/page.tsx
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import ReactMarkdown from 'react-markdown';
import { notFound } from 'next/navigation';
import Header from '../../../components/Header';

// This function tells Next.js which slugs (routes) to pre-render at build time.
export async function generateStaticParams() {
  const canonDir = path.join(process.cwd(), 'src/canon');
  const filenames = fs.readdirSync(canonDir);
  return filenames.map((filename) => ({
    slug: filename.replace(/\.md$/, ''),
  }));
}

// This function fetches the data for a specific document.
function getDocument(slug: string) {
  const canonDir = path.join(process.cwd(), 'src/canon');
  const filePath = path.join(canonDir, `${slug}.md`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    title: data.title,
    author: data.author,
    date: data.date_published,
    content,
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
          <div className="text-gray-400 mb-8">
            <span>By {doc.author}</span> | <span>Published on: {new Date(doc.date).toLocaleDateString()}</span>
          </div>
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

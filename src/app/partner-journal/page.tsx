'use client';
import Link from 'next/link';
import Header from '../../components/Header';

const journals = [
  {
    title: 'Case Study: How Acme Corp Accelerated Research with DeepThought',
    description:
      'Learn how the competitive intelligence team at Acme Corp transformed their workflow from data aggregation to strategic thinking.',
    href: '/partner-journal/acme-corp-case-study',
  },
];

export default function PartnerJournal() {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Header />
      <main className="container mx-auto px-6 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold">Vanguard Partner Journals</h1>
          <p className="mt-4 text-xl text-gray-400">
            Authentic stories of how our partners solve real-world problems.
          </p>
        </div>

        <div className="mt-16 max-w-2xl mx-auto space-y-8">
          {journals.map((journal) => (
            <Link
              href={journal.href}
              key={journal.href}
              className="block p-8 border border-gray-700 rounded-lg hover:bg-gray-800 transition-all duration-300"
            >
              <h2 className="text-2xl font-bold text-white">
                {journal.title}
              </h2>
              <p className="mt-2 text-gray-400">{journal.description}</p>
              <span className="mt-4 inline-block font-semibold text-brand-blue">
                Read Case Study &rarr;
              </span>
            </Link>
          ))}
        </div>
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

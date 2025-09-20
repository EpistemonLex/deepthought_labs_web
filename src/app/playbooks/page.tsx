'use client';
import Link from 'next/link';
import Header from '../../components/Header';

const playbooks = [
  {
    title: 'Integrating DeepThought with Logseq',
    description:
      'A step-by-step guide to connect your DeepThought knowledge graph with your local Logseq graph.',
    href: '/playbooks/logseq-integration',
  },
  {
    title: 'Automating LibreOffice Workflows with DeepThought Agents',
    description:
      'Leverage agentic capabilities to automate common tasks within the LibreOffice suite.',
    href: '/playbooks/libreoffice-automation',
  },
];

export default function Playbooks() {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Header />
      <main className="container mx-auto px-6 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold">The Open Blueprint</h1>
          <p className="mt-4 text-xl text-gray-400">
            A collection of playbooks for integrating DeepThought with your
            favorite tools.
          </p>
        </div>

        <div className="mt-16 max-w-2xl mx-auto space-y-8">
          {playbooks.map((playbook) => (
            <Link
              href={playbook.href}
              key={playbook.href}
              className="block p-8 border border-gray-700 rounded-lg hover:bg-gray-800 transition-all duration-300"
            >
              <h2 className="text-2xl font-bold text-white">
                {playbook.title}
              </h2>
              <p className="mt-2 text-gray-400">{playbook.description}</p>
              <span className="mt-4 inline-block font-semibold text-brand-blue">
                Read Playbook &rarr;
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

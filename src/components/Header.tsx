'use client';

import { useState } from 'react';
import Link from 'next/link';

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} className="block sm:inline-block text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
    {children}
  </Link>
);

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="container mx-auto px-6 py-4 flex justify-between items-center border-b border-gray-700 pb-4">
      <Link href="/" className="text-2xl font-bold text-white">
        DeepThought Labs
      </Link>
      <div className="sm:hidden">
        <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
          {isOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-x"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-menu"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>
      </div>
      <nav className={`absolute sm:relative top-20 left-0 sm:top-0 sm:left-auto w-full sm:w-auto bg-gray-900 sm:bg-transparent ${isOpen ? 'block' : 'hidden'} sm:block`}>
        <div className="flex flex-col sm:flex-row items-center">
            <NavLink href="/whitepaper">Whitepaper</NavLink>
            <NavLink href="/ukw-framework">UKW Framework</NavLink>
            <NavLink href="/conceptual-seeding">Conceptual Seeding</NavLink>
            <NavLink href="/symbiotic-disbelief">Symbiotic Disbelief</NavLink>
            <NavLink href="/emergent-application">Emergent Application</NavLink>
            <NavLink href="/playbooks">Playbooks</NavLink>
            <NavLink href="/partner-journal">Partner Journals</NavLink>
            <NavLink href="/roadmap">Roadmap</NavLink>
            <NavLink href="/atelier">The Atelier</NavLink>
        </div>
      </nav>
    </header>
  );
}

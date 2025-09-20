import Image from "next/image";
import { useState } from 'react';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Header */}
      <header className="container mx-auto px-6 py-4 flex justify-between items-center border-b border-gray-700 pb-4">
        <h1 className="text-2xl font-bold">DeepThought Labs</h1>
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-300 hover:text-white focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
        </div>
        <nav className="hidden md:flex space-x-4">
          <a href="/whitepaper" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Whitepaper</a>
          <a href="/ukw-framework" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">UKW Framework</a>
          <a href="/conceptual-seeding" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Conceptual Seeding</a>
          <a href="/symbiotic-disbelief" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Symbiotic Disbelief</a>
          <a href="/emergent-application" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Emergent Application</a>
          <a href="/roadmap" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Roadmap</a>
          <a href="/atelier" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">The Atelier</a>
          <a href="/#contact" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Contact</a>
        </nav>
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-gray-900 border-b border-gray-700 py-4 z-10">
            <nav className="flex flex-col items-center space-y-2">
              <a href="/whitepaper" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium">Whitepaper</a>
              <a href="/ukw-framework" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium">UKW Framework</a>
              <a href="/roadmap" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium">Roadmap</a>
              <a href="/atelier" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium">The Atelier</a>
              <a href="/#contact" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium">Contact</a>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-20 text-center">
        <h2 className="text-5xl font-extrabold">The Architecture of Synthesis</h2>
        <p className="mt-4 text-xl text-gray-400">A new paradigm for building complex, evolvable, and resilient software systems.</p>
        <div className="mt-8">
          <a href="/whitepaper" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full">
            Read the Whitepaper
          </a>
        </div>
      </main>

      {/* Section: The Problem */}
      <section id="problem" className="py-24 bg-gray-800 border-t border-gray-700">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <p className="mt-4 text-lg text-gray-300">Traditional software development is rigid, brittle, and fails to adapt. 'Big Up Front' approaches lead to wasted effort, over-engineering, and systems that quickly become obsolete.</p>
        </div>
      </section>

      {/* Section: The Solution */}
      <section id="solution" className="py-24 border-t border-gray-800">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <h3 className="text-3xl font-bold">The Solution</h3>
          <p className="mt-4 text-lg text-gray-300">Our 'Architecture of Synthesis' is a dynamic, generative paradigm. We move beyond rigid design, embracing iterative cycles and targeted experimentation to build viable, adaptable architectures that thrive in constant change.</p>
        </div>
      </section>

      {/* Section: The Proof */}
      <section id="proof" className="py-24 bg-gray-800 border-t border-gray-700">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <h3 className="text-3xl font-bold">The Proof</h3>
          <p className="mt-4 text-lg text-gray-300">Proven by emergent design and composition over inheritance, our approach powers innovations like the Generative UI (GenUI) Framework. DeepThought builds flexible, evolvable systems that adapt to context and foster new, unanticipated capabilities.</p>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 py-10">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400">&copy; {new Date().getFullYear()} DeepThought Labs. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
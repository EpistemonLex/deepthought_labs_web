import Link from 'next/link';
import Header from '../components/Header';

export default function Home() {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Header />

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-20 text-center">
        <h2 className="text-6xl font-extrabold">
          The Architecture of Synthesis
        </h2>
        <p className="mt-4 text-xl text-gray-400">
          A new paradigm for building complex, evolvable, and resilient software
          systems.
        </p>
        <div className="mt-8">
          <Link
            href="/whitepaper"
            className="bg-brand-blue hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg"
          >
            Read the Whitepaper
          </Link>
        </div>
      </main>

      {/* Section: The Problem */}
      <section
        id="problem"
        className="py-24 bg-gray-800 border-t border-gray-700"
      >
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <p className="mt-4 text-lg text-gray-300">
            Traditional software development is rigid, brittle, and fails to
            adapt. &apos;Big Up Front&apos; approaches lead to wasted effort,
            over-engineering, and systems that quickly become obsolete.
          </p>
        </div>
      </section>

      {/* Section: The Solution */}
      <section id="solution" className="py-24 border-t border-gray-800">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <h3 className="text-3xl font-bold">The Solution</h3>
          <p className="mt-4 text-lg text-gray-300">
            Our &apos;Architecture of Synthesis&apos; is a dynamic, generative
            paradigm. We move beyond rigid design, embracing iterative cycles
            and targeted experimentation to build viable, adaptable
            architectures that thrive in constant change.
          </p>
        </div>
      </section>

      {/* Section: The Proof */}
      <section
        id="proof"
        className="py-24 bg-gray-800 border-t border-gray-700"
      >
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <h3 className="text-3xl font-bold">The Proof</h3>
          <p className="mt-4 text-lg text-gray-300">
            Proven by emergent design and composition over inheritance, our
            approach powers innovations like the Generative UI (GenUI)
            Framework. DeepThought builds flexible, evolvable systems that adapt
            to context and foster new, unanticipated capabilities.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 py-10">
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

import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Header */}
      <header className="container mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">DeepThought Labs</h1>
        <nav>
          <a href="/whitepaper" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Whitepaper</a>
          <a href="#contact" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Contact</a>
        </nav>
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
      <section id="problem" className="py-20 bg-gray-800">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold">The Problem</h3>
          <p className="mt-4 text-lg text-gray-300">The rigidity and failure of traditional software design.</p>
          {/* Content will be added here */}
        </div>
      </section>

      {/* Section: The Solution */}
      <section id="solution" className="py-20">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold">The Solution</h3>
          <p className="mt-4 text-lg text-gray-300">Introducing the "Architecture of Synthesis" as the new paradigm.</p>
          {/* Content will be added here */}
        </div>
      </section>

      {/* Section: The Proof */}
      <section id="proof" className="py-20 bg-gray-800">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold">The Proof</h3>
          <p className="mt-4 text-lg text-gray-300">Showcasing concrete applications like "Generative UI" and "Dynamic Backend Reconfiguration".</p>
          {/* Content will be added here */}
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
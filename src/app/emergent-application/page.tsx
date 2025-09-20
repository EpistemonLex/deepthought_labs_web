import ReactMarkdown from 'react-markdown';
import { useState } from 'react';

const markdownContent = `
# The Emergent Application: An Architecture for Agentic Systems

For decades, the paradigm of software development has been fundamentally monolithic and feature-driven. We design applications as centralized, coherent artifacts, where developers explicitly code every feature, define every workflow, and anticipate every user interaction. This approach has brought us far, but it is reaching its limits in an era of hyper-personalization and artificial intelligence. The future does not lie in building bigger, more complex monoliths; it lies in cultivating ecosystems from which intelligent behavior can emerge. We call this new paradigm the Emergent Application.

An Emergent Application is not a single program but a dynamic, decentralized system composed of three core primitives: Sovereign Agents, a Shared State Fabric, and a Protocol for Interaction. Complex, personalized application experiences are not explicitly coded but arise from the real-time collaboration of these components, orchestrated by the user's intent.

## 1. The Sovereign Agent

The fundamental unit of an Emergent Application is the Sovereign Agent. This is not merely a user account; it is a user's cryptographically-verifiable, self-owned identity. Each user generates and controls their own private key, stored securely on their personal devices. This key is their passport to the digital world, allowing them to authenticate, authorize, and sign interactions without relying on a centralized identity provider.

This cryptographic identity is the foundation of user sovereignty. It ensures that the user, and only the user, is the ultimate authority over their data and actions. In this model, the "application" does not own the user's identity; the user brings their identity to the application. This architectural choice is the bedrock of a trustless system where control is pushed to the edges, directly into the hands of the user.

## 2. The Shared State Fabric

Traditional applications silo data in centralized databases, creating moats that prevent interoperability and lock users into a single platform. The Emergent Application replaces this with a Shared State Fabric, a distributed data layer built on Conflict-free Replicated Data Types (CRDTs).

CRDTs are data structures that can be updated concurrently by multiple users without coordination, and which will always mathematically converge to the same state. Think of it as a shared digital canvas where anyone can draw at any time, and the final picture is always a perfect merge of everyone's contributions, regardless of network delays or offline edits.

This fabric is the medium for collaboration. When a user creates a document, a knowledge graph, or any shared digital artifact, they are creating a CRDT-based object within this fabric. Other Sovereign Agents can be invited to interact with this object. Their changes are broadcast as cryptographically signed deltas, and the state is seamlessly synchronized across all participants' devices. There is no single, central "source of truth" database; the truth is the convergent state of the distributed fabric itself.

## 3. The Protocol for Interaction

With Sovereign Agents and a Shared State Fabric, the final piece is the protocol that governs their interaction. This is not a rigid API in the traditional sense, but a lightweight set of rules for how agents discover each other, request access to shared objects, and exchange state deltas.

The primary communication channel is a hybrid network of peer-to-peer connections and decentralized relays. When possible, agents communicate directly, minimizing latency and reliance on central infrastructure. When direct connection is not feasible, they can use a network of hubs to relay messages.

The "application logic" itself becomes a collection of specialized AI agents—some provided by the platform, some by third parties, and some even trained by the users themselves. A "summarization agent" can be invited to a shared document to produce an abstract. A "data visualization agent" can be pointed at a dataset within the fabric to generate charts. The user composes their "application" on the fly by granting different agents access to different parts of their data fabric.

## The Emergence of Intelligence

In this architecture, the application as we know it disappears. It is replaced by a fluid, user-directed experience. A user might start with a blank note (a CRDT object), invite a colleague (another Sovereign Agent), and then grant access to a research AI (a specialized agent). The resulting interaction—a collaborative research and writing session—was not a pre-programmed "feature." It emerged from the interaction of the core primitives.

This is a profound shift. It moves us from building rigid, closed systems to cultivating open, generative ecosystems. It is an architecture that is inherently more resilient, more private, and more aligned with user agency. It is the necessary foundation for a future of truly personal and agentic computing.
`

export default function EmergentApplication() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="bg-gray-900 text-white min-h-screen">
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
              <a href="/conceptual-seeding" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium">Conceptual Seeding</a>
              <a href="/symbiotic-disbelief" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium">Symbiotic Disbelief</a>
              <a href="/emergent-application" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium">Emergent Application</a>
              <a href="/roadmap" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium">Roadmap</a>
              <a href="/atelier" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium">The Atelier</a>
              <a href="/#contact" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium">Contact</a>
            </nav>
          </div>
        )}
      </header>
      <main className="container mx-auto px-6 py-20">
        <article className="prose prose-invert lg:prose-xl mx-auto">
          <ReactMarkdown>{markdownContent}</ReactMarkdown>
        </article>
      </main>
      <footer className="bg-gray-900 py-10">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400">&copy; {new Date().getFullYear()} DeepThought Labs. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

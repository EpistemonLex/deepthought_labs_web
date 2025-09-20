'use client';
import ReactMarkdown from 'react-markdown';
import Header from '../../components/Header';

const markdownContent = `
# Journal: How Acme Corp Accelerated Research with DeepThought

For the competitive intelligence team at Acme Corp, staying ahead of market trends is everything. Their workflow, however, was a bottleneck. Analysts spent hundreds of hours per week manually sifting through industry reports, financial filings, and news articles, trying to connect disparate pieces of information into a coherent strategic picture. The process was slow, prone to human error, and made it difficult to spot emerging trends before they became common knowledge.

"We were drowning in data but starved for insight," says Jane Doe, Head of Strategy at Acme. "Our team was brilliant, but they were spending 80% of their time on low-level data aggregation and only 20% on high-level analysis. We needed to flip that ratio."

## The Challenge: A Fragmented Knowledge Base

Acme's core problem was a fragmented knowledge base. Information lived in PDFs on a shared drive, notes in individual documents, and links in spreadsheets. There was no central, interconnected graph of their collective knowledge. When a new analyst joined, the onboarding process was arduous, and when an experienced analyst left, their institutional knowledge walked out the door with them.

## The Solution: A Distributed Knowledge Network

Acme Corp became a Vanguard Partner for White.ai's DeepThought platform. The goal was to transition from a collection of static documents to a living, distributed knowledge network.

**Ingesting the Corpus:** The first step was to ingest their entire archive of thousands of reports and articles into a DeepThought knowledge graph. DeepThought's agents automatically processed each document, extracting key entities, concepts, and relationships.

**Real-time Collaboration:** Using DeepThought's CRDT-based shared state fabric, the entire team could now work on the same knowledge graph simultaneously. An analyst in London could add a note about a new European regulation, and their colleague in New York would see the update in real-time, along with its connection to a US-based competitor they were tracking.

**Agentic Analysis:** The real breakthrough came from leveraging DeepThought's AI agents. Instead of manually reading a 100-page report, an analyst could now task an agent: "Summarize the key risks mentioned in this Q3 earnings report and cross-reference them with any supply chain vulnerabilities identified in our existing graph." The agent would return a concise summary with direct links back to the source data in seconds.

## The Result: From Data Janitors to Strategic Thinkers

Within three months of deploying DeepThought, Acme Corp's intelligence workflow was transformed.

*   **Time Savings:** The time spent on manual data aggregation dropped by over 75%.
*   **Insight Velocity:** The team was able to identify and report on three major market shifts weeks ahead of their competitors.
*   **Knowledge Persistence:** The centralized graph became their collective brain, preserving insights and making onboarding new team members dramatically more efficient.

"DeepThought didn't just make us faster; it changed the way we think," concludes Doe. "It freed my team from the drudgery of data collection and turned them into true strategic thinkers. We're not just reacting to the market anymore; we're anticipating it."
`;

export default function AcmeCorpCaseStudy() {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Header />
      <main className="container mx-auto px-6 py-20">
        <article className="prose prose-invert lg:prose-xl mx-auto">
          <ReactMarkdown>{markdownContent}</ReactMarkdown>
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

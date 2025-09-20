'use client';
import ReactMarkdown from 'react-markdown';
import Header from '../../../components/Header';

const markdownContent = `
# Playbook: Integrating DeepThought with Logseq

This playbook provides a step-by-step guide to connect your DeepThought knowledge graph with your local Logseq graph, enabling seamless synchronization of insights and notes.

## Prerequisites

*   DeepThought Desktop v2.0.0 or later.
*   Logseq v0.10.0 or later.
*   A valid DeepThought license.

## Step 1: Enable the Local Sync Service in DeepThought

The DeepThought desktop application contains a local sync service that acts as a bridge to other applications.

1.  Open DeepThought **Preferences**.
2.  Navigate to the **Integrations** tab.
3.  Enable the **Local Sync Service (CRDT Hub)** toggle.
4.  Note the local WebSocket URL provided (e.g., \`ws://localhost:38472\`).

## Step 2: Install the DeepThought Plugin for Logseq

We provide an official plugin through the Logseq marketplace.

1.  In Logseq, navigate to the **Plugins** section.
2.  Open the **Marketplace**.
3.  Search for "DeepThought Sync" and click **Install**.
4.  Once installed, enable the plugin.

## Step 3: Configure the Plugin

The plugin needs to know how to connect to your local DeepThought instance.

1.  Go to the settings for the "DeepThought Sync" plugin.
2.  In the "Hub WebSocket URL" field, enter the URL you noted in Step 1.
3.  Choose your desired sync mode:
    *   **Bidirectional:** Changes in Logseq are sent to DeepThought, and vice-versa.
    *   **Read-only:** Logseq will only receive updates from DeepThought.
4.  Save the settings.

## Step 4: Verifying the Connection

Once configured, the plugin will attempt to connect. A status indicator in the Logseq toolbar will turn green to signify a successful connection. Any new pages or blocks created in your DeepThought graph will now appear in a dedicated "DeepThought" section of your Logseq journal.
`;

export default function LogseqIntegrationPlaybook() {
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

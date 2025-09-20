'use client';
import ReactMarkdown from 'react-markdown';
import Header from '../../components/Header';

const markdownContent = `
# Playbook: Automating LibreOffice Workflows with DeepThought Agents

Leverage the agentic capabilities of DeepThought to automate common tasks within the LibreOffice suite, including document summarization and data extraction.

## Prerequisites

*   DeepThought Desktop v2.1.0 or later.
*   LibreOffice v7.5 or later.
*   A DeepThought "Pro" tier license to access agentic features.

## Use Case 1: Summarizing a Writer Document

1.  Open your text document in **LibreOffice Writer**.
2.  In the **DeepThought desktop application**, create a new "Task."
3.  Select the **"Summarize Document"** agent.
4.  In the agent's input field, you can either paste the text directly or provide a local file path to the \`.odt\` document (e.g., \`file:///path/to/your/document.odt\`).
5.  Execute the agent. DeepThought will process the document and produce a concise summary in the output panel.

## Use Case 2: Extracting Data from a Calc Spreadsheet

Imagine you have a spreadsheet of contacts in LibreOffice Calc with columns for Name, Email, and Phone.

1.  In DeepThought, select the **"Extract Structured Data"** agent.
2.  Provide the local file path to your \`.ods\` spreadsheet.
3.  In the "Extraction Schema" field, define the structure of the data you want in JSON format:
    \`\`\`json
    {
      "contacts": [
        {
          "name": "string",
          "email": "string"
        }
      ]
    }
    \`\`\`
4.  Execute the agent. DeepThought will read the spreadsheet, extract the relevant data according to your schema, and output a clean JSON array.
`;

export default function LibreOfficeAutomationPlaybook() {
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

# Web Content Roadmap & Strategy

This document outlines the strategic plan and operational workflow for managing and publishing content on the DeepThought Labs website. It is a living document that will guide our content sprints.

---

## **Strategy: The Tiered Knowledge Funnel**

Our content is structured in three tiers to serve different audience needs, from casual browsers to deep researchers. The goal is to provide multiple entry points and guide users toward a deeper understanding of our work.

### **Tier 1: The Discovery Layer**
*   **Purpose:** Capture initial interest with low-effort, high-value content.
*   **Assets:**
    *   **Abstracts:** A 2-3 paragraph summary for every major document.
    *   **Podcasts:** Audio versions of the core documents.
*   **Location:** Displayed at the top of each document page in "The Canon."

### **Tier 2: The Learning Layer**
*   **Purpose:** Provide digested, focused knowledge on specific topics.
*   **Assets:**
    *   **Blog Posts / Articles:** Shorter pieces exploring a single concept.
    *   **Playbooks & Guides:** Practical, step-by-step tutorials.
    *   **Curated White Papers:** Synthesized documents addressing a specific theme.
*   **Location:** `/articles`, `/playbooks`, etc. These will link back to their Tier 3 sources.

### **Tier 3: The Reference Layer**
*   **Purpose:** The unabridged, authoritative source of truth.
*   **Assets:** The full markdown documents of our foundational work.
*   **Location:** `/canon`.

---

## **Content Workflow**

1.  **Vetting (Director & Strunk.ai):** A document from the `deepthought_docs` repo is approved for public release.
2.  **Synchronization (Director):** The approved `.md` file is synced to the `deepthought_web/src/canon` directory.
3.  **Derivative Generation (Director with Gemini Tools):**
    *   Generate the **Abstract**.
    *   Locate the corresponding **Podcast audio file** (`.mp3`).
4.  **Asset Integration (Eich.ai):** The Director hands off the abstract text and audio file to Eich.ai for website integration.
5.  **Content Sprint Planning (All):** We identify opportunities for Tier 2 content derived from the new document.

---

## **Content Sprints**

This section serves as our active backlog.

### **Sprint 1: Pilot Program (In Progress)**

**Goal:** To process the first batch of 3-5 foundational documents to prove and refine the workflow.

**Instructions for Director:**
Please select 3-5 documents for this pilot. For each document, add its filename below and place the generated Abstract and the name of the Podcast file next to it. When a row is complete, Eich.ai will handle the integration.

| Canon Document File (`.md`) | Abstract (Paste Here) | Podcast File (`.mp3`) | Status      |
| :-------------------------- | :-------------------- | :-------------------- | :---------- |
| `your-document-name-1.md`   | `(Your abstract...)`  | `podcast-file-1.mp3`  | `Pending`   |
| `your-document-name-2.md`   | `(Your abstract...)`  | `podcast-file-2.mp3`  | `Pending`   |
| `your-document-name-3.md`   | `(Your abstract...)`  | `podcast-file-3.mp3`  | `Pending`   |
| `your-document-name-4.md`   | `(Your abstract...)`  | `podcast-file-4.mp3`  | `Pending`   |
| `your-document-name-5.md`   | `(Your abstract...)`  | `podcast-file-5.mp3`  | `Pending`   |

---
*This table will be updated as work is completed and new sprints are planned.*

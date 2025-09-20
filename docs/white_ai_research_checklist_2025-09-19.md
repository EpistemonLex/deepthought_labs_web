## White.ai Research Checklist: Enabling the "Transparent Workshop" Vision

This document consolidates all questions and requirements for White.ai to fully implement the "Transparent Workshop" web strategy. It is designed as a living checklist for the DeepThought Labs team to track progress in gathering necessary information and resources.

---

### **Phase 1: The Atelier & Foundational Texts**

#### **1.1. "The Atelier: The Workbench for Agentic AI" - Cloudflare Workers AI Integration (Frontend Implemented)**

**Goal:** To enable the interactive GenUI demo (`/atelier`) to generate actual UI mock-ups using DeepThought Labs' AI capabilities, hosted on Cloudflare.

**Frontend Implementation Status:** The `src/app/atelier/page.tsx` component has been updated to call the specified endpoint (`https://api.white.ai/v1/genui`), handle the request/response formats (including Base64 decoding for `ui_component`), and include basic error handling. A placeholder for authentication (`Authorization: Bearer YOUR_SECRET_TOKEN`) is included but requires the actual token to be provided securely.

**Required Information (for Backend/Cloudflare Deployment):**

*   **Cloudflare Workers AI Endpoint URL:**
    *   **Addressed in Frontend.** The frontend is configured to call `https://api.white.ai/v1/genui`.
*   **API Input Format (JSON):**
    *   **Addressed in Frontend.** The frontend sends: `{"prompt": "string", "constraints": { "framework": "react", "style_guide": "tailwind_css_v3" }}`.
*   **API Output Format (JSON):**
    *   **Addressed in Frontend.** The frontend expects: `{"ui_component": "base64_string", "metadata": { ... }, "error": null}`.
*   **Authentication/Authorization Details:**
    *   **CRITICAL:** What is the actual secret token for the `Authorization: Bearer` header? This needs to be securely provided (e.g., via Cloudflare Secrets or environment variables during deployment).
    *   What is the specific authentication method for the Cloudflare Worker itself to validate this token?
*   **Rate Limiting/Usage Policies:**
    *   Are there any rate limits or usage quotas for the Cloudflare Workers AI endpoint? If so, what are they, and how should the frontend handle exceeding them? (Frontend has basic error handling for 429, but specific policy details are needed for robust implementation).
*   **Error Handling Specifications:**
    *   What are the expected HTTP status codes and error message formats for different failure scenarios from the GenUI API? (Frontend has basic error handling for `response.ok` and generic catch, but more specific handling for 400, 401, 429, 500, 503 is needed based on backend implementation).

**Development Considerations (for your team's awareness):**

*   **AI Model Selection:** Which specific AI model will be used for UI generation?
*   **Prompt Engineering Strategy:** How will the user's raw prompt be processed/transformed before being sent to the AI model?
*   **UI Output Constraints:** How will the AI's output be ensured to produce valid, well-formed HTML/CSS/JSX?
*   **Scalability Plan:** How will the Cloudflare Worker handle anticipated load and concurrent requests?

---

#### **1.2. "Publish the Canon" - Additional Foundational Content**

**Goal:** To expand the foundational intellectual property available on the website, beyond "The Architecture of Synthesis."

**Required Information:**

*   **Markdown Content Files:**
    *   Provide the full markdown (`.md`) content for the following key documents:
        *   "The Principle of Symbiotic Disbelief"
        *   "The Emergent Application"
        *   (List any other core philosophical or architectural texts you wish to publish)
*   **Source Location:** Confirm these documents will be provided from the `deepthoughtdocs` repository (Strunk.ai's domain).
*   **Format:** Markdown (`.md`) files are preferred for easy integration and rendering.
*   **Metadata for Each Document (Optional but Recommended):**
    *   For each document, specify:
        *   `title`: The display title for the web page.
        *   `slug`: The URL-friendly path segment (e.g., `symbiotic-disbelief`).
        *   `author`: (if different from DeepThought Labs).
        *   `date_published`: For display purposes.

---

### **Phase 2: The Sovereign User's Toolkit & Open Blueprint**

#### **2.1. "The Sovereign Utility Page" - License Management & Downloads**

**Goal:** To provide a secure, simple mechanism for license holders to manage their ownership, ensuring license portability and protecting user data.

**Required Information:**

*   **License Key Validation API Endpoint:**
    *   What is the API endpoint for validating a user's license key?
    *   What is the input/output format for this API?
    *   What authentication is required?
*   **Download Link Generation API/Logic:**
    *   How will secure, versioned download links for the DeepThought desktop application be generated based on a validated license?
    *   What are the input/output formats and authentication for this?
*   **User Data Storage/Retrieval:**
    *   How will user-specific license data (e.g., purchased version, entitlement dates) be stored and retrieved securely?
    *   What PII (if any) is collected, and how is it handled in compliance with privacy regulations?

---

#### **2.2. "The Open Blueprint" - Playbooks & Partner Journals**

**Goal:** To share hard-won knowledge and demonstrate deep, API-less integrations, fostering a community of empowered users.

**Required Information:**

*   **Playbook Content:**
    *   Provide markdown content for initial "playbooks" demonstrating integrations (e.g., Logseq, LibreOffice).
*   **Vanguard Partner Journal Content:**
    *   Provide initial "Vanguard Partner Journal" content (markdown format, potentially AI-generated from Strunk.ai).
*   **Content Management Strategy:**
    *   How will new playbooks and journals be added and managed over time? (e.g., direct markdown files in the repo, a headless CMS, integration with `deepthoughtdocs`?)

---

### **Phase 3: The Distributed Knowledge Network (V2 Vision)**

#### **3.1. Product-Led Authentication**

**Goal:** To enable anonymous-but-verified access to community features, respecting user privacy while protecting the network.

**Required Information:**

*   **Desktop App Key Generation Logic:**
    *   Detailed specification of how the DeepThought desktop application will generate a unique, anonymous key for web/community access.
*   **Key Validation Backend Service:**
    *   API endpoint and specifications for a backend service to validate these generated keys.

---

#### **3.2. "Community Innovation Sync"**

**Goal:** To allow users to make their local DeepThought instance as smart as anyone else's by syncing a shared "Community Innovation" graph.

**Required Information:**

*   **Shared Graph Data Structure:**
    *   Detailed specification of the data structure for the "Community Innovation" graph (blocks, personas, workflows).
*   **Sync Protocol/API:**
    *   API endpoints and protocol for managing and distributing this shared graph (e.g., peer-to-peer, centralized hub).
*   **Desktop App Integration:**
    *   Specifications for how the DeepThought desktop app will integrate with this sync mechanism.

---

### **General Requirements & Preferences**

*   **Visual Assets:**
    *   Provide any specific logos, icons, or imagery (e.g., SVG, PNG) to be incorporated into the site.
*   **Brand Guidelines:**
    *   Any specific brand guidelines, color palettes, or typography preferences beyond the current Tailwind CSS defaults.
*   **Feedback on Current UI:**
    *   Specific feedback on the current styling and layout of the landing page, whitepaper, roadmap, and atelier pages.

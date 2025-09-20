## White.ai Research Project Plan: Enabling the "Transparent Workshop" Vision

**Project Goal:** To gather all necessary technical specifications, content, and strategic decisions required for White.ai to fully implement the "Transparent Workshop" web strategy, moving beyond current mock implementations and placeholders.

**Target Audience for this Document:** DeepThought Labs team members responsible for backend development, Cloudflare infrastructure, content creation (Strunk.ai), and strategic decision-making.

**Expected Outcome:** A complete set of definitive answers to all questions, enabling White.ai to proceed with full implementation of Phases 1, 2, and 3 of the web roadmap.

---

### **Phase 1: The Atelier & Foundational Texts**

#### **1.1. "The Atelier: The Workbench for Agentic AI" - Cloudflare Workers AI Integration**

**Objective:** To obtain the precise technical details for the Cloudflare Workers AI backend that will power the GenUI demo.

**Research Questions (Requiring Definitive Answers):**

1.  **Authentication Token:**
    *   What is the exact secret token (or method to retrieve it securely) that White.ai's frontend should use in the `Authorization: Bearer <TOKEN>` header when calling `https://api.white.ai/v1/genui`?
    *   *Expected Answer Format:* The token itself, or clear instructions on how White.ai (as a deployed Cloudflare Pages application) can securely access it (e.g., via Cloudflare Pages Environment Variables, Cloudflare Workers Secrets).
2.  **Cloudflare Worker Authentication Logic:**
    *   What is the specific authentication logic implemented within the Cloudflare Worker (`api.white.ai/v1/genui`) to validate the provided bearer token? (e.g., is it a static token check, a JWT validation, etc.?)
    *   *Expected Answer Format:* A brief description of the validation mechanism.
3.  **Rate Limiting Policy:**
    *   What are the exact rate limiting rules configured for `https://api.white.ai/v1/genui` on Cloudflare WAF? (e.g., requests per minute per IP, per token).
    *   *Expected Answer Format:* Specific numbers (e.g., "10 requests per 60 seconds per IP").
4.  **Detailed Error Handling:**
    *   For each of the following HTTP status codes, confirm the exact JSON error response body that the `api.white.ai/v1/genui` endpoint will return:
        *   `400 Bad Request` (e.g., malformed JSON, missing prompt)
        *   `401 Unauthorized` (e.g., missing/invalid token)
        *   `429 Too Many Requests` (rate limit exceeded)
        *   `500 Internal Server Error` (unexpected backend error)
        *   `503 Service Unavailable` (backend service temporarily down)
    *   *Expected Answer Format:* JSON examples for each status code, matching the `{"error": {"code": "string", "message": "string"}}` schema.
5.  **AI Model & Prompt Engineering (for Context/Debugging):**
    *   Which specific AI model is being used by the Cloudflare Worker for UI generation?
    *   What is the high-level prompt engineering strategy (e.g., single-shot, multi-step Chain-of-Thought) employed by the Worker?
    *   *Expected Answer Format:* Model name (e.g., "@cf/meta/llama-3.1-8b-instruct"), and a brief description of the prompting approach.

---

#### **1.2. "Publish the Canon" - Additional Foundational Content**

**Objective:** To obtain the complete content for additional core philosophical and architectural documents to be published on the website.

**Research Questions (Requiring Definitive Answers):**

1.  **"The Principle of Symbiotic Disbelief" Content:**
    *   Provide the complete markdown (`.md`) content for this document.
    *   *Expected Answer Format:* The full text of the markdown file.
2.  **"The Emergent Application" Content:**
    *   Provide the complete markdown (`.md`) content for this document.
    *   *Expected Answer Format:* The full text of the markdown file.
3.  **Other Canonical Documents:**
    *   Are there any other core philosophical or architectural texts that should be published as part of "The Canon" in Phase 1? If so, provide their complete markdown (`.md`) content.
    *   *Expected Answer Format:* Full markdown text for each additional document.
4.  **Metadata for Each Document:**
    *   For each document provided (including Symbiotic Disbelief and Emergent Application), confirm the following metadata:
        *   `title`: The official display title.
        *   `slug`: The URL-friendly path segment (e.g., `symbiotic-disbelief`).
        *   `author`: The attributed author (e.g., "DeepThought Labs").
        *   `date_published`: The publication date (YYYY-MM-DD).
    *   *Expected Answer Format:* A list of metadata objects for each document.

---

### **Phase 2: The Sovereign User's Toolkit & Open Blueprint**

#### **2.1. "The Sovereign Utility Page" - License Management & Downloads**

**Objective:** To define the API and logic for secure license validation and software downloads.

**Research Questions (Requiring Definitive Answers):**

1.  **License Key Validation API Endpoint:**
    *   What is the exact URL for the license key validation API? (Expected: `https://api.white.ai/v1/licenses/validate`)
    *   What is the complete JSON input schema for this endpoint?
    *   What is the complete JSON output schema for success (200 OK) and failure (e.g., 404 Not Found, 403 Forbidden)?
    *   What authentication is required for this endpoint (e.g., API key, JWT)?
2.  **Secure Download Link Generation API:**
    *   What is the exact URL for the download token request API? (Expected: `https://api.white.ai/v1/downloads/request`)
    *   What is the complete JSON input schema for this endpoint (including `license_key`, `version`, `platform`)?
    *   What is the complete JSON output schema for success (200 OK)?
    *   What is the exact URL for the download retrieval API? (Expected: `https://api.white.ai/v1/downloads/retrieve?token=<download_token>`)
    *   What authentication is required for these download APIs?
3.  **PII Handling & Data Privacy:**
    *   Confirm the final PII Data Classification and Handling Policy (Table 1 from `Cloudflare.md`). Are there any modifications or additional PII fields collected?
    *   Confirm the specific technical controls for GDPR/CCPA compliance (encryption, access control, user rights, retention policy).

---

#### **2.2. "The Open Blueprint" - Playbooks & Partner Journals**

**Objective:** To establish the content management strategy and obtain initial content for playbooks and partner journals.

**Research Questions (Requiring Definitive Answers):**

1.  **Initial Playbook Content:**
    *   Provide the complete markdown (`.md`) content for at least 2-3 initial "playbooks" demonstrating DeepThought's integrations (e.g., Logseq, LibreOffice).
2.  **Initial Vanguard Partner Journal Content:**
    *   Provide the complete markdown (`.md`) content for at least 1-2 initial "Vanguard Partner Journals."
3.  **Content Management Strategy Confirmation:**
    *   Confirm the decision to start with a Git-based content workflow for Phase 2.
    *   Confirm the long-term plan to migrate to an API-driven headless CMS for Phase 3.
    *   If a headless CMS is already selected, what is its name/provider?

---

### **Phase 3: The Distributed Knowledge Network (V2 Vision)**

#### **3.1. Product-Led Authentication**

**Objective:** To define the technical specifications for application-generated cryptographic identity and the challenge-response authentication flow.

**Research Questions (Requiring Definitive Answers):**

1.  **Desktop App Key Generation:**
    *   Confirm the cryptographic library and curve to be used (e.g., OpenSSL, secp521r1).
    *   Confirm the secure storage locations on each OS (macOS Keychain, Windows Credential Manager, Linux keyring/TPM).
2.  **Challenge-Response Communication:**
    *   Confirm the chosen method for the web frontend to communicate with the local desktop application for challenge passing (e.g., secure local WebSocket, custom protocol handler). Provide technical details for the chosen method.
3.  **Key Validation Backend Service:**
    *   What is the exact URL for the key validation API? (Expected: `https://api.white.ai/v2/auth/verify`)
    *   What is the complete JSON input schema for this endpoint?
    *   What is the complete JSON output schema for success (200 OK) and failure?

---

#### **3.2. "Community Innovation Sync"**

**Objective:** To define the technical specifications for the CRDT-based distributed knowledge network.

**Research Questions (Requiring Definitive Answers):**

1.  **CRDT Library/Implementation:**
    *   Which specific CRDT library will be used (e.g., GUN, Yjs, or custom implementation)?
2.  **Central Sync Hub API:**
    *   What is the exact URL for the WebSocket endpoint for real-time sync? (Expected: `wss://api.white.ai/v2/graph/subscribe`)
    *   What is the exact URL for the state catch-up REST endpoint? (Expected: `https://api.white.ai/v2/graph/state`)
    *   What is the protocol for sending/receiving state deltas over the WebSocket?
3.  **Desktop App Integration:**
    *   What are the specifications for how the DeepThought desktop app will integrate with this sync mechanism (e.g., how it maintains local CRDT state, sends/receives deltas)?

---

### **General Requirements & Preferences**

**Objective:** To gather overarching design and branding assets/guidelines.

**Research Questions (Requiring Definitive Answers):**

1.  **Visual Assets:**
    *   Provide all official logos (vector and raster formats).
    *   Provide any specific icons or imagery to be incorporated into the site.
2.  **Brand Guidelines:**
    *   Provide official brand guidelines, including color palettes (hex codes), typography (font files or Google Fonts links), and any specific design principles.
3.  **Feedback on Current UI:**
    *   Provide specific feedback on the current styling and layout of the landing page, whitepaper, roadmap, and atelier pages. (This is an ongoing feedback loop).

---

**Instructions for Providing Answers:**

Please provide answers to these questions in a structured format, ideally by referencing this document and filling in the "Expected Answer Format" sections, or by providing new documents that directly address these points.

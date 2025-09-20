## Requirements for White.ai: Enabling the "Transparent Workshop" Vision

This document outlines the specific technical and content requirements needed for White.ai to fully implement the "Transparent Workshop" web strategy, particularly focusing on Phase 1 deliverables. Meeting these requirements will allow White.ai to move beyond mock implementations and integrate with DeepThought Labs' core technologies and intellectual property.

---

### **1. Requirements for "The Atelier: The Workbench for Agentic AI" (Phase 1.1)**

**Goal:** To enable the interactive GenUI demo to generate actual UI mock-ups using DeepThought Labs' AI capabilities, hosted on Cloudflare.

**Technical Requirements:**

- **Cloudflare Workers AI Endpoint:**
  - **Description:** White.ai requires a secure, publicly accessible API endpoint (URL) hosted on Cloudflare Workers AI. This endpoint will receive a text prompt (e.g., "a user profile card with an avatar and a follow button") and return a generated UI mock-up (HTML/CSS/JSX string).
  - **Input Format (JSON):**
    ```json
    {
      "prompt": "string" // The user's textual description of the desired UI
    }
    ```
  - **Output Format (JSON):**
    ```json
    {
      "ui": "string", // The generated UI as an HTML/CSS/JSX string
      "metadata": {
        // Optional: Any relevant metadata about the generation
        "model_used": "string",
        "generation_time_ms": "number"
      }
    }
    ```
  - **Authentication/Authorization:** If the endpoint requires authentication (e.g., API keys, JWT tokens), White.ai needs:
    - The specific authentication method.
    - Any necessary keys or tokens (to be securely stored and accessed, e.g., via environment variables).
- **Rate Limiting/Usage Policies:** Information on any rate limits or usage quotas for the Cloudflare Workers AI endpoint to ensure the frontend can handle potential errors gracefully.
- **Error Handling:** Details on expected error responses from the endpoint (e.g., HTTP status codes, error message formats) for robust frontend error display.

**Development Considerations for Cloudflare Workers AI (for your research):**

- **Model Selection:** Which AI model will be used for UI generation (e.g., a fine-tuned LLM, a specialized image-to-code model)?
- **Prompt Engineering:** How will the user's raw prompt be transformed into an effective prompt for the AI model?
- **Output Formatting:** How will the AI's output be constrained to produce valid, usable HTML/CSS/JSX?
- **Scalability:** How will the Worker handle concurrent requests?

---

### **2. Content Requirements for "Publish the Canon" (Phase 1.2)**

**Goal:** To expand the foundational intellectual property available on the website, beyond "The Architecture of Synthesis."

**Content Requirements:**

- **Additional Whitepapers/Key Documents:** White.ai requires the full markdown content for the following (or similar) foundational documents:
  - "The Principle of Symbiotic Disbelief"
  - "The Emergent Application"
  - Any other core philosophical or architectural texts that define DeepThought Labs' unique approach.
- **Source Location:** These documents should ideally be provided from the `deepthoughtdocs` repository (Strunk.ai's domain).
- **Format:** Markdown (`.md`) files are preferred for easy integration and rendering.
- **Metadata (Optional but Recommended):** For each document, any desired metadata such as:
  - `title`: Display title for the web page.
  - `slug`: URL-friendly identifier (e.g., `symbiotic-disbelief`).
  - `author`: (if different from DeepThought Labs).
  - `date_published`: For display purposes.

---

### **3. General Content & Design Refinements (Ongoing)**

**Goal:** Continuously improve the clarity, impact, and user experience of the website.

**Requirements:**

- **Specific Feedback on Landing Page:** Detailed feedback on the refined "Problem," "Solution," and "Proof" sections, or any other part of `src/app/page.tsx`.
- **Visual Assets:** Any specific logos, icons, or imagery that should be incorporated into the site.
- **Styling Preferences:** Any specific brand guidelines or aesthetic preferences beyond the current Tailwind CSS setup.

---

**Next Steps for You:**

Please use this document to guide your research and discussions with relevant teams (e.g., Strunk.ai for content, Cloudflare/AI team for technical integration). Once you have the necessary information, provide it to White.ai, and I will integrate it into the web repository.

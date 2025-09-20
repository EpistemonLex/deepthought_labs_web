# Task for Jules: Implement GenUI Backend Service

**Objective:**
Replace the current mock implementation of the GenUI API endpoint with a fully functional, production-ready service that connects to Cloudflare's AI infrastructure. This task involves implementing the complete logic as specified in the project's "Transparent Workshop" blueprint.

**File to Modify:**
- `src/app/api/genui/route.ts`

---

### **Technical Requirements:**

1.  **Endpoint Logic:**
    -   The `POST` handler in `src/app/api/genui/route.ts` must be updated.
    -   It should receive a JSON body with a `prompt` field: `{ "prompt": "string" }`.

2.  **Authentication:**
    -   Implement a static bearer token authentication mechanism.
    -   The handler must read the `Authorization` header from the incoming request.
    -   It must validate the token against a secret token stored in an environment variable named `GENUI_API_TOKEN`.
    -   The expected token is `wht-live-sk-7b3d9a8f-c1e0-4f6a-8d2b-5c9e1a4g0h2i`.
    -   Use a timing-safe comparison for security.
    -   If authentication fails, return a `401 Unauthorized` error.

3.  **AI Integration:**
    -   The service must interact with the Cloudflare Workers AI platform.
    -   The target AI model is `@cf/meta/llama-3.1-8b-instruct`.
    -   You will need to use an appropriate SDK or fetch call to execute the model, passing the required Cloudflare account and authentication details (which should also be stored in environment variables).

4.  **Prompt Engineering:**
    -   Implement the specified multi-step Chain-of-Thought (CoT) prompting strategy:
        1.  **Deconstruction:** Send the user's prompt to the LLM, asking it to break down the UI request into a structured JSON object representing the component hierarchy.
        2.  **Code Generation:** Send the resulting JSON structure to the LLM with a second, more constrained prompt, instructing it to generate the React/JSX code based *only* on that structure.
    -   The code generation prompt must include negative constraints to prevent the model from generating insecure code (e.g., `<script>` tags, `onclick` handlers).

5.  **Output Formatting:**
    -   The final, generated UI code (string) must be **Base64 encoded**.
    -   The successful response (200 OK) must be a JSON object with the following structure:
        ```json
        {
          "ui_component": "base64_encoded_string",
          "metadata": {
            "model_used": "@cf/meta/llama-3.1-8b-instruct",
            "generation_time_ms": 1234
          },
          "error": null
        }
        ```

6.  **Error Handling:**
    -   Implement robust error handling that returns specific JSON responses for different failure scenarios, adhering to the project's standard error schema: `{"error": {"code": "string", "message": "string"}}`.
    -   **400 Bad Request:** For malformed requests (e.g., missing `prompt`).
    -   **401 Unauthorized:** For missing or invalid bearer tokens.
    -   **500 Internal Server Error:** For unexpected errors during AI model execution or other server-side issues.
    -   **503 Service Unavailable:** If the AI service itself is unavailable.

---

### **Acceptance Criteria:**

-   [ ] The mock logic in `src/app/api/genui/route.ts` is completely removed and replaced.
-   [ ] Requests without a valid `Authorization: Bearer <token>` header are rejected with a `401` status and the correct JSON error body.
-   [ ] A valid request with a prompt successfully returns a `200 OK` status.
-   [ ] The `ui_component` field in a successful response is a valid, non-empty Base64 encoded string.
-   [ ] The implementation correctly reads secrets from environment variables and does not contain any hardcoded credentials.
-   [ ] The multi-step prompting strategy is clearly implemented in the code.

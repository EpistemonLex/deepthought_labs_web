# Task for Jules: Implement Sovereign Utility API

**Objective:**
Create the backend API endpoints for software license validation and secure downloads, as specified in the "Transparent Workshop" blueprint. This task involves building the API structure and logic, but will use mock data for now (no database integration).

**Files to Create:**
- `src/app/api/v1/licenses/validate/route.ts`
- `src/app/api/v1/downloads/request/route.ts`
- `src/app/api/v1/downloads/retrieve/route.ts`
- `src/app/api/v1/licenses/validate/route.test.ts` (and similar for other routes)

---

### **Technical Requirements:**

#### **1. Common Requirements**
- **Authentication:** All endpoints in this task must be protected by a static API key. The key must be read from the `X-API-Key` HTTP header and validated against a secret stored in an environment variable named `INTEGRATOR_API_KEY`.
- **Error Handling:** Implement the standard JSON error schema (`{"error": {"code": "string", "message": "string"}}`) for all error conditions (e.g., 400, 401, 403, 500).
- **Mock Logic:** For this implementation, do not connect to a database. Use simple, in-memory logic for validation.

---

#### **2. License Key Validation Service**
- **File:** `src/app/api/v1/licenses/validate/route.ts`
- **Endpoint:** `POST /api/v1/licenses/validate`
- **Input Schema (JSON):**
  ```json
  {
    "license_key": "string",
    "product_id": "string",
    "fingerprint": { "type": "string", "value": "string" }
  }
  ```
- **Mock Validation Logic:**
  - If the `license_key` starts with `"DTL-VALID-"`, treat it as a valid license.
  - Otherwise, treat it as invalid.
- **Output Schema (200 OK - Valid):**
  ```json
  {
    "status": "valid",
    "license_key": "DTL-VALID-...",
    "tier": "pro",
    "expires_at": "2026-10-01T00:00:00Z"
  }
  ```
- **Output Schema (403 Forbidden - Invalid):**
  ```json
  {
    "status": "invalid",
    "reason_code": "not_found",
    "message": "The provided license key is not valid."
  }
  ```

---

#### **3. Secure Download Service (Step 1: Request Token)**
- **File:** `src/app/api/v1/downloads/request/route.ts`
- **Endpoint:** `POST /api/v1/downloads/request`
- **Input Schema (JSON):**
  ```json
  {
    "license_key": "string",
    "product_id": "string",
    "version": "string",
    "platform": "string"
  }
  ```
- **Logic:**
  1.  Perform the same mock license validation as the `/validate` endpoint. If invalid, return a `403 Forbidden` error.
  2.  If valid, generate a short-lived **JSON Web Token (JWT)**.
  3.  The JWT payload should contain the `product_id`, `version`, and `platform`.
  4.  The JWT should be signed with a secret from an environment variable named `JWT_DOWNLOAD_SECRET`.
  5.  Set the JWT to expire in 5 minutes (300 seconds).
- **Output Schema (200 OK):**
  ```json
  {
    "download_token": "your_generated_jwt_string",
    "expires_in": 300,
    "file_name": "DeepThought-2.1.0-arm64.dmg",
    "file_size": 123456789
  }
  ```

---

#### **4. Secure Download Service (Step 2: Retrieve Download)**
- **File:** `src/app/api/v1/downloads/retrieve/route.ts`
- **Endpoint:** `GET /api/v1/downloads/retrieve`
- **Logic:**
  1.  Read the JWT from the `token` query parameter (e.g., `.../retrieve?token=...`).
  2.  Validate the JWT's signature and expiry using the `JWT_DOWNLOAD_SECRET`.
  3.  If the token is valid, return a mock success response. **Do not stream a real file.** A simple text response or JSON object is sufficient.
  4.  If the token is invalid or expired, return a `403 Forbidden` error.
- **Response (200 OK - Success):**
  - Return a `Response` object with the body `"Mock file download successful."` and a `Content-Type` header of `text/plain`.
- **Response (403 Forbidden - Failure):**
  - Return a standard JSON error body.

---

### **Acceptance Criteria:**

-   [ ] All three new `route.ts` files are created and functional.
-   [ ] All endpoints are protected by the `X-API-Key` header.
-   [ ] The `/validate` endpoint correctly returns valid/invalid status based on the mock logic.
-   [ ] The `/request` endpoint correctly generates a JWT for a valid license key.
-   [ ] The `/retrieve` endpoint correctly validates a JWT and returns a mock success message.
-   [ ] All secrets (API key, JWT secret) are read from environment variables.
-   [ ] A comprehensive test suite is created for the new API endpoints, mocking environment variables and fetch calls as needed.

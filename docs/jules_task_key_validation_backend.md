# Task for Jules: Implement Key Validation Backend (Product-Led Cryptographic Identity)

**Objective:**
Implement the backend API endpoint for verifying cryptographic signatures as part of the Product-Led Cryptographic Identity system. This endpoint will be the first component of the V2 architecture, enabling anonymous-but-verified access to community features.

**File to Create:**
- `src/app/api/v2/auth/verify/route.ts`
- `src/app/api/v2/auth/verify/route.test.ts`

---

### **Technical Requirements:**

#### **1. Key Validation Backend**
- **File:** `src/app/api/v2/auth/verify/route.ts`
- **Endpoint:** `POST /api/v2/auth/verify`
- **Input Schema (JSON):**
  ```json
  {
    "public_key": "string",
    "challenge": "string",
    "signature": "string"
  }
  ```
  - `public_key`: The user's public key in PEM format.
  - `challenge`: The original nonce string that was sent by the server to the web frontend.
  - `signature`: The Base64-encoded signature of the challenge, as signed by the user's private key.

- **Mock Verification Logic:**
  - For this task, we will **mock** the cryptographic verification. The actual verification would involve a cryptographic library (e.g., Node.js `crypto` module) to verify the `signature` against the `challenge` using the `public_key`.
  - **Mock Success Condition:** If `public_key` contains the string `"MOCK_VALID_KEY"` AND `signature` contains `"MOCK_VALID_SIGNATURE"`, consider the verification successful.
  - **Mock Failure Condition:** Otherwise, consider the verification failed.

- **Output Schema (200 OK - Success):**
  ```json
  {
    "status": "verified",
    "session_token": "your_generated_jwt_string"
  }
  ```
  - `session_token`: A short-lived JWT. For this task, generate a simple JWT (e.g., using `jsonwebtoken` library) with a placeholder payload (e.g., `{ sub: 'mock_user_id' }`) and a short expiry (e.g., 15 minutes). The JWT secret should come from an environment variable `JWT_SESSION_SECRET`.

- **Output Schema (401 Unauthorized - Failure):**
  ```json
  {
    "status": "failed",
    "reason_code": "invalid_signature",
    "message": "The provided signature could not be verified with the given public key."
  }
  ```

- **Error Handling:**
  - Implement standard JSON error schema (`{"error": {"code": "string", "message": "string"}}`) for all error conditions (e.g., 400 for malformed input, 500 for internal errors).

---

### **Acceptance Criteria:**

-   [ ] The `src/app/api/v2/auth/verify/route.ts` file is created and functional.
-   [ ] The endpoint correctly handles `POST` requests.
-   [ ] Input validation for `public_key`, `challenge`, and `signature` is implemented.
-   [ ] The mock verification logic is correctly applied.
-   [ ] On mock success, a JWT is generated and returned with a `200 OK` status.
-   [ ] On mock failure, a `401 Unauthorized` status with the correct error body is returned.
-   [ ] All secrets (JWT secret) are read from environment variables.
-   [ ] A comprehensive test suite (`src/app/api/v2/auth/verify/route.test.ts`) is created, covering success cases, failure cases, and invalid inputs.

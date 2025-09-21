# Task for Jules: Backend Cryptographic Implementation for Product-Led Identity

**Objective:**
Replace the mock cryptographic verification logic in the Key Validation Backend with actual, robust cryptographic signature verification. This is a critical step towards enabling the secure, product-led authentication system.

**File to Modify:**
- `src/app/api/v2/auth/verify/route.ts`
- `src/app/api/v2/auth/verify/route.test.ts`

---

### **Technical Requirements:**

#### **1. Key Validation Backend (`src/app/api/v2/auth/verify/route.ts`)**
- **Replace Mock Logic:** Remove the current mock verification (`public_key.includes('MOCK_VALID_KEY') && signature.includes('MOCK_VALID_SIGNATURE')`).
- **Implement Real Cryptographic Verification:**
    - Use Node.js's built-in `crypto` module.
    - The verification should use the `public_key` (which will be provided in PEM format), the `challenge` (the original data that was signed), and the `signature` (Base64-encoded).
    - The specific algorithm to use for verification should be `sha512` with `rsa` or `ecdsa` (depending on the key type, but for now, assume `ecdsa` with `secp521r1` as per the blueprint, or make it flexible if `crypto` module allows). A common approach is `crypto.verify()`.
    - Ensure proper error handling for invalid keys, signatures, or algorithms.
- **JWT Generation:** Continue to generate a JWT on successful verification.

#### **2. Testing (`src/app/api/v2/auth/verify/route.test.ts`)**
- **Update Tests:** Modify the existing tests to reflect the real cryptographic verification.
- **Mock `crypto` Module (for tests):** For unit testing, you will need to mock the `crypto.verify` function to simulate successful and failed verifications without needing actual keys during tests.
- **Add Edge Cases:** Consider adding tests for malformed public keys, invalid signatures, or unsupported algorithms.

---

### **Acceptance Criteria:**

-   [ ] The mock verification logic is completely removed.
-   [ ] The `crypto` module is used for actual signature verification.
-   [ ] The endpoint correctly verifies a valid signature and returns a `200 OK`.
-   [ ] The endpoint correctly rejects an invalid signature and returns a `401 Unauthorized`.
-   [ ] Tests are updated to reflect the real cryptographic verification, with `crypto.verify` mocked appropriately.

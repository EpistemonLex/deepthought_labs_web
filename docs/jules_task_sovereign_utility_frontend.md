# Task for Jules: Frontend Integration for Sovereign Utility APIs

**Objective:**
Implement the necessary frontend components and logic to allow users to interact with the Sovereign Utility APIs (license validation and download requests). This will involve creating new UI elements and integrating them into the existing web application.

**Files to Create/Modify:**
- `src/app/sovereign-utility/page.tsx` (New page for the Sovereign Utility features)
- `src/lib/api.ts` (Add new API client functions)
- `src/components/LicenseValidator.tsx` (New component)
- `src/components/DownloadRequestForm.tsx` (New component)
- Corresponding test files for new components and API client functions.

---

### **Technical Requirements:**

#### **1. Sovereign Utility Page (`src/app/sovereign-utility/page.tsx`)**
- Create a new page that serves as the entry point for license management and software downloads.
- This page should include:
    - A clear heading (e.g., "Sovereign Utility: Manage Your DeepThought Assets").
    - Sections for "License Validation" and "Software Downloads."
    - Integrate the `LicenseValidator` and `DownloadRequestForm` components.

#### **2. API Client Functions (`src/lib/api.ts`)**
- Add new asynchronous functions to `src/lib/api.ts` to interact with the Sovereign Utility backend APIs:
    - `validateLicense(licenseKey: string, productId: string, fingerprint: object): Promise<LicenseValidationResponse>`
    - `requestDownload(licenseKey: string, productId: string, version: string, platform: string): Promise<DownloadRequestResponse>`
- These functions must include the `X-API-Key` header with the `INTEGRATOR_API_KEY` (read from an environment variable or similar secure client-side method).
- Implement robust error handling, parsing the standardized JSON error responses from the backend.

#### **3. License Validator Component (`src/components/LicenseValidator.tsx`)**
- Create a React component that allows a user to input a license key and product ID.
- On submission, it should call the `validateLicense` API function.
- Display the validation result (e.g., "License Valid: Pro Tier, Expires: YYYY-MM-DD" or "License Invalid: Not Found").
- Include loading and error states.

#### **4. Download Request Form Component (`src/components/DownloadRequestForm.tsx`)**
- Create a React component that allows a user to input a license key, product ID, desired version, and platform.
- On submission, it should call the `requestDownload` API function.
- If successful, display the `file_name`, `file_size`, and a button/link to initiate the actual download (which would call the `/api/v1/downloads/retrieve` endpoint with the `download_token`).
- Include loading and error states.

#### **5. Secure API Key Handling**
- Ensure the `INTEGRATOR_API_KEY` is not hardcoded in the client-side code. It should be accessed securely (e.g., from a client-side environment variable that is populated at build time, or fetched from a secure endpoint if applicable).

#### **6. Testing**
- Create unit tests for the new API client functions in `src/lib/api.test.ts`.
- Create unit tests for the `LicenseValidator` and `DownloadRequestForm` components, simulating user interaction and API responses.

---

### **Acceptance Criteria:**

-   [ ] A new page `/sovereign-utility` is accessible and displays the license validation and download request forms.
-   [ ] Users can input data into the forms and submit them.
-   [ ] The forms correctly call the respective backend APIs.
-   [ ] API responses (success and error) are clearly displayed to the user.
-   [ ] The `INTEGRATOR_API_KEY` is handled securely on the frontend.
-   [ ] All new components and API client functions have corresponding tests.

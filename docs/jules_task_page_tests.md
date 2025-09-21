# Task for Jules: Write Tests for Next.js Pages

**Objective:**
Improve the test coverage for key Next.js pages, ensuring the stability and reliability of our frontend components and their interactions.

**Files to Create/Modify:**
- `src/app/atelier/page.test.tsx`
- `src/app/sovereign-utility/page.test.tsx`
- `src/app/canon/page.test.tsx`
- `src/app/canon/[slug]/page.test.tsx`
- `src/app/page.test.tsx` (if it contains significant logic beyond pure rendering)

---

### **Technical Requirements:**

#### **1. Testing Framework & Approach**
- Use **React Testing Library** for all tests.
- Focus on testing user interactions, component rendering, and data display.
- Avoid testing internal implementation details; focus on observable behavior.

#### **2. Specific Pages to Test**

*   **`/atelier` (`src/app/atelier/page.tsx`):**
    - Test rendering of the form elements.
    - Test user input and submission.
    - Test loading, success, and error states for UI generation.
    - Mock the `generateUI` API call from `src/lib/api.ts`.
*   **`/sovereign-utility` (`src/app/sovereign-utility/page.tsx`):**
    - Test rendering of the `LicenseValidator` and `DownloadRequestForm` components.
    - Ensure proper layout and integration of sub-components.
    - (Note: The sub-components themselves have their own tests, so focus on the page's composition).
*   **`/canon` (`src/app/canon/page.tsx`):**
    - Test rendering of the document list.
    - Test grouping by category.
    - Test display of title, abstract, and podcast availability indicator.
    - Mock the `getManifest` function to control test data.
*   **`/canon/[slug]` (`src/app/canon/[slug]/page.tsx`):**
    - Test rendering of a single document, including title, abstract, podcast player, and markdown content.
    - Test handling of missing documents (e.g., `notFound()`).
    - Mock the `getDocument` function to control test data.
*   **`/` (Homepage - `src/app/page.tsx`):**
    - If this page contains significant interactive elements or complex logic, add tests for its rendering and behavior.
    - If it's primarily static content, a basic rendering test might suffice, or it can be skipped if deemed low risk.

#### **3. Mocking External Dependencies**
- For API calls (e.g., `generateUI`), use Vitest's mocking capabilities to simulate successful responses and error conditions.
- For file system operations (e.g., `fs.readFileSync` in Canon pages), mock these functions to provide controlled test data.

---

### **Acceptance Criteria:**

-   [ ] New test files are created for the specified pages.
-   [ ] Tests cover the key functionalities and user interactions of each page.
-   [ ] The test coverage report (after running `npm run test -- --coverage`) shows a significant increase in coverage for the `src/app` directory, particularly for the tested pages.
-   [ ] All tests pass.

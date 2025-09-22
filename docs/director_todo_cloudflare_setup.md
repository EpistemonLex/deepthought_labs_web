# Director's TODO: GenUI Cloudflare Setup

This document outlines the necessary steps to configure the Cloudflare environment for the GenUI backend service. These are critical infrastructure tasks that enable the GenUI Atelier to function with real AI capabilities and proper security.

---

## **Objective:**

Ensure the Cloudflare Workers AI endpoint for GenUI (`/api/genui`) is fully operational, authenticated, and protected by rate limiting.

## **Tasks & How-To Guide:**

### **1. Obtain Cloudflare Account Credentials**

To interact with Cloudflare Workers AI, the backend service needs specific credentials.

*   **`CLOUDFLARE_ACCOUNT_ID`:**
    *   **What it is:** Your unique Cloudflare account identifier.
    *   **How to get it:**
        1.  Log in to your Cloudflare dashboard.
        2.  Select your account.
        3.  The Account ID is typically found on the right-hand sidebar under "API" or "Account Details."
        4.  Alternatively, it's part of the URL when you're in your account dashboard (e.g., `https://dash.cloudflare.com/<ACCOUNT_ID>/...`).

copied account ID from cloudflare.com
        0d07fec381db8c7e1dae61329c4eaf26

*   **`CLOUDFLARE_API_TOKEN`:**
    *   **What it is:** A specific API Token with permissions to run AI models.
    *   **How to get it:**
        1.  Log in to your Cloudflare dashboard.
        2.  Go to "My Profile" (top right corner, usually your email or user icon).
        3.  Navigate to "API Tokens" -> "Create Token."
        4.  Select "Create Custom Token."
        5.  **Token Name:** Give it a descriptive name (e.g., `deepthought-genui-ai-worker`).
        6.  **Permissions:**
            *   **Account:** `Workers AI` -> `Edit`
            *   **Account:** `Account Settings` -> `Read` (might be needed for some SDKs, but `Workers AI Edit` is primary).
        7.  **Client IP Address Filtering (Optional but Recommended):** For enhanced security, you can restrict this token to specific IP addresses if your deployment environment has a static IP.
        8.  **Save the Token:** Cloudflare will display the token **only once**. Copy it immediately and store it securely.
workers AI api key
mwySaRzYriWHfEHGAZUSLsWwaNRoVKO3BUaa7Ilf


### **2. Define GenUI Service API Token**

This token protects your `/api/genui` endpoint from unauthorized access.

*   **`GENUI_API_TOKEN`:**
    *   **What it is:** A secret string that the frontend will send in the `Authorization: Bearer` header, and the backend will validate.
    *   **How to get it:** This is a token you generate yourself. It should be a long, random, and complex string. You can use a password generator or a command-line tool (e.g., `openssl rand -base64 32` on Linux/macOS, or an online secure password generator).
    *   **Example:** `wht-live-sk-7b3d9a8f-c1e0-4f6a-8d2b-5c9e1a4g0h2i` (as specified in the blueprint).

### **3. Configure Environment Variables in Cloudflare Pages/Workers**

These secrets must be securely injected into your deployed application.

*   **Where to configure:**
    1.  Log in to your Cloudflare dashboard.
    2.  Navigate to your **Workers & Pages** project (e.g., `deepthought_web`).
    3.  Go to "Settings" -> "Environment Variables."
    4.  Add the following variables:
        *   `CLOUDFLARE_ACCOUNT_ID` = `(Your Account ID)`
        *   `CLOUDFLARE_API_TOKEN` = `(Your AI API Token)`
        *   `GENUI_API_TOKEN` = `(Your Self-Generated GenUI API Token)`
        *   `INTEGRATOR_API_KEY` = `(Your Self-Generated API Key for Sovereign Utility APIs)`
        dtl-integrator-sk-a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6
        *   `JWT_DOWNLOAD_SECRET` = `(Your Self-Generated Secret for Download JWTs)`
        another-secure-download-jwt-key-uvw987xyz654abc321def098ghi765jkl
        *   `JWT_SESSION_SECRET` = `(Your Self-Generated Secret for Session JWTs - for V2 Auth)`
        new-session-jwt-secret-def987ghi654jkl321mno098pqr765stu432vwx
    5.  Ensure these are set for the **Production** environment and any **Preview** environments you use.

### **4. Configure Cloudflare WAF Rate Limiting for GenUI**

This protects your GenUI endpoint from abuse and controls costs.

*   **How to configure:**
    1.  Log in to your Cloudflare dashboard.
    2.  Navigate to your domain/zone.
    3.  Go to "Security" -> "WAF" -> "Rate Limiting Rules."
    4.  Click "Create Rate Limiting Rule."
    5.  **Rule Name:** `GenUI API Rate Limit`
    6.  **If a visitor requests:** `URL Path` `contains` `/api/genui`
    7.  **With the same:** `IP Address`
    8.  **And the count is greater than:** `10`
    9.  **During a `60` second period**
    10. **Then:** `Block`
    11. **For:** `60` seconds
    12. **Action:** `Block`

---
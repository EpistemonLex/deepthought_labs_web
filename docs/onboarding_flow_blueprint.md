# Onboarding Flow Blueprint: The "Prerequisite-First" Model

**Date:** 2025-09-22
**Author:** Jules, AI Software Engineer
**Status:** Draft

---

## 1. Core Philosophy

To ensure a successful and frustration-free first-run experience, we are adopting a "Prerequisite-First" onboarding model. This model inverts the traditional "download then configure" flow. It requires the user to confirm they have a working Language Model (LLM) backend **before** the download button for the DeepThought desktop application is enabled.

This approach aligns with our brand value of **Trust** by preventing users from downloading a non-functional application. It also manages user expectations by clarifying upfront that DeepThought is a powerful interface to an LLM, not a self-contained application.

---

## 2. The Download Page: A Guided Choice

The download page will not be a simple link. It will be an interactive, guided checklist that presents the user with two clear paths to get started.

- **Headline:** "Get Ready to Run DeepThought"
- **Sub-headline:** "DeepThought is a local-first application that requires a Language Model to function. Choose your setup path below to unlock your download."

The page will feature two side-by-side options: "The Guided Start (API Key)" and "The Sovereign Setup (LM Studio)".

---

## 3. Path A: The Guided Start (API Key)

This path is designed for the majority of users who want the simplest setup with the highest performance.

- **Step 1: Get Your Key**
  - **Instruction:** "First, you'll need an API key from a provider like OpenAI or Anthropic."
  - **Action:** A prominent link: `[ Click here to get your OpenAI API key ]` (opens in a new tab).

- **Step 2: Confirm You Have Your Key**
  - **Instruction:** "Once you have your key, please confirm below."
  - **Action:** A checkbox that the user must tick. The download button remains disabled until this is checked.
    - `[ ] I have a valid API key ready to use.`

- **Step 3: Download DeepThought**
  - **Instruction:** "Great! You're ready to go."
  - **Action:** The download button for the desktop application is now enabled.

---

## 4. Path B: The Sovereign Setup (LM Studio)

This path is for power users and privacy-focused professionals who want to run everything locally. We will recommend LM Studio as the preferred local server solution.

- **Step 1: Install LM Studio & Get a Model**
  - **Instruction:** "DeepThought connects to a local server powered by LM Studio. First, you'll need to set it up."
  - **Action:**
    - Link: `[ Download LM Studio Here ]`
    - Recommendation: "We suggest starting with a small, efficient model. In LM Studio, search for and download **Phi-3-mini-4k-instruct-q4**."

- **Step 2: Start the Server**
  - **Instruction:** "Inside LM Studio, navigate to the local server tab (the `<->` icon) and click 'Start Server'."
  - **Action:** An annotated screenshot of the LM Studio UI will be displayed, highlighting the server tab and the "Start Server" button.

- **Step 3: Attest & Download**
  - **Instruction:** "Please confirm that your local server is running **before** downloading DeepThought."
  - **Action:** The download button is enabled only after the user has checked **all** of the following boxes:
    - `[ ] I have successfully installed LM Studio.`
    - `[ ] I have downloaded a model and it is fully loaded in LM Studio.`
    - `[ ] I have clicked "Start Server" and the server is currently running on my machine.`
    - `[ ] I understand that DeepThought requires a running LM Studio server to function in this mode.`

---

## 5. The Installer Check

To further prevent user frustration, the DeepThought application installer itself will perform a pre-flight check for users who chose Path B.

- **Logic:** Upon launching, the installer will attempt to connect to the default LM Studio server address (`localhost:1234`).
- **Success:** If a connection is made, the installation proceeds as normal.
- **Failure:** If the connection fails, the installer will halt and display a helpful error message: "DeepThought could not connect to your LM Studio server. Please make sure the server is running in LM Studio and then try the installation again."

---

## 6. A Note on Mac / Apple Silicon

The instructions for Path B can be dynamically tailored for Mac users.

- **Model Recommendation:** When a macOS user is detected, we can more confidently recommend a larger, more capable model (e.g., a quantized 8B Llama 3 model), as Apple Silicon hardware is generally well-suited for this task.
- **Streamlined Instructions:** The guide can be more direct, as there are fewer hardware variables to account for.

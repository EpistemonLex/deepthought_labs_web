# Deepthought UI/UX Blueprint
**Version: 1.3**
**Date: 2025-08-14**
**Author: Guido.AI**

## 1. Executive Summary & Recovery Protocol

### 1.1. Purpose
This document is the definitive architectural blueprint and implementation roadmap for the Deepthought application's user interface. It translates the high-level vision of a "Sovereign Workshop" for knowledge work into a concrete, phased, and verifiable engineering plan. Its primary purpose is to ensure that all development work is aligned, efficient, and produces a high-quality, maintainable, and performant user experience.

This document, in conjunction with the `docs/reference/ai_engineering_charter.md`, provides a complete and sufficient context for any developer or AI agent to understand the project's goals, architecture, and process, and to resume work at any point.

### 1.2. Recovery Protocol
If development is interrupted, a new agent can resume work by following these steps:
1.  **Read the Engineering Charter:** First, read and internalize `docs/reference/ai_engineering_charter.md` to understand the project's core principles, quality standards, and development process.
2.  **Read this Blueprint:** Second, read this `UI_UX_BLUEPRINT.md` document in its entirety to understand the product vision, the UI architecture, and the detailed implementation plan.
3.  **Identify the Current State:** Review the project's Git history and the state of the code to identify the last completed step in the **Phased Implementation Roadmap** (Section 4).
4.  **Resume Work:** Begin work on the next incomplete step, strictly following its **Task**, **Location**, **Details**, and **Verification** criteria.

---

## 2. The UI Implementation Manifesto
This manifesto codifies the "why" behind our architectural choices. It is the philosophical foundation upon which the UI is built.

*   **Principle 1: The UI Must Serve the "Flow State."** The primary feature of a tool for thought is the absence of friction. Every millisecond of latency or unresponsiveness breaks the user's concentration.
    *   **Engineering Mandate:** We will use a **native-first approach** with PySide6's performant widgets. Performance is not a luxury; it is the core requirement.

*   **Principle 2: Deconstruct, Don't Just Copy.** We will emulate the *verbs* of the Logseq experience (Capture, Connect, Contextualize), not just the nouns (buttons, panes).
    *   **Engineering Mandate:** The UI architecture will be built around these verbs. The multi-pane layout is the physical embodiment of this principle, enabling all three verbs simultaneously.

*   **Principle 3: Assemble Tools, Not a Monolith.** A workshop is modular. Our UI will be the same.
    *   **Engineering Mandate:** We will use a **component-based architecture**. Each major UI element will be a self-contained custom widget, preventing a "Big Ball of Mud" and ensuring the system is maintainable and extensible.

*   **Principle 4: Symbiosis with the Data Vault.** We do not reinvent the wheel. Our application is an intelligence layer, not a text editor.
    *   **Engineering Mandate:** We will treat the user's local Logseq directory as the **authoritative Data Vault**. We will **never** build features that replicate Logseq's core competency of text editing and file management. Our role is to read from the vault and provide novel interfaces (like the real-time mind map) for understanding that data. A "Launch Logseq" button is a first-class feature, reflecting this partnership.

*   **Principle 5: Configuration via Conversation.** A power tool should not require an engineering degree to operate. The complexity of the engine must be abstracted away. The user should express their *intent*, and the AI should handle the implementation.
    *   **Engineering Mandate:** All complex configuration screens (settings, agent creation) will be designed as **conversational interfaces**. Instead of presenting a user with dozens of esoteric controls, we will present them with a chat prompt to `grace.ai`, who will guide them through setup, translate their goals into technical settings, and populate the controls on their behalf. The user always retains the ability to manually override these settings.

---

## 2.1. The Deepthought Workbench Model
The application is not a single window but a **constellation of specialized windows** managed by a central application core. This allows the user to tailor their workspace to their hardware and workflow, separating active interaction from passive monitoring.

*   **The Cockpit (Primary Window):** The main, interactive three-pane window. This is the user's primary control surface for active work with the AI agents. It is optimized for high-frequency interaction.

*   **The Engine Room (`LiveLogWindow`):** A separate, secondary window designed for real-time, detailed monitoring of the backend processes. It displays a verbose, scrolling log of agent actions, file system changes, test runs, and other low-level events. It is designed to be placed alongside a code editor.

*   **The Observatory (`DashboardWindow`):** A separate, tertiary window for high-level, passive situational awareness. It displays rich, visual dashboards of project health, knowledge graphs, and long-term progress metrics. It is designed for a secondary or tertiary monitor where it can be glanced at, not actively interacted with.

*   **Engineering Mandate:** The `ChatController` will serve as the central hub, managing the state of all windows. New signals will be created to route specific types of information (e.g., `detailed_log_message`, `dashboard_metric_updated`) to the appropriate window. All secondary windows will be launchable from the "Cockpit" main window.

---

## 3. Core Architecture & Technology Stack

*   **UI Framework:** PySide6
*   **Styling:** The `qdarkstyle` library will be used for a professional, dark theme foundation. Custom QSS will be used for specific overrides and component styling.
*   **Layout:** Native Qt Layouts (`QSplitter`, `QDockWidget`, `QHBoxLayout`, `QVBoxLayout`, `QGridLayout`).
*   **Component Structure:** All new custom UI widgets will be created within the `src/deepthought/ui/components/` directory.
*   **Data Vault:** The user's local Logseq directory. Our application has read-only access to this vault. All content creation and editing are deferred to the Logseq application itself.

---

## 4. Phased Implementation Roadmap
This is the sequential, step-by-step plan for building the UI. Each step is an atomic, verifiable unit of work.

### **Phase 1: The Skeleton & Theme**
**Status: ✅ COMPLETE**

*   **Step 1.1: Install and Apply Theme** - ✅
*   **Step 1.2: Create Component Directory** - ✅
*   **Step 1.3: Implement Three-Pane Layout** - ✅
    *   **Location:** `src/deepthought/ui/main_window.py`.
*   **Step 1.4: Stub Out Core Components** - ✅

### **Phase 2: The Input Loop**
**Status: ✅ COMPLETE**

*   **Step 2.1: Build and Integrate the `ChatInputBar`** - ✅
    *   **Location:** `src/deepthought/ui/components/chat_input_bar.py`, `src/deepthought/ui/components/main_chat_view.py`, `src/deepthought/ui/main_window.py`.
*   **Step 2.2: Wire the "Send" Action** - ✅
    *   **Location:** `src/deepthought/ui/main_window.py`, `src/deepthought/ui/components/chat_input_bar.py`.

### **Phase 3: The Display Loop**
**Status: ✅ COMPLETE**

*   **Step 3.1: Build the `MessageBubble`** - ✅
*   **Step 3.2: Build the `ChatHistoryView`** - ✅
*   **Step 3.3: Wire the Display** - ✅
    *   **Location:** `src/deepthought/chat_controller.py`, `src/deepthought/ui/main_window.py`.

### **Phase 4: Navigation**
**Status: ✅ COMPLETE**

*   **Step 4.1: Implement the Left Sidebar Component** - ✅
*   **Step 4.2: Integrate the Left Sidebar** - ✅
    *   **Location:** `src/deepthought/ui/main_window.py`
*   **Step 4.3: Wire the "New Chat" Action** - ✅
    *   **Location:** `src/deepthought/ui/components/left_sidebar.py`, `src/deepthought/chat_controller.py`, `src/deepthought/ui/main_window.py`

### **Phase 5: Context & Observability**
**Status: ✅ COMPLETE**

*   **Step 5.1: Build the Right Sidebar Component** - ✅
*   **Step 5.2: Integrate the Right Sidebar** - ✅
    *   **Location:** `src/deepthought/ui/main_window.py`
*   **Step 5.3: Wire the Agent Scratchpad** - ✅
    *   **Location:** `src/deepthought/chat_controller.py`, `src/deepthought/ui/main_window.py`, `src/deepthought/ui/components/right_sidebar.py`

### **Phase 6: Main Toolbar**
**Status: ✅ COMPLETE**

*   **Step 6.1: Implement the Main Toolbar Component** - ✅
*   **Step 6.2: Integrate the Main Toolbar** - ✅
    *   **Location:** `src/deepthought/ui/main_window.py`
*   **Step 6.3: Wire the Toolbar Actions** - ✅
    *   **Location:** `src/deepthought/ui/main_window.py`

### **Phase 7: The Status Bar**
**Status: ✅ COMPLETE**

*   **Step 7.1: Create the Status Bar Component** - ✅
*   **Step 7.2: Integrate the Status Bar** - ✅
    *   **Location:** `src/deepthought/ui/main_window.py`
*   **Step 7.3: Wire the Status Bar Signals** - ✅
    *   **Location:** `src/deepthought/chat_controller.py`, `src/deepthought/ui/main_window.py`

### **Phase 8: The Workshop Control Panel (Settings Dialog)**
**Status: ⏳ PENDING**

*   **Step 8.1: Build Traditional Settings UI**
*   **Step 8.2: Integrate Conversational Pane**
*   **Step 8.3: Wire Conversational Controller**

### **Phase 9: The Round Table View**
**Status: ✅ COMPLETE**

*   **Step 9.1: Implement View Mode Switcher**
*   **Step 9.2: Build Round Table Layout**

### **Phase 10: The Agent Foundry**
**Status: ⏳ PENDING**

*   **Step 10.1: Create the `AgentFoundryDialog`**

### **Phase 11: The Conversational Guide**
**Status: ⏳ PENDING**

*   **Step 11.1: Implement Global Help Action**

### **Phase 12: The Engine Room & Observatory**
**Status: ✅ COMPLETE**

*   **Step 12.1: Create the `LiveLogWindow`** - ✅
*   **Step 12.2: Add Launch Action** - ✅
*   **Step 12.3: Wire Log Stream** - ✅
*   **Step 12.4: Create the `DashboardWindow`** - ✅
*   **Step 12.5: Add Launch Action** - ✅
*   **Step 12.6: Wire Dashboard Data** - ✅

---

## 5. Functionality Exposure Map
This table defines where and how each piece of core functionality is exposed to the user, ensuring a logical and consistent user experience that aligns with our UI Manifesto.

| Functionality | Exposure Point | UI Component / Mechanism | Rationale (Manifesto Principle) |
| :--- | :--- | :--- | :--- |
| **Core Chat** | Main UI | `MainChatView` (History, Input) | The central "verb" of the application. |
| **Start New Chat** | Main UI | `LeftSidebar` -> "New Chat" Button | Clear, accessible action for starting a new session. (P1: Flow State) |
| **Switch Chat Session** | Main UI | `LeftSidebar` -> `QListWidget` | Fast navigation between concurrent thought processes. (P1: Flow State) |
| **Model Selection** | Main UI | `MainToolbar` -> `ModelDropdown` | Global setting, easily accessible but not in the primary interaction path. |
| **Agent Observability** | Main UI | `RightSidebar` -> `AgentScratchpadView` | Real-time insight into the agent's "thought" process. (P2: Deconstruct) |
| **Engine Status** | Main UI | `StatusBar` -> `StatusIndicatorLabel` | Persistent, non-intrusive feedback on the system's state. (P1: Flow State) |
| **Token Usage** | Main UI | `StatusBar` -> `TokenCounterLabel` | Provides cost/complexity awareness without cluttering the main view. |
| **Context from Vault** | Main UI | `MainToolbar` -> "Load Context" Action | User explicitly pulls knowledge from their vault into the active session. (P4: Symbiosis) |
| **Send to Deepthought** | Logseq | Custom Logseq Slash Command (`/deepthought`) | Capture thoughts *where they happen* (in Logseq) and send to Deepthought for processing. (P2: Capture, P4: Symbiosis) |
| **Launch Logseq** | Main UI | `MainToolbar` -> "Launch Logseq" Button | Explicitly acknowledges Logseq as the partner for editing/authoring. (P4: Symbiosis) |
| **Knowledge Visualization** | Main UI | `RightSidebar` -> `MindMapView` (Tabbed) | Provides a novel way to "see" connections in the current context. (P2: Contextualize) |
| **Complex Data Analysis**| Plotly Dash App | Launched from Main UI | For highly interactive, data-heavy visualizations that would bog down a Qt app. Keeps the main UI fast. (P1: Flow State, P3: Assemble Tools) |
| **Settings** | Main UI | "Settings" Dialog (from Toolbar/Menu) | Houses less-frequently-accessed configurations (API keys, themes, etc.). |
| **Detailed Process Log** | Engine Room | `LiveLogWindow` | Provides real-time, detailed monitoring of the "coding swarm" and backend processes. |
| **High-Level Dashboard** | Observatory | `DashboardWindow` | Provides passive, high-level situational awareness of project health and knowledge structures. |
| | | | |
| **--- Global Tools & Configuration ---** | | | |
| **Open Settings** | Main UI | `MainToolbar` -> "Settings" Button | Provides a clear, global entry point for application configuration. |
| **Open Agent Foundry** | Main UI | `MainToolbar` -> "Foundry" Button | Provides a clear, global entry point for the core agent creation workflow. |
| **LLM Provider Config** | Settings Dialog | Conversational Flow with `grace.ai` | Configure API keys and base URLs for all supported LLM providers. (P5: Conversation) |
| **Multi-Persona Collaboration** | Main UI | `MainChatView` -> "Round Table" Mode | Facilitates complex problem-solving by orchestrating multiple agents. (P3: Assemble Tools) |
| **Agent/Persona Management** | Agent Foundry | `AgentFoundryDialog` | The single, authoritative "workshop" to collaboratively design, build, and test new agents with AI assistance. (P3: Assemble Tools) |

---

## 5.1. Core Interaction Views

## 6. UI Testing Strategy

Our UI testing strategy is based on the principle of **behavior-driven testing**. We use `pytest-qt` to simulate real user interactions and verify that the UI behaves as expected. This approach ensures that our tests are robust, reliable, and effective at catching regressions.

All UI tests should be written to test the application from the user's perspective. This means that tests should simulate user actions like clicking buttons, typing text, and selecting items from dropdowns, and then assert that the UI updates as expected.

We use the `qtbot` fixture provided by `pytest-qt` to simulate user interactions and to wait for signals to be emitted. This makes our tests more robust and less flaky.
The `MainChatView` is not a single, static component but a container for different interaction modes tailored to specific tasks. The user can switch between these views to match their workflow.

### 5.1.1. Zen Chat View (Default)
*   **Layout:** A traditional, linear, two-column chat history (user and AI).
*   **Interaction:** A one-to-one conversation between the user and a single, selected persona.
*   **Purpose:** Designed for focused, deep work, Q&A, and direct instruction. It minimizes distractions, supporting the "Flow State" (P1).

### 5.1.2. Round Table View
*   **Layout:** A central conversation thread with a dedicated area (e.g., a top bar or side panel) displaying the icons/names of all participating personas. Messages in the main thread are clearly attributed to the persona that generated them.
*   **Interaction:**
    *   The user can address a prompt to the entire "table" or `@mention` a specific persona to direct a question or task.
    *   Personas can be configured to respond to each other, with the user acting as the facilitator.
*   **Purpose:** For complex problem-solving, brainstorming, and synthesizing information from multiple expert domains. The user transitions from a simple conversationalist to an orchestrator of AI agents.
# Deepthought UI Architecture & User Workflow

**Version:** 1.2
**Audience:** AI Engineering Agents, Human Developers
**Purpose:** This document provides a functional overview of the Deepthought application's User Interface (UI). It is designed to be the primary bridge between user-centric goals and the underlying technical implementation. It explains the application's purpose from a user's perspective, details the major UI views ("Workbenches"), and maps critical user workflows to the core application logic.

**Philosophy:** The best-architected code is meaningless if it does not enable a clear, intuitive, and powerful user workflow. This document is laser-focused on that workflow, ensuring that all development efforts are aligned with delivering tangible user value.

---

## 1. The Core User Experience

Deepthought is a development environment for creating, managing, and deploying autonomous AI agents and their components (Personas, Tools, Knowledge Bases). The entire user experience is built around the **"Symbiotic Workbench"** metaphor.

### The Symbiotic Workbench Metaphor

Every major task in the application is performed in a dedicated "Workbench." Each workbench is a two-panel view:

-   **Left Panel (The "Workshop"):** This is the user's primary workspace. It contains structured controls, editors, and lists for creating or managing a specific type of resource (e.g., a list of chat sessions, a persona editor).
-   **Right Panel (The "AI Assistant"):** This panel contains a chat interface with a specialized AI assistant whose expertise is tailored to the task of the current workbench. For example, in the Persona Foundry, the user interacts with "Socrates.AI" for guidance on creating effective personas.

This symbiotic layout allows the user to perform structured work on the left while getting contextual help, analysis, and guidance from a purpose-built AI on the right.

### Architectural Pattern: Compositional Views

To enforce modularity and reusability, the UI is built on a simple two-level compositional hierarchy:

*   **View (Workbench):** A top-level container that represents a major application feature (e.g., `SessionsWorkbench`). Its primary role is **composition** and **layout**. It assembles one or more Blocks into a coherent user interface and is responsible for connecting the Blocks' signals to the `ChatController`.

*   **Block:** A self-contained, reusable `QWidget` that encapsulates a specific piece of UI functionality (e.g., `SessionsControlBlock`). A Block is designed to be "pluggable" into any View and communicates with the outside world exclusively through signals and slots. It has no knowledge of the specific View it resides in.

This pattern is a direct implementation of the "Composition over Inheritance" principle from the engineering charter.

---

## 2. Tour of the Workbenches

Each workbench is a self-contained `QWidget` located in `src/deepthought/ui/views/`. They are assembled from smaller, reusable "Blocks" found in `src/deepthought/ui/blocks/`.
The master assembly of all views and their constituent blocks is orchestrated by the `ComponentFactory` class (`src/deepthought/ui/component_factory.py`), which acts as the single source of truth for the UI's construction. For detailed implementation specifications of each workbench, refer to its corresponding Blueprint document.

### 2.1. Sessions Workbench

-   **User Goal:** To find, review, and synthesize knowledge from past conversations into new, actionable insights.
-   **Blueprint:** `docs/Control_Center_UI/SessionsView_Blueprint.md`
-   **Controls Panel (Left):** `SessionsControlBlock` (The Session Library)
-   **Assistant Panel (Right):** `ArchivistChatBlock` (The Conversation Viewer & Curator)
-   **AI Assistant:** `Archivist.AI`

#### Primary User Workflow: Reviewing a Past Session

This workflow describes how a user finds and reviews a specific conversation.

1.  **Find:** The user scans the list of past sessions in the `SessionsControlBlock`. They can use the search bar to filter the list by title or content.
2.  **Select:** The user clicks on a session title, for example, "Database Schema Design".
3.  **View:** The full conversation history for "Database Schema Design" instantly appears in the `ArchivistChatBlock` on the right, ready for review.
4.  **Interact:** The user can now ask `Archivist.AI` follow-up questions about the loaded session, such as "Summarize the key decisions made in this conversation."

| Step | User Action | UI Component & Signal | Controller Slot | Outcome / Next Step |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Clicks on a session | `SessionsControlBlock`<br>`session_selected(session_id)` | `load_chat_session(session_id)` | The controller loads the session data from the `ChatManager`. |
| 2 | (Controller Action) | `ChatController`<br>`new_message_for_display(message)` | (Connected to UI) | The `ArchivistChatBlock` populates its history view with the messages from the loaded session. |
| 3 | Types a follow-up question and clicks "Send" | `ArchivistChatBlock`<br>`send_message_requested(text)` | `process_user_message(text)` | The controller processes the new message in the context of the loaded session. |

### 2.2. Persona Foundry Workbench

-   **User Goal:** To create a new AI persona by defining its identity and grounding it with specific knowledge and tools.
-   **Blueprint:** `docs/Control_Center_UI/PersonaFoundry_Blueprint.md`
-   **Controls Panel (Left):** `PersonaFoundryBlock`
-   **Assistant Panel (Right):** `SocratesChatBlock`
-   **AI Assistant:** `Socrates.AI`

#### Primary User Workflow: Creating a New Persona

This workflow describes how a user creates a new persona from scratch.

1.  **Initiate:** The user clicks the "New" button in the `PersonaFoundryBlock`'s library view. The editor fields on the right are cleared.
2.  **Define Identity:** The user enters a unique, evocative name for the persona (e.g., "Carmack.AI"). They can optionally click "Analyze Persona Name" to get feedback from `Socrates.AI` on the inferred traits.
3.  **Ground Context:** The user attaches foundational documents, associates existing Knowledge Bases, and selects the specific Tools this persona is permitted to use.
4.  **Save:** The user clicks "Save Persona". The complete configuration is sent to the controller for persistence. The new persona now appears in the library list.

| Step | User Action | UI Component & Signal | Controller Slot | Outcome / Next Step |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Clicks "New Persona" | `PersonaFoundryBlock`<br>`new_persona_requested()` | `new_persona_requested()` | The controller acknowledges; the UI clears its own editor. |
| 2 | Clicks "Save Persona" | `PersonaFoundryBlock`<br>`save_persona_requested(PersonaConfig)` | `save_persona_requested(PersonaConfig)` | The controller saves the configuration and emits `personas_updated`. |
| 3 | (Controller Action) | `ChatController`<br>`personas_updated(list)` | (Connected to UI) | The `PersonaFoundryBlock`'s library list is refreshed to show the new persona. |

### 2.3. Tool Foundry Workbench

-   **User Goal:** To create a new capability (a "Tool") that an AI agent can use to interact with the outside world (e.g., execute code, access an API).
-   **Blueprint:** `docs/Control_Center_UI/ToolFoundry_Blueprint.md`
-   **Controls Panel (Left):** `ToolFoundryBlock` (Tool Library and Editor)
-   **Assistant Panel (Right):** `HephaestusChatBlock`
-   **AI Assistant:** `Hephaestus.AI`

#### Primary User Workflow: Creating a New Tool

This workflow describes how a user forges a new tool.

1.  **Initiate:** The user clicks "New Tool" in the library view. The editor fields are cleared.
2.  **Define:** The user provides a name, a detailed description (this is critical for the LLM to know when to use the tool), the implementation type (e.g., Python), and the code itself.
3.  **Get Help:** The user asks `Hephaestus.AI` for help: "Draft a Python function that takes a filename and returns the word count." The AI provides the code, which the user copies into the editor.
4.  **Set Safeguards:** The user configures the safety controls, such as requiring user confirmation before the tool can be executed.
5.  **Save:** The user clicks "Save Tool". The configuration is sent to the controller, and the new tool appears in the library.

| Step | User Action | UI Component & Signal | Controller Slot | Outcome / Next Step |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Clicks "Save Tool" | `ToolFoundryBlock`<br>`save_tool_requested(ToolConfig)` | `save_tool_requested(ToolConfig)` | The controller saves the tool and emits `populate_tool_library`. |
| 2 | (Controller Action) | `ChatController`<br>`populate_tool_library(list)` | (Connected to UI) | The `ToolFoundryBlock`'s library list is refreshed. |

### 2.4. Other Workbenches

This symbiotic pattern is repeated for all major application functions:

-   **Agent Foundry:** (`AgentFoundryBlock`, `TeamRosterBlock` + `GraceChatBlock`) For assembling teams of agents.
-   **Knowledge Base:** (`DataEngineeringBlock` + `SwartzChatBlock`) For managing and ingesting data into knowledge bases.
-   **LLM Settings:** (`LLMControlsBlock` + `ThufirChatBlock`) For configuring LLM providers, models, and parameters.
-   **AI Help:** (`HelpTocBlock` + `PhronesisChatBlock`) For providing user documentation and interactive help.

---

## 3. UI-to-Core Connection Model

All user interactions flow from the UI to the core engine via a single, consistent pattern:

1.  **User Action:** A user interacts with a widget (e.g., `QPushButton`, `QListView`) inside a **Block**.
2.  **Block Signal:** The Block emits a descriptive, high-level signal representing the user's intent (e.g., `save_persona_requested`).
3.  **Factory Connection:** The `ComponentFactory`, during the initial UI assembly, connects the Block's signal to the appropriate slot on the `ChatController` instance.
4.  **Controller Logic:** The `ChatController` slot executes the required business logic, which is completely decoupled from the UI.
5.  **Controller Signal:** The `ChatController` emits a state-change signal (e.g., `personas_updated`).
6.  **UI Update:** The relevant Block or View has a slot connected to the Controller's signal, and it updates its display accordingly.

This strict, unidirectional data flow, mediated entirely by signals and slots, ensures the UI is a "dumb" reflection of the application state managed by the core engine. This is the practical implementation of the architectural principles and is key to the system's stability and testability.

#### Visual Representation of Data Flow

```
┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
|       View       |      |    Controller    |      |       Model      |
| (e.g., QWidget)  |      |  (e.g., QObject) |      |  (e.g., QObject) |
└──────────────────┘      └──────────────────┘      └──────────────────┘
         |                        |                        |
   1. User clicks button         |                        |
         | emits signal           |                        |
         `----------------------&gt;` 2. Slot is invoked      |
                                  |                        |
                                  | 3. Updates model data  |
                                  `----------------------&gt;`
                                                           |
                                                           | 4. Emits data_changed signal
         `&lt;------------------------------------------------`
   5. Slot updates UI            |                        |
         |                        |                        |
```

This strict, unidirectional data flow, mediated entirely by signals and slots, ensures the UI is a "dumb" reflection of the application state managed by the core engine. This is the practical implementation of the architectural principles and is key to the system's stability and testability.

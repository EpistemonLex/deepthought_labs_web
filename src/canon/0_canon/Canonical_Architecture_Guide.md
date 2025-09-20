# Canonical Architecture Guide

**Version:** 1.0
**Date:** August 3, 2025

## 1. Core Philosophy: A Private, Agentic Development Environment

Deepthought is designed as a private, locally-run, and highly extensible development environment. Its primary goal is to provide a powerful and secure platform for software development tasks, leveraging Large Language Models (LLMs) without relying on external cloud services. The architecture is built around the concept of an "augmented expert," where the developer is assisted by a swarm of intelligent agents that can perform a variety of tasks, from code generation to project management.

## 2. High-Level Overview: Modified MVC with Agentic Workflow

The Deepthought application is built on a modified Model-View-Controller (MVC) pattern, adapted for a desktop GUI application with PySide6. This architecture separates user interface concerns from the core application logic, facilitating a robust and maintainable system. The application's intelligence is driven by a powerful v4 agentic workflow that can leverage a variety of tools to respond to user requests.

## 3. Architectural Diagram

The following diagram illustrates the primary components and the flow of information between them.

```mermaid
graph TD
    subgraph "User Interface (View)"
        A[ChatWindow]
    end

    subgraph "Application Logic (Controller)"
        B[ChatController]
    end

    subgraph "Core Agentic Engine"
        C[ChatLogicModule]
        D[Agent Tools <br>(tools.py)]
    end

    subgraph "Data & Services"
        E[DatabaseManager <br>(SQLite)]
        F[Connectors <br>(KuzuDB, Logseq)]
        G[LLM Client]
    end

    A -- User Actions (Signals) --> B
    B -- Updates View (Slots) --> A
    B -- Orchestrates --> C
    C -- Executes --> D
    C -- Communicates with --> G
    D -- Accesses --> E
    D -- Accesses --> F

```

## 4. Component Responsibilities

### 4.1. `ChatWindow` (View)
*   **Location:** `src/ui/chat_window.py`
*   **Responsibility:** The `ChatWindow` is the main user interface. Its sole purpose is to display information to the user and to capture user interactions. It contains **no business logic**.
*   **Key Interactions:**
    *   Emits Qt signals (e.g., `send_triggered`, `persona_changed`) when the user performs an action.
    *   Provides public slots (e.g., `display_messages`, `set_input_enabled`) that the `ChatController` can call to update the UI.

### 4.2. `ChatController` (Controller)
*   **Location:** `src/chat_controller.py`
*   **Responsibility:** The `ChatController` acts as the central nervous system of the application. It listens for signals from the `ChatWindow` and orchestrates the response.
*   **Key Interactions:**
    *   Connects its slots to the `ChatWindow`'s signals.
    *   Instantiates and manages the `ChatLogicModule`.
    *   When a user sends a message, it delegates the core processing to the `ChatLogicModule`.
    *   Receives data back from the `ChatLogicModule` and calls the appropriate methods on the `ChatWindow` to update the display.

### 4.3. `ChatLogicModule` (Core Agentic Engine)
*   **Location:** `src/v4/chat_logic_module.py`
*   **Responsibility:** This is the heart of the agentic workflow. It takes the user's input and determines the sequence of steps required to generate a response. This may involve calling the LLM, executing tools, or a combination of both.
*   **Key Interactions:**
    *   Receives requests from the `ChatController`.
    *   Interacts with the configured **LLM Client** to understand user intent and generate text.
    *   Uses the **Tool Registry** (`src/v4/tools.py`) to execute functions (tools) when the LLM determines an action is needed.
    *   Manages the state of the agentic graph, including pausing for user permissions if required.

### 4.4. Agent Tools
*   **Location:** `src/v4/tools.py`
*   **Responsibility:** This file defines the concrete capabilities of the agent. Each function in the `TOOL_REGISTRY` is a "tool" that the `ChatLogicModule` can execute.
*   **Key Interactions:**
    *   Tools are self-contained functions that perform a specific task, such as `list_files` or `graph_rag_query`.
    *   They may interact with data layers, such as the `DatabaseManager` or other connectors (`KuzuDBConnector`, `LogseqConnector`).

### 4.5. Data Layers
*   **`DatabaseManager`:** Manages the SQLite database for structured data like chat history and project tasks.
*   **Connectors:** Provide access to external or specialized data sources, such as the KuzuDB knowledge graph (`KuzuDBConnector`) or the Logseq vault (`LogseqConnector`).

## 5. UI-Controller Communication: The Signal/Slot Mechanism

Communication between the `ChatWindow` (View) and `ChatController` (Controller) is handled exclusively through Qt's **signal and slot mechanism**. This creates a clean separation of concerns.

*   **Signal:** When a user clicks the "Send" button, the `ChatWindow` doesn't know what needs to happen next. It simply emits the `send_triggered` signal, carrying the user's text as a payload.
*   **Connection:** During application startup, the `ChatController` connects its `send_message` slot to the `ChatWindow`'s `send_triggered` signal.
*   **Slot:** When the signal is emitted, the `ChatController.send_message` method is automatically invoked, and the application logic proceeds from there.

This one-way flow (View -> Controller) prevents the UI from having any knowledge of the business logic, making the system much easier to test and maintain.

## 6. The v4 Agentic Workflow

The "v4" workflow represents the current agentic architecture. Unlike a simple request-response model, this workflow is a stateful process managed by the `ChatLogicModule`.

1.  **Execution Start:** The `ChatController` calls `ChatLogicModule.execute()` with the user's input.
2.  **Graph Traversal:** The `ChatLogicModule` begins traversing a predefined graph of possible states (e.g., "call LLM," "call tool," "get user permission").
3.  **Tool Calls:** If the LLM decides a tool is needed, the graph transitions to a tool-calling state. The `ChatLogicModule` executes the appropriate function from `tools.py`.
4.  **Pausing for Permission:** A key feature of the v4 workflow is its ability to pause. If a tool requires user permission, the `ChatLogicModule` can pause the entire operation and return a "paused" state to the `ChatController`, which then displays a confirmation dialog.
5.  **Resumption:** Based on the user's choice, the `ChatController` calls `ChatLogicModule.resume()`, and the graph continues its execution from where it left off.
6.  **Final Response:** Once the graph reaches a terminal state, the final response is returned to the `ChatController` and displayed to the user.

## 7. Future Directions

The Deepthought architecture is designed to be extensible. Future development will focus on:

*   **Expanding the toolset:** Adding new tools to the agent-tool system to support a wider range of development tasks.
*   **Improving the agentic capabilities:** Enhancing the LLM's ability to reason about and use the available tools.
*   **Developing the `ProjectManager`:** Implementing the project management features to provide a more integrated development experience.

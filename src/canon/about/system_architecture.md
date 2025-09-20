### **The Deepthought System Architecture Blueprint, Version 2.0**

**Date:** 2025-08-15

### 1. Introduction

This document provides the definitive architectural blueprint for the Deepthought application. It is a direct, technical expansion of **Part 2: The Blueprint** from `the_deepthought_canon.md` and should be read with the Canon as its primary context.

The architecture is a modular, service-oriented system with a clear, layered separation of concerns. This structure is the primary mechanism for managing complexity and enabling the project's core philosophy of "Quality enables Velocity."

### 2. The Architectural Layers

The application is organized into five primary logical layers. This separation is the foundational principle that governs the flow of data and control within the system.

#### 2.1 Application Layer (`main.py`)

*   **Role:** The Conductor
*   **Description:** This is the application's entry point and **composition root**. Its sole responsibility is to instantiate and wire together all major components in the correct order, from the UI to the controller to the core services. It establishes the global context and starts the application event loop.
*   **Inference:** By centralizing the assembly process, the rest of the application is decoupled. Components do not know how their dependencies are created, only that they are provided.

#### 2.2 Presentation Layer (`src/deepthought/ui/`)

*   **Role:** The User Interface
*   **Description:** This layer is responsible for everything the user sees and interacts with. Built with PySide6, its primary job is to emit signals based on user actions and to update its display when the application's state changes. It contains no business logic.
*   **Inference:** The use of a `ComponentFactory` decouples the main window from the specifics of its child components, allowing UI elements to be modified or replaced with minimal impact.

#### 2.3 Control Layer (`chat_controller.py`)

*   **Role:** The Central Nervous System
*   **Description:** The `ChatController` is the intermediary between the Presentation Layer and the Service Layer. It listens for signals from the UI, processes these events by invoking the appropriate services, and updates the central `ChatModel` with the results.
*   **Inference:** By centralizing control logic here, we keep the UI "dumb" and the services focused on their specific tasks. The controller is the orchestrator that directs the flow of application logic.

#### 2.4 Service Layer (`app_context.py` and `src/deepthought/services/`)

*   **Role:** The Engine Room
*   **Description:** This layer contains the core business logic and functionality, encapsulated as distinct services. The `AppContext` is the master object in this layer, acting as a **service locator** or dependency container. It holds a single, canonical instance of all major services (`LLMFactory`, `RAGManager`, `DatabaseManager`, etc.).
*   **Inference:** The `AppContext` ensures that services are instantiated only once (often lazy-loaded for performance) and provides a single, consistent point of access. This prevents the proliferation of object instances and makes dependencies explicit.

#### 2.5 Data Layer (`src/deepthought/dao/`)

*   **Role:** The Foundation
*   **Description:** This layer is responsible for all data persistence and retrieval. It abstracts the underlying data sources (vector databases, graph databases, file systems) from the rest of the application through Data Access Objects (DAOs).
*   **Inference:** By isolating data access, the application becomes resilient to changes in the underlying storage technology. The Service Layer can request data without needing to know how or where it is stored.
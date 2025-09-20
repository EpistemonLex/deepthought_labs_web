# UI Development Guide

**Version:** 1.0
**Date:** 2025-08-21

## 1. Purpose

This guide establishes the official protocol for developing and testing the Deepthought application's user interface. Its purpose is to enable rapid visual iteration while protecting the integrity of the application's core logic.

Adherence to this protocol is mandatory.

## 2. The "Proportional Verification" Principle

Our development process is governed by the "Proportional Verification" principle from the `ai_engineering_charter.md`. This means the method of verification must match the nature of the change.

*   **Visual Changes:** Any change that is purely presentational (e.g., modifying widget styles with `.setStyleSheet()`, adjusting layout spacing, updating static text labels, changing icons) carries no logical risk.
    *   **Verification Method:** Visual confirmation.

*   **Logical Changes:** Any change that affects runtime behavior (e.g., modifying controller logic, services, data models, or signal/slot connections) carries logical risk.
    *   **Verification Method:** The definitive quality gate (`poetry run pytest`).

## 3. The UI Development Workbench: `ui_dev_main.py`

To facilitate the rapid visual verification of UI components, we have created a dedicated development workbench.

*   **File:** `ui_dev_main.py` (located in the project root)
*   **Purpose:** This script launches the main application window with all backend logic (e.g., the `ChatController`) replaced by high-fidelity mocks. It allows you to see and interact with the UI without running the full application stack.
*   **How to Use:**
    ```bash
    python ui_dev_main.py
    ```
*   **The Golden Rule:** **DO NOT** modify the `ChatController` or other core logic from within `ui_dev_main.py` or to make `ui_dev_main.py` work. Its purpose is to view the UI, not to change the application's logic. All logical changes must be developed and verified through the `pytest` framework.

## 4. Accessing UI Components

The UI is assembled by the `ComponentFactory` class (`src/deepthought/ui/component_factory.py`). This class acts as the master blueprint for the entire user interface.

To access a specific UI view or component from within the `ui_dev_main.py` script, you must follow this sequence:

1.  **Instantiate the Factory:** Create an instance of the `ComponentFactory`.
2.  **Create the Main Window:** Call the `factory.create_main_window()` method. This is the method that actually builds all the UI components and populates the factory's internal `views` dictionary.
3.  **Access the View:** Once the window is created, you can access any specific workbench view from the `factory.views` dictionary using its designated key (e.g., `"sessions_view"`, `"llm_settings_view"`).

This sequence is critical. Attempting to access `factory.views` before calling `create_main_window()` will result in an `AttributeError`.

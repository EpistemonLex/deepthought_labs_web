# Deepthought UI: A Strategic Implementation Guide

## 1. Core Philosophy

This document is the **single source of truth** for the Deepthought UI architecture and development workflow. It is a **living document** that MUST be updated alongside any changes to the UI's structure or core logic. Before starting any UI task, developers should consult this guide.

The UI is built on three core principles:
1.  **Centralized Logic**: All application logic and state management are handled by the `ChatController`. UI components are "dumb" and only emit signals or update their display based on data from the controller.
2.  **Decoupled Components**: Individual UI widgets (`components/`) are self-contained and do not reference each other directly.
3.  **Factory-Based Assembly**: The `ComponentFactory` is responsible for instantiating all major UI components and wiring them together with the `ChatController`.

---

## 2. Architectural Overview

The application's UI is assembled from several key classes, each with a distinct role:

| Class / Module      | Role                                                                                                                            |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `main.py`           | **Application Entry Point**. Initializes the `QApplication`, `ChatController`, `ComponentFactory`, and `MainWindow`.              |
| `ChatController`    | **The Brain**. Contains all business logic. It receives signals from the UI, processes them, and emits new signals with data.     |
| `ComponentFactory`  | **The Assembler**. Creates instances of all major UI components (sidebars, views) and injects the `ChatController` into them.      |
| `MainWindow`        | **The Skeleton**. Defines the main three-pane splitter layout and holds the instances of the panes created by the factory.       |
| `components/`       | **The Organs**. Contains all individual, reusable UI widgets like `LeftSidebar`, `CentralWidget`, `ChatInputBar`, etc.            |

### Layout Structure

The `MainWindow` uses a nested `QSplitter` to create a three-pane layout:
- **Left Sidebar**: (`LeftSidebar`) For navigation, chat history, and settings access.
- **Central Widget**: (`CentralWidget`) The main interaction area. It uses a `QStackedWidget` to switch between different views like the chat and settings.
- **Right Sidebar**: (Placeholder) For future use (e.g., context panels, document viewers).

---

## 3. Standard Development Workflow

Follow these steps to add new functionality to the UI.

### A. Adding a New Interactive Element (e.g., a Button)

1.  **Place the Widget**: Add the `QPushButton` (or other widget) to the appropriate component file in `src/deepthought/ui/components/`.
2.  **Define a Signal**: In that same component file, define a new `Signal` that describes the user's intent (e.g., `new_chat_requested = Signal()`).
3.  **Connect the Signal**: Connect the widget's built-in signal (e.g., `clicked`) to the new signal you just defined (e.g., `self.my_button.clicked.connect(self.new_chat_requested)`).
4.  **Create a Controller Slot**: In `chat_controller.py`, create a new `@Slot()` method that will perform the desired action (e.g., `@Slot() def start_new_chat(self): ...`).
5.  **Connect Component to Controller**: In `component_factory.py`, connect the component's new signal to the controller's new slot (e.g., `self.left_pane.new_chat_requested.connect(self.chat_controller.start_new_chat)`).

### B. Displaying New Data from the Controller

1.  **Define a Controller Signal**: In `chat_controller.py`, define a new `Signal` that will carry the data (e.g., `agent_status_updated = Signal(str)`).
2.  **Emit the Signal**: In the controller's logic, emit the signal with the new data when it's ready.
3.  **Create a Component Slot**: In the target component file (e.g., `StatusBar.py`), create a new `@Slot()` that accepts the data and updates the UI (e.g., `@Slot(str) def set_status_text(self, text): self.label.setText(text)`).
4.  **Connect Controller to Component**: In `component_factory.py`, connect the controller's signal to the component's new slot (e.g., `self.chat_controller.agent_status_updated.connect(self.status_bar.set_status_text)`).

### C. Adding a New Major View to the Central Pane

1.  **Create the View**: Create your new view as a `QWidget` in the `components/` directory.
2.  **Add to CentralWidget**: In `central_widget.py`, instantiate your new view.
3.  **Add to StackedWidget**: Add the new view instance to the `self.stacked_widget`.
4.  **Create a Show Method**: Create a public method in `CentralWidget` to switch to your new view (e.g., `def show_my_new_view(self): self.stacked_widget.setCurrentWidget(self.my_new_view)`).
5.  **Trigger the View Change**: Connect a signal (e.g., from a button in `LeftSidebar`) to the new `show_my_new_view` method. This connection should be made in the `ComponentFactory`.

---

## 4. UI Testing Strategy

The project's comprehensive testing strategy is defined in `docs/TESTING_STRATEGY_IMPLEMENTATION.md`. All UI tests must adhere to the principles and patterns established in that document, particularly the use of `pytest-qt` for behavior-driven testing.

## 5. How to Update This Guide

This guide's accuracy is paramount. When you make a change that affects the UI architecture or workflow:
- **Update the relevant sections in this file.**
- **Include the changes to this `.md` file in the same Git commit as your code changes.**

By keeping our documentation and code in sync, we ensure a smooth and efficient development process for everyone.

# GEMINI.md - AI Context Blueprint & E2E Testing Playbook
**Version 3.0**

This document is the primary context for AI agents working on the Deepthought project. It **must** be provided with every request to ensure adherence to project standards, architecture, and established best practices. Its purpose is to bridge the "context gap" and enable efficient, high-quality development.

## Part 1: Foundational Principles & Architecture

- **Guiding Principle:** The project is governed by **"Quality enables Velocity"**. A stable, maintainable codebase is the prerequisite for speed.
- **MVC Variant:** The system uses a strict Model-View-Controller pattern. The `ChatController` (`src/deepthought/chat_controller.py`) is the central logic hub and is completely UI-agnostic.
- **Composition over Inheritance:** The UI is built from `Views` (workbenches) which are composed of smaller, reusable `Blocks`. A `View` assembles `Blocks`; it does not inherit from a common base class. This is a critical architectural principle.
- **Unidirectional Data Flow:** The interaction loop is non-negotiable: UI `Block` emits a signal -> `ChatController` slot handles the logic -> `ChatController` emits a state-change signal -> a UI `Block` or `View` updates itself.
- **UI Assembly:** The `ComponentFactory` (`src/deepthought/ui/component_factory.py`) is the single source of truth for constructing all UI components and establishing the primary signal/slot connections to the `ChatController`. **This file is the blueprint for the UI's object hierarchy.**
- **Service Location:** The `AppContext` (`src/deepthought/app_context.py`) creates and holds all singleton services (e.g., `DatabaseManager`, `ChatManager`), which are then injected into the `ChatController`.

## Part 2: The PVT Design & Development Lifecycle

All new Promise Verification Tests (PVTs) must follow the formal design process to ensure they are deliberate and well-designed.

1.  **Propose:** Follow the formal design process in `docs/PVT_Design_Process.md` to create a new test case proposal. Detail the user story, priority, workflow, and mocking strategy.
2.  **Review:** The proposal is reviewed to ensure the workflow justifies a PVT and the plan is sound.
3.  **Implement:** Once approved, implement the test in `tests/ui/test_promise_verification.py`. The test's docstring **must** link back to its proposal in `docs/PVT_Design_Process.md`.

## Part 3: The UI Testing Playbook

This playbook contains the definitive patterns for writing and debugging UI tests. Adherence is mandatory. For a complete and detailed explanation of these principles, including advanced techniques and diagnostic tools, refer to the definitive guide: **`docs/Control_Center_UI/UI_Test_Automation_Blueprint.md`**.

### 3.1 The Page Object Model (POM) is Mandatory
All UI tests **must** interact with the UI via a Page Object located in `tests/ui/pages/`. This enforces the "Test Behavior, Not Implementation" principle by creating a stable API for the UI.

### 3.2 The Art of Widget Selection
A test's resilience depends on how it finds widgets.

1.  **Best:** Use a unique `objectName` set in the UI `Block` or `View`. This is the most robust method.
    -   **Convention:** `objectName`s are `camelCase` (e.g., `draftCommitButton`).
    -   **Page Object:** `self.block.findChild(QPushButton, "draftCommitButton")`
2.  **Acceptable:** Find by type if it's unambiguous within its parent.
    -   **Page Object:** `self.block.findChild(QTextEdit)`
3.  **Forbidden:** Never use positional selectors (e.g., "the third button") or selectors based on widget text. These are extremely brittle.

### 3.3 The Mocking Strategy
Mocking is essential for isolating tests. Use the `mocker` fixture from `pytest-mock`.

1.  **Mocking Controller Slots:** To test the UI -> Controller data flow, mock the controller's slot and verify it was called with the correct data from the UI.
    ```python
    # In test:
    mock_save_slot = Mock()
    mocker.patch.object(controller, 'save_tool_requested', side_effect=mock_save_slot)

    page.create_new_tool(...) # Action

    mock_save_slot.assert_called_once()
    saved_config = mock_save_slot.call_args.args[0]
    assert saved_config['name'] == "..."
    ```

2.  **Mocking Service Methods:** To test controller logic without external dependencies (LLM calls, disk I/O), mock the method on the underlying service manager.
    ```python
    # In test:
    mocker.patch.object(controller._git_manager, 'get_staged_changes', return_value="...")
    mocker.patch.object(controller._chat_logic_module, 'generate_commit_message', new_callable=AsyncMock, return_value="...")
    ```

3.  **Mocking UI Dialogs:** To simulate user input without showing a real dialog, mock the dialog class directly.
    ```python
    # In test:
    mocker.patch("PySide6.QtWidgets.QFileDialog.getOpenFileNames", return_value=(['/fake/path.pdf'], "All Files (*)"))
    ```

### 3.4 The Asynchronous Testing Protocol (MANDATORY)
UI workflows that trigger `asyncio` tasks **must** follow this strict protocol to prevent race conditions and timeouts.

1.  **Trigger the Action:** Perform the user action that starts the `asyncio` task (e.g., `page.button.click()`).
2.  **Yield Control:** Immediately after the action, the test **must** yield control to the `asyncio` event loop by calling `await asyncio.sleep(0)`. This is a non-negotiable step.
3.  **Wait for the Outcome:** Use `qtbot.waitUntil()` to poll for the final, user-visible UI change (e.g., text appearing in a label, a widget becoming enabled). This is more robust than waiting for intermediate signals.

```python
# Correct Asynchronous Test Pattern
# 1. Trigger
chat_page.send_message("Hello")

# 2. CRITICAL: Yield control to the event loop
await asyncio.sleep(0)

# 3. Wait for the final UI state
chat_page.wait_for_history_to_contain("Response from AI")
```

### 3.5 The Signal-Spying Protocol (DEPRECATED - AVOID)
Directly inspecting signal arguments with `QSignalSpy` has proven to be unreliable in this project's environment, leading to `TypeError` and `AttributeError` exceptions.

**The old pattern is deprecated and must not be used.**

**The correct, modern approach is to test the consequences of the signal, not the signal itself.** Assert the final state of the UI using `qtbot.waitUntil` as described in the Asynchronous Testing Protocol. This makes tests more robust and less coupled to implementation details.

## Part 4: Debugging Playbook & Common Pitfalls

This section addresses the most common errors encountered during E2E test development.

### Symptom: `AttributeError: 'NoneType' object has no attribute 'click'` (or similar)
-   **Root Cause:** A `findChild()` call in your Page Object returned `None`, meaning the widget was not found.
-   **Standard Debugging Procedure:**
    1.  **Verify Parent:** Is the `findChild` call being performed on the correct parent widget? The UI is a nested hierarchy. Consult `src/deepthought/ui/component_factory.py` to understand the structure. For example, the `tool_library_list` is inside the `toolFoundry_libraryWidget`, which is inside the `ToolFoundryBlock`.
    2.  **Verify `objectName`:** Does the `camelCase` string in your `findChild` call exactly match the `setObjectName()` string in the UI Block's source code?
    3.  **List Children:** If still unsure, temporarily add `print(parent_widget.findChildren(QWidget))` to the Page Object's `__init__` to get a definitive list of all available children and their `objectName`s.

### Symptom: Test times out waiting for a signal or condition.
-   **Root Cause 1 (Async):** If the workflow is asynchronous, you may have forgotten to `await asyncio.sleep(0)` after the user action.
-   **Root Cause 2 (Signal/Slot):** The signal/slot connection may be broken. Verify the connection is made in `src/deepthought/ui/component_factory.py`.

### Symptom: Test fails with `TypeError` on a widget.
-   **Root Cause:** The widget type in your Page Object's `cast()` does not match the actual widget type. For example, casting to `QTextEdit` when the widget is actually a `QPlainTextEdit`.
-   **Solution:** Verify the correct widget type by checking the UI Block's source code.

## Part 5: Codebase Quick Reference

- **PVT Design Process:** `docs/PVT_Design_Process.md`
- **PVT Implementations:** `tests/ui/test_promise_verification.py`
- **Page Objects:** `tests/ui/pages/`
- **UI Assembly Blueprint:** `src/deepthought/ui/component_factory.py`
- **UI Views (Workbenches):** `src/deepthought/ui/views/`
- **UI Components (Blocks):** `src/deepthought/ui/blocks/`
- **Central Controller:** `src/deepthought/chat_controller.py`

## Part 6: UI Component & `objectName` Reference

This section provides a definitive reference for all UI components (Blocks and Views) and their assigned `objectName` identifiers. This is crucial for writing robust E2E tests using the Page Object Model.

| Class Name | File Path | `objectName` (self) | Child `objectName`s |
|---|---|---|---|
| `AgentFoundryBlock` | `D:\praxisai\src\deepthought\ui\blocks\agent_foundry_block.py` | `AgentFoundryBlock` | `agentRoleInput`, `agentDescriptionInput`, `agentSystemPromptInput` |
| `AgentMindInspectorBlock` | `D:\praxisai\src\deepthought\ui\blocks\agent_mind_inspector_block.py` | `agentMindInspectorBlock` | `AgentMindStatusLabel`, `AgentMindLogDisplay` |
| `ApprovalBlock` | `D:\praxisai\src\deepthought\ui\blocks\approval_card.py` | `ApprovalBlock` | N/A |
| `ArchivistChatBlock` | `D:\praxisai\src\deepthought\ui\blocks\archivist_chat_block.py` | `archivistChatBlock` | N/A |
| `ChatComposerBlock` | `D:\praxisai\src\deepthought\ui\blocks\chat_composer_block.py` | N/A | N/A |
| `ChatFooterBlock` | `D:\praxisai\src\deepthought\ui\blocks\chat_footer_block.py` | `ChatFooterBlock` | N/A |
| `AgentStatusWidget` | `D:\praxisai\src\deepthought\ui\blocks\chat_history_block.py` | `AgentStatusWidget` | N/A |
| `ChatHistoryBlock` | `D:\praxisai\src\deepthought\ui\blocks\chat_history_block.py` | `ChatHistoryBlock` | `ChatHistoryBrowser` |
| `GrowingTextEdit` | `D:\praxisai\src\deepthought\ui\blocks\chat_input_block.py` | `GrowingTextEdit` | N/A |
| `ChatInputBlock` | `D:\praxisai\src\deepthought\ui\blocks\chat_input_block.py` | `ChatInputBlockFrame` | `chat_input_text_edit`, `sendButton`, `expandButton` |
| `ContextInspectorBlock` | `D:\praxisai\src\deepthought\ui\blocks\context_inspector_block.py` | N/A | `ContextLogDisplay` |
| `ConversationalSettingsBlock` | `D:\praxisai\src\deepthought\ui\blocks\conversational_settings_block.py` | N/A | N/A |
| `CurationBlock` | `D:\praxisai\src\deepthought\ui\blocks\curation_block.py` | `CurationBlock` | N/A |
| `DataEngineeringBlock` | `D:\praxisai\src\deepthought\ui\blocks\data_engineering_block.py` | `data_engineering_block` | N/A |
| `FileOperationsBlock` | `D:\praxisai\src\deepthought\ui\blocks\file_operations_ui.py` | `FileOperationsBlock` | `activeFilesLabel` |
| `GitInspectorBlock` | `D:\praxisai\src\deepthought\ui\blocks\git_inspector_block.py` | `gitInspectorBlock` | `draftCommitButton`, `commitMessageTextEdit`, `commitButton`, `notificationLabel` |
| `GraceChatBlock` | `D:\praxisai\src\deepthought\ui\blocks\grace_chat_block.py` | `grace_chat_block` | N/A |
| `HelpBlock` | `D:\praxisai\src\deepthought\ui\blocks\help_block.py` | `HelpBlock` | `HelpTitle` |
| `HelpTocBlock` | `D:\praxisai\src\deepthought\ui\blocks\help_toc_block.py` | `help_toc_block` | N/A |
| `HephaestusChatBlock` | `D:\praxisai\src\deepthought\ui\blocks\hephaestus_chat_block.py` | `hephaestus_chat_block` | N/A |
| `JsonEditorBlock` | `D:\praxisai\src\deepthought\ui\blocks\json_editor_block.py` | `JsonEditorBlock` | `json_editor`, `back_button` |
| `KBDashboardBlock` | `D:\praxisai\src\deepthought\ui\blocks\kb_dashboard_block.py` | `KBDashboardBlock` | `semantic_search_bar`, `kb_selector_combo`, `kb_version_dropdown`, `kb_list_widget`, `document_list_view` |
| `LiveLogBlock` | `D:\praxisai\src\deepthought\ui\blocks\live_log_block.py` | `LiveLogBlock` | `LiveLogHeaderFrame`, `LiveLogTitleLabel`, `LiveLogClearButton`, `LogDisplay` |
| `LLMControlsBlock` | `D:\praxisai\src\deepthought\ui\blocks\llm_controls_block.py` | `LLMControlsBlock` | `preset_selector_combo`, `temperature_slider` |
| `LLMSettingsBlock` | `D:\praxisai\src\deepthought\ui\blocks\llm_settings_block.py` | `LLMSettingsBlock` | `llmSettings_apiKeyInput`, `llmSettings_urlInput` |
| `MindMapBlock` | `D:\praxisai\src\deepthought\ui\blocks\mind_map_block.py` | `MindMapBlock` | `MindMapTitleLabel`, `MindMapInfoLabel`, `MindMapGraphDisplay` |
| `NavigationBlock` | `D:\praxisai\src\deepthought\ui\blocks\navigation_block.py` | `NavigationBlock` | `nav_sessions_view_button`, `nav_knowledge_base_view_button`, `nav_llm_settings_view_button`, `nav_tool_foundry_view_button`, `nav_agent_foundry_view_button`, `nav_persona_foundry_view_button`, `nav_ai_help_view_button` |
| `PersonaBarBlock` | `D:\praxisai\src\deepthought\ui\blocks\persona_bar.py` | `PersonaBarBlock` | `PersonaBarLabel`, `PersonaDropdown` |
| `PersonaFoundryBlock` | `D:\praxisai\src\deepthought\ui\blocks\persona_foundry_block.py` | `persona_foundry_block` | `personaFoundry_selector`, `personaFoundry_newButton`, `personaFoundry_deleteButton`, `persona_name_input`, `personaFoundry_analyzeButton`, `analysis_display`, `personaFoundry_groundingGroup`, `personaFoundry_docsLabel`, `personaFoundry_docsList`, `personaFoundry_addDocButton`, `personaFoundry_removeDocButton`, `personaFoundry_kbsLabel`, `personaFoundry_kbsList`, `personaFoundry_addKbButton`, `personaFoundry_removeKbButton`, `personaFoundry_toolsLabel`, `personaFoundry_toolsContainer`, `personaFoundry_toolCheckbox_CodeInterpreter`, `personaFoundry_toolCheckbox_FileSystemAccess`, `personaFoundry_toolCheckbox_WebSearch`, `personaFoundry_saveButton` |
| `PhronesisChatBlock` | `D:\praxisai\src\deepthought\ui\blocks\phronesis_chat_block.py` | `phronesis_chat_block` | N/A |
| `PromptSettingsBlock` | `D:\praxisai\src\deepthought\ui\blocks\prompt_settings_block.py` | N/A | `PromptSettingsPlaceholderLabel` |
| `RAGManagementBlock` | `D:\praxisai\src\deepthought\ui\blocks\rag_management_block.py` | N/A | N/A |
| `ReadyQueueBlock` | `D:\praxisai\src\deepthought\ui\blocks\ready_queue_block.py` | `ready_queue_block` | `readyQueue_jobList`, `readyQueue_ingestionControls`, `readyQueue_progressBar`, `readyQueue_startButton`, `readyQueue_cancelButton` |
| `RequestInspectorBlock` | `D:\praxisai\src\deepthought\ui\blocks\request_inspector_dock.py` | `RequestInspectorBlock` | `requestInspector_tabWidget`, `RequestInspectorRequestText`, `RequestInspectorResponseText` |
| `ResidualStreamInspectorBlock` | `D:\praxisai\src\deepthought\ui\blocks\residual_stream_inspector_block.py` | `ResidualStreamInspectorBlock` | `ResidualLogDisplay` |
| `RoleCard` | `D:\praxisai\src\deepthought\ui\blocks\role_card.py` | `RoleCard` | `role_title_input`, `remove_role_button`, `persona_combo_box`, `tools_label`, `agent_id_label` |
| `SessionControlBlock` | `D:\praxisai\src\deepthought\ui\blocks\session_control_block.py` | `SessionControlBlock` | `NewChatButton` |
| `SessionsControlBlock` | `D:\praxisai\src\deepthought\ui\blocks\sessions_control_block.py` | `sessionsControlBlock` | `session_search_input`, `synthesize_button`, `export_button`, `session_list_widget` |
| `SessionsWorkbenchHeaderBlock` | `D:\praxisai\src\deepthought\ui\blocks\sessions_workbench_header_block.py` | `sessions_workbench_header_block` | `session_view_title`, `session_search_input`, `export_to_logseq_button` |
| `SocratesChatBlock` | `D:\praxisai\src\deepthought\ui\blocks\socrates_chat_block.py` | `socrates_chat_block` | N/A |
| `StagingAreaBlock` | `D:\praxisai\src\deepthought\ui\blocks\staging_area_block.py` | `staging_area_block` | `stagingArea_dropArea`, `stagingArea_browseButton`, `stagingArea_fileList`, `stagingArea_batchToolbar`, `stagingArea_configPanel`, `stagingArea_targetKBSelector`, `stagingArea_propositionerModelSelector`, `stagingArea_embedderModelSelector` |
| `SwartzChatBlock` | `D:\praxisai\src\deepthought\ui\blocks\swartz_chat_block.py` | `swartz_chat_block` | N/A |
| `SynthEditorBlock` | `D:\praxisai\src\deepthought\ui\blocks\synth_editor_block.py` | `synth_editor_block` | N/A |
| `TeamRosterBlock` | `D:\praxisai\src\deepthought\ui\blocks\team_roster_block.py` | `TeamRosterBlock` | `teamRoster_teamNameInput`, `teamRoster_agentList`, `teamRoster_addRoleButton`, `teamRoster_saveTeamButton` |
| `ThufirChatBlock` | `D:\praxisai\src\deepthought\ui\blocks\thufir_chat_block.py` | `thufir_chat_block` | N/A |
| `ToolApprovalCard` | `D:\praxisai\src\deepthought\ui\blocks\tool_approval_card.py` | `ToolApprovalCard` | `ApproveToolButton`, `RejectToolButton` |
| `ToolFoundryBlock` | `D:\praxisai\src\deepthought\ui\blocks\tool_foundry_block.py` | `tool_foundry_block` | `toolFoundry_libraryWidget`, `tool_library_list`, `toolFoundry_newToolButton`, `toolFoundry_deleteToolButton`, `toolFoundry_editorWidget`, `toolFoundry_editorSplitter`, `toolFoundry_nameDescGroup`, `toolFoundry_nameLabel`, `tool_name_input`, `toolFoundry_descLabel`, `tool_description_input`, `implementation_group`, `toolFoundry_typeLabel`, `implementation_type_dropdown`, `toolFoundry_schemaLabel`, `parameter_schema_editor`, `toolFoundry_codeLabel`, `implementation_code_editor`, `safety_controls_group`, `confirm_execution_checkbox`, `allow_read_checkbox`, `allow_write_checkbox`, `save_tool_button` |
| `ToolInspectorBlock` | `D:\praxisai\src\deepthought\ui\blocks\tool_inspector_block.py` | N/A | `toolInspector_logDisplay` |
| `ViewManagerBlock` | `D:\praxisai\src\deepthought\ui\blocks\view_manager_block.py` | `ViewManagerBlock` | N/A |
| `WorkbenchHeaderBlock` | `D:\praxisai\src\deepthought\ui\blocks\workbench_header_block.py` | `WorkbenchHeaderBlock` | `HamburgerButton`, `HomeButton`, `SettingsKebabButton`, `DualPaneButton` |
| `WorkshopToolbarBlock` | `D:\praxisai\src\deepthought\ui\blocks\workshop_toolbar_block.py` | `WorkshopToolbarBlock` | `HamburgerButton`, `HomeButton`, `FeedbackButton`, `SettingsButton`, `DualPaneButton`, `llmConfigContainer`, `workshopToolbar_personaLabel`, `personaSelector`, `workshopToolbar_modelLabel`, `modelSelector`, `workshopToolbar_providerLabel`, `providerSelector` |
| `AgentFoundryWorkbench` | `D:\praxisai\src\deepthought\ui\views\agent_foundry_workbench.py` | `AgentFoundryWorkbench` | `AgentFoundrySplitter` |
| `AIHelpWorkbench` | `D:\praxisai\src\deepthought\ui\views\ai_help_workbench.py` | `AIHelpWorkbench` | `AIHelpSplitter` |
| `KnowledgeBaseWorkbench` | `D:\praxisai\src\deepthought\ui\views\knowledge_base_workbench.py` | `KnowledgeBaseWorkbench` | `KnowledgeBaseSplitter` |
| `LLMSettingsWorkbench` | `D:\praxisai\src\deepthought\ui\views\llm_settings_workbench.py` | `LLMSettingsWorkbench` | N/A |
| `PersonaFoundryWorkbench` | `D:\praxisai\src\deepthought\ui\views\persona_foundry_workbench.py` | `PersonaFoundryWorkbench` | `PersonaFoundrySplitter` |
| `SessionsWorkbench` | `D:\praxisai\src\deepthought\ui\views\sessions_workbench.py` | `SessionsWorkbench` | `sessionsViewStack` |
| `ToolFoundryWorkbench` | `D:\praxisai\src\deepthought\ui\views\tool_foundry_workbench.py` | `ToolFoundryWorkbench` | `ToolFoundrySplitter` |

## Part 7: Application Signal/Slot Connection Map

This section details the signal-to-slot connections established in `src/deepthought/ui/component_factory.py`, which defines the application's data flow and interaction patterns.

| Emitter Object | Signal | Receiver Object | Slot |
|---|---|---|---|
| `chat_input_block` | `send_message_requested` | `self.controller` | `process_user_message` |
| `self.workbench_header_block` | `hamburger_clicked` | `main_window` | `toggle_control_deck` |
| `self.workbench_header_block` | `dual_pane_clicked` | `main_window` | `toggle_glass_box` |
| `self.workbench_header_block` | `settings_requested` | `settings_dialog` | `exec` |
| `self.workbench_header_block` | `feedback_requested` | `feedback_dialog` | `exec` |
| `feedback_dialog` | `feedback_submitted` | `self.controller` | `submit_feedback` |
| `self.workbench_header_block` | `home_button_clicked` | `lambda` | `_switch_workbench_view("chat_view")` |
| `self.workbench_header_block` | `persona_selected` | `self.controller` | `set_active_persona` |
| `self.controller` | `available_personas_updated` | `self.workbench_header_block` | `update_personas` |
| `self.controller` | `active_persona_updated` | `self.workbench_header_block` | `set_active_persona` |
| `self.workbench_header_block` | `provider_selected` | `self.controller` | `set_active_provider` |
| `self.workbench_header_block` | `model_selected` | `self.controller` | `set_active_model` |
| `self.controller` | `providers_updated` | `self.workbench_header_block` | `update_providers` |
| `self.controller` | `models_updated` | `self.workbench_header_block` | `update_models` |
| `navigation_block` | `view_requested` | `self` | `_switch_workbench_view` |
| `self.stream_parser` | `agent_thought_emitted` | `agent_mind_inspector` | `on_agent_thought_emitted` |
| `self.stream_parser` | `tool_call_emitted` | `tool_inspector` | `on_tool_call_emitted` |
| `self.stream_parser` | `context_breakdown_emitted` | `context_inspector` | `on_context_breakdown_emitted` |
| `self.stream_parser` | `residual_stream_emitted` | `residual_inspector` | `on_residual_stream_emitted` |
| `self.controller` | `tool_confirmation_requested` | `tool_inspector` | `show_approval_request` |
| `tool_inspector` | `tool_confirmation_response` | `self.controller` | `handle_tool_confirmation` |
| `self.controller` | `agent_activity_started` | `agent_mind_inspector` | `on_agent_activity_started` |
| `self.controller` | `agent_activity_updated` | `agent_mind_inspector` | `on_agent_activity_updated` |
| `self.controller` | `agent_activity_finished` | `agent_mind_inspector` | `on_agent_activity_finished` |
| `self.controller` | `new_message_for_display` | `chat_history_block` | `add_message` |
| `self.controller` | `clear_display_requested` | `chat_history_block` | `clear_history` |
| `self.controller` | `chat_sessions_updated` | `sessions_control` | `set_sessions` |
| `sessions_control` | `session_selected` | `self.controller` | `load_chat_session` |
| `sessions_control` | `rename_requested` | `self.controller` | `rename_session` |
| `sessions_control` | `delete_requested` | `self.controller` | `delete_session` |
| `sessions_control` | `export_requested` | `self.controller` | `export_to_logseq` |
| `self.controller` | `agent_activity_started` | `chat_history_block` | `on_agent_activity_started` |
| `self.controller` | `agent_activity_updated` | `chat_history_block` | `on_agent_activity_updated` |
| `self.controller` | `agent_activity_finished` | `chat_history_block` | `on_agent_activity_finished` |
| `ai_help_workbench.help_toc_block` | `topic_selected` | `self.controller` | `handle_help_topic_selection` |
| `ai_help_workbench.phronesis_chat_block.chat_input` | `send_message_requested` | `self.controller` | `process_phronesis_chat_message` |
| `self.controller` | `phronesis_message_for_display` | `ai_help_workbench.phronesis_chat_block.chat_history` | `add_message` |
| `tool_foundry_workbench.tool_foundry_block` | `tool_selected` | `self.controller` | `load_tool_requested` |
| `tool_foundry_workbench.tool_foundry_block` | `save_tool_requested` | `self.controller` | `save_tool_requested` |
| `tool_foundry_workbench.tool_foundry_block` | `new_tool_requested` | `self.controller` | `new_tool_requested` |
| `tool_foundry_workbench.tool_foundry_block` | `delete_tool_requested` | `self.controller` | `delete_tool` |
| `self.controller` | `populate_tool_library` | `tool_foundry_workbench.tool_foundry_block` | `populate_tool_library` |
| `self.controller` | `load_tool` | `tool_foundry_workbench.tool_foundry_block` | `load_tool` |
| `tool_foundry_workbench.hephaestus_chat_block.chat_input` | `send_message_requested` | `self.controller` | `process_hephaestus_chat_message` |
| `self.controller` | `hephaestus_message_for_display` | `tool_foundry_workbench.hephaestus_chat_block.chat_history` | `add_message` |
| `llm_settings_workbench.llm_controls_block` | `save_preset_requested` | `self.controller` | `save_llm_preset` |
| `llm_settings_workbench.llm_controls_block` | `load_preset_requested` | `self.controller` | `load_llm_preset` |
| `llm_settings_workbench.llm_controls_block` | `preset_selected` | `self.controller` | `load_llm_preset` |
| `llm_settings_workbench.llm_controls_block` | `advanced_view_requested` | `self.controller` | `show_advanced_llm_settings` |
| `self.controller` | `tutor_response_ready` | `llm_settings_workbench.thufir_chat_block` | `display_tutor_response` |
| `self.controller` | `llm_presets_updated` | `llm_settings_workbench.llm_controls_block` | `set_presets` |
| `llm_settings_workbench.thufir_chat_block.chat_input` | `send_message_requested` | `self.controller` | `process_thufir_chat_message` |
| `self.controller` | `thufir_message_for_display` | `llm_settings_workbench.thufir_chat_block.chat_history` | `add_message` |
| `agent_foundry_workbench.team_roster_block` | `save_team_requested` | `self.controller` | `save_agent_team` |
| `agent_foundry_workbench.team_roster_block` | `persona_field_focused` | `self.controller` | `recommend_persona_for_role` |
| `agent_foundry_workbench.team_roster_block` | `agent_selected` | `self.controller` | `load_agent_definition_requested` |
| `self.controller` | `agent_team_loaded` | `agent_foundry_workbench.team_roster_block` | `populate_roster` |
| `self.controller` | `grace_message_for_display` | `agent_foundry_workbench.grace_chat_block.chat_history` | `add_message` |
| `agent_foundry_workbench.grace_chat_block.chat_input` | `send_message_requested` | `self.controller` | `process_grace_chat_message` |
| `self.controller` | `agent_definition_loaded` | `agent_foundry_workbench.agent_foundry_block` | `populate_agent_definition` |
| `persona_foundry_workbench.persona_foundry_block` | `load_persona_requested` | `self.controller` | `load_persona_requested` |
| `persona_foundry_workbench.persona_foundry_block` | `new_persona_requested` | `self.controller` | `new_persona_requested` |
| `persona_foundry_workbench.persona_foundry_block` | `delete_persona_requested` | `self.controller` | `delete_persona_by_name` |
| `persona_foundry_workbench.persona_foundry_block` | `analyze_persona_requested` | `self.controller` | `analyze_persona_requested` |
| `persona_foundry_workbench.persona_foundry_block` | `save_persona_requested` | `self.controller` | `save_persona_requested` |
| `persona_foundry_workbench.persona_foundry_block` | `request_document_path` | `self.controller` | `request_document_path` |
| `persona_foundry_workbench.persona_foundry_block` | `remove_document_requested` | `self.controller` | `remove_document_requested` |
| `persona_foundry_workbench.persona_foundry_block` | `attach_kb_requested` | `self.controller` | `attach_kb_requested` |
| `self.controller` | `display_inference_analysis` | `persona_foundry_workbench.persona_foundry_block` | `display_inference_analysis` |
| `self.controller` | `set_foundational_documents` | `persona_foundry_workbench.persona_foundry_block` | `set_foundational_documents` |
| `self.controller` | `kbs_updated` | `persona_foundry_workbench.persona_foundry_block` | `set_associated_kbs` |
| `self.controller` | `populate_tool_library` | `persona_foundry_workbench.persona_foundry_block` | `set_available_tools` |
| `self.controller` | `persona_details_loaded` | `persona_foundry_workbench.persona_foundry_block` | `load_persona` |
| `self.controller` | `personas_updated` | `persona_foundry_workbench.persona_foundry_block` | `populate_persona_list` |
| `persona_foundry_workbench.socrates_chat_block.chat_input` | `send_message_requested` | `self.controller` | `process_socrates_chat_message` |
| `self.controller` | `socrates_message_for_display` | `persona_foundry_workbench.socrates_chat_block.chat_history` | `add_message` |
| `knowledge_base_workbench.data_engineering_block.staging_area` | `start_ingestion_requested` | `self.controller` | `start_kb_ingestion` |
| `knowledge_base_workbench.data_engineering_block.staging_area` | `files_staged` | `self.controller` | `validate_staged_files` |
| `knowledge_base_workbench.data_engineering_block.ready_queue` | `start_ingestion_requested` | `self.controller` | `start_kb_ingestion` |
| `knowledge_base_workbench.data_engineering_block.dashboard` | `search_requested` | `self.controller` | `search_knowledge_base` |
| `knowledge_base_workbench.data_engineering_block.dashboard` | `kb_selected` | `self.controller` | `select_kb` |
| `knowledge_base_workbench.data_engineering_block.dashboard` | `version_selected` | `self.controller` | `select_kb_version` |
| `knowledge_base_workbench.data_engineering_block.dashboard` | `document_selected` | `self.controller` | `load_kb_document` |
| `knowledge_base_workbench.data_engineering_block.dashboard` | `reindex_requested` | `self.controller` | `reindex_kb` |
| `knowledge_base_workbench.data_engineering_block.dashboard` | `set_active_version_requested` | `self.controller` | `set_kb_active_version` |
| `knowledge_base_workbench.data_engineering_block.dashboard` | `archive_version_requested` | `self.controller` | `archive_kb_version` |
| `knowledge_base_workbench.data_engineering_block.staging_area` | `remove_staged_files_requested` | `self.controller` | `remove_staged_files` |
| `knowledge_base_workbench.data_engineering_block.dashboard` | `filter_changed` | `self.controller` | `filter_kb_documents` |
| `knowledge_base_workbench.data_engineering_block.ready_queue` | `retry_job_requested` | `self.controller` | `retry_ingestion_job` |
| `knowledge_base_workbench.swartz_chat_block.chat_input` | `send_message_requested` | `self.controller` | `process_thufir_chat_message` |
| `self.controller` | `thufir_message_for_display` | `knowledge_base_workbench.swartz_chat_block.chat_history` | `add_message` |
| `self.controller` | `staged_files_validated` | `knowledge_base_workbench.data_engineering_block.staging_area` | `add_staged_files` |
| `self.controller` | `kb_config_options_updated` | `knowledge_base_workbench.data_engineering_block.staging_area` | `populate_config_dropdowns` |
| `self.controller` | `kb_ingestion_progress` | `knowledge_base_workbench.data_engineering_block.ready_queue` | `update_progress` |
| `self.controller` | `kb_job_status_updated` | `knowledge_base_workbench.data_engineering_block.ready_queue` | `update_job_status` |
| `self.controller` | `kbs_updated` | `knowledge_base_workbench.data_engineering_block.dashboard` | `populate_kbs` |
| `self.controller` | `kb_versions_updated` | `knowledge_base_workbench.data_engineering_block.dashboard` | `populate_versions` |
| `self.controller` | `kb_documents_updated` | `knowledge_base_workbench.data_engineering_block.dashboard` | `populate_documents` |
| `self.controller` | `kb_document_details_ready` | `knowledge_base_workbench.data_engineering_block.dashboard` | `display_document_details` |
| `self.controller` | `metadata_tags_updated` | `knowledge_base_workbench.data_engineering_block.dashboard` | `populate_metadata_filters` |
| `git_inspector` | `draft_commit_message_requested` | `self.controller` | `draft_commit_message` |
| `git_inspector` | `commit_requested` | `self.controller` | `commit_changes` |
| `self.controller` | `commit_message_draft_ready` | `git_inspector` | `display_commit_draft` |
| `self.controller` | `git_operation_status` | `git_inspector` | `display_git_status` |
| `knowledge_base_workbench.data_engineering_block.staging_area` | `add_to_queue_requested` | `self.controller` | `add_files_to_ingestion_queue` |
| `knowledge_base_workbench.data_engineering_block.dashboard` | `delete_document_requested` | `self.controller` | `delete_kb_document` |
| `knowledge_base_workbench.data_engineering_block.dashboard` | `create_kb_requested` | `self.controller` | `create_kb` |
| `knowledge_base_workbench.data_engineering_block.dashboard` | `delete_kb_requested` | `self.controller` | `delete_kb` |
| `self.controller` | `kb_job_completed` | `knowledge_base_workbench.data_engineering_block.ready_queue` | `remove_completed_job` |
| `self.controller` | `staged_files_removed` | `knowledge_base_workbench.data_engineering_block.staging_area` | `on_files_removed` |

## Part 8: Core User Workflows

The definitive, up-to-date descriptions of all core user workflows are maintained as Promise Verification Tests (PVTs). Please refer to the **[Implemented PVTs section in the PVT Design Process document](PVT_Design_Process.md#implemented-pvts)** for the official workflow breakdowns.

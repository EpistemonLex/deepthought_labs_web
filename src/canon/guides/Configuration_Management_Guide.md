# Configuration Management Guide

**Version:** 1.0
**Date:** August 3, 2025

## 1. Introduction: Centralized Configuration for Deepthought

Effective configuration management is crucial for the Deepthought project's flexibility, maintainability, and ease of deployment. This guide outlines the project's strategy for handling configuration settings, ensuring consistency across all components and environments.

## 2. The `config.json` File: The Single Source of Truth

All primary application settings are stored in a single `config.json` file.

*   **Standard Location:** The `config.json` file is canonically located within the `Deepthought_Data` directory. This directory is designed to be a central vault for all application-specific data, including databases, vector stores, and configuration.
    *   The `Deepthought_Data` directory is typically found at the root of the project (e.g., `D:\deepthought\canon\Deepthought_Data`).
    *   Its location can be overridden by setting the `DEEPTHOUGHT_DATA_VAULT` environment variable, which is useful for custom deployments or Docker environments.
*   **Automatic Creation:** If `config.json` does not exist on application startup, the `ConfigManager` will automatically create it with a set of default values.

## 3. The `ConfigManager`: Your Gateway to Settings

The `ConfigManager` (`src/config/manager.py`) is the sole class responsible for loading, saving, and providing access to application configuration. It acts as a centralized interface, abstracting away the details of file I/O and default value handling.

### 3.1. Key Responsibilities of `ConfigManager`

*   **Loading Configuration:** Reads `config.json` and merges it with default settings, ensuring all expected keys are present.
*   **Saving Configuration:** Writes the current configuration state back to `config.json`.
*   **Path Resolution:** Crucially, `ConfigManager` provides the canonical method for determining the `Deepthought_Data` vault path, ensuring all parts of the application correctly locate shared resources.
*   **Structured Access:** Offers methods to retrieve specific subsets of configuration (e.g., `get_llm_config()`, `get_persona_config()`).

### 3.2. Canonical Method for Accessing Shared Resources and Paths

To avoid brittle hardcoded paths and ensure consistency, all components requiring access to shared resources (like the data vault, databases, or Logseq vault) **must** obtain their base paths via the `ConfigManager`.

**Incorrect Pattern (to be avoided):**

```python
# DO NOT DO THIS - Hardcoded, brittle pathing
from pathlib import Path
my_db_path = Path("./Deepthought_Data/my_database.db")
```

**Correct Pattern:**

```python
from config.manager import ConfigManager
from core.file_operations import FileOperations # Assuming FileOperations is used for vault access

# Instantiate ConfigManager (ideally once at app startup and passed via DI)
# If instantiating locally, ensure it can resolve the data vault path.
config_manager = ConfigManager(file_operations=FileOperations(base_path=Path(__file__).parent.parent.parent))

# Load config to ensure data_vault_path is resolved
app_config = config_manager.load_or_create_config()

# Get the canonical data vault path
data_vault_path = config_manager.get_data_vault_path()

# Construct paths to resources within the data vault
my_database_path = data_vault_path / "databases" / "my_database.db"
logseq_vault_path = Path(app_config.get("logseq_path")) # Logseq path is a config setting

# Use these canonical paths for all file operations
```

This pattern ensures that if the `Deepthought_Data` location changes (e.g., via an environment variable), all parts of the application automatically adapt.

## 4. Full Reference of `config.json` Keys

This section provides a comprehensive list of all keys found in `config.json`, their purpose, data types, and default values.

### 4.1. LLM & Backend Configuration

These keys control how the application connects to and interacts with the Large Language Model.

*   `active_backend`
    *   **Purpose:** Specifies which LLM backend to use.
    *   **Type:** `string`
    *   **Required:** Yes
    *   **Possible Values:** `"LM Studio"`, `"Gemini API"`
    *   **Default:** `"LM Studio"`

*   `lm_studio_url`
    *   **Purpose:** The base URL for the LM Studio local server API.
    *   **Type:** `string`
    *   **Required:** Yes (if `active_backend` is `"LM Studio"`)
    *   **Default:** `"http://localhost:1234/v1"`

*   `gemini_api_key`
    *   **Purpose:** Your API key for the Google Gemini service.
    *   **Type:** `string`
    *   **Required:** Yes (if `active_backend` is `"Gemini API"`)
    *   **Default:** `""`

*   `active_model_name`
    *   **Purpose:** Specifies the model to be used for generation. The exact name depends on the active backend.
    *   **Type:** `string`
    *   **Required:** No (The application may use a default model if this is not set).
    *   **Default:** `""`

*   `model_context_window_size`
    *   **Purpose:** Defines the maximum number of tokens the model can consider as context.
    *   **Type:** `integer`
    *   **Required:** Yes
    *   **Default:** `64000`

### 4.2. Persona & UI Configuration

These keys customize the user interface and the agent's personality.

*   `personas`
    *   **Purpose:** A list of available "personas" that define the agent's behavior and system prompt.
    *   **Type:** `list` of `objects`
    *   **Required:** Yes
    *   **Object Structure:**
        *   `name` (string): The display name of the persona.
        *   `system_prompt` (string): The instructions given to the LLM to define its character and task.
        *   `icon` (string): An emoji or character to represent the persona in the UI.
    *   **Default:** A list containing "Default," "Developer," "Creative Writer," and "Chief of Staff" personas.

*   `active_persona_name`
    *   **Purpose:** The name of the persona to be active on startup. Must match one of the names in the `personas` list.
    *   **Type:** `string`
    *   **Required:** Yes
    *   **Default:** `"Default"`

*   `active_theme`
    *   **Purpose:** The filename of the `qt-material` theme to apply to the UI.
    *   **Type:** `string`
    *   **Required:** Yes
    *   **Default:** `"dark_teal.xml"`

*   `persona_themes`
    *   **Purpose:** A dictionary mapping specific persona names to UI themes, allowing the theme to change automatically when a persona is selected.
    *   **Type:** `object`
    *   **Required:** No
    *   **Default:** `{ "project_manager": "dark_blue.xml", "developer": "dark_cyan.xml", "critic": "dark_red.xml" }`

### 4.3. Data & Integration Configuration

These keys define paths and templates for data sources and integrations.

*   `logseq_path`
    *   **Purpose:** The absolute path to the root directory of your Logseq vault. This is required for the `log_work_product` tool to function.
    *   **Type:** `string`
    *   **Required:** No
    *   **Default:** `""`

*   `rag_prompt_template`
    *   **Purpose:** The template used to construct the final prompt for the RAG (Retrieval-Augmented Generation) pipeline.
    *   **Type:** `string`
    *   **Required:** Yes
    *   **Placeholders:** Must include `{context_string}` and `{user_question}`.
    *   **Default:** `"Use the following context from local documents..."`

*   `average_chunk_token_size`
    *   **Purpose:** An estimated average token size for text chunks used in the RAG pipeline. This helps in managing context window limits.
    *   **Type:** `integer`
    *   **Required:** Yes
    *   **Default:** `128`

### 4.4. Advanced Configuration

*   `operational_planes`
    *   **Purpose:** An experimental feature for routing requests to different internal pipelines based on the active persona.
    *   **Type:** `object`
    *   **Required:** No
    *   **Default:** `{ "persona": "default", "rag_pipeline": "default" }`

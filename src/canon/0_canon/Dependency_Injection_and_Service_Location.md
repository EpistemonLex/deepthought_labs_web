# Dependency Injection and Service Location Guide

**Version:** 1.0
**Date:** August 3, 2025

## 1. Introduction: Managing Shared Resources and Services

In the Deepthought application, many core functionalities rely on shared, often expensive-to-initialize, resources and services. These include LLM clients, embedding models, database managers, and configuration managers. This guide outlines the project's official pattern for managing these dependencies: **Dependency Injection (DI)** and a centralized **Service Location** approach.

## 2. The Problem: Avoiding Anti-Patterns

Without a clear strategy, developers might fall into common anti-patterns:

*   **Direct Instantiation (Anti-Pattern):** Creating new instances of expensive services (e.g., `SentenceTransformer` model, `DatabaseManager`) every time they are needed. This leads to performance bottlenecks, increased memory usage, and inconsistent state.
    ```python
    # Anti-pattern: Inefficient and problematic
    from sentence_transformers import SentenceTransformer

    def process_text(text):
        model = SentenceTransformer('all-MiniLM-L6-v2') # Model re-loaded every call!
        return model.encode(text)
    ```

*   **Global State (Anti-Pattern):** Relying on global variables or singletons that are implicitly accessed. This makes code harder to test, understand, and refactor, as dependencies are hidden.
    ```python
    # Anti-pattern: Hidden dependencies, hard to test
    from my_app.globals import db_manager # Implicit dependency

    def save_data(data):
        db_manager.save(data)
    ```

## 3. The Solution: Dependency Injection (DI)

**Dependency Injection** is a design pattern where components receive their dependencies from an external source rather than creating them internally. This promotes loose coupling, improves testability, and centralizes resource management.

### 3.1. Constructor Injection (Primary Pattern)

The primary method for DI in Deepthought is **Constructor Injection**. Services are instantiated once at application startup and then passed into the constructors of classes that depend on them.

**Example: `ChatController` and `ChatLogicModule`**

```python
# In main.py (Application Startup)
from chat_controller import ChatController
from chat_model import ChatModel
from llm.lm_studio_client import LMStudioClient
from config.manager import ConfigManager
from src.v4.chat_logic_module import ChatLogicModule # Assuming this path

# Instantiate core services ONCE
config_manager = ConfigManager(...)
llm_client = LMStudioClient(...)

# Inject dependencies into ChatLogicModule
chat_logic_module = ChatLogicModule(
    llm_client=llm_client,
    config_manager=config_manager,
    # ... other dependencies like tool_registry, etc.
)

# Inject dependencies into ChatController
controller = ChatController(
    model=ChatModel(),
    view=ChatWindow(),
    llm_client=llm_client, # Injected
    config_manager=config_manager, # Injected
    chat_logic_module=chat_logic_module, # Injected
    # ...
)
```

This pattern makes dependencies explicit and allows for easy mocking during testing.

### 3.2. For Agent Tools: Injecting into Tool Classes

Agent tools (functions in `src/v4/tools.py`) that require expensive resources should receive those resources via their class constructor (if they are class-based tools) or be initialized with pre-instantiated resources at the application startup level.

**Example: `graph_rag_query` and `SentenceTransformer`**

```python
# In src/v4/tools.py (or where tools are initialized)
from sentence_transformers import SentenceTransformer
from data.kuzudb_connector import KuzuDBConnector
from config.manager import ConfigManager
from data.logseq_connector import LogseqConnector

# These are instantiated ONCE at application startup/module load
# and then passed to the tools.
_embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
_kuzudb_connector = KuzuDBConnector()
_logseq_connector = LogseqConnector(config_manager.get_logseq_path())

# The tool function itself uses the pre-instantiated resources
def graph_rag_query(query: str, k: int = 5) -> dict:
    # Uses _embedding_model and _kuzudb_connector from the module scope
    query_embedding = _embedding_model.encode(query).tolist()
    results = _kuzudb_connector.hybrid_graph_query(query_embedding=query_embedding, k=k)
    return results

# ... other tools ...

# In ToolRegistry.register_tool, you would register the function.
# The key is that the dependencies (_embedding_model, etc.) are not created inside the function.
```

## 4. Service Location: Centralized Access to Core Managers

While direct DI is preferred, certain core managers (like `ConfigManager` and `DatabaseManager`) might be needed in various parts of the application where direct constructor injection is impractical or would lead to excessive parameter passing (e.g., in deeply nested utility functions).

For these specific cases, a controlled **Service Location** pattern is used. This means these managers are instantiated once at the application's entry point and then made accessible in a controlled manner.

### 4.1. `ConfigManager` as a Service Locator

`ConfigManager` itself acts as a limited service locator for paths and configuration values. It is instantiated early and then passed to components that need to retrieve configuration or resolve data vault paths.

```python
# In main.py
from config.manager import ConfigManager
from core.file_operations import FileOperations

# Instantiate ConfigManager once
file_operations_instance = FileOperations(base_path=Path(__file__).parent)
config_manager_instance = ConfigManager(file_operations=file_operations_instance)
config_manager_instance.load_or_create_config() # Load config early

# Pass config_manager_instance to components that need it
controller = ChatController(config_manager=config_manager_instance, ...)
```

Components can then call `config_manager.get_data_vault_path()` or `config_manager.get_llm_config()` to access necessary information.

### 4.2. `DatabaseManager` (and other major singletons)

Similar to `ConfigManager`, the `DatabaseManager` should be instantiated once at application startup and then passed down the dependency chain. For utility scripts or modules that need direct database access without being part of the main application flow, they should receive the `DatabaseManager` instance (or its connection/cursor) as an argument.

**Example: `run_rag_query.py` (Refactored)**

```python
# In run_rag_query.py (or similar utility script)
from config.manager import ConfigManager
from core.file_operations import FileOperations
from data.vector_store import VectorStoreManager
from pathlib import Path

# Initialize ConfigManager and get data vault path
file_operations = FileOperations(base_path=Path("."))
config_manager = ConfigManager(file_operations=file_operations)
app_config = config_manager.load_or_create_config()
data_vault_path = config_manager.get_data_vault_path()

# Instantiate DatabaseManager/VectorStoreManager once for the script's lifetime
vector_store_manager = VectorStoreManager(
    db_path=str(data_vault_path / "vector_db")
)

# Pass these instances to functions that need them
propositional_indexer = PropositionalIndexer(
    vector_store_manager=vector_store_manager, ...
)
```

## 5. Principles of Dependency Management

*   **Explicit Dependencies:** Always make a component's dependencies clear, preferably through its constructor or function arguments.
*   **Single Responsibility Principle (SRP):** Components should focus on their core responsibility and not on creating their dependencies.
*   **Testability:** DI makes components easier to test in isolation by allowing mock objects to be injected.
*   **Centralized Instantiation:** Expensive or shared resources should be instantiated once at the highest practical level (e.g., application startup) and then passed down.

By adhering to these principles, Deepthought ensures a clean, maintainable, and performant architecture.

# Agent Tools Guide

**Version:** 1.0
**Date:** 2025-08-03

## 1. Introduction

The agent's capabilities are defined by a set of "tools" it can use to interact with the local environment and data sources. This guide documents each available tool, its purpose, parameters, and return values. Understanding these tools is essential for extending the agent's functionality and for debugging its behavior.

All tools are defined in `src/v4/tools.py`.

---

## 2. Available Tools

### 2.1. `graph_rag_query`

*   **Purpose:**
    Performs a sophisticated hybrid search on the KuzuDB knowledge graph. It uses the user's query to find semantically similar information (vector search) and then explores the graph to find related and connected data points. This is the primary tool for answering questions about the project's knowledge base.

*   **Parameters:**
    *   `query` (string, **required**): The natural language question or topic to search for.
    *   `k` (integer, optional, default: 5): The number of initial "nearest neighbor" results to retrieve from the vector search. A smaller `k` is faster but less comprehensive; a larger `k` is slower but may find more relevant information.

*   **Return Value:**
    *   **On Success:** A dictionary containing the combined results of the vector and graph search. The exact structure may vary but will typically include nodes and edges from the knowledge graph.
    *   **On Failure:** A dictionary with an `"error"` key, e.g., `{"error": "An unexpected error occurred..."}`.

*   **Example Agent Call:**
    ```json
    {
      "tool": "graph_rag_query",
      "args": {
        "query": "What is the project's testing strategy?"
      }
    }
    ```

### 2.2. `list_files`

*   **Purpose:**
    Lists all files and subdirectories within a specified directory on the local filesystem. This is a fundamental tool for exploring the project structure.

*   **Parameters:**
    *   `directory` (string, optional, default: "."): The relative or absolute path to the directory to inspect. If omitted, it defaults to the current working directory of the application.

*   **Return Value:**
    *   **On Success:** A dictionary containing a `files` key with a list of strings, e.g., `{"files": ["src", "tests", "README.md"]}`.
    *   **On Failure:** A dictionary with an `"error"` key, e.g., `{"error": "Directory not found."}`.

*   **Example Agent Call:**
    ```json
    {
      "tool": "list_files",
      "args": {
        "directory": "src/v4"
      }
    }
    ```

### 2.3. `log_work_product`

*   **Purpose:**
    Writes a block of text to a specified page in the user's Logseq vault. This tool serves as an audit trail, allowing the agent to record summaries of its work, decisions made, or artifacts it has produced.

*   **Parameters:**
    *   `content` (string, **required**): The text to be written to the Logseq page. This will be created as a new block on that page.
    *   `page_name` (string, optional, default: "deepthought-audit"): The name of the Logseq page to write to. If the page does not exist, it will be created.

*   **Return Value:**
    *   **On Success:** A dictionary with a `"status"` key, e.g., `{"status": "Successfully wrote work product to Logseq page: Development-Log"}`.
    *   **On Failure:** A dictionary with an `"error"` key, e.g., `{"error": "Logseq vault path is not configured."}`.

*   **Example Agent Call:**
    ```json
    {
      "tool": "log_work_product",
      "args": {
        "content": "I have successfully refactored the database module to use the new Unit of Work pattern.",
        "page_name": "Development-Log"
      }
    }
    ```

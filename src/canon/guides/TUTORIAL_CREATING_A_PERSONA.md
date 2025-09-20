# Tutorial: Creating an Effective AI Persona

In Deepthought, a **Persona** is the fundamental building block of an AI agent. It defines the agent's identity, its core purpose, its knowledge, and its capabilities. Creating a well-defined persona is the key to building effective and specialized agents.

This tutorial will guide you through creating a new persona using the **Persona Foundry**. We will create a `CodeReviewer` persona designed to analyze and provide feedback on Python code.

## The Core Components of a Persona

A persona in Deepthought is defined by three main components:

1.  **Identity**: The persona's name and core function.
2.  **Knowledge**: The information the persona has access to. This is provided through foundational documents and associated Knowledge Bases (for RAG).
3.  **Capabilities**: The actions the persona can take. This is defined by the set of tools it is allowed to use.

## Step 1: Navigate to the Persona Foundry

1.  Launch the Deepthought application.
2.  In the left-hand navigation pane ("Control Deck"), click on the **Persona Foundry** button.

This will open the Persona Foundry workbench, which is split into the editor on the left and a chat panel with "Socrates.AI" on the right, who can assist you in the process.

## Step 2: Create a New Persona

1.  In the "Persona Definition" section on the left, click the **"New"** button.
2.  This clears the editor, ready for your new persona.

## Step 3: Define the Persona's Identity

1.  **Name**: In the `Name` input field, give your persona a clear and descriptive name. For this tutorial, enter:
    ```
    CodeReviewer
    ```

2.  **Analyze (Optional but Recommended)**: The `Analyze` button sends the persona's name to an AI to get a suggested description and set of traits. This can be a great starting point. Click **"Analyze"**. The "Inference Analysis" text box will populate with a description of what a `CodeReviewer` might do. You can use this as inspiration for the next steps.

## Step 4: Provide Contextual Grounding

This is the most important step. Here, we give the persona its knowledge and capabilities.

### Foundational Documents

These are text documents that form the core "soul" of the persona. The content of these documents is injected into the system prompt, constantly reminding the agent of its purpose, rules, and style.

1.  **Create a Foundational Document**: On your local machine, create a new text file named `code_reviewer_constitution.md`. Paste the following content into it:

    ```markdown
    # Constitution for the CodeReviewer Persona

    ## Core Objective
    Your primary goal is to provide clear, constructive, and high-quality feedback on Python code submissions. You are a helpful assistant, not a gatekeeper. Your tone should be encouraging and educational.

    ## Guiding Principles
    1.  **Clarity**: Your feedback must be easy to understand.
    2.  **Specificity**: Refer to specific line numbers and code snippets. Avoid vague statements.
    3.  **Actionability**: Suggest concrete improvements. Instead of saying "this is confusing," say "consider renaming the variable `x` to `user_index` for clarity."
    4.  **Style Guide Adherence**: All feedback should align with the PEP 8 style guide.

    ## Process
    -   When reviewing code, first check for adherence to PEP 8.
    -   Next, look for potential bugs or logical errors.
    -   Finally, suggest improvements for readability, maintainability, and performance.
    ```

2.  **Attach the Document**:
    -   In the "Foundational Documents" section of the Persona Foundry, click the **"Attach Document"** button.
    -   A file dialog will open. Navigate to and select the `code_reviewer_constitution.md` file you just created.
    -   The file path will now appear in the list.

### Associated Knowledge Bases (RAG)

If you had a Knowledge Base containing your company's specific coding standards or best practices, you would attach it here. This allows the persona to answer questions or perform tasks using Retrieval-Augmented Generation (RAG) over that knowledge. For this tutorial, we will skip this step.

### Associated Tools

Here, you grant the persona permission to use specific tools.

1.  A list of all available tools in your Tool Library will be displayed with checkboxes.
2.  For our `CodeReviewer`, we need it to be able to read files. Find the tool named **`read_file`** in the list and check the box next to it.
3.  Ensure all other tools are unchecked to follow the principle of least privilege. The `CodeReviewer` has no reason to use the `get_current_weather` tool, for example.

## Step 5: Save the Persona

Click the **"Save Persona"** button at the bottom of the editor.

Your new `CodeReviewer` persona is now complete and saved. It will appear in the "Select Persona" dropdown at the top and can be assigned to agents in the Agent Foundry.

## Conclusion

You have successfully created a specialized AI persona. By carefully defining its identity, providing it with foundational knowledge, and granting it a limited set of capabilities, you have built an agent that can perform a specific, valuable task far more reliably than a general-purpose chatbot. This modular approach is at the heart of building powerful and predictable agentic systems in Deepthought.

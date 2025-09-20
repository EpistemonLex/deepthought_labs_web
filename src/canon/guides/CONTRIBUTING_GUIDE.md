# Contributing to Deepthought

First off, thank you for considering contributing to Deepthought! It's people like you that make Deepthought such a great tool. We welcome contributions of all kinds, from bug fixes and documentation improvements to new features.

This document provides guidelines for contributing to the project to ensure a smooth and effective development process for everyone involved.

## Table of Contents

-   [Code of Conduct](#code-of-conduct)
-   [Getting Started](#getting-started)
-   [Development Workflow](#development-workflow)
-   [Coding Style Guidelines](#coding-style-guidelines)
-   [Testing](#testing)
-   [Documentation](#documentation)
-   [Submitting a Pull Request](#submitting-a-pull-request)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior.

## Getting Started

Before you begin, please make sure you have followed the [Setup and Installation](./README.md#setup-and-installation) instructions in the main README file to get your local development environment up and running.

A good place to start contributing is by looking at the open issues, especially those labeled `good first issue` or `help wanted`.

## Development Workflow

We use a standard **Forking Workflow** with feature branches.

1.  **Fork the repository**: Start by forking the main Deepthought repository to your own GitHub account.

2.  **Clone your fork**: Clone your forked repository to your local machine.
    ```bash
    git clone https://github.com/YOUR_USERNAME/deepthought.git
    cd deepthought
    ```

3.  **Add the `upstream` remote**: Add the original repository as the `upstream` remote to keep your fork synced.
    ```bash
    git remote add upstream https://github.com/original_owner/deepthought.git
    ```

4.  **Create a new branch**: Always create a new branch for your work. Name it descriptively.
    -   For features: `git checkout -b feature/my-new-feature`
    -   For bug fixes: `git checkout -b fix/bug-name`
    -   For documentation: `git checkout -b docs/topic-update`

5.  **Commit your changes**: Make your changes locally. Commit your work early and often with clear, descriptive commit messages. We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.
    -   **feat**: A new feature.
    -   **fix**: A bug fix.
    -   **docs**: Documentation only changes.
    -   **style**: Changes that do not affect the meaning of the code (white-space, formatting, etc).
    -   **refactor**: A code change that neither fixes a bug nor adds a feature.
    -   **test**: Adding missing tests or correcting existing tests.
    -   **chore**: Changes to the build process or auxiliary tools.

    Example commit message:
    ```
    feat: Add confirmation dialog before deleting a persona

    This commit introduces a `QMessageBox` to confirm that the user wants to
    permanently delete a persona from the Persona Foundry, preventing accidental
    data loss.
    ```

6.  **Keep your branch synced**: Periodically update your branch with the latest changes from the `upstream` main branch.
    ```bash
    git fetch upstream
    git rebase upstream/main
    ```

7.  **Push your branch**: Push your changes to your fork on GitHub.
    ```bash
    git push origin feature/my-new-feature
    ```

8.  **Open a Pull Request**: Once your changes are pushed, open a pull request from your fork to the main Deepthought repository.

## Coding Style Guidelines

-   **Python Code**: We follow the **PEP 8** style guide for all Python code. We use `ruff` to automatically format our code and check for linting errors. Before committing, please run `poetry run ruff format .` and `poetry run ruff check .` to ensure your code conforms.
-   **Docstrings**: All public modules, classes, functions, and methods **must** have a docstring. We use the **Google Python Style Guide** for docstrings. Please see existing files for examples.
-   **Type Hinting**: All functions and methods must include type hints for all arguments and return values.

## Testing

We take testing seriously. All new features should be accompanied by tests, and bug fixes should include a test that demonstrates the bug and verifies the fix.

-   **Running Tests**: To run the full test suite, use the following command:
    ```bash
    poetry run pytest
    ```
-   **Test Location**: Tests are located in the `tests/` directory and mirror the structure of the `src/` directory.
-   **Types of Tests**:
    -   **Unit Tests**: Test individual functions or classes in isolation.
    -   **Integration Tests**: Test the interaction between multiple components.
    -   **UI (E2E) Tests**: We use `pytest-qt` for end-to-end testing of the user interface. When adding new UI features, please add a corresponding UI test.

## Documentation

-   **Docstrings**: As mentioned above, all code must be documented with Google-style docstrings.
-   **Markdown Documents**: For significant changes to the architecture or user-facing features, please update the relevant `.md` files (`ARCHITECTURE.md`, `UI_ARCHITECTURE.md`, etc.) or create a new one if necessary.

## Submitting a Pull Request

When you are ready to submit your pull request, please ensure the following:

1.  Your PR has a clear, descriptive title.
2.  The PR description explains the "what" and "why" of your changes. If it fixes an open issue, please reference it (e.g., `Fixes #123`).
3.  Your code adheres to the style guidelines.
4.  All tests pass.
5.  Your branch is up-to-date with the `upstream/main` branch.

Thank you again for your contribution!

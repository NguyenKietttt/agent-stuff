---
name: commit-creator
description: Propose a conventional commit message by analyzing git diffs. Trigger whenever the user mentions "commit", "git commit", "create a commit message", or wants to save changes to the repository.
---

# Commit Creator

A skill for generating high-quality, conventional commit messages based on staged changes.

## Workflow

1.  **Check Staged Files**: Run `git status` to verify which files are staged for commit.
2.  **Verify Staging**: If no files are staged, inform the user and ask them to stage the files they want to commit before proceeding.
3.  **Review Changes**: Run `git diff --staged` to review the actual code changes.
4.  **Propose Message**: Generate and propose a commit message following the [Commit Format](#commit-format) and [Rules](#rules).
5.  **Confirm and Commit**: Wait for the user to confirm the proposed message. Once confirmed, run `git commit -m "<proposed-message>"`.

## Commit Format

```
<type>: <concise_description>

<optional_body_explaining_why>
```

## Types

-   `feat`: A new feature
-   `fix`: A bug fix
-   `refactor`: A code change that neither fixes a bug nor adds a feature
-   `chore`: Changes to the build process or auxiliary tools and libraries
-   `docs`: Documentation only changes
-   `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
-   `test`: Adding missing tests or correcting existing tests
-   `perf`: A code change that improves performance
-   `ci`: Changes to CI configuration files and scripts

## Rules

-   **Why, not what**: Describe *why* the change was made, not just what was changed. The diff already shows the "what".
-   **Imperative Mood**: Use the imperative mood ("add", "fix", "change") rather than the past tense ("added", "fixed", "changed").
-   **No AI Attribution**: NEVER add "Co-authored-by: AI" or similar attributions.
-   **No Auto-staging**: NEVER stage files automatically; always require the user to stage them first.
-   **Concise Summary**: Keep the first line (the header) concise (ideally under 72 characters).
-   **Empty Body**: If the change is trivial and the header is self-explanatory, the body can be omitted.

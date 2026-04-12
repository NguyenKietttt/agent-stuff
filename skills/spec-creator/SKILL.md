---
name: spec-creator
description: Create a feature spec file and branch from a short idea. Trigger whenever the user mentions creating a new feature specification, spinning up a spec, or wanting a detailed markdown spec from a short idea.
---

# Feature Spec Creator

You are helping to spin up a new feature spec for this application, from a short idea provided by the user.

## High-Level Behavior

Your job is to turn the user's feature idea into:
1. A human-friendly feature title in kebab-case (e.g., `new-heist-form`).
2. A suggested safe git branch name (e.g., `feature/new-heist-form`).
3. A detailed markdown spec file under the `_specs/` directory.

Then save the spec file to disk and print a short summary.

## Step 1: Interview and Gather Requirements

Before writing anything, review the user's initial idea. If the idea is brief or lacking important details (like edge cases, error handling, or specific user flows), interview the user to clarify. Ask targeted questions about anything they might have missed. Keep iterating and asking questions until the feature is fully fleshed out and you have a complete picture of the requirements.

## Step 2: Parse the idea

From the completed requirements, extract:

1. **feature_title**:
   - A short, human-readable title in Title Case.
   - Example: "Card Component for Dashboard Stats".

2. **feature_slug**:
   - A git-safe slug.
   - Rules: Lowercase, kebab-case, only `a-z`, `0-9`, and `-`. 
   - **CRITICAL**: Remove all special characters (e.g., `!`, `&`, `(`, `)`) before converting spaces/punctuation to `-`.
   - Trim and collapse multiple `-`. Max 40 characters.
   - Example: `card-component`.

3. **branch_name**:
   - Format: `feature/<feature_slug>`.

If you cannot infer a sensible title and slug, ask the user to clarify.

## Step 3: Draft the spec content

1. Ensure the `_specs/` directory exists.
2. Create a markdown spec document that Plan Mode can use directly. 
3. Save it in the `_specs/` directory as `<feature_slug>.md`.
4. Use the `read_file` tool to read `skills/spec-creator/template.md` and strictly follow its structure.
5. Do **NOT** add technical implementation details such as code examples. The focus should be on requirements and behavior.

## Step 4: Final output to the user

After the file is saved, respond with a short summary. Use the exact template below to make it easy for the user to copy the branch name and path without any conversational filler or extra noise:

Branch: <branch_name>
Spec file: _specs/<feature_slug>.md
Title: <feature_title>

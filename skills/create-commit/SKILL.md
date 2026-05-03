---
name: create-commit
description: Propose a conventional commit message by analyzing git diffs. Trigger whenever the user mentions "commit", "git commit", "create a commit message", or wants to save changes to the repository.
---

A skill for generating high-quality, conventional commit messages based on staged changes.

## Workflow

1.  **Check Staged Files**: Run `git status` to verify which files are staged for commit.
2.  **Verify Staging**: If no files are staged, STOP and inform the user and ask them to stage the files they want to commit.
3.  **Review Changes**: Run `git diff --staged` to review the code changes. Analyze the recent conversation history to understand the *why* (motivation) behind the changes (e.g., bug reports, feature requests, rationale discussed).
4.  **Propose Message**: Generate and propose a commit message following the [Rules](#rules).
5.  **Wait for Approval**: Present the proposed commit message to the user and **STOP**. Do NOT commit automatically. Wait for the user to either:
    - Approve the message (then proceed to commit)
    - Request changes to the message (then update and return to step 5)
    - Cancel the commit
6.  **Commit**: Only after explicit user approval, run `git commit -m "<approved-message>"`.

## Rules

**Subject line:**
- `<type>(<optional_scope>): <imperative_summary>`
- Types: `feat`, `fix`, `refactor`, `perf`, `docs`, `test`, `chore`, `build`, `ci`, `style`, `revert`
- Imperative mood: "add", "fix", "remove" — not "added", "adds", "adding"
- ≤50 chars when possible, hard cap 72
- No trailing period
- Scope should be a short noun identifying the section of the codebase modified (e.g., `api`, `ui`, `auth`). Keep it concise and omit it if the change spans many different components.

**Body (only if needed):**
- Skip entirely when subject is self-explanatory
- Add body only for: non-obvious *why*, breaking changes, migration notes, linked issues
- Wrap at 72 chars
- If the body describes multiple changes, use a bulleted list with `-` instead of grouping them into a single paragraph.

**What NEVER goes in:**
- "This commit does X", "I", "we", "now", "currently" — the diff says what
- "As requested by..." — use Co-authored-by trailer
- "Generated with Claude Code" or any AI attribution
- Emoji (unless project convention requires)
- Restating the file name when scope already says it

## Examples

Diff: new endpoint for user profile with body explaining the why
- ❌ "feat: add a new endpoint to get user profile information from the database"
- ✅
  ```
  feat(api): add GET /users/:id/profile

  Mobile client needs profile data without the full user payload
  to reduce LTE bandwidth on cold-launch screens.
  ```

Diff: breaking API change
- ✅
  ```
  feat(api)!: rename /v1/orders to /v1/checkout

  BREAKING CHANGE: clients on /v1/orders must migrate to /v1/checkout
  before 2026-06-01. Old route returns 410 after that date.
  ```

Diff: multiple changes in one commit
- ❌
  ```
  refactor(auth): update authentication flow

  Migrated to new JWT library, removed deprecated OAuth 1.0 support, and updated error handling for token expiration.
  ```
- ✅
  ```
  refactor(auth): update authentication flow

  - Migrate to new JWT library
  - Remove deprecated OAuth 1.0 support
  - Update error handling for token expiration
  ```

## Auto-Clarity

Always include body for: breaking changes, security fixes, data migrations, anything reverting a prior commit. Never compress these into subject-only - future debuggers need the context.

---
name: commit-creator
description: Propose a conventional commit message by analyzing git diffs. Trigger whenever the user mentions "commit", "git commit", "create a commit message", or wants to save changes to the repository.
---

# Commit Creator

A skill for generating high-quality, conventional commit messages based on staged changes.

## Workflow

1.  **Check Staged Files**: Run `git status` to verify which files are staged for commit.
2.  **Verify Staging**: If no files are staged, inform the user and ask them to stage the files they want to commit before proceeding.
3.  **Review Changes**: Run `git diff --staged` to review the code changes. Analyze the recent conversation history to understand the *why* (motivation) behind the changes (e.g., bug reports, feature requests, rationale discussed).
4.  **Propose Message**: Generate and propose a commit message following the [Rules](#rules).
5.  **Confirm and Commit**: Wait for the user to confirm the proposed message. Once confirmed, run `git commit -m "<proposed-message>"`.

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
- Bullets `-` not `*`

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

## Auto-Clarity

Always include body for: breaking changes, security fixes, data migrations, anything reverting a prior commit. Never compress these into subject-only - future debuggers need the context.

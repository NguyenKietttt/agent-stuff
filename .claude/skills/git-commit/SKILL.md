---
name: git-commit
description: Use this skill whenever the user wants to commit changes, write a commit message, stage and commit files, or asks what to write for a git commit. Triggers on phrases like "commit", "write a commit", "commit message", "stage and commit", "what should I commit", "help me commit", "push my changes", or "save my progress to git". Always use this skill before running any git commit command — even if the request seems simple, using this skill ensures meaningful, well-structured commits every time.
model: haiku
---

# Git Commit Skill

Help the user create clear, meaningful commits. The goal is to capture *why* a change was made — not just what files changed. A good commit message lets someone reading the history 6 months from now instantly understand the intent without digging through the diff.

## Workflow

1. **Fetch from remote** — run `git fetch` to get the latest remote state without merging.
2. **Check for upstream commits** — run `git log HEAD..@{u} --oneline` to see if the remote has commits the local branch doesn't. If any exist, stop and tell the user to pull first (e.g. *"There are N new commit(s) on the remote. Please run `git pull` before committing."*)
3. **Check staged files** — run `git status` to see what's staged and unstaged.
4. **Auto-stage if nothing staged** — if no files are staged, run `git add` on all modified/new files.
5. **Understand the changes** — run `git diff --staged` (or `git diff HEAD` if nothing is staged yet) to read what actually changed.
6. **Clarify intent if needed** — if the diff alone doesn't make the *purpose* of the changes clear, ask the user before proposing a message. Guessing a message that merely sounds related to the diff leads to noise in the git history. A simple *"What was the goal of these changes?"* is better than a wrong commit.
7. **Propose a commit message** — show the user your proposed message (type + description + optional body/footer) and let them confirm or edit before running the commit.
8. **Commit** — once the user confirms, run the commit.

## Commit Message Format

```
<type>[optional scope][optional !]: <description>

[optional body]

[optional footer(s)]
```

### Type

Required. Must be one of:

| Type | When to use |
|---|---|
| `feat` | Introduces a new feature (maps to SemVer MINOR) |
| `fix` | Patches a bug (maps to SemVer PATCH) |
| `refactor` | Restructures code without changing behavior |
| `chore` | Tooling, dependencies, build config, maintenance |
| `docs` | Documentation only |
| `style` | Formatting, whitespace, naming (no logic change) |
| `test` | Adding or fixing tests |
| `perf` | Performance improvement |
| `ci` | CI/CD configuration changes |
| `build` | Build system or external dependency changes |
| `revert` | Reverts a previous commit |

### Scope (optional)

A noun in parentheses describing the section of the codebase affected: `feat(auth):`, `fix(parser):`, `chore(deps):`. Use it when the change is clearly scoped to one area and the scope adds meaningful signal.

### Description

Short summary immediately after the colon and space. Use imperative mood ("fix", "add", "remove" — not "fixed" or "adds"), no period at the end, keep the full first line under 72 characters. Describe *why*, not just what the diff shows.

### Body (when to use)

Add a body when the description line alone wouldn't give a future reader enough context — e.g., when you're explaining a tradeoff, a non-obvious fix, or a change in behavior. Separate from the description with a blank line and wrap lines at ~72 characters.

### Footers (when to use)

Add footers for cross-references or review metadata: `Refs: #123`, `Reviewed-by: Alice`, `Closes: #45`. Separate from the body (or description) with a blank line. Use `-` instead of spaces in multi-word tokens (`Reviewed-by:`, not `Reviewed by:`).

## Breaking Changes

Two equivalent ways to signal a breaking change (maps to SemVer MAJOR):

**Option 1 — `!` after type/scope:**
```
feat(api)!: remove deprecated /v1 endpoints
```

**Option 2 — `BREAKING CHANGE` footer** (uppercase, required):
```
feat: allow config object to extend other configs

BREAKING CHANGE: `extends` key now merges instead of replacing config
```

You can use both together. When `!` is used, the `BREAKING CHANGE:` footer is optional but clarifies the impact.

## Examples

| Weak (describes what) | Strong (explains why) |
|---|---|
| `update GameManager.cs` | `fix: prevent score from resetting on level retry` |
| `add null check` | `fix(auth): crash when launching with no saved data` |
| `change UI color` | `style: match button colors to new design spec` |
| `add level 7` | `feat(levels): add level 7 with moving obstacle mechanic` |

**Multi-paragraph body + footers:**
```
fix: prevent racing of requests

Introduce a request id and a reference to the latest request.
Dismiss responses from all but the most recent request to avoid
out-of-order updates corrupting state.

Reviewed-by: Z
Refs: #123
```

**Breaking change with `!`:**
```
feat(api)!: drop support for Node 14

BREAKING CHANGE: uses optional chaining and nullish coalescing
which require Node 16+
```

**When to ask instead of guess:**

If the diff shows something like a config file with a handful of value changes, but it's not obvious *why* those values changed, ask: *"What prompted these config changes?"* This keeps the history meaningful and avoids commits like `chore: update config` that tell future readers nothing.

## Splitting Commits

If the diff mixes unrelated concerns, suggest splitting into separate commits — they're easier to review, revert, and understand in `git log`.

Split when you see:
- Different types mixed (feat + fix, chore + refactor)
- Unrelated files changed for different reasons
- Changes that deserve separate history entries

## Notes

- If specific files are already staged, commit only those.
- Never add AI attribution to commit messages — no `Co-Authored-By: Claude`, `Generated with Claude Code`, or any AI-related mention in any form. The message should contain only the actual change description and relevant human context.
- Always show the proposed message to the user before committing — they may know context you don't.
- `BREAKING CHANGE` in a footer must be uppercase.
- If you're not confident about the intent behind the changes, ask the user. Don't fabricate a plausible-sounding message — a short clarifying question is always better than a commit that misleads the history.

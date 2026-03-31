---
name: git-commit
description: Use this skill whenever the user wants to commit changes, write a commit message, stage and commit files, or asks what to write for a git commit. Triggers on phrases like "commit", "write a commit", "commit message", "stage and commit", "what should I commit", "help me commit". Always use this skill before running any git commit command.
---

# Git Commit Skill

Help the user create clear, meaningful commits. The goal is to capture *why* a change was made — not just what files changed.

## Workflow

1. **Fetch from remote** — run `git fetch` to get the latest remote state without merging
2. **Check for upstream commits** — run `git log HEAD..@{u} --oneline` to see if the remote has commits the local branch doesn't. If any commits are found, **stop immediately** and tell the user to pull before committing (e.g. "There are N new commit(s) on the remote. Please run `git pull` before committing.")
3. **Check staged files** — run `git status` to see what's staged and unstaged
4. **Auto-stage if nothing staged** — if 0 files are staged, run `git add` on all modified/new files
5. **Understand the changes** — run `git diff --staged` (or `git diff HEAD` if nothing staged yet) to read what actually changed
6. **Suggest a commit message** — show the user your proposed message and let them confirm or edit before committing
7. **Commit** — once approved, run the commit

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

A noun in parentheses describing the section of codebase affected: `feat(auth):`, `fix(parser):`, `chore(deps):`.

### Description

Short summary immediately after the colon and space. Imperative mood, no period at end, under 72 chars total for the first line. Describes *why*, not just what the diff shows.

### Body (optional)

Separated from the description by a blank line. Free-form, use to explain motivation and contrast with previous behavior. Wrap at ~72 chars.

### Footers (optional)

Separated from the body (or description) by a blank line. Each footer is a token + `: ` or ` #` + value, following git trailer format (use `-` instead of spaces in token names, e.g. `Reviewed-by:`).

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

## Splitting Commits

If the diff mixes unrelated concerns, suggest splitting into separate commits — easier to review, revert, and understand in `git log`.

Split when you see:
- Different types mixed (feat + fix, chore + refactor)
- Unrelated files changed for different reasons
- Changes that deserve separate history entries

## Notes

- If specific files are already staged, commit only those
- **Never add AI attribution to commit messages.** Do not include `Co-Authored-By: Claude`, `Generated with Claude Code`, or any other AI-related footer, trailer, or mention — in any form. The commit message must contain only the actual change description and relevant human context.
- Always show the proposed message to the user before committing — they may know context you don't
- `BREAKING CHANGE` in a footer must be uppercase

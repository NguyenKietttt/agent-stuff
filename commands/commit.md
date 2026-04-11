---
description: Create a commit message by analyzing git diffs
---

## Your task
Propose a conventional commit message based on the following context.

## Workflow
1. Run `git status` to check staged files
2. If nothing staged, ask user to stage files first
3. Run `git diff --staged` to review changes
4. Propose a commit message and wait for confirmation
5. Run `git commit` after user confirms

## Commit Format
```
<type><optional_scope>: <concise_description>
<optional_body_explaining_why>
```

## Types
feat, fix, refactor, chore, docs, style, test, perf, ci

## Rules
- Never add AI attribution (no Co-Authored-By, etc.)
- Never auto-stage files — always ask the user to stage first
- Describe *why* not just what changed
- Use imperative mood ("add" not "added")

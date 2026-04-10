---
description: Stage and commit with a conventional commit message
---

## Workflow
1. Run `git status` to check staged files
2. If nothing staged, ask user to stage files first
3. Run `git diff --staged` to review changes
4. Propose a commit message and wait for confirmation
5. Run `git commit` after user confirms

## Commit Format
```
<type>[<scope>]: <description>
```

## Types
feat, fix, refactor, chore, docs, style, test, perf, ci, build, revert

## Rules
- Never auto-stage files — always ask the user to stage first
- Use imperative mood ("add" not "added")
- Keep first line under 72 chars
- Describe *why* not just what changed
- Breaking changes: add `!` after type/scope OR add `BREAKING CHANGE:` footer
- Never add AI attribution (no Co-Authored-By, etc.)

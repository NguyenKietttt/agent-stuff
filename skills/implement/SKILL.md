---
name: implement
description: Implement vertical slice issues, guiding end-to-end development of tracer bullet slices. Use when user mentions implementing an issue, working on an issue, or wants to start development on a specific issue.
---

# Implement

## Quick start
1. Ask the user for the full file path to the issue they want to implement (example: `./planning/issues/42.md`).
2. Review the issue's `Blocked by` section: implement all dependency issues first.
3. Read any linked specification or documentation for full context on requirements and implementation decisions.
4. Follow the workflow below to implement and verify the issue.

## Workflow
1. **Pre-implementation check**
   - [ ] Confirm all blocking issues are implemented and merged
   - [ ] Read the issue's `What to build`, `Acceptance criteria`, and `Manual Testing` sections
   - [ ] Check if all acceptance criteria are already marked as complete. If yes, inform the user that the issue is already fully implemented and no further work is needed, then skip remaining workflow steps.
2. **Codebase exploration**
   - [ ] Explore relevant modules/schema/API/UI layers mentioned in the issue
   - [ ] Check for existing code that can be reused
3. **Implement the vertical slice**
   - [ ] Build end-to-end functionality across all layers (schema → API → UI) per the tracer bullet approach
   - [ ] Follow acceptance criteria exactly; avoid scope creep
4. **Verification**
   - [ ] Inform the user to manually test the issue using the steps provided in the issue's `Manual Testing` section
   - [ ] Check off all acceptance criteria

## Notes
- Issues are typically stored in project-specific planning directories; refer to your project's structure for exact locations.

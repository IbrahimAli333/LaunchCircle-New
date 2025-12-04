# AGENTS.md

## Workflow
- Run build, lint/format, and full test suite before any commit/merge.
- Follow existing repo style: naming, imports, indentation, comments.
- No secrets or .env files committed; avoid production/deployment config changes.

## Code Style
- Mirror existing patterns; meaningful names.
- Frontend: follow component/file naming (PascalCase components, .tsx/.jsx as used).
- Backend: respect module structure and import ordering.
- Add docstrings/comments only for nontrivial logic.
- New files: add a brief top-level comment header for purpose/usage.

## Testing
- All new behavior gets tests under /tests (e.g., test_*.py, *.test.ts).
- Keep/adjust existing tests; do not skip/remove without justification.
- 
pm test (or stack equivalent) must pass with zero errors pre-merge.

## Git / PR
- Branch/commit format: [feature] Add <feature> or [bugfix] Fix <bug>.
- PRs include what changed and why; add docs/changelog when user-facing; include tests for backend/API changes.

## Security
- Never commit secrets, credentials, private keys, or .env files.
- Avoid large data/logs; prefer external storage and document.

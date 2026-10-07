# Contributing

Keep changes focused and preserve the existing API and checkout behavior.

## Comments

- Use names and small, focused functions to explain what the code does.
- Comment decisions, constraints, and failure cases that the code alone cannot
  explain: why a retry keeps its key, why a transaction must be atomic, or why
  an old delivery route must remain unchanged.
- Put the explanation beside the decision. Remove narration of obvious calls,
  imports, rendering, or assignments.
- Use function or file headers for non-obvious contracts, units, caller
  preconditions, or required documentation. Follow a company style guide when
  one applies; do not add a header to every file or function by default.
- Keep comments accurate when behavior changes. Preserve license notices,
  tool directives, and generated-file warnings; edit generators rather than
  their output. Do not rewrite applied database migrations for comment cleanup.

For example, `// Increment retryCount` repeats the code. A useful explanation is
`// Keep the same checkout key: the previous request may have charged the wallet.`

## Verification

Run `npm run build`, `npm test`, and `npm run lint` before pushing. For a comment-only
change, also check the diff for accidental code, configuration, or generated-file
changes. Never include local credentials or unrelated work in the commit.

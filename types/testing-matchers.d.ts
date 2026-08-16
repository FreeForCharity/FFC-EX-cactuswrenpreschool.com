/**
 * Makes the custom Jest matchers visible to TypeScript.
 *
 * The matchers are registered at runtime by `jest.setup.js`, which imports
 * `@testing-library/jest-dom` and `jest-axe/extend-expect` for their global
 * side effects. That file is JavaScript, and `tsconfig.json` only includes
 * `**\/*.ts` / `**\/*.tsx`, so the type augmentations it pulls in were never
 * visible to the type checker — `expect(...).toBeInTheDocument()` and
 * `.toHaveNoViolations()` had no declared types in any test file.
 *
 * That went unnoticed because `next build` did not type-check the `__tests__`
 * tree, so the errors only appeared under a direct `tsc --noEmit`. A Next.js
 * upgrade changed that and turned a latent problem into a failing build.
 *
 * Referencing the package here puts the augmentation on a file the compiler
 * does include, so the matchers are typed no matter which entry point runs the
 * check.
 *
 * `jest-axe`'s side is handled by the local `jest-axe.d.ts` in this directory
 * rather than by `@types/jest-axe` — see the note there for why that package
 * was rejected.
 */

/// <reference types="@testing-library/jest-dom" />

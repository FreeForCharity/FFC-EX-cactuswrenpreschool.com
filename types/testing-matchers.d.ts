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
 * Referencing the packages here puts the augmentations on a file the compiler
 * does include, so the matchers are typed no matter which entry point runs the
 * check. `jest-axe` ships no declarations of its own, hence the separate
 * `@types/jest-axe` devDependency.
 */

/// <reference types="@testing-library/jest-dom" />
/// <reference types="jest-axe" />

/**
 * Minimal type declarations for `jest-axe`, which ships none of its own.
 *
 * The obvious alternative, `@types/jest-axe`, was tried and rejected: it
 * depends on `axe-core@^3.5.5` while `jest-axe@10` depends on `axe-core@4.10.2`,
 * so installing it added a second, three-major-versions-stale copy of axe-core
 * to the tree purely to describe types — and described them against the wrong
 * version. Raised in review on #118.
 *
 * Only the surface these tests actually use is declared. `axe()` and
 * `toHaveNoViolations` are the whole API in use; keeping the declaration narrow
 * means it cannot drift away from a version of axe-core we do not install.
 *
 * This file must stay a SCRIPT, not a module — no top-level `import` or
 * `export`. `declare module 'x'` is an ambient declaration only in a script; in
 * a module it means *augment the existing module* `x`, which silently fails to
 * provide types for a package that has none, leaving TS7016 exactly as before.
 */

declare module 'jest-axe' {
  /** The subset of axe-core's result shape the matcher reports on. */
  interface AxeViolation {
    id: string
    impact?: string | null
    description: string
    help: string
    helpUrl: string
    nodes: unknown[]
  }

  interface AxeResults {
    violations: AxeViolation[]
    passes: unknown[]
    incomplete: unknown[]
    inapplicable: unknown[]
  }

  /** Run an accessibility audit over a DOM node. */
  function axe(
    element: Element | Document | string,
    options?: Record<string, unknown>
  ): Promise<AxeResults>

  /** Matcher object intended for `expect.extend(...)`. */
  const toHaveNoViolations: {
    toHaveNoViolations(results: AxeResults): {
      pass: boolean
      message(): string
    }
  }

  export { axe, toHaveNoViolations }
  export type { AxeResults, AxeViolation }
}

/** Side-effect import used by jest.setup.js to register the matcher. */
declare module 'jest-axe/extend-expect'

declare namespace jest {
  interface Matchers<R = void, T = {}> {
    toHaveNoViolations(): R
  }
}

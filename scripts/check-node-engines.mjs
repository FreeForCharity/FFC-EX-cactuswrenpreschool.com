#!/usr/bin/env node
/**
 * Fails when any installed dependency requires a newer Node than this repo
 * targets.
 *
 * Why this exists: on 2026-08-16 two dependency upgrades were validated on a
 * machine running Node 22 while CI ran Node 20. Both passed every local check
 * and both broke in CI, because npm installs a package whose `engines` exceed
 * the current runtime with only a warning:
 *
 *   - linkinator 8 (engines >=22) crashed the link check outright —
 *     `TypeError: webidl.util.markAsUncloneable is not a function` — so the
 *     check stopped reporting anything at all rather than merely failing.
 *   - @testing-library/jest-dom 7 and @commitlint/cli 21 (engines >=22.12)
 *     would have broken the test run and the commit hooks the same way.
 *
 * A local test run cannot catch this class of problem, because the local Node
 * is whatever the developer happens to have. Reading the declared `engines`
 * out of the lockfile can, and does so on any machine.
 *
 * The target version is read from `.nvmrc`, which is also what CI pins, so
 * there is a single source of truth rather than a constant duplicated here.
 *
 * Exit codes: 0 = every dependency supports the target Node, 1 = at least one
 * requires something newer (or the inputs could not be read).
 */
import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

/** Lowest major that satisfies a semver range like ">=22.12.0" or "^20 || >=22". */
function minimumMajor(range) {
  const majors = [...String(range).matchAll(/(\d+)(?:\.\d+)*/g)].map((m) => Number(m[1]))
  if (majors.length === 0) return null
  // A range listing alternatives is satisfied by its lowest branch.
  return Math.min(...majors)
}

async function main() {
  let target
  try {
    target = Number.parseInt((await readFile(join(ROOT, '.nvmrc'), 'utf8')).trim(), 10)
  } catch {
    console.error('check-node-engines: could not read .nvmrc')
    process.exit(1)
  }
  if (!Number.isInteger(target)) {
    console.error('check-node-engines: .nvmrc does not contain a major version')
    process.exit(1)
  }

  let lock
  try {
    lock = JSON.parse(await readFile(join(ROOT, 'package-lock.json'), 'utf8'))
  } catch {
    console.error('check-node-engines: could not read package-lock.json')
    process.exit(1)
  }

  const offenders = []
  for (const [path, meta] of Object.entries(lock.packages ?? {})) {
    const declared = meta?.engines?.node
    if (!declared) continue
    const needs = minimumMajor(declared)
    if (needs !== null && needs > target) {
      offenders.push({
        name: path.replace(/^node_modules\//, '') || '(root)',
        version: meta.version ?? '?',
        engines: declared,
      })
    }
  }

  if (offenders.length === 0) {
    console.log(`✅ All dependencies support Node ${target} (from .nvmrc).`)
    return
  }

  console.error(
    `❌ ${offenders.length} package(s) require a newer Node than this repo targets ` +
      `(Node ${target}, from .nvmrc):\n`
  )
  for (const o of offenders.sort((a, b) => a.name.localeCompare(b.name))) {
    console.error(`   ${o.name}@${o.version} requires node ${o.engines}`)
  }
  console.error(
    '\nEither pin these packages to a release supporting Node ' +
      `${target}, or raise .nvmrc and every node-version pin in .github/workflows/ together.`
  )
  process.exit(1)
}

main().catch((err) => {
  console.error('check-node-engines: crashed:', err?.message ?? err)
  process.exit(1)
})

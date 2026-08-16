import { existsSync } from 'node:fs'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

// Mock next/font/local so it echoes the call's configuration back out.
// next/jest's default mock returns the literal string "variable", which strips
// the data these tests care about. next/font/local exposes a DEFAULT export
// (unlike next/font/google's named exports), hence __esModule + default.
jest.mock('next/font/local', () => ({
  __esModule: true,
  default: (config: Record<string, unknown>) => ({
    className: 'mock-className',
    style: { fontFamily: 'mock-family' },
    variable: config.variable,
    display: config.display,
    src: config.src,
    fallback: config.fallback,
  }),
}))

import {
  openSans,
  lato,
  raleway,
  faustina,
  cantataOne,
  faunaOne,
  montserrat,
  cinzel,
} from '../../src/lib/fonts'

type MockedFont = {
  variable?: string
  display?: string
  src?: Array<{ path: string; weight: string; style: string }>
  fallback?: string[]
}

const allFonts: Record<string, MockedFont> = {
  openSans,
  lato,
  raleway,
  faustina,
  cantataOne,
  faunaOne,
  montserrat,
  cinzel,
} as unknown as Record<string, MockedFont>

const FONT_DIR = join(__dirname, '..', '..', 'src', 'lib', 'font-files')

describe('fonts module exports', () => {
  it('exports exactly the eight expected font instances', () => {
    expect(Object.keys(allFonts).sort()).toEqual(
      [
        'cantataOne',
        'cinzel',
        'faunaOne',
        'faustina',
        'lato',
        'montserrat',
        'openSans',
        'raleway',
      ].sort()
    )
  })

  it('exports a defined font object for every named font', () => {
    for (const [name, font] of Object.entries(allFonts)) {
      expect({ name, isObject: typeof font === 'object' && font !== null }).toEqual({
        name,
        isObject: true,
      })
    }
  })

  it('exposes a CSS variable name on every font matching --font-<kebab-name>', () => {
    const expected: Record<string, string> = {
      openSans: '--font-open-sans',
      lato: '--font-lato',
      raleway: '--font-raleway',
      faustina: '--font-faustina',
      cantataOne: '--font-cantata-one',
      faunaOne: '--font-fauna-one',
      montserrat: '--font-montserrat',
      cinzel: '--font-cinzel',
    }

    // globals.css consumes these variable names directly, so a rename here
    // silently drops the font rather than failing the build.
    for (const [name, font] of Object.entries(allFonts)) {
      expect({ name, variable: font.variable }).toEqual({ name, variable: expected[name] })
    }
  })

  it('uses swap display for every font', () => {
    for (const [name, font] of Object.entries(allFonts)) {
      expect({ name, display: font.display }).toEqual({ name, display: 'swap' })
    }
  })

  it('declares the weights each font is used at', () => {
    // Five families ship as variable fonts (one file spanning a range); Lato
    // is static with one file per weight.
    const expectedWeights: Record<string, string[]> = {
      openSans: ['400 800'],
      lato: ['400', '700'],
      raleway: ['400 700'],
      faustina: ['400 700'],
      cantataOne: ['400'],
      faunaOne: ['400'],
      montserrat: ['400 700'],
      cinzel: ['400 700'],
    }

    for (const [name, font] of Object.entries(allFonts)) {
      const weights = (font.src ?? []).map((s) => s.weight)
      expect({ name, weights }).toEqual({ name, weights: expectedWeights[name] })
    }
  })

  it('declares a non-empty fallback stack for every font', () => {
    for (const [name, font] of Object.entries(allFonts)) {
      expect({
        name,
        hasFallback: Array.isArray(font.fallback) && font.fallback.length > 0,
      }).toEqual({ name, hasFallback: true })
    }
  })
})

describe('fonts are self-hosted', () => {
  // These guard the fix for the build-time Google Fonts dependency: eight
  // families were fetched from Google's CDN during `next build`, and a single
  // failed request aborted the whole build (observed twice in CI on
  // 2026-08-16). Reintroducing next/font/google would restore that fragility
  // without breaking anything locally, so it is asserted rather than assumed.

  it('does not import next/font/google', () => {
    const source = readFileSync(join(__dirname, '..', '..', 'src', 'lib', 'fonts.ts'), 'utf8')
    const importsGoogle = /from\s+['"]next\/font\/google['"]/.test(source)
    expect(importsGoogle).toBe(false)
  })

  it('points every src at a local file under font-files/', () => {
    for (const [name, font] of Object.entries(allFonts)) {
      for (const entry of font.src ?? []) {
        expect({ name, path: entry.path, local: entry.path.startsWith('./font-files/') }).toEqual({
          name,
          path: entry.path,
          local: true,
        })
      }
    }
  })

  it('resolves every declared font file on disk', () => {
    // A typo'd filename otherwise surfaces only as a build failure.
    for (const [name, font] of Object.entries(allFonts)) {
      for (const entry of font.src ?? []) {
        const filename = entry.path.replace('./font-files/', '')
        expect({ name, filename, exists: existsSync(join(FONT_DIR, filename)) }).toEqual({
          name,
          filename,
          exists: true,
        })
      }
    }
  })
})

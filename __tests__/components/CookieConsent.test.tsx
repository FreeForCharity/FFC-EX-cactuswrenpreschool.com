import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import CookieConsent, { disclosedServices } from '../../src/components/cookie-consent'

// Extend Jest matchers
expect.extend(toHaveNoViolations)

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('CookieConsent component', () => {
  beforeEach(() => {
    localStorageMock.clear()
  })

  it('should show cookie banner on first visit', async () => {
    render(<CookieConsent />)

    await waitFor(
      () => {
        expect(screen.queryByText(/cookies/i)).toBeInTheDocument()
      },
      { timeout: 2000 }
    )
  })

  it('should display banner when no preferences are saved', async () => {
    render(<CookieConsent />)

    await waitFor(
      () => {
        const banner = screen.queryByText(/cookies/i)
        expect(banner).toBeInTheDocument()
      },
      { timeout: 2000 }
    )
  })

  it('should not show banner if preferences are already saved', () => {
    localStorageMock.setItem(
      'cookie-consent',
      JSON.stringify({
        necessary: true,
        functional: true,
        analytics: false,
        marketing: false,
      })
    )

    render(<CookieConsent />)

    // Banner should not appear immediately if consent is already saved.
    // Matched by role+name rather than body copy: the copy varies with whether
    // any tracking ID is configured, so a text match would silently become an
    // assertion about a string that appears in neither branch.
    const banner = screen.queryByRole('region', { name: /cookie consent/i })
    expect(banner).not.toBeInTheDocument()
  })

  it('should have a link to privacy policy', async () => {
    render(<CookieConsent />)

    await waitFor(
      () => {
        const privacyLinks = screen.queryAllByText(/Privacy Policy/i)
        expect(privacyLinks.length).toBeGreaterThanOrEqual(1)
      },
      { timeout: 2000 }
    )
  })

  // The disclosure text is a factual statement to visitors about what the site
  // collects, so it has to track what the site would actually load rather than
  // being written by hand. These two tests pin both directions: with no
  // tracking IDs the notice must not claim analytics, and with a real ID it
  // must name the service. Without the second case the first would be
  // satisfied by copy that simply never mentions analytics at all.
  describe('disclosure accuracy', () => {
    const PLACEHOLDERS = { ga: 'G-XXXXXXXXXX', clarity: 'XXXXXXXXXX', meta: 'XXXXXXXXXXXXXXX' }

    it('discloses nothing while every tracking ID is a placeholder', () => {
      expect(disclosedServices(PLACEHOLDERS)).toEqual({
        analytics: [],
        marketing: [],
        hasTracking: false,
      })
    })

    it('names each service once its ID is real', () => {
      expect(disclosedServices({ ...PLACEHOLDERS, ga: 'G-CACTUS1234' })).toEqual({
        analytics: ['Google Analytics'],
        marketing: [],
        hasTracking: true,
      })

      expect(disclosedServices({ ...PLACEHOLDERS, clarity: 'abc123xyz0' })).toEqual({
        analytics: ['Microsoft Clarity'],
        marketing: [],
        hasTracking: true,
      })

      expect(disclosedServices({ ...PLACEHOLDERS, meta: '123456789012345' })).toEqual({
        analytics: [],
        marketing: ['Meta Pixel (Facebook)'],
        hasTracking: true,
      })
    })

    // The site as deployed has no tracking IDs, so this is the copy real
    // visitors see. It asserts both halves: the truthful sentence is present
    // AND the template's inherited claim is gone, because a check for only the
    // first would pass on a banner that said both.
    it('the rendered banner does not claim analytics this site does not run', async () => {
      render(<CookieConsent />)

      await waitFor(
        () => {
          expect(screen.getByRole('region', { name: /cookie consent/i })).toBeInTheDocument()
        },
        { timeout: 2000 }
      )

      const banner = screen.getByRole('region', { name: /cookie consent/i })
      expect(banner).toHaveTextContent(/we do not run analytics or advertising/i)
      expect(banner).not.toHaveTextContent(/analyze traffic/i)
      expect(banner).not.toHaveTextContent(/analytics and marketing purposes/i)
    })
  })

  it('should not have accessibility violations when visible', async () => {
    const { container } = render(<CookieConsent />)

    await waitFor(
      async () => {
        const banner = screen.queryByText(/cookies/i)
        if (banner) {
          const results = await axe(container)
          expect(results).toHaveNoViolations()
        }
      },
      { timeout: 2000 }
    )
  })
})

'use client'

/**
 * Reopens the cookie preferences modal from anywhere in the page.
 *
 * The consent component exposes `window.openCookiePreferences` while it is
 * mounted. This button is a small client component so the cookie policy page
 * itself can stay a server component.
 *
 * If the consent component has not mounted (JavaScript disabled, or the script
 * failed), the handler is absent — so the button is only rendered once the
 * handler actually exists, rather than offering a control that does nothing.
 */
import { useEffect, useState } from 'react'

export default function CookiePreferencesButton() {
  const [available, setAvailable] = useState(false)

  useEffect(() => {
    // The consent component sets this on mount; poll once on the next tick so
    // ordering between the two components does not matter.
    const id = window.setTimeout(() => {
      setAvailable(typeof window.openCookiePreferences === 'function')
    }, 0)
    return () => window.clearTimeout(id)
  }, [])

  if (!available) return null

  return (
    <button
      type="button"
      onClick={() => window.openCookiePreferences?.()}
      className="inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark transition-colors"
    >
      Change cookie settings
    </button>
  )
}

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
 *
 * Because it can render nothing, a caller that needs a wrapper element must
 * pass it as `as` rather than wrap the component itself: a caller-side
 * `<li><CookiePreferencesButton /></li>` leaves an EMPTY `<li>` in the markup
 * whenever the button is absent, which is what the static export ships and
 * what a screen reader counts as a blank entry in the nav list.
 */
import { useEffect, useState } from 'react'

export default function CookiePreferencesButton({
  className = 'inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark transition-colors',
  label = 'Change cookie settings',
  as: Wrapper,
}: {
  className?: string
  label?: string
  /**
   * Element to wrap the button in. Rendered only when the button itself is,
   * so a list caller gets no empty `<li>`. Omit for a bare button.
   */
  as?: 'li'
}) {
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

  const button = (
    <button type="button" onClick={() => window.openCookiePreferences?.()} className={className}>
      {label}
    </button>
  )

  return Wrapper ? <Wrapper>{button}</Wrapper> : button
}

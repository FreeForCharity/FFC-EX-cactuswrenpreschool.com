'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'

// Environment variables for tracking IDs. Set at build time — see the
// Environment Variables table in DEPLOYMENT.md. Unset falls back to the
// template placeholder, which isConfigured() then treats as "not set".
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX'
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || 'XXXXXXXXXXXXXXX'
const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || 'XXXXXXXXXX'

/**
 * True only when a tracking ID has been replaced with a real value.
 *
 * Cactus Wren has no analytics accounts provisioned yet, so every ID above is
 * still its placeholder. Without this guard the component would inject a
 * Google Analytics tag for measurement ID `G-XXXXXXXXXX` the moment a visitor
 * clicked "Accept All" — a third-party request, and a cookie, for an account
 * that does not exist. The consent banner itself still appears (the site must
 * ask before it would ever set anything), but consenting to nothing loads
 * nothing.
 *
 * Placeholders are all-X strings behind an optional provider prefix.
 */
function isConfigured(id: string): boolean {
  // trim() so a whitespace-padded placeholder (' G-XXXXXXXXXX ') cannot slip
  // past the placeholder test and load a tag for a nonexistent account.
  const withoutPrefix = id.trim().replace(/^(G-|GTM-|UA-)/, '')
  return withoutPrefix.length > 0 && !/^X+$/i.test(withoutPrefix)
}

/**
 * The services this site would actually load, derived from the same gate that
 * decides whether to load them.
 *
 * The disclosure text has to be driven by `isConfigured()` rather than written
 * by hand. The FFC template's copy named Google Analytics, Microsoft Clarity,
 * Meta Pixel, Zeffy and Microsoft Forms as services in use; Cactus Wren has
 * none of them, so the banner was telling visitors it analysed their traffic
 * while the loaders above were correctly refusing to fire — and directly
 * contradicting /cookie-policy, which says no analytics run. A privacy notice
 * that overstates collection is a misstatement even when the overstatement is
 * in the visitor's favour.
 *
 * Hardcoding "we don't use analytics" would be just as wrong the day someone
 * sets NEXT_PUBLIC_GA_MEASUREMENT_ID, and nothing would flag it. Deriving both
 * the behaviour and the wording from one source means the notice cannot fall
 * out of step with what the site loads.
 *
 * `purposes` exists because analytics and marketing are configured
 * independently. A single "is anything tracking?" flag would put "analyze
 * traffic" in front of a visitor on a site that had only a Meta Pixel — the
 * same overstatement this function exists to prevent, one level up. The
 * sentence is therefore composed from the categories actually in use rather
 * than chosen from two fixed strings.
 *
 * Exported so every state can be tested. The IDs are read from the environment
 * once at module scope, so a rendering test cannot vary them without a second
 * React copy in the module registry — taking them as an argument keeps the
 * "what would we disclose?" decision testable on its own.
 */
export function disclosedServices(ids: { ga: string; clarity: string; meta: string }): {
  analytics: string[]
  marketing: string[]
  purposes: string[]
  hasTracking: boolean
} {
  const analytics = [
    isConfigured(ids.ga) ? 'Google Analytics' : null,
    isConfigured(ids.clarity) ? 'Microsoft Clarity' : null,
  ].filter((s): s is string => s !== null)

  const marketing = [isConfigured(ids.meta) ? 'Meta Pixel (Facebook)' : null].filter(
    (s): s is string => s !== null
  )

  const purposes = [
    analytics.length > 0 ? 'understand how the site is used' : null,
    marketing.length > 0 ? 'measure whether people who see our posts visit the site' : null,
  ].filter((s): s is string => s !== null)

  return { analytics, marketing, purposes, hasTracking: purposes.length > 0 }
}

/** Joins a short list for prose: "a", or "a and b". */
function joinPurposes(items: string[]): string {
  return items.length > 1
    ? `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`
    : items[0]
}

const {
  analytics: ANALYTICS_SERVICES,
  marketing: MARKETING_SERVICES,
  purposes: TRACKING_PURPOSES,
  hasTracking: HAS_TRACKING,
} = disclosedServices({
  ga: GA_MEASUREMENT_ID,
  clarity: CLARITY_PROJECT_ID,
  meta: META_PIXEL_ID,
})

// Define type for GTM dataLayer events
interface DataLayerEvent {
  event: string
  [key: string]: string | number | boolean | undefined
}

// Extend Window interface to include dataLayer and openCookiePreferences
declare global {
  interface Window {
    dataLayer: DataLayerEvent[]
    openCookiePreferences?: () => void
  }
}

interface CookiePreferences {
  necessary: boolean
  functional: boolean
  analytics: boolean
  marketing: boolean
}

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always true, cannot be changed
    functional: true, // Always true, cannot be changed - cookies set by features the visitor uses
    analytics: false,
    marketing: false,
  })
  const [savedPreferencesBackup, setSavedPreferencesBackup] =
    useState<CookiePreferences>(preferences)
  const modalRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  const loadGoogleAnalytics = useCallback(() => {
    if (
      typeof window !== 'undefined' &&
      isConfigured(GA_MEASUREMENT_ID) &&
      !document.querySelector('script[src*="googletagmanager.com/gtag"]')
    ) {
      const gaScript = document.createElement('script')
      gaScript.async = true
      gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
      document.head.appendChild(gaScript)

      const gaConfigScript = document.createElement('script')
      const secureFlag =
        typeof window !== 'undefined' && window.location.protocol === 'https:' ? ';Secure' : ''
      gaConfigScript.textContent = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_MEASUREMENT_ID}', {
          'anonymize_ip': true,
          'cookie_flags': 'SameSite=Lax${secureFlag}'
        });
      `
      document.head.appendChild(gaConfigScript)
    }
  }, [])

  const loadMetaPixel = useCallback(() => {
    if (
      typeof window !== 'undefined' &&
      isConfigured(META_PIXEL_ID) &&
      !document.querySelector('script[src*="fbevents.js"]')
    ) {
      const fbScript = document.createElement('script')
      fbScript.textContent = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${META_PIXEL_ID}');
        fbq('track', 'PageView');
      `
      document.head.appendChild(fbScript)

      const fbNoScript = document.createElement('noscript')
      const img = document.createElement('img')
      img.height = 1
      img.width = 1
      img.style.display = 'none'
      img.src = `https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`
      fbNoScript.appendChild(img)
      document.body.appendChild(fbNoScript)
    }
  }, [])

  const loadMicrosoftClarity = useCallback(() => {
    if (
      typeof window !== 'undefined' &&
      isConfigured(CLARITY_PROJECT_ID) &&
      !document.querySelector('script[src*="clarity.ms"]')
    ) {
      const clarityScript = document.createElement('script')
      clarityScript.textContent = `
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
      `
      document.head.appendChild(clarityScript)
    }
  }, [])

  // Expires each name host-only AND against every registrable-domain
  // candidate for the current hostname. A cookie set with
  // `domain=.cactuswrenpreschool.com` is NOT removed by a host-only expiry
  // of the same name, so expiring only the current hostname left the cookie
  // in place while reporting success.
  const expireCookies = useCallback((names: string[]) => {
    const labels = window.location.hostname.split('.')
    const domains: string[] = []
    for (let i = 0; i <= labels.length - 2; i++) {
      const suffix = labels.slice(i).join('.')
      domains.push(suffix, `.${suffix}`)
    }

    names.forEach((name) => {
      const expiry = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
      // Host-only (no domain attribute).
      document.cookie = expiry
      domains.forEach((domain) => {
        document.cookie = `${expiry} domain=${domain};`
      })
    })
  }, [])

  // Expires the cookies of each category that is NOT granted in `prefs`.
  // Analytics covers GA4 + Microsoft Clarity; marketing covers the Meta
  // Pixel. Called with no argument it drops both categories.
  //
  // Keyed on the RESULTING preference state, not on what changed: the
  // previous version expired one flat list whenever EITHER category was
  // withdrawn, so a visitor who turned marketing off lost the analytics
  // cookies they were still consenting to.
  //
  // Only cookies scoped to THIS site's domain can be expired here — that is
  // all document.cookie can reach. A genuinely third-party cookie (the copy
  // of Meta's `fr` held on facebook.com) is beyond it; `fr` is listed only
  // to clear a first-party copy where one exists.
  const deleteTrackingCookies = useCallback(
    (prefs?: CookiePreferences) => {
      const deleteAnalytics = !prefs || !prefs.analytics
      const deleteMarketing = !prefs || !prefs.marketing

      if (deleteAnalytics) {
        expireCookies(['_ga', '_gid', '_clck', '_clsk'])

        // Dynamically delete all cookies matching _ga_* (e.g., _ga_G-XXXXXXXXXX)
        if (typeof document !== 'undefined') {
          const regex = /(?:^|;\s*)(_ga_[^=;\s]*)/g
          const cookieStr = document.cookie
          const found: string[] = []
          let match: RegExpExecArray | null
          while ((match = regex.exec(cookieStr)) !== null) {
            found.push(match[1])
          }
          expireCookies(found)
        }
      }

      if (deleteMarketing) {
        // `fr` is normally a THIRD-party cookie scoped to facebook.com,
        // which document.cookie on this origin cannot touch — expiring it
        // here is a harmless no-op kept for the rare first-party variant.
        expireCookies(['_fbp', 'fr'])
      }
    },
    [expireCookies]
  )

  const applyConsent = useCallback(
    (prefs: CookiePreferences) => {
      // Set a cookie to indicate consent status with Secure flag (only on HTTPS)
      const cookieValue = JSON.stringify(prefs)
      const secureFlag =
        typeof window !== 'undefined' && window.location.protocol === 'https:' ? '; Secure' : ''
      document.cookie = `cookie-consent=${encodeURIComponent(cookieValue)}; path=/; max-age=31536000; SameSite=Lax${secureFlag}`

      // Delete each non-granted category's cookies on EVERY apply, not only
      // on withdrawal of a stored grant. A first-time visitor who declines
      // had no previous preferences to compare against, so the old
      // transition check silently did nothing for them.
      if (!prefs.analytics || !prefs.marketing) {
        deleteTrackingCookies(prefs)
      }

      // Push consent update to GTM dataLayer
      if (typeof window !== 'undefined') {
        window.dataLayer = window.dataLayer || []
        window.dataLayer.push({
          event: 'consent_update',
          functional_consent: prefs.functional ? 'granted' : 'denied',
          analytics_consent: prefs.analytics ? 'granted' : 'denied',
          marketing_consent: prefs.marketing ? 'granted' : 'denied',
        })
      }

      // Load scripts based on consent independently
      if (prefs.analytics) {
        loadGoogleAnalytics()
        loadMicrosoftClarity()
      }
      if (prefs.marketing) {
        loadMetaPixel()
      }
    },
    [deleteTrackingCookies, loadGoogleAnalytics, loadMetaPixel, loadMicrosoftClarity]
  )

  // Helper to load preferences from localStorage and update state
  const loadPreferencesFromLocalStorage = useCallback(
    (showBannerIfMissing = true) => {
      try {
        const consent = localStorage.getItem('cookie-consent')
        if (!consent) {
          if (showBannerIfMissing) setShowBanner(true)
          return
        }
        let savedPreferences: CookiePreferences
        try {
          savedPreferences = JSON.parse(consent)
        } catch {
          if (showBannerIfMissing) setShowBanner(true)
          return
        }

        // Validate the structure (functional is optional for backward compatibility)
        if (
          typeof savedPreferences === 'object' &&
          savedPreferences !== null &&
          typeof savedPreferences.necessary === 'boolean' &&
          typeof savedPreferences.analytics === 'boolean' &&
          typeof savedPreferences.marketing === 'boolean'
        ) {
          // Ensure functional is always true (for backward compatibility with old saved preferences)
          // Create a new object to avoid mutation
          const updatedPreferences: CookiePreferences = {
            ...savedPreferences,
            functional: true,
          }
          setPreferences(updatedPreferences)
          setSavedPreferencesBackup(updatedPreferences)
          applyConsent(updatedPreferences)
        } else {
          // Invalid data, show banner again
          if (showBannerIfMissing) setShowBanner(true)
        }
      } catch {
        // If localStorage is unavailable or data is corrupted, show banner
        if (showBannerIfMissing) setShowBanner(true)
      }
    },
    [applyConsent]
  )

  const handleCancelPreferences = useCallback(() => {
    // Restore the backed-up preferences
    setPreferences(savedPreferencesBackup)
    setShowPreferences(false)
  }, [savedPreferencesBackup])

  // Initialize state from localStorage on mount - this is the correct pattern for hydration
  useEffect(() => {
    // Expose method to window for reopening preferences from other components
    window.openCookiePreferences = () => {
      setShowBanner(true)
      setShowPreferences(true)
      loadPreferencesFromLocalStorage(false)
    }

    // Check if user has already made a choice with error handling
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPreferencesFromLocalStorage(true)

    // Cleanup function to remove the window method
    return () => {
      delete window.openCookiePreferences
    }
  }, [loadPreferencesFromLocalStorage])

  // Focus management for modal
  useEffect(() => {
    if (showPreferences && modalRef.current) {
      // Store the previously focused element
      previousFocusRef.current = document.activeElement as HTMLElement

      // Focus the first focusable element in the modal
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (focusableElements.length > 0) {
        ;(focusableElements[0] as HTMLElement).focus()
      }

      // Handle Escape key
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          handleCancelPreferences()
        }
      }
      document.addEventListener('keydown', handleEscape)

      return () => {
        document.removeEventListener('keydown', handleEscape)
        // Restore focus when modal closes
        if (previousFocusRef.current) {
          previousFocusRef.current.focus()
        }
      }
    }
  }, [showPreferences, handleCancelPreferences])

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    }
    setPreferences(allAccepted)
    try {
      localStorage.setItem('cookie-consent', JSON.stringify(allAccepted))
    } catch (e) {
      // If localStorage is unavailable, continue anyway
      console.warn('Unable to save preferences to localStorage:', e)
    }
    applyConsent(allAccepted)
    setSavedPreferencesBackup(allAccepted)
    setShowBanner(false)
  }

  const handleDeclineAll = () => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      functional: true, // Functional cookies (Zeffy) are always enabled for donations
      analytics: false,
      marketing: false,
    }
    setPreferences(onlyNecessary)
    try {
      localStorage.setItem('cookie-consent', JSON.stringify(onlyNecessary))
    } catch (e) {
      // If localStorage is unavailable, continue anyway
      console.warn('Unable to save preferences to localStorage:', e)
    }

    // No explicit deletion here: applyConsent deletes every non-granted
    // category, and `onlyNecessary` grants neither. Calling it here as well
    // duplicated every expiry write, once per domain candidate.
    applyConsent(onlyNecessary)
    setSavedPreferencesBackup(onlyNecessary)
    setShowBanner(false)
  }

  const handleSavePreferences = () => {
    try {
      localStorage.setItem('cookie-consent', JSON.stringify(preferences))
    } catch (e) {
      // If localStorage is unavailable, continue anyway
      console.warn('Unable to save preferences to localStorage:', e)
    }
    applyConsent(preferences)
    setSavedPreferencesBackup(preferences)
    setShowBanner(false)
    setShowPreferences(false)
  }

  const handleShowPreferences = () => {
    // Backup current preferences in case user cancels
    setSavedPreferencesBackup(preferences)
    setShowPreferences(true)
  }

  if (!showBanner) {
    return null
  }

  if (showPreferences) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-preferences-title"
        onClick={(e) => {
          // Only close if clicking the overlay itself, not the modal content
          if (e.target === e.currentTarget) {
            handleCancelPreferences()
          }
        }}
      >
        <div
          ref={modalRef}
          className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6">
            <h2 id="cookie-preferences-title" className="text-2xl font-bold text-gray-900 mb-4">
              Cookie Preferences
            </h2>
            <p className="text-gray-600 mb-6">
              {HAS_TRACKING
                ? `We use cookies to enhance your browsing experience and, with your permission, to ${joinPurposes(TRACKING_PURPOSES)}. You can choose which types of cookies you allow.`
                : 'You can choose which types of cookies you allow. Today only the necessary category is in use — the toggles below record a standing preference that we will honour if we ever add the others.'}
            </p>

            {/* Necessary Cookies */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">Necessary Cookies</h3>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.necessary}
                    disabled
                    className="w-5 h-5 text-blue-600 bg-gray-300 rounded cursor-not-allowed"
                  />
                  <span className="ml-2 text-sm text-gray-500">Always Active</span>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                These cookies are essential for the website to function properly. They enable basic
                features like page navigation and access to secure areas. The website cannot
                function properly without these cookies.
              </p>
            </div>

            {/* Functional Cookies */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">Functional Cookies</h3>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.functional}
                    disabled
                    className="w-5 h-5 text-blue-600 bg-gray-300 rounded cursor-not-allowed"
                  />
                  <span className="ml-2 text-sm text-gray-500">Always Active</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                These cookies enable features you actively use, such as an embedded donation or
                application form. This site currently embeds none &mdash; enrollment happens on
                Procare&rsquo;s own site, which sets its own cookies under its own policy once you
                follow the link.
              </p>
            </div>

            {/* Analytics Cookies */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">Analytics Cookies</h3>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) =>
                      setPreferences({ ...preferences, analytics: e.target.checked })
                    }
                    className="sr-only peer"
                    aria-label="Enable analytics cookies"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                These cookies would help us understand how visitors interact with our website, by
                collecting and reporting information in aggregate.
              </p>
              {ANALYTICS_SERVICES.length > 0 ? (
                <p className="text-xs text-gray-500">Services: {ANALYTICS_SERVICES.join(', ')}</p>
              ) : (
                <p className="text-xs text-gray-500">
                  Not currently in use. Allowing this category loads nothing today.
                </p>
              )}
            </div>

            {/* Marketing Cookies */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">Marketing Cookies</h3>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={(e) =>
                      setPreferences({ ...preferences, marketing: e.target.checked })
                    }
                    className="sr-only peer"
                    aria-label="Enable marketing cookies"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                These cookies would be used to measure whether people who see one of our posts go on
                to visit the site.
              </p>
              {MARKETING_SERVICES.length > 0 ? (
                <p className="text-xs text-gray-500">Services: {MARKETING_SERVICES.join(', ')}</p>
              ) : (
                <p className="text-xs text-gray-500">
                  Not currently in use. Allowing this category loads nothing today.
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={handleSavePreferences}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Save Preferences
              </button>
              <button
                onClick={handleCancelPreferences}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-gray-200 shadow-2xl"
      role="region"
      aria-label="Cookie consent notice"
    >
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-2">We Value Your Privacy</h3>
            {HAS_TRACKING ? (
              <p className="text-sm text-gray-600 mb-3">
                We use cookies to remember the choice you make here and to enable certain features.
                With your permission, we would also use them to {joinPurposes(TRACKING_PURPOSES)}.
                You can manage your preferences or decline non-essential cookies.
              </p>
            ) : (
              <p className="text-sm text-gray-600 mb-3">
                We use cookies only to remember the choice you make here. We do not run analytics or
                advertising, so there is nothing else to accept &mdash; we ask anyway, and record
                your preference in case that ever changes. You can review the details or decline at
                any time.
              </p>
            )}
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <Link href="/privacy-policy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>
              <Link href="/cookie-policy" className="text-blue-600 hover:underline">
                Cookie Policy
              </Link>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <button
              onClick={handleDeclineAll}
              className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors text-sm whitespace-nowrap"
            >
              Decline All
            </button>
            <button
              onClick={handleShowPreferences}
              className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors text-sm whitespace-nowrap"
            >
              Customize
            </button>
            <button
              onClick={handleAcceptAll}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm whitespace-nowrap"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

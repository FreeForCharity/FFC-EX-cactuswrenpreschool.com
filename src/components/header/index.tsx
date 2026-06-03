'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { FiMenu, FiX, FiChevronDown, FiPhone } from 'react-icons/fi'
import { assetPath } from '@/lib/assetPath'
import { contact, img, nav } from '@/lib/cw'

// Primary items shown inline on desktop; the rest fall under "More".
const PRIMARY = new Set(['/', '/enrollment', '/about-us', '/curriculum', '/tuition', '/contact'])

const Header: React.FC = () => {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const moreRef = useRef<HTMLDivElement>(null)

  const primaryItems = nav.filter((i) => PRIMARY.has(i.href))
  const moreItems = nav.filter((i) => !PRIMARY.has(i.href))

  const closeMenus = () => {
    setMobileOpen(false)
    setMoreOpen(false)
  }

  // Close the "More" dropdown on outside click.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

  const linkClass = (href: string) =>
    `px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
      isActive(href) ? 'text-accent' : 'text-ink/80 hover:text-primary hover:bg-primary/5'
    }`

  return (
    <header id="header" className="sticky top-0 z-50 bg-paper shadow-sm">
      {/* Top utility bar */}
      <div className="bg-primary text-white text-xs sm:text-sm">
        <div className="ffc-container flex items-center justify-between py-1.5">
          <span className="hidden sm:inline">
            {contact.venue} &middot; {contact.street}, {contact.city}, {contact.state} {contact.zip}
          </span>
          <a
            href={contact.phoneHref}
            className="inline-flex items-center gap-1.5 font-semibold hover:text-yellow"
          >
            <FiPhone aria-hidden="true" /> {contact.phone}
          </a>
        </div>
      </div>

      {/* Main bar */}
      <div className="ffc-container flex items-center justify-between gap-4 py-3">
        <Link href="/" className="flex items-center gap-3" aria-label="Cactus Wren Preschool home">
          <Image
            src={assetPath(img.logo)}
            alt="Cactus Wren Cooperative Preschool logo"
            width={120}
            height={78}
            className="h-12 w-auto"
            priority
          />
          <span className="hidden md:block leading-tight">
            <span className="block cw-display text-primary text-lg">Cactus Wren</span>
            <span className="block text-[11px] uppercase tracking-wider text-ink/60">
              Cooperative Preschool
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center" aria-label="Primary">
          {primaryItems.map((item) => (
            <Link key={item.href} href={item.href} className={linkClass(item.href)}>
              {item.label}
            </Link>
          ))}

          <div className="relative" ref={moreRef}>
            <button
              type="button"
              onClick={() => setMoreOpen((v) => !v)}
              aria-expanded={moreOpen}
              aria-haspopup="true"
              className="px-3 py-2 text-sm font-semibold rounded-md text-ink/80 hover:text-primary hover:bg-primary/5 inline-flex items-center gap-1"
            >
              More{' '}
              <FiChevronDown
                aria-hidden="true"
                className={moreOpen ? 'rotate-180 transition' : 'transition'}
              />
            </button>
            {moreOpen && (
              <div className="absolute right-0 mt-1 w-60 rounded-xl bg-paper shadow-lg ring-1 ring-black/5 py-2">
                {moreItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenus}
                    className={`block px-4 py-2 text-sm font-medium ${
                      isActive(item.href)
                        ? 'text-accent bg-primary/5'
                        : 'text-ink/80 hover:text-primary hover:bg-primary/5'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/enrollment"
            className="ml-2 inline-flex items-center rounded-full bg-accent px-4 py-2 text-sm font-bold text-white shadow hover:bg-primary transition-colors"
          >
            Enroll Now
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          className="lg:hidden p-2 text-primary"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <FiX size={26} /> : <FiMenu size={26} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <nav
          className="lg:hidden border-t border-black/5 bg-paper max-h-[70vh] overflow-y-auto"
          aria-label="Mobile"
        >
          <ul className="ffc-container py-2">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={closeMenus}
                  className={`block px-2 py-2.5 text-base font-semibold border-b border-black/5 ${
                    isActive(item.href) ? 'text-accent' : 'text-ink/80'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pt-3 pb-2">
              <Link
                href="/enrollment"
                onClick={closeMenus}
                className="block text-center rounded-full bg-accent px-4 py-2.5 font-bold text-white"
              >
                Enroll Now
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}

export default Header

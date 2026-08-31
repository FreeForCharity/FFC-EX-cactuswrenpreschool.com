import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import Footer from '../../src/components/footer'

expect.extend(toHaveNoViolations)

describe('Footer component', () => {
  it('should render the footer', () => {
    render(<Footer />)
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('should display a Quick Links section', () => {
    render(<Footer />)
    expect(screen.getByText('Quick Links')).toBeInTheDocument()
  })

  it('should display a Contact Us section', () => {
    render(<Footer />)
    expect(screen.getByText('Contact Us')).toBeInTheDocument()
  })

  it('should have a Facebook link', () => {
    render(<Footer />)
    const links = screen.getAllByRole('link')
    const fb = links.find((l) => {
      const href = l.getAttribute('href')
      if (!href) return false
      try {
        return new URL(href).hostname === 'www.facebook.com'
      } catch {
        return false
      }
    })
    expect(fb).toBeDefined()
  })

  it('should display the current year in copyright', () => {
    render(<Footer />)
    const currentYear = new Date().getFullYear()
    const copyright = screen.getByText(/All rights reserved\./i)
    expect(copyright).toHaveTextContent(String(currentYear))
  })

  it('should have an email contact link', () => {
    render(<Footer />)
    const links = screen.getAllByRole('link')
    const emailLink = links.find((link) => link.getAttribute('href')?.includes('mailto:'))
    expect(emailLink).toBeDefined()
  })

  it('should not have accessibility violations', async () => {
    const { container } = render(<Footer />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  describe('cookie preferences entry point', () => {
    afterEach(() => {
      delete window.openCookiePreferences
    })

    it('leaves no empty <li> in the nav when the consent handler is absent', async () => {
      // The handler is registered by the consent banner, which is not mounted
      // here — the same state the STATIC EXPORT ships and the state a visitor
      // with JavaScript disabled stays in. CookiePreferencesButton renders
      // nothing then, so its list item must not be rendered either: an empty
      // <li> is counted by a screen reader as a blank entry in the nav list.
      const { container } = render(<Footer />)

      await waitFor(() => {
        expect(
          Array.from(container.querySelectorAll('li')).filter((li) => li.textContent?.trim() === '')
        ).toHaveLength(0)
      })
    })

    it('renders the button inside its own <li> once the handler exists', async () => {
      window.openCookiePreferences = jest.fn()
      render(<Footer />)

      const button = await screen.findByRole('button', { name: /cookie preferences/i })
      expect(button.parentElement?.tagName).toBe('LI')
    })
  })
})

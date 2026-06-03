import React from 'react'
import { render, screen } from '@testing-library/react'
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
})

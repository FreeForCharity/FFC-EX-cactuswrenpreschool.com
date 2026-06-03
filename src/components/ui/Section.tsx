import React from 'react'

type SectionProps = {
  children: React.ReactNode
  className?: string
  /** Soft cream background for alternating bands. */
  muted?: boolean
  id?: string
}

/** Standard vertical rhythm + centered container wrapper. */
const Section: React.FC<SectionProps> = ({ children, className = '', muted, id }) => (
  <section id={id} className={muted ? 'bg-cream' : ''}>
    <div className={`ffc-container py-12 md:py-16 ${className}`}>{children}</div>
  </section>
)

export default Section

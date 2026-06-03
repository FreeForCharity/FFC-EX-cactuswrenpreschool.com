import React from 'react'

type PageHeroProps = {
  title: string
  eyebrow?: string
  subtitle?: string
}

/**
 * Compact page banner used at the top of interior pages. Decorative
 * cactus-green/teal gradient — no remote assets so it renders instantly.
 */
const PageHero: React.FC<PageHeroProps> = ({ title, eyebrow, subtitle }) => {
  return (
    <section className="bg-gradient-to-br from-primary to-primary-dark text-white">
      <div className="ffc-container py-12 md:py-16 text-center">
        {eyebrow && (
          <p className="text-yellow font-semibold uppercase tracking-wider text-sm mb-2">
            {eyebrow}
          </p>
        )}
        <h1 className="cw-display text-3xl md:text-4xl lg:text-5xl">{title}</h1>
        {subtitle && <p className="mt-4 max-w-2xl mx-auto text-white/85 text-lg">{subtitle}</p>}
      </div>
    </section>
  )
}

export default PageHero

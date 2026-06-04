'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { assetPath } from '@/lib/assetPath'

export type HeroSlide = { src: string; alt: string }

type HeroCarouselProps = {
  slides: HeroSlide[]
  /** Auto-advance interval in ms. */
  interval?: number
}

/**
 * Rotating hero image slideshow (replaces the single static hero photo).
 * Cross-fades through genuine Cactus Wren photos. Auto-advance pauses when
 * the visitor prefers reduced motion; dots allow manual control.
 */
const HeroCarousel: React.FC<HeroCarouselProps> = ({ slides, interval = 5000 }) => {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (slides.length <= 1 || paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length)
    }, interval)
    return () => window.clearInterval(id)
  }, [slides.length, interval, paused])

  return (
    <div
      className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl ring-1 ring-black/5"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Photos of Cactus Wren Cooperative Preschool"
    >
      {slides.map((slide, idx) => (
        <Image
          key={slide.src}
          src={assetPath(slide.src)}
          alt={slide.alt}
          aria-hidden={idx !== active}
          fill
          priority={idx === 0}
          sizes="(max-width: 1024px) 100vw, 600px"
          className={`object-cover transition-opacity duration-1000 ease-in-out ${
            idx === active ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((slide, idx) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => setActive(idx)}
            aria-label={`Show photo ${idx + 1} of ${slides.length}`}
            aria-current={idx === active}
            className={`h-2.5 rounded-full ring-1 ring-black/10 transition-all ${
              idx === active ? 'w-6 bg-white' : 'w-2.5 bg-white/60 hover:bg-white/90'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default HeroCarousel

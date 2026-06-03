import React from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import PageHero from '@/components/ui/PageHero'
import Section from '@/components/ui/Section'
import { assetPath } from '@/lib/assetPath'
import { galleryPhotos } from '@/lib/cw'

export const metadata: Metadata = {
  title: 'Photo Gallery & School Tour',
  description:
    'A photo gallery of Cactus Wren Cooperative Preschool — our classrooms, activities, and play-based learning environment in Sierra Vista, Arizona.',
}

export default function PhotoGalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="Photo Gallery & School Tour"
        title="Photo Gallery"
        subtitle="A glimpse into life and learning at Cactus Wren."
      />

      <Section>
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
          {galleryPhotos.map((src, i) => (
            <div
              key={src}
              className="relative overflow-hidden rounded-2xl ring-1 ring-black/5 break-inside-avoid"
            >
              <Image
                src={assetPath(src)}
                alt={`Cactus Wren Preschool photo ${i + 1}`}
                width={800}
                height={600}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                className="w-full h-auto object-cover"
              />
            </div>
          ))}
        </div>
      </Section>

      <Section muted className="text-center max-w-2xl">
        <h2 className="cw-display text-2xl text-primary">Virtual Tour</h2>
        <p className="mt-3 text-ink/70">Virtual tour of our new location coming soon!</p>
      </Section>
    </>
  )
}

import React from 'react'
import type { Metadata } from 'next'
import PageHero from '@/components/ui/PageHero'
import Section from '@/components/ui/Section'

export const metadata: Metadata = {
  title: 'School Supply Lists',
  description:
    'School supply lists for Cactus Wren Cooperative Preschool, plus the everyday items every student should bring.',
}

const everyday = [
  'Backpack',
  'Water bottle labeled with their name',
  'Seasonally appropriate change of clothes (including underwear) kept in the backpack in case of accidents or spills',
]

export default function SchoolSupplyListsPage() {
  return (
    <>
      <PageHero eyebrow="School Supply Lists" title="2025–2026 Class Supply Lists" />

      <Section className="max-w-2xl">
        <p className="text-lg text-ink/70">Class-specific supply lists coming soon!</p>

        <h2 className="cw-display text-2xl text-primary mt-8">Each student should also bring:</h2>
        <ul className="mt-4 space-y-2 text-ink/80 list-disc list-inside">
          {everyday.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      </Section>
    </>
  )
}

import React from 'react'
import type { Metadata } from 'next'
import PageHero from '@/components/ui/PageHero'
import Section from '@/components/ui/Section'
import DocLink from '@/components/ui/DocLink'
import { docs } from '@/lib/cw'

export const metadata: Metadata = {
  title: 'Calendar',
  description: 'Download the Cactus Wren Cooperative Preschool school year calendar.',
}

export default function CalendarPage() {
  return (
    <>
      <PageHero eyebrow="Calendar" title="School Calendar" />

      <Section className="max-w-2xl text-center">
        <p className="text-lg text-ink/75">
          Download our school year calendar to keep track of important dates, holidays, and events.
        </p>
        <div className="mt-8 grid gap-3 text-left">
          <DocLink label="2026-2027 School Calendar (PDF)" href={docs.schoolCalendar} />
        </div>
      </Section>
    </>
  )
}

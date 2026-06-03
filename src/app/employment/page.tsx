import React from 'react'
import type { Metadata } from 'next'
import PageHero from '@/components/ui/PageHero'
import Section from '@/components/ui/Section'
import Button from '@/components/ui/Button'
import { contact, docs, links } from '@/lib/cw'

export const metadata: Metadata = {
  title: 'Employment',
  description:
    'Employment opportunities at Cactus Wren Cooperative Preschool, including substitute teacher qualifications, responsibilities, and how to apply.',
}

const qualifications = [
  'Experience in a childcare or preschool setting preferred.',
  'Must be 18 or older.',
  'Must be able to pass a background check and obtain an Arizona DPS Fingerprint Card.',
  'All employees must have a TB Verification Form on file, less than 12 months old. (May be completed after the position is offered.)',
]

const responsibilities = [
  'Help the teacher with classroom duties such as setting up daily activities.',
  'Assist the teacher with new student administration duties (if needed).',
  'Help the teacher with classroom events or parties.',
  'Report any suggestions, comments, or complaints from parents to the teacher.',
  'Clean the classroom and restroom each day after class (floors, counters, trash cans, toilets, and carpets).',
  'Go on all school field trips, and attend all trainings and monthly board meetings.',
  'Complete 18 clock hours of training during your contract (some provided by the school).',
  'Assist the lead teacher in a hands-on, play-based learning environment with 4–5-year-olds.',
]

export default function EmploymentPage() {
  return (
    <>
      <PageHero
        eyebrow="Employment"
        title="Join Our Team"
        subtitle="We continually take applications and hold them on file for up to one year."
      />

      <Section className="max-w-3xl">
        <p className="text-ink/75 leading-relaxed">
          We post job openings throughout the year as positions become available. If you would like
          to work for Cactus Wren Preschool, please email an application to{' '}
          <a href={`mailto:${contact.email}`} className="text-primary font-semibold underline">
            {contact.email}
          </a>
          . (Classes meet Tuesday, Wednesday, and Thursday mornings.)
        </p>

        <h2 className="cw-display text-2xl text-primary mt-10">
          Substitute Teachers — Qualifications
        </h2>
        <ul className="mt-4 space-y-2 text-ink/75 list-disc list-inside">
          {qualifications.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ul>

        <h2 className="cw-display text-2xl text-primary mt-10">Responsibilities</h2>
        <ul className="mt-4 space-y-2 text-ink/75 list-disc list-inside">
          {responsibilities.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button href={docs.employmentApplication} variant="accent" external>
            Employment Application
          </Button>
          <Button href={links.dpsFingerprint} variant="outline" external>
            AZ Fingerprint Card (Website)
          </Button>
          <Button href={docs.fingerprintCard} variant="outline" external>
            AZ Fingerprint Card Application
          </Button>
          <Button href={docs.tbVerification} variant="outline" external>
            TB Verification Form
          </Button>
        </div>
      </Section>
    </>
  )
}

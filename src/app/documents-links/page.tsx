import React from 'react'
import type { Metadata } from 'next'
import PageHero from '@/components/ui/PageHero'
import Section from '@/components/ui/Section'
import DocLink from '@/components/ui/DocLink'
import { docs, links, contact } from '@/lib/cw'

export const metadata: Metadata = {
  title: 'Documents & Links',
  description:
    'A complete listing of documents, forms, and websites pertinent to Cactus Wren Cooperative Preschool — enrollment, parent resources, and employee forms.',
}

type Item = { label: string; href: string; external?: boolean; note?: string }

const studentDocs: Item[] = [
  { label: 'Application Form', href: docs.applicationForm },
  { label: 'Enrollment Packet', href: docs.enrollmentPacket },
  { label: '2025-2026 Orientation Manual', href: docs.orientationManual },
  { label: 'Emergency Information Form', href: docs.emergencyInfo },
  { label: 'Hand Sanitizer Permission', href: docs.handSanitizer },
  { label: 'Adult Participation Contract & Photo Consent', href: docs.adultParticipation },
  { label: 'By-Laws & Parent Orientation Agreement', href: docs.byLawsAgreement },
  { label: 'Religious Belief Exemption Form', href: docs.religiousExemption },
]

const parentResources: Item[] = [
  { label: '2025-2026 By-Laws', href: docs.byLaws },
  { label: '2025-2026 School Calendar', href: docs.schoolCalendar },
  { label: '2025-2026 Tuition Schedule', href: docs.tuitionSchedule },
  { label: 'DHS License', href: docs.dhsLicense },
  { label: 'Board Member Contact Information', href: docs.boardContact },
  { label: 'Quality First Arizona', href: links.qualityFirst, external: true },
  { label: 'AZ Early Learning Standards (PDF)', href: docs.azEarlyLearning },
  {
    label: 'AZ Early Learning Standards (Website)',
    href: links.azEarlyLearningSite,
    external: true,
  },
  { label: 'Cactus Wren Facebook Page', href: contact.facebook, external: true },
]

const employeeDocs: Item[] = [
  { label: 'Employment Application', href: docs.employmentApplication },
  { label: 'TB Self-Screening Form', href: docs.tbSelfScreening },
  { label: 'TB Verification Form', href: docs.tbVerification },
  { label: 'AZ DPS Fingerprint Card Application', href: docs.dpsFingerprintApplication },
  { label: 'AZ DPS Fingerprint Card (Website)', href: links.dpsFingerprint, external: true },
]

function Group({ title, items }: { title: string; items: Item[] }) {
  return (
    <div>
      <h2 className="cw-display text-2xl text-primary mb-4">{title}</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((it) => (
          <DocLink
            key={it.label}
            label={it.label}
            href={it.href}
            external={it.external}
            note={it.note}
          />
        ))}
      </div>
    </div>
  )
}

export default function DocumentsLinksPage() {
  return (
    <>
      <PageHero
        eyebrow="Documents & Links"
        title="Documents & Links"
        subtitle="Everything you need, all in one place."
      />

      <Section className="space-y-12">
        <p className="max-w-3xl text-ink/70">
          This page contains a complete listing of the documents, forms, and websites that are
          pertinent to Cactus Wren Co-Op Preschool.
        </p>
        <Group title="Student Forms & Documents" items={studentDocs} />
        <Group title="Parent Resources" items={parentResources} />
        <Group title="Employee Forms & Documents" items={employeeDocs} />
      </Section>
    </>
  )
}

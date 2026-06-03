import React from 'react'
import type { Metadata } from 'next'
import PageHero from '@/components/ui/PageHero'
import Section from '@/components/ui/Section'
import Button from '@/components/ui/Button'
import { contact, links } from '@/lib/cw'

export const metadata: Metadata = {
  title: 'Scholarship Information',
  description:
    'Cactus Wren is a DES Childcare Subsidy contracted provider and offers Quality First scholarships and financial assistance for eligible families.',
}

export default function ScholarshipPage() {
  return (
    <>
      <PageHero
        eyebrow="Scholarships"
        title="Scholarship & Financial Assistance"
        subtitle="Making quality preschool accessible to all families."
      />

      <Section className="max-w-3xl">
        <h2 className="cw-display text-2xl text-primary">
          DES Childcare Subsidy — Contracted Provider
        </h2>
        <p className="mt-3 text-ink/75 leading-relaxed">
          Cactus Wren is now a contracted provider with the Department of Economic Security (DES).
          If you receive other support from DES, you may qualify for the DES Childcare Subsidy. If
          you already qualify and would like your child to attend Cactus Wren, please contact your
          case manager to change your center of choice. For more information about program
          requirements and to access the application, use the resources below.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button href={links.desEligibility} variant="outline" external>
            DES Eligibility Information
          </Button>
          <Button href={links.desApplication} variant="outline" external>
            DES Childcare Application Site
          </Button>
        </div>
      </Section>

      <Section muted className="max-w-3xl">
        <h2 className="cw-display text-2xl text-primary">Quality First Scholarships</h2>
        <div className="cw-prose mt-3 text-ink/75">
          <p>
            Our scholarships are provided by{' '}
            <a href={links.qualityFirst} target="_blank" rel="noopener noreferrer">
              Quality First of Arizona
            </a>
            . These scholarships are offered to students on the basis of financial need and are
            determined by your household size and annual income. The scholarships cover the complete
            cost of tuition for the Preschool or Pre-K class.
          </p>
          <p>
            Financial assistance is based on availability of funds. Scholarships are available on a
            first-come, first-served basis and fill up quickly. If you are interested in the
            availability of financial assistance, please contact our Financial Director, Brian
            Lenzmeier. Applications and all supporting paperwork are accepted electronically via{' '}
            <a href={`mailto:${contact.email}`}>email</a>, or you can mail a hard copy to:
          </p>
          <p className="font-semibold text-ink not-prose">
            Cactus Wren Preschool — Attn: Scholarships
            <br />
            {contact.street}
            <br />
            {contact.city}, {contact.state} {contact.zip}
          </p>
        </div>
        <div className="mt-6">
          <Button href={links.qualityFirst} variant="accent" external>
            Quality First Arizona
          </Button>
        </div>
      </Section>
    </>
  )
}

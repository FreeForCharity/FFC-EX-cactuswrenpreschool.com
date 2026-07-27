import React from 'react'
import type { Metadata } from 'next'
import PageHero from '@/components/ui/PageHero'
import Section from '@/components/ui/Section'
import Button from '@/components/ui/Button'
import { contact, docs } from '@/lib/cw'

export const metadata: Metadata = {
  title: 'Tuition',
  description:
    '2025-2026 tuition and fees for Cactus Wren Cooperative Preschool, including 3-Day Preschool and Pre-K rates, registration fees, discounts, and payment information.',
}

const plans = [
  {
    title: '3-Day Preschool',
    when: 'Tuesday, Wednesday & Thursday Mornings',
    monthly: '$350.00 / month',
    installments: [
      '5-month installment: $1,662.50 (5% discount)',
      '10-month installment: $3,325.00 (5% discount)',
    ],
  },
  {
    title: '3-Day Pre-K',
    when: 'Tuesday, Wednesday & Thursday Mornings',
    monthly: '$350.00 / month',
    installments: [
      '5-month installment: $1,662.50 (5% discount)',
      '10-month installment: $3,325.00 (5% discount)',
    ],
  },
]

export default function TuitionPage() {
  return (
    <>
      <PageHero
        eyebrow="Tuition"
        title="2025–2026 Tuition & Fees"
        subtitle="August 2025 – May 2026"
      />

      <Section>
        <div className="rounded-2xl bg-cream p-6 max-w-3xl mx-auto text-center">
          <p className="font-semibold text-ink">
            Registration Fees: $50 for the first student and $40 for each additional student.
          </p>
          <p className="text-sm text-ink/60 mt-1">(Registration fee is non-refundable.)</p>
        </div>

        <div className="mx-auto mt-8 grid max-w-4xl gap-6 md:grid-cols-2">
          {plans.map((p) => (
            <div key={p.title} className="rounded-2xl bg-paper p-6 shadow-sm ring-1 ring-black/5">
              <h3 className="cw-heading text-xl text-primary">{p.title}</h3>
              <p className="mt-2 text-sm text-ink/70">{p.when}</p>
              <p className="mt-3 text-2xl cw-display text-accent">{p.monthly}</p>
              <ul className="mt-3 space-y-1 text-sm text-ink/70">
                {p.installments.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-sm text-ink/60">
          Tuition rates increase 3–5% every year. 1st &amp; last month&apos;s tuition, plus the
          registration fee, are due 3 days prior to the student&apos;s agreed-upon start date.
        </p>
      </Section>

      <Section muted className="max-w-3xl">
        <h2 className="cw-display text-2xl text-primary">10% Multi-Child Discount</h2>
        <p className="mt-3 text-ink/75 leading-relaxed">
          Families enrolling more than one child at a time receive a discount on the second
          child&apos;s tuition. The discount is applied to the lesser of the two children&apos;s
          tuition amounts. Only one discount per family can be used at a time. Please contact the
          Financial Director for more information.
        </p>

        <h2 className="cw-display text-2xl text-primary mt-10">Co-Op Volunteer Requirement</h2>
        <p className="mt-3 text-ink/75 leading-relaxed">
          Cactus Wren is one of the oldest preschools in Sierra Vista. Heavy parent involvement has
          allowed us to keep tuition affordable since the beginning. We rely on the co-op model to
          keep our school running and affordable — that means we rely on our parents to volunteer
          their time at activities, donate supplies, help teachers prepare materials, and
          participate in whatever ways they are able. Every family is responsible for volunteering
          their time or donating supplies. More information will be supplied at your child&apos;s
          orientation.
        </p>

        <h2 className="cw-display text-2xl text-primary mt-10">Payment &amp; Late Fees</h2>
        <div className="cw-prose mt-3 text-ink/75">
          <p>
            Tuition is due on the 1st of the month. Tuition not paid by the 1st will result in a $25
            late fee if still unpaid by the 7th, payable with the overdue tuition. If the overdue
            tuition + late fee is still unpaid by the 15th, an additional $25 late fee is added and
            the child will be suspended from school until all tuition and late fees are paid. Please
            contact the Financial Director before the 7th.
          </p>
          <p>
            Tuition payments may be processed electronically from your Procare account, or you may
            deposit payments via check or money order in the grey tuition box inside the office
            door, or mail to:
          </p>
          <p className="font-semibold text-ink not-prose">
            Cactus Wren Cooperative Preschool
            <br />
            {contact.mailing}
          </p>
          <p>
            Please write your child&apos;s name and class in the memo portion of your check/money
            order. We <strong>do not</strong> accept cash payments.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button href={docs.tuitionSchedule} variant="accent" external>
            Tuition Schedule (PDF)
          </Button>
          <Button href="/scholarship-information" variant="outline">
            Scholarship Information
          </Button>
        </div>
      </Section>
    </>
  )
}

import React from 'react'
import type { Metadata } from 'next'
import PageHero from '@/components/ui/PageHero'
import Section from '@/components/ui/Section'
import Button from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Class Schedules',
  description:
    'Cactus Wren offers 3-Day Preschool and 3-Day Pre-K programs for children ages 3 to 5. Small class sizes with a teacher and aide in every class.',
}

const classes = [
  {
    title: '3-Day Preschool',
    days: 'Tuesday, Wednesday & Thursday',
    time: '8:30 am – 12:30 pm',
    note: 'For all ages 3–5',
  },
  {
    title: '3-Day Pre-K',
    days: 'Tuesday, Wednesday & Thursday',
    time: '8:30 am – 12:30 pm',
    note: 'For 4 & 5-year-olds starting Kindergarten the following year',
  },
]

export default function ClassSchedulesPage() {
  return (
    <>
      <PageHero
        eyebrow="Class Schedules"
        title="Class Schedules & Enrollment Policies"
        subtitle="Small class sizes (max 16 students) to maximize learning potential."
      />

      <Section className="max-w-3xl">
        <div className="cw-prose text-ink/75">
          <p>
            Cactus Wren offers preschool and Pre-K programs for children ages 3, 4, and 5 who are
            fully potty trained. Each class has one professional teacher and a qualified
            teacher&apos;s aide.
          </p>
          <p>
            In order to enroll your child for the beginning of the school year, the child must
            already be 3 by August 1 of the school year. If your child turns 3 during the school
            year, you are welcome to inquire about enrolling them as they approach their 3rd
            birthday.
          </p>
          <p>
            If your child turns 4 by September 1st, they are eligible for enrollment in our Pre-K
            class. This is one of our most desired programs — not only for the schedule, but for the
            amount of time students spend with their teachers preparing for Kindergarten.
          </p>
          <p>
            We understand that all students come from different backgrounds and may need time to
            adjust to the school environment. We will keep open communication with parents during
            the adjustment period and work diligently to ensure that Cactus Wren is an enriching and
            positive fit for your child.
          </p>
        </div>
      </Section>

      <Section muted>
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          {classes.map((c) => (
            <div key={c.title} className="rounded-2xl bg-paper p-6 shadow-sm ring-1 ring-black/5">
              <h3 className="cw-heading text-xl text-primary">{c.title}</h3>
              <p className="mt-3 font-semibold text-ink">{c.days}</p>
              <p className="text-accent font-semibold">{c.time}</p>
              <p className="mt-3 text-sm text-ink/70">{c.note}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Button href="/tuition" variant="primary">
            Tuition &amp; Fees
          </Button>
        </div>
      </Section>
    </>
  )
}
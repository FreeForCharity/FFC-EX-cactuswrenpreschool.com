import React from 'react'
import type { Metadata } from 'next'
import PageHero from '@/components/ui/PageHero'
import Section from '@/components/ui/Section'
import Button from '@/components/ui/Button'
import { contact, docs } from '@/lib/cw'

export const metadata: Metadata = {
  title: 'Enrollment Process',
  description:
    'Step-by-step instructions for enrolling your child at Cactus Wren Cooperative Preschool, including the application form, registration fee, and enrollment packet.',
}

const steps = [
  {
    title: 'Complete the Application Form',
    body: (
      <>
        Complete the{' '}
        <a href={docs.applicationForm} target="_blank" rel="noopener noreferrer">
          Application Form
        </a>{' '}
        and submit it to {contact.director}.
      </>
    ),
  },
  {
    title: 'Wait for your confirmation email',
    body: <>We will follow up to confirm your application.</>,
  },
  {
    title: 'Pay the $50 Registration Fee',
    body: <>An email will be sent to you with instructions and an invoice.</>,
  },
  {
    title: 'Receive class placement',
    body: (
      <>
        We will process your admission and update you with class placement within{' '}
        <strong>72 hours</strong> of receiving payment and the application form. If a slot is not
        available in your preferred class, we will offer to place you on our waiting list.
      </>
    ),
  },
  {
    title: 'Complete the Enrollment Packet',
    body: (
      <>
        Download the{' '}
        <a href={docs.enrollmentPacket} target="_blank" rel="noopener noreferrer">
          Enrollment Packet
        </a>{' '}
        and fill in all details. (The Religious Exemption Form at the end of the packet is
        optional.) Email the completed packet and a current Vaccination Record to{' '}
        <a href={`mailto:${contact.directorEmail}`}>{contact.directorEmail}</a>.
      </>
    ),
  },
]

export default function EnrollmentProcessPage() {
  return (
    <>
      <PageHero
        eyebrow="Admissions"
        title="The Enrollment Process"
        subtitle="Cactus Wren accepts mid-year enrollments only when space is available."
      />

      <Section className="max-w-3xl">
        <p className="text-ink/75 leading-relaxed">
          New enrollments for the current school year stop the week we return from Spring Break. To
          register for Cactus Wren, please follow the steps below.
        </p>

        <ol className="mt-8 space-y-6">
          {steps.map((s, i) => (
            <li key={s.title} className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white font-bold">
                {i + 1}
              </span>
              <div>
                <h3 className="cw-heading text-lg text-ink">{s.title}</h3>
                <p className="mt-1 text-ink/70 leading-relaxed">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-10 rounded-2xl bg-cream p-6">
          <p className="text-ink/75 leading-relaxed">
            Before your child starts school, the enrollment packet provides us with important
            information about your child&apos;s emergency contacts, healthcare providers, allergies
            or other health issues, and shot records. You will also be asked to complete and sign an
            Adult Participation Contract and By-law Agreement to show that you understand your
            commitment as a member of Cactus Wren Cooperative Preschool.
          </p>
          <p className="mt-3 text-ink/75">
            If you have any additional questions regarding the registration process, please contact
            our Director, {contact.director}.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button href={docs.applicationForm} variant="accent" external>
            Application Form
          </Button>
          <Button href={docs.enrollmentPacket} variant="outline" external>
            Enrollment Packet
          </Button>
        </div>
      </Section>
    </>
  )
}

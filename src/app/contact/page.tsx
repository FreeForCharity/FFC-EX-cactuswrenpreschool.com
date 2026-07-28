import React from 'react'
import type { Metadata } from 'next'
import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi'
import { FaFacebook } from 'react-icons/fa'
import PageHero from '@/components/ui/PageHero'
import Section from '@/components/ui/Section'
import Button from '@/components/ui/Button'
import { contact } from '@/lib/cw'

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Contact Cactus Wren Cooperative Preschool in Sierra Vista, Arizona. Find our address, phone number, email, and hours of operation.',
}

const hours = [
  ['Sunday', 'Closed'],
  ['Monday', 'Closed'],
  ['Tuesday', '8:00 am – 1:00 pm'],
  ['Wednesday', '8:00 am – 1:00 pm'],
  ['Thursday', '8:00 am – 1:00 pm'],
  ['Friday', 'Closed'],
  ['Saturday', 'Closed'],
]

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Contact Us"
        subtitle="We look forward to hearing from you!"
      />

      <Section className="grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="cw-display text-2xl text-primary">Get in Touch</h2>
          <div className="mt-5 space-y-4 text-ink/80">
            <p className="flex items-start gap-3">
              <FiMapPin className="mt-1 text-primary shrink-0" aria-hidden="true" />
              <span>
                The Preschool is located at {contact.venue}
                <br />
                {contact.street}
                <br />
                {contact.city}, {contact.state} {contact.zip}
              </span>
            </p>
            <p className="flex items-center gap-3">
              <FiPhone className="text-primary shrink-0" aria-hidden="true" />
              <a href={contact.phoneHref} className="hover:text-accent font-semibold">
                {contact.phone}
              </a>
            </p>
            <p className="flex items-center gap-3">
              <FiMail className="text-primary shrink-0" aria-hidden="true" />
              <a
                href={`mailto:${contact.email}`}
                className="hover:text-accent font-semibold break-all"
              >
                {contact.email}
              </a>
            </p>
            <p className="flex items-center gap-3">
              <FaFacebook className="text-primary shrink-0" aria-hidden="true" />
              <a
                href={contact.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent font-semibold"
              >
                Follow us on Facebook
              </a>
            </p>
          </div>

          <div className="mt-8 rounded-2xl bg-cream p-6">
            <h3 className="cw-heading text-lg text-primary">Summer Hours of Operation</h3>
            <p className="mt-2 text-sm text-ink/70">
              We do not hold routine office hours during the summer; however, we are reachable via{' '}
              <a href={`mailto:${contact.email}`} className="text-primary font-semibold underline">
                email
              </a>{' '}
              and through Facebook. We look forward to answering any questions you may have.
            </p>
          </div>

          <div className="mt-6">
            <Button href={`mailto:${contact.email}`} variant="accent">
              Send Us an Email
            </Button>
          </div>
        </div>

        <div>
          <h2 className="cw-display text-2xl text-primary">Hours of Operation</h2>
          <dl className="mt-4 divide-y divide-black/5 rounded-2xl bg-paper ring-1 ring-black/5">
            {hours.map(([day, time]) => (
              <div key={day} className="flex justify-between px-5 py-2.5 text-sm">
                <dt className="font-semibold text-ink">{day}</dt>
                <dd className="text-ink/70">{time}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>
    </>
  )
}

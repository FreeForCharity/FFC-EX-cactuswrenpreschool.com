import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/ui/PageHero'
import Section from '@/components/ui/Section'
import { contact } from '@/lib/cw'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Terms governing use of the Cactus Wren Cooperative Preschool website, including limits on what information here can be relied on.',
}

export default function TermsOfServicePage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms of Service" />

      <Section className="max-w-3xl">
        <div className="cw-prose text-ink/75">
          <p className="text-sm text-ink/50">Effective date: August 2026</p>

          <h2 className="cw-heading text-xl text-primary mt-6">Scope of These Terms</h2>
          <p>
            These terms cover your use of <strong>this website</strong>. They are deliberately
            narrow.
          </p>
          <p>
            They are <strong>not</strong> the terms of your child&rsquo;s enrolment. Enrolment,
            tuition, attendance, withdrawal, refunds, the cooperative work commitment, and every
            other part of the relationship between a family and the preschool are governed by the
            enrolment agreement and preschool handbook you receive when you enrol. If anything on
            this website appears to conflict with those documents,{' '}
            <strong>those documents control</strong>.
          </p>

          <h2 className="cw-heading text-xl text-primary mt-6">About Us</h2>
          <p>
            Cactus Wren Cooperative Preschool is a secular, play-based, non-profit cooperative
            preschool in Sierra Vista, Arizona, serving children ages 3 to 5 since 1979.
          </p>

          <h2 className="cw-heading text-xl text-primary mt-6">Using This Site</h2>
          <p>
            You are welcome to read, print, and share this site&rsquo;s pages for your own
            non-commercial use&nbsp;&mdash; for example, to share information about the preschool
            with your family or another prospective family.
          </p>
          <p>Please do not:</p>
          <ul>
            <li>Use the site for any unlawful purpose</li>
            <li>Attempt to gain unauthorised access to the site or any related system</li>
            <li>
              Copy the site&rsquo;s content, photographs, or branding to present it as your own
            </li>
            <li>Use automated tools in a way that disrupts the site for other visitors</li>
          </ul>

          <h2 className="cw-heading text-xl text-primary mt-6">
            Accuracy of Information &mdash; Please Read
          </h2>
          <p>
            We work to keep this site current, but details change during the year. Tuition rates,
            class schedules, calendar dates, staffing, enrolment openings, and policy documents are
            all subject to change.
          </p>
          <p>
            <strong>
              Please confirm anything you intend to rely on&nbsp;&mdash; especially dates, fees, and
              availability&nbsp;&mdash; directly with the preschool
            </strong>{' '}
            before acting on it. Contact details are at the bottom of every page.
          </p>

          <h2 className="cw-heading text-xl text-primary mt-6">Photographs</h2>
          <p>
            Photographs on this site are published with permission. If you believe an image of your
            child has been published in error, please contact us and we will remove it promptly.
          </p>

          <h2 className="cw-heading text-xl text-primary mt-6">Links to Other Sites</h2>
          <p>
            This site links to services the preschool uses or recommends&nbsp;&mdash; for example
            Procare for enrolment, state licensing resources, and our Facebook page. We do not
            control those sites and are not responsible for their content or their handling of your
            information. Their own terms and privacy policies apply once you leave this site.
          </p>

          <h2 className="cw-heading text-xl text-primary mt-6">Privacy and Cookies</h2>
          <p>
            How we handle information is described in our{' '}
            <Link href="/privacy-policy" className="text-primary underline">
              Privacy Policy
            </Link>{' '}
            and{' '}
            <Link href="/cookie-policy" className="text-primary underline">
              Cookie Policy
            </Link>
            . Health requirements for attendance are described in our{' '}
            <Link href="/health-policy" className="text-primary underline">
              Health Policy
            </Link>
            .
          </p>

          <h2 className="cw-heading text-xl text-primary mt-6">No Warranty</h2>
          <p>
            This website is provided as-is. We do not warrant that it will be uninterrupted or
            error-free, or that the information on it is complete or current at any given moment.
          </p>

          <h2 className="cw-heading text-xl text-primary mt-6">Limitation of Liability</h2>
          <p>
            To the extent permitted by Arizona law, Cactus Wren Cooperative Preschool is not liable
            for indirect or consequential losses arising from your use of this website. Nothing in
            these terms limits any liability that cannot lawfully be limited, and nothing here
            affects rights or obligations under your enrolment agreement.
          </p>

          <h2 className="cw-heading text-xl text-primary mt-6">Changes</h2>
          <p>
            We may update these terms as the site changes. The effective date above shows when they
            were last revised.
          </p>

          <h2 className="cw-heading text-xl text-primary mt-6">Governing Law</h2>
          <p>These terms are governed by the laws of the State of Arizona.</p>

          <h2 className="cw-heading text-xl text-primary mt-6">Contact</h2>
          <p>Questions about these terms, or about anything on this site:</p>
          <p>
            <a href={`mailto:${contact.email}`} className="text-primary underline">
              {contact.email}
            </a>
            <br />
            <a href={contact.phoneHref} className="text-primary underline">
              {contact.phone}
            </a>
          </p>
        </div>
      </Section>
    </>
  )
}

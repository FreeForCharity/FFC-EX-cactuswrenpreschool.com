import React from 'react'
import type { Metadata } from 'next'
import PageHero from '@/components/ui/PageHero'
import Section from '@/components/ui/Section'
import { contact } from '@/lib/cw'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for the Cactus Wren Cooperative Preschool website.',
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero eyebrow="Privacy" title="Privacy Policy" />

      <Section className="max-w-3xl">
        <div className="cw-prose text-ink/75">
          <p className="text-sm text-ink/50">Effective date: June 2026</p>

          <h2 className="cw-heading text-xl text-primary mt-6">Overview</h2>
          <p>
            Cactus Wren Cooperative Preschool (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or
            &ldquo;our&rdquo;) respects your privacy. This website is an informational site for our
            preschool. We do not sell or rent personal information, and we collect only what is
            necessary to respond to your inquiries.
          </p>

          <h2 className="cw-heading text-xl text-primary mt-6">Information We Collect</h2>
          <p>
            This website does not require you to create an account or submit personal information to
            browse. If you contact us by email or phone using the details on this site, we receive
            the information you choose to share (such as your name, email address, phone number, and
            message) so that we can respond to you.
          </p>

          <h2 className="cw-heading text-xl text-primary mt-6">How We Use Information</h2>
          <p>
            We use the information you provide solely to respond to your questions, process
            enrollment inquiries, and communicate with current and prospective families. Enrollment
            and student records collected through our enrollment process and the Procare platform
            are used only for the operation of the preschool and are not shared except as required
            to provide care or as required by law.
          </p>

          <h2 className="cw-heading text-xl text-primary mt-6">Children&apos;s Privacy</h2>
          <p>
            This website is directed at parents and guardians, not children. We do not knowingly
            collect personal information from children through this website.
          </p>

          <h2 className="cw-heading text-xl text-primary mt-6">Third-Party Links</h2>
          <p>
            Our site links to third-party resources (for example, Procare, Quality First Arizona,
            and state agencies). We are not responsible for the privacy practices of those external
            sites; please review their policies directly.
          </p>

          <h2 className="cw-heading text-xl text-primary mt-6">Contact Us</h2>
          <p>
            If you have questions about this privacy policy, please contact us at{' '}
            <a href={`mailto:${contact.email}`}>{contact.email}</a> or {contact.phone}.
          </p>
        </div>
      </Section>
    </>
  )
}

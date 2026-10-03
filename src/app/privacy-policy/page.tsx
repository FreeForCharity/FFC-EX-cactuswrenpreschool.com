import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
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
          <p className="text-sm text-ink/50">Effective date: August 30, 2026</p>

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

          <h2 className="cw-heading text-xl text-primary mt-6">
            Your Rights in the European Union, United Kingdom, and EEA (GDPR)
          </h2>
          <p>
            If you visit from the European Union, the United Kingdom, or the wider European Economic
            Area, the EU General Data Protection Regulation (GDPR) or the UK GDPR applies to our
            handling of your personal data, and this section supplements the rest of this policy.
          </p>
          <p>
            This website sets no analytics or advertising cookies and loads no third-party tracking
            scripts, for any visitor in any region. The only cookie it sets remembers the choice you
            make in the cookie banner; our{' '}
            <Link href="/cookie-policy" className="text-primary underline">
              Cookie Policy
            </Link>{' '}
            lists it. If analytics are ever added, they will load only after you allow the matching
            category in the banner &mdash; everywhere in the world, not only where the GDPR requires
            it.
          </p>
          <p>
            We process personal data you send us (an email or a phone call) on the basis of our
            legitimate interest in responding to you and operating the preschool, or with your
            consent. You have the right to: access the personal data we hold about you; have
            inaccurate data rectified; have your data erased; restrict or object to processing;
            receive your data in a portable format; and withdraw any consent you have given, at any
            time. Contact us using the details below to exercise any of these rights; we will
            respond within the time limits the GDPR sets. You also have the right to lodge a
            complaint with your national data protection supervisory authority (in the UK, the
            Information Commissioner&rsquo;s Office).
          </p>

          <h2 className="cw-heading text-xl text-primary mt-6">
            Your California Privacy Rights (CCPA/CPRA)
          </h2>
          <p>
            If you are a California resident, the California Consumer Privacy Act, as amended by the
            California Privacy Rights Act (CCPA/CPRA), gives you specific rights, and this section
            supplements the rest of this policy.
          </p>
          <p>
            <strong>We do not sell or share your personal information</strong> as those terms are
            defined by California law, and we have not done so in the preceding 12 months. We do not
            knowingly collect the personal information of anyone under 16 through this website, and
            we do not collect sensitive personal information beyond what you choose to send us.
          </p>
          <p>
            You have the right to: know what personal information we collect, use, and disclose, and
            to access it; delete personal information we collected from you; correct inaccurate
            personal information; opt out of any sale or sharing of personal information (not
            applicable, since we do neither); limit the use of sensitive personal information; and
            not be discriminated against for exercising any of these rights. Contact us using the
            details below; we will verify your request using information associated with your
            interactions with us, you may use an authorized agent, and we will respond within the
            timeframes California law requires.
          </p>
          <p>
            <strong>Opt-out preference signals (Global Privacy Control / Do Not Track).</strong>{' '}
            This site does not read or respond to the Global Privacy Control or Do Not Track browser
            signals. We do not sell or share personal information, and no analytics or advertising
            cookies are set for any visitor, so there is nothing for those signals to opt out of.
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

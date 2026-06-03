import React from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import PageHero from '@/components/ui/PageHero'
import Section from '@/components/ui/Section'
import Button from '@/components/ui/Button'
import { assetPath } from '@/lib/assetPath'
import { contact, img, links, docs } from '@/lib/cw'

export const metadata: Metadata = {
  title: 'Enrollment 2026-2027',
  description:
    'Register your student with Cactus Wren Cooperative Preschool through Procare. General registration for the 2026-2027 school year opens March 24, 2026.',
}

export default function EnrollmentPage() {
  return (
    <>
      <PageHero
        eyebrow="Enrollment 2026-2027"
        title="Register Your Student with Procare"
        subtitle="Our school management platform for communication, payments, and more."
      />

      <Section className="max-w-3xl">
        <div className="flex flex-col items-center text-center">
          <Image
            src={assetPath(img.procareLogo)}
            alt="Procare Solutions logo"
            width={300}
            height={76}
            className="h-14 w-auto"
          />
        </div>
        <div className="cw-prose mt-8 text-ink/75">
          <p>
            Cactus Wren is excited to announce that we utilize{' '}
            <a href={links.procare} target="_blank" rel="noopener noreferrer">
              Procare
            </a>{' '}
            as our school management platform. Procare allows parents to communicate directly with
            teachers, make tuition payments, and much more. You must be invited through the school
            to create an account that is linked to your student. Once your student is enrolled,
            download the app on your mobile device or view the website from your desktop, laptop,
            iPad, or Android tablet.
          </p>
          <p className="font-semibold text-ink">
            Registration with Procare is not required prior to enrolling your student with Cactus
            Wren.
          </p>
        </div>

        {/* App store badges */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <a href={links.procareAppStore} target="_blank" rel="noopener noreferrer">
            <Image
              src={assetPath(img.appStore)}
              alt="Download Procare on the App Store"
              width={180}
              height={57}
              className="h-12 w-auto"
            />
          </a>
          <a href={links.procareGooglePlay} target="_blank" rel="noopener noreferrer">
            <Image
              src={assetPath(img.googlePlay)}
              alt="Get Procare on Google Play"
              width={180}
              height={57}
              className="h-12 w-auto"
            />
          </a>
        </div>
      </Section>

      <Section muted className="max-w-3xl">
        <h2 className="cw-display text-2xl text-primary">Getting Started</h2>
        <div className="cw-prose mt-4 text-ink/75">
          <p>
            Getting the registration process started is simple. Use the button below to enter your
            child&apos;s basic information; your inquiry will automatically generate into the
            software. Once your registration request is received, you will be contacted via the
            phone number and/or e-mail address you provided.
          </p>
          <p>
            General registration for the 2026-2027 school year opens on{' '}
            <strong>March 24th, 2026</strong>. It is strongly suggested that you schedule a tour
            with your child or speak with our Director, {contact.director}, before enrolling. Cactus
            Wren does allow mid-year enrollments based on availability. We stop accepting new
            enrollments for the current school year after Spring Break.
          </p>
          <p>
            Completing online enrollment through Procare does not guarantee your student a spot at
            Cactus Wren Preschool. Once you submit your application you will be contacted by the
            school to discuss current availability. Should you wish to proceed, there is a
            non-refundable <strong>$50 Registration Fee</strong> to secure your space.
          </p>
          <p>
            Please allow up to 3 business days to process online enrollment requests and expect a
            phone call to ensure the class you selected is the most appropriate fit for your
            child&apos;s age, development, and experience. If it has been longer than 3 business
            days, please reach out to {contact.director} at{' '}
            <a href={`mailto:${contact.directorEmail}`}>{contact.directorEmail}</a> or by phone at{' '}
            {contact.phone}.
          </p>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href={docs.applicationForm} variant="accent" external>
            Application Form
          </Button>
          <Button href="/enrollment-process" variant="outline">
            View the Enrollment Process
          </Button>
        </div>
      </Section>
    </>
  )
}

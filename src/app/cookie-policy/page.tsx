import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/ui/PageHero'
import Section from '@/components/ui/Section'
import { contact } from '@/lib/cw'
import CookiePreferencesButton from '@/components/cookie-consent/CookiePreferencesButton'

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description:
    'How the Cactus Wren Cooperative Preschool website uses cookies, and how to change your choices.',
}

export default function CookiePolicyPage() {
  return (
    <>
      <PageHero eyebrow="Privacy" title="Cookie Policy" />

      <Section className="max-w-3xl">
        <div className="cw-prose text-ink/75">
          <p className="text-sm text-ink/50">Effective date: August 2026</p>

          <h2 className="cw-heading text-xl text-primary mt-6">What Cookies Are</h2>
          <p>
            Cookies are small text files a website stores on your device. They are widely used to
            make sites work, to remember choices you have made, and&nbsp;&mdash; when you allow
            it&nbsp;&mdash; to help the site&rsquo;s owners understand how the site is being used.
          </p>
          <p>
            Some cookies last only until you close your browser (&ldquo;session&rdquo; cookies).
            Others stay on your device until they expire or you delete them
            (&ldquo;persistent&rdquo; cookies).
          </p>

          <h2 className="cw-heading text-xl text-primary mt-6">
            What This Site Actually Sets Today
          </h2>
          <p>
            We want to be straightforward about this rather than list every cookie a website{' '}
            <em>might</em> use. At present this site sets exactly one cookie, and it exists only
            because you were asked about cookies:
          </p>
          <table className="w-full text-sm my-4">
            <thead>
              <tr className="text-left border-b border-ink/15">
                <th className="py-2 pr-4 font-semibold text-ink/80">Name</th>
                <th className="py-2 pr-4 font-semibold text-ink/80">Purpose</th>
                <th className="py-2 font-semibold text-ink/80">Lasts</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-ink/10">
                <td className="py-2 pr-4 align-top font-mono text-xs">cookie-consent</td>
                <td className="py-2 pr-4 align-top">
                  Remembers the choice you made in the cookie banner, so you are not asked again on
                  every page. A copy is also kept in your browser&rsquo;s local storage.
                </td>
                <td className="py-2 align-top">1 year</td>
              </tr>
            </tbody>
          </table>
          <p>
            This cookie is <strong>necessary</strong>: without it we could not honour your choice.
            It contains only your preference settings. It does not identify you, and it is not
            shared with anyone.
          </p>
          <p>
            <strong>We do not currently run analytics or advertising on this site.</strong> No
            Google Analytics, no Meta Pixel, no Microsoft Clarity. If you accept every category in
            the banner today, nothing further is loaded, because there is nothing to load.
          </p>

          <h2 className="cw-heading text-xl text-primary mt-6">
            What Would Change If We Add Analytics
          </h2>
          <p>
            The preschool may in future add basic analytics to understand which pages families find
            useful. The site is already built so that this cannot happen behind your back: analytics
            and marketing scripts load <em>only</em> after you have allowed the matching category in
            the cookie banner.
          </p>
          <p>The categories in that banner are:</p>
          <ul>
            <li>
              <strong>Necessary</strong> &mdash; always active. The consent cookie described above.
            </li>
            <li>
              <strong>Functional</strong> &mdash; always active. Cookies needed by features you
              actively use, such as an embedded donation or application form.
            </li>
            <li>
              <strong>Analytics</strong> &mdash; off unless you allow it. Would tell us which pages
              are visited and for how long, in aggregate.
            </li>
            <li>
              <strong>Marketing</strong> &mdash; off unless you allow it. Used to measure whether
              people who see one of our posts go on to visit the site.
            </li>
          </ul>
          <p>
            If you later withdraw consent, the site deletes the analytics and marketing cookies it
            set.
          </p>

          <h2 className="cw-heading text-xl text-primary mt-6">Third-Party Content</h2>
          <p>
            Some pages link out to services the preschool uses&nbsp;&mdash; for example Procare for
            enrolment, or our Facebook page. Once you follow a link to another company&rsquo;s site,
            that company&rsquo;s own cookie and privacy practices apply, not ours. We have no
            control over what they set.
          </p>

          <h2 className="cw-heading text-xl text-primary mt-6">Changing Your Choice</h2>
          <p>
            You can change your mind at any time. Reopening the cookie settings does not lose
            anything else about your visit.
          </p>
          <p className="not-prose my-4">
            <CookiePreferencesButton />
          </p>
          <p>
            You can also clear or block cookies in your browser settings. Blocking the necessary
            cookie means you will be asked about cookies again on each visit.
          </p>

          <h2 className="cw-heading text-xl text-primary mt-6">Children&rsquo;s Privacy</h2>
          <p>
            This website is written for parents and guardians, not for children. We do not knowingly
            collect personal information from children through this site. See our{' '}
            <Link href="/privacy-policy" className="text-primary underline">
              Privacy Policy
            </Link>{' '}
            for more.
          </p>

          <h2 className="cw-heading text-xl text-primary mt-6">Questions</h2>
          <p>
            If anything here is unclear, please ask&nbsp;&mdash; we would rather explain it than
            have you guess.
          </p>
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

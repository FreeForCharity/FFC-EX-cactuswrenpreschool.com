import React from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import PageHero from '@/components/ui/PageHero'
import Section from '@/components/ui/Section'
import { assetPath } from '@/lib/assetPath'
import { img } from '@/lib/cw'

export const metadata: Metadata = {
  title: 'Volunteering',
  description:
    'As a cooperative preschool, Cactus Wren relies on the involvement of our members. Learn the many ways families can volunteer their time and talents.',
}

const groups = [
  {
    title: 'Help with Events',
    items: [
      'Trunk-or-Treat, Holiday Program, Spring Potluck, Graduation, and more',
      'Planning (under the direction of the Vice-President)',
      'Setting up for the event',
      'Running activity stations',
      'Donating potluck items and supplies',
      'Cleaning up after an event',
    ],
  },
  {
    title: 'Support the Classroom',
    items: [
      'Bring in supplies as needed/requested by your student’s teacher',
      'Become an official Parent Volunteer and serve as a substitute Teacher’s Aide',
      'Help teachers prepare activities and classwork',
      'Cutting out lamination',
      'Assembling craft packets',
    ],
  },
  {
    title: 'Provide Services',
    items: [
      'Photography at events',
      'Being a guest speaker at board meetings',
      "Presenting during Community Helpers' week",
    ],
  },
]

export default function VolunteeringPage() {
  return (
    <>
      <PageHero
        eyebrow="Volunteering"
        title="Volunteering at Cactus Wren"
        subtitle="All volunteering efforts are highly encouraged and valued."
      />

      <Section className="max-w-3xl">
        <div className="flex justify-center mb-8">
          <Image
            src={assetPath(img.helpingHand)}
            alt="Helping Hand volunteer badge"
            width={160}
            height={166}
            className="h-32 w-auto"
          />
        </div>
        <p className="text-lg text-ink/75 leading-relaxed text-center">
          As a cooperative preschool, Cactus Wren relies on the involvement of our members to keep
          the school running smoothly. Volunteering can take many forms — here are just a few of the
          ways you can help.
        </p>
      </Section>

      <Section muted>
        <div className="grid gap-6 md:grid-cols-3">
          {groups.map((g) => (
            <div key={g.title} className="rounded-2xl bg-paper p-6 shadow-sm ring-1 ring-black/5">
              <h3 className="cw-heading text-lg text-primary">{g.title}</h3>
              <ul className="mt-3 space-y-2 text-sm text-ink/70 list-disc list-inside">
                {g.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>
    </>
  )
}

import React from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import PageHero from '@/components/ui/PageHero'
import Section from '@/components/ui/Section'
import Button from '@/components/ui/Button'
import { assetPath } from '@/lib/assetPath'
import { img, links, docs } from '@/lib/cw'

export const metadata: Metadata = {
  title: 'Curriculum',
  description:
    'Cactus Wren uses the Arizona Early Learning Standards and the Learning Dynamics program in a child-centered, play-based environment emphasizing social, emotional, cognitive, and physical development.',
}

const areas = [
  {
    title: 'Social Development',
    icon: img.devSocial,
    items: ['Free Play', 'Dramatic Play', 'Group Interaction', 'Sharing', 'Listening Skills'],
  },
  {
    title: 'Emotional Development',
    icon: img.devEmotional,
    items: [
      'Positive Self-Image',
      'Hands-On Learning',
      'Fun & Enjoyment',
      'Creativity',
      'Imagination',
    ],
  },
  {
    title: 'Cognitive Development',
    icon: img.devCognitive,
    items: [
      'Math & Science',
      'Arts & Crafts',
      'Thematic Units',
      'Circle Time',
      'Language Experiences',
    ],
  },
  {
    title: 'Physical Development',
    icon: img.devPhysical,
    items: ['Discovery', 'Coordination', 'Exercises', 'Dancing', 'Snack Time'],
  },
]

export default function CurriculumPage() {
  return (
    <>
      <PageHero
        eyebrow="Curriculum"
        title="Program Curriculum, Emphasis & Activities"
        subtitle="A child-centered, play-based learning environment."
      />

      <Section className="max-w-3xl text-center">
        <p className="text-lg text-ink/75 leading-relaxed">
          Cactus Wren Cooperative Preschool uses the Arizona Early Learning Standards as the basis
          for our curriculum. We teach letter names and sounds using the Learning Dynamics program
          and provide a child-centered, play-based learning environment. During the school year we
          place an emphasis on the following areas and activities.
        </p>
      </Section>

      <Section muted>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {areas.map((a) => (
            <div
              key={a.title}
              className="rounded-2xl bg-paper p-6 text-center shadow-sm ring-1 ring-black/5"
            >
              <div className="relative mx-auto h-20 w-20">
                <Image
                  src={assetPath(a.icon)}
                  alt={a.title}
                  fill
                  sizes="80px"
                  className="object-contain"
                />
              </div>
              <h3 className="cw-heading text-lg text-primary mt-4">{a.title}</h3>
              <ul className="mt-3 space-y-1 text-sm text-ink/70">
                {a.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="text-center mt-8 text-ink/70">And so much more!</p>
      </Section>

      <Section className="text-center">
        <h2 className="cw-display text-2xl text-primary">Learn Even More</h2>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button href={links.azEarlyLearningSite} variant="primary" external>
            AZ Early Learning Standards
          </Button>
          <Button href={docs.azEarlyLearning} variant="outline" external>
            Standards (PDF)
          </Button>
          <Button href={links.learningDynamics} variant="outline" external>
            Learning Dynamics
          </Button>
        </div>
      </Section>
    </>
  )
}

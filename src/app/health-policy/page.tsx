import React from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import PageHero from '@/components/ui/PageHero'
import Section from '@/components/ui/Section'
import { assetPath } from '@/lib/assetPath'
import { img } from '@/lib/cw'

export const metadata: Metadata = {
  title: 'Health Policy',
  description:
    'Cactus Wren Cooperative Preschool health policy: symptoms for which a child should be kept home, and our procedures for keeping students and staff healthy.',
}

const symptoms = [
  'Runny nose',
  'Sneezing',
  'Coughing',
  'Fever',
  'Rashes of any kind',
  'Abdominal pain',
  'Nausea',
  'Vomiting',
  'Diarrhea',
  'Marked loss of appetite',
  'Unusual irritability',
  'Listlessness',
  'Fatigue',
  'Swollen glands',
  'Sore throat',
  'Inflamed or draining eyes',
]

export default function HealthPolicyPage() {
  return (
    <>
      <PageHero
        eyebrow="Health Policy"
        title="Health Policy"
        subtitle="You know your child best — you are the key to our health program."
      />

      <Section className="max-w-3xl">
        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-8 ring-1 ring-black/5">
          <Image
            src={assetPath(img.littleDoctor)}
            alt="A child playing doctor"
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </div>

        <p className="text-ink/75 leading-relaxed">
          You are the one who knows your child best, so you are the key to our health program. We
          depend on parents to notice early signs and symptoms of illness. These are some symptoms
          for which a child should be kept home or sent home from school. If a child has{' '}
          <strong>2 or more</strong> of these symptoms, please keep your child home:
        </p>

        <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2 text-ink/80 sm:grid-cols-3">
          {symptoms.map((s) => (
            <li key={s} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent shrink-0" aria-hidden="true" />
              {s}
            </li>
          ))}
        </ul>

        <div className="cw-prose mt-8 text-ink/75">
          <p>
            Please keep your child at home when they have signs of a cold. A number of more
            contagious childhood diseases begin with the same symptoms as a cold. Colds are most
            contagious when they start, so the County Health Department advises that a child with
            cold-like symptoms be kept home until their temperature has been normal — or their
            symptoms have subsided — for twenty-four hours without medication that would
            artificially keep it down. The same applies to adults scheduled to work at the school.
          </p>
          <p>
            If a child arrives at school with any of the above symptoms, the teacher may send the
            child home. If symptoms appear after school starts, the child will be isolated until the
            parents can be reached. If a parent is not available, a person listed on your Emergency
            Information Card will be called and the child sent home with them. Our teachers have the
            ultimate decision as to who is well enough to remain in class.
          </p>
          <p className="font-semibold text-ink">
            Children must be picked up within 30 minutes of being contacted by a school employee.
          </p>
        </div>
      </Section>
    </>
  )
}

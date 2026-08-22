import React from 'react'
import type { Metadata } from 'next'
import PageHero from '@/components/ui/PageHero'
import Section from '@/components/ui/Section'
import PersonCard from '@/components/ui/PersonCard'
import Button from '@/components/ui/Button'
import { board, staff, contact } from '@/lib/cw'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Meet the board of directors and teaching staff of Cactus Wren Cooperative Preschool, and read a welcome from our Director.',
}

export default function AboutUsPage() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="Meet Our Team"
        subtitle="A dedicated staff and parent volunteers keeping the Cactus Wren legacy alive."
      />

      {/* Director's welcome */}
      <Section className="max-w-3xl">
        <h2 className="cw-display text-3xl text-primary">Director&apos;s Welcome</h2>
        <div className="cw-prose mt-4 text-ink/75">
          <p>
            Welcome to Cactus Wren Preschool! I&apos;m Taylor, and I&apos;m honored to serve as the
            Director of this warm and vibrant community. My journey in early childhood education
            began in my home state of Oregon, where I developed a deep love for nurturing young
            minds through hands-on work in daycares and preschools. After moving to Arizona in 2020,
            I expanded my experience by supporting children with special needs — an experience that
            shaped my inclusive and compassionate approach to education.
          </p>
          <p>
            At Cactus Wren, we believe in the power of play as the foundation for learning. Our
            play-based approach encourages children to explore, create, and problem-solve in ways
            that build confidence, curiosity, and a lifelong love of learning. More than a school,
            we are a community where families are welcomed, children are celebrated, and every voice
            matters.
          </p>
          <p>
            I invite you to join us and experience a preschool environment where your child will be
            seen, supported, and inspired to thrive.
          </p>
        </div>
      </Section>

      {/* Teaching staff */}
      <Section>
        <h2 className="cw-display text-3xl text-primary text-center mb-10">Teaching Staff</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {staff.map((p) => (
            <PersonCard key={p.name} person={p} />
          ))}
        </div>
      </Section>

      {/* Board of Directors */}
      <Section muted>
        <h2 className="cw-display text-3xl text-primary text-center mb-10">Board of Directors</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-6">
          {board.map((p, index) => (
            <div key={p.name} className={`lg:col-span-2 ${index === 3 ? 'lg:col-start-2' : ''}`}>
              <PersonCard person={p} />
            </div>
          ))}
        </div>
      </Section>

      {/* Apply / board seats */}
      <Section muted className="text-center max-w-2xl">
        <h2 className="cw-display text-3xl text-primary">Interested in a Board Seat?</h2>
        <p className="mt-4 text-ink/75">
          We welcome parents who want to get involved. To learn about filling a vacant board seat,
          contact our Director, {contact.director}, at {contact.phone}.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button href={`mailto:${contact.email}`} variant="accent">
            Email Us
          </Button>
        </div>
      </Section>
    </>
  )
}

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FiArrowRight, FiCheckCircle } from 'react-icons/fi'
import OrganizationSchema from '@/components/seo/OrganizationSchema'
import Section from '@/components/ui/Section'
import Button from '@/components/ui/Button'
import HeroCarousel from '@/components/ui/HeroCarousel'
import { assetPath } from '@/lib/assetPath'
import { contact, img } from '@/lib/cw'

const values = ['Quality', 'Positivity', 'Integrity', 'Teamwork', 'Stewardship', 'Professionalism']

const heroSlides = [
  {
    src: img.heroScience,
    alt: 'Preschoolers exploring a hands-on science activity at Cactus Wren',
  },
  { src: img.heroGroup, alt: 'A Cactus Wren class gathered on the rug with their teacher' },
  {
    src: img.classroom2,
    alt: 'Children learning through play at Cactus Wren Cooperative Preschool',
  },
  { src: img.heroRug, alt: 'A bright Cactus Wren classroom with an alphabet learning rug' },
  { src: img.classroom1, alt: 'Hands-on learning materials in a Cactus Wren classroom' },
]

const programs = [
  {
    title: '3-Day Preschool',
    age: 'Ages 3–5',
    when: 'Tue, Wed & Thu · 8:30 am – 12:30 pm',
    image: img.classroom1,
  },
  {
    title: '3-Day Pre-K',
    age: 'Ages 4–5',
    when: 'Tue, Wed & Thu · 8:30 am – 12:30 pm',
    image: img.classroom3,
  },
]

const Home = () => {
  return (
    <>
      <OrganizationSchema />

      {/* DES announcement banner */}
      <div className="bg-green text-white">
        <div className="ffc-container py-2.5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-sm font-semibold">
          <span>
            Cactus Wren Preschool is now a Contracted Provider with the Department of Economic
            Security!
          </span>
          <Link href="/scholarship-information" className="underline hover:text-yellow">
            Learn More
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="relative bg-cream overflow-hidden">
        <div className="ffc-container grid items-center gap-10 py-14 md:py-20 lg:grid-cols-2">
          <div>
            <p className="text-accent font-semibold uppercase tracking-wider text-sm">
              Established 1979 · Sierra Vista, Arizona
            </p>
            <h1 className="cw-display mt-3 text-4xl md:text-5xl lg:text-6xl text-primary-dark leading-tight">
              A Play-Based Preschool
            </h1>
            <p className="mt-5 text-lg text-ink/75 leading-relaxed">
              Cactus Wren Cooperative Preschool is a secular, non-profit preschool focused on
              hands-on learning. We offer an affordable, positive social experience for preschool
              children and their families — guided by a dedicated staff and parent volunteers.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button href="/enrollment" variant="accent">
                Enroll for 2026–2027
              </Button>
              <Button href="/about-us" variant="outline">
                Meet Our Team
              </Button>
            </div>
          </div>
          <div className="relative">
            <HeroCarousel slides={heroSlides} />
          </div>
        </div>
      </section>

      {/* Mission */}
      <Section className="text-center max-w-3xl">
        <h2 className="cw-display text-3xl text-primary">Our Mission</h2>
        <p className="mt-4 text-lg leading-relaxed text-ink/75">
          Cactus Wren Cooperative Preschool provides services that further the social, physical,
          emotional, and intellectual growth of the preschool child by providing him or her with
          regular association with other children their own age, under the guidance of trained
          teachers. We educate parents concerning the needs and growth of children and techniques
          for working with children through participation in the classroom and cooperative events.
        </p>
      </Section>

      {/* Programs */}
      <Section muted>
        <div className="text-center mb-10">
          <h2 className="cw-display text-3xl text-primary">Our Programs</h2>
          <p className="mt-3 text-ink/70">
            Small class sizes (max 15 students) with one professional teacher and a qualified aide.
          </p>
        </div>
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          {programs.map((p) => (
            <div
              key={p.title}
              className="flex flex-col rounded-2xl bg-paper shadow-sm ring-1 ring-black/5 overflow-hidden"
            >
              <div className="relative aspect-[16/10]">
                <Image
                  src={assetPath(p.image)}
                  alt={p.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 380px"
                  className="object-cover"
                />
              </div>
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-accent">{p.age}</p>
                <h3 className="cw-heading text-xl text-ink mt-1">{p.title}</h3>
                <p className="mt-2 text-sm text-ink/70">{p.when}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Button href="/class-schedules" variant="primary">
            View Class Schedules
          </Button>
        </div>
      </Section>

      {/* Enrollment CTA */}
      <Section>
        <div className="rounded-3xl bg-primary text-white px-6 py-12 md:px-12 text-center">
          <h2 className="cw-display text-3xl">Now Enrolling for 2026–2027</h2>
          <p className="mt-4 max-w-2xl mx-auto text-white/85 text-lg">
            We would love to have your child attend Cactus Wren. If you are interested in enrolling
            or receiving more information, please contact our Director, {contact.director}.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button href={`mailto:${contact.directorEmail}`} variant="accent">
              Email {contact.director}
            </Button>
            <Button
              href="/scholarship-information"
              variant="outline"
              className="!text-white !border-white hover:!bg-white hover:!text-primary"
            >
              Scholarship Information
            </Button>
          </div>
        </div>
      </Section>

      {/* Values + Vision */}
      <Section muted>
        <div className="grid gap-10 lg:grid-cols-2 items-start">
          <div>
            <h2 className="cw-display text-3xl text-primary">Our Values</h2>
            <p className="mt-3 text-ink/70">
              As a nonprofit corporation, Cactus Wren exists to serve the public interest. Our
              members — parents, the board of directors, and staff — value:
            </p>
            <ul className="mt-5 grid grid-cols-2 gap-3">
              {values.map((v) => (
                <li key={v} className="flex items-center gap-2 font-semibold text-ink/80">
                  <FiCheckCircle className="text-green shrink-0" aria-hidden="true" /> {v}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="cw-display text-3xl text-primary">Our Vision</h2>
            <p className="mt-3 text-ink/70 leading-relaxed">
              Cactus Wren Cooperative Preschool is regarded by the community, and by local and state
              educational institutions, as the premier preparatory school for prekindergarten-level
              children — offering opportunities for social and educational development in preschool
              settings.
            </p>
            <ul className="mt-4 space-y-2 text-ink/70">
              <li className="flex gap-2">
                <FiArrowRight className="text-accent mt-1 shrink-0" aria-hidden="true" /> Parents
                love our programs and recommend us to their friends.
              </li>
              <li className="flex gap-2">
                <FiArrowRight className="text-accent mt-1 shrink-0" aria-hidden="true" />{' '}
                Kindergarten teachers respect and appreciate the performance of our former
                preschoolers.
              </li>
              <li className="flex gap-2">
                <FiArrowRight className="text-accent mt-1 shrink-0" aria-hidden="true" /> We are
                faithful in our mission to serve the public interest.
              </li>
            </ul>
          </div>
        </div>
      </Section>
    </>
  )
}

export default Home

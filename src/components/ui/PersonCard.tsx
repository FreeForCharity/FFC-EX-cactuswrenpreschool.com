import React from 'react'
import Image from 'next/image'
import { FiMail } from 'react-icons/fi'
import { assetPath } from '@/lib/assetPath'
import type { Person } from '@/lib/cw'

/** Profile card for a board member or staff member. */
const PersonCard: React.FC<{ person: Person }> = ({ person }) => {
  return (
    <div className="flex flex-col rounded-2xl bg-paper shadow-sm ring-1 ring-black/5 overflow-hidden">
      <div className="relative aspect-[4/5] bg-cream">
        {person.photo ? (
          <Image
            src={assetPath(person.photo)}
            alt={`${person.name}, ${person.role}`}
            fill
            sizes="(max-width: 768px) 50vw, 300px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-5xl font-bold text-primary/30">
            {person.name.charAt(0)}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-accent">{person.role}</p>
        <h3 className="cw-heading text-lg text-ink">{person.name}</h3>
        {person.bio && <p className="mt-2 text-sm leading-relaxed text-ink/70">{person.bio}</p>}
        {person.email && (
          <a
            href={`mailto:${person.email}`}
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-accent"
          >
            <FiMail aria-hidden="true" /> {person.email}
          </a>
        )}
      </div>
    </div>
  )
}

export default PersonCard

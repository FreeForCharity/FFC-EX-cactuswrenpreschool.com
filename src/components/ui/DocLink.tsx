import React from 'react'
import { assetPath } from '@/lib/assetPath'
import { FiFileText, FiExternalLink } from 'react-icons/fi'

type DocLinkProps = {
  label: string
  href: string
  /** When true, the href is an external website rather than a hosted document. */
  external?: boolean
  note?: string
}

/**
 * A single document / link row. Internal PDF documents are routed through
 * assetPath() so they resolve on GitHub Pages subpath deploys; external sites
 * open in a new tab.
 */
const DocLink: React.FC<DocLinkProps> = ({ label, href, external, note }) => {
  const isExternal = external || href.startsWith('http')
  const resolved = isExternal ? href : assetPath(href)
  return (
    <a
      href={resolved}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 rounded-lg border border-black/10 bg-paper px-4 py-3 hover:border-primary hover:bg-primary/5 transition-colors"
    >
      <span className="text-primary shrink-0" aria-hidden="true">
        {isExternal ? <FiExternalLink size={20} /> : <FiFileText size={20} />}
      </span>
      <span className="flex-1">
        <span className="block font-semibold text-ink group-hover:text-primary">{label}</span>
        {note && <span className="block text-xs text-ink/60">{note}</span>}
      </span>
    </a>
  )
}

export default DocLink

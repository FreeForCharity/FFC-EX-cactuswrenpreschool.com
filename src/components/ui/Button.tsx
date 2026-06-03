import React from 'react'
import Link from 'next/link'

type ButtonProps = {
  href: string
  children: React.ReactNode
  variant?: 'primary' | 'accent' | 'outline'
  external?: boolean
  className?: string
}

const styles: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-primary text-white hover:bg-primary-dark',
  accent: 'bg-accent text-white hover:bg-primary',
  outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
}

/** Pill-style call-to-action link. Handles internal (Link) vs external (a). */
const Button: React.FC<ButtonProps> = ({
  href,
  children,
  variant = 'primary',
  external,
  className = '',
}) => {
  const cls = `inline-flex items-center justify-center rounded-full px-6 py-3 font-bold transition-colors shadow-sm ${styles[variant]} ${className}`
  if (
    external ||
    href.startsWith('http') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:')
  ) {
    const isHttp = href.startsWith('http')
    return (
      <a
        href={href}
        className={cls}
        {...(isHttp ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  )
}

export default Button

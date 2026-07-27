import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FaFacebook } from 'react-icons/fa'
import { FiAtSign, FiMail, FiMapPin, FiPhone } from 'react-icons/fi'
import { assetPath } from '@/lib/assetPath'
import { contact, img, nav } from '@/lib/cw'

const Footer: React.FC = () => {
  const year = new Date().getFullYear()
  return (
    <footer className="bg-primary-dark text-white/90 mt-16">
      <div className="ffc-container py-12 grid gap-10 md:grid-cols-3">
        {/* About */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Image
              src={assetPath(img.logo)}
              alt="Cactus Wren Cooperative Preschool logo"
              width={120}
              height={78}
              className="h-14 w-auto bg-white/95 rounded-lg p-1"
            />
            <span className="cw-display text-lg text-white">Cactus Wren</span>
          </div>
          <p className="text-sm leading-relaxed text-white/80">
            A secular, play-based, non-profit cooperative preschool serving Sierra Vista, Arizona
            since 1979. Affordable preschool and Pre-K for ages 3 to 5.
          </p>
          <a
            href={contact.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-yellow"
          >
            <FaFacebook aria-hidden="true" size={20} /> Follow us on Facebook
          </a>
        </div>

        {/* Quick links */}
        <div>
          <h2 className="cw-heading text-white text-base mb-4">Quick Links</h2>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            {nav
              .filter((i) => i.href !== '/')
              .map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-white/80 hover:text-yellow">
                    {item.label}
                  </Link>
                </li>
              ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h2 className="cw-heading text-white text-base mb-4">Contact Us</h2>
          <address className="not-italic space-y-3 text-sm">
            <p className="flex items-start gap-2">
              <FiMapPin aria-hidden="true" className="mt-0.5 shrink-0" />
              <span>
                <span className="font-semibold text-white">Physical school location</span>
                <br />
                {contact.venue}
                <br />
                {contact.street}
                <br />
                {contact.city}, {contact.state} {contact.zip}
              </span>
            </p>
            <p className="flex items-start gap-2">
              <FiMail aria-hidden="true" className="mt-0.5 shrink-0" />
              <span>
                <span className="font-semibold text-white">Mailing address</span>
                <br />
                Cactus Wren Preschool
                <br />
                PO Box 1112
                <br />
                Sierra Vista, AZ 85636
              </span>
            </p>
            <p className="flex items-center gap-2">
              <FiPhone aria-hidden="true" />
              <a href={contact.phoneHref} className="hover:text-yellow">
                {contact.phone}
              </a>
            </p>
            <p className="flex items-center gap-2">
              <FiAtSign aria-hidden="true" />
              <a href={`mailto:${contact.email}`} className="hover:text-yellow break-all">
                {contact.email}
              </a>
            </p>
          </address>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="ffc-container py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/70">
          <p>&copy; {year} Cactus Wren Cooperative Preschool. All rights reserved.</p>
          <p>A non-profit cooperative preschool &middot; Sierra Vista, Arizona</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

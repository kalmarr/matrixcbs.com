'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { fadeInUp, staggerContainer } from '@/lib/animations';

const footerLinks = {
  navigation: [
    { href: '/', label: 'Főoldal' },
    { href: '/szervezeti-kihivasok', label: 'Szervezeti Kihívások' },
    { href: '/megoldasaink', label: 'Megoldásaink' },
    { href: '/rolunk', label: 'Rólunk' },
    { href: '/kapcsolat', label: 'Kapcsolat' },
  ],
  legal: [
    { href: '/adatvedelem', label: 'Adatvédelmi tájékoztató' },
  ],
};

const companyInfo = {
  name: 'MATRIX CBS Kft.',
  registrationNumber: 'B/2020/000668',
  address: '6724 Szeged, Pulcz utca 3–2.',
  phone: '+36 70 327 2146',
  email: 'info@matrixcbs.com',
};

const partnerLinks = [
  { href: 'https://nyelvvizsga-szeged.hu/', label: 'Nyelvvizsga Szeged' },
  { href: 'https://mokka-apartman-szeged.hu/', label: 'Mokka Apartman Szeged' },
  { href: 'https://dozsa-apartman-szeged.hu/', label: 'Dózsa Apartman Szeged' },
];

const socialLinks = [
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/matrixcbs',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.77,7.46H14.5v-1.9c0-.9.6-1.1,1-1.1h3V.5h-4.33C10.24.5,9.5,3.44,9.5,5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4Z" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/company/matrixcbs',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19,3H5C3.895,3,3,3.895,3,5v14c0,1.105,0.895,2,2,2h14c1.105,0,2-0.895,2-2V5C21,3.895,20.105,3,19,3z M9,17H6.477v-7H9 V17z M7.694,8.717c-0.771,0-1.286-0.514-1.286-1.2s0.514-1.2,1.371-1.2c0.771,0,1.286,0.514,1.286,1.2S8.551,8.717,7.694,8.717z M18,17h-2.442v-3.826c0-1.058-0.651-1.302-0.895-1.302s-1.058,0.163-1.058,1.302c0,0.163,0,3.826,0,3.826h-2.523v-7h2.523v0.977 C13.93,10.407,14.581,10,15.802,10C17.023,10,18,10.977,18,13.174V17z" />
      </svg>
    ),
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--color-bg-primary)] border-t border-[var(--color-bg-tertiary)]">
      <div className="max-w-[var(--max-content-width)] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <motion.div
          className="py-12 lg:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {/* Company Info */}
          <motion.div variants={fadeInUp} className="lg:col-span-1">
            <Link href="/" className="flex items-center mb-4">
              <Image
                src="/logo/logo-final-transparent.png"
                alt="MATRIX CBS Kft."
                width={140}
                height={28}
                unoptimized
              />
            </Link>
            <p className="text-sm text-[var(--color-text-muted)] mb-4">
              Felnőttképzési intézmény - Szervezetfejlesztés, tréningek és tanácsadás
            </p>
            <p className="text-xs text-[var(--color-text-muted)]">
              Nyilvántartási szám: {companyInfo.registrationNumber}
            </p>
          </motion.div>

          {/* Navigation Links */}
          <motion.div variants={fadeInUp}>
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)] uppercase tracking-wider mb-4">
              Navigáció
            </h3>
            <ul className="space-y-3">
              {footerLinks.navigation.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      'text-sm text-[var(--color-text-muted)]',
                      'hover:text-[var(--color-accent-orange)]',
                      'transition-colors duration-[var(--transition-fast)]'
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={fadeInUp}>
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)] uppercase tracking-wider mb-4">
              Kapcsolat
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-[var(--color-text-muted)]">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{companyInfo.address}</span>
              </li>
              <li>
                <a
                  href={`tel:${companyInfo.phone.replace(/\s/g, '')}`}
                  className={cn(
                    'flex items-center gap-2 text-sm text-[var(--color-text-muted)]',
                    'hover:text-[var(--color-accent-orange)]',
                    'transition-colors duration-[var(--transition-fast)]'
                  )}
                >
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{companyInfo.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${companyInfo.email}`}
                  className={cn(
                    'flex items-center gap-2 text-sm text-[var(--color-text-muted)]',
                    'hover:text-[var(--color-accent-orange)]',
                    'transition-colors duration-[var(--transition-fast)]'
                  )}
                >
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{companyInfo.email}</span>
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Social & Legal */}
          <motion.div variants={fadeInUp}>
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)] uppercase tracking-wider mb-4">
              Kövessen minket
            </h3>
            <div className="flex gap-4 mb-6">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'p-2 rounded-[var(--radius-md)]',
                    'text-[var(--color-text-muted)]',
                    'bg-[var(--color-bg-secondary)]',
                    'hover:text-[var(--color-accent-orange)]',
                    'hover:bg-[var(--color-bg-tertiary)]',
                    'transition-colors duration-[var(--transition-fast)]'
                  )}
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      'text-sm text-[var(--color-text-muted)]',
                      'hover:text-[var(--color-accent-orange)]',
                      'transition-colors duration-[var(--transition-fast)]'
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Partner Links */}
          <motion.div variants={fadeInUp}>
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)] uppercase tracking-wider mb-4">
              Partnereink
            </h3>
            <ul className="space-y-3">
              {partnerLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'text-sm text-[var(--color-text-muted)]',
                      'hover:text-[var(--color-accent-orange)]',
                      'transition-colors duration-[var(--transition-fast)]'
                    )}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-[var(--color-bg-tertiary)]">
          <p className="text-center text-sm text-[var(--color-text-muted)]">
            &copy; {currentYear} {companyInfo.name}. Minden jog fenntartva.
          </p>
        </div>
      </div>
    </footer>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { menuSlide, fadeInDown } from '@/lib/animations';

const navLinks = [
  { href: '/', label: 'Főoldal' },
  { href: '/szervezeti-kihivasok', label: 'Szervezeti Kihívások' },
  { href: '/megoldasaink', label: 'Megoldásaink' },
  { href: '/rolunk', label: 'Rólunk' },
  { href: '/referenciak', label: 'Referenciák' },
  { href: '/gyik', label: 'GYIK' },
  { href: '/blog', label: 'Blog' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <motion.header
        className={cn(
          'fixed top-0 left-0 right-0 z-50',
          'h-[var(--header-height)]',
          'transition-all duration-[var(--transition-base)]',
          isScrolled
            ? 'bg-[var(--color-bg-dark)]/95 backdrop-blur-md shadow-[var(--shadow-md)]'
            : 'bg-transparent'
        )}
        initial="hidden"
        animate="visible"
        variants={fadeInDown}
      >
        <div className="max-w-[var(--max-content-width)] mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <nav className="flex items-center justify-between h-full">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center relative z-10"
              aria-label="MATRIX CBS Kft. - Főoldal"
            >
              {/* Mobile: Icon logo */}
              <Image
                src="/logo/Logo_ikon-mobile.png"
                alt="MATRIX CBS Kft."
                width={40}
                height={40}
                className="block sm:hidden w-10 h-10"
                priority
                unoptimized
              />
              {/* Desktop: Full logo */}
              <Image
                src="/logo/logo-final-transparent.png"
                alt="MATRIX CBS Kft."
                width={206}
                height={40}
                className="hidden sm:block"
                priority
                unoptimized
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative text-[var(--color-text-secondary)]',
                    'hover:text-[var(--color-text-primary)]',
                    'transition-colors duration-[var(--transition-fast)]',
                    'group'
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      'absolute -bottom-1 left-0 w-0',
                      'h-0.5 bg-gradient-to-r from-[var(--color-accent-red)] to-[var(--color-accent-orange)]',
                      'group-hover:w-full',
                      'transition-all duration-[var(--transition-base)]'
                    )}
                  />
                </Link>
              ))}
            </div>

            {/* CTA Button - Desktop */}
            <div className="hidden lg:block">
              <Link href="/kapcsolat">
                <Button variant="primary" size="sm">
                  Kapcsolat
                </Button>
              </Link>
            </div>

            {/* Mobile CTA - "Beszéljünk" button */}
            <Link href="/kapcsolat" className="lg:hidden">
              <Button variant="primary" size="sm">
                Beszéljünk
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className={cn(
                'lg:hidden relative z-10 p-3',
                'text-[var(--color-text-primary)]',
                'bg-[var(--color-bg-secondary)]/50',
                'hover:bg-[var(--color-bg-secondary)]',
                'rounded-[var(--radius-md)]',
                'transition-colors duration-[var(--transition-fast)]',
                'min-w-[44px] min-h-[44px] flex items-center justify-center'
              )}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? 'Menü bezárása' : 'Menü megnyitása'}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </nav>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Mobile Menu Panel */}
            <motion.div
              className={cn(
                'fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm lg:hidden',
                'bg-[var(--color-bg-primary)]',
                'shadow-[var(--shadow-lg)]'
              )}
              variants={menuSlide}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="flex flex-col h-full pt-24 pb-8 px-6">
                {/* Mobile Nav Links */}
                <nav className="flex flex-col gap-2">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={link.href}
                        className={cn(
                          'block py-3 px-4',
                          'text-lg text-[var(--color-text-secondary)]',
                          'hover:text-[var(--color-text-primary)]',
                          'hover:bg-[var(--color-bg-secondary)]',
                          'rounded-[var(--radius-md)]',
                          'transition-colors duration-[var(--transition-fast)]'
                        )}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                {/* Mobile CTA */}
                <div className="mt-auto pt-8">
                  <Link href="/kapcsolat" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="primary" fullWidth>
                      Kapcsolatfelvétel
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

const COOKIE_CONSENT_KEY = 'matrix-cbs-cookie-consent';

type ConsentState = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
};

const defaultConsent: ConsentState = {
  necessary: true, // Always required
  analytics: false,
  marketing: false,
};

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [consent, setConsent] = useState<ConsentState>(defaultConsent);

  // Check for existing consent on mount
  useEffect(() => {
    const storedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!storedConsent) {
      // Small delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    } else {
      // Apply stored consent to gtag
      try {
        const parsedConsent = JSON.parse(storedConsent) as ConsentState;
        window.gtag?.('consent', 'update', {
          analytics_storage: parsedConsent.analytics ? 'granted' : 'denied',
          ad_storage: parsedConsent.marketing ? 'granted' : 'denied',
          ad_user_data: parsedConsent.marketing ? 'granted' : 'denied',
          ad_personalization: parsedConsent.marketing ? 'granted' : 'denied',
        });
      } catch {
        // Invalid stored consent, show banner
        localStorage.removeItem(COOKIE_CONSENT_KEY);
        const timer = setTimeout(() => setIsVisible(true), 1000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const fullConsent: ConsentState = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    saveConsent(fullConsent);
  };

  const handleAcceptSelected = () => {
    saveConsent(consent);
  };

  const handleRejectAll = () => {
    saveConsent(defaultConsent);
  };

  const saveConsent = (consentState: ConsentState) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consentState));
    setIsVisible(false);

    // Update Google consent mode based on user choices
    window.gtag?.('consent', 'update', {
      analytics_storage: consentState.analytics ? 'granted' : 'denied',
      ad_storage: consentState.marketing ? 'granted' : 'denied',
      ad_user_data: consentState.marketing ? 'granted' : 'denied',
      ad_personalization: consentState.marketing ? 'granted' : 'denied',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={cn(
            'fixed bottom-0 left-0 right-0 z-50',
            'p-4 md:p-6',
            'bg-[var(--color-bg-primary)]',
            'border-t border-[var(--color-bg-tertiary)]',
            'shadow-[0_-10px_40px_rgba(0,0,0,0.3)]'
          )}
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="max-w-[var(--max-content-width)] mx-auto">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Content */}
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
                  Cookie beállítások
                </h2>
                <p className="text-sm text-[var(--color-text-muted)] mb-4">
                  Weboldalunk sütiket használ a felhasználói élmény javítására.
                  Kérjük, válassza ki, mely sütiket engedélyezi.{' '}
                  <Link
                    href="/adatvedelem"
                    className="text-[var(--color-accent-orange)] hover:underline"
                  >
                    Adatvédelmi tájékoztató
                  </Link>
                </p>

                {/* Details toggle */}
                <button
                  type="button"
                  onClick={() => setShowDetails(!showDetails)}
                  className={cn(
                    'text-sm text-[var(--color-accent-orange)]',
                    'hover:underline',
                    'flex items-center gap-1'
                  )}
                >
                  {showDetails ? 'Kevesebb részlet' : 'Több részlet'}
                  <svg
                    className={cn(
                      'w-4 h-4 transition-transform',
                      showDetails && 'rotate-180'
                    )}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Cookie Details */}
                <AnimatePresence>
                  {showDetails && (
                    <motion.div
                      className="mt-4 space-y-3"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      {/* Necessary */}
                      <label className="flex items-start gap-3 cursor-not-allowed">
                        <input
                          type="checkbox"
                          checked={consent.necessary}
                          disabled
                          className="mt-1 w-4 h-4 rounded"
                        />
                        <div>
                          <span className="text-sm font-medium text-[var(--color-text-primary)]">
                            Szükséges sütik
                          </span>
                          <p className="text-xs text-[var(--color-text-muted)]">
                            A weboldal működéséhez elengedhetetlenül szükségesek.
                          </p>
                        </div>
                      </label>

                      {/* Analytics */}
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={consent.analytics}
                          onChange={(e) =>
                            setConsent({ ...consent, analytics: e.target.checked })
                          }
                          className={cn(
                            'mt-1 w-4 h-4 rounded',
                            'border-[var(--color-bg-tertiary)]',
                            'text-[var(--color-accent-red)]',
                            'focus:ring-[var(--color-accent-orange)]'
                          )}
                        />
                        <div>
                          <span className="text-sm font-medium text-[var(--color-text-primary)]">
                            Analitikai sütik
                          </span>
                          <p className="text-xs text-[var(--color-text-muted)]">
                            Segítenek megérteni, hogyan használják látogatóink a weboldalt.
                          </p>
                        </div>
                      </label>

                      {/* Marketing */}
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={consent.marketing}
                          onChange={(e) =>
                            setConsent({ ...consent, marketing: e.target.checked })
                          }
                          className={cn(
                            'mt-1 w-4 h-4 rounded',
                            'border-[var(--color-bg-tertiary)]',
                            'text-[var(--color-accent-red)]',
                            'focus:ring-[var(--color-accent-orange)]'
                          )}
                        />
                        <div>
                          <span className="text-sm font-medium text-[var(--color-text-primary)]">
                            Marketing sütik
                          </span>
                          <p className="text-xs text-[var(--color-text-muted)]">
                            Személyre szabott hirdetések megjelenítéséhez használjuk.
                          </p>
                        </div>
                      </label>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:justify-center">
                <Button variant="primary" onClick={handleAcceptAll}>
                  Összes elfogadása
                </Button>
                {showDetails && (
                  <Button variant="outline" onClick={handleAcceptSelected}>
                    Kiválasztottak elfogadása
                  </Button>
                )}
                <Button variant="ghost" onClick={handleRejectAll}>
                  Csak szükségesek
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag?: (
      command: 'consent' | 'config' | 'event',
      action: string,
      params?: Record<string, unknown>
    ) => void;
  }
}

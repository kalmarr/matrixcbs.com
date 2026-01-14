'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { GradientMesh } from '@/components/effects/GradientMesh';
import { Button } from '@/components/ui/Button';

export default function KapcsolatPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    privacy: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSubmitStatus('success');
    setIsSubmitting(false);
    setFormData({ name: '', email: '', phone: '', message: '', privacy: false });
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <GradientMesh variant="subtle" />

        <div className="max-w-[var(--max-content-width)] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal className="text-center mb-8">
            <span className="inline-block text-[var(--color-accent-orange)] font-medium mb-4">
              Kapcsolat
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-accent-red">
              KINEK AJÁNLJUK AZ EGYÜTTMŰKÖDÉST?
            </h1>
          </ScrollReveal>

          {/* Recommendation text - EREDETI SZÖVEG */}
          <ScrollReveal className="max-w-2xl mx-auto text-center">
            <p className="text-lg text-[var(--color-text-secondary)] mb-4">
              Ha úgy érzi, hogy:
            </p>
            <ul className="text-left max-w-md mx-auto space-y-2 mb-6">
              <li className="flex items-start gap-3">
                <span className="text-[var(--color-accent-red)] mt-1">•</span>
                <span className="text-[var(--color-text-secondary)]">a szervezete túl sok energiát vesz el,</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--color-accent-red)] mt-1">•</span>
                <span className="text-[var(--color-text-secondary)]">a működésük nem arányos a befektetett munkával,</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--color-accent-red)] mt-1">•</span>
                <span className="text-[var(--color-text-secondary)]">„ennél lehetne jobban is csinálni",</span>
              </li>
            </ul>
            <p className="text-xl text-[var(--color-accent-orange)] font-semibold">
              akkor érdemes beszélnünk.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-[var(--color-bg-primary)]">
        <div className="max-w-[var(--max-content-width)] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <ScrollReveal>
              <div className="p-8 rounded-3xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
                <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-8">
                  KAPCSOLATFELVÉTEL
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                      Név *
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent-red)] transition-colors"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent-red)] transition-colors"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent-red)] transition-colors"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                      Üzenet *
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent-red)] transition-colors resize-none"
                    />
                  </div>

                  {/* Privacy checkbox */}
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="privacy"
                      required
                      checked={formData.privacy}
                      onChange={(e) => setFormData({ ...formData, privacy: e.target.checked })}
                      className="mt-1 w-5 h-5 rounded border-[var(--color-border)] text-[var(--color-accent-red)] focus:ring-[var(--color-accent-red)]"
                    />
                    <label htmlFor="privacy" className="text-sm text-[var(--color-text-secondary)]">
                      Elfogadom az{' '}
                      <a href="/adatvedelem" className="text-[var(--color-accent-red)] hover:underline">
                        adatvédelmi tájékoztatót
                      </a>
                    </label>
                  </div>

                  {/* Submit button */}
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Küldés...' : 'ÜZENET KÜLDÉSE'}
                  </Button>

                  {/* Status messages */}
                  {submitStatus === 'success' && (
                    <p className="text-green-500 text-center">
                      Köszönjük üzenetét! Hamarosan felvesszük Önnel a kapcsolatot.
                    </p>
                  )}
                  {submitStatus === 'error' && (
                    <p className="text-red-500 text-center">
                      Hiba történt. Kérjük, próbálja újra később.
                    </p>
                  )}
                </form>
              </div>
            </ScrollReveal>

            {/* Company Info & Map */}
            <ScrollReveal>
              <div className="space-y-8">
                {/* Map placeholder */}
                <div className="h-64 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] flex items-center justify-center overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2755.4!2d20.1330833!3d46.2599264!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x474487e06734a679%3A0x1d2d32e37ea46e09!2sMATRIX%20CBS%20Kft%20-%20(Szegedi%20KJE%20Nyelvvizsga%20hely)!5e0!3m2!1shu!2shu!4v1704800000000!5m2!1shu!2shu"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="MATRIX CBS Kft. térkép"
                  />
                </div>

                {/* Company details */}
                <div className="p-8 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
                  <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-1">
                    MATRIX CBS Kft.
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-1">
                    MATRIX CBS Korlátolt Felelősségű Társaság
                  </p>
                  <p className="text-sm text-[var(--color-text-muted)] mb-6">Alapítva: 2006</p>

                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <span className="text-2xl">📍</span>
                      <div>
                        <p className="text-[var(--color-text-primary)] font-medium">6724 Szeged</p>
                        <p className="text-[var(--color-text-secondary)]">Pulcz utca 3–2.</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-2xl">📞</span>
                      <a
                        href="tel:+36703272146"
                        className="text-[var(--color-text-primary)] hover:text-[var(--color-accent-red)] transition-colors"
                      >
                        +36 70 327 2146
                      </a>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-2xl">✉️</span>
                      <a
                        href="mailto:info@matrixcbs.com"
                        className="text-[var(--color-text-primary)] hover:text-[var(--color-accent-red)] transition-colors"
                      >
                        info@matrixcbs.com
                      </a>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-2xl">🔗</span>
                      <a
                        href="https://www.linkedin.com/company/matrixcbs"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--color-text-primary)] hover:text-[var(--color-accent-red)] transition-colors"
                      >
                        LinkedIn
                      </a>
                    </div>
                  </div>

                  {/* Company registration data */}
                  <div className="mt-6 pt-6 border-t border-[var(--color-border)] space-y-2">
                    <p className="text-sm text-[var(--color-text-muted)]">
                      Cégjegyzékszám: <span className="text-[var(--color-text-secondary)]">06-09-010970</span>
                    </p>
                    <p className="text-sm text-[var(--color-text-muted)]">
                      Adószám: <span className="text-[var(--color-text-secondary)]">13847951-2-06</span>
                    </p>
                    <p className="text-sm text-[var(--color-text-muted)]">
                      Közösségi adószám: <span className="text-[var(--color-text-secondary)]">HU13847951</span>
                    </p>
                    <p className="text-sm text-[var(--color-text-muted)]">
                      Stat. számjel: <span className="text-[var(--color-text-secondary)]">13847951-8559-113-06</span>
                    </p>
                    <p className="text-sm text-[var(--color-text-muted)]">
                      Főtevékenység: <span className="text-[var(--color-text-secondary)]">8559&apos;08 M.n.s. egyéb oktatás</span>
                    </p>
                    <p className="text-sm text-[var(--color-text-muted)]">
                      Felnőttképzési nyilvántartási szám: <span className="text-[var(--color-text-secondary)]">B/2020/000668</span>
                    </p>
                  </div>
                </div>

                {/* Bank accounts */}
                <div className="p-8 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
                  <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-4">
                    Bankszámlaszámok
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-[var(--color-text-muted)]">Wise (HUF)</p>
                      <p className="text-[var(--color-text-secondary)] font-mono text-sm">12600016-19212336-19916169</p>
                    </div>
                    <div>
                      <p className="text-sm text-[var(--color-text-muted)]">ERSTE Bank (HUF)</p>
                      <p className="text-[var(--color-text-secondary)] font-mono text-sm">11600006-00000000-16195650</p>
                    </div>
                    <div>
                      <p className="text-sm text-[var(--color-text-muted)]">Wise (EUR) - IBAN</p>
                      <p className="text-[var(--color-text-secondary)] font-mono text-sm">BE10 9671 4890 8679</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

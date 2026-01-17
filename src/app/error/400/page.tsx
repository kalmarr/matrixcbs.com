import Link from 'next/link';

export const metadata = {
  title: '400 - Hibás kérés | MATRIX CBS',
};

export default function BadRequest() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-[var(--color-bg-dark)]">
      <div className="text-center max-w-md">
        <h1 className="text-[120px] font-bold text-transparent bg-clip-text bg-gradient-to-br from-[var(--color-accent-red)] to-[var(--color-accent-orange)]">
          400
        </h1>
        <h2 className="text-2xl font-bold mb-4 text-[var(--color-text-primary)]">
          Hibás kérés
        </h2>
        <p className="text-[var(--color-text-muted)] mb-8">
          A kérés nem feldolgozható érvénytelen vagy hiányos adatok miatt.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[var(--color-accent-red)] to-[var(--color-accent-orange)] text-white rounded-lg font-medium hover:opacity-90 transition"
        >
          Vissza a főoldalra
        </Link>
      </div>
    </div>
  );
}

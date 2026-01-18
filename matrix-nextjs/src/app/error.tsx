'use client';

import { useEffect } from 'react';
import ErrorPage from '@/components/error/ErrorPage';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <ErrorPage
      code={500}
      title="Szerver hiba történt"
      message="Sajnáljuk, váratlan hiba történt a kérés feldolgozása során. Kérjük, próbálja újra később, vagy térjen vissza a főoldalra."
      showHomeButton={true}
      showRetryButton={true}
      onRetry={reset}
    />
  );
}

'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface ErrorPageProps {
  code: number;
  title: string;
  message: string;
  showHomeButton?: boolean;
  showRetryButton?: boolean;
  onRetry?: () => void;
}

export default function ErrorPage({
  code,
  title,
  message,
  showHomeButton = true,
  showRetryButton = false,
  onRetry,
}: ErrorPageProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-[var(--color-bg-dark)] relative overflow-hidden">
      {/* Animated background grid */}
      <div className="matrix-grid absolute inset-0 opacity-30" />

      {/* Animated glow effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(178, 40, 47, 0.1) 0%, transparent 70%)`,
        }}
      />

      <div className={`relative z-10 text-center max-w-2xl transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Error code with animation */}
        <div className="error-code-container mb-8">
          <h1
            className="text-[180px] md:text-[240px] font-bold leading-none text-transparent bg-clip-text bg-gradient-to-br from-[var(--color-accent-red)] to-[var(--color-accent-orange)] select-none animate-pulse-slow"
            style={{
              textShadow: '0 0 80px rgba(178, 40, 47, 0.3)',
            }}
          >
            {code}
          </h1>

          {/* Glitch effect lines */}
          <div className="relative h-1 w-32 mx-auto -mt-8 mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--color-accent-red)] to-transparent animate-scan" />
          </div>
        </div>

        {/* Error title */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[var(--color-text-primary)]">
          {title}
        </h2>

        {/* Error message */}
        <p className="text-lg md:text-xl text-[var(--color-text-muted)] mb-12 max-w-md mx-auto">
          {message}
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {showHomeButton && (
            <Link
              href="/"
              className="group relative inline-flex items-center justify-center px-8 py-4 font-semibold text-white transition-all duration-300 rounded-lg overflow-hidden bg-gradient-to-r from-[var(--color-accent-red)] to-[var(--color-accent-orange)] hover:shadow-[var(--shadow-glow-red)] hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg
                  className="w-5 h-5 transition-transform group-hover:-translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Vissza a főoldalra
              </span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
            </Link>
          )}

          {showRetryButton && onRetry && (
            <button
              onClick={onRetry}
              className="group relative inline-flex items-center justify-center px-8 py-4 font-semibold text-white transition-all duration-300 rounded-lg overflow-hidden bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-tertiary)] border-2 border-[var(--color-gray-dark)] hover:border-[var(--color-accent-orange)] hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg
                  className="w-5 h-5 transition-transform group-hover:rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Újrapróbálás
              </span>
            </button>
          )}
        </div>

        {/* Decorative elements */}
        <div className="mt-16 flex justify-center gap-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-[var(--color-accent-orange)] animate-pulse"
              style={{
                animationDelay: `${i * 200}ms`,
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        @keyframes scan {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .animate-scan {
          animation: scan 2s linear infinite;
        }
      `}</style>
    </div>
  );
}

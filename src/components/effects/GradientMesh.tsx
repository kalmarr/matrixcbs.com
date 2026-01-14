'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GradientMeshProps {
  className?: string;
  variant?: 'primary' | 'secondary' | 'subtle';
}

export function GradientMesh({ className, variant = 'primary' }: GradientMeshProps) {
  const variants = {
    primary: {
      blob1: 'bg-[var(--color-accent-red)]/20',
      blob2: 'bg-[var(--color-accent-orange)]/15',
      blob3: 'bg-[var(--color-gray-dark)]/10',
    },
    secondary: {
      blob1: 'bg-[var(--color-accent-orange)]/20',
      blob2: 'bg-[var(--color-accent-red)]/15',
      blob3: 'bg-[var(--color-gray-medium)]/10',
    },
    subtle: {
      blob1: 'bg-[var(--color-bg-secondary)]/40',
      blob2: 'bg-[var(--color-bg-tertiary)]/30',
      blob3: 'bg-[var(--color-gray-dark)]/5',
    },
  };

  const colors = variants[variant];

  return (
    <div
      className={cn(
        'absolute inset-0 overflow-hidden -z-10 pointer-events-none',
        className
      )}
      aria-hidden="true"
    >
      {/* Blob 1 - Top Right */}
      <motion.div
        className={cn(
          'absolute -top-1/4 -right-1/4 w-[800px] h-[800px]',
          'rounded-full blur-3xl',
          colors.blob1
        )}
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
        }}
      />

      {/* Blob 2 - Bottom Left */}
      <motion.div
        className={cn(
          'absolute -bottom-1/4 -left-1/4 w-[700px] h-[700px]',
          'rounded-full blur-3xl',
          colors.blob2
        )}
        animate={{
          x: [0, -40, 0],
          y: [0, -50, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
        }}
      />

      {/* Blob 3 - Center */}
      <motion.div
        className={cn(
          'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
          'w-[600px] h-[600px]',
          'rounded-full blur-3xl',
          colors.blob3
        )}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'linear',
        }}
      />
    </div>
  );
}

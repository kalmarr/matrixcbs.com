'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { hexagonReveal, hexagonHover } from '@/lib/animations';

interface HexagonCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  index?: number;
  onClick?: () => void;
  className?: string;
}

export function HexagonCard({
  title,
  description,
  icon,
  index = 0,
  onClick,
  className,
}: HexagonCardProps) {
  return (
    <motion.div
      className={cn(
        'relative group cursor-pointer',
        'w-full max-w-[300px]',
        className
      )}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={hexagonReveal}
      custom={index}
      whileHover="hover"
      onClick={onClick}
    >
      {/* Hexagon Container */}
      <motion.div
        className="relative"
        variants={hexagonHover}
      >
        {/* Hexagon Background */}
        <div
          className={cn(
            'relative w-full aspect-[1.1547]', // Hexagon aspect ratio
            'bg-[var(--color-bg-secondary)]',
            'border-2 border-[var(--color-accent-red)]/30',
            'group-hover:border-[var(--color-accent-red)]',
            'transition-colors duration-[var(--transition-base)]',
            'overflow-hidden'
          )}
          style={{
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          }}
        >
          {/* Gradient overlay on hover */}
          <div
            className={cn(
              'absolute inset-0',
              'bg-gradient-to-br from-[var(--color-accent-red)]/0 to-[var(--color-accent-orange)]/0',
              'group-hover:from-[var(--color-accent-red)]/10 group-hover:to-[var(--color-accent-orange)]/10',
              'transition-all duration-[var(--transition-base)]'
            )}
          />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            {/* Icon */}
            {icon && (
              <div
                className={cn(
                  'w-16 h-16 mb-4',
                  'flex items-center justify-center',
                  'text-[var(--color-accent-red)]',
                  'group-hover:text-[var(--color-accent-orange)]',
                  'transition-colors duration-[var(--transition-base)]'
                )}
              >
                {icon}
              </div>
            )}

            {/* Title */}
            <h3
              className={cn(
                'text-lg font-semibold',
                'text-[var(--color-text-primary)]',
                'mb-2'
              )}
            >
              {title}
            </h3>

            {/* Description - shows on hover */}
            <p
              className={cn(
                'text-sm text-[var(--color-text-muted)]',
                'opacity-0 group-hover:opacity-100',
                'transform translate-y-2 group-hover:translate-y-0',
                'transition-all duration-[var(--transition-base)]',
                'line-clamp-3'
              )}
            >
              {description}
            </p>
          </div>
        </div>

        {/* Glow effect */}
        <div
          className={cn(
            'absolute inset-0 -z-10',
            'opacity-0 group-hover:opacity-100',
            'blur-xl',
            'bg-gradient-to-br from-[var(--color-accent-red)]/20 to-[var(--color-accent-orange)]/20',
            'transition-opacity duration-[var(--transition-base)]'
          )}
          style={{
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          }}
        />
      </motion.div>
    </motion.div>
  );
}

// Hexagon Grid component for layout
interface HexagonGridProps {
  children: React.ReactNode;
  className?: string;
}

export function HexagonGrid({ children, className }: HexagonGridProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        'gap-6 lg:gap-8',
        'place-items-center',
        className
      )}
    >
      {children}
    </div>
  );
}

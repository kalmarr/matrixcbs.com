'use client';

import { forwardRef, type HTMLAttributes } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { cardHover, cardWithGlow } from '@/lib/animations';

type CardVariant = 'default' | 'glow' | 'outline' | 'glass';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  hoverable?: boolean;
  withGlow?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const variantStyles: Record<CardVariant, string> = {
  default: `
    bg-[var(--color-bg-secondary)]
    border border-[var(--color-bg-tertiary)]
  `,
  glow: `
    bg-[var(--color-bg-secondary)]
    border border-[var(--color-accent-red)]/20
  `,
  outline: `
    bg-transparent
    border-2 border-[var(--color-gray-dark)]
  `,
  glass: `
    bg-[var(--color-bg-secondary)]/80
    backdrop-blur-md
    border border-white/10
  `,
};

const paddingStyles: Record<NonNullable<CardProps['padding']>, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = 'default',
      hoverable = false,
      withGlow = false,
      padding = 'md',
      children,
      ...props
    },
    ref
  ) => {
    const MotionDiv = motion.div;

    if (hoverable) {
      return (
        <MotionDiv
          ref={ref}
          className={cn(
            'rounded-[var(--radius-lg)]',
            'transition-colors duration-[var(--transition-base)]',
            variantStyles[variant],
            paddingStyles[padding],
            'cursor-pointer',
            className
          )}
          initial="rest"
          whileHover="hover"
          variants={withGlow ? cardWithGlow : cardHover}
          {...(props as HTMLMotionProps<'div'>)}
        >
          {children}
        </MotionDiv>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-[var(--radius-lg)]',
          variantStyles[variant],
          paddingStyles[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Card Header component
interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5', className)}
      {...props}
    />
  )
);

CardHeader.displayName = 'CardHeader';

// Card Title component
interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, children, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        'text-xl font-semibold text-[var(--color-text-primary)]',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  )
);

CardTitle.displayName = 'CardTitle';

// Card Description component
interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-[var(--color-text-muted)]', className)}
      {...props}
    />
  )
);

CardDescription.displayName = 'CardDescription';

// Card Content component
interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('', className)} {...props} />
  )
);

CardContent.displayName = 'CardContent';

// Card Footer component
interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center pt-4', className)}
      {...props}
    />
  )
);

CardFooter.displayName = 'CardFooter';

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  type CardProps,
  type CardVariant,
};

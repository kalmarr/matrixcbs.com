'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-[var(--color-accent-red)] text-white
    hover:bg-[var(--color-accent-red-hover)]
    shadow-[var(--shadow-sm)]
    hover:shadow-[var(--shadow-glow-red)]
  `,
  secondary: `
    bg-[var(--color-accent-orange)] text-white
    hover:bg-[var(--color-accent-orange-hover)]
    shadow-[var(--shadow-sm)]
    hover:shadow-[var(--shadow-glow-orange)]
  `,
  outline: `
    bg-transparent text-[var(--color-accent-red)]
    border-2 border-[var(--color-accent-red)]
    hover:bg-[var(--color-accent-red)] hover:text-white
  `,
  ghost: `
    bg-transparent text-[var(--color-text-primary)]
    hover:bg-[var(--color-bg-secondary)]
  `,
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm rounded-[var(--radius-sm)]',
  md: 'px-6 py-3 text-base rounded-[var(--radius-md)]',
  lg: 'px-8 py-4 text-lg rounded-[var(--radius-md)]',
};

const buttonHoverAnimation = {
  rest: { scale: 1 },
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      children,
      onClick,
      type = 'button',
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        type={type}
        className={cn(
          'inline-flex items-center justify-center gap-2',
          'font-semibold transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-orange)] focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:pointer-events-none',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || isLoading}
        onClick={onClick}
        initial="rest"
        whileHover={!disabled && !isLoading ? 'hover' : undefined}
        whileTap={!disabled && !isLoading ? 'tap' : undefined}
        variants={buttonHoverAnimation}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      >
        {isLoading ? (
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export { Button, type ButtonProps, type ButtonVariant, type ButtonSize };

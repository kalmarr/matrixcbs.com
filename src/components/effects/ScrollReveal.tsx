'use client';

import { useRef, useEffect, useState, type ReactNode } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  fadeIn,
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  scaleIn,
  scrollReveal,
  scrollRevealLeft,
  scrollRevealRight,
} from '@/lib/animations';

type AnimationType =
  | 'fadeIn'
  | 'fadeInUp'
  | 'fadeInDown'
  | 'fadeInLeft'
  | 'fadeInRight'
  | 'scaleIn'
  | 'scrollReveal'
  | 'scrollRevealLeft'
  | 'scrollRevealRight';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  once?: boolean;
  threshold?: number;
  margin?: `${number}px` | `${number}px ${number}px` | `${number}px ${number}px ${number}px ${number}px`;
}

const animationVariants: Record<AnimationType, Variants> = {
  fadeIn,
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  scaleIn,
  scrollReveal,
  scrollRevealLeft,
  scrollRevealRight,
};

export function ScrollReveal({
  children,
  className,
  animation = 'fadeInUp',
  delay = 0,
  duration,
  once = true,
  threshold = 0.1,
  margin = '-50px' as const,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once,
    amount: threshold,
    margin,
  });

  // Fallback: Ha az IntersectionObserver nem működik (pl. Samsung),
  // 1 másodperc után mindenképp megjelenítjük a tartalmat
  const [fallbackVisible, setFallbackVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setFallbackVisible(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const variants = animationVariants[animation];

  // Apply custom delay and duration
  const customVariants: Variants = {
    hidden: variants.hidden,
    visible: {
      ...variants.visible,
      transition: {
        ...(typeof variants.visible === 'object' && 'transition' in variants.visible
          ? variants.visible.transition
          : {}),
        delay,
        ...(duration && { duration }),
      },
    },
  };

  // Ha isInView VAGY fallbackVisible, akkor megjelenítjük
  const shouldShow = isInView || fallbackVisible;

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      initial="hidden"
      animate={shouldShow ? 'visible' : 'hidden'}
      variants={customVariants}
    >
      {children}
    </motion.div>
  );
}

// Staggered children animation wrapper
interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  delayChildren?: number;
  once?: boolean;
}

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.08,
  delayChildren = 0.05,
  once = true,
}: StaggerContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once,
    amount: 0.1,
    margin: '-50px',
  });

  // Fallback: Ha az IntersectionObserver nem működik (pl. Samsung),
  // 1 másodperc után mindenképp megjelenítjük a tartalmat
  const [fallbackVisible, setFallbackVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setFallbackVisible(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Ha isInView VAGY fallbackVisible, akkor megjelenítjük
  const shouldShow = isInView || fallbackVisible;

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      initial="hidden"
      animate={shouldShow ? 'visible' : 'hidden'}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

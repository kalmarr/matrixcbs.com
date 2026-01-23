/**
 * Framer Motion Animation Presets
 * Reusable animation configurations for consistent motion design
 */

import type { Variants, Transition } from 'framer-motion';

// ===== TRANSITIONS =====

export const transitions = {
  fast: {
    duration: 0.15,
    ease: 'easeOut',
  } as Transition,

  base: {
    duration: 0.3,
    ease: 'easeOut',
  } as Transition,

  slow: {
    duration: 0.5,
    ease: 'easeOut',
  } as Transition,

  spring: {
    duration: 0.35,
    ease: [0.25, 0.1, 0.25, 1],
  } as Transition,

  springBouncy: {
    duration: 0.4,
    ease: [0.34, 1.56, 0.64, 1],
  } as Transition,

  smooth: {
    duration: 0.4,
    ease: [0.25, 0.1, 0.25, 1],
  } as Transition,
};

// ===== FADE ANIMATIONS =====

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: transitions.base,
  },
};

export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.smooth,
  },
};

export const fadeInDown: Variants = {
  hidden: {
    opacity: 0,
    y: -20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.smooth,
  },
};

export const fadeInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.smooth,
  },
};

export const fadeInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.smooth,
  },
};

// ===== SCALE ANIMATIONS =====

export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitions.spring,
  },
};

export const scaleInBounce: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitions.springBouncy,
  },
};

// ===== STAGGER ANIMATIONS =====

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

export const staggerContainerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

// ===== CARD ANIMATIONS =====

export const cardHover = {
  rest: {
    scale: 1,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.4)',
  },
  hover: {
    scale: 1.02,
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.5)',
    transition: transitions.spring,
  },
};

export const cardWithGlow = {
  rest: {
    scale: 1,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.4)',
  },
  hover: {
    scale: 1.02,
    boxShadow: '0 0 30px rgba(178, 40, 47, 0.3)',
    transition: transitions.spring,
  },
};

// ===== BUTTON ANIMATIONS =====

export const buttonHover = {
  rest: {
    scale: 1,
  },
  hover: {
    scale: 1.05,
    transition: transitions.spring,
  },
  tap: {
    scale: 0.98,
  },
};

export const buttonPulse = {
  rest: {
    scale: 1,
  },
  pulse: {
    scale: [1, 1.02, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: 'loop' as const,
    },
  },
};

// ===== NAVIGATION ANIMATIONS =====

export const menuSlide: Variants = {
  hidden: {
    x: '100%',
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
};

export const navLinkHover = {
  rest: {
    width: '0%',
    opacity: 0,
  },
  hover: {
    width: '100%',
    opacity: 1,
    transition: transitions.base,
  },
};

// ===== SCROLL REVEAL ANIMATIONS =====

export const scrollReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export const scrollRevealLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export const scrollRevealRight: Variants = {
  hidden: {
    opacity: 0,
    x: 20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

// ===== FLOATING ANIMATIONS =====

export const float = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: 'loop' as const,
      ease: 'easeInOut',
    },
  },
};

export const floatSlow = {
  animate: {
    y: [0, -15, 0],
    transition: {
      duration: 5,
      repeat: Infinity,
      repeatType: 'loop' as const,
      ease: 'easeInOut',
    },
  },
};

export const rotate = {
  animate: {
    rotate: 360,
    transition: {
      duration: 20,
      repeat: Infinity,
      repeatType: 'loop' as const,
      ease: 'linear',
    },
  },
};

// ===== PAGE TRANSITIONS =====

export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: 'easeIn',
    },
  },
};

// ===== HEXAGON SPECIFIC =====

export const hexagonReveal: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export const hexagonHover = {
  rest: {
    scale: 1,
  },
  hover: {
    scale: 1.03,
    transition: transitions.spring,
  },
};

// ===== REFERENCES PAGE ANIMATIONS =====

export const countUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export const statisticPulse = {
  rest: {
    scale: 1,
  },
  hover: {
    scale: 1.05,
    transition: transitions.spring,
  },
};

export const tabIndicator: Variants = {
  initial: { opacity: 0, scaleX: 0.8 },
  animate: {
    opacity: 1,
    scaleX: 1,
    transition: transitions.spring,
  },
  exit: { opacity: 0, scaleX: 0.8 },
};

export const tabContent: Variants = {
  enter: {
    opacity: 0,
    x: 20,
  },
  center: {
    opacity: 1,
    x: 0,
    transition: transitions.smooth,
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: transitions.fast,
  },
};

export const timelineItem: Variants = {
  hidden: {
    opacity: 0,
    x: -30,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export const timelineDot: Variants = {
  hidden: {
    scale: 0,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: [0.34, 1.56, 0.64, 1],
    },
  },
};

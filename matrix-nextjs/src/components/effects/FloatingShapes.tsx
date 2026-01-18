'use client';

import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FloatingShapesProps {
  className?: string;
  count?: number;
}

// Seeded random number generator for consistent values
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function FloatingShapes({ className, count = 6 }: FloatingShapesProps) {
  // Only render on client to avoid hydration mismatch with floating point precision
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use useMemo with deterministic values based on index
  const shapes = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const seed1 = i * 1234;
      const seed2 = i * 5678;
      const seed3 = i * 9012;
      const seed4 = i * 3456;
      const seed5 = i * 7890;

      return {
        id: i,
        size: Math.round(seededRandom(seed1) * 60 + 20),
        x: Math.round(seededRandom(seed2) * 100),
        y: Math.round(seededRandom(seed3) * 100),
        duration: Math.round(seededRandom(seed4) * 10 + 15),
        delay: Math.round(seededRandom(seed5) * 5),
        type: i % 3, // 0: circle, 1: square, 2: triangle
        color: i % 2 === 0 ? 'var(--color-accent-red)' : 'var(--color-accent-orange)',
      };
    });
  }, [count]);

  // Don't render on server to avoid hydration mismatch
  if (!mounted) {
    return (
      <div
        className={cn(
          'absolute inset-0 overflow-hidden -z-10 pointer-events-none',
          className
        )}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      className={cn(
        'absolute inset-0 overflow-hidden -z-10 pointer-events-none',
        className
      )}
      aria-hidden="true"
    >
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className="absolute"
          style={{
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            width: shape.size,
            height: shape.size,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            rotate: [0, 360],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: shape.duration,
            delay: shape.delay,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
          }}
        >
          {shape.type === 0 && (
            // Circle
            <div
              className="w-full h-full rounded-full"
              style={{
                backgroundColor: shape.color,
                opacity: 0.1,
              }}
            />
          )}
          {shape.type === 1 && (
            // Square
            <div
              className="w-full h-full rounded-lg"
              style={{
                backgroundColor: shape.color,
                opacity: 0.08,
              }}
            />
          )}
          {shape.type === 2 && (
            // Hexagon
            <div
              className="w-full h-full"
              style={{
                backgroundColor: shape.color,
                opacity: 0.1,
                clipPath:
                  'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
              }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}

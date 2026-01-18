'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface MatrixBackgroundProps {
  className?: string;
  gridSize?: number;
  gridColor?: string;
  gridOpacity?: number;
  animated?: boolean;
}

export function MatrixBackground({
  className,
  gridSize = 50,
  gridColor = 'var(--color-gray-dark)',
  gridOpacity = 0.05,
  animated = false,
}: MatrixBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!animated) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let offset = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = gridColor;
      ctx.globalAlpha = gridOpacity;
      ctx.lineWidth = 1;

      // Vertical lines
      for (let x = offset % gridSize; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Horizontal lines
      for (let y = offset % gridSize; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Add intersection points
      ctx.globalAlpha = gridOpacity * 2;
      for (let x = offset % gridSize; x < canvas.width; x += gridSize) {
        for (let y = offset % gridSize; y < canvas.height; y += gridSize) {
          ctx.beginPath();
          ctx.arc(x, y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      offset += 0.2;
      animationId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [animated, gridSize, gridColor, gridOpacity]);

  if (animated) {
    return (
      <canvas
        ref={canvasRef}
        className={cn('fixed inset-0 -z-10 pointer-events-none', className)}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      className={cn('fixed inset-0 -z-10 pointer-events-none', className)}
      style={{
        backgroundImage: `
          linear-gradient(${gridColor}${Math.round(gridOpacity * 255).toString(16).padStart(2, '0')} 1px, transparent 1px),
          linear-gradient(90deg, ${gridColor}${Math.round(gridOpacity * 255).toString(16).padStart(2, '0')} 1px, transparent 1px)
        `,
        backgroundSize: `${gridSize}px ${gridSize}px`,
      }}
      aria-hidden="true"
    />
  );
}

'use client';

import { useLayoutEffect } from 'react';
import { useAnimationControls } from 'framer-motion';

/**
 * SSR-safe mount animation hook.
 * SSR: initial={false} → opacity:1 in HTML (no white page on Android).
 * Client: useLayoutEffect snaps to "hidden", then animates to "visible" before paint.
 * If Framer Motion fails (Android), element stays visible from SSR.
 */
export function useAnimateOnMount() {
  const controls = useAnimationControls();

  useLayoutEffect(() => {
    controls.set('hidden');
    controls.start('visible');
  }, [controls]);

  return controls;
}

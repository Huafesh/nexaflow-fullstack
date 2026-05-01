import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Lenis from 'lenis';
import SmoothScrollContext from './smoothScrollContext';

const ANCHOR_OFFSET = 118;
const DESKTOP_SMOOTH_SCROLL_QUERY = '(hover: hover) and (pointer: fine)';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function canEnableSmoothScroll() {
  if (typeof window === 'undefined') {
    return false;
  }

  return (
    window.matchMedia(DESKTOP_SMOOTH_SCROLL_QUERY).matches &&
    !window.matchMedia(REDUCED_MOTION_QUERY).matches
  );
}

function prefersReducedMotion() {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function resolveScrollTarget(target, offset) {
  if (typeof target === 'number') {
    return { top: Math.max(0, target), left: 0 };
  }

  if (typeof target === 'string') {
    const element = document.querySelector(target);

    if (!element) {
      return null;
    }

    return resolveScrollTarget(element, offset);
  }

  if (target instanceof HTMLElement) {
    const top = target.getBoundingClientRect().top + window.scrollY - offset;

    return { top: Math.max(0, top), left: 0 };
  }

  return null;
}

function SmoothScrollProvider({ children }) {
  const lenisRef = useRef(null);
  const [isEnabled, setIsEnabled] = useState(canEnableSmoothScroll);
  const [isReducedMotion, setIsReducedMotion] = useState(prefersReducedMotion);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const desktopMedia = window.matchMedia(DESKTOP_SMOOTH_SCROLL_QUERY);
    const reducedMotionMedia = window.matchMedia(REDUCED_MOTION_QUERY);
    const updateCapability = () => {
      setIsEnabled(desktopMedia.matches && !reducedMotionMedia.matches);
      setIsReducedMotion(reducedMotionMedia.matches);
    };

    updateCapability();
    desktopMedia.addEventListener('change', updateCapability);
    reducedMotionMedia.addEventListener('change', updateCapability);

    return () => {
      desktopMedia.removeEventListener('change', updateCapability);
      reducedMotionMedia.removeEventListener('change', updateCapability);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    root.classList.toggle('smooth-scroll-active', isEnabled);

    return () => {
      root.classList.remove('smooth-scroll-active');
    };
  }, [isEnabled]);

  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.destroy();
      lenisRef.current = null;
    }

    if (!isEnabled) {
      return undefined;
    }

    const lenis = new Lenis({
      anchors: { offset: ANCHOR_OFFSET, duration: 0.9 },
      autoRaf: true,
      gestureOrientation: 'vertical',
      lerp: 0.085,
      overscroll: true,
      smoothWheel: true,
      stopInertiaOnNavigate: true,
      wheelMultiplier: 0.96,
    });

    lenisRef.current = lenis;

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [isEnabled]);

  const scrollTo = useCallback(
    (target, options = {}) => {
      const offset = options.offset ?? ANCHOR_OFFSET;

      if (lenisRef.current && isEnabled) {
        lenisRef.current.scrollTo(target, {
          duration: options.duration ?? 0.9,
          immediate: options.immediate ?? false,
          lock: options.lock ?? false,
          offset,
        });

        return;
      }

      const resolvedTarget = resolveScrollTarget(target, offset);

      if (!resolvedTarget) {
        return;
      }

      window.scrollTo({
        ...resolvedTarget,
        behavior: options.immediate || isReducedMotion ? 'auto' : 'smooth',
      });
    },
    [isEnabled, isReducedMotion],
  );

  const scrollToTop = useCallback(
    (options = {}) => {
      scrollTo(0, { duration: 0.72, offset: 0, ...options });
    },
    [scrollTo],
  );

  const value = useMemo(
    () => ({
      anchorOffset: ANCHOR_OFFSET,
      isEnabled,
      isReducedMotion,
      scrollTo,
      scrollToTop,
    }),
    [isEnabled, isReducedMotion, scrollTo, scrollToTop],
  );

  return <SmoothScrollContext.Provider value={value}>{children}</SmoothScrollContext.Provider>;
}
export default SmoothScrollProvider;

import { createElement, forwardRef, useEffect, useMemo, useRef, useState } from 'react';

function joinClasses(...classes) {
  return classes.filter(Boolean).join(' ');
}

function assignRef(ref, value) {
  if (typeof ref === 'function') {
    ref(value);
    return;
  }

  if (ref && typeof ref === 'object') {
    ref.current = value;
  }
}

function canUseInteractiveHover() {
  if (typeof window === 'undefined') {
    return false;
  }

  const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return supportsHover && !prefersReducedMotion;
}

const variantPresets = {
  panel: {
    perspective: 1500,
    tilt: 1.9,
  },
  card: {
    perspective: 1350,
    tilt: 3,
  },
  tile: {
    perspective: 1150,
    tilt: 2.1,
  },
};

const InteractiveSurface = forwardRef(function InteractiveSurface(
  {
    as = 'div',
    children,
    className,
    interactive = true,
    onPointerDown,
    onPointerEnter,
    onPointerLeave,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    surfaceVariant,
    style,
    variant = 'card',
    ...props
  },
  forwardedRef,
) {
  const localRef = useRef(null);
  const frameRef = useRef(null);
  const pointerRef = useRef({ clientX: 0, clientY: 0 });
  const [hoverReady, setHoverReady] = useState(canUseInteractiveHover);
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const rectRef = useRef(null);
  const lastRectUpdate = useRef(0);

  const resolvedVariant = surfaceVariant ?? variant;
  const preset = useMemo(() => variantPresets[resolvedVariant] ?? variantPresets.card, [resolvedVariant]);

  const resetMotion = () => {
    const node = localRef.current;

    if (!node) {
      return;
    }

    node.style.setProperty('--mx', '50%');
    node.style.setProperty('--my', '50%');
    node.style.setProperty('--rx', '0deg');
    node.style.setProperty('--ry', '0deg');
  };

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const hoverMedia = window.matchMedia('(hover: hover) and (pointer: fine)');
    const motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      setHoverReady(hoverMedia.matches && !motionMedia.matches);
    };

    update();

    hoverMedia.addEventListener('change', update);
    motionMedia.addEventListener('change', update);

    return () => {
      hoverMedia.removeEventListener('change', update);
      motionMedia.removeEventListener('change', update);
    };
  }, []);

  useEffect(() => {
    if (!hoverReady || !interactive) {
      setIsHovered(false);
      setIsActive(false);
      resetMotion();
    }
  }, [hoverReady, interactive]);

  useEffect(() => {
    return () => {
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const updateMotion = () => {
    frameRef.current = null;

    const node = localRef.current;

    if (!node) {
      return;
    }

    const now = performance.now();
    if (!rectRef.current || now - lastRectUpdate.current > 200) {
      rectRef.current = node.getBoundingClientRect();
      lastRectUpdate.current = now;
    }

    const rect = rectRef.current;

    if (!rect.width || !rect.height) {
      return;
    }

    const x = Math.min(Math.max((pointerRef.current.clientX - rect.left) / rect.width, 0), 1);
    const y = Math.min(Math.max((pointerRef.current.clientY - rect.top) / rect.height, 0), 1);
    const rotateY = (x - 0.5) * preset.tilt * 2;
    const rotateX = (0.5 - y) * preset.tilt * 2;

    node.style.setProperty('--mx', `${(x * 100).toFixed(2)}%`);
    node.style.setProperty('--my', `${(y * 100).toFixed(2)}%`);
    node.style.setProperty('--rx', `${rotateX.toFixed(2)}deg`);
    node.style.setProperty('--ry', `${rotateY.toFixed(2)}deg`);
  };

  const scheduleMotion = (event) => {
    pointerRef.current = {
      clientX: event.clientX,
      clientY: event.clientY,
    };

    if (!frameRef.current) {
      frameRef.current = window.requestAnimationFrame(updateMotion);
    }
  };

  const handlePointerEnter = (event) => {
    onPointerEnter?.(event);

    if (!interactive || !hoverReady) {
      return;
    }

    setIsHovered(true);
    scheduleMotion(event);
  };

  const handlePointerMove = (event) => {
    onPointerMove?.(event);

    if (!interactive || !hoverReady) {
      return;
    }

    if (!isHovered) {
      setIsHovered(true);
    }

    scheduleMotion(event);
  };

  const handlePointerLeave = (event) => {
    onPointerLeave?.(event);

    if (!interactive || !hoverReady) {
      return;
    }

    if (frameRef.current) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    setIsHovered(false);
    setIsActive(false);
    rectRef.current = null; // Clear cache on leave
    resetMotion();
  };

  const handlePointerDown = (event) => {
    onPointerDown?.(event);

    if (!interactive || !hoverReady) {
      return;
    }

    setIsActive(true);
    scheduleMotion(event);
  };

  const handlePointerUp = (event) => {
    onPointerUp?.(event);

    if (!interactive || !hoverReady) {
      return;
    }

    setIsActive(false);
    scheduleMotion(event);
  };

  const handlePointerCancel = (event) => {
    onPointerCancel?.(event);

    if (!interactive || !hoverReady) {
      return;
    }

    setIsActive(false);
    setIsHovered(false);
    resetMotion();
  };

  return createElement(
    as,
    {
      ...props,
      ref: (node) => {
        localRef.current = node;
        assignRef(forwardedRef, node);
      },
      className: joinClasses(
        'interactive-surface',
        `interactive-surface--${resolvedVariant}`,
        interactive && 'interactive-surface--enabled',
        isHovered && 'is-hovered',
        isActive && 'is-active',
        className,
      ),
      style: {
        ...style,
        '--interactive-perspective': `${preset.perspective}px`,
      },
      onPointerEnter: handlePointerEnter,
      onPointerMove: handlePointerMove,
      onPointerLeave: handlePointerLeave,
      onPointerDown: handlePointerDown,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerCancel,
    },
    [
      createElement('div', { key: 'wave', className: 'surface-wave' }),
      children
    ],
  );
});

export default InteractiveSurface;

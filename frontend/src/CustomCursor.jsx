import { useEffect, useRef, useState } from 'react';

const textTargetSelector = [
  'input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="button"]):not([type="submit"]):not([type="reset"])',
  'textarea',
  'select',
  '[contenteditable="true"]',
  'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'li'
].join(', ');

const interactiveTargetSelector = [
  'a[href]',
  'button',
  '[role="button"]',
  '.interactive-surface',
].join(', ');

function canUseCustomCursor() {
  if (typeof window === 'undefined') {
    return false;
  }

  const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return supportsHover && !prefersReducedMotion;
}

function getCursorMode(target) {
  if (!(target instanceof Element)) {
    return 'default';
  }

  if (target.closest('button') || target.closest('a[href]') || target.closest('[role="button"]')) {
    return 'accent';
  }

  if (target.closest('.task-item')) {
    return 'hidden';
  }

  if (target.closest(textTargetSelector)) {
    return 'text';
  }

  if (target.closest(interactiveTargetSelector)) {
    return 'accent';
  }

  return 'default';
}

function CustomCursor({ isHidden = false }) {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const textRef = useRef(null);
  const rafRef = useRef(null);
  const motionRef = useRef({
    targetX: 0,
    targetY: 0,
    dotX: 0,
    dotY: 0,
    ringX: 0,
    ringY: 0,
  });
  const [enabled, setEnabled] = useState(canUseCustomCursor);
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState('default');
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const hoverMedia = window.matchMedia('(hover: hover) and (pointer: fine)');
    const motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateCapability = () => {
      setEnabled(hoverMedia.matches && !motionMedia.matches);
    };

    updateCapability();

    hoverMedia.addEventListener('change', updateCapability);
    motionMedia.addEventListener('change', updateCapability);

    return () => {
      hoverMedia.removeEventListener('change', updateCapability);
      motionMedia.removeEventListener('change', updateCapability);
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      document.documentElement.classList.remove('cursor-enabled');
      return undefined;
    }

    document.documentElement.classList.add('cursor-enabled');

    const animate = () => {
      const state = motionRef.current;
      state.dotX += (state.targetX - state.dotX) * 0.34;
      state.dotY += (state.targetY - state.dotY) * 0.34;
      state.ringX += (state.targetX - state.ringX) * 0.18;
      state.ringY += (state.targetY - state.ringY) * 0.18;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${state.dotX}px, ${state.dotY}px, 0) translate(-50%, -50%)`;
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${state.ringX}px, ${state.ringY}px, 0) translate(-50%, -50%)`;
      }

      if (textRef.current) {
        textRef.current.style.transform = `translate3d(${state.ringX}px, ${state.ringY}px, 0) translate(-50%, -50%)`;
      }

      rafRef.current = window.requestAnimationFrame(animate);
    };

    rafRef.current = window.requestAnimationFrame(animate);

    const handlePointerMove = (event) => {
      motionRef.current.targetX = event.clientX;
      motionRef.current.targetY = event.clientY;
      setVisible(true);
      setMode(getCursorMode(event.target));
    };

    const handlePointerDown = (event) => {
      setPressed(true);
      setMode(getCursorMode(event.target));
    };

    const handlePointerUp = (event) => {
      setPressed(false);
      setMode(getCursorMode(event.target));
    };

    const handlePointerLeaveWindow = () => {
      setVisible(false);
      setPressed(false);
    };

    const handlePointerEnterWindow = () => {
      setVisible(true);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });
    window.addEventListener('blur', handlePointerLeaveWindow);
    document.addEventListener('mouseleave', handlePointerLeaveWindow);
    document.addEventListener('mouseenter', handlePointerEnterWindow);

    return () => {
      document.documentElement.classList.remove('cursor-enabled');

      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('blur', handlePointerLeaveWindow);
      document.removeEventListener('mouseleave', handlePointerLeaveWindow);
      document.removeEventListener('mouseenter', handlePointerEnterWindow);
    };
  }, [enabled]);

  if (!enabled || isHidden) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className={`custom-cursor ${visible ? 'is-visible' : ''} mode-${mode} ${pressed ? 'is-pressed' : ''}`}
    >
      <div className="custom-cursor__ring" ref={ringRef} />
      <div className="custom-cursor__dot" ref={dotRef} />
      <div className="custom-cursor__text" ref={textRef} />
    </div>
  );
}

export default CustomCursor;

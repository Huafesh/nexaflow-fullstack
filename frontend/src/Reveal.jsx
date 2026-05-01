import { Children, cloneElement, isValidElement, useEffect, useRef, useState } from 'react';

function joinClasses(...classes) {
  return classes.filter(Boolean).join(' ');
}

function useReveal({ once = true, threshold = 0.16, rootMargin = '0px 0px -10% 0px' } = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return undefined;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);

          if (once) {
            observer.disconnect();
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [once, rootMargin, threshold]);

  return [ref, isVisible];
}

function Reveal({
  as: Tag = 'div',
  children,
  className,
  delay = 0,
  once = true,
  rootMargin,
  style,
  threshold,
  variant = 'fade-up',
  ...props
}) {
  const [ref, isVisible] = useReveal({ once, rootMargin, threshold });

  return (
    <Tag
      ref={ref}
      className={joinClasses('reveal', `reveal--${variant}`, isVisible && 'is-visible', className)}
      style={{ ...style, '--reveal-delay': `${delay}ms` }}
      {...props}
    >
      {children}
    </Tag>
  );
}

function RevealGroup({
  as: Tag = 'div',
  children,
  className,
  delay = 0,
  once = true,
  rootMargin,
  stagger = 90,
  style,
  threshold,
  variant = 'fade-up',
  ...props
}) {
  const [ref, isVisible] = useReveal({ once, rootMargin, threshold });

  const revealedChildren = Children.map(children, (child, index) => {
    if (!isValidElement(child)) {
      return child;
    }

    const childDelay = delay + index * stagger;

    return cloneElement(child, {
      className: joinClasses('reveal-group-item', child.props.className),
      style: { ...child.props.style, '--reveal-delay': `${childDelay}ms` },
    });
  });

  return (
    <Tag
      ref={ref}
      className={joinClasses(
        'reveal-group',
        `reveal-group--${variant}`,
        isVisible && 'is-visible',
        className,
      )}
      style={style}
      {...props}
    >
      {revealedChildren}
    </Tag>
  );
}

export { RevealGroup };
export default Reveal;

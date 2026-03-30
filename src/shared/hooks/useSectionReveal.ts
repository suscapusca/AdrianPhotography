import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export function useSectionReveal<T extends HTMLElement>(deps: unknown[] = []) {
  const ref = useRef<T | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }

    const targets = node.querySelectorAll<HTMLElement>('[data-reveal]');

    if (prefersReducedMotion) {
      targets.forEach((target) => {
        target.style.opacity = '1';
        target.style.transform = 'none';
      });
      return;
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        targets,
        { y: 32, opacity: 0, filter: 'blur(8px)' },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          ease: 'power3.out',
          duration: 1,
          stagger: 0.08,
          scrollTrigger: {
            trigger: node,
            start: 'top 78%',
          },
        },
      );
    }, node);

    return () => context.revert();
  }, [prefersReducedMotion, ...deps]);

  return ref;
}

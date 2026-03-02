import { useEffect, useRef, useCallback } from 'react';

interface UseIntersectionObserverOptions {
  onIntersect: () => void;
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}

/**
 * Custom hook that uses IntersectionObserver to detect when an element becomes visible.
 * This is more performant than manual scroll position calculations.
 * 
 * @param options - Configuration options
 * @returns ref to attach to the sentinel element
 */
export function useIntersectionObserver<T extends HTMLElement = HTMLDivElement>({
  onIntersect,
  threshold = 0,
  rootMargin = '200px',
  enabled = true,
}: UseIntersectionObserverOptions) {
  const targetRef = useRef<T>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry.isIntersecting) {
      onIntersect();
    }
  }, [onIntersect]);

  useEffect(() => {
    if (!enabled) return;

    const target = targetRef.current;
    if (!target) return;

    // Clean up existing observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create new observer
    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    });

    observerRef.current.observe(target);

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [handleIntersection, threshold, rootMargin, enabled]);

  return targetRef;
}

import { useEffect, useRef, useState } from 'react';

/**
 * useInView
 * Returns a ref to attach to any element, and a boolean that flips to true
 * the first time that element scrolls into the viewport.
 *
 * Why IntersectionObserver instead of a scroll event listener: scroll events
 * fire constantly and are expensive to handle at scale (many users, many
 * elements). IntersectionObserver is handled natively by the browser and
 * only notifies us when visibility actually changes.
 *
 * @param {object} options
 * @param {number} options.threshold - how much of the element must be
 *   visible before it counts as "in view" (0 to 1). Default 0.2 (20%).
 * @param {boolean} options.triggerOnce - once visible, stop observing
 *   (the animation plays once and doesn't reverse on scroll back up).
 */
function useInView({ threshold = 0.2, triggerOnce = true } = {}) {
  const elementRef = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            if (triggerOnce) {
              observer.unobserve(element);
            }
          } else if (!triggerOnce) {
            setIsInView(false);
          }
        });
      },
      { threshold }
    );

    observer.observe(element);

    // Cleanup: stop observing if the component unmounts before it's ever seen
    return () => {
      observer.disconnect();
    };
  }, [threshold, triggerOnce]);

  return [elementRef, isInView];
}

export default useInView;
import { useEffect, useRef } from 'react';

// Favicon animation frames - skull with different states
const FAVICON_FRAMES = [
  '/skull.svg', // Normal
  'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23dc2626" stroke-width="2"><path d="M12 2C6.5 2 2 6.5 2 12c0 3.5 1.5 6.5 4 8.5V22l3-2 3 2v-1.5c2.5-2 4-5 4-8.5 0-5.5-4.5-10-10-10z"/><circle cx="9" cy="12" r="1.5" fill="%23dc2626"/><circle cx="15" cy="12" r="1.5" fill="%23dc2626"/><path d="M9 16c.5 1 1.5 2 3 2s2.5-1 3-2"/></svg>', // Eyes red
  'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23000" stroke-width="2"><path d="M12 2C6.5 2 2 6.5 2 12c0 3.5 1.5 6.5 4 8.5V22l3-2 3 2v-1.5c2.5-2 4-5 4-8.5 0-5.5-4.5-10-10-10z"/><circle cx="9" cy="12" r="2" fill="%23000"/><circle cx="15" cy="12" r="2" fill="%23000"/><ellipse cx="12" cy="17" rx="3" ry="2" fill="%23000"/></svg>', // Mouth open
  'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23dc2626" stroke-width="2"><path d="M12 2C6.5 2 2 6.5 2 12c0 3.5 1.5 6.5 4 8.5V22l3-2 3 2v-1.5c2.5-2 4-5 4-8.5 0-5.5-4.5-10-10-10z"/><circle cx="9" cy="12" r="2" fill="%23dc2626"/><circle cx="15" cy="12" r="2" fill="%23dc2626"/><ellipse cx="12" cy="17" rx="3" ry="2" fill="%23dc2626"/></svg>', // Eyes and mouth red
];

export function useAnimatedFavicon() {
  const frameIndexRef = useRef(0);
  const intervalRef = useRef<number | null>(null);
  const isActiveRef = useRef(true);
  const faviconLinkRef = useRef<HTMLLinkElement | null>(null);

  useEffect(() => {
    // Get or create favicon link element
    let faviconLink = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!faviconLink) {
      faviconLink = document.createElement('link');
      faviconLink.rel = 'icon';
      document.head.appendChild(faviconLink);
    }
    faviconLinkRef.current = faviconLink;

    // Track if user is active
    const handleVisibilityChange = () => {
      isActiveRef.current = !document.hidden;
      
      if (document.hidden) {
        // User tabbed out - start animation
        startAnimation();
      } else {
        // User returned - stop animation and reset to normal
        stopAnimation();
        resetFavicon();
      }
    };

    // Track user activity (mouse/keyboard)
    let activityTimeout: number | null = null;
    const INACTIVITY_DELAY = 10000; // 10 seconds of inactivity

    const handleActivity = () => {
      if (activityTimeout) {
        clearTimeout(activityTimeout);
      }

      // If animation is running due to inactivity, stop it
      if (isActiveRef.current && intervalRef.current) {
        stopAnimation();
        resetFavicon();
      }

      // Set new timeout for inactivity
      activityTimeout = window.setTimeout(() => {
        if (isActiveRef.current) {
          // User is inactive but still on tab - start subtle animation
          startAnimation();
        }
      }, INACTIVITY_DELAY);
    };

    const startAnimation = () => {
      if (intervalRef.current) return; // Already running

      intervalRef.current = window.setInterval(() => {
        frameIndexRef.current = (frameIndexRef.current + 1) % FAVICON_FRAMES.length;
        updateFavicon(FAVICON_FRAMES[frameIndexRef.current]);
      }, 500); // Change frame every 500ms
    };

    const stopAnimation = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      frameIndexRef.current = 0;
    };

    const resetFavicon = () => {
      updateFavicon(FAVICON_FRAMES[0]);
    };

    const updateFavicon = (href: string) => {
      if (faviconLinkRef.current) {
        faviconLinkRef.current.href = href;
      }
    };

    // Set up event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('mousemove', handleActivity);
    document.addEventListener('keydown', handleActivity);
    document.addEventListener('click', handleActivity);
    document.addEventListener('scroll', handleActivity);

    // Initial activity timeout
    handleActivity();

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('mousemove', handleActivity);
      document.removeEventListener('keydown', handleActivity);
      document.removeEventListener('click', handleActivity);
      document.removeEventListener('scroll', handleActivity);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (activityTimeout) {
        clearTimeout(activityTimeout);
      }
      
      resetFavicon();
    };
  }, []);
}

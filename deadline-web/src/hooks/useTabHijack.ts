import { useEffect, useRef } from 'react';

/**
 * Tab Hijack Hook
 * Creeps out users when they switch tabs by cycling through ominous messages
 */
export function useTabHijack() {
  const originalTitleRef = useRef<string>('');
  const originalFaviconRef = useRef<string>('');
  const intervalRef = useRef<number | undefined>(undefined);
  const messageIndexRef = useRef(0);

  const creepyMessages = [
    "Don't leave...",
    "I can see you...",
    "The ritual fails...",
    "Come back...",
    "You can't escape...",
    "The deadline awaits..."
  ];

  useEffect(() => {
    // Store original title
    originalTitleRef.current = document.title;

    // Store original favicon
    const faviconLink = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
    if (faviconLink) {
      originalFaviconRef.current = faviconLink.href;
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab is hidden - start the creepy title cycling
        messageIndexRef.current = 0;
        
        // Change favicon to red/danger (you can create a red skull favicon)
        const faviconLink = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
        if (faviconLink) {
          // Using a data URI for a simple red circle as danger indicator
          faviconLink.href = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23dc2626"/><text x="50" y="70" font-size="60" text-anchor="middle" fill="white">!</text></svg>';
        }

        // Cycle through creepy messages
        intervalRef.current = window.setInterval(() => {
          document.title = creepyMessages[messageIndexRef.current];
          messageIndexRef.current = (messageIndexRef.current + 1) % creepyMessages.length;
        }, 1500); // Change message every 1.5 seconds
      } else {
        // Tab is visible - restore original title and favicon
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = undefined;
        }

        document.title = originalTitleRef.current;

        const faviconLink = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
        if (faviconLink && originalFaviconRef.current) {
          faviconLink.href = originalFaviconRef.current;
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      // Restore original title on unmount
      document.title = originalTitleRef.current;
      const faviconLink = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
      if (faviconLink && originalFaviconRef.current) {
        faviconLink.href = originalFaviconRef.current;
      }
    };
  }, []);
}

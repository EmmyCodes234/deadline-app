import { useEffect, useState } from 'react';

/**
 * CursorDebugger - Development tool to identify cursor-blocking elements
 * 
 * Usage: Add <CursorDebugger /> to your App.tsx temporarily
 * Press Ctrl+Shift+C to toggle the debugger
 */
export function CursorDebugger() {
  const [isActive, setIsActive] = useState(false);
  const [overlays, setOverlays] = useState<Array<{
    element: HTMLElement;
    info: string;
    isBlocking: boolean;
  }>>([]);

  // Toggle debugger with Ctrl+Shift+C
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        setIsActive(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Scan for problematic elements when active
  useEffect(() => {
    if (!isActive) {
      setOverlays([]);
      return;
    }

    const scan = () => {
      const allElements = document.querySelectorAll('*');
      const found: typeof overlays = [];

      allElements.forEach(el => {
        const htmlEl = el as HTMLElement;
        const style = window.getComputedStyle(htmlEl);
        const rect = htmlEl.getBoundingClientRect();
        
        // Check if element is full-screen or large
        const isLarge = rect.width >= window.innerWidth * 0.8 || rect.height >= window.innerHeight * 0.8;
        const isFixed = style.position === 'fixed';
        const isAbsolute = style.position === 'absolute';
        const hasHighZIndex = parseInt(style.zIndex) > 100;
        const pointerEvents = style.pointerEvents;
        const cursor = style.cursor;

        // Identify potentially blocking elements
        if ((isFixed || isAbsolute) && isLarge) {
          const isBlocking = pointerEvents !== 'none' && cursor !== 'default';
          
          found.push({
            element: htmlEl,
            info: `${htmlEl.tagName}.${htmlEl.className} | z:${style.zIndex} | pointer:${pointerEvents} | cursor:${cursor}`,
            isBlocking
          });

          // Highlight blocking elements
          if (isBlocking) {
            htmlEl.style.outline = '3px solid red';
            htmlEl.style.outlineOffset = '-3px';
          } else {
            htmlEl.style.outline = '1px dashed yellow';
            htmlEl.style.outlineOffset = '-1px';
          }
        }
      });

      setOverlays(found);
    };

    scan();

    // Cleanup highlights
    return () => {
      overlays.forEach(({ element }) => {
        element.style.outline = '';
        element.style.outlineOffset = '';
      });
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div
      className="fixed top-4 right-4 z-[99999] bg-black/95 text-green-400 p-4 rounded-lg border-2 border-green-400 max-w-md max-h-96 overflow-y-auto font-mono text-xs pointer-events-auto"
      style={{ pointerEvents: 'auto' }}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-sm">🔍 Cursor Debugger</h3>
        <button
          onClick={() => setIsActive(false)}
          className="text-red-400 hover:text-red-300"
        >
          ✕
        </button>
      </div>
      
      <p className="text-xs mb-2 text-gray-400">
        Press Ctrl+Shift+C to toggle
      </p>

      <div className="space-y-2">
        <div className="text-yellow-400">
          Found {overlays.length} large positioned elements
        </div>

        {overlays.map((overlay, i) => (
          <div
            key={i}
            className={`p-2 rounded ${
              overlay.isBlocking ? 'bg-red-900/50 border border-red-500' : 'bg-yellow-900/30 border border-yellow-600'
            }`}
          >
            <div className="font-bold">
              {overlay.isBlocking ? '⚠️ BLOCKING' : '✓ OK'}
            </div>
            <div className="text-xs break-all">{overlay.info}</div>
            {overlay.isBlocking && (
              <button
                onClick={() => {
                  overlay.element.style.pointerEvents = 'none';
                  overlay.element.style.cursor = 'default';
                  setIsActive(false);
                  setTimeout(() => setIsActive(true), 100);
                }}
                className="mt-1 px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-500"
              >
                Fix Now
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * KeyboardShortcutsModal Component
 * Displays available keyboard shortcuts for the Noctuary Editor
 */

import { useEffect, useRef } from 'react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Shortcut {
  keys: string;
  description: string;
  category: string;
}

const shortcuts: Shortcut[] = [
  { keys: 'Cmd/Ctrl + B', description: 'Toggle sidebar visibility', category: 'Navigation' },
  { keys: 'Cmd/Ctrl + S', description: 'Manual save (with visual feedback)', category: 'Document' },
  { keys: 'Cmd/Ctrl + E', description: 'Open export modal', category: 'Document' },
  { keys: 'Cmd/Ctrl + K', description: 'Quick document switcher', category: 'Navigation' },
  { keys: '?', description: 'Show keyboard shortcuts help', category: 'Help' },
  { keys: 'Escape', description: 'Close any open modal or panel', category: 'Navigation' },
];

export function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus trap implementation
  useEffect(() => {
    if (!isOpen) return;

    const modal = modalRef.current;
    if (!modal) return;

    // Focus first element when modal opens
    const focusableElements = modal.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus first element
    firstElement?.focus();

    // Trap focus within modal
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (window.document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (window.document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    modal.addEventListener('keydown', handleKeyDown);

    return () => {
      modal.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Group shortcuts by category
  const categories = Array.from(new Set(shortcuts.map(s => s.category)));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-modal-title"
    >
      <div
        ref={modalRef}
        className="bg-zinc-900 border border-red-900/30 rounded-lg p-8 max-w-2xl w-full mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="shortcuts-modal-title"
          className="text-2xl font-bold text-red-100 mb-6 text-center"
          style={{ fontFamily: 'IM Fell English' }}
        >
          Keyboard Shortcuts
        </h2>

        <div className="space-y-6">
          {categories.map(category => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-red-200/70 uppercase tracking-wider mb-3">
                {category}
              </h3>
              <div className="space-y-2">
                {shortcuts
                  .filter(s => s.category === category)
                  .map((shortcut, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 px-3 bg-zinc-800/50 rounded border border-red-900/20"
                    >
                      <span className="text-red-100/90">{shortcut.description}</span>
                      <kbd className="px-3 py-1 bg-zinc-950 border border-red-900/30 rounded text-red-200 text-sm font-mono">
                        {shortcut.keys}
                      </kbd>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-2 px-4 bg-transparent hover:bg-zinc-800 border border-red-900/30 text-red-200 rounded transition-colors"
          aria-label="Close keyboard shortcuts modal"
        >
          Close
        </button>
      </div>
    </div>
  );
}

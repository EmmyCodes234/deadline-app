/**
 * Accessibility Property-Based Tests
 * Tests for WCAG 2.1 AA compliance including focus indicators, color contrast,
 * ARIA live regions, and modal focus trapping
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import * as fc from 'fast-check';
import { UnifiedNoctuaryEditor } from './UnifiedNoctuaryEditor';
import { ExportModal } from './ExportModal';
import { SnapshotsModal } from './SnapshotsModal';
import { NoctuaryProvider } from '../contexts/NoctuaryContext';
import type { Document } from '../types/noctuary';

// Helper to wrap components with NoctuaryProvider
function renderWithProvider(component: React.ReactElement) {
  return render(
    <NoctuaryProvider>
      {component}
    </NoctuaryProvider>
  );
}

// Helper to calculate color contrast ratio
function getContrastRatio(foreground: string, background: string): number {
  // Parse RGB values from color strings
  const parseColor = (color: string): [number, number, number] => {
    // Handle rgb() format
    const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) {
      return [parseInt(rgbMatch[1]), parseInt(rgbMatch[2]), parseInt(rgbMatch[3])];
    }
    
    // Handle hex format
    const hexMatch = color.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    if (hexMatch) {
      return [
        parseInt(hexMatch[1], 16),
        parseInt(hexMatch[2], 16),
        parseInt(hexMatch[3], 16)
      ];
    }
    
    // Default to black if parsing fails
    return [0, 0, 0];
  };

  const getLuminance = (rgb: [number, number, number]): number => {
    const [r, g, b] = rgb.map(val => {
      const sRGB = val / 255;
      return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const l1 = getLuminance(parseColor(foreground));
  const l2 = getLuminance(parseColor(background));
  
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

// Helper to check if element has visible focus indicator
function hasFocusIndicator(element: HTMLElement): boolean {
  const styles = window.getComputedStyle(element);
  
  // Check for outline
  const outlineWidth = parseFloat(styles.outlineWidth);
  const outlineStyle = styles.outlineStyle;
  if (outlineWidth >= 2 && outlineStyle !== 'none') {
    return true;
  }
  
  // Check for border
  const borderWidth = parseFloat(styles.borderWidth);
  if (borderWidth >= 2) {
    return true;
  }
  
  // Check for box-shadow (common focus indicator)
  const boxShadow = styles.boxShadow;
  if (boxShadow && boxShadow !== 'none') {
    return true;
  }
  
  return false;
}

describe('Accessibility Property Tests', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  /**
   * Feature: noctuary-editor-redesign, Property 13: Focus indicator visibility
   * Validates: Requirements 6.2
   */
  describe('Property 13: Focus indicator visibility', () => {
    it('should have visible focus indicators (2px minimum) on all interactive elements', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(
            'button',
            'input',
            'textarea',
            '[contenteditable="true"]',
            'a[href]'
          ),
          async (selector) => {
            const { container } = renderWithProvider(<UnifiedNoctuaryEditor />);
            
            // Find all interactive elements of this type
            const elements = container.querySelectorAll(selector);
            
            if (elements.length === 0) {
              // If no elements found, test passes (nothing to check)
              return true;
            }
            
            // Test each element
            for (const element of Array.from(elements)) {
              if (element instanceof HTMLElement) {
                // Focus the element
                element.focus();
                
                // Check if it has a visible focus indicator
                const hasIndicator = hasFocusIndicator(element);
                
                if (!hasIndicator) {
                  console.error(`Element missing focus indicator:`, element);
                  return false;
                }
              }
            }
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should maintain focus indicators when tabbing through interface', async () => {
      const user = userEvent.setup();
      renderWithProvider(<UnifiedNoctuaryEditor />);
      
      // Tab through multiple elements
      for (let i = 0; i < 10; i++) {
        await user.tab();
        
        const focusedElement = document.activeElement as HTMLElement;
        if (focusedElement && focusedElement !== document.body) {
          const hasIndicator = hasFocusIndicator(focusedElement);
          expect(hasIndicator).toBe(true);
        }
      }
    });
  });

  /**
   * Feature: noctuary-editor-redesign, Property 14: Color contrast compliance
   * Validates: Requirements 6.3
   */
  describe('Property 14: Color contrast compliance', () => {
    it('should maintain 4.5:1 contrast ratio for all text elements', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(
            'p', 'span', 'div', 'button', 'a', 'label', 'h1', 'h2', 'h3'
          ),
          (selector) => {
            const { container } = renderWithProvider(<UnifiedNoctuaryEditor />);
            
            // Find all text elements
            const elements = container.querySelectorAll(selector);
            
            if (elements.length === 0) {
              return true;
            }
            
            // Check each element's contrast
            for (const element of Array.from(elements)) {
              if (element instanceof HTMLElement && element.textContent?.trim()) {
                const styles = window.getComputedStyle(element);
                const color = styles.color;
                const backgroundColor = styles.backgroundColor;
                
                // Skip if background is transparent (inherit from parent)
                if (backgroundColor === 'rgba(0, 0, 0, 0)' || backgroundColor === 'transparent') {
                  continue;
                }
                
                const ratio = getContrastRatio(color, backgroundColor);
                
                // WCAG 2.1 AA requires 4.5:1 for normal text
                if (ratio < 4.5) {
                  console.error(`Low contrast ratio ${ratio.toFixed(2)}:1 for element:`, element);
                  return false;
                }
              }
            }
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should have sufficient contrast for all button states', async () => {
      const user = userEvent.setup();
      const { container } = renderWithProvider(<UnifiedNoctuaryEditor />);
      
      const buttons = container.querySelectorAll('button');
      
      for (const button of Array.from(buttons)) {
        if (button instanceof HTMLElement && button.textContent?.trim()) {
          // Check default state
          const defaultStyles = window.getComputedStyle(button);
          const defaultRatio = getContrastRatio(defaultStyles.color, defaultStyles.backgroundColor);
          expect(defaultRatio).toBeGreaterThanOrEqual(4.5);
          
          // Check hover state
          await user.hover(button);
          const hoverStyles = window.getComputedStyle(button);
          const hoverRatio = getContrastRatio(hoverStyles.color, hoverStyles.backgroundColor);
          expect(hoverRatio).toBeGreaterThanOrEqual(4.5);
        }
      }
    });
  });

  /**
   * Feature: noctuary-editor-redesign, Property 15: ARIA live region updates
   * Validates: Requirements 6.4
   */
  describe('Property 15: ARIA live region updates', () => {
    it('should announce save status changes to screen readers', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('saving', 'saved', 'error'),
          (status) => {
            renderWithProvider(<UnifiedNoctuaryEditor />);
            
            // Find ARIA live region
            const liveRegion = screen.queryByRole('status');
            
            if (!liveRegion) {
              console.error('No ARIA live region found');
              return false;
            }
            
            // Check ARIA attributes
            const ariaLive = liveRegion.getAttribute('aria-live');
            const ariaAtomic = liveRegion.getAttribute('aria-atomic');
            
            if (ariaLive !== 'polite' && ariaLive !== 'assertive') {
              console.error('Invalid aria-live value:', ariaLive);
              return false;
            }
            
            if (ariaAtomic !== 'true') {
              console.error('aria-atomic should be true');
              return false;
            }
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should have ARIA live regions for all status updates', () => {
      renderWithProvider(<UnifiedNoctuaryEditor />);
      
      // Check for status live region
      const statusRegion = screen.queryByRole('status');
      expect(statusRegion).toBeTruthy();
      expect(statusRegion?.getAttribute('aria-live')).toBeTruthy();
    });
  });

  /**
   * Feature: noctuary-editor-redesign, Property 16: Modal focus trap
   * Validates: Requirements 6.5
   */
  describe('Property 16: Modal focus trap', () => {
    it('should trap focus within export modal', async () => {
      const user = userEvent.setup();
      const mockDocument: Document = {
        id: '1',
        title: 'Test Document',
        content: 'Test content',
        folderId: null,
        tags: [],
        wordGoal: null,
        synopsis: '',
        snapshots: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const { container } = render(
        <ExportModal
          isOpen={true}
          onClose={() => {}}
          document={mockDocument}
        />
      );

      // Get all focusable elements within modal
      const modal = container.querySelector('[role="dialog"]');
      expect(modal).toBeTruthy();

      const focusableElements = modal?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (!focusableElements || focusableElements.length === 0) {
        throw new Error('No focusable elements in modal');
      }

      // Tab through all elements
      for (let i = 0; i < focusableElements.length + 2; i++) {
        await user.tab();
        
        const activeElement = document.activeElement;
        
        // Check that focus is still within modal
        const isWithinModal = modal?.contains(activeElement);
        expect(isWithinModal).toBe(true);
      }
    });

    it('should trap focus within snapshots modal', async () => {
      const user = userEvent.setup();
      const mockDocument: Document = {
        id: '1',
        title: 'Test Document',
        content: 'Test content',
        folderId: null,
        tags: [],
        wordGoal: null,
        synopsis: '',
        snapshots: [
          {
            id: 'snap1',
            content: 'Snapshot content',
            wordCount: 2,
            timestamp: Date.now(),
          },
        ],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const { container } = render(
        <SnapshotsModal
          isOpen={true}
          onClose={() => {}}
          document={mockDocument}
          onCreateSnapshot={() => {}}
          onRestoreSnapshot={() => {}}
          onDeleteSnapshot={() => {}}
        />
      );

      const modal = container.querySelector('[role="dialog"]') || container.firstChild;
      expect(modal).toBeTruthy();

      // Tab through elements and verify focus stays in modal
      for (let i = 0; i < 10; i++) {
        await user.tab();
        
        const activeElement = document.activeElement;
        const isWithinModal = modal?.contains(activeElement);
        
        // Focus should remain within modal
        expect(isWithinModal).toBe(true);
      }
    });

    it('should prevent focus from escaping modal with Tab key', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 20 }),
          async (tabCount) => {
            const user = userEvent.setup();
            const mockDocument: Document = {
              id: '1',
              title: 'Test',
              content: 'Content',
              folderId: null,
              tags: [],
              wordGoal: null,
              synopsis: '',
              snapshots: [],
              createdAt: Date.now(),
              updatedAt: Date.now(),
            };

            const { container } = render(
              <ExportModal
                isOpen={true}
                onClose={() => {}}
                document={mockDocument}
              />
            );

            const modal = container.querySelector('[role="dialog"]');
            
            // Tab multiple times
            for (let i = 0; i < tabCount; i++) {
              await user.tab();
            }

            // Focus should still be within modal
            const activeElement = document.activeElement;
            const isWithinModal = modal?.contains(activeElement);
            
            return isWithinModal === true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});

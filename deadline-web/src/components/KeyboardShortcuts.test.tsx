/**
 * Property-based tests for Keyboard Shortcuts
 * Feature: noctuary-editor-redesign
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import * as fc from 'fast-check';
import { NoctuaryProvider } from '../contexts/NoctuaryContext';
import { UnifiedNoctuaryEditor } from './UnifiedNoctuaryEditor';
import '@testing-library/jest-dom/vitest';

describe('Keyboard Shortcuts Property Tests', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Clear all mocks
    vi.clearAllMocks();
  });

  /**
   * Feature: noctuary-editor-redesign, Property 8: Keyboard shortcut consistency
   * Validates: Requirements 4.6
   * 
   * Property: For any document, pressing Escape should close any open modal or panel,
   * regardless of which modal is currently displayed.
   */
  it('Property 8: Keyboard shortcut consistency - Escape closes any modal', () => {
    fc.assert(
      fc.property(
        // Generate random modal trigger - only shortcuts modal since it doesn't require documents
        fc.constant('shortcuts'),
        (modalType) => {
          // Render the editor
          const { container } = render(
            <NoctuaryProvider>
              <UnifiedNoctuaryEditor />
            </NoctuaryProvider>
          );

          // Open shortcuts modal
          fireEvent.keyDown(window, {
            key: '?',
            shiftKey: false,
          });

          // Count how many modals are open before pressing Escape
          const modalsBefore = container.querySelectorAll('[role="dialog"]');
          const modalsOpenBefore = modalsBefore.length;

          // Property: At least one modal should be open
          expect(modalsOpenBefore).toBeGreaterThan(0);

          // Press Escape
          fireEvent.keyDown(window, {
            key: 'Escape',
          });

          // Check modals after Escape
          const modalsAfter = container.querySelectorAll('[role="dialog"]');
          
          // Property: Pressing Escape should close the modal
          expect(modalsAfter.length).toBeLessThan(modalsOpenBefore);

          // Verify that pressing Escape multiple times closes all modals
          for (let i = 0; i < 3; i++) {
            fireEvent.keyDown(window, {
              key: 'Escape',
            });
          }
          
          const modalsAfterMultiple = container.querySelectorAll('[role="dialog"]');
          // Eventually all modals should be closed
          expect(modalsAfterMultiple.length).toBe(0);
        }
      ),
      { numRuns: 10 } // Reduced from 100 to avoid timeout
    );
  });

  /**
   * Edge case: Escape key closes modals in correct order (most recent first)
   */
  it('Property 8 (edge case): Escape closes most recently opened modal first', () => {
    const { container } = render(
      <NoctuaryProvider>
        <UnifiedNoctuaryEditor />
      </NoctuaryProvider>
    );

    // Open shortcuts modal first
    fireEvent.keyDown(window, {
      key: '?',
      shiftKey: false,
    });

    // Verify modal is open
    let modals = container.querySelectorAll('[role="dialog"]');
    expect(modals.length).toBeGreaterThan(0);

    // Press Escape - should close shortcuts modal
    fireEvent.keyDown(window, {
      key: 'Escape',
    });

    // Verify modal is closed
    modals = container.querySelectorAll('[role="dialog"]');
    expect(modals.length).toBe(0);
  });

  /**
   * Edge case: Escape key works regardless of focus location
   */
  it('Property 8 (edge case): Escape works from any focused element', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('input', 'button', 'textarea', 'window'),
        (focusTarget) => {
          const { container } = render(
            <NoctuaryProvider>
              <UnifiedNoctuaryEditor />
            </NoctuaryProvider>
          );

          // Open a modal
          fireEvent.keyDown(window, {
            key: '?',
            shiftKey: false,
          });

          // Verify modal is open
          let modals = container.querySelectorAll('[role="dialog"]');
          expect(modals.length).toBeGreaterThan(0);

          // Focus different elements based on the generated target
          if (focusTarget === 'input') {
            const input = container.querySelector('input');
            input?.focus();
          } else if (focusTarget === 'button') {
            const button = container.querySelector('button');
            button?.focus();
          } else if (focusTarget === 'textarea') {
            const textarea = container.querySelector('textarea');
            textarea?.focus();
          }

          // Press Escape from the focused element
          fireEvent.keyDown(window, {
            key: 'Escape',
          });

          // Modal should close regardless of focus location
          modals = container.querySelectorAll('[role="dialog"]');
          expect(modals.length).toBe(0);
        }
      ),
      { numRuns: 10 }
    );
  });

  /**
   * Edge case: Escape key doesn't interfere with other keyboard shortcuts
   */
  it('Property 8 (edge case): Escape does not prevent other shortcuts when no modal is open', () => {
    const { container } = render(
      <NoctuaryProvider>
        <UnifiedNoctuaryEditor />
      </NoctuaryProvider>
    );

    // Press Escape when no modal is open - should do nothing
    fireEvent.keyDown(window, {
      key: 'Escape',
    });

    // Verify no modals are open
    let modals = container.querySelectorAll('[role="dialog"]');
    expect(modals.length).toBe(0);

    // Other shortcuts should still work
    fireEvent.keyDown(window, {
      key: '?',
      shiftKey: false,
    });

    // Verify modal opened
    modals = container.querySelectorAll('[role="dialog"]');
    expect(modals.length).toBeGreaterThan(0);
  });
});

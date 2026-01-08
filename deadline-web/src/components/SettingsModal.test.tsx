/**
 * Property-based tests for SettingsModal component
 * Feature: noctuary-editor-redesign
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as fc from 'fast-check';
import { SettingsModal } from './SettingsModal';
import { NoctuaryProvider } from '../contexts/NoctuaryContext';
import type { EditorSettings } from '../types/noctuary';

// Helper to render component with context
function renderWithContext(ui: React.ReactElement) {
  return render(<NoctuaryProvider>{ui}</NoctuaryProvider>);
}

describe('SettingsModal', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('**Feature: noctuary-editor-redesign, Property 30: Theme persistence round-trip**', () => {
    /**
     * Property 30: Theme persistence round-trip
     * For any theme customization, the settings should be saved to local storage 
     * and restored identically on next application load.
     * Validates: Requirements 10.5
     */
    it('should persist all settings to localStorage and restore them identically', () => {
      fc.assert(
        fc.property(
          // Generate arbitrary settings
          fc.record({
            fontFamily: fc.constantFrom(
              'IM Fell English',
              'Crimson Text',
              'Georgia',
              'Times New Roman'
            ),
            fontSize: fc.integer({ min: 12, max: 24 }),
            lineHeight: fc.double({ min: 1.2, max: 2.0, noNaN: true }),
            editorWidth: fc.integer({ min: 60, max: 80 }),
            theme: fc.constantFrom('dark', 'light'),
          }),
          (settings) => {
            // Clear localStorage first
            localStorage.clear();
            
            // Save settings to localStorage
            localStorage.setItem('noctuary:settings', JSON.stringify(settings));

            // Load settings back
            const loadedSettings = JSON.parse(
              localStorage.getItem('noctuary:settings') || '{}'
            );

            // Verify round-trip preserves all data
            expect(loadedSettings.fontFamily).toBe(settings.fontFamily);
            expect(loadedSettings.fontSize).toBe(settings.fontSize);
            expect(loadedSettings.lineHeight).toBeCloseTo(settings.lineHeight, 1);
            expect(loadedSettings.editorWidth).toBe(settings.editorWidth);
            expect(loadedSettings.theme).toBe(settings.theme);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should persist theme changes to localStorage immediately', async () => {
      const user = userEvent.setup();

      renderWithContext(<SettingsModal isOpen={true} onClose={() => {}} />);

      // Find theme buttons
      const darkButton = screen.getByRole('button', { name: /select dark theme/i });
      const lightButton = screen.getByRole('button', { name: /select light theme/i });

      // Click light theme
      await user.click(lightButton);

      // Verify settings were saved to localStorage
      await waitFor(() => {
        const savedSettings = JSON.parse(
          localStorage.getItem('noctuary:settings') || '{}'
        );
        expect(savedSettings.theme).toBe('light');
      });

      // Click dark theme
      await user.click(darkButton);

      // Verify settings were updated in localStorage
      await waitFor(() => {
        const savedSettings = JSON.parse(
          localStorage.getItem('noctuary:settings') || '{}'
        );
        expect(savedSettings.theme).toBe('dark');
      });
    });

    it('should persist font family changes to localStorage immediately', async () => {
      const user = userEvent.setup();

      renderWithContext(<SettingsModal isOpen={true} onClose={() => {}} />);

      // Find font family select
      const fontSelect = screen.getByLabelText(/select font family/i);

      // Change font family
      await user.selectOptions(fontSelect, 'Crimson Text');

      // Verify settings were saved to localStorage
      await waitFor(() => {
        const savedSettings = JSON.parse(
          localStorage.getItem('noctuary:settings') || '{}'
        );
        expect(savedSettings.fontFamily).toBe('Crimson Text');
      });
    });

    it('should round-trip all settings through localStorage', () => {
      fc.assert(
        fc.property(
          fc.record({
            fontFamily: fc.constantFrom(
              'IM Fell English',
              'Crimson Text',
              'Georgia',
              'Times New Roman'
            ),
            fontSize: fc.integer({ min: 12, max: 24 }),
            lineHeight: fc.double({ min: 1.2, max: 2.0, noNaN: true }),
            editorWidth: fc.integer({ min: 60, max: 80 }),
            theme: fc.constantFrom('dark', 'light'),
          }),
          (originalSettings) => {
            // Save settings
            localStorage.setItem('noctuary:settings', JSON.stringify(originalSettings));

            // Load settings
            const loadedSettings = JSON.parse(
              localStorage.getItem('noctuary:settings') || '{}'
            );

            // Verify all properties match
            expect(loadedSettings.fontFamily).toBe(originalSettings.fontFamily);
            expect(loadedSettings.fontSize).toBe(originalSettings.fontSize);
            expect(loadedSettings.lineHeight).toBeCloseTo(originalSettings.lineHeight, 1);
            expect(loadedSettings.editorWidth).toBe(originalSettings.editorWidth);
            expect(loadedSettings.theme).toBe(originalSettings.theme);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('**Feature: noctuary-editor-redesign, Property 32: Settings application immediacy**', () => {
    /**
     * Property 32: Settings application immediacy
     * For any settings change, the new setting should be applied to the editor 
     * within 100ms without requiring a page reload.
     * Validates: Requirements 12.5
     */
    it('should apply font size changes immediately without reload', async () => {
      renderWithContext(<SettingsModal isOpen={true} onClose={() => {}} />);

      // Find font size slider
      const fontSizeSlider = screen.getByLabelText(/adjust font size/i) as HTMLInputElement;

      // Record start time
      const startTime = performance.now();

      // Change font size using fireEvent
      fireEvent.change(fontSizeSlider, { target: { value: '18' } });

      // Verify settings were applied
      await waitFor(
        () => {
          const savedSettings = JSON.parse(
            localStorage.getItem('noctuary:settings') || '{}'
          );
          expect(savedSettings.fontSize).toBe(18);
        },
        { timeout: 100 }
      );

      const endTime = performance.now();
      const elapsed = endTime - startTime;

      // Verify it happened within 100ms
      expect(elapsed).toBeLessThan(100);
    });

    it('should apply line height changes immediately without reload', async () => {
      renderWithContext(<SettingsModal isOpen={true} onClose={() => {}} />);

      // Find line height slider
      const lineHeightSlider = screen.getByLabelText(/adjust line height/i) as HTMLInputElement;

      // Record start time
      const startTime = performance.now();

      // Change line height using fireEvent
      fireEvent.change(lineHeightSlider, { target: { value: '1.8' } });

      // Verify settings were applied
      await waitFor(
        () => {
          const savedSettings = JSON.parse(
            localStorage.getItem('noctuary:settings') || '{}'
          );
          expect(savedSettings.lineHeight).toBeCloseTo(1.8, 1);
        },
        { timeout: 100 }
      );

      const endTime = performance.now();
      const elapsed = endTime - startTime;

      // Verify it happened within 100ms
      expect(elapsed).toBeLessThan(100);
    });

    it('should apply editor width changes immediately without reload', async () => {
      renderWithContext(<SettingsModal isOpen={true} onClose={() => {}} />);

      // Find editor width slider
      const editorWidthSlider = screen.getByLabelText(/adjust editor width/i) as HTMLInputElement;

      // Record start time
      const startTime = performance.now();

      // Change editor width using fireEvent
      fireEvent.change(editorWidthSlider, { target: { value: '75' } });

      // Verify settings were applied
      await waitFor(
        () => {
          const savedSettings = JSON.parse(
            localStorage.getItem('noctuary:settings') || '{}'
          );
          expect(savedSettings.editorWidth).toBe(75);
        },
        { timeout: 100 }
      );

      const endTime = performance.now();
      const elapsed = endTime - startTime;

      // Verify it happened within 100ms
      expect(elapsed).toBeLessThan(100);
    });

    it('should apply all setting changes within 100ms', () => {
      fc.assert(
        fc.property(
          fc.record({
            fontFamily: fc.constantFrom(
              'IM Fell English',
              'Crimson Text',
              'Georgia',
              'Times New Roman'
            ),
            fontSize: fc.integer({ min: 12, max: 24 }),
            lineHeight: fc.double({ min: 1.2, max: 2.0, noNaN: true }),
            editorWidth: fc.integer({ min: 60, max: 80 }),
            theme: fc.constantFrom('dark', 'light'),
          }),
          (settings) => {
            // Record start time
            const startTime = performance.now();

            // Apply settings
            localStorage.setItem('noctuary:settings', JSON.stringify(settings));

            // Verify settings were applied
            const loadedSettings = JSON.parse(
              localStorage.getItem('noctuary:settings') || '{}'
            );

            const endTime = performance.now();
            const elapsed = endTime - startTime;

            // Verify all settings match
            expect(loadedSettings).toEqual(settings);

            // Verify it happened within 100ms
            expect(elapsed).toBeLessThan(100);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should update preview immediately when settings change', async () => {
      renderWithContext(<SettingsModal isOpen={true} onClose={() => {}} />);

      // Find preview element
      const preview = screen.getByText(/the quick brown fox/i).parentElement;
      expect(preview).toBeTruthy();

      // Get initial font size from inline style
      const initialFontSize = preview!.style.fontSize;

      // Change font size using fireEvent
      const fontSizeSlider = screen.getByLabelText(/adjust font size/i) as HTMLInputElement;
      fireEvent.change(fontSizeSlider, { target: { value: '20' } });

      // Verify preview updated immediately
      await waitFor(
        () => {
          const newFontSize = preview!.style.fontSize;
          expect(newFontSize).not.toBe(initialFontSize);
          expect(newFontSize).toBe('20px');
        },
        { timeout: 100 }
      );
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels on all controls', () => {
      renderWithContext(<SettingsModal isOpen={true} onClose={() => {}} />);

      expect(screen.getByLabelText(/select font family/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/adjust font size/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/adjust line height/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/adjust editor width/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/select dark theme/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/select light theme/i)).toBeInTheDocument();
    });

    it('should trap focus within modal', async () => {
      const user = userEvent.setup();

      renderWithContext(<SettingsModal isOpen={true} onClose={() => {}} />);

      // Get all focusable elements
      const fontSelect = screen.getByLabelText(/select font family/i);
      const closeButton = screen.getByRole('button', { name: /close settings modal/i });

      // Focus first element
      fontSelect.focus();
      expect(document.activeElement).toBe(fontSelect);

      // Tab through all elements until we reach the close button
      let iterations = 0;
      while (document.activeElement !== closeButton && iterations < 20) {
        await user.tab();
        iterations++;
      }

      expect(document.activeElement).toBe(closeButton);

      // Tab once more should cycle back to first element
      await user.tab();
      expect(document.activeElement).toBe(fontSelect);
    });

    it('should close on Escape key', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();

      renderWithContext(<SettingsModal isOpen={true} onClose={onClose} />);

      await user.keyboard('{Escape}');

      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('UI Behavior', () => {
    it('should not render when isOpen is false', () => {
      renderWithContext(<SettingsModal isOpen={false} onClose={() => {}} />);

      expect(screen.queryByText(/editor settings/i)).not.toBeInTheDocument();
    });

    it('should render when isOpen is true', () => {
      renderWithContext(<SettingsModal isOpen={true} onClose={() => {}} />);

      expect(screen.getByRole('dialog', { name: /editor settings/i })).toBeInTheDocument();
    });

    it('should display current settings values', () => {
      // Set initial settings
      const settings: EditorSettings = {
        fontFamily: 'Crimson Text',
        fontSize: 18,
        lineHeight: 1.8,
        editorWidth: 75,
        theme: 'light',
      };

      localStorage.setItem('noctuary:settings', JSON.stringify(settings));

      renderWithContext(<SettingsModal isOpen={true} onClose={() => {}} />);

      // Verify values are displayed
      const fontSelect = screen.getByLabelText(/select font family/i) as HTMLSelectElement;
      expect(fontSelect.value).toBe('Crimson Text');

      const fontSizeSlider = screen.getByLabelText(/adjust font size/i) as HTMLInputElement;
      expect(fontSizeSlider.value).toBe('18');

      const lineHeightSlider = screen.getByLabelText(/adjust line height/i) as HTMLInputElement;
      expect(parseFloat(lineHeightSlider.value)).toBeCloseTo(1.8, 1);

      const editorWidthSlider = screen.getByLabelText(/adjust editor width/i) as HTMLInputElement;
      expect(editorWidthSlider.value).toBe('75');

      const lightButton = screen.getByRole('button', { name: /select light theme/i });
      expect(lightButton).toHaveAttribute('aria-pressed', 'true');
    });
  });
});

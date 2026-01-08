/**
 * Property-Based Tests for EditorCanvas Component
 * Feature: noctuary-editor-redesign
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { act } from 'react';
import * as fc from 'fast-check';
import { EditorCanvas } from './EditorCanvas';
import { NoctuaryProvider } from '../contexts/NoctuaryContext';
import type { Document, EditorSettings } from '../types/noctuary';

// Mock document generator
const documentArbitrary = fc.record({
  id: fc.uuid(),
  title: fc.string({ minLength: 1, maxLength: 200 }),
  content: fc.string({ maxLength: 1000 }),
  folderId: fc.constantFrom(null, fc.uuid()),
  tags: fc.array(fc.string({ minLength: 1, maxLength: 20 }), { maxLength: 10 }),
  wordGoal: fc.constantFrom(null, fc.integer({ min: 100, max: 10000 })),
  synopsis: fc.string({ maxLength: 1000 }),
  snapshots: fc.constant([]),
  createdAt: fc.integer({ min: 1000000000000, max: Date.now() }),
  updatedAt: fc.integer({ min: 1000000000000, max: Date.now() }),
});

// Mock settings generator
const settingsArbitrary = fc.record({
  fontFamily: fc.constantFrom('IM Fell English', 'Crimson Text', 'Georgia', 'Times New Roman'),
  fontSize: fc.integer({ min: 12, max: 24 }),
  lineHeight: fc.double({ min: 1.2, max: 2.0 }),
  editorWidth: fc.integer({ min: 60, max: 80 }),
  theme: fc.constantFrom('dark' as const, 'light' as const),
});

// Helper to render EditorCanvas with context
function renderEditorCanvas(
  document: Document | null,
  onContentChange: (content: string) => void,
  onTitleChange: (title: string) => void,
  settings: EditorSettings,
  isFocused: boolean = false,
  onFocusChange: (focused: boolean) => void = vi.fn()
) {
  return render(
    <NoctuaryProvider>
      <EditorCanvas
        document={document}
        onContentChange={onContentChange}
        onTitleChange={onTitleChange}
        settings={settings}
        isFocused={isFocused}
        onFocusChange={onFocusChange}
      />
    </NoctuaryProvider>
  );
}

describe('EditorCanvas Property-Based Tests', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  /**
   * Feature: noctuary-editor-redesign, Property 2: Auto-save timing guarantee
   * Validates: Requirements 2.1
   */
  it('Property 2: Auto-save timing guarantee - saves within 500ms', () => {
    fc.assert(
      fc.property(
        documentArbitrary,
        settingsArbitrary,
        fc.string({ minLength: 1, maxLength: 500 }),
        (doc, settings, newContent) => {
          const onContentChange = vi.fn();
          const onTitleChange = vi.fn();

          const { container } = renderEditorCanvas(
            doc,
            onContentChange,
            onTitleChange,
            settings
          );

          const contentEditor = container.querySelector('.editor-content') as HTMLDivElement;
          expect(contentEditor).toBeTruthy();

          act(() => {
            contentEditor.textContent = newContent;
            contentEditor.dispatchEvent(new Event('input', { bubbles: true }));
          });

          expect(onContentChange).not.toHaveBeenCalled();

          act(() => {
            vi.advanceTimersByTime(499);
          });
          expect(onContentChange).not.toHaveBeenCalled();

          act(() => {
            vi.advanceTimersByTime(1);
          });
          expect(onContentChange).toHaveBeenCalledWith(newContent);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: noctuary-editor-redesign, Property 2: Auto-save timing guarantee
   * Validates: Requirements 2.1
   */
  it('Property 2: Auto-save timing guarantee - debounces multiple keystrokes', () => {
    fc.assert(
      fc.property(
        documentArbitrary,
        settingsArbitrary,
        fc.array(fc.string({ minLength: 1, maxLength: 100 }), { minLength: 2, maxLength: 10 }),
        (doc, settings, contentChanges) => {
          const onContentChange = vi.fn();
          const onTitleChange = vi.fn();

          const { container } = renderEditorCanvas(
            doc,
            onContentChange,
            onTitleChange,
            settings
          );

          const contentEditor = container.querySelector('.editor-content') as HTMLDivElement;
          expect(contentEditor).toBeTruthy();

          contentChanges.forEach((content, index) => {
            act(() => {
              contentEditor.textContent = content;
              contentEditor.dispatchEvent(new Event('input', { bubbles: true }));
            });

            if (index < contentChanges.length - 1) {
              act(() => {
                vi.advanceTimersByTime(100);
              });
            }
          });

          expect(onContentChange).not.toHaveBeenCalled();

          act(() => {
            vi.advanceTimersByTime(500);
          });

          expect(onContentChange).toHaveBeenCalledTimes(1);
          expect(onContentChange).toHaveBeenCalledWith(contentChanges[contentChanges.length - 1]);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: noctuary-editor-redesign, Property 3: Save status indicator accuracy
   * Validates: Requirements 2.2, 2.3
   */
  it('Property 3: Save status indicator accuracy - shows correct status during save', () => {
    fc.assert(
      fc.property(
        documentArbitrary,
        settingsArbitrary,
        fc.string({ minLength: 1, maxLength: 500 }),
        (doc, settings, newContent) => {
          vi.useFakeTimers();
          
          try {
            const onContentChange = vi.fn();
            const onTitleChange = vi.fn();

            const { container } = renderEditorCanvas(
              doc,
              onContentChange,
              onTitleChange,
              settings
            );

            const contentEditor = container.querySelector('.editor-content') as HTMLDivElement;
            const saveStatus = container.querySelector('.save-status') as HTMLDivElement;
            
            expect(contentEditor).toBeTruthy();
            expect(saveStatus).toBeTruthy();

            const initialStatus = saveStatus.textContent;
            expect(initialStatus === '' || initialStatus === 'Saved').toBe(true);

            act(() => {
              contentEditor.textContent = newContent;
              contentEditor.dispatchEvent(new Event('input', { bubbles: true }));
            });

            expect(saveStatus.textContent).toBe('Saving...');

            act(() => {
              vi.advanceTimersByTime(500);
            });

            expect(saveStatus.textContent).toBe('Saved');

            act(() => {
              vi.advanceTimersByTime(1999);
            });
            expect(saveStatus.textContent).toBe('Saved');

            act(() => {
              vi.advanceTimersByTime(1);
            });
            expect(saveStatus.textContent).toBe('Saved');
          } finally {
            vi.useRealTimers();
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: noctuary-editor-redesign, Property 3: Save status indicator accuracy
   * Validates: Requirements 2.2, 2.3
   */
  it('Property 3: Save status indicator accuracy - resets timer on multiple saves', () => {
    fc.assert(
      fc.property(
        documentArbitrary,
        settingsArbitrary,
        fc.array(fc.string({ minLength: 1, maxLength: 100 }), { minLength: 2, maxLength: 5 }),
        (doc, settings, contentChanges) => {
          vi.useFakeTimers();
          
          try {
            const onContentChange = vi.fn();
            const onTitleChange = vi.fn();

            const { container } = renderEditorCanvas(
              doc,
              onContentChange,
              onTitleChange,
              settings
            );

            const contentEditor = container.querySelector('.editor-content') as HTMLDivElement;
            const saveStatus = container.querySelector('.save-status') as HTMLDivElement;

            contentChanges.forEach((content, index) => {
              act(() => {
                contentEditor.textContent = content;
                contentEditor.dispatchEvent(new Event('input', { bubbles: true }));
              });

              expect(saveStatus.textContent).toBe('Saving...');

              act(() => {
                vi.advanceTimersByTime(500);
              });

              expect(saveStatus.textContent).toBe('Saved');

              if (index < contentChanges.length - 1) {
                act(() => {
                  vi.advanceTimersByTime(1000);
                });
              }
            });

            act(() => {
              vi.advanceTimersByTime(2000);
            });

            expect(saveStatus.textContent).toBe('Saved');
          } finally {
            vi.useRealTimers();
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: noctuary-editor-redesign, Property 4: Unsaved changes protection
   * Validates: Requirements 2.4
   */
  it('Property 4: Unsaved changes protection - prevents navigation with unsaved changes', () => {
    fc.assert(
      fc.property(
        documentArbitrary,
        settingsArbitrary,
        fc.string({ minLength: 1, maxLength: 500 }),
        (doc, settings, newContent) => {
          vi.useFakeTimers();
          
          try {
            const onContentChange = vi.fn();
            const onTitleChange = vi.fn();

            renderEditorCanvas(
              doc,
              onContentChange,
              onTitleChange,
              settings
            );

            const beforeUnloadEvent = new Event('beforeunload', { cancelable: true }) as BeforeUnloadEvent;
            
            window.dispatchEvent(beforeUnloadEvent);
            expect(beforeUnloadEvent.defaultPrevented).toBe(false);

            const contentEditor = document.querySelector('.editor-content') as HTMLDivElement;
            act(() => {
              contentEditor.textContent = newContent;
              contentEditor.dispatchEvent(new Event('input', { bubbles: true }));
            });

            const beforeUnloadEventDuringSave = new Event('beforeunload', { cancelable: true }) as BeforeUnloadEvent;
            Object.defineProperty(beforeUnloadEventDuringSave, 'returnValue', {
              writable: true,
              value: '',
            });
            window.dispatchEvent(beforeUnloadEventDuringSave);
            expect(beforeUnloadEventDuringSave.defaultPrevented).toBe(true);

            act(() => {
              vi.advanceTimersByTime(500);
            });

            const beforeUnloadEventAfterSave = new Event('beforeunload', { cancelable: true }) as BeforeUnloadEvent;
            window.dispatchEvent(beforeUnloadEventAfterSave);
            expect(beforeUnloadEventAfterSave.defaultPrevented).toBe(false);
          } finally {
            vi.useRealTimers();
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: noctuary-editor-redesign, Property 28: No disruptive typing effects
   * Validates: Requirements 10.2
   */
  it('Property 28: No disruptive typing effects - no CSS transforms on typing', () => {
    fc.assert(
      fc.property(
        documentArbitrary,
        settingsArbitrary,
        fc.array(fc.string({ minLength: 1, maxLength: 50 }), { minLength: 1, maxLength: 5 }),
        (doc, settings, keystrokes) => {
          const onContentChange = vi.fn();
          const onTitleChange = vi.fn();

          const { container } = renderEditorCanvas(
            doc,
            onContentChange,
            onTitleChange,
            settings
          );

          const contentEditor = container.querySelector('.editor-content') as HTMLDivElement;
          const editorCanvas = container.querySelector('.editor-canvas') as HTMLDivElement;
          
          expect(contentEditor).toBeTruthy();
          expect(editorCanvas).toBeTruthy();

          keystrokes.forEach((content) => {
            act(() => {
              contentEditor.textContent = content;
              contentEditor.dispatchEvent(new Event('input', { bubbles: true }));
            });

            const editorStyle = window.getComputedStyle(contentEditor);
            const canvasStyle = window.getComputedStyle(editorCanvas);
            const rootStyle = window.getComputedStyle(document.documentElement);

            const validTransforms = /^(none|matrix\(1,\s*0,\s*0,\s*1,\s*0,\s*0\)|)$/;
            expect(editorStyle.transform).toMatch(validTransforms);
            expect(canvasStyle.transform).toMatch(validTransforms);
            expect(rootStyle.transform).toMatch(validTransforms);

            if (editorStyle.transform && editorStyle.transform !== 'none') {
              expect(editorStyle.transform).not.toContain('translate');
            }
            if (canvasStyle.transform && canvasStyle.transform !== 'none') {
              expect(canvasStyle.transform).not.toContain('translate');
            }
            
            if (editorStyle.transform && editorStyle.transform !== 'none') {
              expect(editorStyle.transform).not.toContain('rotate');
            }
            if (canvasStyle.transform && canvasStyle.transform !== 'none') {
              expect(canvasStyle.transform).not.toContain('rotate');
            }
            
            if (editorStyle.transform && editorStyle.transform.includes('scale')) {
              expect(editorStyle.transform).toContain('scale(1)');
            }
            if (canvasStyle.transform && canvasStyle.transform.includes('scale')) {
              expect(canvasStyle.transform).toContain('scale(1)');
            }
          });
        }
      ),
      { numRuns: 20 }
    );
  });

  /**
   * Feature: noctuary-editor-redesign, Property 29: No popup interruptions during writing
   * Validates: Requirements 10.3
   */
  it('Property 29: No popup interruptions during writing - no automatic popups', () => {
    fc.assert(
      fc.property(
        documentArbitrary,
        settingsArbitrary,
        fc.array(fc.string({ minLength: 1, maxLength: 100 }), { minLength: 5, maxLength: 20 }),
        (doc, settings, keystrokes) => {
          const onContentChange = vi.fn();
          const onTitleChange = vi.fn();

          const { container } = renderEditorCanvas(
            doc,
            onContentChange,
            onTitleChange,
            settings
          );

          const contentEditor = container.querySelector('.editor-content') as HTMLDivElement;
          expect(contentEditor).toBeTruthy();

          const initialModalCount = document.querySelectorAll('[role="dialog"], [role="alertdialog"], .modal, .toast, .notification').length;

          keystrokes.forEach((content) => {
            act(() => {
              contentEditor.textContent = content;
              contentEditor.dispatchEvent(new Event('input', { bubbles: true }));
            });

            const currentModalCount = document.querySelectorAll('[role="dialog"], [role="alertdialog"], .modal, .toast, .notification').length;
            expect(currentModalCount).toBe(initialModalCount);
          });

          const saveStatus = container.querySelector('.save-status');
          expect(saveStatus).toBeTruthy();
          expect(saveStatus?.getAttribute('role')).toBe('status');
        }
      ),
      { numRuns: 100 }
    );
  });
});

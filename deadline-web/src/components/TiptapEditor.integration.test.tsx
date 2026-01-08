import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from '@testing-library/react';

// Integration test that tests the actual Tiptap editor without mocking
// This will help us identify the real issues

describe('Tiptap Editor Integration Tests', () => {
  let originalConsoleError: typeof console.error;
  let originalConsoleWarn: typeof console.warn;

  beforeEach(() => {
    // Capture console errors and warnings to detect issues
    originalConsoleError = console.error;
    originalConsoleWarn = console.warn;
    
    console.error = vi.fn();
    console.warn = vi.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
    console.warn = originalConsoleWarn;
  });

  describe('Real Tiptap Editor Tests', () => {
    it('should create a working minimal Tiptap editor', async () => {
      // Import the real TiptapMinimalTest component
      const { TiptapMinimalTest } = await import('./TiptapMinimalTest');
      
      const { container } = render(<TiptapMinimalTest />);
      
      // Wait for editor to initialize
      await waitFor(() => {
        expect(screen.queryByText('Loading editor...')).not.toBeInTheDocument();
      }, { timeout: 5000 });

      // Check if editor rendered
      expect(container.querySelector('.ProseMirror')).toBeInTheDocument();
      
      // Check for console errors
      expect(console.error).not.toHaveBeenCalled();
    });

    it('should allow typing in the minimal editor', async () => {
      const { TiptapMinimalTest } = await import('./TiptapMinimalTest');
      const user = userEvent.setup();
      
      render(<TiptapMinimalTest />);
      
      // Wait for editor to be ready
      await waitFor(() => {
        const proseMirror = document.querySelector('.ProseMirror');
        expect(proseMirror).toBeInTheDocument();
      }, { timeout: 5000 });

      const editor = document.querySelector('.ProseMirror') as HTMLElement;
      expect(editor).toBeInTheDocument();

      // Try to focus and type
      await act(async () => {
        editor.focus();
        await user.type(editor, 'Hello World');
      });

      // Check if text was entered
      await waitFor(() => {
        expect(editor.textContent).toContain('Hello World');
      }, { timeout: 2000 });
    });

    it('should handle bold formatting', async () => {
      const { TiptapMinimalTest } = await import('./TiptapMinimalTest');
      const user = userEvent.setup();
      
      render(<TiptapMinimalTest />);
      
      await waitFor(() => {
        expect(document.querySelector('.ProseMirror')).toBeInTheDocument();
      }, { timeout: 5000 });

      const boldButton = screen.getByText('Bold');
      const editor = document.querySelector('.ProseMirror') as HTMLElement;

      // Type some text first
      await act(async () => {
        editor.focus();
        await user.type(editor, 'Test text');
      });

      // Select all text
      await act(async () => {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(editor);
        selection?.removeAllRanges();
        selection?.addRange(range);
      });

      // Click bold button
      await user.click(boldButton);

      // Check if bold was applied
      await waitFor(() => {
        expect(editor.querySelector('strong')).toBeInTheDocument();
      }, { timeout: 1000 });
    });
  });

  describe('EditorPane Integration Tests', () => {
    it('should render EditorPane without errors', async () => {
      const { EditorPane } = await import('./EditorPane');
      
      const { container } = render(<EditorPane currentDocument={null} />);
      
      // Wait for either loading or editor content
      await waitFor(() => {
        const hasLoading = screen.queryByText('Loading editor...');
        const hasEditor = container.querySelector('.ProseMirror');
        expect(hasLoading || hasEditor).toBeTruthy();
      }, { timeout: 5000 });

      // Should not have console errors
      expect(console.error).not.toHaveBeenCalled();
    });

    it('should initialize editor with correct extensions', async () => {
      const { EditorPane } = await import('./EditorPane');
      
      render(<EditorPane currentDocument="test-doc" />);
      
      // Wait for editor to initialize
      await waitFor(() => {
        const editor = document.querySelector('.ProseMirror');
        expect(editor).toBeInTheDocument();
      }, { timeout: 5000 });

      // Check if editor has the required classes for global event listener
      const editor = document.querySelector('.ProseMirror') as HTMLElement;
      expect(editor.classList.contains('tiptap')).toBe(true);
      expect(editor.classList.contains('ProseMirror')).toBe(true);
    });

    it('should handle document switching', async () => {
      const { EditorPane } = await import('./EditorPane');
      
      const { rerender } = render(<EditorPane currentDocument="doc1" />);
      
      await waitFor(() => {
        expect(document.querySelector('.ProseMirror')).toBeInTheDocument();
      }, { timeout: 5000 });

      // Switch document
      rerender(<EditorPane currentDocument="doc2" />);

      // Should update breadcrumb
      await waitFor(() => {
        expect(screen.getByText('Document doc2')).toBeInTheDocument();
      }, { timeout: 1000 });
    });

    it('should allow typing after document switch', async () => {
      const { EditorPane } = await import('./EditorPane');
      const user = userEvent.setup();
      
      const { rerender } = render(<EditorPane currentDocument="doc1" />);
      
      await waitFor(() => {
        expect(document.querySelector('.ProseMirror')).toBeInTheDocument();
      }, { timeout: 5000 });

      // Switch document
      rerender(<EditorPane currentDocument="doc2" />);

      await waitFor(() => {
        expect(screen.getByText('Document doc2')).toBeInTheDocument();
      }, { timeout: 1000 });

      // Try typing
      const editor = document.querySelector('.ProseMirror') as HTMLElement;
      
      await act(async () => {
        editor.focus();
        await user.type(editor, 'New content');
      });

      // Should be able to type
      await waitFor(() => {
        expect(editor.textContent).toContain('New content');
      }, { timeout: 2000 });
    });
  });

  describe('Global Event Listener Tests', () => {
    it('should not prevent typing in Tiptap editor', async () => {
      // Simulate the global event listener from App.tsx
      const preventKeydown = (e: KeyboardEvent) => {
        const target = e.target as HTMLElement;
        if (
          target.tagName !== 'INPUT' &&
          target.tagName !== 'TEXTAREA' &&
          target.getAttribute('contenteditable') !== 'true' &&
          !target.classList.contains('ProseMirror') &&
          !target.closest('.tiptap') &&
          !target.closest('.tiptap-editor') &&
          e.key.length === 1
        ) {
          e.preventDefault();
          e.stopPropagation();
        }
      };

      document.addEventListener('keydown', preventKeydown, true);

      try {
        const { TiptapMinimalTest } = await import('./TiptapMinimalTest');
        const user = userEvent.setup();
        
        render(<TiptapMinimalTest />);
        
        await waitFor(() => {
          expect(document.querySelector('.ProseMirror')).toBeInTheDocument();
        }, { timeout: 5000 });

        const editor = document.querySelector('.ProseMirror') as HTMLElement;
        
        // Try typing with the global event listener active
        await act(async () => {
          editor.focus();
          await user.type(editor, 'Test with global listener');
        });

        // Should still be able to type
        await waitFor(() => {
          expect(editor.textContent).toContain('Test with global listener');
        }, { timeout: 2000 });

      } finally {
        document.removeEventListener('keydown', preventKeydown, true);
      }
    });

    it('should prevent typing in non-editor elements', async () => {
      const preventKeydown = (e: KeyboardEvent) => {
        const target = e.target as HTMLElement;
        if (
          target.tagName !== 'INPUT' &&
          target.tagName !== 'TEXTAREA' &&
          target.getAttribute('contenteditable') !== 'true' &&
          !target.classList.contains('ProseMirror') &&
          !target.closest('.tiptap') &&
          !target.closest('.tiptap-editor') &&
          e.key.length === 1
        ) {
          e.preventDefault();
          e.stopPropagation();
        }
      };

      document.addEventListener('keydown', preventKeydown, true);

      try {
        const user = userEvent.setup();
        
        render(<div data-testid="non-editor">Regular div</div>);
        
        const nonEditor = screen.getByTestId('non-editor');
        
        // Try typing in non-editor element
        await act(async () => {
          nonEditor.focus();
          await user.type(nonEditor, 'Should not work');
        });

        // Should not have received the text
        expect(nonEditor.textContent).toBe('Regular div');

      } finally {
        document.removeEventListener('keydown', preventKeydown, true);
      }
    });
  });

  describe('Extension Loading Tests', () => {
    it('should load all required extensions without errors', async () => {
      // Test that all extensions can be imported
      const extensions = await Promise.all([
        import('@tiptap/extension-document'),
        import('@tiptap/extension-paragraph'),
        import('@tiptap/extension-text'),
        import('@tiptap/extension-bold'),
        import('@tiptap/extension-italic'),
        import('@tiptap/extension-strike'),
        import('@tiptap/extension-code'),
        import('@tiptap/extension-history'),
        import('@tiptap/extension-heading'),
        import('@tiptap/extension-bullet-list'),
        import('@tiptap/extension-ordered-list'),
        import('@tiptap/extension-list-item'),
        import('@tiptap/extension-blockquote'),
        import('@tiptap/extension-placeholder'),
        import('@tiptap/extension-character-count'),
      ]);

      // All extensions should be loaded
      extensions.forEach((ext, index) => {
        expect(ext.default).toBeDefined();
      });

      // Should not have console errors
      expect(console.error).not.toHaveBeenCalled();
    });
  });

  describe('Performance Tests', () => {
    it('should initialize editor within reasonable time', async () => {
      const startTime = performance.now();
      
      const { EditorPane } = await import('./EditorPane');
      render(<EditorPane currentDocument="test" />);
      
      await waitFor(() => {
        expect(document.querySelector('.ProseMirror')).toBeInTheDocument();
      }, { timeout: 5000 });

      const endTime = performance.now();
      const initTime = endTime - startTime;
      
      // Should initialize within 3 seconds
      expect(initTime).toBeLessThan(3000);
    });

    it('should handle rapid document switching', async () => {
      const { EditorPane } = await import('./EditorPane');
      
      const { rerender } = render(<EditorPane currentDocument="doc1" />);
      
      await waitFor(() => {
        expect(document.querySelector('.ProseMirror')).toBeInTheDocument();
      }, { timeout: 5000 });

      // Rapidly switch documents
      for (let i = 2; i <= 10; i++) {
        rerender(<EditorPane currentDocument={`doc${i}`} />);
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      // Should still be functional
      await waitFor(() => {
        expect(screen.getByText('Document doc10')).toBeInTheDocument();
      }, { timeout: 1000 });

      // Should not have console errors
      expect(console.error).not.toHaveBeenCalled();
    });
  });
});
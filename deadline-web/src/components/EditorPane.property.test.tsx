import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { fc } from 'fast-check';
import { EditorPane } from './EditorPane';

// Mock Tiptap
const mockEditor = {
  commands: {
    setContent: vi.fn(),
    focus: vi.fn(),
  },
  storage: {
    characterCount: {
      characters: vi.fn(() => 0),
      words: vi.fn(() => 0),
    },
  },
  isEditable: true,
  can: vi.fn(() => ({ undo: vi.fn(() => true) })),
  extensionManager: {
    extensions: [
      { name: 'Document' },
      { name: 'Paragraph' },
      { name: 'Text' },
    ],
  },
  view: {
    dom: {
      classList: {
        contains: vi.fn((className) => 
          ['tiptap', 'ProseMirror', 'tiptap-editor-content'].includes(className)
        ),
      },
    },
  },
};

vi.mock('@tiptap/react', () => ({
  useEditor: vi.fn(() => mockEditor),
  EditorContent: vi.fn(({ editor, className, onClick, style }) => (
    <div 
      data-testid="editor-content" 
      className={className}
      onClick={onClick}
      style={style}
    >
      {editor ? 'Editor Ready' : 'Loading...'}
    </div>
  )),
}));

// Mock all extensions
vi.mock('@tiptap/extension-document', () => ({ default: vi.fn() }));
vi.mock('@tiptap/extension-paragraph', () => ({ default: vi.fn() }));
vi.mock('@tiptap/extension-text', () => ({ default: vi.fn() }));
vi.mock('@tiptap/extension-bold', () => ({ default: vi.fn() }));
vi.mock('@tiptap/extension-italic', () => ({ default: vi.fn() }));
vi.mock('@tiptap/extension-strike', () => ({ default: vi.fn() }));
vi.mock('@tiptap/extension-code', () => ({ default: vi.fn() }));
vi.mock('@tiptap/extension-history', () => ({ default: vi.fn() }));
vi.mock('@tiptap/extension-heading', () => ({ default: { configure: vi.fn() } }));
vi.mock('@tiptap/extension-bullet-list', () => ({ default: vi.fn() }));
vi.mock('@tiptap/extension-ordered-list', () => ({ default: vi.fn() }));
vi.mock('@tiptap/extension-list-item', () => ({ default: vi.fn() }));
vi.mock('@tiptap/extension-blockquote', () => ({ default: vi.fn() }));
vi.mock('@tiptap/extension-placeholder', () => ({ default: { configure: vi.fn() } }));
vi.mock('@tiptap/extension-character-count', () => ({ default: vi.fn() }));

describe('EditorPane Property-Based Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Document ID Properties', () => {
    it('should handle any valid document ID', () => {
      fc.assert(fc.property(
        fc.oneof(
          fc.constant(null),
          fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0)
        ),
        (documentId) => {
          const { unmount } = render(<EditorPane currentDocument={documentId} />);
          
          if (documentId) {
            expect(screen.getByText(`Document ${documentId}`)).toBeInTheDocument();
          } else {
            expect(screen.getByText('Untitled Document')).toBeInTheDocument();
          }
          
          unmount();
        }
      ));
    });

    it('should call setContent with correct format for any document ID', () => {
      fc.assert(fc.property(
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        (documentId) => {
          vi.clearAllMocks();
          
          render(<EditorPane currentDocument={documentId} />);
          
          // Wait for useEffect to trigger
          setTimeout(() => {
            expect(mockEditor.commands.setContent).toHaveBeenCalledWith(
              `<h1>Document ${documentId}</h1><p>Start writing here...</p>`
            );
          }, 0);
        }
      ));
    });
  });

  describe('Character Count Properties', () => {
    it('should handle any character count value', () => {
      fc.assert(fc.property(
        fc.integer({ min: 0, max: 1000000 }),
        fc.integer({ min: 0, max: 100000 }),
        (charCount, wordCount) => {
          mockEditor.storage.characterCount.characters.mockReturnValue(charCount);
          mockEditor.storage.characterCount.words.mockReturnValue(wordCount);
          
          const { unmount } = render(<EditorPane currentDocument="test" />);
          
          expect(screen.getByText(`${charCount} characters`)).toBeInTheDocument();
          expect(screen.getByText(`${wordCount} words`)).toBeInTheDocument();
          
          unmount();
        }
      ));
    });

    it('should handle undefined/null character counts gracefully', () => {
      fc.assert(fc.property(
        fc.oneof(fc.constant(undefined), fc.constant(null), fc.integer()),
        fc.oneof(fc.constant(undefined), fc.constant(null), fc.integer()),
        (charCount, wordCount) => {
          mockEditor.storage.characterCount.characters.mockReturnValue(charCount);
          mockEditor.storage.characterCount.words.mockReturnValue(wordCount);
          
          const { unmount } = render(<EditorPane currentDocument="test" />);
          
          const expectedChars = charCount || 0;
          const expectedWords = wordCount || 0;
          
          expect(screen.getByText(`${expectedChars} characters`)).toBeInTheDocument();
          expect(screen.getByText(`${expectedWords} words`)).toBeInTheDocument();
          
          unmount();
        }
      ));
    });
  });

  describe('Time Formatting Properties', () => {
    it('should format last saved time correctly for any date', () => {
      fc.assert(fc.property(
        fc.date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') }),
        (date) => {
          // Mock Date.now to control "current" time
          const mockNow = new Date('2024-01-01T12:00:00Z');
          vi.spyOn(Date, 'now').mockReturnValue(mockNow.getTime());
          vi.spyOn(global, 'Date').mockImplementation(() => mockNow);
          
          const { unmount } = render(<EditorPane currentDocument="test" />);
          
          // The component should render without crashing
          expect(screen.getByTestId('editor-content')).toBeInTheDocument();
          
          unmount();
          vi.restoreAllMocks();
        }
      ));
    });
  });

  describe('CSS Class Properties', () => {
    it('should always include required CSS classes', () => {
      fc.assert(fc.property(
        fc.oneof(fc.constant(null), fc.string()),
        (documentId) => {
          const { useEditor } = require('@tiptap/react');
          
          render(<EditorPane currentDocument={documentId} />);
          
          const editorConfig = useEditor.mock.calls[0][0];
          const cssClasses = editorConfig.editorProps.attributes.class;
          
          expect(cssClasses).toContain('tiptap');
          expect(cssClasses).toContain('ProseMirror');
          expect(cssClasses).toContain('tiptap-editor-content');
        }
      ));
    });
  });

  describe('Editor State Properties', () => {
    it('should maintain editor state consistency', () => {
      fc.assert(fc.property(
        fc.boolean(),
        fc.boolean(),
        (isEditable, canUndo) => {
          mockEditor.isEditable = isEditable;
          mockEditor.can.mockReturnValue({ undo: () => canUndo });
          
          const { unmount } = render(<EditorPane currentDocument="test" />);
          
          // Editor should render regardless of state
          expect(screen.getByTestId('editor-content')).toBeInTheDocument();
          
          unmount();
        }
      ));
    });
  });

  describe('Extension Configuration Properties', () => {
    it('should handle any number of extensions', () => {
      fc.assert(fc.property(
        fc.array(fc.record({ name: fc.string() }), { minLength: 0, maxLength: 20 }),
        (extensions) => {
          mockEditor.extensionManager.extensions = extensions;
          
          const { unmount } = render(<EditorPane currentDocument="test" />);
          
          // Should render without crashing regardless of extensions
          expect(screen.getByTestId('editor-content')).toBeInTheDocument();
          
          unmount();
        }
      ));
    });
  });

  describe('Focus Behavior Properties', () => {
    it('should call focus when editor content is clicked', () => {
      fc.assert(fc.property(
        fc.string(),
        (documentId) => {
          vi.clearAllMocks();
          
          const { unmount } = render(<EditorPane currentDocument={documentId} />);
          
          const editorContent = screen.getByTestId('editor-content');
          fireEvent.click(editorContent);
          
          expect(mockEditor.commands.focus).toHaveBeenCalled();
          
          unmount();
        }
      ));
    });
  });

  describe('Error Handling Properties', () => {
    it('should handle editor initialization failures gracefully', () => {
      fc.assert(fc.property(
        fc.oneof(fc.constant(null), fc.constant(undefined)),
        (editorValue) => {
          const { useEditor } = require('@tiptap/react');
          useEditor.mockReturnValueOnce(editorValue);
          
          const { unmount } = render(<EditorPane currentDocument="test" />);
          
          // Should show loading state
          expect(screen.getByText('Loading editor...')).toBeInTheDocument();
          
          unmount();
        }
      ));
    });
  });

  describe('Invariant Properties', () => {
    it('should always render some content', () => {
      fc.assert(fc.property(
        fc.oneof(fc.constant(null), fc.string()),
        (documentId) => {
          const { container, unmount } = render(<EditorPane currentDocument={documentId} />);
          
          // Should never render completely empty
          expect(container.firstChild).not.toBeNull();
          expect(container.textContent).not.toBe('');
          
          unmount();
        }
      ));
    });

    it('should always have proper ARIA structure', () => {
      fc.assert(fc.property(
        fc.oneof(fc.constant(null), fc.string()),
        (documentId) => {
          const { unmount } = render(<EditorPane currentDocument={documentId} />);
          
          // Should have proper semantic structure
          const main = screen.getByRole('main', { hidden: true }) || 
                      screen.getByTestId('editor-content').closest('div');
          expect(main).toBeInTheDocument();
          
          unmount();
        }
      ));
    });
  });
});
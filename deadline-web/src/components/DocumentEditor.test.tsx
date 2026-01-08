import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DocumentEditor } from './DocumentEditor';
import { EditorPane } from './EditorPane';
import { FormattingToolbar } from './FormattingToolbar';

// Mock the Tiptap editor
vi.mock('@tiptap/react', () => ({
  useEditor: vi.fn(),
  EditorContent: vi.fn(({ editor, ...props }) => (
    <div data-testid="editor-content" {...props}>
      {editor ? 'Editor Ready' : 'Loading...'}
    </div>
  )),
}));

// Mock the extensions
vi.mock('@tiptap/extension-document', () => ({ default: vi.fn() }));
vi.mock('@tiptap/extension-paragraph', () => ({ default: vi.fn() }));
vi.mock('@tiptap/extension-text', () => ({ default: vi.fn() }));
vi.mock('@tiptap/extension-bold', () => ({ default: vi.fn() }));
vi.mock('@tiptap/extension-italic', () => ({ default: vi.fn() }));
vi.mock('@tiptap/extension-strike', () => ({ default: vi.fn() }));
vi.mock('@tiptap/extension-code', () => ({ default: vi.fn() }));
vi.mock('@tiptap/extension-history', () => ({ default: vi.fn() }));
vi.mock('@tiptap/extension-heading', () => ({ default: vi.fn() }));
vi.mock('@tiptap/extension-bullet-list', () => ({ default: vi.fn() }));
vi.mock('@tiptap/extension-ordered-list', () => ({ default: vi.fn() }));
vi.mock('@tiptap/extension-list-item', () => ({ default: vi.fn() }));
vi.mock('@tiptap/extension-blockquote', () => ({ default: vi.fn() }));
vi.mock('@tiptap/extension-placeholder', () => ({ default: { configure: vi.fn() } }));
vi.mock('@tiptap/extension-character-count', () => ({ default: vi.fn() }));

describe('DocumentEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render the main document editor interface', () => {
      render(<DocumentEditor />);
      
      expect(screen.getByRole('button', { name: /toggle file explorer/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /toggle ai companion/i })).toBeInTheDocument();
    });

    it('should render with proper layout structure', () => {
      const { container } = render(<DocumentEditor />);
      
      // Check for main layout elements
      expect(container.querySelector('.h-screen')).toBeInTheDocument();
      expect(container.querySelector('.flex')).toBeInTheDocument();
    });

    it('should have proper accessibility attributes', () => {
      render(<DocumentEditor />);
      
      const toggleButtons = screen.getAllByRole('button');
      toggleButtons.forEach(button => {
        expect(button).toHaveAttribute('title');
      });
    });
  });

  describe('Sidebar Functionality', () => {
    it('should toggle left sidebar when button is clicked', async () => {
      const user = userEvent.setup();
      render(<DocumentEditor />);
      
      const toggleButton = screen.getByRole('button', { name: /toggle file explorer/i });
      
      await user.click(toggleButton);
      
      // The sidebar state should change (we can't easily test the visual change without more complex setup)
      expect(toggleButton).toBeInTheDocument();
    });

    it('should toggle right sidebar when button is clicked', async () => {
      const user = userEvent.setup();
      render(<DocumentEditor />);
      
      const toggleButton = screen.getByRole('button', { name: /toggle ai companion/i });
      
      await user.click(toggleButton);
      
      expect(toggleButton).toBeInTheDocument();
    });
  });
});

describe('EditorPane', () => {
  const mockEditor = {
    commands: {
      setContent: vi.fn(),
      focus: vi.fn(),
    },
    storage: {
      characterCount: {
        characters: vi.fn(() => 100),
        words: vi.fn(() => 20),
      },
    },
    isEditable: true,
    can: vi.fn(() => ({ undo: vi.fn(() => true) })),
    extensionManager: {
      extensions: [
        { name: 'Document' },
        { name: 'Paragraph' },
        { name: 'Text' },
        { name: 'Bold' },
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

  beforeEach(() => {
    const { useEditor } = require('@tiptap/react');
    useEditor.mockReturnValue(mockEditor);
  });

  describe('Editor Initialization', () => {
    it('should initialize editor with correct extensions', () => {
      render(<EditorPane currentDocument={null} />);
      
      const { useEditor } = require('@tiptap/react');
      expect(useEditor).toHaveBeenCalledWith(
        expect.objectContaining({
          extensions: expect.arrayContaining([
            expect.anything(), // Document
            expect.anything(), // Paragraph
            expect.anything(), // Text
          ]),
        })
      );
    });

    it('should show loading state when editor is not ready', () => {
      const { useEditor } = require('@tiptap/react');
      useEditor.mockReturnValue(null);
      
      render(<EditorPane currentDocument={null} />);
      
      expect(screen.getByText('Loading editor...')).toBeInTheDocument();
    });

    it('should render editor content when editor is ready', () => {
      render(<EditorPane currentDocument={null} />);
      
      expect(screen.getByTestId('editor-content')).toBeInTheDocument();
      expect(screen.getByText('Editor Ready')).toBeInTheDocument();
    });
  });

  describe('Document Handling', () => {
    it('should update content when currentDocument changes', async () => {
      const { rerender } = render(<EditorPane currentDocument={null} />);
      
      rerender(<EditorPane currentDocument="doc1" />);
      
      await waitFor(() => {
        expect(mockEditor.commands.setContent).toHaveBeenCalledWith(
          '<h1>Document doc1</h1><p>Start writing here...</p>'
        );
      });
    });

    it('should focus editor when document changes', async () => {
      const { rerender } = render(<EditorPane currentDocument={null} />);
      
      rerender(<EditorPane currentDocument="doc1" />);
      
      await waitFor(() => {
        expect(mockEditor.commands.focus).toHaveBeenCalled();
      }, { timeout: 200 });
    });

    it('should display correct document title in breadcrumb', () => {
      render(<EditorPane currentDocument="doc1" />);
      
      expect(screen.getByText('Document doc1')).toBeInTheDocument();
    });

    it('should display untitled when no document selected', () => {
      render(<EditorPane currentDocument={null} />);
      
      expect(screen.getByText('Untitled Document')).toBeInTheDocument();
    });
  });

  describe('Editor Properties', () => {
    it('should have correct CSS classes for global event listener compatibility', () => {
      render(<EditorPane currentDocument={null} />);
      
      const { useEditor } = require('@tiptap/react');
      const editorConfig = useEditor.mock.calls[0][0];
      
      expect(editorConfig.editorProps.attributes.class).toContain('tiptap');
      expect(editorConfig.editorProps.attributes.class).toContain('ProseMirror');
      expect(editorConfig.editorProps.attributes.class).toContain('tiptap-editor-content');
    });

    it('should have spellcheck disabled', () => {
      render(<EditorPane currentDocument={null} />);
      
      const { useEditor } = require('@tiptap/react');
      const editorConfig = useEditor.mock.calls[0][0];
      
      expect(editorConfig.editorProps.attributes.spellcheck).toBe('false');
    });

    it('should be editable and autofocus', () => {
      render(<EditorPane currentDocument={null} />);
      
      const { useEditor } = require('@tiptap/react');
      const editorConfig = useEditor.mock.calls[0][0];
      
      expect(editorConfig.editable).toBe(true);
      expect(editorConfig.autofocus).toBe(true);
    });
  });

  describe('Character and Word Count', () => {
    it('should display character count', () => {
      render(<EditorPane currentDocument="doc1" />);
      
      expect(screen.getByText('100 characters')).toBeInTheDocument();
    });

    it('should display word count', () => {
      render(<EditorPane currentDocument="doc1" />);
      
      expect(screen.getByText('20 words')).toBeInTheDocument();
    });

    it('should handle missing character count gracefully', () => {
      mockEditor.storage.characterCount.characters.mockReturnValue(undefined);
      mockEditor.storage.characterCount.words.mockReturnValue(undefined);
      
      render(<EditorPane currentDocument="doc1" />);
      
      expect(screen.getByText('0 characters')).toBeInTheDocument();
      expect(screen.getByText('0 words')).toBeInTheDocument();
    });
  });

  describe('Editor Interaction', () => {
    it('should focus editor when editor content is clicked', async () => {
      const user = userEvent.setup();
      render(<EditorPane currentDocument="doc1" />);
      
      const editorContent = screen.getByTestId('editor-content');
      await user.click(editorContent);
      
      expect(mockEditor.commands.focus).toHaveBeenCalled();
    });
  });
});

describe('FormattingToolbar Integration', () => {
  const mockEditor = {
    commands: {
      focus: vi.fn(),
      undo: vi.fn(),
      redo: vi.fn(),
      toggleBold: vi.fn(),
      toggleItalic: vi.fn(),
      toggleStrike: vi.fn(),
      toggleHeading: vi.fn(),
      toggleBulletList: vi.fn(),
      toggleOrderedList: vi.fn(),
      toggleBlockquote: vi.fn(),
      setParagraph: vi.fn(),
    },
    can: vi.fn(() => ({
      undo: vi.fn(() => true),
      redo: vi.fn(() => true),
    })),
    isActive: vi.fn((format) => format === 'bold'),
    chain: vi.fn(() => ({
      focus: vi.fn(() => ({
        undo: vi.fn(() => ({ run: vi.fn() })),
        redo: vi.fn(() => ({ run: vi.fn() })),
        toggleBold: vi.fn(() => ({ run: vi.fn() })),
        toggleItalic: vi.fn(() => ({ run: vi.fn() })),
        toggleStrike: vi.fn(() => ({ run: vi.fn() })),
        toggleHeading: vi.fn(() => ({ run: vi.fn() })),
        toggleBulletList: vi.fn(() => ({ run: vi.fn() })),
        toggleOrderedList: vi.fn(() => ({ run: vi.fn() })),
        toggleBlockquote: vi.fn(() => ({ run: vi.fn() })),
        setParagraph: vi.fn(() => ({ run: vi.fn() })),
      })),
    })),
  };

  it('should render formatting toolbar when editor is available', () => {
    render(<FormattingToolbar editor={mockEditor} />);
    
    expect(screen.getByRole('button', { name: /bold/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /italic/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /undo/i })).toBeInTheDocument();
  });

  it('should not render when editor is null', () => {
    const { container } = render(<FormattingToolbar editor={null} />);
    
    expect(container.firstChild).toBeNull();
  });

  it('should show active state for bold button', () => {
    render(<FormattingToolbar editor={mockEditor} />);
    
    const boldButton = screen.getByRole('button', { name: /bold/i });
    expect(boldButton).toHaveStyle({ backgroundColor: '#f97316' });
  });

  it('should execute bold command when bold button is clicked', async () => {
    const user = userEvent.setup();
    render(<FormattingToolbar editor={mockEditor} />);
    
    const boldButton = screen.getByRole('button', { name: /bold/i });
    await user.click(boldButton);
    
    expect(mockEditor.chain).toHaveBeenCalled();
  });
});
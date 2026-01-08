import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import { useEffect, useRef } from 'react';

interface TiptapGrimoireEditorProps {
  value: string;
  onChange: (content: string) => void;
  onWordCountChange: (count: number) => void;
  placeholder?: string;
  className?: string;
}

export function TiptapGrimoireEditor({ 
  value, 
  onChange, 
  onWordCountChange,
  placeholder = 'Inscribe your nightmare...',
  className = ''
}: TiptapGrimoireEditorProps) {
  const isLocalChange = useRef(false);
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      CharacterCount,
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    editable: true,
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[85vh] text-[#dcd0ba] text-xl leading-loose selection:bg-[#4a0000] selection:text-[#ffcccc] grimoire-prose',
        spellcheck: 'false',
      },
    },
    content: value,
    onUpdate: ({ editor }) => {
      isLocalChange.current = true;
      
      // Update word count
      const count = editor.storage.characterCount.words();
      onWordCountChange(count);
      
      // Update content
      const html = editor.getHTML();
      onChange(html);
      
      // Reset flag after a short delay
      setTimeout(() => {
        isLocalChange.current = false;
      }, 0);
    },
  });

  // Only update editor content when value changes from external source (not from typing)
  useEffect(() => {
    if (!editor || isLocalChange.current) return;
    
    const currentContent = editor.getHTML();
    if (value !== currentContent) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div 
      className={`grimoire-container w-full max-w-3xl mx-auto ${className}`}
      onClick={() => {
        if (editor && editor.view && !editor.isDestroyed) {
          editor.commands.focus();
        }
      }}
    >
      <style>{`
        /* Custom Font Import */
        @import url('https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&display=swap');

        /* Tiptap Editor Styling */
        .ProseMirror {
          font-family: 'IM Fell English', serif;
          font-size: 1.25rem;
          color: #dcd0ba;
          line-height: 1.8;
          min-height: 85vh;
          outline: none;
          cursor: text !important;
          user-select: text !important;
          -webkit-user-select: text !important;
          pointer-events: auto !important;
          caret-color: #dc2626 !important;
          -webkit-user-modify: read-write !important;
        }
        
        /* Ensure the editor wrapper is also clickable */
        .grimoire-container {
          cursor: text !important;
          pointer-events: auto !important;
        }

        /* Paragraph Styling - The Book Look */
        .ProseMirror p {
          font-family: 'IM Fell English', serif;
          margin-bottom: 1.5rem;
          text-indent: 2rem;
        }

        /* First paragraph no indent (traditional book style) */
        .ProseMirror > p:first-child {
          text-indent: 0;
        }

        /* Drop Cap Effect for first letter */
        .ProseMirror > p:first-child::first-letter {
          float: left;
          font-size: 3.5rem;
          line-height: 0.8;
          padding-right: 8px;
          padding-top: 4px;
          font-family: 'UnifrakturMaguntia', serif;
          color: #ffaa00;
          text-shadow: 0 0 10px rgba(255, 170, 0, 0.5);
        }

        /* Placeholder Styling */
        .ProseMirror.is-editor-empty::before {
          content: attr(data-placeholder);
          float: left;
          color: #4a4a4a;
          pointer-events: none;
          height: 0;
        }

        /* Headings */
        .ProseMirror h1,
        .ProseMirror h2,
        .ProseMirror h3 {
          font-family: 'IM Fell English', serif;
          color: #e8dcc4;
          margin-top: 2rem;
          margin-bottom: 1rem;
          text-indent: 0;
        }

        .ProseMirror h1 {
          font-size: 2rem;
          font-weight: bold;
        }

        .ProseMirror h2 {
          font-size: 1.5rem;
          font-weight: bold;
        }

        .ProseMirror h3 {
          font-size: 1.25rem;
          font-weight: 600;
        }

        /* Lists */
        .ProseMirror ul,
        .ProseMirror ol {
          padding-left: 2rem;
          margin-bottom: 1.5rem;
        }

        .ProseMirror li {
          margin-bottom: 0.5rem;
          text-indent: 0;
        }

        /* Blockquotes */
        .ProseMirror blockquote {
          border-left: 3px solid #8b4513;
          padding-left: 1.5rem;
          margin-left: 0;
          margin-bottom: 1.5rem;
          font-style: italic;
          color: #c4b5a0;
        }

        /* Code blocks */
        .ProseMirror pre {
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 4px;
          padding: 1rem;
          margin-bottom: 1.5rem;
          overflow-x: auto;
        }

        .ProseMirror code {
          font-family: 'Courier New', monospace;
          font-size: 0.9rem;
          color: #d4af37;
        }

        /* Inline code */
        .ProseMirror :not(pre) > code {
          background: #2a2a2a;
          padding: 0.2rem 0.4rem;
          border-radius: 3px;
        }

        /* Strong and emphasis */
        .ProseMirror strong {
          font-weight: bold;
          color: #e8dcc4;
        }

        .ProseMirror em {
          font-style: italic;
        }

        /* Horizontal rule */
        .ProseMirror hr {
          border: none;
          border-top: 2px solid #4a4a4a;
          margin: 2rem 0;
        }
      `}</style>
      <EditorContent editor={editor} />
    </div>
  );
}

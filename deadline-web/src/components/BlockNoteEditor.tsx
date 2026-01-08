import React, { useCallback, useMemo } from 'react';
import { BlockNoteView } from '@blocknote/mantine';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteEditor, Block } from '@blocknote/core';
import '@blocknote/core/fonts/inter.css';
import '@blocknote/mantine/style.css';

interface BlockNoteEditorProps {
  value: string;
  onChange: (content: string) => void;
  onWordCountChange?: (count: number) => void;
  placeholder?: string;
  className?: string;
}

export const BlockNoteEditorComponent: React.FC<BlockNoteEditorProps> = ({
  value,
  onChange,
  onWordCountChange,
  placeholder = 'Start writing your masterpiece...',
  className = ''
}) => {
  // Parse the content - if it's HTML, convert to blocks, otherwise treat as markdown
  const initialContent = useMemo(() => {
    if (!value) return undefined;
    
    try {
      // Try to parse as JSON blocks first
      return JSON.parse(value);
    } catch {
      // If not JSON, treat as HTML/markdown and let BlockNote handle it
      return undefined;
    }
  }, []);

  const editor: BlockNoteEditor = useCreateBlockNote({
    initialContent,
    placeholder,
  });

  const handleChange = useCallback(() => {
    // Get the document as JSON
    const blocks = editor.document;
    const jsonContent = JSON.stringify(blocks);
    onChange(jsonContent);

    // Calculate word count
    if (onWordCountChange) {
      const textContent = blocks
        .map((block: Block) => {
          // Extract text content from different block types
          if (block.type === 'paragraph' || block.type === 'heading') {
            return block.content?.map((item: any) => item.text || '').join('') || '';
          }
          return '';
        })
        .join(' ');
      
      const wordCount = textContent
        .trim()
        .split(/\s+/)
        .filter(word => word.length > 0).length;
      
      onWordCountChange(wordCount);
    }
  }, [editor, onChange, onWordCountChange]);

  return (
    <div className={`blocknote-container ${className}`}>
      <BlockNoteView 
        editor={editor} 
        onChange={handleChange}
        theme="dark"
      />
      
      <style>{`
        .blocknote-container {
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        .bn-container {
          height: 100% !important;
          background-color: #000000 !important;
          color: #e5e5e5 !important;
        }
        
        .bn-editor {
          background-color: #000000 !important;
          color: #e5e5e5 !important;
          font-family: 'Merriweather', 'Crimson Text', serif !important;
          font-size: 18px !important;
          line-height: 1.6 !important;
          padding: 2rem !important;
        }
        
        .bn-block-content {
          color: #e5e5e5 !important;
        }
        
        .bn-inline-content {
          color: #e5e5e5 !important;
        }
        
        /* Toolbar styling */
        .bn-toolbar {
          background-color: #121212 !important;
          border: 1px solid rgba(115, 115, 115, 0.2) !important;
          border-radius: 6px !important;
        }
        
        .bn-toolbar-button {
          color: #e5e5e5 !important;
        }
        
        .bn-toolbar-button:hover {
          background-color: rgba(115, 115, 115, 0.2) !important;
        }
        
        .bn-toolbar-button[data-active="true"] {
          background-color: rgba(220, 38, 38, 0.2) !important;
          color: #fca5a5 !important;
        }
        
        /* Side menu styling */
        .bn-side-menu {
          background-color: #121212 !important;
          border: 1px solid rgba(115, 115, 115, 0.2) !important;
        }
        
        .bn-side-menu-button {
          color: #e5e5e5 !important;
        }
        
        .bn-side-menu-button:hover {
          background-color: rgba(115, 115, 115, 0.2) !important;
        }
        
        /* Drag handle styling */
        .bn-drag-handle {
          color: #737373 !important;
        }
        
        .bn-drag-handle:hover {
          color: #e5e5e5 !important;
        }
        
        /* Block styling */
        .bn-block {
          margin-bottom: 0.5rem !important;
        }
        
        .bn-block[data-content-type="heading"] {
          color: #ffffff !important;
          font-weight: bold !important;
          margin-top: 1.5rem !important;
          margin-bottom: 0.5rem !important;
        }
        
        .bn-block[data-content-type="heading"][data-level="1"] {
          font-size: 2rem !important;
        }
        
        .bn-block[data-content-type="heading"][data-level="2"] {
          font-size: 1.5rem !important;
        }
        
        .bn-block[data-content-type="heading"][data-level="3"] {
          font-size: 1.25rem !important;
        }
        
        /* Placeholder styling */
        .bn-block-content[data-placeholder]:before {
          color: #737373 !important;
        }
        
        /* Selection styling */
        .bn-editor ::selection {
          background-color: rgba(220, 38, 38, 0.3) !important;
        }
        
        /* Caret color */
        .bn-editor {
          caret-color: #dc2626 !important;
        }
        
        /* Scrollbar styling */
        .bn-editor::-webkit-scrollbar {
          width: 8px;
        }
        
        .bn-editor::-webkit-scrollbar-track {
          background: #1a1a1a;
        }
        
        .bn-editor::-webkit-scrollbar-thumb {
          background: #404040;
          border-radius: 4px;
        }
        
        .bn-editor::-webkit-scrollbar-thumb:hover {
          background: #606060;
        }
        
        /* Link styling */
        .bn-inline-content a {
          color: #3b82f6 !important;
        }
        
        .bn-inline-content a:hover {
          color: #60a5fa !important;
        }
        
        /* Code styling */
        .bn-inline-content code {
          background-color: #1f2937 !important;
          color: #fbbf24 !important;
          padding: 0.2em 0.4em !important;
          border-radius: 3px !important;
        }
        
        /* List styling */
        .bn-block[data-content-type="bulletListItem"],
        .bn-block[data-content-type="numberedListItem"] {
          padding-left: 1rem !important;
        }
        
        /* Quote styling */
        .bn-block[data-content-type="paragraph"][data-text-color="gray"] {
          border-left: 3px solid #dc2626 !important;
          padding-left: 1rem !important;
          font-style: italic !important;
          color: #d1d5db !important;
        }
      `}</style>
    </div>
  );
};
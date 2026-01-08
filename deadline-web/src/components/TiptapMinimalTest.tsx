import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';

export const TiptapMinimalTest: React.FC = () => {
  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Bold,
      Italic,
    ],
    content: '<p>Type here to test the editor...</p>',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
        style: 'min-height: 200px; padding: 20px; border: 2px solid #f97316; background: #000; color: #fff; border-radius: 8px;'
      },
    },
    editable: true,
    autofocus: true,
  });

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <h2 style={{ color: '#f97316', marginBottom: '20px' }}>Minimal Tiptap Test</h2>
      
      <div style={{ marginBottom: '10px' }}>
        <button 
          onClick={() => editor.chain().focus().toggleBold().run()}
          style={{ 
            marginRight: '10px', 
            padding: '8px 16px', 
            backgroundColor: editor.isActive('bold') ? '#f97316' : '#333',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Bold
        </button>
        <button 
          onClick={() => editor.chain().focus().toggleItalic().run()}
          style={{ 
            marginRight: '10px', 
            padding: '8px 16px', 
            backgroundColor: editor.isActive('italic') ? '#f97316' : '#333',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Italic
        </button>
        <button 
          onClick={() => editor.commands.focus()}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#333',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Focus
        </button>
      </div>

      <EditorContent editor={editor} />
      
      <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
        Characters: {editor.storage.characterCount?.characters() || 'N/A'}
      </div>
    </div>
  );
};
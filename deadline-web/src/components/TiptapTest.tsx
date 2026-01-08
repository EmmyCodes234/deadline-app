import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import './DocumentEditor.css';

export const TiptapTest: React.FC = () => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Click here and start typing...</p>',
    editorProps: {
      attributes: {
        class: 'tiptap',
        style: 'min-height: 200px; padding: 20px; border: 1px solid #ccc; background: white; color: black;'
      },
    },
    editable: true,
    autofocus: true,
  });

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0' }}>
      <h2>Tiptap Editor Test</h2>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={() => editor?.commands.focus()}>Focus Editor</button>
        <button onClick={() => editor?.commands.setContent('<p>Reset content</p>')}>Reset</button>
      </div>
      <EditorContent editor={editor} />
      <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
        Characters: {editor?.storage.characterCount?.characters() || 0}
      </div>
    </div>
  );
};
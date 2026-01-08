import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';

export const EditorDebugger: React.FC = () => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: 'Type here to test...',
        emptyEditorClass: 'is-editor-empty',
      }),
      CharacterCount,
    ],
    content: '<p>Debug editor - start typing...</p>',
    editorProps: {
      attributes: {
        class: 'tiptap ProseMirror debug-editor',
        spellcheck: 'false',
        style: 'min-height: 200px; padding: 20px; border: 2px solid #f97316; background: #000; color: #fff; border-radius: 8px; outline: none;',
      },
    },
    editable: true,
    autofocus: true,
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor) {
      console.log('🔥 Editor Debug Info:', {
        isEditable: editor.isEditable,
        canUndo: editor.can().undo(),
        extensions: editor.extensionManager.extensions.map(ext => ext.name),
        editorElement: editor.view.dom,
        hasCorrectClasses: {
          tiptap: editor.view.dom.classList.contains('tiptap'),
          ProseMirror: editor.view.dom.classList.contains('ProseMirror'),
          debugEditor: editor.view.dom.classList.contains('debug-editor')
        },
        contentEditable: editor.view.dom.getAttribute('contenteditable'),
        spellcheck: editor.view.dom.getAttribute('spellcheck'),
      });

      // Test typing programmatically
      setTimeout(() => {
        console.log('🔥 Testing programmatic content update...');
        editor.commands.setContent('<p>Programmatic content update successful!</p>');
        editor.commands.focus();
      }, 1000);
    }
  }, [editor]);

  // Handle manual focus
  const handleFocus = () => {
    if (editor) {
      console.log('🔥 Manual focus triggered');
      editor.commands.focus();
    }
  };

  // Handle content change
  const handleContentChange = () => {
    if (editor) {
      const content = editor.getHTML();
      const text = editor.getText();
      console.log('🔥 Content changed:', { html: content, text });
    }
  };

  if (!editor) {
    return (
      <div style={{ padding: '20px', color: '#f97316' }}>
        <h2>Editor Debugger - Loading...</h2>
        <p>Editor is initializing...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <h2 style={{ color: '#f97316', marginBottom: '20px' }}>Editor Debugger</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={handleFocus}
          style={{ 
            marginRight: '10px', 
            padding: '8px 16px', 
            backgroundColor: '#f97316',
            color: '#000',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Focus Editor
        </button>
        
        <button 
          onClick={handleContentChange}
          style={{ 
            marginRight: '10px', 
            padding: '8px 16px', 
            backgroundColor: '#333',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Log Content
        </button>

        <button 
          onClick={() => editor.commands.setContent('<p>Reset content test</p>')}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#666',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Reset Content
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ color: '#fff', fontSize: '16px', marginBottom: '10px' }}>Editor Status:</h3>
        <ul style={{ color: '#ccc', fontSize: '14px' }}>
          <li>Editable: {editor.isEditable ? '✅' : '❌'}</li>
          <li>Can Undo: {editor.can().undo() ? '✅' : '❌'}</li>
          <li>Extensions: {editor.extensionManager.extensions.length}</li>
          <li>Characters: {editor.storage.characterCount?.characters() || 0}</li>
          <li>Words: {editor.storage.characterCount?.words() || 0}</li>
        </ul>
      </div>

      <div 
        onClick={handleFocus}
        style={{ 
          cursor: 'text',
          border: '1px solid #333',
          borderRadius: '8px',
          padding: '10px'
        }}
      >
        <EditorContent 
          editor={editor} 
          onInput={handleContentChange}
        />
      </div>

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <p>Check the browser console for detailed debug information.</p>
        <p>Try typing, clicking, and using the buttons above.</p>
      </div>
    </div>
  );
};
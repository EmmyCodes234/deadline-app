/**
 * TiptapEditor - Horror-Themed Rich Text Editor
 * 
 * A beautifully styled Tiptap editor with dark horror aesthetics
 * optimized for horror writing experience.
 */

import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import Typography from '@tiptap/extension-typography';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import Focus from '@tiptap/extension-focus';
import { useEffect, useCallback } from 'react';
import './TiptapEditor.css';

interface TiptapEditorProps {
    content: string;
    onChange: (content: string) => void;
    onWordCountChange?: (count: number) => void;
    placeholder?: string;
    editable?: boolean;
    className?: string;
}

// Formatting toolbar component
function EditorToolbar({ editor }: { editor: Editor | null }) {
    if (!editor) return null;

    return (
        <div className="epitaph-toolbar">
            <div className="toolbar-group">
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`toolbar-btn ${editor.isActive('bold') ? 'active' : ''}`}
                    title="Bold (Ctrl+B)"
                >
                    <strong>B</strong>
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`toolbar-btn ${editor.isActive('italic') ? 'active' : ''}`}
                    title="Italic (Ctrl+I)"
                >
                    <em>I</em>
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={`toolbar-btn ${editor.isActive('underline') ? 'active' : ''}`}
                    title="Underline (Ctrl+U)"
                >
                    <u>U</u>
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={`toolbar-btn ${editor.isActive('strike') ? 'active' : ''}`}
                    title="Strikethrough"
                >
                    <s>S</s>
                </button>
            </div>

            <div className="toolbar-divider" />

            <div className="toolbar-group">
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={`toolbar-btn ${editor.isActive('heading', { level: 1 }) ? 'active' : ''}`}
                    title="Heading 1"
                >
                    H1
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`toolbar-btn ${editor.isActive('heading', { level: 2 }) ? 'active' : ''}`}
                    title="Heading 2"
                >
                    H2
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={`toolbar-btn ${editor.isActive('heading', { level: 3 }) ? 'active' : ''}`}
                    title="Heading 3"
                >
                    H3
                </button>
            </div>

            <div className="toolbar-divider" />

            <div className="toolbar-group">
                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`toolbar-btn ${editor.isActive('bulletList') ? 'active' : ''}`}
                    title="Bullet List"
                >
                    •
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`toolbar-btn ${editor.isActive('orderedList') ? 'active' : ''}`}
                    title="Numbered List"
                >
                    1.
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={`toolbar-btn ${editor.isActive('blockquote') ? 'active' : ''}`}
                    title="Quote"
                >
                    "
                </button>
            </div>

            <div className="toolbar-divider" />

            <div className="toolbar-group">
                <button
                    onClick={() => editor.chain().focus().toggleHighlight({ color: '#7f1d1d' }).run()}
                    className={`toolbar-btn ${editor.isActive('highlight') ? 'active' : ''}`}
                    title="Highlight"
                >
                    <span style={{ background: 'linear-gradient(transparent 60%, #7f1d1d 60%)' }}>H</span>
                </button>
            </div>

            <div className="toolbar-spacer" />

            <div className="toolbar-group">
                <button
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    className="toolbar-btn"
                    title="Undo (Ctrl+Z)"
                >
                    ↶
                </button>
                <button
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    className="toolbar-btn"
                    title="Redo (Ctrl+Y)"
                >
                    ↷
                </button>
            </div>
        </div>
    );
}

export function TiptapEditor({
    content,
    onChange,
    onWordCountChange,
    placeholder = "Begin your dark tale...",
    editable = true,
    className = '',
}: TiptapEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Placeholder.configure({
                placeholder,
                emptyEditorClass: 'is-editor-empty',
            }),
            CharacterCount,
            Typography,
            Highlight.configure({
                multicolor: true,
            }),
            Underline,
            Focus.configure({
                className: 'has-focus',
                mode: 'all',
            }),
        ],
        content,
        editable,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onChange(html);

            // Calculate word count from text content
            const text = editor.getText();
            const words = text.trim().split(/\s+/).filter(Boolean).length;
            onWordCountChange?.(words);
        },
        editorProps: {
            attributes: {
                class: 'epitaph-prose',
                spellcheck: 'true',
            },
        },
    });

    // Update content when prop changes externally
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content, { emitUpdate: false });
        }
    }, [content, editor]);

    // Cleanup
    useEffect(() => {
        return () => {
            editor?.destroy();
        };
    }, [editor]);

    return (
        <div className={`epitaph-editor-wrapper ${className}`}>
            <EditorToolbar editor={editor} />
            <div className="epitaph-editor-content">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}

export { useEditor, Editor };

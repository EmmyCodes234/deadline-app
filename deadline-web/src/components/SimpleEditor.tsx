import React, { useState, useCallback, useRef, useEffect } from 'react';
import { BlockNoteEditorComponent } from './BlockNoteEditor';
import { ChevronRight, Clock } from 'lucide-react';
import { useProjects } from '@/contexts/ProjectContext';
import './DocumentEditor.css';

interface SimpleEditorProps {
  currentDocument: string | null;
}

export const SimpleEditor: React.FC<SimpleEditorProps> = ({ currentDocument }) => {
  const { currentProject, updateDocument, getDocument } = useProjects();
  const [content, setContent] = useState('');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saving, setSaving] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get current document data
  const document = currentProject && currentDocument 
    ? getDocument(currentProject.id, currentDocument)
    : null;

  // Update content when document changes
  useEffect(() => {
    if (document) {
      setContent(document.content);
      setLastSaved(new Date(document.updatedAt));
    } else {
      setContent('');
      setLastSaved(null);
    }
  }, [document]);

  // Auto-save function
  const saveDocument = useCallback(async (newContent: string) => {
    if (!currentProject || !currentDocument || !document) return;
    
    setSaving(true);
    try {
      await updateDocument(currentProject.id, currentDocument, { content: newContent });
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to save document:', error);
    } finally {
      setSaving(false);
    }
  }, [currentProject, currentDocument, document, updateDocument]);

  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
    
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Auto-save after 1 second of inactivity
    saveTimeoutRef.current = setTimeout(() => {
      saveDocument(newContent);
    }, 1000);
  }, [saveDocument]);

  const handleWordCountChange = useCallback((count: number) => {
    setWordCount(count);
  }, []);

  // Handle manual save shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        // Manual save
        if (currentProject && currentDocument && document) {
          saveDocument(content);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentProject, currentDocument, document, content, saveDocument]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const formatLastSaved = useCallback((date: Date | null) => {
    if (saving) return 'Saving...';
    if (!date) return 'Never';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  }, [saving]);

  // Calculate character count (word count comes from BlockNote)
  const characterCount = content.length;

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: '#0a0a0a' }}>
      {/* Breadcrumb Header */}
      <div className="h-14 flex items-center justify-between px-6 flex-shrink-0" style={{ 
        backgroundColor: '#121212',
        borderBottom: '1px solid rgba(115, 115, 115, 0.2)'
      }}>
        <div className="flex items-center gap-2 text-sm" style={{ 
          color: '#737373',
          fontFamily: 'Inter, sans-serif'
        }}>
          <span>{currentProject?.name || 'No Project'}</span>
          <ChevronRight size={14} />
          <span style={{ color: '#e5e5e5', fontWeight: '500' }}>
            {document?.title || 'No Document Selected'}
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-xs" style={{ 
          color: '#737373',
          fontFamily: 'Inter, sans-serif'
        }}>
          <Clock size={12} />
          <span>Last saved {formatLastSaved(lastSaved)}</span>
        </div>
      </div>

      {/* Editor Canvas - Full height BlockNote */}
      <div className="flex-1 min-h-0" style={{ 
        backgroundColor: '#0a0a0a'
      }}>
        {document ? (
          <BlockNoteEditorComponent
            value={content}
            onChange={handleContentChange}
            onWordCountChange={handleWordCountChange}
            placeholder="Start writing your masterpiece..."
            className="h-full"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-zinc-500" style={{ backgroundColor: '#000000' }}>
            <div className="text-center">
              <p className="text-lg mb-2">No document selected</p>
              <p className="text-sm">Select a document from the sidebar or create a new one</p>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="h-8 flex items-center justify-between px-6 text-xs flex-shrink-0" style={{ 
        backgroundColor: '#121212',
        borderTop: '1px solid rgba(115, 115, 115, 0.2)',
        color: '#737373',
        fontFamily: 'Inter, sans-serif'
      }}>
        <div className="flex items-center gap-4">
          <span>{characterCount} characters</span>
          <span>{wordCount} words</span>
        </div>
        <div>{saving ? 'Saving...' : 'Ready'}</div>
      </div>
    </div>
  );
};
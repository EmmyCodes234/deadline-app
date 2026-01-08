/**
 * UnifiedNoctuaryEditor Component
 * Integrates EditorCanvas, NoctuarySidebar, and MetadataPanel with focus mode
 * Implements keyboard shortcuts for common actions
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { Menu } from 'lucide-react';
import { useNoctuary } from '../contexts/NoctuaryContext';
import { EditorCanvas } from './EditorCanvas';
import { NoctuarySidebar } from './NoctuarySidebar';
import { MetadataPanel } from './MetadataPanel';
import { ExportModal } from './ExportModal';
import { KeyboardShortcutsModal } from './KeyboardShortcutsModal';
import { QuickDocumentSwitcher } from './QuickDocumentSwitcher';
import { ArcanePulseBorder } from './ArcanePulseBorder';
import { FogOfCreation } from './FogOfCreation';
import './UnifiedNoctuaryEditor.css';

export function UnifiedNoctuaryEditor() {
  const {
    documents,
    activeDocumentId,
    sidebarOpen,
    settings,
    toggleSidebar,
    updateDocument,
    setSaveStatus,
  } = useNoctuary();

  const [isEditorFocused, setIsEditorFocused] = useState(false);
  const [cursorHidden, setCursorHidden] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [isQuickSwitcherOpen, setIsQuickSwitcherOpen] = useState(false);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  // Get active document
  const activeDocument = documents.find(doc => doc.id === activeDocumentId) || null;

  // Handle content changes
  const handleContentChange = useCallback((content: string) => {
    if (activeDocumentId) {
      updateDocument(activeDocumentId, { content });
    }
  }, [activeDocumentId, updateDocument]);

  // Handle title changes
  const handleTitleChange = useCallback((title: string) => {
    if (activeDocumentId) {
      updateDocument(activeDocumentId, { title });
    }
  }, [activeDocumentId, updateDocument]);

  // Handle synopsis changes
  const handleSynopsisChange = useCallback((synopsis: string) => {
    if (activeDocumentId) {
      updateDocument(activeDocumentId, { synopsis });
    }
  }, [activeDocumentId, updateDocument]);

  // Handle tags changes
  const handleTagsChange = useCallback((tags: string[]) => {
    if (activeDocumentId) {
      updateDocument(activeDocumentId, { tags });
    }
  }, [activeDocumentId, updateDocument]);

  // Handle word goal changes
  const handleWordGoalChange = useCallback((wordGoal: number | null) => {
    if (activeDocumentId) {
      updateDocument(activeDocumentId, { wordGoal });
    }
  }, [activeDocumentId, updateDocument]);

  // Reset idle timer on any activity
  const resetIdleTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    setCursorHidden(false);

    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }

    // Hide cursor after 30 seconds of inactivity
    idleTimerRef.current = setTimeout(() => {
      const timeSinceActivity = Date.now() - lastActivityRef.current;
      if (timeSinceActivity >= 30000) {
        setCursorHidden(true);
      }
    }, 30000);
  }, []);

  // Handle manual save (Cmd/Ctrl+S)
  const handleManualSave = useCallback(() => {
    if (!activeDocumentId || !activeDocument) return;

    // Trigger save status indicator
    setSaveStatus('saving');
    
    // Save is already handled by localStorage in context
    // Just show visual feedback
    setTimeout(() => {
      setSaveStatus('saved');
    }, 300);
  }, [activeDocumentId, activeDocument, setSaveStatus]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modKey = isMac ? e.metaKey : e.ctrlKey;

      // Cmd/Ctrl + B: Toggle sidebar
      if (modKey && e.key === 'b') {
        e.preventDefault();
        toggleSidebar();
        return;
      }

      // Cmd/Ctrl + S: Manual save
      if (modKey && e.key === 's') {
        e.preventDefault();
        handleManualSave();
        return;
      }

      // Cmd/Ctrl + E: Export modal
      if (modKey && e.key === 'e') {
        e.preventDefault();
        if (activeDocument) {
          setIsExportModalOpen(true);
        }
        return;
      }

      // Cmd/Ctrl + K: Quick document switcher
      if (modKey && e.key === 'k') {
        e.preventDefault();
        setIsQuickSwitcherOpen(true);
        return;
      }

      // ?: Keyboard shortcuts help
      if (e.key === '?' && !e.shiftKey) {
        e.preventDefault();
        setIsShortcutsModalOpen(true);
        return;
      }

      // Escape: Close any open modal or panel
      if (e.key === 'Escape') {
        if (isExportModalOpen) {
          setIsExportModalOpen(false);
        } else if (isShortcutsModalOpen) {
          setIsShortcutsModalOpen(false);
        } else if (isQuickSwitcherOpen) {
          setIsQuickSwitcherOpen(false);
        }
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    toggleSidebar,
    handleManualSave,
    activeDocument,
    isExportModalOpen,
    isShortcutsModalOpen,
    isQuickSwitcherOpen,
  ]);

  // Track mouse movement and keyboard activity
  useEffect(() => {
    const handleActivity = () => {
      resetIdleTimer();
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('scroll', handleActivity);

    // Initial timer
    resetIdleTimer();

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
    };
  }, [resetIdleTimer]);

  return (
    <>
      <div 
        className={`unified-noctuary-editor ${cursorHidden ? 'cursor-hidden' : ''}`}
        data-editor-focused={isEditorFocused}
      >
        {/* Atmospheric fog effect */}
        <FogOfCreation density="medium" color="neutral" speed="slow" />

        {/* Mobile menu button */}
        <button
          onClick={toggleSidebar}
          className="mobile-menu-button md:hidden fixed top-4 left-4 z-50 p-3 bg-stone-900/95 backdrop-blur-md border border-white/10 rounded-lg hover:bg-stone-800/95 transition-colors"
          aria-label="Toggle sidebar"
          aria-expanded={sidebarOpen}
        >
          <Menu className="w-5 h-5 text-gray-300" />
        </button>

        {/* Sidebar with focus mode opacity */}
        <div 
          className={`sidebar-container ${isEditorFocused ? 'focus-mode' : ''} ${sidebarOpen ? 'sidebar-open' : ''}`}
          style={{
            opacity: isEditorFocused ? 0.3 : 1,
            transition: 'opacity 300ms ease-in-out',
            position: 'relative',
          }}
        >
          <NoctuarySidebar
            isOpen={sidebarOpen}
            onToggle={toggleSidebar}
          />
          {/* Arcane pulse border on right edge */}
          <ArcanePulseBorder position="right" color="purple" intensity="medium" />
        </div>

        {/* Main editor area */}
        <div className="editor-container">
          <EditorCanvas
            document={activeDocument}
            onContentChange={handleContentChange}
            onTitleChange={handleTitleChange}
            settings={settings}
            isFocused={isEditorFocused}
            onFocusChange={setIsEditorFocused}
          />
        </div>

        {/* Metadata panel with focus mode opacity */}
        <div 
          className={`metadata-container ${isEditorFocused ? 'focus-mode' : ''}`}
          style={{
            opacity: isEditorFocused ? 0.3 : 1,
            transition: 'opacity 300ms ease-in-out',
            position: 'relative',
          }}
        >
          {/* Arcane pulse border on left edge */}
          <ArcanePulseBorder position="left" color="purple" intensity="medium" />
          <MetadataPanel
            document={activeDocument}
            onUpdateSynopsis={handleSynopsisChange}
            onUpdateTags={handleTagsChange}
            onUpdateWordGoal={handleWordGoalChange}
          />
        </div>
      </div>

      {/* Modals */}
      {activeDocument && (
        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          document={activeDocument}
        />
      )}

      <KeyboardShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
      />

      <QuickDocumentSwitcher
        isOpen={isQuickSwitcherOpen}
        onClose={() => setIsQuickSwitcherOpen(false)}
      />
    </>
  );
}

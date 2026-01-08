/**
 * EditorCanvas Component
 * Main writing area with contenteditable element, auto-save, and focus mode
 */

import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useNoctuary } from '../contexts/NoctuaryContext';
import type { Document, EditorSettings } from '../types/noctuary';
import './EditorCanvas.css';

interface EditorCanvasProps {
  document: Document | null;
  onContentChange: (content: string) => void;
  onTitleChange: (title: string) => void;
  settings: EditorSettings;
  isFocused: boolean;
  onFocusChange: (focused: boolean) => void;
}

export function EditorCanvas({
  document,
  onContentChange,
  onTitleChange,
  settings,
  isFocused,
  onFocusChange,
}: EditorCanvasProps) {
  const { saveStatus, setSaveStatus } = useNoctuary();
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const savedIndicatorTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Update content when document changes
  useEffect(() => {
    if (contentRef.current && document) {
      // Only update if content is different to avoid cursor jumping
      if (contentRef.current.textContent !== document.content) {
        contentRef.current.textContent = document.content;
      }
    }
  }, [document?.id]); // Only update on document switch

  // Update title when document changes
  useEffect(() => {
    if (titleRef.current && document) {
      if (titleRef.current.textContent !== document.title) {
        titleRef.current.textContent = document.title;
      }
    }
  }, [document?.id]); // Only update on document switch

  // Debounced auto-save function
  const debouncedSave = useCallback((content: string) => {
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set saving status immediately
    setSaveStatus('saving');

    // Save after 500ms
    saveTimeoutRef.current = setTimeout(() => {
      onContentChange(content);
      setSaveStatus('saved');

      // Clear "Saved" indicator after 2 seconds
      if (savedIndicatorTimeoutRef.current) {
        clearTimeout(savedIndicatorTimeoutRef.current);
      }
      savedIndicatorTimeoutRef.current = setTimeout(() => {
        setSaveStatus('saved');
      }, 2000);
    }, 500);
  }, [onContentChange, setSaveStatus]);

  // Handle content input
  const handleContentInput = useCallback(() => {
    if (contentRef.current) {
      const content = contentRef.current.textContent || '';
      debouncedSave(content);
    }
  }, [debouncedSave]);

  // Handle title input
  const handleTitleInput = useCallback(() => {
    if (titleRef.current) {
      const title = titleRef.current.textContent || 'Untitled';
      onTitleChange(title);
    }
  }, [onTitleChange]);

  // Handle focus events
  const handleFocus = useCallback(() => {
    onFocusChange(true);
  }, [onFocusChange]);

  const handleBlur = useCallback(() => {
    onFocusChange(false);
  }, [onFocusChange]);

  // Keyboard shortcut handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modKey = isMac ? e.metaKey : e.ctrlKey;

      // Cmd/Ctrl + S: Manual save
      if (modKey && e.key === 's') {
        e.preventDefault();
        if (contentRef.current && document) {
          const content = contentRef.current.textContent || '';
          onContentChange(content);
          setSaveStatus('saved');
          
          // Show "Saved" indicator for 2 seconds
          if (savedIndicatorTimeoutRef.current) {
            clearTimeout(savedIndicatorTimeoutRef.current);
          }
          savedIndicatorTimeoutRef.current = setTimeout(() => {
            setSaveStatus('saved');
          }, 2000);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [document, onContentChange, setSaveStatus]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      if (savedIndicatorTimeoutRef.current) {
        clearTimeout(savedIndicatorTimeoutRef.current);
      }
    };
  }, []);

  // Warn about unsaved changes before navigation
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (saveStatus === 'saving') {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [saveStatus]);

  if (!document) {
    return (
      <div className="editor-canvas-empty">
        <p>Select a document to start writing</p>
      </div>
    );
  }

  return (
    <div 
      className="editor-canvas"
      style={{
        fontFamily: settings.fontFamily,
        fontSize: `${settings.fontSize}px`,
        lineHeight: settings.lineHeight,
        maxWidth: `${settings.editorWidth}ch`,
      }}
    >
      {/* Save status indicator - ARIA live region for screen readers */}
      <div 
        className="save-status"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        aria-relevant="additions text"
      >
        {saveStatus === 'saving' && <span>Saving...</span>}
        {saveStatus === 'saved' && <span>Saved</span>}
        {saveStatus === 'error' && <span>Error saving</span>}
      </div>

      {/* Document title */}
      <div
        ref={titleRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleTitleInput}
        className="editor-title"
        role="textbox"
        aria-label="Document title"
        aria-multiline="false"
        data-placeholder="Untitled"
      />

      {/* Main content editor */}
      <div
        ref={contentRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleContentInput}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="editor-content"
        role="textbox"
        aria-label="Document content"
        aria-multiline="true"
        data-placeholder="Start writing..."
      />
    </div>
  );
}

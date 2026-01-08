/**
 * React Context for Noctuary Editor global state management
 */

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Document, EditorSettings, NoctuaryState, Snapshot } from '../types/noctuary';

interface NoctuaryContextValue extends NoctuaryState {
  // Document operations
  createDocument: () => string;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  deleteDocument: (id: string) => void;
  setActiveDocument: (id: string | null) => void;
  
  // Snapshot operations
  createSnapshot: (documentId: string) => void;
  restoreSnapshot: (documentId: string, snapshotId: string) => void;
  deleteSnapshot: (documentId: string, snapshotId: string) => void;
  
  // Settings operations
  updateSettings: (updates: Partial<EditorSettings>) => void;
  
  // UI operations
  toggleSidebar: () => void;
  setSaveStatus: (status: 'saved' | 'saving' | 'error') => void;
}

const NoctuaryContext = createContext<NoctuaryContextValue | undefined>(undefined);

const DEFAULT_SETTINGS: EditorSettings = {
  fontFamily: 'IM Fell English',
  fontSize: 16,
  lineHeight: 1.6,
  editorWidth: 70,
  theme: 'dark',
};

interface NoctuaryProviderProps {
  children: ReactNode;
}

export function NoctuaryProvider({ children }: NoctuaryProviderProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [settings, setSettings] = useState<EditorSettings>(DEFAULT_SETTINGS);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const storedDocuments = localStorage.getItem('noctuary:documents');
      const storedSettings = localStorage.getItem('noctuary:settings');
      const storedActiveId = localStorage.getItem('noctuary:activeDocumentId');

      if (storedDocuments) {
        setDocuments(JSON.parse(storedDocuments));
      }
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      }
      if (storedActiveId) {
        setActiveDocumentId(JSON.parse(storedActiveId));
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
    }
  }, []);

  // Persist documents to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('noctuary:documents', JSON.stringify(documents));
    } catch (error) {
      console.error('Failed to save documents to localStorage:', error);
      setSaveStatus('error');
    }
  }, [documents]);

  // Persist settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('noctuary:settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings to localStorage:', error);
    }
  }, [settings]);

  // Persist active document ID to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('noctuary:activeDocumentId', JSON.stringify(activeDocumentId));
    } catch (error) {
      console.error('Failed to save active document ID to localStorage:', error);
    }
  }, [activeDocumentId]);

  const createDocument = useCallback((): string => {
    const newDocument: Document = {
      id: uuidv4(),
      title: 'Untitled',
      content: '',
      folderId: null,
      tags: [],
      wordGoal: null,
      synopsis: '',
      snapshots: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setDocuments(prev => [...prev, newDocument]);
    setActiveDocumentId(newDocument.id);
    return newDocument.id;
  }, []);

  const updateDocument = useCallback((id: string, updates: Partial<Document>) => {
    setDocuments(prev =>
      prev.map(doc =>
        doc.id === id
          ? { ...doc, ...updates, updatedAt: Date.now() }
          : doc
      )
    );
  }, []);

  const deleteDocument = useCallback((id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
    if (activeDocumentId === id) {
      setActiveDocumentId(null);
    }
  }, [activeDocumentId]);

  const setActiveDocument = useCallback((id: string | null) => {
    setActiveDocumentId(id);
  }, []);

  const createSnapshot = useCallback((documentId: string) => {
    setDocuments(prev =>
      prev.map(doc => {
        if (doc.id !== documentId) return doc;

        const wordCount = doc.content.trim().split(/\s+/).filter(w => w.length > 0).length;
        const newSnapshot: Snapshot = {
          id: uuidv4(),
          content: doc.content,
          wordCount,
          timestamp: Date.now(),
        };

        return {
          ...doc,
          snapshots: [...doc.snapshots, newSnapshot],
          updatedAt: Date.now(),
        };
      })
    );
  }, []);

  const restoreSnapshot = useCallback((documentId: string, snapshotId: string) => {
    setDocuments(prev =>
      prev.map(doc => {
        if (doc.id !== documentId) return doc;

        const snapshot = doc.snapshots.find(s => s.id === snapshotId);
        if (!snapshot) return doc;

        return {
          ...doc,
          content: snapshot.content,
          updatedAt: Date.now(),
        };
      })
    );
  }, []);

  const deleteSnapshot = useCallback((documentId: string, snapshotId: string) => {
    setDocuments(prev =>
      prev.map(doc => {
        if (doc.id !== documentId) return doc;

        return {
          ...doc,
          snapshots: doc.snapshots.filter(s => s.id !== snapshotId),
          updatedAt: Date.now(),
        };
      })
    );
  }, []);

  const updateSettings = useCallback((updates: Partial<EditorSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  const value: NoctuaryContextValue = {
    documents,
    activeDocumentId,
    sidebarOpen,
    settings,
    saveStatus,
    createDocument,
    updateDocument,
    deleteDocument,
    setActiveDocument,
    createSnapshot,
    restoreSnapshot,
    deleteSnapshot,
    updateSettings,
    toggleSidebar,
    setSaveStatus,
  };

  return (
    <NoctuaryContext.Provider value={value}>
      {children}
    </NoctuaryContext.Provider>
  );
}

export function useNoctuary() {
  const context = useContext(NoctuaryContext);
  if (context === undefined) {
    throw new Error('useNoctuary must be used within a NoctuaryProvider');
  }
  return context;
}

/**
 * Unified Noctuary Sidebar Component
 * Provides document navigation, organization, and search functionality
 */

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Search, Plus, Folder, FileText, ChevronRight, ChevronDown, X } from 'lucide-react';
import clsx from 'clsx';
import { useNoctuary } from '../contexts/NoctuaryContext';
import type { Document } from '../types/noctuary';
import './NoctuarySidebar.css';

interface NoctuarySidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

interface FlattenedItem {
  id: string;
  type: 'document' | 'folder';
  document?: Document;
  folderName?: string;
  level: number;
  isExpanded?: boolean;
}

export function NoctuarySidebar({ isOpen, onToggle }: NoctuarySidebarProps) {
  const {
    documents,
    activeDocumentId,
    createDocument,
    deleteDocument,
    updateDocument,
    setActiveDocument,
  } = useNoctuary();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);
  
  const listRef = useRef<any>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Filter documents by search query and tags
  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      // Search filter
      const matchesSearch = searchQuery.trim() === '' ||
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      // Tag filter
      const matchesTags = selectedTags.length === 0 ||
        selectedTags.every(tag => doc.tags.includes(tag));

      return matchesSearch && matchesTags;
    });
  }, [documents, searchQuery, selectedTags]);

  // Group documents by folder
  const documentsByFolder = useMemo(() => {
    const grouped = new Map<string | null, Document[]>();
    
    filteredDocuments.forEach(doc => {
      const folderId = doc.folderId;
      if (!grouped.has(folderId)) {
        grouped.set(folderId, []);
      }
      grouped.get(folderId)!.push(doc);
    });

    return grouped;
  }, [filteredDocuments]);

  // Get unique folder IDs
  const folderIds = useMemo(() => {
    const ids = new Set<string>();
    documents.forEach(doc => {
      if (doc.folderId) {
        ids.add(doc.folderId);
      }
    });
    return Array.from(ids);
  }, [documents]);

  // Flatten the document tree for virtual scrolling
  const flattenedItems = useMemo(() => {
    const items: FlattenedItem[] = [];

    // Add root documents (no folder)
    const rootDocs = documentsByFolder.get(null) || [];
    rootDocs.forEach(doc => {
      items.push({
        id: doc.id,
        type: 'document',
        document: doc,
        level: 0,
      });
    });

    // Add folders and their documents
    folderIds.forEach(folderId => {
      const isExpanded = expandedFolders.has(folderId);
      
      items.push({
        id: folderId,
        type: 'folder',
        folderName: `Folder ${folderId.slice(0, 8)}`,
        level: 0,
        isExpanded,
      });

      if (isExpanded) {
        const folderDocs = documentsByFolder.get(folderId) || [];
        folderDocs.forEach(doc => {
          items.push({
            id: doc.id,
            type: 'document',
            document: doc,
            level: 1,
          });
        });
      }
    });

    return items;
  }, [documentsByFolder, folderIds, expandedFolders]);

  // Toggle folder expansion
  const toggleFolder = useCallback((folderId: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  }, []);

  // Handle document selection
  const handleSelectDocument = useCallback((id: string) => {
    setActiveDocument(id);
  }, [setActiveDocument]);

  // Handle document creation
  const handleCreateDocument = useCallback(() => {
    createDocument();
  }, [createDocument]);

  // Handle document deletion
  const handleDeleteDocument = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this document?')) {
      deleteDocument(id);
    }
  }, [deleteDocument]);

  // Drag and drop handlers
  const handleDragStart = useCallback((e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (draggedId && draggedId !== id) {
      setDragOverId(id);
    }
  }, [draggedId]);

  const handleDrop = useCallback((e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    
    if (!draggedId || draggedId === targetId) {
      setDraggedId(null);
      setDragOverId(null);
      return;
    }

    // Find the dragged and target documents
    const draggedDoc = documents.find(d => d.id === draggedId);
    const targetItem = flattenedItems.find(item => item.id === targetId);

    if (!draggedDoc || !targetItem) {
      setDraggedId(null);
      setDragOverId(null);
      return;
    }

    // Reorder logic
    const draggedIndex = documents.findIndex(d => d.id === draggedId);
    const targetIndex = documents.findIndex(d => d.id === targetId);

    if (draggedIndex !== -1 && targetIndex !== -1) {
      const newDocuments = [...documents];
      const [removed] = newDocuments.splice(draggedIndex, 1);
      newDocuments.splice(targetIndex, 0, removed);
      
      // Update document order (this would need to be implemented in context)
      // For now, we'll just update the dragged document's folder if dropping on a folder
      if (targetItem.type === 'folder') {
        updateDocument(draggedId, { folderId: targetId });
      }
    }

    setDraggedId(null);
    setDragOverId(null);
  }, [draggedId, documents, flattenedItems, updateDocument]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!sidebarRef.current?.contains(document.activeElement)) {
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex(prev => Math.min(prev + 1, flattenedItems.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          const item = flattenedItems[focusedIndex];
          if (item) {
            if (item.type === 'document' && item.document) {
              handleSelectDocument(item.document.id);
            } else if (item.type === 'folder') {
              toggleFolder(item.id);
            }
          }
          break;
        case 'Escape':
          e.preventDefault();
          onToggle();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [flattenedItems, focusedIndex, handleSelectDocument, toggleFolder, onToggle]);

  // Keyboard shortcut for Cmd+B / Ctrl+B
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        onToggle();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onToggle]);

  // Render a single row in the virtual list
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const item = flattenedItems[index];
    if (!item) return null;

    const isFocused = index === focusedIndex;
    const paddingLeft = item.level * 24;

    if (item.type === 'folder') {
      return (
        <div
          style={style}
          className={clsx(
            'flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-white/5 transition-colors',
            isFocused && 'bg-white/10',
            dragOverId === item.id && 'bg-blue-500/20'
          )}
          onClick={() => toggleFolder(item.id)}
          onDragOver={(e) => handleDragOver(e, item.id)}
          onDrop={(e) => handleDrop(e, item.id)}
        >
          <div style={{ paddingLeft: `${paddingLeft}px` }} className="flex items-center gap-2 flex-1">
            {item.isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )}
            <Folder className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-gray-300 font-['Crimson_Text']">
              {item.folderName}
            </span>
          </div>
        </div>
      );
    }

    // Document row
    const doc = item.document!;
    const isActive = activeDocumentId === doc.id;

    return (
      <div
        style={style}
        draggable
        onDragStart={(e) => handleDragStart(e, doc.id)}
        onDragOver={(e) => handleDragOver(e, doc.id)}
        onDrop={(e) => handleDrop(e, doc.id)}
        className={clsx(
          'group flex items-center gap-2 px-4 py-2 cursor-pointer transition-colors',
          isActive ? 'bg-red-900/20 border-l-2 border-red-600' : 'hover:bg-white/5',
          isFocused && 'ring-2 ring-blue-500',
          draggedId === doc.id && 'opacity-50',
          dragOverId === doc.id && 'border-t-2 border-blue-500'
        )}
        onClick={() => handleSelectDocument(doc.id)}
      >
        <div style={{ paddingLeft: `${paddingLeft}px` }} className="flex items-center gap-2 flex-1 min-w-0">
          <FileText className={clsx(
            'w-4 h-4 flex-shrink-0',
            isActive ? 'text-red-600' : 'text-gray-400'
          )} />
          <span className={clsx(
            'text-sm truncate font-["Crimson_Text"]',
            isActive ? 'text-red-600 font-semibold' : 'text-gray-300'
          )}>
            {doc.title}
          </span>
        </div>
        <button
          onClick={(e) => handleDeleteDocument(doc.id, e)}
          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition-opacity"
          aria-label="Delete document"
        >
          <X className="w-3 h-3 text-red-400" />
        </button>
      </div>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={clsx(
          'w-80 z-50 transition-transform duration-300',
          'flex flex-col bg-gradient-to-b from-stone-900 to-black backdrop-blur-md border-r border-white/10',
          'md:relative md:translate-x-0',
          'fixed left-0 top-0 bottom-0',
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-200 font-['Playfair_Display'] uppercase tracking-wider">
              Archives
            </h2>
            <button
              onClick={onToggle}
              className="p-2 hover:bg-white/5 rounded transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents..."
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
              aria-label="Search documents"
            />
          </div>
        </div>

        {/* Create document button */}
        <div className="p-4 border-b border-white/10">
          <button
            onClick={handleCreateDocument}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-900/20 hover:bg-red-900/30 border border-red-900/50 rounded-lg text-sm text-red-400 transition-colors font-['Crimson_Text']"
          >
            <Plus className="w-4 h-4" />
            Inscribe Page
          </button>
        </div>

        {/* Document list */}
        <div className="flex-1 overflow-y-auto">
          {flattenedItems.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500 text-sm font-['Crimson_Text']">
              No documents found
            </div>
          ) : (
            <div>
              {flattenedItems.map((item, index) => (
                <Row key={item.id} index={index} style={{}} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

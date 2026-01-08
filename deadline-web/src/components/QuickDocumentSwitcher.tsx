/**
 * QuickDocumentSwitcher Component
 * Quick document switcher modal triggered by Cmd/Ctrl+K
 */

import { useState, useEffect, useRef } from 'react';
import { useNoctuary } from '../contexts/NoctuaryContext';
import type { Document } from '../types/noctuary';

interface QuickDocumentSwitcherProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuickDocumentSwitcher({ isOpen, onClose }: QuickDocumentSwitcherProps) {
  const { documents, activeDocumentId, setActiveDocument } = useNoctuary();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter documents based on search query
  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setSelectedIndex(0);
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < filteredDocuments.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredDocuments[selectedIndex]) {
            handleSelectDocument(filteredDocuments[selectedIndex].id);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredDocuments, selectedIndex, onClose]);

  // Reset selected index when search query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  if (!isOpen) return null;

  const handleSelectDocument = (id: string) => {
    setActiveDocument(id);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/80"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="switcher-modal-title"
    >
      <div
        ref={modalRef}
        className="bg-zinc-900 border border-red-900/30 rounded-lg shadow-2xl w-full max-w-2xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="p-4 border-b border-red-900/20">
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents by title, content, or tags..."
            className="w-full bg-zinc-800 border border-red-900/30 rounded px-4 py-3 text-red-100 placeholder-red-200/40 focus:outline-none focus:border-red-900/50"
            aria-label="Search documents"
          />
        </div>

        {/* Document List */}
        <div className="max-h-96 overflow-y-auto">
          {filteredDocuments.length === 0 ? (
            <div className="p-8 text-center text-red-200/50">
              No documents found
            </div>
          ) : (
            <div className="p-2">
              {filteredDocuments.map((doc, index) => {
                const wordCount = doc.content.trim().split(/\s+/).filter(w => w.length > 0).length;
                const isActive = doc.id === activeDocumentId;
                const isSelected = index === selectedIndex;

                return (
                  <button
                    key={doc.id}
                    onClick={() => handleSelectDocument(doc.id)}
                    className={`w-full text-left p-3 rounded transition-colors ${
                      isSelected
                        ? 'bg-red-900/30 border border-red-900/50'
                        : 'hover:bg-zinc-800 border border-transparent'
                    }`}
                    aria-label={`Select document ${doc.title}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-red-100 truncate">
                            {doc.title}
                          </span>
                          {isActive && (
                            <span className="text-xs text-red-400 bg-red-900/30 px-2 py-0.5 rounded">
                              Active
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-red-200/60">
                          <span>{wordCount} words</span>
                          {doc.tags.length > 0 && (
                            <span className="flex gap-1">
                              {doc.tags.slice(0, 3).map(tag => (
                                <span key={tag} className="bg-zinc-800 px-2 py-0.5 rounded">
                                  {tag}
                                </span>
                              ))}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-red-900/20 bg-zinc-900/50">
          <div className="flex items-center justify-between text-xs text-red-200/50">
            <span>Use ↑↓ to navigate, Enter to select, Esc to close</span>
            <span>{filteredDocuments.length} documents</span>
          </div>
        </div>
      </div>
    </div>
  );
}

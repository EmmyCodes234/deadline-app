/**
 * Example usage of ExportModal component
 * 
 * This file demonstrates how to integrate the ExportModal with the Noctuary editor.
 */

import React, { useState } from 'react';
import { ExportModal } from './ExportModal';
import { useNoctuary } from '../contexts/NoctuaryContext';

export function ExportModalExample() {
  const { documents, activeDocumentId } = useNoctuary();
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const activeDocument = documents.find(doc => doc.id === activeDocumentId);

  const handleExportClick = () => {
    if (activeDocument) {
      setIsExportModalOpen(true);
    }
  };

  return (
    <div>
      <button
        onClick={handleExportClick}
        disabled={!activeDocument}
        className="px-4 py-2 bg-red-900/30 hover:bg-red-900/50 border border-red-900/50 text-red-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Export Document
      </button>

      {activeDocument && (
        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          document={activeDocument}
        />
      )}
    </div>
  );
}

/**
 * Keyboard shortcut integration example
 * 
 * Add this to your main editor component to enable Cmd+E / Ctrl+E for export
 */
export function useExportShortcut() {
  const { documents, activeDocumentId } = useNoctuary();
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+E (Mac) or Ctrl+E (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key === 'e') {
        e.preventDefault();
        const activeDocument = documents.find(doc => doc.id === activeDocumentId);
        if (activeDocument) {
          setIsExportModalOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [documents, activeDocumentId]);

  return {
    isExportModalOpen,
    setIsExportModalOpen,
    activeDocument: documents.find(doc => doc.id === activeDocumentId),
  };
}

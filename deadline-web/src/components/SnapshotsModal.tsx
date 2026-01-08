/**
 * SnapshotsModal Component
 * Displays document version history with snapshot creation, preview, restoration, and deletion
 * 
 * Usage with NoctuaryContext:
 * ```tsx
 * import { useNoctuary } from '@/contexts/NoctuaryContext';
 * import { SnapshotsModal } from '@/components/SnapshotsModal';
 * 
 * function MyEditor() {
 *   const { documents, activeDocumentId, createSnapshot, restoreSnapshot, deleteSnapshot } = useNoctuary();
 *   const [isSnapshotsOpen, setIsSnapshotsOpen] = useState(false);
 *   
 *   const activeDocument = documents.find(d => d.id === activeDocumentId);
 *   
 *   return (
 *     <>
 *       <button onClick={() => setIsSnapshotsOpen(true)}>View Snapshots</button>
 *       
 *       {activeDocument && (
 *         <SnapshotsModal
 *           isOpen={isSnapshotsOpen}
 *           onClose={() => setIsSnapshotsOpen(false)}
 *           document={activeDocument}
 *           onCreateSnapshot={() => createSnapshot(activeDocument.id)}
 *           onRestoreSnapshot={(snapshotId) => restoreSnapshot(activeDocument.id, snapshotId)}
 *           onDeleteSnapshot={(snapshotId) => deleteSnapshot(activeDocument.id, snapshotId)}
 *         />
 *       )}
 *     </>
 *   );
 * }
 * ```
 */

import { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
import { type Document, type Snapshot } from '@/types/noctuary';
import clsx from 'clsx';

interface SnapshotsModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: Document;
  onCreateSnapshot: () => void;
  onRestoreSnapshot: (snapshotId: string) => void;
  onDeleteSnapshot: (snapshotId: string) => void;
}

export function SnapshotsModal({
  isOpen,
  onClose,
  document,
  onCreateSnapshot,
  onRestoreSnapshot,
  onDeleteSnapshot,
}: SnapshotsModalProps) {
  const [selectedSnapshot, setSelectedSnapshot] = useState<Snapshot | null>(null);
  const [hoveredSnapshot, setHoveredSnapshot] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus trap implementation
  useEffect(() => {
    if (!isOpen) return;

    const modal = modalRef.current;
    if (!modal) return;

    // Focus first element when modal opens
    const focusableElements = modal.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus first element
    firstElement?.focus();

    // Trap focus within modal
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (window.document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (window.document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    modal.addEventListener('keydown', handleKeyDown);

    return () => {
      modal.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const snapshots = document.snapshots || [];
  const previewSnapshot = hoveredSnapshot
    ? snapshots.find(s => s.id === hoveredSnapshot)
    : selectedSnapshot;

  // Calculate current word count
  const currentWordCount = document.content.trim().split(/\s+/).filter(w => w.length > 0).length;

  const handleRestore = (snapshotId: string) => {
    if (confirm('Revert to this snapshot? Your current content will be replaced.')) {
      onRestoreSnapshot(snapshotId);
      onClose();
    }
  };

  const handleDelete = (snapshotId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this temporal tomb? This cannot be undone.')) {
      onDeleteSnapshot(snapshotId);
      if (selectedSnapshot?.id === snapshotId) {
        setSelectedSnapshot(null);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="snapshots-modal-title">
      <div className="flex min-h-full items-center justify-center p-4">
        <div ref={modalRef} className="bg-stone-900 border-2 border-purple-500/50 rounded-lg shadow-2xl shadow-purple-500/20 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex-none p-6 border-b-2 border-stone-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon icon="solar:history-bold" className="size-8 text-purple-400" />
                <div>
                  <h2 id="snapshots-modal-title" className="font-['Playfair_Display'] text-2xl font-bold text-stone-100 uppercase tracking-wider">
                    Temporal Tombs
                  </h2>
                  <p className="text-sm text-stone-500 font-serif italic mt-1">
                    Echoes of "{document.title}"
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-stone-500 hover:text-stone-300 transition-colors"
              >
                <Icon icon="solar:close-circle-bold" className="size-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden flex">
            {/* Snapshots List */}
            <div className="w-1/2 border-r border-stone-800 flex flex-col">
              <div className="flex-none p-4 border-b border-stone-800 bg-stone-900/50">
                <button
                  onClick={() => {
                    onCreateSnapshot();
                    setSelectedSnapshot(null);
                  }}
                  className="w-full py-3 border border-purple-500/30 text-purple-400 hover:bg-purple-900/20 hover:border-purple-500 transition-all uppercase tracking-widest text-xs rounded flex items-center justify-center gap-2"
                >
                  <Icon icon="solar:hourglass-bold" className="size-4" />
                  <span>Create New Temporal Tomb</span>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-2 grimoire-scroll">
                {snapshots.length === 0 ? (
                  <div className="text-center py-12 text-stone-600">
                    <Icon icon="solar:history-bold" className="size-16 mx-auto opacity-30 mb-4" />
                    <p className="font-['Playfair_Display'] text-lg">No temporal tombs yet</p>
                    <p className="text-sm mt-2">Create a snapshot to preserve this version</p>
                  </div>
                ) : (
                  <>
                    {/* Current Version */}
                    <div className="p-4 bg-transparent border-2 border-amber-900/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon icon="solar:flame-bold" className="size-4 text-amber-500" />
                        <span className="text-sm font-bold text-amber-500 font-serif uppercase tracking-wider">
                          The Living Text
                        </span>
                      </div>
                      <div className="text-xs text-stone-400 font-serif">
                        {currentWordCount.toLocaleString()} words inscribed
                      </div>
                    </div>

                    {/* Snapshots */}
                    {[...snapshots].reverse().map((snapshot, index) => (
                      <div
                        key={snapshot.id}
                        onClick={() => setSelectedSnapshot(snapshot)}
                        onMouseEnter={() => setHoveredSnapshot(snapshot.id)}
                        onMouseLeave={() => setHoveredSnapshot(null)}
                        className={clsx(
                          'p-4 border rounded-lg cursor-pointer transition-all group',
                          selectedSnapshot?.id === snapshot.id
                            ? 'bg-transparent border-purple-500/50'
                            : 'bg-transparent border-zinc-800 hover:border-purple-500/50'
                        )}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <Icon icon="solar:clock-circle-bold" className="size-4 text-purple-400" />
                            <span className="text-sm font-bold text-stone-200 font-serif">
                              Echo #{snapshots.length - index}
                            </span>
                          </div>
                          <button
                            onClick={(e) => handleDelete(snapshot.id, e)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-stone-600 hover:text-red-400 transition-all"
                          >
                            <Icon icon="solar:trash-bin-trash-bold" className="size-4" />
                          </button>
                        </div>
                        <div className="text-xs text-stone-400 font-serif italic">
                          Recorded: {snapshot.wordCount.toLocaleString()} words
                        </div>
                        <div className="flex justify-end mt-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRestore(snapshot.id);
                            }}
                            className="text-xs text-purple-400 hover:text-purple-300 uppercase tracking-widest transition-colors"
                          >
                            Revert to this Echo
                          </button>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>

            {/* Preview Panel */}
            <div className="w-1/2 flex flex-col bg-stone-950">
              <div className="flex-none p-4 border-b border-stone-800 bg-stone-900/50">
                <div className="flex items-center gap-2">
                  <Icon icon="solar:eye-bold" className="size-4 text-stone-400" />
                  <h3 className="text-sm font-mono text-stone-400 uppercase">Preview</h3>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6 grimoire-scroll">
                {previewSnapshot ? (
                  <div className="prose prose-invert prose-stone max-w-none opacity-70 grayscale-[50%]">
                    {previewSnapshot.content ? (
                      previewSnapshot.content.split('\n').map((paragraph, index) => (
                        <p
                          key={index}
                          className="text-sm text-zinc-400 italic leading-relaxed mb-3 font-serif"
                        >
                          {paragraph || '\u00A0'}
                        </p>
                      ))
                    ) : (
                      <p className="text-stone-600 italic font-serif">
                        (Empty echo)
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-stone-600">
                    <div className="text-center">
                      <Icon icon="solar:document-text-bold" className="size-16 mx-auto opacity-30 mb-4" />
                      <p className="font-['Playfair_Display'] text-lg">
                        Select a snapshot to preview
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex-none p-4 border-t-2 border-stone-800 flex items-center justify-between bg-stone-900/50">
            <div className="text-xs text-stone-500 font-serif italic">
              {snapshots.length} {snapshots.length === 1 ? 'echo' : 'echoes'} preserved
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 text-stone-400 hover:text-stone-200 font-mono uppercase text-sm transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

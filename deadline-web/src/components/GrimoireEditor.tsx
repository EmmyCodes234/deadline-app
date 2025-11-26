import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useCrypt, type CryptItem } from '@/hooks/useCrypt';
import { Sidebar } from '@/components/Sidebar';
import { AltarOfWhispers } from '@/components/AltarOfWhispers';
import { CorkboardView } from '@/components/CorkboardView';
import { ContinuousScroll } from '@/components/ContinuousScroll';
import { CompileModal } from '@/components/CompileModal';
import { SnapshotsModal } from '@/components/SnapshotsModal';
import { Textarea } from '@/components/ui/textarea';
import clsx from 'clsx';

export function GrimoireEditor() {
  const crypt = useCrypt();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openDocuments, setOpenDocuments] = useState<CryptItem[]>([]);
  const [activeDocId, setActiveDocId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'corkboard'>('list');
  const [showCompileModal, setShowCompileModal] = useState(false);
  const [showSnapshotsModal, setShowSnapshotsModal] = useState(false);
  const [continuousScrollMode, setContinuousScrollMode] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus editor when entering Grimoire mode
  useEffect(() => {
    if (editorRef.current && activeDocId && viewMode === 'list' && !continuousScrollMode) {
      editorRef.current.focus();
    }
  }, [activeDocId, viewMode, continuousScrollMode]);

  // Handle opening a document in a tab
  const handleOpenDocument = (id: string) => {
    const item = crypt.items.find((i) => i.id === id);
    if (!item || item.type !== 'tombstone') return;

    // Check if already open
    const isOpen = openDocuments.some((doc) => doc.id === id);
    if (!isOpen) {
      setOpenDocuments((prev) => [...prev, item]);
    }
    setActiveDocId(id);
  };

  // Handle closing a tab
  const handleCloseTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenDocuments((prev) => prev.filter((doc) => doc.id !== id));
    
    // If closing active tab, switch to another
    if (activeDocId === id) {
      const remaining = openDocuments.filter((doc) => doc.id !== id);
      setActiveDocId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  // Memoize active document lookup for performance
  const activeDocument = useMemo(() => 
    activeDocId 
      ? crypt.items.find((item) => item.id === activeDocId && item.type === 'tombstone') || null
      : null,
    [activeDocId, crypt.items]
  );

  // Memoize content change handler
  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (activeDocId) {
      crypt.updateContent(activeDocId, e.target.value);
    }
  }, [activeDocId, crypt]);

  return (
    <div className="flex h-screen bg-[#0c0c0c] overflow-hidden">
      {/* Sidebar - The Crypt - Darker background */}
      <Sidebar
        items={crypt.items}
        currentDocId={activeDocId}
        totalProjectWords={crypt.totalProjectWords}
        onSelectDoc={handleOpenDocument}
        onCreateDoc={crypt.createDoc}
        onCreateMausoleum={crypt.createMausoleum}
        onDeleteDoc={crypt.deleteDoc}
        onUpdateTitle={crypt.updateTitle}
        onToggleExpand={crypt.toggleExpand}
        onReorderItems={crypt.reorderItems}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        mode="GRIMOIRE"
      />

      {/* Main Content Area - Borderless */}
      <div className={clsx(
        "flex-1 flex flex-col transition-all duration-300",
        sidebarOpen ? "md:ml-80" : "md:ml-0"
      )}>
        {/* Header Bar - Removed borders for seamless feel */}
        <div className="flex-none h-16 bg-zinc-950/30 backdrop-blur-sm flex items-center px-5 gap-4">
          {/* Back to Hub button */}
          <Link
            to="/hub"
            className="flex items-center gap-2 text-zinc-500 hover:text-zinc-200 transition-colors px-3 py-2 rounded hover:bg-zinc-800/50"
            title="Back to Hub"
          >
            <Icon icon="solar:arrow-left-bold" className="size-5" />
            <span className="text-sm hidden sm:inline">Hub</span>
          </Link>
          
          {/* Show Crypt button - only visible when sidebar is collapsed on desktop */}
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="hidden md:block btn-magical px-3 py-2 rounded transition-colors"
              title="Show Crypt"
            >
              <Icon icon="solar:hamburger-menu-bold" className="size-5 text-stone-300" />
            </button>
          )}
          <div className="flex items-center gap-3">
            <Icon 
              icon="solar:book-bold" 
              className="size-7 text-purple-400" 
              style={{ filter: 'drop-shadow(0 0 10px rgba(168, 85, 247, 0.6))' }}
            />
            <h1 className="font-['Playfair_Display'] text-2xl font-bold text-stone-100 title-dramatic uppercase tracking-wider">
              The Grimoire
            </h1>
          </div>
          <div className="flex-1" />
          
          {/* Snapshots Button - Simple Link Style */}
          {activeDocument && viewMode === 'list' && !continuousScrollMode && (
            <button
              onClick={() => setShowSnapshotsModal(true)}
              className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mr-4"
              title="Temporal Tombs (Snapshots)"
            >
              <Icon icon="solar:arrow-left-bold" className="size-4" />
              <span className="text-sm hidden sm:inline">Tombs</span>
            </button>
          )}

          {/* Export Button - Whisper Until Hovered */}
          <button
            onClick={() => setShowCompileModal(true)}
            className="bg-transparent border border-amber-900/30 text-amber-600 hover:text-amber-400 hover:border-amber-500 hover:shadow-[0_0_10px_rgba(245,158,11,0.2)] transition-all duration-300 flex items-center gap-2 px-4 py-2 rounded mr-4"
            title="Export Manuscript"
          >
            <Icon icon="solar:scroll-bold" className="size-4" />
            <span className="text-xs font-mono uppercase tracking-widest hidden sm:inline">RESURRECT</span>
          </button>
          
          {/* View Mode Toggle - Floating Icons */}
          <div className="flex items-center gap-3 mr-4">
            <button
              onClick={() => {
                setViewMode('list');
                setContinuousScrollMode(false);
              }}
              className="transition-colors"
              title="List View"
            >
              <Icon icon="solar:list-bold" className={clsx(
                'size-5',
                viewMode === 'list' && !continuousScrollMode 
                  ? 'text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.5)]' 
                  : 'text-zinc-600 hover:text-zinc-300'
              )} />
            </button>
            <button
              onClick={() => {
                setViewMode('list');
                setContinuousScrollMode(true);
              }}
              className="transition-colors"
              title="The Chronicle"
            >
              <Icon icon="solar:infinity-bold" className={clsx(
                'size-5',
                continuousScrollMode 
                  ? 'text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.5)]' 
                  : 'text-zinc-600 hover:text-zinc-300'
              )} />
            </button>
            <button
              onClick={() => {
                setViewMode('corkboard');
                setContinuousScrollMode(false);
              }}
              className="transition-colors"
              title="The Plotting Board"
            >
              <Icon icon="solar:widget-5-bold" className={clsx(
                'size-5',
                viewMode === 'corkboard' 
                  ? 'text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.5)]' 
                  : 'text-zinc-600 hover:text-zinc-300'
              )} />
            </button>
          </div>
          
          <div className="text-xs text-stone-500 font-mono">
            {crypt.totalProjectWords.toLocaleString()} words
          </div>
        </div>



        {/* Editor Area */}
        <div className="flex-1 flex overflow-hidden">
          {viewMode === 'corkboard' ? (
            /* Corkboard View */
            <CorkboardView
              items={crypt.items}
              activeDocId={activeDocId}
              onSelectDoc={handleOpenDocument}
              onDeleteDoc={crypt.deleteDoc}
              onUpdateNotes={(id, notes) => crypt.updateNotes(id, notes)}
              onReorderItems={crypt.reorderCryptItems}
            />
          ) : continuousScrollMode ? (
            /* Continuous Scroll View */
            <ContinuousScroll
              documents={openDocuments.map(doc => 
                crypt.items.find(item => item.id === doc.id) || doc
              )}
            />
          ) : (
            <>
              {/* Central Editor - Floating Paper Effect */}
              <div className="flex-1 flex flex-col bg-[#0c0c0c] relative">
                {activeDocument ? (
                  <div className={clsx(
                    "flex-1 overflow-y-auto transition-all duration-300",
                    sidebarOpen ? "p-12" : "px-24 py-12"
                  )}>
                    {/* Editable Title as H1 - SERIF FONT */}
                    <input
                      type="text"
                      value={activeDocument.title}
                      onChange={(e) => crypt.updateTitle(activeDocument.id, e.target.value)}
                      className="w-full bg-transparent border-none outline-none text-4xl md:text-5xl font-serif font-bold text-zinc-100 mb-8 focus:text-white transition-colors placeholder:text-zinc-700"
                      placeholder="Untitled Haunting"
                      spellCheck={false}
                    />
                    
                    {/* Main Editor - Larger, More Readable */}
                    <Textarea
                      ref={editorRef}
                      value={activeDocument.content}
                      onChange={handleContentChange}
                      placeholder="Begin your tale..."
                      spellCheck={false}
                      className="w-full h-full bg-transparent border-none text-lg text-zinc-300 leading-8 resize-none focus:ring-0 focus:outline-none placeholder:text-zinc-700/60 caret-orange-500 font-serif"
                      style={{ minHeight: 'calc(100vh - 300px)' }}
                    />
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-stone-600">
                    <div className="text-center space-y-4">
                      <Icon icon="solar:book-bold" className="size-16 mx-auto opacity-50" />
                      <p className="text-xl font-['Playfair_Display']">
                        Select a document from the Crypt to begin
                      </p>
                      <p className="text-sm">
                        or create a new haunting
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Panel - Altar of Whispers - Glassmorphism */}
              <div className="hidden lg:block w-80 flex-none bg-zinc-950/50 backdrop-blur-md">
                <AltarOfWhispers 
              activeDocument={activeDocument || null}
              onUpdateSynopsis={(synopsis) => {
                if (activeDocId) {
                  crypt.updateNotes(activeDocId, { synopsis });
                }
              }}
              onAddCharacter={(name, description) => {
                if (activeDocId) {
                  crypt.addCharacter(activeDocId, name, description);
                }
              }}
              onUpdateCharacter={(charId, name, description) => {
                if (activeDocId) {
                  crypt.updateCharacter(activeDocId, charId, name, description);
                }
              }}
              onDeleteCharacter={(charId) => {
                if (activeDocId) {
                  crypt.deleteCharacter(activeDocId, charId);
                }
              }}
              onAddResearch={(title, url) => {
                if (activeDocId) {
                  crypt.addResearch(activeDocId, title, url);
                }
              }}
              onUpdateResearch={(researchId, title, url) => {
                if (activeDocId) {
                  crypt.updateResearch(activeDocId, researchId, title, url);
                }
              }}
              onDeleteResearch={(researchId) => {
                if (activeDocId) {
                  crypt.deleteResearch(activeDocId, researchId);
                }
              }}
              onUpdateWordGoal={(goal) => {
                if (activeDocId) {
                  crypt.updateWordGoal(activeDocId, goal);
                }
              }}
            />
              </div>
            </>
          )}
        </div>

        {/* Footer Stats - Timeless */}
        <div className="flex-none h-12 bg-zinc-950/30 backdrop-blur-sm flex items-center justify-center px-6">
          {activeDocument && (
            <p className="font-serif italic text-zinc-600 text-sm">
              ~ {activeDocument.wordCount.toLocaleString()} words inscribed ~
            </p>
          )}
        </div>
      </div>

      {/* Compile Modal */}
      <CompileModal
        isOpen={showCompileModal}
        onClose={() => setShowCompileModal(false)}
        cryptItems={crypt.items}
        projectTitle="My Manuscript"
      />

      {/* Snapshots Modal */}
      <SnapshotsModal
        isOpen={showSnapshotsModal}
        onClose={() => setShowSnapshotsModal(false)}
        activeDocument={activeDocument}
        onTakeSnapshot={() => {
          if (activeDocId) {
            crypt.takeSnapshot(activeDocId);
          }
        }}
        onRevertToSnapshot={(snapshotId) => {
          if (activeDocId) {
            crypt.revertToSnapshot(activeDocId, snapshotId);
          }
        }}
        onDeleteSnapshot={(snapshotId) => {
          if (activeDocId) {
            crypt.deleteSnapshot(activeDocId, snapshotId);
          }
        }}
      />
    </div>
  );
}

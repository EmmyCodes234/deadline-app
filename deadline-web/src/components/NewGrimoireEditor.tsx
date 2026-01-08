import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useCrypt, type CryptItem } from '@/hooks/useCrypt';
import { AltarOfWhispers } from '@/components/AltarOfWhispers';
import { TiptapGrimoireEditor } from '@/components/TiptapGrimoireEditor';
import { CompileModal } from '@/components/CompileModal';
import { ArcanePulseBorder } from '@/components/ArcanePulseBorder';
import { FogOfCreation } from '@/components/FogOfCreation';
import ElectricBorder from '@/components/ui/ElectricBorder';
import clsx from 'clsx';

interface DocumentTab {
  id: string;
  title: string;
  isActive: boolean;
  isDirty: boolean;
}

export function NewGrimoireEditor() {
  const crypt = useCrypt();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openTabs, setOpenTabs] = useState<DocumentTab[]>([]);
  const [activeDocId, setActiveDocId] = useState<string | null>(null);
  const [showCompileModal, setShowCompileModal] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(true);
  const [ritualMode, setRitualMode] = useState(false);
  const [currentWordCount, setCurrentWordCount] = useState(0);

  // Memoize callbacks to prevent re-renders
  const handleEditorContentChange = useCallback((newValue: string) => {
    if (activeDocId) {
      crypt.updateContent(activeDocId, newValue);
      // Mark tab as dirty
      setOpenTabs(prev => prev.map(tab => 
        tab.id === activeDocId ? { ...tab, isDirty: true } : tab
      ));
    }
  }, [activeDocId, crypt]);

  const handleEditorWordCountChange = useCallback((count: number) => {
    setCurrentWordCount(count);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + B: Toggle sidebar
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        setSidebarOpen(prev => !prev);
      }
      // Ctrl/Cmd + N: New document
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        const newDocId = crypt.createDoc();
        handleOpenDocument(newDocId);
      }
      // Ctrl/Cmd + E: Export
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        setShowCompileModal(true);
      }
      // Ctrl/Cmd + Shift + F: Toggle Ritual Mode (Focus)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'F') {
        e.preventDefault();
        setRitualMode(prev => !prev);
      }
      // Escape: Close modals, exit ritual mode
      if (e.key === 'Escape') {
        if (showCompileModal) {
          setShowCompileModal(false);
        } else if (ritualMode) {
          setRitualMode(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [crypt, showCompileModal, ritualMode]);

  // Handle opening a document in a tab
  const handleOpenDocument = (id: string) => {
    const item = crypt.items.find((i) => i.id === id);
    if (!item || item.type !== 'tombstone') return;

    // Check if already open
    const isOpen = openTabs.some((tab) => tab.id === id);
    if (!isOpen) {
      const newTab: DocumentTab = {
        id,
        title: item.title || 'Untitled',
        isActive: true,
        isDirty: false
      };
      setOpenTabs((prev) => [...prev.map(t => ({ ...t, isActive: false })), newTab]);
    } else {
      // Just activate the tab
      setOpenTabs(prev => prev.map(tab => ({ ...tab, isActive: tab.id === id })));
    }
    setActiveDocId(id);
  };

  // Handle closing a tab
  const handleCloseTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenTabs((prev) => prev.filter((tab) => tab.id !== id));
    
    // If closing active tab, switch to another
    if (activeDocId === id) {
      const remaining = openTabs.filter((tab) => tab.id !== id);
      if (remaining.length > 0) {
        const nextTab = remaining[remaining.length - 1];
        setActiveDocId(nextTab.id);
        setOpenTabs(prev => prev.map(tab => ({ 
          ...tab, 
          isActive: tab.id === nextTab.id 
        })));
      } else {
        setActiveDocId(null);
      }
    }
  };

  // Handle tab click
  const handleTabClick = (id: string) => {
    setActiveDocId(id);
    setOpenTabs(prev => prev.map(tab => ({ ...tab, isActive: tab.id === id })));
  };

  // Memoize active document lookup for performance
  const activeDocument = useMemo(() => 
    activeDocId 
      ? crypt.items.find((item) => item.id === activeDocId && item.type === 'tombstone') || null
      : null,
    [activeDocId, crypt.items]
  );

  // Update tab titles when document titles change
  useEffect(() => {
    setOpenTabs(prev => prev.map(tab => {
      const doc = crypt.items.find(item => item.id === tab.id);
      return doc ? { ...tab, title: doc.title || 'Untitled' } : tab;
    }));
  }, [crypt.items]);

  return (
    <div 
      className={clsx(
        "fixed inset-0 flex h-screen overflow-hidden m-0 p-0 transition-colors duration-500",
        ritualMode ? "bg-black" : "bg-[#0a0a0a]"
      )} 
      style={{ 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0,
        backgroundImage: ritualMode 
          ? 'none'
          : `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.5' numOctaves='6' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E")`,
        backgroundSize: '150px 150px',
        backgroundColor: '#0a0a0a'
      }}>
      
      {/* Atmospheric fog effect - hidden in ritual mode */}
      {!ritualMode && <FogOfCreation density="light" color="red" speed="slow" />}

      {/* Left Sidebar - File Tree */}
      <div 
        className={clsx(
          "transition-all duration-300 bg-[#1a1a1a] border-r border-white/10 flex flex-col relative",
          ritualMode ? "opacity-0 -translate-x-full pointer-events-none w-0" : "opacity-100 translate-x-0",
          sidebarOpen ? "w-72" : "w-0"
        )}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='300' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='leather'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='5' seed='7' /%3E%3CfeColorMatrix type='saturate' values='0.2'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23leather)' opacity='0.08' fill='%23a0826d'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      >
        {sidebarOpen && (
          <>
            {/* Sidebar Header */}
            <div className="flex-none p-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon icon="solar:folder-bold" className="size-5 text-amber-400" />
                  <span className="font-['Playfair_Display'] text-lg font-bold text-stone-100">
                    The Crypt
                  </span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 text-zinc-400 hover:text-zinc-100 transition-colors"
                  title="Hide Sidebar"
                >
                  <Icon icon="solar:sidebar-minimalistic-bold" className="size-4" />
                </button>
              </div>
            </div>

            {/* File Tree */}
            <div className="flex-1 overflow-y-auto p-2">
              <div className="space-y-1">
                {crypt.items
                  .filter(item => item.type === 'tombstone')
                  .map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleOpenDocument(item.id)}
                      className={clsx(
                        "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all group",
                        activeDocId === item.id
                          ? "bg-red-950/50 text-red-200 border border-red-800/50"
                          : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                      )}
                    >
                      <Icon 
                        icon="solar:document-text-bold" 
                        className={clsx(
                          "size-4 flex-none",
                          activeDocId === item.id ? "text-red-400" : "text-zinc-500 group-hover:text-zinc-300"
                        )} 
                      />
                      <span className="flex-1 truncate text-sm">
                        {item.title || 'Untitled Document'}
                      </span>
                      {item.wordCount > 0 && (
                        <span className="text-xs text-zinc-500 flex-none">
                          {item.wordCount}
                        </span>
                      )}
                    </button>
                  ))}
              </div>

              {/* New Document Button */}
              <button
                onClick={() => {
                  const newDocId = crypt.createDoc();
                  handleOpenDocument(newDocId);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 mt-4 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-all border-2 border-dashed border-zinc-700 hover:border-zinc-600"
              >
                <Icon icon="solar:add-circle-bold" className="size-4" />
                <span className="text-sm">New Document</span>
              </button>
            </div>

            {/* Arcane pulse border on right edge */}
            <ArcanePulseBorder position="right" color="red" intensity="medium" />
          </>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="flex-none h-14 bg-zinc-950/30 backdrop-blur-sm flex items-center px-4 gap-4 border-b border-white/5">
          {/* Left: Navigation */}
          <div className="flex items-center gap-2">
            <Link
              to="/hub"
              className="flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors px-3 py-2 rounded hover:bg-zinc-800/50 group"
              title="Back to Hub (Esc)"
            >
              <Icon icon="solar:arrow-left-bold" className="size-4 group-hover:scale-110 transition-transform" />
              <span className="text-sm hidden sm:inline">Hub</span>
            </Link>
            
            {/* Show Sidebar button - only visible when sidebar is collapsed */}
            {!sidebarOpen && !ritualMode && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="flex items-center gap-2 text-zinc-400 hover:text-zinc-100 px-3 py-2 rounded hover:bg-zinc-800/50 transition-colors"
                title="Show Files (Ctrl+B)"
              >
                <Icon icon="solar:hamburger-menu-bold" className="size-4" />
                <span className="text-sm">Files</span>
              </button>
            )}
          </div>

          <div className="h-6 w-px bg-white/10" />
          
          {/* Center: Title */}
          <div className="flex items-center gap-3">
            <Icon 
              icon="solar:book-bold" 
              className="size-6 text-red-400" 
              style={{ filter: 'drop-shadow(0 0 10px rgba(220, 38, 38, 0.6))' }}
            />
            <h1 className="font-['Playfair_Display'] text-xl font-bold text-stone-100 uppercase tracking-wider">
              Grimoire
            </h1>
          </div>
          
          <div className="flex-1" />
          
          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* AI Assistant Toggle */}
            {!ritualMode && (
              <button
                onClick={() => setAssistantOpen(!assistantOpen)}
                className={clsx(
                  "flex items-center gap-2 px-3 py-2 rounded transition-all",
                  assistantOpen
                    ? "bg-purple-950/50 text-purple-200 border border-purple-800/50"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                )}
                title="Toggle AI Assistant"
              >
                <Icon icon="solar:magic-stick-3-bold" className="size-4" />
                <span className="text-sm hidden lg:inline">Assistant</span>
              </button>
            )}

            {/* Ritual Mode Toggle */}
            <button
              onClick={() => setRitualMode(!ritualMode)}
              className={clsx(
                "flex items-center gap-2 px-4 py-2 rounded transition-all group",
                ritualMode
                  ? "bg-red-950/50 border border-red-600 text-red-200 shadow-[0_0_15px_rgba(220,38,38,0.5)]"
                  : "bg-transparent border border-red-800 hover:border-red-600 text-red-300 hover:text-red-100 hover:bg-red-950/30"
              )}
              title="Ritual Mode - Focus (Ctrl+Shift+F)"
            >
              <Icon icon="solar:candle-bold" className="size-4 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium hidden lg:inline">
                {ritualMode ? 'Exit Ritual' : 'Ritual'}
              </span>
            </button>

            {/* Export Button */}
            <button
              onClick={() => setShowCompileModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-[#8B7355] via-[#6B5344] to-[#4A3933] hover:from-[#9B8365] hover:via-[#7B6354] hover:to-[#5A4943] border border-[#D4AF37] hover:border-[#FFD700] rounded transition-all group shadow-lg"
              title="Export Manuscript (Ctrl+E)"
            >
              <Icon icon="solar:export-bold" className="size-4 text-[#FFD700] group-hover:text-[#FFF4CC] transition-colors" />
              <span className="text-sm font-medium text-[#FFD700] group-hover:text-[#FFF4CC] hidden lg:inline">
                Export
              </span>
            </button>
          </div>
        </div>

        {/* Document Tabs */}
        {openTabs.length > 0 && !ritualMode && (
          <div className="flex-none bg-zinc-900/50 border-b border-white/5 px-4">
            <div className="flex items-center gap-1 overflow-x-auto py-2">
              {openTabs.map((tab) => (
                <ElectricBorder
                  key={tab.id}
                  color={tab.isActive ? "#dc2626" : "#4a5568"}
                  speed={tab.isActive ? 0.5 : 0}
                  chaos={0.3}
                  thickness={1}
                  className="flex-none"
                >
                  <button
                    onClick={() => handleTabClick(tab.id)}
                    className={clsx(
                      "flex items-center gap-2 px-4 py-2 rounded-t-lg transition-all group min-w-0",
                      tab.isActive
                        ? "bg-[#1a1816] text-stone-100 border-b-2 border-red-500"
                        : "bg-zinc-800/50 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50"
                    )}
                  >
                    <Icon 
                      icon="solar:document-text-bold" 
                      className={clsx(
                        "size-4 flex-none",
                        tab.isActive ? "text-red-400" : "text-zinc-500"
                      )} 
                    />
                    <span className="truncate text-sm max-w-32">
                      {tab.title}
                    </span>
                    {tab.isDirty && (
                      <div className="size-2 bg-amber-400 rounded-full flex-none" title="Unsaved changes" />
                    )}
                    <button
                      onClick={(e) => handleCloseTab(tab.id, e)}
                      className="p-1 rounded hover:bg-zinc-600/50 transition-colors opacity-0 group-hover:opacity-100"
                      title="Close tab"
                    >
                      <Icon icon="solar:close-circle-bold" className="size-3" />
                    </button>
                  </button>
                </ElectricBorder>
              ))}
            </div>
          </div>
        )}

        {/* Editor Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Central Editor */}
          <div 
            className={clsx(
              "flex-1 flex flex-col relative transition-all duration-500",
              ritualMode ? "bg-black" : "bg-[#1a1816]",
              !ritualMode && assistantOpen ? "mr-0" : "mr-0"
            )}
            style={{
              backgroundImage: ritualMode 
                ? 'none'
                : `url("data:image/svg+xml,%3Csvg width='400' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='parchment'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.8' numOctaves='6' seed='3' /%3E%3CfeColorMatrix type='saturate' values='0.15'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23parchment)' opacity='0.12' fill='%23d4c8b4'/%3E%3C/svg%3E")`,
              backgroundSize: '250px 250px',
              backgroundColor: '#1a1816',
            }}
          >
            {activeDocument ? (
              <div className={clsx(
                "flex-1 overflow-y-auto transition-all duration-500 relative flex flex-col",
                ritualMode 
                  ? "px-8 py-12 mx-auto w-full" 
                  : "px-8 py-8 md:px-12 md:py-12"
              )}
              style={ritualMode ? { maxWidth: '800px' } : undefined}
              >
                <div className="max-w-prose mx-auto w-full flex flex-col flex-1">
                  {/* Editable Title */}
                  <input
                    type="text"
                    value={activeDocument.title}
                    onChange={(e) => crypt.updateTitle(activeDocument.id, e.target.value)}
                    className="w-full bg-transparent border-none outline-none text-3xl md:text-4xl font-['Playfair_Display'] font-bold text-zinc-100 mb-8 focus:text-white transition-colors placeholder:text-zinc-700 pb-3 border-b border-transparent focus:border-red-500/30"
                    placeholder="Untitled Document"
                    spellCheck={false}
                  />
                  
                  {/* Rich Text Editor */}
                  <div className="flex-1">
                    <TiptapGrimoireEditor
                      value={activeDocument.content}
                      onChange={handleEditorContentChange}
                      onWordCountChange={handleEditorWordCountChange}
                      placeholder="Begin your dark manuscript..."
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-stone-600 p-8">
                <div className="text-center space-y-6 max-w-md">
                  <Icon icon="solar:document-text-bold" className="size-20 mx-auto opacity-30" />
                  <div className="space-y-2">
                    <p className="text-2xl font-['Playfair_Display'] text-zinc-400">
                      No Document Open
                    </p>
                    <p className="text-sm text-zinc-500">
                      Select a document from the sidebar or create a new one
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const newDocId = crypt.createDoc();
                      handleOpenDocument(newDocId);
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-red-950 hover:bg-red-900 border border-red-800 rounded-lg text-red-200 hover:text-red-100 transition-all hover:shadow-[0_0_15px_rgba(220,38,38,0.5)]"
                  >
                    <Icon icon="solar:document-add-bold" className="size-5" />
                    <span className="font-medium">New Document</span>
                  </button>
                </div>
              </div>
            )}

            {/* Exit Ritual Button - Floating in Ritual Mode */}
            {ritualMode && (
              <button
                onClick={() => setRitualMode(false)}
                className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2 bg-red-950 hover:bg-red-900 backdrop-blur-md border border-red-800 hover:border-red-700 text-red-200 hover:text-red-100 rounded-lg transition-all shadow-lg hover:shadow-[0_0_15px_rgba(220,38,38,0.5)] group"
                title="Exit Ritual Mode (Esc)"
              >
                <Icon icon="solar:logout-2-bold" className="size-4 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">Exit Ritual</span>
              </button>
            )}
          </div>

          {/* Right Panel - AI Assistant */}
          <div 
            className={clsx(
              "w-80 flex-none bg-zinc-950/50 backdrop-blur-md transition-all duration-300 relative border-l border-white/10",
              ritualMode || !assistantOpen
                ? "opacity-0 translate-x-full pointer-events-none w-0" 
                : "opacity-100 translate-x-0"
            )}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='300' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.2' numOctaves='4' seed='5' /%3E%3CfeColorMatrix type='saturate' values='0.1'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23grain)' opacity='0.06' fill='%23e8dcc8'/%3E%3C/svg%3E")`,
              backgroundSize: '180px 180px',
            }}
          >
            {assistantOpen && (
              <>
                <ArcanePulseBorder position="left" color="purple" intensity="medium" />
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
              </>
            )}
          </div>
        </div>
      </div>

      {/* Compile Modal */}
      <CompileModal
        isOpen={showCompileModal}
        onClose={() => setShowCompileModal(false)}
        cryptItems={crypt.items}
        projectTitle="My Manuscript"
      />
    </div>
  );
}
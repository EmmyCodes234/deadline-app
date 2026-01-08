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
import { FormattingToolbar } from '@/components/FormattingToolbar';
import { TiptapGrimoireEditor } from '@/components/TiptapGrimoireEditor';
import { Textarea } from '@/components/ui/textarea';
import { ArcanePulseBorder } from '@/components/ArcanePulseBorder';
import { FogOfCreation } from '@/components/FogOfCreation';
// Epitaph Feature Panels
import { TensionCurvePanel, FearAnthologyPanel, SeanceChamberPanel } from '@/components/epitaph';
import { useEpitaph } from '@/contexts/EpitaphContext';
import clsx from 'clsx';

export function GrimoireEditor() {
  const crypt = useCrypt();
  const epitaph = useEpitaph();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openDocuments, setOpenDocuments] = useState<CryptItem[]>([]);
  const [activeDocId, setActiveDocId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'corkboard'>('list');
  const [showCompileModal, setShowCompileModal] = useState(false);
  const [showSnapshotsModal, setShowSnapshotsModal] = useState(false);
  const [continuousScrollMode, setContinuousScrollMode] = useState(false);
  const [ritualMode, setRitualMode] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const [currentWordCount, setCurrentWordCount] = useState(0);
  const [selectedText, setSelectedText] = useState('');

  // Memoize callbacks to prevent re-renders
  const handleEditorContentChange = useCallback((newValue: string) => {
    if (activeDocId) {
      crypt.updateContent(activeDocId, newValue);
    }
  }, [activeDocId, crypt]);

  const handleEditorWordCountChange = useCallback((count: number) => {
    setCurrentWordCount(count);
  }, []);

  // Auto-focus editor when entering Grimoire mode
  useEffect(() => {
    if (editorRef.current && activeDocId && viewMode === 'list' && !continuousScrollMode) {
      editorRef.current.focus();
    }
  }, [activeDocId, viewMode, continuousScrollMode]);

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
        crypt.createDoc();
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
      // Escape: Close modals, exit ritual mode, or go back to hub
      if (e.key === 'Escape') {
        if (showCompileModal) {
          setShowCompileModal(false);
        } else if (showSnapshotsModal) {
          setShowSnapshotsModal(false);
        } else if (epitaph.state.isAnthologyOpen) {
          epitaph.toggleAnthology(false);
        } else if (epitaph.state.isSeanceOpen) {
          epitaph.toggleSeance(false);
        } else if (epitaph.state.isTensionCurveVisible) {
          epitaph.toggleTensionCurve(false);
        } else if (ritualMode) {
          setRitualMode(false);
        }
      }
      // Ctrl/Cmd + Shift + T: Toggle Tension Curve
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        epitaph.toggleTensionCurve();
      }
      // Ctrl/Cmd + Shift + A: Toggle Fear Anthology
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        epitaph.toggleAnthology();
      }
      // Ctrl/Cmd + Shift + S: Toggle Séance Chamber
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'S') {
        e.preventDefault();
        epitaph.toggleSeance();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [crypt, showCompileModal, showSnapshotsModal, ritualMode]);

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
  // Commented out as unused - can be re-enabled if needed
  // const handleCloseTab = (id: string, e: React.MouseEvent) => {
  //   e.stopPropagation();
  //   setOpenDocuments((prev) => prev.filter((doc) => doc.id !== id));
  //   
  //   // If closing active tab, switch to another
  //   if (activeDocId === id) {
  //     const remaining = openDocuments.filter((doc) => doc.id !== id);
  //     setActiveDocId(remaining.length > 0 ? remaining[0].id : null);
  //   }
  // };

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

  // Handle text formatting
  const handleFormat = useCallback((format: 'bold' | 'italic' | 'strikethrough' | 'highlight') => {
    if (!editorRef.current || !activeDocId) return;

    const textarea = editorRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);

    if (!selectedText) return;

    let formattedText = '';
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'strikethrough':
        formattedText = `~~${selectedText}~~`;
        break;
      case 'highlight':
        formattedText = `==${selectedText}==`;
        break;
    }

    const newContent =
      textarea.value.substring(0, start) +
      formattedText +
      textarea.value.substring(end);

    crypt.updateContent(activeDocId, newContent);

    // Restore focus and selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + formattedText.length);
    }, 0);
  }, [activeDocId, crypt]);

  // Calculate reading time
  const readingTime = useMemo(() => {
    if (!activeDocument) return 0;
    return Math.ceil(activeDocument.wordCount / 200);
  }, [activeDocument]);

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
        // Subtle noise texture overlay for physical book feel - enhanced for slate/paper texture
        backgroundImage: ritualMode
          ? 'none'
          : `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.5' numOctaves='6' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E")`,
        backgroundSize: '150px 150px',
        backgroundColor: '#0a0a0a'
      }}>
      {/* Atmospheric fog effect - hidden in ritual mode */}
      {!ritualMode && <FogOfCreation density="light" color="red" speed="slow" />}

      {/* Sidebar - The Crypt - Hidden in Ritual Mode */}
      <div
        className={clsx(
          "transition-all duration-500 relative",
          ritualMode ? "opacity-0 -translate-x-full pointer-events-none" : "opacity-100 translate-x-0"
        )}
        style={{
          // Worn leather texture overlay for sidebar
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='300' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='leather'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='5' seed='7' /%3E%3CfeColorMatrix type='saturate' values='0.2'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23leather)' opacity='0.08' fill='%23a0826d'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      >
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
          isOpen={sidebarOpen && !ritualMode}
          onClose={() => setSidebarOpen(false)}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          mode="GRIMOIRE"
        />
        {/* Arcane pulse border on right edge */}
        {!ritualMode && <ArcanePulseBorder position="right" color="red" intensity="medium" />}
      </div>

      {/* Main Content Area - Centered in Ritual Mode */}
      <div className={clsx(
        "flex-1 flex flex-col transition-all duration-500 h-full",
        ritualMode
          ? "ml-0"
          : sidebarOpen ? "ml-0 md:ml-72" : "ml-0"
      )}>
        {/* Header Bar - Improved grouping and spacing */}
        <div className="flex-none h-16 bg-zinc-950/30 backdrop-blur-sm flex items-center px-5 gap-4 border-b border-white/5">
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

            {/* Show Crypt button - only visible when sidebar is collapsed */}
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="hidden md:flex items-center gap-2 text-zinc-400 hover:text-zinc-100 px-3 py-2 rounded hover:bg-zinc-800/50 transition-colors"
                title="Show Documents (Ctrl+B)"
              >
                <Icon icon="solar:hamburger-menu-bold" className="size-4" />
                <span className="text-sm">Documents</span>
              </button>
            )}
          </div>

          {/* Divider */}
          <div className="h-8 w-px bg-white/10" />

          {/* Center: Title */}
          <div className="flex items-center gap-3">
            <Icon
              icon="solar:book-bold"
              className="size-6 text-red-400"
              style={{ filter: 'drop-shadow(0 0 10px rgba(220, 38, 38, 0.6))' }}
            />
            <h1 className="font-['Playfair_Display'] text-xl font-bold text-stone-100 uppercase tracking-wider">
              The Grimoire
            </h1>
          </div>
          <div className="flex-1" />

          {/* Right: Actions - Clean and focused */}
          <div className="flex items-center gap-2">

            {/* Epitaph Feature Buttons */}
            <div className="hidden md:flex items-center gap-1 mr-2">
              {/* Tension Curve Toggle */}
              <button
                onClick={() => epitaph.toggleTensionCurve()}
                className={clsx(
                  "flex items-center gap-1.5 px-3 py-2 rounded text-sm transition-all",
                  epitaph.state.isTensionCurveVisible
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/50"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                )}
                title="Tension Curve™ (Ctrl+Shift+T)"
              >
                <span>📈</span>
                <span className="hidden xl:inline">Tension</span>
              </button>

              {/* Fear Anthology Toggle */}
              <button
                onClick={() => epitaph.toggleAnthology()}
                className={clsx(
                  "flex items-center gap-1.5 px-3 py-2 rounded text-sm transition-all",
                  epitaph.state.isAnthologyOpen
                    ? "bg-purple-500/20 text-purple-400 border border-purple-500/50"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                )}
                title="Fear Anthology™ (Ctrl+Shift+A)"
              >
                <span>📚</span>
                <span className="hidden xl:inline">Anthology</span>
              </button>

              {/* Séance Chamber Toggle */}
              <button
                onClick={() => epitaph.toggleSeance()}
                className={clsx(
                  "flex items-center gap-1.5 px-3 py-2 rounded text-sm transition-all",
                  epitaph.state.isSeanceOpen
                    ? "bg-violet-500/20 text-violet-400 border border-violet-500/50"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                )}
                title="Séance Chamber™ (Ctrl+Shift+S)"
              >
                <span>🔮</span>
                <span className="hidden xl:inline">Séance</span>
              </button>
            </div>

            {/* Divider */}
            <div className="hidden md:block h-8 w-px bg-white/10" />

            {/* Ritual Mode Toggle - Ghost Button */}
            <button
              onClick={() => setRitualMode(!ritualMode)}
              className={clsx(
                "flex items-center gap-2 px-4 py-2 rounded transition-all group",
                ritualMode
                  ? "bg-red-950/50 border-2 border-red-600 text-red-200 shadow-[0_0_15px_rgba(220,38,38,0.5)]"
                  : "bg-transparent border-2 border-red-800 hover:border-red-600 text-red-300 hover:text-red-100 hover:bg-red-950/30 hover:shadow-[0_0_10px_rgba(220,38,38,0.3)]"
              )}
              title="Ritual Mode - Focus (Ctrl+Shift+F)"
              aria-label="Toggle Ritual Mode"
            >
              <Icon icon="solar:candle-bold" className="size-4 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium hidden lg:inline">
                {ritualMode ? 'Exit Ritual' : 'Ritual Mode'}
              </span>
            </button>

            {/* Unleash Button - Gold Leaf Wax Seal */}
            <button
              onClick={() => setShowCompileModal(true)}
              className="relative flex items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-[#8B7355] via-[#6B5344] to-[#4A3933] hover:from-[#9B8365] hover:via-[#7B6354] hover:to-[#5A4943] border-2 border-[#D4AF37] hover:border-[#FFD700] rounded-sm transition-all group shadow-[0_2px_8px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(212,175,55,0.8),inset_0_1px_0_rgba(255,255,255,0.2)]"
              title="Unleash Manuscript (Ctrl+E)"
              aria-label="Unleash Manuscript"
              style={{
                // Wax texture overlay
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='wax'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23wax)' opacity='0.15'/%3E%3C/svg%3E")`,
                backgroundSize: '50px 50px',
              }}
            >
              {/* Gold leaf accent */}
              <div className="absolute inset-0 rounded-sm bg-gradient-to-br from-[#FFD700]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

              <Icon icon="solar:star-bold" className="size-5 text-[#FFD700] group-hover:text-[#FFF4CC] transition-all group-hover:drop-shadow-[0_0_8px_rgba(255,215,0,0.9)] group-hover:rotate-12" />
              <span className="text-sm font-['Playfair_Display'] font-bold text-[#FFD700] group-hover:text-[#FFF4CC] hidden lg:inline tracking-wide group-hover:drop-shadow-[0_0_6px_rgba(255,215,0,0.7)] transition-all">
                Unleash
              </span>
            </button>
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
              {/* Central Editor - Professional Writing Surface */}
              <div
                className={clsx(
                  "flex-1 flex flex-col relative transition-colors duration-500",
                  ritualMode ? "bg-black" : "bg-[#1a1816]"
                )}
                style={{
                  // Dark parchment texture for central editor
                  backgroundImage: ritualMode
                    ? 'none'
                    : `url("data:image/svg+xml,%3Csvg width='400' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='parchment'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.8' numOctaves='6' seed='3' /%3E%3CfeColorMatrix type='saturate' values='0.15'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23parchment)' opacity='0.12' fill='%23d4c8b4'/%3E%3C/svg%3E")`,
                  backgroundSize: '250px 250px',
                  backgroundColor: '#1a1816',
                }}
              >
                {activeDocument ? (
                  <>
                    <div className={clsx(
                      "flex-1 overflow-y-auto transition-all duration-500 relative flex flex-col",
                      ritualMode
                        ? "px-8 py-12 mx-auto w-full"
                        : sidebarOpen ? "px-8 py-8 md:px-12 md:py-12" : "px-12 py-12 md:px-20 md:py-16 lg:px-32"
                    )}
                      style={ritualMode ? { maxWidth: '800px' } : undefined}
                    >
                      {/* Manuscript Container */}
                      <div className="max-w-prose mx-auto w-full flex flex-col flex-1">
                        {/* Editable Title */}
                        <input
                          type="text"
                          value={activeDocument.title}
                          onChange={(e) => crypt.updateTitle(activeDocument.id, e.target.value)}
                          className="w-full bg-transparent border-none outline-none text-3xl md:text-4xl font-['Playfair_Display'] font-bold text-zinc-100 mb-8 focus:text-white transition-colors placeholder:text-zinc-700 pb-3 border-b border-transparent focus:border-red-500/30"
                          placeholder="Untitled Document"
                          spellCheck={false}
                          aria-label="Document title"
                        />

                        {/* Main Editor - Manuscript Textarea */}
                        <div className="relative flex-1 flex flex-col">
                          <textarea
                            key={activeDocId}
                            value={activeDocument.content}
                            onChange={(e) => {
                              const newValue = e.target.value;
                              const wordCount = newValue.trim().split(/\s+/).filter(w => w.length > 0).length;
                              handleEditorWordCountChange(wordCount);
                              handleEditorContentChange(newValue);
                            }}
                            placeholder="Inscribe your nightmare..."
                            spellCheck={false}
                            className="w-full flex-1 h-full bg-transparent border-none outline-none resize-none text-xl leading-loose p-0 selection:bg-red-500/30 caret-red-600 placeholder:text-zinc-700 text-zinc-300 focus:outline-none"
                            style={{
                              fontFamily: "'Merriweather', 'Crimson Text', serif",
                              minHeight: '70vh',
                            }}
                          />
                          {/* Subtle focus indicator */}
                          {activeDocument.content === '' && (
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-500/20 to-transparent animate-pulse pointer-events-none" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Formatting Toolbar */}
                    <FormattingToolbar onFormat={handleFormat} />

                    {/* Exit Ritual Button - Floating in Ritual Mode */}
                    {ritualMode && (
                      <button
                        onClick={() => setRitualMode(false)}
                        className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2 bg-red-950 hover:bg-red-900 backdrop-blur-md border border-red-800 hover:border-red-700 text-red-200 hover:text-red-100 rounded-lg transition-all shadow-lg hover:shadow-[0_0_15px_rgba(220,38,38,0.5)] group"
                        title="Exit Ritual Mode (Esc)"
                        aria-label="Exit Ritual Mode"
                      >
                        <Icon icon="solar:logout-2-bold" className="size-4 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-medium">Exit Ritual</span>
                      </button>
                    )}
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-stone-600 p-8">
                    <div className="text-center space-y-6 max-w-md">
                      <Icon icon="solar:document-text-bold" className="size-20 mx-auto opacity-30" />
                      <div className="space-y-2">
                        <p className="text-2xl font-['Playfair_Display'] text-zinc-400">
                          No Document Selected
                        </p>
                        <p className="text-sm text-zinc-500">
                          Choose a document from the sidebar or create a new one to start writing
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 items-center">
                        <button
                          onClick={() => crypt.createDoc()}
                          className="flex items-center gap-2 px-6 py-3 bg-red-950 hover:bg-red-900 border border-red-800 rounded-lg text-red-200 hover:text-red-100 transition-all hover:shadow-[0_0_15px_rgba(220,38,38,0.5)]"
                        >
                          <Icon icon="solar:document-add-bold" className="size-5" />
                          <span className="font-medium">Inscribe New Page</span>
                        </button>
                        <p className="text-xs text-zinc-600 font-mono">
                          or press <kbd className="px-2 py-1 bg-zinc-800 rounded text-zinc-400">Ctrl+N</kbd>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Panel - Altar of Whispers - Hidden in Ritual Mode */}
              <div
                className={clsx(
                  "w-80 flex-none bg-zinc-950/50 backdrop-blur-md transition-all duration-500 relative",
                  ritualMode
                    ? "opacity-0 translate-x-full pointer-events-none hidden"
                    : "hidden lg:block opacity-100 translate-x-0"
                )}
                style={{
                  // Paper grain texture for right panel
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='300' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.2' numOctaves='4' seed='5' /%3E%3CfeColorMatrix type='saturate' values='0.1'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23grain)' opacity='0.06' fill='%23e8dcc8'/%3E%3C/svg%3E")`,
                  backgroundSize: '180px 180px',
                  borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: 'inset 2px 0 4px rgba(0, 0, 0, 0.3)',
                }}
              >
                {/* Arcane pulse border on left edge */}
                <ArcanePulseBorder position="left" color="red" intensity="medium" />
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

        {/* Footer Stats - Removed to reduce redundancy */}
      </div>

      {/* Compile Modal */}
      <CompileModal
        isOpen={showCompileModal}
        onClose={() => setShowCompileModal(false)}
        cryptItems={crypt.items}
        projectTitle="My Manuscript"
      />

      {/* Snapshots Modal - Disabled for now (needs adaptation for CryptItem type) */}
      {/* {activeDocument && (
        <SnapshotsModal
          isOpen={showSnapshotsModal}
          onClose={() => setShowSnapshotsModal(false)}
          document={activeDocument}
          onCreateSnapshot={() => {
            if (activeDocId) {
              crypt.takeSnapshot(activeDocId);
            }
          }}
          onRestoreSnapshot={(snapshotId: string) => {
            if (activeDocId) {
              crypt.revertToSnapshot(activeDocId, snapshotId);
            }
          }}
          onDeleteSnapshot={(snapshotId: string) => {
            if (activeDocId) {
              crypt.deleteSnapshot(activeDocId, snapshotId);
            }
          }}
        />
      )} */}

      {/* Epitaph Feature Panels */}
      <TensionCurvePanel
        documentId={activeDocId || 'no-doc'}
        content={activeDocument?.content || ''}
        isVisible={epitaph.state.isTensionCurveVisible}
        onClose={() => epitaph.toggleTensionCurve(false)}
      />

      <FearAnthologyPanel
        isOpen={epitaph.state.isAnthologyOpen}
        onClose={() => epitaph.toggleAnthology(false)}
      />

      <SeanceChamberPanel
        isOpen={epitaph.state.isSeanceOpen}
        onClose={() => epitaph.toggleSeance(false)}
        documentContent={activeDocument?.content || ''}
        selectedText={selectedText}
        documentWordCount={activeDocument?.wordCount || 0}
      />
    </div>
  );
}

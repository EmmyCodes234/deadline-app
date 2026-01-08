import React, { useState, useCallback, useEffect } from 'react';
import { FileExplorer } from './FileExplorer';
import { EditorPane } from './EditorPane';
import { AICompanion } from './AICompanion';
import { PanelLeft, PanelRight } from 'lucide-react';
// Epitaph Feature Panels
import { TensionCurvePanel, FearAnthologyPanel, SeanceChamberPanel } from '@/components/epitaph';
import { useEpitaph } from '@/contexts/EpitaphContext';
import { useProjects } from '@/contexts/ProjectContext';

interface DocumentEditorProps {
  className?: string;
}

export const DocumentEditor: React.FC<DocumentEditorProps> = ({ className = '' }) => {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [currentDocument, setCurrentDocument] = useState<string | null>(null);
  const epitaph = useEpitaph();
  const { currentProject } = useProjects();

  // Get current document content for Tension Curve
  const currentDoc = currentProject?.documents.find(d => d.id === currentDocument);
  const documentContent = currentDoc?.content || '';
  const documentWordCount = currentDoc?.content?.split(/\s+/).filter(Boolean).length || 0;

  const handleDocumentSelect = useCallback((documentId: string) => {
    setCurrentDocument(documentId);
  }, []);

  // Keyboard shortcuts for Epitaph features
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
      // Escape to close panels
      if (e.key === 'Escape') {
        if (epitaph.state.isAnthologyOpen) epitaph.toggleAnthology(false);
        else if (epitaph.state.isSeanceOpen) epitaph.toggleSeance(false);
        else if (epitaph.state.isTensionCurveVisible) epitaph.toggleTensionCurve(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [epitaph]);

  return (
    <div className={`w-full h-full flex flex-col ${className}`}>
      {/* Epitaph Feature Toolbar */}
      <div className="h-10 bg-zinc-900/80 border-b border-zinc-800 flex items-center justify-center gap-2 px-4">
        <span className="text-xs text-zinc-500 mr-2">Epitaph Tools:</span>

        {/* Tension Curve Toggle */}
        <button
          onClick={() => epitaph.toggleTensionCurve()}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs transition-all ${epitaph.state.isTensionCurveVisible
              ? "bg-amber-500/20 text-amber-400 border border-amber-500/50"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
            }`}
          title="Tension Curve™ (Ctrl+Shift+T)"
        >
          <span>📈</span>
          <span>Tension Curve</span>
        </button>

        {/* Fear Anthology Toggle */}
        <button
          onClick={() => epitaph.toggleAnthology()}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs transition-all ${epitaph.state.isAnthologyOpen
              ? "bg-purple-500/20 text-purple-400 border border-purple-500/50"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
            }`}
          title="Fear Anthology™ (Ctrl+Shift+A)"
        >
          <span>📚</span>
          <span>Anthology</span>
        </button>

        {/* Séance Chamber Toggle */}
        <button
          onClick={() => epitaph.toggleSeance()}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs transition-all ${epitaph.state.isSeanceOpen
              ? "bg-violet-500/20 text-violet-400 border border-violet-500/50"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
            }`}
          title="Séance Chamber™ (Ctrl+Shift+S)"
        >
          <span>🔮</span>
          <span>Séance</span>
        </button>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - File Explorer */}
        <div
          className={`${leftSidebarOpen ? 'w-64' : 'w-0'
            } h-full overflow-y-auto transition-all duration-300 ease-in-out ${className}`}
          style={{
            backgroundColor: '#121212',
            borderRight: leftSidebarOpen ? '1px solid rgba(115, 115, 115, 0.2)' : 'none'
          }}
        >
          {leftSidebarOpen && (
            <div className="h-full">
              {/* Sidebar Header with toggle */}
              <div className="h-12 flex items-center justify-between px-4 border-b border-zinc-800">
                <span className="text-sm font-medium text-zinc-300">Files</span>
                <button
                  onClick={() => setLeftSidebarOpen(false)}
                  className="p-1.5 rounded-md transition-colors text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                  title="Hide File Explorer"
                >
                  <PanelLeft size={16} />
                </button>
              </div>
              <FileExplorer
                onDocumentSelect={handleDocumentSelect}
                currentDocument={currentDocument}
              />
            </div>
          )}
        </div>

        {/* Center Region - Editor */}
        <div className="flex-1 h-full overflow-y-auto bg-zinc-950 relative">
          {!leftSidebarOpen && (
            <div className="absolute top-4 left-4 z-10">
              <button
                onClick={() => setLeftSidebarOpen(true)}
                className="p-2 rounded-md transition-colors text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                title="Show File Explorer"
              >
                <PanelLeft size={16} />
              </button>
            </div>
          )}
          {!rightSidebarOpen && (
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={() => setRightSidebarOpen(true)}
                className="p-2 rounded-md transition-colors text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                title="Show AI Companion"
              >
                <PanelRight size={16} />
              </button>
            </div>
          )}
          <EditorPane currentDocument={currentDocument} />
        </div>

        {/* Right Sidebar - AI Companion */}
        <div
          className={`${rightSidebarOpen ? 'w-80' : 'w-0'
            } h-full overflow-y-auto transition-all duration-300 ease-in-out`}
          style={{
            backgroundColor: '#121212',
            borderLeft: rightSidebarOpen ? '1px solid rgba(115, 115, 115, 0.2)' : 'none'
          }}
        >
          {rightSidebarOpen && (
            <div className="h-full">
              {/* Sidebar Header with toggle */}
              <div className="h-12 flex items-center justify-between px-4 border-b border-zinc-800">
                <span className="text-sm font-medium text-zinc-300">AI Companion</span>
                <button
                  onClick={() => setRightSidebarOpen(false)}
                  className="p-1.5 rounded-md transition-colors text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                  title="Hide AI Companion"
                >
                  <PanelRight size={16} />
                </button>
              </div>
              <AICompanion />
            </div>
          )}
        </div>
      </div>

      {/* Epitaph Feature Panels */}
      <TensionCurvePanel
        documentId={currentDocument || 'no-doc'}
        content={documentContent}
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
        documentContent={documentContent}
        documentWordCount={documentWordCount}
      />
    </div>
  );
};

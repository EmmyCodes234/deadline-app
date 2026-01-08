/**
 * EpitaphEditor - Main Editor Shell
 * 
 * The flagship horror writing experience with:
 * - Tiptap rich text editor
 * - Chapter navigation sidebar
 * - Epitaph tools panel (Tension Curve, Fear Anthology, Séance Chamber)
 * - Beautiful dark horror aesthetic
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjects } from '@/contexts/ProjectContext';
import { useEpitaph } from '@/contexts/EpitaphContext';
import { TiptapEditor } from './TiptapEditor';
import { ChapterSidebar } from './ChapterSidebar';
import { EpitaphToolsPanel } from './EpitaphToolsPanel';
import { EditorHeader } from './EditorHeader';
import { EditorStatusBar } from './EditorStatusBar';
import { PanelLeft } from 'lucide-react';
import './EpitaphEditor.css';

export function EpitaphEditor() {
    const { id: projectId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { currentProject, getProject, updateDocument, createDocument } = useProjects();
    const epitaph = useEpitaph();

    // Local state
    const [currentDocId, setCurrentDocId] = useState<string | null>(null);
    const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
    const [toolsPanelOpen, setToolsPanelOpen] = useState(true);
    const [isFocusMode, setIsFocusMode] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [wordCount, setWordCount] = useState(0);
    const [showExportModal, setShowExportModal] = useState(false);

    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Load project on mount
    useEffect(() => {
        if (projectId) {
            getProject(projectId);
        }
    }, [projectId, getProject]);

    // Auto-select first document when project loads
    useEffect(() => {
        if (currentProject && currentProject.documents.length > 0 && !currentDocId) {
            setCurrentDocId(currentProject.documents[0].id);
        }
    }, [currentProject, currentDocId]);

    // Get current document
    const currentDocument = currentProject?.documents.find(d => d.id === currentDocId);
    const documentContent = currentDocument?.content || '';
    const characterCount = documentContent.length;

    // Auto-save handler
    const saveDocument = useCallback(async (content: string) => {
        if (!currentProject || !currentDocId) return;

        setIsSaving(true);
        try {
            await updateDocument(currentProject.id, currentDocId, { content });
            setLastSaved(new Date());
        } catch (error) {
            console.error('Failed to save:', error);
        } finally {
            setIsSaving(false);
        }
    }, [currentProject, currentDocId, updateDocument]);

    // Content change handler with debounced save
    const handleContentChange = useCallback((content: string) => {
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        saveTimeoutRef.current = setTimeout(() => {
            saveDocument(content);
        }, 1000);
    }, [saveDocument]);

    // Word count change handler
    const handleWordCountChange = useCallback((count: number) => {
        setWordCount(count);
    }, []);

    // Create new document
    const handleCreateDocument = useCallback((parentId?: string) => {
        if (!currentProject) return;
        createDocument(currentProject.id, {
            title: 'Untitled Chapter',
            content: '',
            parentId: parentId || null
        });
    }, [currentProject, createDocument]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ctrl/Cmd + S: Manual save
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                if (currentDocument) {
                    saveDocument(currentDocument.content);
                }
            }
            // Ctrl/Cmd + Shift + F: Focus mode
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'F') {
                e.preventDefault();
                setIsFocusMode(prev => !prev);
            }
            // Ctrl/Cmd + Shift + T: Tension Curve
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                setToolsPanelOpen(true);
                // Could add state to auto-select tension tab
            }
            // Ctrl/Cmd + Shift + A: Anthology
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
                e.preventDefault();
                setToolsPanelOpen(true);
            }
            // Ctrl/Cmd + Shift + S: Séance
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'S') {
                e.preventDefault();
                setToolsPanelOpen(true);
            }
            // Ctrl/Cmd + B: Toggle left sidebar
            if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
                e.preventDefault();
                setLeftSidebarOpen(prev => !prev);
            }
            // Ctrl/Cmd + E: Export
            if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
                e.preventDefault();
                setShowExportModal(true);
            }
            // Escape: Exit focus mode
            if (e.key === 'Escape' && isFocusMode) {
                setIsFocusMode(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentDocument, saveDocument, isFocusMode]);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, []);

    // Focus mode overrides
    if (isFocusMode) {
        return (
            <div className="epitaph-focus-mode">
                <button
                    onClick={() => setIsFocusMode(false)}
                    className="epitaph-focus-exit"
                    title="Exit Focus Mode (Esc)"
                >
                    Exit Focus
                </button>
                <div className="epitaph-focus-editor">
                    <TiptapEditor
                        content={documentContent}
                        onChange={handleContentChange}
                        onWordCountChange={handleWordCountChange}
                        placeholder="Let your darkness flow..."
                    />
                </div>
                <div className="epitaph-focus-stats">
                    {wordCount.toLocaleString()} words
                </div>
            </div>
        );
    }

    return (
        <div className="epitaph-editor-root">
            {/* Header */}
            <EditorHeader
                project={currentProject}
                isFocusMode={isFocusMode}
                isToolsPanelOpen={toolsPanelOpen}
                onToggleFocusMode={() => setIsFocusMode(true)}
                onToggleToolsPanel={() => setToolsPanelOpen(prev => !prev)}
                onExport={() => setShowExportModal(true)}
                onOpenTension={() => setToolsPanelOpen(true)}
                onOpenAnthology={() => setToolsPanelOpen(true)}
                onOpenSeance={() => setToolsPanelOpen(true)}
            />

            {/* Main Content */}
            <div className="epitaph-editor-main">
                {/* Left Sidebar - Chapters */}
                <div className={`epitaph-sidebar-left ${leftSidebarOpen ? '' : 'collapsed'}`}>
                    {leftSidebarOpen ? (
                        <ChapterSidebar
                            project={currentProject}
                            currentDocumentId={currentDocId}
                            onSelectDocument={setCurrentDocId}
                            onCreateDocument={handleCreateDocument}
                            onCreateFolder={() => {/* TODO */ }}
                        />
                    ) : (
                        <button
                            onClick={() => setLeftSidebarOpen(true)}
                            className="epitaph-sidebar-toggle"
                            title="Show Chapters (Ctrl+B)"
                        >
                            <PanelLeft size={18} />
                        </button>
                    )}
                </div>

                {/* Center - Editor */}
                <div className="epitaph-editor-center">
                    {currentDocument ? (
                        <>
                            {/* Document Title */}
                            <div className="epitaph-doc-title">
                                <input
                                    type="text"
                                    value={currentDocument.title}
                                    onChange={(e) => {
                                        if (currentProject && currentDocId) {
                                            updateDocument(currentProject.id, currentDocId, { title: e.target.value });
                                        }
                                    }}
                                    placeholder="Untitled Chapter"
                                    className="epitaph-title-input"
                                />
                            </div>

                            {/* Tiptap Editor */}
                            <div className="epitaph-editor-area">
                                <TiptapEditor
                                    content={documentContent}
                                    onChange={handleContentChange}
                                    onWordCountChange={handleWordCountChange}
                                    placeholder="Begin your dark tale..."
                                />
                            </div>
                        </>
                    ) : (
                        <div className="epitaph-empty-state">
                            <div className="empty-icon">📝</div>
                            <h2>No Chapter Selected</h2>
                            <p>Select a chapter from the sidebar or create a new one</p>
                            <button
                                onClick={() => handleCreateDocument()}
                                className="epitaph-create-btn"
                            >
                                Create First Chapter
                            </button>
                        </div>
                    )}
                </div>

                {/* Right Panel - Epitaph Tools */}
                <div className={`epitaph-sidebar-right ${toolsPanelOpen ? '' : 'collapsed'}`}>
                    {toolsPanelOpen && (
                        <EpitaphToolsPanel
                            isOpen={toolsPanelOpen}
                            onClose={() => setToolsPanelOpen(false)}
                            documentId={currentDocId || ''}
                            documentContent={documentContent}
                            documentWordCount={wordCount}
                        />
                    )}
                </div>
            </div>

            {/* Status Bar */}
            <EditorStatusBar
                wordCount={wordCount}
                characterCount={characterCount}
                isSaving={isSaving}
                lastSaved={lastSaved}
            />
        </div>
    );
}

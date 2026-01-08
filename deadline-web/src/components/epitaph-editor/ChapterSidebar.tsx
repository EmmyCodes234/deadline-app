/**
 * ChapterSidebar - The Manuscript Archive
 * Left sidebar for navigating chapters with atmospheric styling
 */

import { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, FileText, Folder, Trash2, Edit3, BookOpen, Scroll, type LucideIcon } from 'lucide-react';
import type { Project, ProjectDocument, ProjectFolder } from '@/types/project';

interface ChapterSidebarProps {
    project: Project | null;
    currentDocumentId: string | null;
    onSelectDocument: (docId: string) => void;
    onCreateDocument: (folderId?: string) => void;
    onCreateFolder: () => void;
    onDeleteDocument?: (docId: string) => void;
    onRenameDocument?: (docId: string, newTitle: string) => void;
}

export function ChapterSidebar({
    project,
    currentDocumentId,
    onSelectDocument,
    onCreateDocument,
    onCreateFolder,
    onDeleteDocument,
    onRenameDocument,
}: ChapterSidebarProps) {
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
    const [contextMenu, setContextMenu] = useState<{ id: string; type: 'doc' | 'folder'; x: number; y: number } | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingTitle, setEditingTitle] = useState('');

    const toggleFolder = (folderId: string) => {
        setExpandedFolders(prev => {
            const next = new Set(prev);
            if (next.has(folderId)) {
                next.delete(folderId);
            } else {
                next.add(folderId);
            }
            return next;
        });
    };

    const handleContextMenu = (e: React.MouseEvent, id: string, type: 'doc' | 'folder') => {
        e.preventDefault();
        setContextMenu({ id, type, x: e.clientX, y: e.clientY });
    };

    const closeContextMenu = () => setContextMenu(null);

    const startRename = (id: string, currentTitle: string) => {
        setEditingId(id);
        setEditingTitle(currentTitle);
        closeContextMenu();
    };

    const submitRename = () => {
        if (editingId && editingTitle.trim() && onRenameDocument) {
            onRenameDocument(editingId, editingTitle.trim());
        }
        setEditingId(null);
        setEditingTitle('');
    };

    const handleDelete = (id: string) => {
        if (onDeleteDocument) {
            onDeleteDocument(id);
        }
        closeContextMenu();
    };

    if (!project) {
        return (
            <div
                className="h-full flex items-center justify-center p-6 text-center"
                style={{
                    background: 'linear-gradient(180deg, #0a0a0c 0%, #12121a 100%)',
                    color: '#475569',
                }}
            >
                <div>
                    <BookOpen size={40} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                    <p style={{ fontSize: '0.875rem', fontFamily: "'Inter', sans-serif" }}>No manuscript selected</p>
                </div>
            </div>
        );
    }

    // Group documents by folder (using parentId)
    const rootDocuments = project.documents.filter(d => !d.parentId);
    const folderDocuments = new Map<string, ProjectDocument[]>();

    project.folders.forEach(folder => {
        folderDocuments.set(folder.id, project.documents.filter(d => d.parentId === folder.id));
    });

    return (
        <div
            className="h-full flex flex-col"
            onClick={closeContextMenu}
            style={{
                background: 'linear-gradient(180deg, #0a0a0c 0%, #12121a 100%)',
            }}
        >
            {/* Header */}
            <div
                className="p-5"
                style={{
                    borderBottom: '1px solid rgba(148, 163, 184, 0.06)',
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 100%)',
                }}
            >
                <div className="flex items-center justify-between mb-3">
                    <h3
                        className="flex items-center gap-2"
                        style={{
                            fontFamily: "'Cinzel', Georgia, serif",
                            fontSize: '0.8rem',
                            fontWeight: 500,
                            color: '#94a3b8',
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                        }}
                    >
                        <Scroll size={14} style={{ color: '#dc2626', opacity: 0.7 }} />
                        Chapters
                    </h3>
                    <div className="flex gap-1">
                        <IconButton
                            icon={Folder}
                            onClick={() => onCreateFolder()}
                            title="New Folder"
                        />
                        <IconButton
                            icon={Plus}
                            onClick={() => onCreateDocument()}
                            title="New Chapter"
                            accent
                        />
                    </div>
                </div>
                <div
                    style={{
                        fontSize: '0.75rem',
                        color: '#475569',
                        fontFamily: "'Inter', sans-serif",
                    }}
                >
                    {project.documents.length} {project.documents.length === 1 ? 'chapter' : 'chapters'}
                </div>
            </div>

            {/* Document Tree */}
            <div className="flex-1 overflow-y-auto py-2">
                {/* Folders */}
                {project.folders.map(folder => (
                    <div key={folder.id} className="mb-1">
                        {/* Folder Header */}
                        <button
                            onClick={() => toggleFolder(folder.id)}
                            onContextMenu={(e) => handleContextMenu(e, folder.id, 'folder')}
                            className="w-full px-5 py-2.5 flex items-center gap-2.5 text-left transition-all duration-200"
                            style={{
                                color: '#94a3b8',
                                background: 'transparent',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                            }}
                        >
                            {expandedFolders.has(folder.id) ? (
                                <ChevronDown size={14} style={{ color: '#475569' }} />
                            ) : (
                                <ChevronRight size={14} style={{ color: '#475569' }} />
                            )}
                            <Folder size={14} style={{ color: '#fbbf24', opacity: 0.7 }} />
                            <span
                                className="flex-1 truncate"
                                style={{ fontSize: '0.875rem', fontFamily: "'Inter', sans-serif" }}
                            >
                                {folder.name}
                            </span>
                            <span
                                style={{
                                    fontSize: '0.7rem',
                                    color: '#475569',
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    padding: '0.125rem 0.5rem',
                                    borderRadius: '0.25rem',
                                }}
                            >
                                {folderDocuments.get(folder.id)?.length || 0}
                            </span>
                        </button>

                        {/* Folder Contents */}
                        {expandedFolders.has(folder.id) && (
                            <div className="ml-4">
                                {folderDocuments.get(folder.id)?.map(doc => (
                                    <DocumentItem
                                        key={doc.id}
                                        doc={doc}
                                        isActive={currentDocumentId === doc.id}
                                        isEditing={editingId === doc.id}
                                        editingTitle={editingTitle}
                                        onSelect={() => onSelectDocument(doc.id)}
                                        onContextMenu={(e) => handleContextMenu(e, doc.id, 'doc')}
                                        onEditChange={(val) => setEditingTitle(val)}
                                        onEditSubmit={submitRename}
                                        onEditCancel={() => setEditingId(null)}
                                    />
                                ))}
                                <button
                                    onClick={() => onCreateDocument(folder.id)}
                                    className="w-full px-5 py-2 flex items-center gap-2 transition-all duration-200"
                                    style={{
                                        fontSize: '0.75rem',
                                        color: '#475569',
                                        fontFamily: "'Inter', sans-serif",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.color = '#dc2626';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.color = '#475569';
                                    }}
                                >
                                    <Plus size={12} />
                                    <span>Add chapter</span>
                                </button>
                            </div>
                        )}
                    </div>
                ))}

                {/* Root Documents (no folder) */}
                {rootDocuments.map(doc => (
                    <DocumentItem
                        key={doc.id}
                        doc={doc}
                        isActive={currentDocumentId === doc.id}
                        isEditing={editingId === doc.id}
                        editingTitle={editingTitle}
                        onSelect={() => onSelectDocument(doc.id)}
                        onContextMenu={(e) => handleContextMenu(e, doc.id, 'doc')}
                        onEditChange={(val) => setEditingTitle(val)}
                        onEditSubmit={submitRename}
                        onEditCancel={() => setEditingId(null)}
                    />
                ))}

                {/* Empty State */}
                {project.documents.length === 0 && project.folders.length === 0 && (
                    <div className="px-5 py-10 text-center">
                        <FileText size={40} style={{ margin: '0 auto 1rem', color: '#1e293b' }} />
                        <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '1rem' }}>
                            No chapters yet
                        </p>
                        <button
                            onClick={() => onCreateDocument()}
                            className="transition-all duration-200"
                            style={{
                                fontSize: '0.8rem',
                                color: '#dc2626',
                                fontFamily: "'Cinzel', Georgia, serif",
                                letterSpacing: '0.05em',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.textDecoration = 'underline';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.textDecoration = 'none';
                            }}
                        >
                            Begin your manuscript →
                        </button>
                    </div>
                )}
            </div>

            {/* Context Menu */}
            {contextMenu && (
                <div
                    className="fixed rounded-lg shadow-2xl py-1 z-50 min-w-[160px]"
                    style={{
                        left: contextMenu.x,
                        top: contextMenu.y,
                        background: '#1a1a24',
                        border: '1px solid rgba(148, 163, 184, 0.1)',
                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={() => startRename(contextMenu.id, project.documents.find(d => d.id === contextMenu.id)?.title || '')}
                        className="w-full px-4 py-2.5 text-left flex items-center gap-3 transition-all duration-150"
                        style={{ fontSize: '0.875rem', color: '#94a3b8' }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                            e.currentTarget.style.color = '#f1f5f9';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = '#94a3b8';
                        }}
                    >
                        <Edit3 size={14} />
                        Rename
                    </button>
                    <button
                        onClick={() => handleDelete(contextMenu.id)}
                        className="w-full px-4 py-2.5 text-left flex items-center gap-3 transition-all duration-150"
                        style={{ fontSize: '0.875rem', color: '#f87171' }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(220, 38, 38, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                        }}
                    >
                        <Trash2 size={14} />
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
}

// Icon button sub-component
function IconButton({
    icon: Icon,
    onClick,
    title,
    accent = false
}: {
    icon: LucideIcon;
    onClick: () => void;
    title: string;
    accent?: boolean;
}) {
    return (
        <button
            onClick={onClick}
            className="p-2 rounded-lg transition-all duration-200"
            style={{
                color: accent ? '#dc2626' : '#475569',
                background: 'transparent',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.background = accent ? 'rgba(220, 38, 38, 0.1)' : 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.color = accent ? '#ef4444' : '#94a3b8';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = accent ? '#dc2626' : '#475569';
            }}
            title={title}
        >
            <Icon size={14} />
        </button>
    );
}

// Document Item sub-component
function DocumentItem({
    doc,
    isActive,
    isEditing,
    editingTitle,
    onSelect,
    onContextMenu,
    onEditChange,
    onEditSubmit,
    onEditCancel,
}: {
    doc: ProjectDocument;
    isActive: boolean;
    isEditing: boolean;
    editingTitle: string;
    onSelect: () => void;
    onContextMenu: (e: React.MouseEvent) => void;
    onEditChange: (val: string) => void;
    onEditSubmit: () => void;
    onEditCancel: () => void;
}) {
    const wordCount = doc.content?.split(/\s+/).filter(Boolean).length || 0;

    return (
        <button
            onClick={onSelect}
            onContextMenu={onContextMenu}
            className="w-full px-5 py-2.5 flex items-center gap-2.5 text-left transition-all duration-200"
            style={{
                background: isActive ? 'linear-gradient(90deg, rgba(127, 29, 29, 0.2) 0%, transparent 100%)' : 'transparent',
                borderLeft: isActive ? '2px solid #dc2626' : '2px solid transparent',
                color: isActive ? '#f1f5f9' : '#64748b',
            }}
            onMouseEnter={(e) => {
                if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                    e.currentTarget.style.color = '#94a3b8';
                }
            }}
            onMouseLeave={(e) => {
                if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#64748b';
                }
            }}
        >
            <FileText size={14} style={{ color: isActive ? '#dc2626' : '#334155', flexShrink: 0 }} />

            {isEditing ? (
                <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => onEditChange(e.target.value)}
                    onBlur={onEditSubmit}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') onEditSubmit();
                        if (e.key === 'Escape') onEditCancel();
                    }}
                    autoFocus
                    className="flex-1 px-2 py-1 rounded outline-none"
                    style={{
                        background: '#1a1a24',
                        border: '1px solid rgba(220, 38, 38, 0.3)',
                        fontSize: '0.875rem',
                        color: '#f1f5f9',
                        fontFamily: "'Inter', sans-serif",
                    }}
                    onClick={(e) => e.stopPropagation()}
                />
            ) : (
                <>
                    <span
                        className="flex-1 truncate"
                        style={{ fontSize: '0.875rem', fontFamily: "'Inter', sans-serif" }}
                    >
                        {doc.title || 'Untitled'}
                    </span>
                    <span
                        style={{
                            fontSize: '0.7rem',
                            color: '#475569',
                            fontFamily: "'JetBrains Mono', monospace",
                        }}
                    >
                        {wordCount > 0 ? wordCount : '—'}
                    </span>
                </>
            )}
        </button>
    );
}

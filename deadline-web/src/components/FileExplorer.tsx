import React, { useState, useCallback, useEffect } from 'react';
import { 
  File, 
  Plus, 
  MoreHorizontal,
  Download,
  Edit3,
  Trash2,
  Folder,
  FolderOpen,
  ChevronRight
} from 'lucide-react';
import { useProjects } from '@/contexts/ProjectContext';
import { ProjectDocument, ProjectFolder } from '@/types/project';
import './DocumentEditor.css';

interface FileExplorerProps {
  onDocumentSelect: (documentId: string) => void;
  currentDocument: string | null;
}

interface NewItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string, type: 'file' | 'folder') => void;
  type: 'file' | 'folder';
}

const NewItemModal: React.FC<NewItemModalProps> = ({ isOpen, onClose, onConfirm, type }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onConfirm(name.trim(), type);
      setName('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-zinc-800 rounded-lg p-6 w-96 max-w-[90vw]">
        <h3 className="text-lg font-semibold text-zinc-100 mb-4">
          New {type === 'file' ? 'Document' : 'Folder'}
        </h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder={`${type === 'file' ? 'Document' : 'Folder'} name...`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-orange-500"
            autoFocus
          />
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-zinc-600 disabled:cursor-not-allowed text-white rounded-md transition-colors"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const FileExplorer: React.FC<FileExplorerProps> = ({ 
  onDocumentSelect, 
  currentDocument 
}) => {
  // Add CSS to hide scrollbars
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .file-explorer-no-scrollbar {
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* Internet Explorer 10+ */
      }
      .file-explorer-no-scrollbar::-webkit-scrollbar {
        display: none; /* WebKit */
      }
    `;
    document.head.appendChild(style);
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);
  const { 
    currentProject, 
    createDocument, 
    deleteDocument, 
    updateDocument,
    createFolder,
    deleteFolder,
    updateFolder,
    toggleFolder
  } = useProjects();
  
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    itemId: string;
    itemType: 'file' | 'folder';
  } | null>(null);
  const [newItemModal, setNewItemModal] = useState<{
    isOpen: boolean;
    type: 'file' | 'folder';
    parentId?: string | null;
  }>({ isOpen: false, type: 'file' });
  const [editingItem, setEditingItem] = useState<{
    id: string;
    type: 'file' | 'folder';
    name: string;
  } | null>(null);

  // Auto-select first document on mount if none selected
  useEffect(() => {
    if (!currentDocument && currentProject && currentProject.documents.length > 0) {
      onDocumentSelect(currentProject.documents[0].id);
    }
  }, [currentDocument, onDocumentSelect, currentProject]);

  const handleContextMenu = useCallback((e: React.MouseEvent, itemId: string, itemType: 'file' | 'folder') => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      itemId,
      itemType
    });
  }, []);

  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  const handleCreateItem = useCallback(async (name: string, type: 'file' | 'folder') => {
    if (!currentProject) return;
    
    try {
      if (type === 'file') {
        const newDoc = await createDocument(currentProject.id, { 
          title: name, 
          parentId: newItemModal.parentId 
        });
        onDocumentSelect(newDoc.id);
      } else {
        await createFolder(currentProject.id, { 
          name, 
          parentId: newItemModal.parentId 
        });
      }
    } catch (error) {
      console.error(`Failed to create ${type}:`, error);
    }
  }, [currentProject, createDocument, createFolder, onDocumentSelect, newItemModal.parentId]);

  const handleDeleteItem = useCallback(async (itemId: string, itemType: 'file' | 'folder') => {
    if (!currentProject) return;
    
    try {
      if (itemType === 'file') {
        await deleteDocument(currentProject.id, itemId);
        // If we deleted the current document, select another one
        if (currentDocument === itemId) {
          const remainingDocs = currentProject.documents.filter(doc => doc.id !== itemId);
          if (remainingDocs.length > 0) {
            onDocumentSelect(remainingDocs[0].id);
          } else {
            onDocumentSelect('');
          }
        }
      } else {
        await deleteFolder(currentProject.id, itemId);
      }
    } catch (error) {
      console.error(`Failed to delete ${itemType}:`, error);
    }
    closeContextMenu();
  }, [currentProject, deleteDocument, deleteFolder, currentDocument, onDocumentSelect, closeContextMenu]);

  const handleRenameItem = useCallback((itemId: string, itemType: 'file' | 'folder') => {
    if (itemType === 'file') {
      const document = currentProject?.documents.find(doc => doc.id === itemId);
      if (document) {
        setEditingItem({ id: itemId, type: 'file', name: document.title });
      }
    } else {
      const folder = currentProject?.folders.find(folder => folder.id === itemId);
      if (folder) {
        setEditingItem({ id: itemId, type: 'folder', name: folder.name });
      }
    }
    closeContextMenu();
  }, [currentProject, closeContextMenu]);

  const handleSaveRename = useCallback(async () => {
    if (!currentProject || !editingItem || !editingItem.name.trim()) return;
    
    try {
      if (editingItem.type === 'file') {
        await updateDocument(currentProject.id, editingItem.id, { title: editingItem.name.trim() });
      } else {
        await updateFolder(currentProject.id, editingItem.id, { name: editingItem.name.trim() });
      }
      setEditingItem(null);
    } catch (error) {
      console.error(`Failed to rename ${editingItem.type}:`, error);
    }
  }, [currentProject, updateDocument, updateFolder, editingItem]);

  const handleCancelRename = useCallback(() => {
    setEditingItem(null);
  }, []);

  const handleDownloadDocument = useCallback((documentId: string) => {
    const doc = currentProject?.documents.find(d => d.id === documentId);
    if (!doc) return;

    const blob = new Blob([doc.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = `${doc.title}.md`;
    window.document.body.appendChild(a);
    a.click();
    window.document.body.removeChild(a);
    URL.revokeObjectURL(url);
    closeContextMenu();
  }, [currentProject, closeContextMenu]);

  const handleToggleFolder = useCallback(async (folderId: string) => {
    if (!currentProject) return;
    try {
      await toggleFolder(currentProject.id, folderId);
    } catch (error) {
      console.error('Failed to toggle folder:', error);
    }
  }, [currentProject, toggleFolder]);

  // FileSystemItem component for recursive rendering
  const FileSystemItem: React.FC<{
    item: ProjectDocument | ProjectFolder;
    level: number;
    type: 'file' | 'folder';
  }> = ({ item, level, type }) => {
    const isSelected = type === 'file' && currentDocument === item.id;
    const isEditing = editingItem?.id === item.id;
    const isFolder = type === 'folder';
    const folder = isFolder ? item as ProjectFolder : null;
    
    // Get children for folders
    const children = isFolder ? {
      folders: currentProject!.folders.filter(f => f.parentId === item.id),
      documents: currentProject!.documents.filter(d => d.parentId === item.id)
    } : null;

    return (
      <div key={item.id}>
        {/* Item Row */}
        <div
          className={`flex items-center py-1.5 px-2 cursor-pointer group transition-colors ${
            isSelected ? 'border-r-2' : ''
          }`}
          style={{
            backgroundColor: isSelected ? 'rgba(249, 115, 22, 0.1)' : 'transparent',
            borderRightColor: isSelected ? '#f97316' : 'transparent',
            color: '#e5e5e5',
            paddingLeft: level * 16 + 8
          }}
          onMouseEnter={(e) => {
            if (!isSelected) {
              e.currentTarget.style.backgroundColor = 'rgba(115, 115, 115, 0.1)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isSelected) {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
          onClick={() => {
            if (!isEditing) {
              if (isFolder) {
                handleToggleFolder(item.id);
              } else {
                onDocumentSelect(item.id);
              }
            }
          }}
          onContextMenu={(e) => !isEditing && handleContextMenu(e, item.id, type)}
        >
          {/* Tree guide line */}
          {level > 0 && (
            <div 
              className="absolute border-l border-white/10"
              style={{ 
                left: `${(level - 1) * 16 + 16}px`,
                top: 0,
                bottom: 0
              }}
            />
          )}
          
          {/* Expand/Collapse for folders */}
          {isFolder && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggleFolder(item.id);
              }}
              className="mr-1 text-zinc-500 hover:text-orange-500 transition-colors"
            >
              <ChevronRight 
                size={14} 
                className={`transition-transform ${folder?.isExpanded ? 'rotate-90' : ''}`}
              />
            </button>
          )}
          
          {/* Icon */}
          <div className="mr-2">
            {isFolder ? (
              folder?.isExpanded ? (
                <FolderOpen size={16} style={{ color: '#737373' }} />
              ) : (
                <Folder size={16} style={{ color: '#737373' }} />
              )
            ) : (
              <File size={16} style={{ color: '#737373' }} />
            )}
          </div>
          
          {/* Name/Title */}
          {isEditing ? (
            <input
              type="text"
              value={editingItem.name}
              onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
              onBlur={handleSaveRename}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSaveRename();
                } else if (e.key === 'Escape') {
                  handleCancelRename();
                }
              }}
              className="flex-1 text-sm bg-transparent border-b border-orange-500 outline-none"
              style={{ 
                fontFamily: 'Inter, sans-serif',
                color: '#e5e5e5'
              }}
              autoFocus
            />
          ) : (
            <span className="flex-1 text-sm truncate" style={{ 
              fontFamily: 'Inter, sans-serif',
              color: '#e5e5e5'
            }}>
              {isFolder ? (item as ProjectFolder).name : (item as ProjectDocument).title}
            </span>
          )}
          
          {/* Actions */}
          {!isEditing && (
            <button
              className="opacity-0 group-hover:opacity-100 p-1 rounded transition-colors"
              style={{ color: '#737373' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(115, 115, 115, 0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              onClick={(e) => {
                e.stopPropagation();
                handleContextMenu(e, item.id, type);
              }}
            >
              <MoreHorizontal size={12} />
            </button>
          )}
        </div>
        
        {/* Children for expanded folders */}
        {isFolder && folder?.isExpanded && children && (
          <div>
            {children.folders.map(childFolder => (
              <FileSystemItem 
                key={childFolder.id} 
                item={childFolder} 
                level={level + 1} 
                type="folder" 
              />
            ))}
            {children.documents.map(childDoc => (
              <FileSystemItem 
                key={childDoc.id} 
                item={childDoc} 
                level={level + 1} 
                type="file" 
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  // Get root items (no parent)
  const rootFolders = currentProject?.folders.filter(f => !f.parentId) || [];
  const rootDocuments = currentProject?.documents.filter(d => !d.parentId) || [];

  if (!currentProject) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-zinc-500">
        <File size={48} className="mb-4" />
        <p>No project selected</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: '#121212' }}>
      {/* Header */}
      <div className="p-4" style={{ borderBottom: '1px solid rgba(115, 115, 115, 0.2)' }}>
        <div className="flex gap-2">
          <button 
            onClick={() => setNewItemModal({ isOpen: true, type: 'file', parentId: null })}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md transition-colors text-sm font-medium border"
            style={{ 
              color: '#f97316',
              borderColor: '#f97316',
              backgroundColor: 'transparent',
              fontFamily: 'Inter, sans-serif'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(249, 115, 22, 0.1)';
              e.currentTarget.style.boxShadow = '0 0 0 2px rgba(249, 115, 22, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <File size={14} />
            New File
          </button>
          <button 
            onClick={() => setNewItemModal({ isOpen: true, type: 'folder', parentId: null })}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md transition-colors text-sm font-medium border"
            style={{ 
              color: '#f97316',
              borderColor: '#f97316',
              backgroundColor: 'transparent',
              fontFamily: 'Inter, sans-serif'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(249, 115, 22, 0.1)';
              e.currentTarget.style.boxShadow = '0 0 0 2px rgba(249, 115, 22, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <Plus size={14} />
            New Folder
          </button>
        </div>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto file-explorer-no-scrollbar">
        <div className="py-2">
          {rootFolders.length === 0 && rootDocuments.length === 0 ? (
            <div className="p-4 text-center text-zinc-500">
              <File size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No files or folders yet</p>
              <p className="text-xs mt-1">Click "New File" or "New Folder" to get started</p>
            </div>
          ) : (
            <div>
              {/* Render folders first */}
              {rootFolders.map(folder => (
                <FileSystemItem 
                  key={folder.id} 
                  item={folder} 
                  level={0} 
                  type="folder" 
                />
              ))}
              {/* Then render documents */}
              {rootDocuments.map(document => (
                <FileSystemItem 
                  key={document.id} 
                  item={document} 
                  level={0} 
                  type="file" 
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* New Item Modal */}
      <NewItemModal
        isOpen={newItemModal.isOpen}
        onClose={() => setNewItemModal({ isOpen: false, type: 'file' })}
        onConfirm={handleCreateItem}
        type={newItemModal.type}
      />

      {/* Context Menu */}
      {contextMenu && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={closeContextMenu}
          />
          <div
            className="fixed z-50 rounded-md shadow-lg py-1 min-w-[160px]"
            style={{
              left: contextMenu.x,
              top: contextMenu.y,
              backgroundColor: '#121212',
              border: '1px solid rgba(115, 115, 115, 0.3)',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)'
            }}
          >
            {contextMenu.itemType === 'folder' && (
              <>
                <button
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors"
                  style={{ 
                    color: '#e5e5e5',
                    fontFamily: 'Inter, sans-serif'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(115, 115, 115, 0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  onClick={() => {
                    setNewItemModal({ isOpen: true, type: 'file', parentId: contextMenu.itemId });
                    closeContextMenu();
                  }}
                >
                  <File size={14} />
                  New File Inside...
                </button>
                <button
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors"
                  style={{ 
                    color: '#e5e5e5',
                    fontFamily: 'Inter, sans-serif'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(115, 115, 115, 0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  onClick={() => {
                    setNewItemModal({ isOpen: true, type: 'folder', parentId: contextMenu.itemId });
                    closeContextMenu();
                  }}
                >
                  <Folder size={14} />
                  New Folder Inside...
                </button>
                <hr className="my-1" style={{ borderColor: 'rgba(115, 115, 115, 0.3)' }} />
              </>
            )}
            <button
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors"
              style={{ 
                color: '#e5e5e5',
                fontFamily: 'Inter, sans-serif'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(115, 115, 115, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              onClick={() => handleRenameItem(contextMenu.itemId, contextMenu.itemType)}
            >
              <Edit3 size={14} />
              Rename
            </button>
            {contextMenu.itemType === 'file' && (
              <button
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors"
                style={{ 
                  color: '#e5e5e5',
                  fontFamily: 'Inter, sans-serif'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(115, 115, 115, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                onClick={() => handleDownloadDocument(contextMenu.itemId)}
              >
                <Download size={14} />
                Download
              </button>
            )}
            <hr className="my-1" style={{ borderColor: 'rgba(115, 115, 115, 0.3)' }} />
            <button
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors"
              style={{ 
                color: '#dc2626',
                fontFamily: 'Inter, sans-serif'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              onClick={() => handleDeleteItem(contextMenu.itemId, contextMenu.itemType)}
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};
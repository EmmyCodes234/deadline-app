import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { type CryptItem } from '@/hooks/useCrypt';
import clsx from 'clsx';
import { GothicIcon } from './GothicIcon';
import { DoorOpen, Trash2, ChevronLeft, ChevronRight, X, Feather, Folder, FolderOpen, Skull, Plus } from 'lucide-react';
import { horrorAudio } from '@/lib/audio/HorrorAudio';

interface SidebarProps {
  items: CryptItem[];
  currentDocId: string | null;
  totalProjectWords: number;
  onSelectDoc: (id: string) => void;
  onCreateDoc: (parentId?: string | null) => void;
  onCreateMausoleum: (title?: string, parentId?: string | null) => string;
  onDeleteDoc: (id: string) => void;
  onUpdateTitle: (id: string, title: string) => void;
  onToggleExpand: (id: string) => void;
  onReorderItems?: (draggedId: string, targetId: string, position: 'before' | 'after' | 'inside') => void;
  isOpen: boolean;
  onClose: () => void;
  onToggleSidebar?: () => void; // For desktop collapse
  mode?: 'HAUNTING' | 'GRIMOIRE'; // Optional mode for context-aware UI
  onExport?: () => void; // Export/compile function
  onShowHelp?: () => void; // Show keyboard shortcuts
}

export function Sidebar({
  items,
  currentDocId,
  totalProjectWords,
  onSelectDoc,
  onCreateDoc,
  onCreateMausoleum,
  onDeleteDoc,
  onUpdateTitle,
  onToggleExpand,
  onReorderItems,
  isOpen,
  onClose,
  onToggleSidebar,
  mode = 'HAUNTING',
  onExport,
  onShowHelp,
}: SidebarProps) {
  // Drag and drop state
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [dropPosition, setDropPosition] = useState<'before' | 'after' | 'inside' | null>(null);
  
  // Delete animation state - track which items are animating out
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  
  // Context menu state
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    itemId: string;
    itemType: 'file' | 'folder';
  } | null>(null);
  
  // Renaming state
  const [renamingId, setRenamingId] = useState<string | null>(null);

  // Close context menu on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setContextMenu(null);
        setRenamingId(null);
      }
    };

    if (contextMenu || renamingId) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [contextMenu, renamingId]);
  
  // Helper function to generate smart title from content
  const getDisplayTitle = (item: CryptItem): string => {
    // If title exists and is not default, use it
    if (item.title && item.title.trim() !== '' && item.title !== 'Untitled Haunting') {
      return item.title;
    }
    
    // If content exists, extract first 4 words
    if (item.content && item.content.trim() !== '') {
      const words = item.content
        .trim()
        .replace(/\n/g, ' ') // Replace newlines with spaces
        .replace(/\s+/g, ' ') // Normalize whitespace
        .split(' ')
        .filter(word => word.length > 0) // Remove empty strings
        .slice(0, 4); // Take first 4 words
      
      if (words.length > 0) {
        return words.join(' ') + (item.content.trim().split(/\s+/).length > 4 ? '...' : '');
      }
    }
    
    // Fallback for empty documents
    return mode === 'GRIMOIRE' ? 'Fresh Parchment' : 'Blank Scroll';
  };
  
  // Get root items (no parent) and filter by search
  const rootItems = items
    .filter((item) => !item.parentId)
    .filter((item) => 
      searchQuery.trim() === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
  // Handle delete with incinerate animation
  const handleDelete = (itemId: string) => {
    // Prevent double-deletion
    if (deletingIds.has(itemId)) return;
    
    // Play incinerate sound
    horrorAudio.playIncinerate();
    
    // Mark as deleting to trigger animation
    setDeletingIds(prev => new Set(prev).add(itemId));
    
    // Delay the actual deletion to allow animation to play
    setTimeout(() => {
      onDeleteDoc(itemId);
      setDeletingIds(prev => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
    }, 850); // Slightly longer than animation to ensure it completes
  };
  
  // Drag handlers
  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    e.stopPropagation();
    setDraggedId(itemId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', itemId);
  };

  const handleDragOver = (e: React.DragEvent, itemId: string, itemType: 'tombstone' | 'mausoleum') => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!draggedId || draggedId === itemId) {
      setDragOverId(null);
      setDropPosition(null);
      return;
    }
    
    setDragOverId(itemId);
    
    // Determine drop position based on mouse position
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const height = rect.height;
    
    if (itemType === 'mausoleum') {
      // For mausoleums, allow inside drop in the middle
      if (y < height * 0.25) {
        setDropPosition('before');
      } else if (y > height * 0.75) {
        setDropPosition('after');
      } else {
        setDropPosition('inside');
      }
    } else {
      // For tombstones, only before/after
      if (y < height * 0.5) {
        setDropPosition('before');
      } else {
        setDropPosition('after');
      }
    }
  };

  const handleDragLeave = () => {
    setDragOverId(null);
    setDropPosition(null);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!draggedId || !dropPosition || !onReorderItems) {
      return;
    }
    
    onReorderItems(draggedId, targetId, dropPosition);
    
    setDraggedId(null);
    setDragOverId(null);
    setDropPosition(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
    setDropPosition(null);
  };
  
  // Context menu handlers
  const handleContextMenu = (e: React.MouseEvent, itemId: string, itemType: 'file' | 'folder') => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      itemId,
      itemType,
    });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  const handleContextAction = (action: string, itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    switch (action) {
      case 'newFile':
        onCreateDoc(itemId);
        break;
      case 'newFolder':
        const newFolderId = onCreateMausoleum('New Folder', itemId);
        if (newFolderId) {
          setRenamingId(newFolderId);
        }
        break;
      case 'rename':
        setRenamingId(itemId);
        break;
      case 'delete':
        handleDelete(itemId);
        break;
    }
    closeContextMenu();
  };

  // FileSystemItem component for recursive rendering
  const FileSystemItem = ({ item, level }: { item: CryptItem; level: number }) => {
    const isActive = currentDocId === item.id;
    const isRenaming = renamingId === item.id;
    
    if (item.type === 'mausoleum') {
      // Get children in the order specified by the children array
      const childItems = (item.children || [])
        .map((childId) => items.find((i) => i.id === childId))
        .filter((child): child is CryptItem => child !== undefined);
      
      return (
        <div key={item.id}>
          {/* Folder Header */}
          <div
            draggable={!!onReorderItems}
            onDragStart={(e) => handleDragStart(e, item.id)}
            onDragOver={(e) => handleDragOver(e, item.id, 'mausoleum')}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, item.id)}
            onDragEnd={handleDragEnd}
            onContextMenu={(e) => handleContextMenu(e, item.id, 'folder')}
            className={clsx(
              'group relative flex items-center gap-2 p-2 cursor-pointer transition-all duration-200',
              'hover:bg-neutral-800 rounded-md',
              draggedId === item.id && 'opacity-50',
              dragOverId === item.id && dropPosition === 'before' && 'border-t-2 border-t-orange-500',
              dragOverId === item.id && dropPosition === 'after' && 'border-b-2 border-b-orange-500',
              dragOverId === item.id && dropPosition === 'inside' && 'bg-orange-500/20 border border-orange-500',
              deletingIds.has(item.id) && 'animate-incinerate'
            )}
            style={{ paddingLeft: `${level * 16 + 8}px` }}
          >
            {/* Tree guide line */}
            {level > 0 && (
              <div 
                className="absolute left-0 top-0 bottom-0 border-l border-white/5"
                style={{ left: `${(level - 1) * 16 + 16}px` }}
              />
            )}
            
            {/* Expand/Collapse Chevron */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand(item.id);
              }}
              className="flex-shrink-0 text-neutral-500 hover:text-orange-500 transition-colors p-1"
              aria-label={item.isExpanded ? 'Collapse' : 'Expand'}
            >
              <ChevronRight 
                className={clsx(
                  'w-4 h-4 transition-transform duration-200',
                  item.isExpanded && 'rotate-90'
                )}
              />
            </button>
            
            {/* Folder Icon */}
            <div className="flex-shrink-0 text-neutral-500">
              {item.isExpanded ? (
                <FolderOpen className="w-4 h-4" />
              ) : (
                <Folder className="w-4 h-4" />
              )}
            </div>
            
            {/* Folder Name */}
            {isRenaming ? (
              <input
                type="text"
                defaultValue={item.title}
                autoFocus
                onBlur={(e) => {
                  onUpdateTitle(item.id, e.target.value || 'New Folder');
                  setRenamingId(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onUpdateTitle(item.id, e.currentTarget.value || 'New Folder');
                    setRenamingId(null);
                  } else if (e.key === 'Escape') {
                    setRenamingId(null);
                  }
                }}
                onClick={(e) => e.stopPropagation()}
                className="flex-1 bg-neutral-700 border border-orange-500 rounded px-2 py-1 text-sm text-neutral-200 outline-none"
              />
            ) : (
              <span 
                className="flex-1 text-sm text-neutral-300 font-medium truncate select-none"
                onClick={() => onToggleExpand(item.id)}
              >
                {item.title}
              </span>
            )}
            
            {/* Delete Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(item.id);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-neutral-600 hover:text-red-500 rounded"
              title="Delete folder"
              aria-label="Delete folder"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
          
          {/* Children */}
          {item.isExpanded && (
            <div>
              {childItems.map((child) => (
                <FileSystemItem key={child.id} item={child} level={level + 1} />
              ))}
            </div>
          )}
        </div>
      );
    }
    
    // File (Document)
    return (
      <div
        key={item.id}
        draggable={!!onReorderItems}
        onDragStart={(e) => handleDragStart(e, item.id)}
        onDragOver={(e) => handleDragOver(e, item.id, 'tombstone')}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, item.id)}
        onDragEnd={handleDragEnd}
        onContextMenu={(e) => handleContextMenu(e, item.id, 'file')}
        className={clsx(
          'group relative flex items-center gap-2 p-2 cursor-pointer transition-all duration-200',
          'hover:bg-neutral-800 rounded-md',
          isActive && 'bg-orange-500/20 text-orange-500',
          draggedId === item.id && 'opacity-50',
          dragOverId === item.id && dropPosition === 'before' && 'border-t-2 border-t-orange-500',
          dragOverId === item.id && dropPosition === 'after' && 'border-b-2 border-b-orange-500',
          deletingIds.has(item.id) && 'animate-incinerate'
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => onSelectDoc(item.id)}
      >
        {/* Tree guide line */}
        {level > 0 && (
          <div 
            className="absolute left-0 top-0 bottom-0 border-l border-white/5"
            style={{ left: `${(level - 1) * 16 + 16}px` }}
          />
        )}
        
        {/* File Icon */}
        <div className="flex-shrink-0 text-neutral-500 ml-6">
          {isActive ? (
            <Skull className="w-4 h-4 text-orange-500" />
          ) : (
            <Feather className="w-4 h-4" />
          )}
        </div>
        
        {/* File Name */}
        {isRenaming ? (
          <input
            type="text"
            defaultValue={getDisplayTitle(item)}
            autoFocus
            onBlur={(e) => {
              onUpdateTitle(item.id, e.target.value || 'Untitled');
              setRenamingId(null);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onUpdateTitle(item.id, e.currentTarget.value || 'Untitled');
                setRenamingId(null);
              } else if (e.key === 'Escape') {
                setRenamingId(null);
              }
            }}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 bg-neutral-700 border border-orange-500 rounded px-2 py-1 text-sm text-neutral-200 outline-none"
          />
        ) : (
          <div className="flex-1 min-w-0">
            <div className={clsx(
              'text-sm font-medium truncate',
              isActive ? 'text-orange-500' : 'text-neutral-300'
            )}>
              {getDisplayTitle(item)}
            </div>
            <div className="text-xs text-neutral-500 truncate">
              {item.wordCount} words • {new Date(item.lastModified).toLocaleDateString()}
            </div>
          </div>
        )}
        
        {/* Delete Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(item.id);
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-neutral-600 hover:text-red-500 rounded"
          title="Delete file"
          aria-label="Delete file"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    );
  };

  // Recursive component to render items (legacy - keeping for compatibility)
  const renderItem = (item: CryptItem, level: number = 0) => {
    const isActive = currentDocId === item.id;
    const paddingLeft = level * 48; // 48px per level for stronger hierarchy
    
    if (item.type === 'mausoleum') {
      // Get children in the order specified by the children array
      const childItems = (item.children || [])
        .map((childId) => items.find((i) => i.id === childId))
        .filter((child): child is CryptItem => child !== undefined);
      
      return (
        <div key={item.id} style={{ paddingLeft: `${paddingLeft}px` }}>
          {/* Mausoleum Header */}
          <div
            draggable={!!onReorderItems}
            onDragStart={(e) => handleDragStart(e, item.id)}
            onDragOver={(e) => handleDragOver(e, item.id, 'mausoleum')}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, item.id)}
            onDragEnd={handleDragEnd}
            className={clsx(
              'group relative p-4 cursor-pointer transition-all duration-300 mb-3',
              'rounded-lg border-2 backdrop-blur-sm',
              'bg-gradient-to-br from-amber-950/40 via-amber-900/30 to-amber-950/40',
              'border-amber-700/50 hover:border-amber-500/60',
              'shadow-[0_3px_12px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.08)]',
              'hover:shadow-[0_6px_20px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.12)]',
              'hover:bg-gradient-to-br hover:from-amber-900/50 hover:via-amber-800/40 hover:to-amber-900/50',
              draggedId === item.id && 'opacity-50',
              dragOverId === item.id && dropPosition === 'before' && 'border-t-4 border-t-cyan-500',
              deletingIds.has(item.id) && 'animate-incinerate',
              dragOverId === item.id && dropPosition === 'after' && 'border-b-4 border-b-cyan-500',
              dragOverId === item.id && dropPosition === 'inside' && 'bg-cyan-500/20 border-cyan-500'
            )}
            style={{
              // Add leather texture overlay for tome binding feel
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='150' height='150' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='leather'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.8' numOctaves='5' seed='3' /%3E%3CfeColorMatrix type='saturate' values='0.15'/%3E%3C/filter%3E%3Crect width='150' height='150' filter='url(%23leather)' opacity='0.12' fill='%23a0826d'/%3E%3C/svg%3E")`,
              backgroundSize: '80px 80px',
            }}
          >
            <div className="flex items-center gap-2">
              {/* Expand/Collapse Icon */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleExpand(item.id);
                }}
                className="flex-shrink-0 text-gray-400 hover:text-orange-400 transition-colors"
                aria-label={item.isExpanded ? 'Collapse' : 'Expand'}
              >
                <GothicIcon variant="soul" size="xs">
                  <ChevronLeft className={item.isExpanded ? 'rotate-[-90deg]' : ''} />
                </GothicIcon>
              </button>
              
              {/* Mausoleum Icon - Heavy structural icon */}
              <GothicIcon variant="soul" size="sm">
                <DoorOpen />
              </GothicIcon>
              
              {/* Title */}
              <input
                type="text"
                value={item.title}
                onChange={(e) => {
                  e.stopPropagation();
                  onUpdateTitle(item.id, e.target.value);
                }}
                onClick={(e) => e.stopPropagation()}
                className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-stone-100 truncate focus:ring-1 focus:ring-orange-500 rounded px-1 -ml-1 font-['Crimson_Text'] tracking-wide cursed-translation"
              />
              
              {/* Delete Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(item.id);
                }}
                className="opacity-0 group-hover:opacity-100 transition-all p-1.5 text-zinc-600 hover:text-red-500 hover:scale-110 rounded"
                title="Destroy this mausoleum"
                aria-label="Delete mausoleum"
              >
                <GothicIcon variant="blood" size="xs">
                  <Trash2 />
                </GothicIcon>
              </button>
            </div>
          </div>
          
          {/* Children */}
          {item.isExpanded && (
            <div 
              className="ml-2 pl-2 mb-2"
              style={{
                borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              {childItems.map((child) => renderItem(child, level + 1))}
              
              {/* The Ghost Slot - Placeholder to add new haunting */}
              <div
                onClick={() => {
                  onCreateDoc(item.id);
                }}
                className={clsx(
                  'group relative p-4 cursor-pointer transition-all duration-300 mb-3',
                  'rounded-lg border-2 border-dashed backdrop-blur-sm',
                  'bg-gradient-to-br from-stone-900/20 via-stone-800/10 to-stone-900/20',
                  'border-stone-600/40 hover:border-red-500/50',
                  'hover:bg-gradient-to-br hover:from-red-950/20 hover:via-red-900/10 hover:to-red-950/20',
                  'hover:shadow-[0_0_15px_rgba(220,38,38,0.2)]'
                )}
                style={{
                  paddingLeft: `${(level + 1) * 48}px`,
                  // Add ethereal mist texture
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='mist'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' seed='7' /%3E%3CfeColorMatrix type='saturate' values='0.05'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23mist)' opacity='0.15' fill='%23666'/%3E%3C/svg%3E")`,
                  backgroundSize: '60px 60px',
                }}
              >
                <div className="flex items-center justify-center gap-2 text-stone-500 group-hover:text-red-400 transition-all duration-300">
                  <Icon icon="solar:add-circle-bold" className="size-5 group-hover:drop-shadow-[0_0_8px_rgba(220,38,38,0.6)]" />
                  <span className="text-sm font-['Crimson_Text'] font-semibold tracking-wide group-hover:drop-shadow-[0_0_6px_rgba(220,38,38,0.4)]">
                    Inscribe new page...
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }
    
    // Tombstone (Document) - Enhanced Gothic Manuscript Cards
    const isNoctuaryMode = mode === 'GRIMOIRE';
    
    return (
      <div
        key={item.id}
        draggable={!!onReorderItems}
        onDragStart={(e) => handleDragStart(e, item.id)}
        onDragOver={(e) => handleDragOver(e, item.id, 'tombstone')}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, item.id)}
        onDragEnd={handleDragEnd}
        className={clsx(
          'group relative cursor-pointer transition-all duration-300 mb-4',
          isNoctuaryMode ? (
            // Noctuary: Ancient manuscript card style
            clsx(
              'p-4 rounded-lg border-2 backdrop-blur-sm',
              'bg-gradient-to-br from-stone-900/40 via-stone-800/30 to-stone-900/40',
              'border-stone-700/50 hover:border-amber-600/40',
              'shadow-[0_2px_8px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)]',
              'hover:shadow-[0_4px_16px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.1)]',
              'hover:bg-gradient-to-br hover:from-stone-800/50 hover:via-stone-700/40 hover:to-stone-800/50',
              isActive && [
                'border-red-600/60 bg-gradient-to-br from-red-950/30 via-red-900/20 to-red-950/30',
                'shadow-[0_0_20px_rgba(220,38,38,0.3),0_4px_16px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.1)]'
              ]
            )
          ) : (
            // Haunting: Enhanced gothic card style
            clsx(
              'p-4 rounded-lg border-2 backdrop-blur-sm',
              'bg-gradient-to-br from-zinc-900/60 via-zinc-800/40 to-zinc-900/60',
              'border-zinc-700/50 hover:border-red-600/40',
              'shadow-[0_2px_8px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)]',
              'hover:shadow-[0_4px_16px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.1)]',
              'hover:bg-gradient-to-br hover:from-zinc-800/70 hover:via-zinc-700/50 hover:to-zinc-800/70',
              isActive && [
                'border-red-600/60 bg-gradient-to-br from-red-950/40 via-red-900/30 to-red-950/40',
                'shadow-[0_0_20px_rgba(220,38,38,0.4),0_4px_16px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.1)]'
              ]
            )
          ),
          draggedId === item.id && 'opacity-50',
          dragOverId === item.id && dropPosition === 'before' && 'border-t-4 border-t-cyan-500',
          dragOverId === item.id && dropPosition === 'after' && 'border-b-8 border-b-cyan-500',
          deletingIds.has(item.id) && 'animate-incinerate'
        )}
        style={{
          paddingLeft: `${paddingLeft}px`,
          // Add parchment texture overlay for manuscript feel
          backgroundImage: isNoctuaryMode 
            ? `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='parchment'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='4' seed='2' /%3E%3CfeColorMatrix type='saturate' values='0.1'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23parchment)' opacity='0.08' fill='%23d4c8b4'/%3E%3C/svg%3E")`
            : `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='stone'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2' numOctaves='3' seed='5' /%3E%3CfeColorMatrix type='saturate' values='0.05'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23stone)' opacity='0.06' fill='%23666'/%3E%3C/svg%3E")`,
          backgroundSize: '100px 100px',
        }}
        onClick={() => onSelectDoc(item.id)}
      >
        <div className="flex items-start gap-3">
          {/* Active Document Indicator - Subtle and Professional */}
          <div className="flex-shrink-0 mt-1.5">
            {isActive ? (
              <Skull className="size-4 text-red-600" />
            ) : (
              <div className="w-4 h-4" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <input
              type="text"
              value={getDisplayTitle(item)}
              onChange={(e) => {
                e.stopPropagation();
                onUpdateTitle(item.id, e.target.value);
              }}
              onClick={(e) => e.stopPropagation()}
              spellCheck={false}
              placeholder={mode === 'GRIMOIRE' ? 'Fresh Parchment' : 'Blank Scroll'}
              className={clsx(
                "w-full bg-transparent border-none outline-none truncate font-['Crimson_Text'] font-semibold cursed-translation placeholder:italic placeholder:opacity-60 transition-opacity duration-200",
                isNoctuaryMode 
                  ? isActive 
                    ? "text-sm text-red-600 focus:text-red-500 px-0 drop-shadow-[0_0_8px_rgba(220,38,38,0.6)] opacity-100" // Active: blood red with glow
                    : "text-sm old-brass-text focus:brass-text px-0 opacity-50 hover:opacity-80" // Inactive: faded brass
                  : isActive
                    ? "text-sm text-red-600 focus:text-red-500 focus:ring-1 focus:ring-red-700 rounded px-1 -ml-1 drop-shadow-[0_0_8px_rgba(220,38,38,0.6)] opacity-100"
                    : "text-sm old-brass-text focus:brass-text focus:ring-1 focus:ring-amber-700 rounded px-1 -ml-1 opacity-50 hover:opacity-80"
              )}
            />
            {!isNoctuaryMode && (
              <div className="space-y-1 mt-1">
                <div className="flex items-center gap-2 text-[10px] text-[#888] font-mono opacity-70">
                  <span>{item.wordCount} words</span>
                  {item.wordGoal && item.wordGoal > 0 && (
                    <>
                      <span>•</span>
                      <span className="brass-text">
                        {Math.min(Math.round((item.wordCount / item.wordGoal) * 100), 100)}%
                      </span>
                    </>
                  )}
                  <span>•</span>
                  <span>
                    {new Date(item.lastModified).toLocaleDateString()}
                  </span>
                </div>
                {item.wordGoal && item.wordGoal > 0 && (
                  <div className="h-1 bg-zinc-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-900 to-red-600 transition-all duration-300"
                      style={{
                        width: `${Math.min((item.wordCount / item.wordGoal) * 100, 100)}%`,
                      }}
                    />
                  </div>
                )}
              </div>
            )}
            {isNoctuaryMode && (
              <div className="text-[9px] text-[#888] mt-0.5 opacity-70">
                {item.wordCount} words
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(item.id);
              }}
              className={clsx(
                "opacity-0 group-hover:opacity-100 transition-all",
                isNoctuaryMode
                  ? "p-1 text-zinc-600 hover:text-red-400"
                  : "p-2 text-zinc-600 hover:text-red-500 hover:scale-110 rounded"
              )}
              title="Bury this draft"
              aria-label="Delete document"
            >
              {isNoctuaryMode ? (
                <Trash2 className="size-3" />
              ) : (
                <GothicIcon variant="blood" size="xs">
                  <Trash2 />
                </GothicIcon>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar - The Crypt - Glass Tint with Border */}
      <div
        className={clsx(
          'fixed left-0 w-72 z-50 transition-transform duration-300',
          'flex flex-col',
          'bg-white/5 backdrop-blur-md',
          mode === 'GRIMOIRE' ? 'grimoire-texture' : '',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        style={{
          top: 0,
          bottom: 0,
          height: '100vh',
          margin: 0,
          padding: 0,
          // Softer book binding border with double-border effect
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: 'inset -2px 0 4px rgba(0, 0, 0, 0.3), 2px 0 8px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Header */}
        <div 
          className="px-4 pb-3 pt-4 flex items-center justify-between bg-transparent"
          style={{
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div className="flex items-center gap-2">
            <Icon icon="solar:book-bold" className="size-5 text-red-400" style={{ filter: 'drop-shadow(0 0 8px rgba(220, 38, 38, 0.5))' }} />
            <h2 className="gothic-title text-lg uppercase tracking-wider text-stone-200 font-['Playfair_Display']">
              {mode === 'GRIMOIRE' ? 'Archives' : 'The Crypt'}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {/* Desktop collapse button */}
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="hidden md:block text-gray-400 hover:text-gray-200 hover:bg-white/5 p-2 rounded-lg transition-colors"
                aria-label="Collapse sidebar"
                title="Collapse sidebar"
              >
                <ChevronLeft className="size-5" />
              </button>
            )}
            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="md:hidden text-gray-400 hover:text-gray-200 hover:bg-white/5 p-2 rounded-lg transition-colors"
              aria-label="Close sidebar"
            >
              <GothicIcon variant="blood" size="sm">
                <X />
              </GothicIcon>
            </button>
          </div>
        </div>

        {/* Action Links - Artifact Style */}
        <div 
          className="p-4 space-y-3"
          style={{
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div className="flex gap-2">
            <button
              onClick={() => onCreateDoc(null)}
              className="group flex items-center gap-2 flex-1 px-2 py-2 text-left transition-all hover:translate-x-1"
              title="Inscribe new page (Ctrl+N)"
            >
              <Feather className="size-4 text-red-400 group-hover:text-red-300 transition-all group-hover:drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
              <span className="text-sm font-['Crimson_Text'] font-semibold text-stone-300 group-hover:text-red-300 transition-colors group-hover:drop-shadow-[0_0_6px_rgba(220,38,38,0.6)]">
                New File
              </span>
            </button>
            <button
              onClick={() => {
                const newFolderId = onCreateMausoleum('New Folder');
                if (newFolderId) {
                  setRenamingId(newFolderId);
                }
              }}
              className="group flex items-center gap-2 flex-1 px-2 py-2 text-left transition-all hover:translate-x-1"
              title="Create new folder"
            >
              <Plus className="size-4 text-amber-600 group-hover:text-amber-500 transition-all group-hover:drop-shadow-[0_0_8px_rgba(217,119,6,0.8)]" />
              <span className="text-sm font-['Crimson_Text'] font-semibold text-stone-300 group-hover:text-amber-400 transition-colors group-hover:drop-shadow-[0_0_6px_rgba(217,119,6,0.6)]">
                New Folder
              </span>
            </button>
          </div>
        </div>

        {/* Documents List - The Catacombs */}
        <div className="flex-1 overflow-y-auto p-4 grimoire-scroll">
          {items.length === 0 ? (
            <div className="text-center py-12 text-gray-600 text-sm font-['Creepster'] text-lg">
              The catacombs are empty... for now.
            </div>
          ) : (
            <div className="space-y-1">
              {rootItems.map((item) => (
                <FileSystemItem key={item.id} item={item} level={0} />
              ))}
            </div>
          )}
        </div>

        {/* Bottom Actions - Diegetic Controls */}
        {mode === 'GRIMOIRE' && (onExport || onShowHelp) && (
          <div 
            className="p-4 space-y-2"
            style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            {onExport && currentDocId && (
              <button
                onClick={onExport}
                className="group flex items-center gap-3 text-slate-300 hover:text-amber-400 transition-all duration-200 w-full py-2 hover:translate-x-1"
              >
                <Icon icon="solar:document-bold" className="size-5" />
                <span className="text-sm font-['Crimson_Text'] font-semibold">Seal & Export</span>
              </button>
            )}
            {onShowHelp && (
              <button
                onClick={onShowHelp}
                className="group flex items-center gap-3 text-slate-300 hover:text-red-400 transition-all duration-200 w-full py-2 hover:translate-x-1"
              >
                <Icon icon="solar:question-circle-bold" className="size-5" />
                <span className="text-sm font-['Crimson_Text'] font-semibold">Arcane Gestures</span>
              </button>
            )}
          </div>
        )}

      </div>

      {/* Context Menu */}
      {contextMenu && (
        <>
          <div 
            className="fixed inset-0 z-[60]" 
            onClick={closeContextMenu}
          />
          <div
            className="fixed z-[70] bg-neutral-900 border border-neutral-700 rounded-lg shadow-xl py-2 min-w-[160px]"
            style={{
              left: contextMenu.x,
              top: contextMenu.y,
            }}
          >
            {contextMenu.itemType === 'folder' && (
              <>
                <button
                  onClick={() => handleContextAction('newFile', contextMenu.itemId)}
                  className="w-full px-4 py-2 text-left text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white flex items-center gap-2"
                >
                  <Feather className="w-4 h-4" />
                  New File Inside...
                </button>
                <button
                  onClick={() => handleContextAction('newFolder', contextMenu.itemId)}
                  className="w-full px-4 py-2 text-left text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white flex items-center gap-2"
                >
                  <Folder className="w-4 h-4" />
                  New Folder Inside...
                </button>
                <div className="border-t border-neutral-700 my-1" />
              </>
            )}
            <button
              onClick={() => handleContextAction('rename', contextMenu.itemId)}
              className="w-full px-4 py-2 text-left text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white"
            >
              Rename
            </button>
            <button
              onClick={() => handleContextAction('delete', contextMenu.itemId)}
              className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </>
  );
}

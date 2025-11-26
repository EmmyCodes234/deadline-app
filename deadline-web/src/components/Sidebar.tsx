import { useState } from 'react';
import { Icon } from '@iconify/react';
import { type CryptItem } from '@/hooks/useCrypt';
import clsx from 'clsx';
import { GothicIcon } from './GothicIcon';
import { DoorOpen, Trash2, PenTool, BookOpen, ChevronLeft, X } from 'lucide-react';
import { horrorAudio } from '@/lib/audio/HorrorAudio';

interface SidebarProps {
  items: CryptItem[];
  currentDocId: string | null;
  totalProjectWords: number;
  onSelectDoc: (id: string) => void;
  onCreateDoc: (parentId?: string | null) => void;
  onCreateMausoleum: (title?: string, parentId?: string | null) => void;
  onDeleteDoc: (id: string) => void;
  onUpdateTitle: (id: string, title: string) => void;
  onToggleExpand: (id: string) => void;
  onReorderItems?: (draggedId: string, targetId: string, position: 'before' | 'after' | 'inside') => void;
  isOpen: boolean;
  onClose: () => void;
  onToggleSidebar?: () => void; // For desktop collapse
  mode?: 'HAUNTING' | 'GRIMOIRE'; // Optional mode for context-aware UI
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
}: SidebarProps) {
  // Drag and drop state
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [dropPosition, setDropPosition] = useState<'before' | 'after' | 'inside' | null>(null);
  
  // Delete animation state - track which items are animating out
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  
  // Get root items (no parent)
  const rootItems = items.filter((item) => !item.parentId);
  
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
  
  // Recursive component to render items
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
              'group relative p-3 cursor-pointer transition-all duration-200',
              'rounded-lg mb-2',
              'bg-stone-800/60 border-2 border-stone-700/50 border-b-4 border-b-stone-900',
              'hover:bg-stone-700/70 hover:border-orange-500/40',
              'shadow-[0_4px_8px_rgba(0,0,0,0.4)]',
              draggedId === item.id && 'opacity-50',
              dragOverId === item.id && dropPosition === 'before' && 'border-t-4 border-t-cyan-500',
              deletingIds.has(item.id) && 'animate-incinerate',
              dragOverId === item.id && dropPosition === 'after' && 'border-b-4 border-b-cyan-500',
              dragOverId === item.id && dropPosition === 'inside' && 'bg-cyan-500/20 border-cyan-500'
            )}
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
                className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-stone-100 truncate focus:ring-1 focus:ring-orange-500 rounded px-1 -ml-1 font-['Playfair_Display'] tracking-wide"
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
            <div className="ml-2 border-l-2 border-white/5 pl-2 mb-2">
              {childItems.map((child) => renderItem(child, level + 1))}
              
              {/* The Ghost Slot - Placeholder to add new haunting */}
              <div
                style={{ paddingLeft: `${(level + 1) * 48}px` }}
                onClick={() => {
                  onCreateDoc(item.id);
                }}
                className={clsx(
                  'group relative p-4 cursor-pointer transition-all duration-300 mb-3',
                  'rounded-t-2xl rounded-b-sm',
                  'bg-transparent border-2 border-dashed border-stone-600/50',
                  'hover:border-orange-500/60 hover:bg-orange-500/10'
                )}
              >
                <div className="flex items-center justify-center gap-2 text-stone-500 group-hover:text-orange-400 transition-colors">
                  <Icon icon="solar:add-circle-bold" className="size-5" />
                  <span className="text-sm font-['Creepster'] tracking-wider">
                    Summon new haunting here...
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }
    
    // Tombstone (Document) - Increased padding
    return (
      <div
        key={item.id}
        style={{ paddingLeft: `${paddingLeft}px` }}
        draggable={!!onReorderItems}
        onDragStart={(e) => handleDragStart(e, item.id)}
        onDragOver={(e) => handleDragOver(e, item.id, 'tombstone')}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, item.id)}
        onDragEnd={handleDragEnd}
        className={clsx(
          'group relative p-4 cursor-pointer transition-all duration-200 mb-2',
          'rounded-md',
          isActive
            ? 'bg-zinc-900 shadow-lg shadow-purple-500/10'
            : 'bg-transparent hover:bg-zinc-900/50',
          draggedId === item.id && 'opacity-50',
          dragOverId === item.id && dropPosition === 'before' && 'border-t-4 border-t-cyan-500',
          dragOverId === item.id && dropPosition === 'after' && 'border-b-8 border-b-cyan-500',
          deletingIds.has(item.id) && 'animate-incinerate'
        )}
        onClick={() => onSelectDoc(item.id)}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            {isActive ? (
              <Icon
                icon="solar:ghost-bold"
                className="size-5 text-purple-400 animate-bounce"
              />
            ) : (
              <Icon icon="solar:document-text-bold" className="size-5 text-zinc-500" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <input
              type="text"
              value={item.title}
              onChange={(e) => {
                e.stopPropagation();
                onUpdateTitle(item.id, e.target.value);
              }}
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-transparent border-none outline-none text-sm font-medium text-stone-100 truncate focus:ring-1 focus:ring-orange-500 rounded px-1 -ml-1 font-['Playfair_Display']"
              style={{ textShadow: '0 2px 4px rgba(0,0,0,0.9)' }}
            />
            <div className="space-y-1 mt-1">
              <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
                <span>{item.wordCount} words</span>
                {item.wordGoal && item.wordGoal > 0 && (
                  <>
                    <span>•</span>
                    <span className="text-purple-400">
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
                    className="h-full bg-gradient-to-r from-purple-900 to-purple-500 transition-all duration-300"
                    style={{
                      width: `${Math.min((item.wordCount / item.wordGoal) * 100, 100)}%`,
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            {mode === 'GRIMOIRE' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectDoc(item.id);
                }}
                className="opacity-0 group-hover:opacity-100 transition-all p-2 text-zinc-600 hover:text-cyan-400 hover:scale-110 rounded"
                title="Open in tab"
                aria-label="Open document"
              >
                <GothicIcon variant="arcane" size="xs">
                  <BookOpen />
                </GothicIcon>
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(item.id);
              }}
              className="opacity-0 group-hover:opacity-100 transition-all p-2 text-zinc-600 hover:text-red-500 hover:scale-110 rounded"
              title="Bury this draft"
              aria-label="Delete document"
            >
              <GothicIcon variant="blood" size="xs">
                <Trash2 />
              </GothicIcon>
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

      {/* Sidebar - The Crypt - Darker, Borderless */}
      <div
        className={clsx(
          'fixed top-0 left-0 h-full w-80 bg-zinc-950 grimoire-texture z-50 transition-transform duration-300',
          'flex flex-col',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="p-4 border-b-2 border-stone-700/50 flex items-center justify-between bg-stone-800/40">
          <div className="flex items-center gap-2">
            <Icon icon="solar:folder-bold" className="size-5 text-gray-400" />
            <h2 className="font-['Playfair_Display'] text-xl font-bold text-gray-100 uppercase tracking-wide">
              The Crypt
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

        {/* Summoning Circle Buttons - Minimal Style */}
        <div className="p-5 border-b border-zinc-800/50 space-y-2">
          <button
            onClick={() => onCreateDoc(null)}
            className="flex items-center gap-3 text-zinc-400 hover:text-zinc-100 transition-colors w-full py-2"
          >
            <Icon icon="solar:add-circle-bold" className="size-5" />
            <span className="text-sm font-medium">New Tome Page</span>
          </button>
          <button
            onClick={() => onCreateMausoleum()}
            className="flex items-center gap-3 text-zinc-400 hover:text-zinc-100 transition-colors w-full py-2"
          >
            <Icon icon="solar:folder-with-files-bold" className="size-5" />
            <span className="text-sm font-medium">Build Mausoleum</span>
          </button>
        </div>

        {/* Documents List - The Catacombs */}
        <div className="flex-1 overflow-y-auto p-4 grimoire-scroll">
          {items.length === 0 ? (
            <div className="text-center py-12 text-gray-600 text-sm font-['Creepster'] text-lg">
              The catacombs are empty... for now.
            </div>
          ) : (
            <div>
              {rootItems.map((item) => renderItem(item, 0))}
            </div>
          )}
        </div>

        {/* Project Total Summary */}
        <div className="border-t-2 border-stone-700/50 p-4 bg-stone-800/40">
          <div className="text-center space-y-2">
            <p className="text-xs text-gray-500 font-mono uppercase tracking-widest">
              PROJECT TOTAL
            </p>
            <div className="font-['Creepster'] text-3xl text-orange-500 drop-shadow-[0_2px_8px_rgba(249,115,22,0.6)]">
              {totalProjectWords.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 font-mono uppercase">
              WORDS
            </p>
          </div>

          {/* Project Goal Progress */}
          {(() => {
            const totalGoal = items.reduce((sum, item) => sum + (item.wordGoal || 0), 0);
            if (totalGoal > 0) {
              const progress = Math.min((totalProjectWords / totalGoal) * 100, 100);
              return (
                <div className="mt-3 pt-3 border-t border-white/5 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-gray-500 uppercase">Project Goal</span>
                    <span className="text-purple-400 font-bold">{Math.round(progress)}%</span>
                  </div>
                  <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-900 to-purple-500 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="text-center text-xs text-gray-600 font-mono">
                    {totalGoal.toLocaleString()} words goal
                  </div>
                </div>
              );
            }
            return null;
          })()}

          <div className="mt-3 pt-3 border-t border-white/5 text-center">
            <p className="text-xs text-gray-600 font-mono uppercase tracking-wider">
              {items.filter((i) => i.type === 'tombstone').length} Hauntings • {items.filter((i) => i.type === 'mausoleum').length} Mausoleums
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

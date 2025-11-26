import { useState } from 'react';
import { Icon } from '@iconify/react';
import { type CryptItem } from '@/hooks/useCrypt';
import { CryptItemCard } from './CryptItemCard';

interface CorkboardViewProps {
  items: CryptItem[];
  activeDocId: string | null;
  onSelectDoc: (id: string) => void;
  onDeleteDoc: (id: string) => void;
  onUpdateNotes: (id: string, notes: { synopsis: string }) => void;
  onReorderItems: (reorderedItems: CryptItem[]) => void;
}

export function CorkboardView({
  items,
  activeDocId,
  onSelectDoc,
  onDeleteDoc,
  onUpdateNotes,
  onReorderItems,
}: CorkboardViewProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  // Sort items by order property
  const sortedItems = [...items].sort((a, b) => (a.order || 0) - (b.order || 0));

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedId(itemId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, itemId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverId(itemId);
  };

  const handleDrop = (e: React.DragEvent, dropTargetId: string) => {
    e.preventDefault();
    
    if (!draggedId || draggedId === dropTargetId) {
      setDraggedId(null);
      setDragOverId(null);
      return;
    }

    const draggedIndex = sortedItems.findIndex(item => item.id === draggedId);
    const targetIndex = sortedItems.findIndex(item => item.id === dropTargetId);

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedId(null);
      setDragOverId(null);
      return;
    }

    // Reorder the array
    const newItems = [...sortedItems];
    const [removed] = newItems.splice(draggedIndex, 1);
    newItems.splice(targetIndex, 0, removed);

    onReorderItems(newItems);
    setDraggedId(null);
    setDragOverId(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
  };

  return (
    <div className="h-full overflow-y-auto p-8 bg-zinc-950 relative">
      {/* Noise Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* The Plotting Board */}
      <div className="min-h-full rounded-lg p-6 relative">
        {sortedItems.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center text-stone-400">
              <Icon icon="solar:document-text-bold" className="size-16 mx-auto opacity-30 mb-4" />
              <p className="font-['Playfair_Display'] text-xl">No items to display</p>
              <p className="text-sm mt-2">Create a document from the sidebar</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedItems.map((item) => (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, item.id)}
                onDragOver={(e) => handleDragOver(e, item.id)}
                onDrop={(e) => handleDrop(e, item.id)}
                onDragEnd={handleDragEnd}
                className={`
                  transition-all duration-200
                  ${draggedId === item.id ? 'opacity-50 scale-95' : ''}
                  ${dragOverId === item.id && draggedId !== item.id ? 'scale-105' : ''}
                `}
              >
                <CryptItemCard
                  item={item}
                  isActive={item.id === activeDocId}
                  onSelect={() => onSelectDoc(item.id)}
                  onDelete={() => onDeleteDoc(item.id)}
                  onUpdateSynopsis={(synopsis) => onUpdateNotes(item.id, { synopsis })}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { Icon } from '@iconify/react';
import { type CryptItem } from '@/hooks/useCrypt';
import clsx from 'clsx';

interface CryptItemCardProps {
  item: CryptItem;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onUpdateSynopsis: (synopsis: string) => void;
}

export function CryptItemCard({ 
  item, 
  isActive,
  onSelect, 
  onDelete, 
  onUpdateSynopsis 
}: CryptItemCardProps) {
  const synopsis = item.notes?.synopsis || '';

  return (
    <div
      onClick={onSelect}
      className={clsx(
        'relative group cursor-pointer transition-all duration-200',
        'bg-zinc-900 border border-white/10 rounded shadow-md hover:shadow-xl',
        'p-4 min-h-[200px] flex flex-col',
        isActive && 'shadow-[0_0_15px_rgba(168,85,247,0.4)]'
      )}
      style={{
        transform: 'rotate(-0.5deg)',
      }}
    >
      {/* CSS Nail Head */}
      <div className="absolute -top-1 left-1/2 -translate-x-1/2">
        <div className="w-2 h-2 rounded-full bg-zinc-700 shadow-md" />
      </div>

      {/* Delete Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (confirm(`Delete "${item.title}"?`)) {
            onDelete();
          }
        }}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded"
      >
        <Icon icon="solar:close-circle-bold" className="size-4 text-red-600" />
      </button>

      {/* Type Badge */}
      <div className="flex items-center gap-2 mb-2">
        <Icon 
          icon={item.type === 'tombstone' ? 'solar:document-text-bold' : 'solar:folder-bold'} 
          className="size-4 text-zinc-500"
        />
        <span className="text-xs font-mono text-zinc-600 uppercase">
          {item.type === 'tombstone' ? 'Chapter' : 'Folder'}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-serif text-lg font-bold text-zinc-200 mb-3 line-clamp-2">
        {item.title}
      </h3>

      {/* Synopsis */}
      <textarea
        value={synopsis}
        onChange={(e) => {
          e.stopPropagation();
          onUpdateSynopsis(e.target.value);
        }}
        onClick={(e) => e.stopPropagation()}
        placeholder="Add a brief synopsis..."
        className="flex-1 w-full bg-transparent border-none text-sm text-zinc-400 leading-relaxed resize-none focus:ring-0 focus:outline-none placeholder:text-zinc-700 font-serif"
      />

      {/* Footer Stats */}
      <div className="mt-3 pt-3 border-t border-white/5 space-y-2">
        <div className="flex items-center justify-between text-xs text-zinc-600 font-mono">
          {item.type === 'tombstone' && (
            <>
              <span>{item.wordCount} words</span>
              {item.wordGoal && item.wordGoal > 0 && (
                <span className="text-purple-400 font-bold">
                  {Math.min(Math.round((item.wordCount / item.wordGoal) * 100), 100)}%
                </span>
              )}
            </>
          )}
          {item.children && item.children.length > 0 && (
            <span>{item.children.length} items</span>
          )}
        </div>
        {item.type === 'tombstone' && item.wordGoal && item.wordGoal > 0 && (
          <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
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
  );
}

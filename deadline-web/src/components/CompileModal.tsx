import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { type CryptItem } from '@/hooks/useCrypt';
import { exportProjectToDocx, type ExportOptions } from '@/lib/compileProject';
import clsx from 'clsx';

interface CompileModalProps {
  isOpen: boolean;
  onClose: () => void;
  cryptItems: CryptItem[];
  projectTitle: string;
}

export function CompileModal({ isOpen, onClose, cryptItems, projectTitle }: CompileModalProps) {
  const [fileName, setFileName] = useState(projectTitle);
  const [includeTitlePage, setIncludeTitlePage] = useState(true);
  const [includeTableOfContents] = useState(false);
  const [mausoleumPageBreak, setMausoleumPageBreak] = useState(false);
  const [tombstonePageBreak, setTombstonePageBreak] = useState(true);
  const [excludedIds, setExcludedIds] = useState<Set<string>>(new Set());
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setFileName(projectTitle);
      setExcludedIds(new Set());
    }
  }, [isOpen, projectTitle]);

  if (!isOpen) return null;

  const toggleExclude = (id: string) => {
    setExcludedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleExport = async () => {
    setIsExporting(true);
    setExportError(null);
    try {
      const options: ExportOptions = {
        fileName,
        includeTitlePage,
        includeTableOfContents,
        mausoleumPageBreak,
        tombstonePageBreak,
        excludedItemIds: excludedIds,
      };
      await exportProjectToDocx(cryptItems, projectTitle, options);
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
      setExportError('The ritual failed. The spirits are restless. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Flatten items for display
  const flattenItems = (items: CryptItem[], parentId: string | null = null, depth: number = 0): Array<{ item: CryptItem; depth: number }> => {
    const result: Array<{ item: CryptItem; depth: number }> = [];
    const itemsAtLevel = items.filter((item) => item.parentId === parentId);
    
    itemsAtLevel.forEach((item) => {
      result.push({ item, depth });
      if (item.children && item.children.length > 0) {
        result.push(...flattenItems(items, item.id, depth + 1));
      }
    });
    
    return result;
  };

  const flatItems = flattenItems(cryptItems);
  const selectedCount = flatItems.length - excludedIds.size;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="bg-stone-900 border-2 border-orange-500/50 rounded-lg shadow-2xl shadow-orange-500/20 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex-none p-6 border-b-2 border-stone-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon icon="solar:scroll-bold" className="size-8 text-orange-400" />
              <h2 className="font-['Playfair_Display'] text-2xl font-bold text-stone-100 uppercase tracking-wider">
                The Resurrection Ritual
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-stone-500 hover:text-stone-300 transition-colors"
            >
              <Icon icon="solar:close-circle-bold" className="size-6" />
            </button>
          </div>
          <p className="text-sm text-stone-500 font-mono mt-2">
            Prepare your manuscript for the mortal realm
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 grimoire-scroll [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-zinc-800 [&::-webkit-scrollbar-track]:bg-transparent pr-2">
          {/* File Name */}
          <div>
            <label className="block text-sm font-serif text-stone-400 uppercase mb-3 tracking-wider">
              Manuscript Name
            </label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="bg-transparent border-b border-zinc-700 text-xl font-serif text-zinc-200 focus:border-amber-500 focus:outline-none py-2 w-full transition-colors"
              placeholder="Untitled Manuscript"
            />
          </div>

          {/* Export Options */}
          <div>
            <h3 className="text-sm font-mono text-stone-400 uppercase mb-3">
              Ritual Components
            </h3>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 bg-stone-800/30 border border-stone-800 rounded hover:border-stone-700 transition-colors cursor-pointer group">
                <input
                  type="checkbox"
                  checked={includeTitlePage}
                  onChange={(e) => setIncludeTitlePage(e.target.checked)}
                  className="checkbox-cursed"
                />
                <div className="flex-1">
                  <span className="text-stone-200 font-['Playfair_Display']">Include Title Page</span>
                  <p className="text-xs text-stone-500 font-mono mt-0.5">
                    Add a cover page with title and word count
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-stone-800/30 border border-stone-800 rounded hover:border-stone-700 transition-colors cursor-pointer group">
                <input
                  type="checkbox"
                  checked={mausoleumPageBreak}
                  onChange={(e) => setMausoleumPageBreak(e.target.checked)}
                  className="checkbox-cursed"
                />
                <div className="flex-1">
                  <span className="text-stone-200 font-['Playfair_Display']">Start each Mausoleum on new page</span>
                  <p className="text-xs text-stone-500 font-mono mt-0.5">
                    Add page breaks before folder sections
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-stone-800/30 border border-stone-800 rounded hover:border-stone-700 transition-colors cursor-pointer group">
                <input
                  type="checkbox"
                  checked={tombstonePageBreak}
                  onChange={(e) => setTombstonePageBreak(e.target.checked)}
                  className="checkbox-cursed"
                />
                <div className="flex-1">
                  <span className="text-stone-200 font-['Playfair_Display']">Start each Tombstone on new page</span>
                  <p className="text-xs text-stone-500 font-mono mt-0.5">
                    Add page breaks before each chapter
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Item Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-mono text-stone-400 uppercase">
                Select Items to Include
              </h3>
              <span className="text-xs text-stone-500 font-mono">
                {selectedCount} of {flatItems.length} selected
              </span>
            </div>
            <div className="space-y-1 max-h-64 overflow-y-auto border border-stone-800 rounded p-2 bg-stone-950/50">
              {flatItems.map(({ item, depth }) => (
                <label
                  key={item.id}
                  className="flex items-center gap-2 p-2 hover:bg-stone-800/50 rounded transition-colors cursor-pointer group"
                  style={{ paddingLeft: `${depth * 1.5 + 0.5}rem` }}
                >
                  <input
                    type="checkbox"
                    checked={!excludedIds.has(item.id)}
                    onChange={() => toggleExclude(item.id)}
                    className="checkbox-cursed"
                  />
                  <Icon
                    icon={item.type === 'tombstone' ? 'solar:document-text-bold' : 'solar:folder-bold'}
                    className={clsx(
                      'size-4',
                      item.type === 'tombstone' ? 'text-orange-400' : 'text-purple-400'
                    )}
                  />
                  <span className="text-sm text-stone-300 font-['Playfair_Display'] flex-1">
                    {item.title}
                  </span>
                  {item.type === 'tombstone' && (
                    <span className="text-xs text-stone-600 font-mono">
                      {item.wordCount} words
                    </span>
                  )}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-none border-t-2 border-stone-800">
          {exportError && (
            <div className="px-6 py-3 bg-red-900/20 border-b border-red-500/30 flex items-center gap-3">
              <Icon icon="solar:danger-triangle-bold" className="size-5 text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-300 font-['Playfair_Display']">{exportError}</p>
            </div>
          )}
          <div className="p-6 flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 text-stone-400 hover:text-stone-200 font-mono uppercase text-sm transition-colors"
            >
              Cancel
            </button>
          <button
            onClick={handleExport}
            disabled={isExporting || !fileName.trim() || selectedCount === 0}
            className={clsx(
              'w-full py-4 border rounded flex items-center justify-center gap-2 uppercase tracking-widest transition-all',
              isExporting || !fileName.trim() || selectedCount === 0
                ? 'border-zinc-800 text-zinc-600 cursor-not-allowed'
                : 'border-amber-600/50 text-amber-500 hover:bg-amber-900/20 hover:border-amber-500'
            )}
          >
            {isExporting ? (
              <>
                <Icon icon="solar:refresh-bold" className="size-4 animate-spin" />
                <span className="text-sm">Performing Ritual...</span>
              </>
            ) : (
              <>
                <Icon icon="solar:download-bold" className="size-4" />
                <span className="text-sm">Perform Ritual</span>
              </>
            )}
          </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

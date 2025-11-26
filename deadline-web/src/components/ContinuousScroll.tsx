import { Icon } from '@iconify/react';
import { type CryptItem } from '@/hooks/useCrypt';

interface ContinuousScrollProps {
  documents: CryptItem[];
}

export function ContinuousScroll({ documents }: ContinuousScrollProps) {
  // Filter to only tombstones (documents with content)
  const tombstones = documents.filter((doc) => doc.type === 'tombstone');
  const totalWords = tombstones.reduce((sum, doc) => sum + doc.wordCount, 0);

  if (tombstones.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-stone-600">
        <div className="text-center space-y-4">
          <Icon icon="solar:scroll-bold" className="size-16 mx-auto opacity-50" />
          <p className="text-xl font-['Playfair_Display']">
            No documents to display
          </p>
          <p className="text-sm">
            Open some documents to view them in continuous scroll
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-[#0c0c0c]">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center pb-8">
          <h1 className="font-serif text-4xl font-bold text-zinc-200 mb-4">
            The Chronicle
          </h1>
          <div className="flex items-center justify-center gap-4 text-sm text-zinc-600 font-mono">
            <span>{tombstones.length} {tombstones.length === 1 ? 'chapter' : 'chapters'}</span>
            <span>•</span>
            <span>{totalWords.toLocaleString()} words</span>
          </div>
        </div>
        {tombstones.map((doc, index) => (
          <div key={doc.id} className="relative">
            {/* Document Header */}
            <div className="mb-8 text-center">
              <h2 className="font-serif text-3xl font-bold text-zinc-200 mb-2">
                {doc.title}
              </h2>
              <div className="text-xs text-zinc-600 font-mono">
                {doc.wordCount} words
              </div>
            </div>

            {/* Document Content */}
            <div className="prose prose-invert max-w-none">
              {doc.content ? (
                doc.content.split('\n').map((paragraph, pIndex) => (
                  <p
                    key={pIndex}
                    className="text-lg text-zinc-300 leading-8 mb-4 font-serif"
                  >
                    {paragraph || '\u00A0'}
                  </p>
                ))
              ) : (
                <p className="text-zinc-600 italic font-serif">
                  (Empty document)
                </p>
              )}
            </div>

            {/* Separator (except for last document) */}
            {index < tombstones.length - 1 && (
              <div className="mt-12 flex items-center justify-center">
                <p className="text-zinc-600 text-sm">~ ❖ ~</p>
              </div>
            )}
          </div>
        ))}

        {/* End Marker */}
        <div className="flex items-center justify-center py-8">
          <p className="text-zinc-600 text-sm font-serif italic">~ End of Chronicle ~</p>
        </div>
      </div>
    </div>
  );
}

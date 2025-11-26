import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { Textarea } from '@/components/ui/textarea';
import { type CryptItem } from '@/hooks/useCrypt';
import clsx from 'clsx';

// Soul Essence Bar Component
const SoulEssenceBar = ({ current, goal }: { current: number; goal: number }) => {
  const percentage = Math.min((current / goal) * 100, 100);
  
  return (
    <div className="w-full space-y-2 mb-8">
      <div className="flex justify-between text-xs uppercase tracking-widest text-zinc-500">
        <span>Soul Essence</span>
        <span>{percentage.toFixed(0)}%</span>
      </div>
      
      {/* The Bar Container */}
      <div className="h-4 w-full bg-zinc-900/80 rounded-full overflow-hidden border border-white/5 relative">
        {/* The Liquid Fill */}
        <div 
          className="h-full bg-gradient-to-r from-purple-900 via-purple-600 to-purple-400 transition-all duration-1000 ease-out relative"
          style={{ width: `${percentage}%` }}
        >
          {/* The "Glow" at the tip */}
          <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/50 blur-[4px]" />
        </div>
      </div>
      
      <p className="text-[10px] text-zinc-600 italic text-center">
        {current.toLocaleString()} words inscribed of {goal.toLocaleString()} required.
      </p>
    </div>
  );
};

interface AltarOfWhispersProps {
  activeDocument: CryptItem | null;
  onUpdateSynopsis: (synopsis: string) => void;
  onAddCharacter: (name: string, description: string) => void;
  onUpdateCharacter: (charId: string, name: string, description: string) => void;
  onDeleteCharacter: (charId: string) => void;
  onAddResearch: (title: string, url: string) => void;
  onUpdateResearch: (researchId: string, title: string, url: string) => void;
  onDeleteResearch: (researchId: string) => void;
  onUpdateWordGoal: (goal: number) => void;
}

export function AltarOfWhispers({
  activeDocument,
  onUpdateSynopsis,
  onAddCharacter,
  onUpdateCharacter,
  onDeleteCharacter,
  onAddResearch,
  onUpdateResearch,
  onDeleteResearch,
  onUpdateWordGoal,
}: AltarOfWhispersProps) {
  const [activeTab, setActiveTab] = useState<'characters' | 'research'>('characters');
  const [synopsis, setSynopsis] = useState('');
  const [editingCharId, setEditingCharId] = useState<string | null>(null);
  const [editingResearchId, setEditingResearchId] = useState<string | null>(null);
  const [showAddCharModal, setShowAddCharModal] = useState(false);
  const [showAddResearchModal, setShowAddResearchModal] = useState(false);
  const [newCharName, setNewCharName] = useState('');
  const [newCharDesc, setNewCharDesc] = useState('');
  const [newResearchTitle, setNewResearchTitle] = useState('');
  const [newResearchUrl, setNewResearchUrl] = useState('');
  const [synopsisExpanded, setSynopsisExpanded] = useState(true);
  const [goalExpanded, setGoalExpanded] = useState(false);

  // Update synopsis when active document changes
  useEffect(() => {
    if (activeDocument?.notes) {
      setSynopsis(activeDocument.notes.synopsis || '');
    } else {
      setSynopsis('');
    }
  }, [activeDocument]);

  // Get real data from active document
  const characters = activeDocument?.notes?.characters || [];
  const research = activeDocument?.notes?.research || [];

  return (
    <div className="w-80 flex flex-col h-full">
      {/* Header - Borderless */}
      <div className="flex-none p-5 bg-transparent">
        <div className="flex items-center gap-3 mb-2">
          <Icon icon="solar:magic-stick-bold" className="size-6 text-purple-400" style={{ filter: 'drop-shadow(0 0 8px rgba(168, 85, 247, 0.6))' }} />
          <h2 className="font-['Playfair_Display'] text-xl font-bold text-stone-100 uppercase tracking-widest">
            The Altar
          </h2>
        </div>
        <p className="text-xs text-purple-400/70 font-mono uppercase tracking-wider">Sacred Inscriptions</p>
      </div>

      {!activeDocument ? (
        <div className="flex-1 flex items-center justify-center text-stone-600 p-6">
          <div className="text-center space-y-4">
            <Icon icon="solar:document-text-bold" className="size-16 mx-auto opacity-30" />
            <p className="font-['Playfair_Display'] text-lg italic">
              Select a Tombstone to view its secrets
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto grimoire-scroll">
          {/* Soul Essence - Liquid Progress Bar */}
          <div className="p-5">
            {activeDocument.wordGoal && activeDocument.wordGoal > 0 ? (
              <SoulEssenceBar 
                current={activeDocument.wordCount} 
                goal={activeDocument.wordGoal} 
              />
            ) : (
              <div className="mb-8">
                <div className="text-xs uppercase tracking-widest text-zinc-500 mb-3">Soul Essence</div>
                <div className="text-center py-6 text-sm">
                  <Icon icon="solar:bottle-bold" className="size-12 mx-auto text-zinc-500 mb-2" />
                  <p className="text-zinc-400 italic">Set a goal to track your essence</p>
                </div>
              </div>
            )}

            {/* Goal Input - Stacked & Centered */}
            <div className="flex flex-col items-center justify-center mt-6 mb-6">
              <label className="text-xs uppercase tracking-widest text-zinc-500 mb-2">Word Goal</label>
              <input
                type="number"
                value={activeDocument.wordGoal || ''}
                onChange={(e) => {
                  const goal = parseInt(e.target.value) || 0;
                  onUpdateWordGoal(goal);
                }}
                placeholder="0"
                className="text-4xl font-serif text-zinc-500 text-center w-full bg-transparent focus:outline-none focus:text-zinc-300 transition-colors caret-purple-400"
              />
            </div>
          </div>

          {/* Ornamental Divider */}
          <div className="altar-divider mx-5 my-2" />

          {/* Synopsis - Sacred Scroll */}
          <div className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Icon icon="solar:document-bold" className="size-4 text-zinc-500" />
              <span className="text-xs text-zinc-500 uppercase tracking-wider">Sacred Scroll</span>
            </div>

            <Textarea
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
              onBlur={() => onUpdateSynopsis(synopsis)}
              placeholder="Notes and whispers..."
              className="w-full h-32 bg-black/30 border border-white/5 rounded p-4 text-sm italic text-zinc-500 leading-relaxed resize-none focus:ring-1 focus:ring-purple-500 focus:outline-none placeholder:text-zinc-700 caret-purple-400"
            />
          </div>

          {/* Ornamental Divider */}
          <div className="altar-divider mx-5 my-2" />
        </div>
      )}

      {/* Bottom Section - The Oracle (Tabbed View) - Only show when document is selected */}
      {activeDocument && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tab Navigation - Ghost Style */}
          <div className="flex-none p-5">
          <div className="flex gap-8 justify-center">
            <button
              onClick={() => setActiveTab('characters')}
              className="flex items-center gap-2 group cursor-pointer"
            >
              <Icon 
                icon="solar:users-group-rounded-bold" 
                className={clsx(
                  'w-5 h-5 transition-all',
                  activeTab === 'characters'
                    ? 'text-purple-400'
                    : 'text-purple-500 group-hover:text-purple-400 group-hover:scale-110'
                )}
              />
              <span className={clsx(
                'text-xs font-serif uppercase tracking-widest transition-all',
                activeTab === 'characters'
                  ? 'text-zinc-200 border-b border-purple-500'
                  : 'text-zinc-400 border-b border-transparent group-hover:text-zinc-200 group-hover:border-purple-500'
              )}>
                Cast
              </span>
            </button>
            <button
              onClick={() => setActiveTab('research')}
              className="flex items-center gap-2 group cursor-pointer"
            >
              <Icon 
                icon="solar:book-bookmark-bold" 
                className={clsx(
                  'w-5 h-5 transition-all',
                  activeTab === 'research'
                    ? 'text-purple-400'
                    : 'text-purple-500 group-hover:text-purple-400 group-hover:scale-110'
                )}
              />
              <span className={clsx(
                'text-xs font-serif uppercase tracking-widest transition-all',
                activeTab === 'research'
                  ? 'text-zinc-200 border-b border-purple-500'
                  : 'text-zinc-400 border-b border-transparent group-hover:text-zinc-200 group-hover:border-purple-500'
              )}>
                Lore
              </span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 grimoire-scroll">
          {activeTab === 'characters' ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <Icon icon="solar:users-group-rounded-bold" className="size-5 text-purple-400" />
                <h3 className="font-['Playfair_Display'] text-base font-bold text-stone-100 uppercase">
                  Characters
                </h3>
              </div>

              {characters.length === 0 && (
                <div className="text-center py-8 text-sm">
                  <Icon icon="solar:user-bold" className="size-12 mx-auto text-zinc-500 mb-2" />
                  <p className="font-['Playfair_Display'] italic text-zinc-500">No characters yet</p>
                </div>
              )}

              {characters.map((character) => (
                <div
                  key={character.id}
                  className="plaque-card p-3 rounded group"
                >
                  {editingCharId === character.id ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        defaultValue={character.name}
                        placeholder="Character name"
                        className="w-full px-2 py-1 bg-stone-800 border border-stone-700 rounded text-sm text-stone-200 focus:ring-1 focus:ring-orange-500 focus:outline-none"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const name = e.currentTarget.value;
                            const description = e.currentTarget.nextElementSibling as HTMLInputElement;
                            onUpdateCharacter(character.id, name, description.value);
                            setEditingCharId(null);
                          } else if (e.key === 'Escape') {
                            setEditingCharId(null);
                          }
                        }}
                        autoFocus
                      />
                      <input
                        type="text"
                        defaultValue={character.description}
                        placeholder="Description"
                        className="w-full px-2 py-1 bg-stone-800 border border-stone-700 rounded text-xs text-stone-400 focus:ring-1 focus:ring-orange-500 focus:outline-none font-mono"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const description = e.currentTarget.value;
                            const name = e.currentTarget.previousElementSibling as HTMLInputElement;
                            onUpdateCharacter(character.id, name.value, description);
                            setEditingCharId(null);
                          } else if (e.key === 'Escape') {
                            setEditingCharId(null);
                          }
                        }}
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setEditingCharId(null)}
                          className="px-2 py-1 text-xs text-stone-500 hover:text-stone-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="text-sm font-['Playfair_Display'] font-bold text-stone-200">
                          {character.name}
                        </h4>
                        <p className="text-xs text-stone-500 font-mono mt-1">
                          {character.description}
                        </p>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setEditingCharId(character.id)}
                          className="p-1 text-stone-600 hover:text-orange-400"
                        >
                          <Icon icon="solar:pen-bold" className="size-3" />
                        </button>
                        <button
                          onClick={() => onDeleteCharacter(character.id)}
                          className="p-1 text-stone-600 hover:text-red-400"
                        >
                          <Icon icon="solar:trash-bin-trash-bold" className="size-3" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Add Character Form */}
              {activeDocument && showAddCharModal && (
                <div className="p-4 bg-stone-900 border-2 border-orange-500/30 rounded-lg space-y-3 shadow-lg shadow-orange-500/10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon icon="solar:user-bold" className="size-4 text-orange-400" />
                      <h4 className="font-['Playfair_Display'] text-sm font-bold text-stone-200 uppercase">
                        Summon Character
                      </h4>
                    </div>
                    <button
                      onClick={() => {
                        setShowAddCharModal(false);
                        setNewCharName('');
                        setNewCharDesc('');
                      }}
                      className="text-stone-600 hover:text-stone-400"
                    >
                      <Icon icon="solar:close-circle-bold" className="size-4" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={newCharName}
                    onChange={(e) => setNewCharName(e.target.value)}
                    placeholder="Character name..."
                    className="w-full px-3 py-2 bg-stone-800/50 border border-stone-700 rounded text-sm text-stone-200 focus:ring-2 focus:ring-orange-500 focus:outline-none font-['Playfair_Display'] placeholder:text-stone-600"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newCharName.trim()) {
                        onAddCharacter(newCharName, newCharDesc);
                        setShowAddCharModal(false);
                        setNewCharName('');
                        setNewCharDesc('');
                      } else if (e.key === 'Escape') {
                        setShowAddCharModal(false);
                        setNewCharName('');
                        setNewCharDesc('');
                      }
                    }}
                  />
                  <textarea
                    value={newCharDesc}
                    onChange={(e) => setNewCharDesc(e.target.value)}
                    placeholder="Description or role..."
                    className="w-full px-3 py-2 bg-stone-800/50 border border-stone-700 rounded text-xs text-stone-400 focus:ring-2 focus:ring-orange-500 focus:outline-none font-mono placeholder:text-stone-600 resize-none"
                    rows={2}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.ctrlKey && newCharName.trim()) {
                        onAddCharacter(newCharName, newCharDesc);
                        setShowAddCharModal(false);
                        setNewCharName('');
                        setNewCharDesc('');
                      } else if (e.key === 'Escape') {
                        setShowAddCharModal(false);
                        setNewCharName('');
                        setNewCharDesc('');
                      }
                    }}
                  />
                  <div className="flex gap-2 justify-end pt-1">
                    <button
                      onClick={() => {
                        setShowAddCharModal(false);
                        setNewCharName('');
                        setNewCharDesc('');
                      }}
                      className="px-3 py-1.5 text-xs text-stone-500 hover:text-stone-300 font-mono uppercase"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        if (newCharName.trim()) {
                          onAddCharacter(newCharName, newCharDesc);
                          setShowAddCharModal(false);
                          setNewCharName('');
                          setNewCharDesc('');
                        }
                      }}
                      disabled={!newCharName.trim()}
                      className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 disabled:bg-stone-800 disabled:text-stone-600 text-stone-950 text-xs font-mono uppercase rounded transition-colors"
                    >
                      Summon
                    </button>
                  </div>
                </div>
              )}

              {/* Add Character Button */}
              {activeDocument && !showAddCharModal && (
                <button
                  onClick={() => setShowAddCharModal(true)}
                  className="flex items-center justify-center gap-2 text-zinc-500 hover:text-zinc-200 transition-colors py-4 uppercase tracking-widest text-xs"
                >
                  <Icon icon="solar:add-circle-bold" className="size-3" />
                  <span>Add Character</span>
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <Icon icon="solar:book-bookmark-bold" className="size-5 text-purple-400" />
                <h3 className="font-['Playfair_Display'] text-base font-bold text-stone-100 uppercase">
                  Research
                </h3>
              </div>

              {research.length === 0 && (
                <div className="text-center py-8 text-sm">
                  <Icon icon="solar:book-bookmark-bold" className="size-12 mx-auto text-zinc-500 mb-2" />
                  <p className="font-['Playfair_Display'] italic text-zinc-500">No research yet</p>
                </div>
              )}

              {research.map((item) => (
                <div
                  key={item.id}
                  className="plaque-card p-3 rounded group"
                >
                  {editingResearchId === item.id ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        defaultValue={item.title}
                        placeholder="Title"
                        className="w-full px-2 py-1 bg-stone-800 border border-stone-700 rounded text-sm text-stone-200 focus:ring-1 focus:ring-orange-500 focus:outline-none"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const title = e.currentTarget.value;
                            const url = e.currentTarget.nextElementSibling as HTMLInputElement;
                            onUpdateResearch(item.id, title, url.value);
                            setEditingResearchId(null);
                          } else if (e.key === 'Escape') {
                            setEditingResearchId(null);
                          }
                        }}
                        autoFocus
                      />
                      <input
                        type="text"
                        defaultValue={item.url}
                        placeholder="URL"
                        className="w-full px-2 py-1 bg-stone-800 border border-stone-700 rounded text-xs text-stone-400 focus:ring-1 focus:ring-orange-500 focus:outline-none font-mono"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const url = e.currentTarget.value;
                            const title = e.currentTarget.previousElementSibling as HTMLInputElement;
                            onUpdateResearch(item.id, title.value, url);
                            setEditingResearchId(null);
                          } else if (e.key === 'Escape') {
                            setEditingResearchId(null);
                          }
                        }}
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setEditingResearchId(null)}
                          className="px-2 py-1 text-xs text-stone-500 hover:text-stone-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-2">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 flex-1 min-w-0"
                        onClick={(e) => {
                          if (!item.url || item.url === '#') {
                            e.preventDefault();
                          }
                        }}
                      >
                        <Icon icon="solar:link-bold" className="size-4 text-stone-600 flex-shrink-0" />
                        <span className="text-sm text-stone-300 font-['Playfair_Display'] truncate">
                          {item.title}
                        </span>
                        {item.url && item.url !== '#' && (
                          <Icon icon="solar:arrow-right-bold" className="size-3 text-stone-600 group-hover:text-orange-400 transition-colors flex-shrink-0" />
                        )}
                      </a>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setEditingResearchId(item.id)}
                          className="p-1 text-stone-600 hover:text-orange-400"
                        >
                          <Icon icon="solar:pen-bold" className="size-3" />
                        </button>
                        <button
                          onClick={() => onDeleteResearch(item.id)}
                          className="p-1 text-stone-600 hover:text-red-400"
                        >
                          <Icon icon="solar:trash-bin-trash-bold" className="size-3" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Add Research Form */}
              {activeDocument && showAddResearchModal && (
                <div className="p-4 bg-stone-900 border-2 border-orange-500/30 rounded-lg space-y-3 shadow-lg shadow-orange-500/10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon icon="solar:book-bookmark-bold" className="size-4 text-orange-400" />
                      <h4 className="font-['Playfair_Display'] text-sm font-bold text-stone-200 uppercase">
                        Archive Knowledge
                      </h4>
                    </div>
                    <button
                      onClick={() => {
                        setShowAddResearchModal(false);
                        setNewResearchTitle('');
                        setNewResearchUrl('');
                      }}
                      className="text-stone-600 hover:text-stone-400"
                    >
                      <Icon icon="solar:close-circle-bold" className="size-4" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={newResearchTitle}
                    onChange={(e) => setNewResearchTitle(e.target.value)}
                    placeholder="Reference title..."
                    className="w-full px-3 py-2 bg-stone-800/50 border border-stone-700 rounded text-sm text-stone-200 focus:ring-2 focus:ring-orange-500 focus:outline-none font-['Playfair_Display'] placeholder:text-stone-600"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newResearchTitle.trim()) {
                        onAddResearch(newResearchTitle, newResearchUrl);
                        setShowAddResearchModal(false);
                        setNewResearchTitle('');
                        setNewResearchUrl('');
                      } else if (e.key === 'Escape') {
                        setShowAddResearchModal(false);
                        setNewResearchTitle('');
                        setNewResearchUrl('');
                      }
                    }}
                  />
                  <input
                    type="text"
                    value={newResearchUrl}
                    onChange={(e) => setNewResearchUrl(e.target.value)}
                    placeholder="URL (optional)..."
                    className="w-full px-3 py-2 bg-stone-800/50 border border-stone-700 rounded text-xs text-stone-400 focus:ring-2 focus:ring-orange-500 focus:outline-none font-mono placeholder:text-stone-600"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newResearchTitle.trim()) {
                        onAddResearch(newResearchTitle, newResearchUrl);
                        setShowAddResearchModal(false);
                        setNewResearchTitle('');
                        setNewResearchUrl('');
                      } else if (e.key === 'Escape') {
                        setShowAddResearchModal(false);
                        setNewResearchTitle('');
                        setNewResearchUrl('');
                      }
                    }}
                  />
                  <div className="flex gap-2 justify-end pt-1">
                    <button
                      onClick={() => {
                        setShowAddResearchModal(false);
                        setNewResearchTitle('');
                        setNewResearchUrl('');
                      }}
                      className="px-3 py-1.5 text-xs text-stone-500 hover:text-stone-300 font-mono uppercase"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        if (newResearchTitle.trim()) {
                          onAddResearch(newResearchTitle, newResearchUrl);
                          setShowAddResearchModal(false);
                          setNewResearchTitle('');
                          setNewResearchUrl('');
                        }
                      }}
                      disabled={!newResearchTitle.trim()}
                      className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 disabled:bg-stone-800 disabled:text-stone-600 text-stone-950 text-xs font-mono uppercase rounded transition-colors"
                    >
                      Archive
                    </button>
                  </div>
                </div>
              )}

              {/* Add Research Button */}
              {activeDocument && !showAddResearchModal && (
                <button
                  onClick={() => setShowAddResearchModal(true)}
                  className="flex items-center justify-center gap-2 text-zinc-500 hover:text-zinc-200 transition-colors py-4 uppercase tracking-widest text-xs"
                >
                  <Icon icon="solar:add-circle-bold" className="size-3" />
                  <span>Add Reference</span>
                </button>
              )}
            </div>
          )}
        </div>
        </div>
      )}
    </div>
  );
}

/**
 * FearAnthologyPanel
 * Searchable database of horror tropes, creatures, and techniques
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FEAR_ANTHOLOGY_DATA,
    FEAR_CATEGORIES,
    searchEntries,
    getEntriesByCategory,
} from '../../data/fearAnthology';
import type { FearAnthologyEntry, FearCategory } from '../../types/epitaph';

interface FearAnthologyPanelProps {
    isOpen: boolean;
    onClose: () => void;
    onInsertTechnique?: (text: string) => void;
}

export function FearAnthologyPanel({ isOpen, onClose, onInsertTechnique }: FearAnthologyPanelProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedEntry, setSelectedEntry] = useState<FearAnthologyEntry | null>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'examples' | 'subversions'>('overview');

    // Filter entries based on search and category
    const filteredEntries = useMemo(() => {
        let results = FEAR_ANTHOLOGY_DATA;

        if (searchQuery.trim()) {
            results = searchEntries(searchQuery);
        }

        if (selectedCategory) {
            results = results.filter(e => e.category === selectedCategory);
        }

        return results;
    }, [searchQuery, selectedCategory]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 300 }}
                className="fixed right-0 top-0 bottom-0 w-[480px] bg-zinc-900/98 backdrop-blur-lg border-l border-zinc-700 z-50 flex flex-col"
            >
                {/* Header */}
                <div className="p-4 border-b border-zinc-800">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">📚</span>
                            <h2 className="text-lg font-semibold text-zinc-100">Fear Anthology™</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-zinc-400 hover:text-zinc-100 transition-colors p-1"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search tropes, creatures, techniques..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-amber-500/50 focus:outline-none"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">🔍</span>
                    </div>
                </div>

                {/* Categories */}
                <div className="p-3 border-b border-zinc-800 overflow-x-auto">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`px-3 py-1.5 text-xs rounded-full whitespace-nowrap transition-colors ${!selectedCategory
                                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
                                    : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                                }`}
                        >
                            All ({FEAR_ANTHOLOGY_DATA.length})
                        </button>
                        {FEAR_CATEGORIES.filter(c => c.count > 0).map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id === selectedCategory ? null : cat.id)}
                                className={`px-3 py-1.5 text-xs rounded-full whitespace-nowrap transition-colors flex items-center gap-1 ${selectedCategory === cat.id
                                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
                                        : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                                    }`}
                            >
                                <span>{cat.icon}</span>
                                <span>{cat.name}</span>
                                <span className="text-zinc-600">({cat.count})</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden flex">
                    {/* Entry List */}
                    <div className="w-48 border-r border-zinc-800 overflow-y-auto">
                        {filteredEntries.length === 0 ? (
                            <div className="p-4 text-center text-zinc-500 text-sm">
                                No entries found
                            </div>
                        ) : (
                            filteredEntries.map((entry) => (
                                <button
                                    key={entry.id}
                                    onClick={() => setSelectedEntry(entry)}
                                    className={`w-full text-left p-3 border-b border-zinc-800/50 transition-colors ${selectedEntry?.id === entry.id
                                            ? 'bg-zinc-800 border-l-2 border-l-amber-500'
                                            : 'hover:bg-zinc-800/50'
                                        }`}
                                >
                                    <div className="text-sm font-medium text-zinc-200 truncate">
                                        {entry.name}
                                    </div>
                                    <div className="text-xs text-zinc-500 capitalize">
                                        {entry.category.replace('_', ' ')}
                                    </div>
                                </button>
                            ))
                        )}
                    </div>

                    {/* Entry Detail */}
                    <div className="flex-1 overflow-y-auto">
                        {selectedEntry ? (
                            <EntryDetail
                                entry={selectedEntry}
                                activeTab={activeTab}
                                onTabChange={setActiveTab}
                                onInsert={onInsertTechnique}
                            />
                        ) : (
                            <div className="h-full flex items-center justify-center text-zinc-500 text-sm">
                                <div className="text-center p-8">
                                    <span className="text-4xl mb-3 block">👻</span>
                                    <p>Select an entry to explore</p>
                                    <p className="text-xs mt-2">horror tropes, creatures, and techniques</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}

// =============================================================================
// ENTRY DETAIL COMPONENT
// =============================================================================

interface EntryDetailProps {
    entry: FearAnthologyEntry;
    activeTab: 'overview' | 'examples' | 'subversions';
    onTabChange: (tab: 'overview' | 'examples' | 'subversions') => void;
    onInsert?: (text: string) => void;
}

function EntryDetail({ entry, activeTab, onTabChange, onInsert }: EntryDetailProps) {
    const categoryIcon = FEAR_CATEGORIES.find(c => c.id === entry.category)?.icon || '📖';

    return (
        <div className="p-4">
            {/* Header */}
            <div className="mb-4">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{categoryIcon}</span>
                    <h3 className="text-lg font-semibold text-zinc-100">{entry.name}</h3>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                    {entry.tags.slice(0, 5).map((tag) => (
                        <span
                            key={tag}
                            className="px-2 py-0.5 text-xs bg-zinc-800 text-zinc-400 rounded-full"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-zinc-800 rounded-lg p-1 mb-4">
                {(['overview', 'examples', 'subversions'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => onTabChange(tab)}
                        className={`flex-1 px-3 py-1.5 text-xs rounded-md transition-colors capitalize ${activeTab === tab
                                ? 'bg-zinc-700 text-zinc-100'
                                : 'text-zinc-400 hover:text-zinc-200'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="space-y-4">
                {activeTab === 'overview' && (
                    <>
                        <Section title="Description">
                            <p className="text-sm text-zinc-300 leading-relaxed">{entry.description}</p>
                        </Section>

                        <Section title="Origins">
                            <p className="text-sm text-zinc-400 leading-relaxed">{entry.origins}</p>
                        </Section>

                        <Section title="Tension Pattern">
                            <div className="flex items-center gap-2">
                                <span className="text-amber-400 text-sm font-medium capitalize">
                                    {entry.tensionPattern.replace('_', ' ')}
                                </span>
                                <span className="text-xs text-zinc-500">arc style</span>
                            </div>
                        </Section>

                        {entry.combinations.length > 0 && (
                            <Section title="Pairs Well With">
                                <div className="flex flex-wrap gap-2">
                                    {entry.combinations.map((id) => {
                                        const related = FEAR_ANTHOLOGY_DATA.find(e => e.id === id);
                                        return related ? (
                                            <span
                                                key={id}
                                                className="px-2 py-1 text-xs bg-purple-500/20 text-purple-300 rounded border border-purple-500/30"
                                            >
                                                {related.name}
                                            </span>
                                        ) : null;
                                    })}
                                </div>
                            </Section>
                        )}
                    </>
                )}

                {activeTab === 'examples' && (
                    <div className="space-y-4">
                        {entry.examples.map((example, idx) => (
                            <div key={idx} className="p-3 bg-zinc-800/50 rounded-lg">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <span className="text-sm font-medium text-zinc-200 italic">
                                            {example.title}
                                        </span>
                                        <span className="text-zinc-500 text-sm"> — {example.author}</span>
                                    </div>
                                    <span className="text-xs text-zinc-600">{example.year}</span>
                                </div>

                                {example.quote && (
                                    <blockquote className="text-sm text-amber-400/80 italic border-l-2 border-amber-500/50 pl-3 my-2">
                                        "{example.quote}"
                                    </blockquote>
                                )}

                                <p className="text-xs text-zinc-400 mt-2">{example.analysis}</p>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'subversions' && (
                    <div className="space-y-3">
                        <p className="text-xs text-zinc-500 mb-3">
                            Ways to subvert reader expectations and avoid clichés:
                        </p>

                        {entry.subversions.map((sub, idx) => (
                            <div
                                key={idx}
                                className={`p-3 rounded-lg border ${sub.difficultyLevel === 'beginner'
                                        ? 'border-green-500/30 bg-green-500/10'
                                        : sub.difficultyLevel === 'intermediate'
                                            ? 'border-amber-500/30 bg-amber-500/10'
                                            : 'border-red-500/30 bg-red-500/10'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-sm font-medium text-zinc-200">{sub.concept}</h4>
                                    <span className={`text-xs px-2 py-0.5 rounded capitalize ${sub.difficultyLevel === 'beginner'
                                            ? 'bg-green-500/20 text-green-400'
                                            : sub.difficultyLevel === 'intermediate'
                                                ? 'bg-amber-500/20 text-amber-400'
                                                : 'bg-red-500/20 text-red-400'
                                        }`}>
                                        {sub.difficultyLevel}
                                    </span>
                                </div>
                                <p className="text-xs text-zinc-400">{sub.example}</p>

                                {onInsert && (
                                    <button
                                        onClick={() => onInsert(`Subversion idea: ${sub.concept}`)}
                                        className="mt-2 text-xs text-amber-400 hover:text-amber-300 transition-colors"
                                    >
                                        + Add to notes
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div>
            <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-2">
                {title}
            </h4>
            {children}
        </div>
    );
}

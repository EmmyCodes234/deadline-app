/**
 * SeanceChamberPanel
 * Horror craft coaching AI interface
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { generateCoachingResponse, HORROR_TECHNIQUES } from '../../lib/seanceChamber';
import type {
    SeanceQuery,
    SeanceResponse,
    WriterGoal,
    SeanceContext,
} from '../../types/epitaph';
import { useEpitaph } from '../../contexts/EpitaphContext';

interface SeanceChamberPanelProps {
    isOpen: boolean;
    onClose: () => void;
    documentContent?: string;
    selectedText?: string;
    documentWordCount?: number;
}

const WRITER_GOALS: { id: WriterGoal; label: string; icon: string }[] = [
    { id: 'increase_tension', label: 'Increase Tension', icon: '📈' },
    { id: 'improve_atmosphere', label: 'Improve Atmosphere', icon: '🌫️' },
    { id: 'fix_pacing', label: 'Fix Pacing', icon: '⏱️' },
    { id: 'deepen_character', label: 'Deepen Character', icon: '🎭' },
    { id: 'subvert_trope', label: 'Subvert a Trope', icon: '🔄' },
    { id: 'research_accuracy', label: 'Research Help', icon: '📚' },
    { id: 'general_craft', label: 'General Craft', icon: '✍️' },
];

export function SeanceChamberPanel({
    isOpen,
    onClose,
    documentContent = '',
    selectedText = '',
    documentWordCount = 0,
}: SeanceChamberPanelProps) {
    const { canUseSeance, seanceQueriesRemaining, useSeanceQuery, state } = useEpitaph();

    const [question, setQuestion] = useState('');
    const [selectedGoal, setSelectedGoal] = useState<WriterGoal>('general_craft');
    const [conversation, setConversation] = useState<(SeanceQuery | SeanceResponse)[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showTechniques, setShowTechniques] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [conversation]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const handleSubmit = async () => {
        if (!question.trim() || isLoading) return;

        // Check if user can use Séance
        if (!canUseSeance) {
            alert('You\'ve reached your daily Séance limit. Upgrade to Master tier for unlimited queries.');
            return;
        }

        // Track usage
        useSeanceQuery();

        const context: SeanceContext = {
            documentWordCount,
            genre: 'horror', // Could be made dynamic
            currentChapter: null,
            writerGoal: selectedGoal,
        };

        const query: SeanceQuery = {
            id: uuidv4(),
            documentId: null,
            selectedText: selectedText || null,
            question: question.trim(),
            context,
            timestamp: Date.now(),
        };

        setConversation(prev => [...prev, query]);
        setQuestion('');
        setIsLoading(true);

        try {
            // Get API key from environment
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

            if (!apiKey) {
                // Fallback response if no API key
                const fallbackResponse: SeanceResponse = {
                    id: uuidv4(),
                    queryId: query.id,
                    coachingType: 'technique_suggestion',
                    content: 'The Séance Chamber requires an API key to connect. Please configure VITE_GEMINI_API_KEY in your environment.\n\nIn the meantime, explore the Techniques panel below for horror craft advice.',
                    literaryReferences: [],
                    suggestedTechniques: HORROR_TECHNIQUES.tension?.slice(0, 2) || [],
                    followUpQuestions: ['What technique would you like to learn about?'],
                    timestamp: Date.now(),
                };
                setConversation(prev => [...prev, fallbackResponse]);
            } else {
                const response = await generateCoachingResponse(query, apiKey);
                setConversation(prev => [...prev, response]);
            }
        } catch (error) {
            console.error('Séance error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 300 }}
                className="fixed right-0 top-0 bottom-0 w-[420px] bg-zinc-900/98 backdrop-blur-lg border-l border-zinc-700 z-50 flex flex-col"
            >
                {/* Header */}
                <div className="p-4 border-b border-zinc-800">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">🔮</span>
                            <div>
                                <h2 className="text-lg font-semibold text-zinc-100">Séance Chamber™</h2>
                                <p className="text-xs text-zinc-500">Horror craft coaching • Never generates text</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-zinc-400 hover:text-zinc-100 transition-colors p-1"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Goal selector */}
                    <div className="flex flex-wrap gap-1.5">
                        {WRITER_GOALS.map((goal) => (
                            <button
                                key={goal.id}
                                onClick={() => setSelectedGoal(goal.id)}
                                className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 transition-colors ${selectedGoal === goal.id
                                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50'
                                        : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                                    }`}
                            >
                                <span>{goal.icon}</span>
                                <span>{goal.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Selected Text Preview */}
                {selectedText && (
                    <div className="px-4 py-2 bg-zinc-800/50 border-b border-zinc-800">
                        <div className="text-xs text-zinc-500 mb-1">Asking about:</div>
                        <div className="text-sm text-zinc-300 italic line-clamp-2">"{selectedText}"</div>
                    </div>
                )}

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {conversation.length === 0 ? (
                        <EmptyState onShowTechniques={() => setShowTechniques(true)} />
                    ) : (
                        conversation.map((item, idx) => (
                            'question' in item ? (
                                <QueryBubble key={idx} query={item} />
                            ) : (
                                <ResponseBubble key={idx} response={item} />
                            )
                        ))
                    )}

                    {isLoading && (
                        <div className="flex items-center gap-2 text-zinc-400 text-sm">
                            <span className="animate-pulse">🔮</span>
                            <span>Channeling the spirits...</span>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Techniques Quick Access */}
                {showTechniques && (
                    <TechniquesDrawer onClose={() => setShowTechniques(false)} />
                )}

                {/* Input */}
                <div className="p-4 border-t border-zinc-800">
                    {/* Query limit indicator */}
                    {seanceQueriesRemaining !== Infinity && (
                        <div className="text-xs text-zinc-500 mb-2 flex justify-between">
                            <span>Queries remaining today: {seanceQueriesRemaining}</span>
                            {!canUseSeance && (
                                <button className="text-purple-400 hover:underline">Upgrade</button>
                            )}
                        </div>
                    )}

                    <div className="flex gap-2">
                        <textarea
                            ref={inputRef}
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask about horror craft techniques..."
                            rows={2}
                            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 resize-none focus:border-purple-500/50 focus:outline-none"
                            disabled={!canUseSeance}
                        />
                        <button
                            onClick={handleSubmit}
                            disabled={!question.trim() || isLoading || !canUseSeance}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white rounded-lg transition-colors text-sm font-medium"
                        >
                            Ask
                        </button>
                    </div>

                    <button
                        onClick={() => setShowTechniques(!showTechniques)}
                        className="mt-2 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
                    >
                        {showTechniques ? '▲ Hide' : '▼ Browse'} Techniques Library
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

function EmptyState({ onShowTechniques }: { onShowTechniques: () => void }) {
    return (
        <div className="h-full flex items-center justify-center">
            <div className="text-center p-8 max-w-xs">
                <span className="text-5xl mb-4 block">🔮</span>
                <h3 className="text-zinc-200 font-medium mb-2">Welcome to the Séance</h3>
                <p className="text-sm text-zinc-400 mb-4">
                    Ask questions about horror writing craft. I'll provide techniques, examples,
                    and guidance—but I'll never write your story for you.
                </p>
                <div className="space-y-2 text-sm text-left">
                    <p className="text-zinc-500">Try asking:</p>
                    <button className="w-full text-left p-2 bg-zinc-800/50 rounded text-zinc-300 hover:bg-zinc-800 transition-colors">
                        "How do I build tension in a slow-burn scene?"
                    </button>
                    <button className="w-full text-left p-2 bg-zinc-800/50 rounded text-zinc-300 hover:bg-zinc-800 transition-colors">
                        "My monster reveal feels flat. What am I doing wrong?"
                    </button>
                    <button className="w-full text-left p-2 bg-zinc-800/50 rounded text-zinc-300 hover:bg-zinc-800 transition-colors">
                        "How did Shirley Jackson create atmosphere?"
                    </button>
                </div>
                <button
                    onClick={onShowTechniques}
                    className="mt-4 text-sm text-purple-400 hover:text-purple-300 transition-colors"
                >
                    Or browse the Techniques Library →
                </button>
            </div>
        </div>
    );
}

function QueryBubble({ query }: { query: SeanceQuery }) {
    return (
        <div className="flex justify-end">
            <div className="max-w-[80%] bg-purple-600/20 border border-purple-500/30 rounded-lg p-3">
                <p className="text-sm text-zinc-200">{query.question}</p>
                {query.selectedText && (
                    <p className="text-xs text-zinc-400 mt-1 italic">
                        Re: "{query.selectedText.slice(0, 50)}..."
                    </p>
                )}
            </div>
        </div>
    );
}

function ResponseBubble({ response }: { response: SeanceResponse }) {
    return (
        <div className="space-y-3">
            <div className="bg-zinc-800/50 rounded-lg p-4">
                <p className="text-sm text-zinc-200 whitespace-pre-wrap leading-relaxed">
                    {response.content}
                </p>
            </div>

            {/* Techniques */}
            {response.suggestedTechniques.length > 0 && (
                <div className="pl-4 border-l-2 border-amber-500/50">
                    <div className="text-xs text-amber-400 mb-2">Suggested Techniques:</div>
                    {response.suggestedTechniques.map((tech, idx) => (
                        <div key={idx} className="mb-2 p-2 bg-amber-500/10 rounded text-xs">
                            <div className="font-medium text-zinc-200">{tech.name}</div>
                            <p className="text-zinc-400 mt-1">{tech.description}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Follow-ups */}
            {response.followUpQuestions.length > 0 && (
                <div className="text-xs text-zinc-500">
                    <span className="text-zinc-400">You might also ask: </span>
                    {response.followUpQuestions.slice(0, 2).join(' • ')}
                </div>
            )}
        </div>
    );
}

function TechniquesDrawer({ onClose }: { onClose: () => void }) {
    const categories = Object.keys(HORROR_TECHNIQUES);
    const [selectedCat, setSelectedCat] = useState(categories[0]);

    return (
        <div className="border-t border-zinc-800 bg-zinc-900/95 max-h-64 overflow-y-auto">
            <div className="p-3 border-b border-zinc-800 flex justify-between items-center sticky top-0 bg-zinc-900">
                <span className="text-sm font-medium text-zinc-200">Techniques Library</span>
                <button onClick={onClose} className="text-xs text-zinc-400 hover:text-zinc-200">Close</button>
            </div>

            <div className="flex">
                <div className="w-24 border-r border-zinc-800 p-2">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCat(cat)}
                            className={`w-full text-left px-2 py-1 text-xs rounded capitalize ${selectedCat === cat ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="flex-1 p-3 space-y-2">
                    {HORROR_TECHNIQUES[selectedCat]?.map((tech, idx) => (
                        <div key={idx} className="p-2 bg-zinc-800/50 rounded">
                            <div className="text-sm font-medium text-zinc-200">{tech.name}</div>
                            <p className="text-xs text-zinc-400 mt-1">{tech.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

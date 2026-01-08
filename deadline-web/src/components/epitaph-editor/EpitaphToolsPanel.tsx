/**
 * EpitaphToolsPanel - The Ritual Chamber
 * Right panel with atmospheric Epitaph feature tabs
 */

import { useState } from 'react';
import { useEpitaph } from '@/contexts/EpitaphContext';
import { X, BarChart2, BookOpen, Sparkles, Lightbulb, Search, ChevronRight, Loader2, BrainCircuit, ScanEye, type LucideIcon } from 'lucide-react';
import { CerebrasService } from '@/lib/cerebras';

interface EpitaphToolsPanelProps {
    isOpen: boolean;
    onClose: () => void;
    documentId: string;
    documentContent: string;
    documentWordCount: number;
    selectedText?: string;
}

type ActiveTool = 'tension' | 'anthology' | 'seance';

export function EpitaphToolsPanel({
    isOpen,
    onClose,
    documentId,
    documentContent,
    documentWordCount,
    selectedText = '',
}: EpitaphToolsPanelProps) {
    const [activeTool, setActiveTool] = useState<ActiveTool>('tension');

    if (!isOpen) return null;

    const tools = [
        { id: 'tension' as const, icon: BarChart2, label: 'Tension', accent: '#fbbf24' },
        { id: 'anthology' as const, icon: BookOpen, label: 'Anthology', accent: '#a78bfa' },
        { id: 'seance' as const, icon: Sparkles, label: 'Séance', accent: '#c084fc' },
    ];

    return (
        <div
            className="h-full flex flex-col"
            style={{
                background: 'linear-gradient(180deg, #0a0a0c 0%, #12121a 100%)',
                borderLeft: '1px solid rgba(148, 163, 184, 0.06)',
            }}
        >
            {/* Tabs Header */}
            <div
                className="flex items-center justify-between p-3"
                style={{
                    borderBottom: '1px solid rgba(148, 163, 184, 0.06)',
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.01) 0%, transparent 100%)',
                }}
            >
                <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
                    {tools.map((tool) => {
                        const Icon = tool.icon;
                        const isActive = activeTool === tool.id;
                        return (
                            <button
                                key={tool.id}
                                onClick={() => setActiveTool(tool.id)}
                                className="flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all duration-200"
                                style={{
                                    background: isActive ? `${tool.accent}15` : 'transparent',
                                    color: isActive ? tool.accent : '#475569',
                                    border: isActive ? `1px solid ${tool.accent}30` : '1px solid transparent',
                                    fontSize: '0.8rem',
                                    fontWeight: 500,
                                    fontFamily: "'Inter', sans-serif",
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                                        e.currentTarget.style.color = '#94a3b8';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.color = '#475569';
                                    }
                                }}
                                title={`${tool.label}™`}
                            >
                                <Icon size={15} />
                                <span className="hidden xl:inline">{tool.label}</span>
                            </button>
                        );
                    })}
                </div>
                <button
                    onClick={onClose}
                    className="p-2 rounded-lg transition-all duration-200"
                    style={{ color: '#475569' }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(220, 38, 38, 0.1)';
                        e.currentTarget.style.color = '#f87171';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#475569';
                    }}
                    title="Close Panel"
                >
                    <X size={16} />
                </button>
            </div>

            {/* Active Tool Content */}
            <div className="flex-1 overflow-hidden">
                {activeTool === 'tension' && (
                    <TensionPanel content={documentContent} />
                )}
                {activeTool === 'anthology' && (
                    <AnthologyPanel documentContent={documentContent} />
                )}
                {activeTool === 'seance' && (
                    <SeancePanel documentContent={documentContent} documentWordCount={documentWordCount} />
                )}
            </div>
        </div>
    );
}

// =============================================================================
// Tension Panel - Pacing Analysis
// =============================================================================
// =============================================================================
// Tension Panel - Pacing Analysis (AI Enhanced)
// =============================================================================
function TensionPanel({ content }: { content: string }) {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiAnalysis, setAiAnalysis] = useState<{ score: number; reasoning: string } | null>(null);

    const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0);

    // Legacy Basic Algo (fallback/real-time)
    const tensionData = paragraphs.slice(0, 20).map((p) => {
        const exclamations = (p.match(/!/g) || []).length;
        const questions = (p.match(/\?/g) || []).length;
        const shortSentences = p.split(/[.!?]/).filter(s => s.trim().length < 30).length;
        const darkWords = (p.match(/\b(dark|shadow|blood|death|fear|horror|scream|terror|whisper|cold|silent|alone)\b/gi) || []).length;
        return Math.min(100, 30 + exclamations * 15 + questions * 10 + shortSentences * 5 + darkWords * 12);
    });

    const basicAvgTension = tensionData.length > 0
        ? tensionData.reduce((a, b) => a + b, 0) / tensionData.length
        : 0;

    const handleDeepAnalysis = async () => {
        setIsAnalyzing(true);
        const result = await CerebrasService.analyzeTension(content);
        setAiAnalysis(result);
        setIsAnalyzing(false);
    };

    return (
        <div className="p-5 space-y-5 overflow-y-auto h-full">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h3
                        className="flex items-center gap-2 mb-1"
                        style={{
                            fontFamily: "'Cinzel', Georgia, serif",
                            fontSize: '0.9rem',
                            fontWeight: 500,
                            color: '#fbbf24',
                            letterSpacing: '0.05em',
                        }}
                    >
                        <BarChart2 size={16} />
                        Tension Curve™
                    </h3>
                    <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {aiAnalysis ? 'AI Deep Analysis Active' : 'Real-time heuristic analysis'}
                    </p>
                </div>
                {!aiAnalysis && (
                    <button
                        onClick={handleDeepAnalysis}
                        disabled={isAnalyzing || content.length < 50}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all duration-200"
                        style={{
                            background: 'rgba(251, 191, 36, 0.1)',
                            color: '#fbbf24',
                            border: '1px solid rgba(251, 191, 36, 0.2)',
                        }}
                    >
                        {isAnalyzing ? <Loader2 size={12} className="animate-spin" /> : <BrainCircuit size={12} />}
                        {isAnalyzing ? 'Analyzing...' : 'Deep Scan'}
                    </button>
                )}
            </div>

            {paragraphs.length === 0 ? (
                <EmptyState
                    icon={BarChart2}
                    message="Start writing to see your tension curve"
                    color="#fbbf24"
                />
            ) : (
                <>
                    {/* Tension Graph */}
                    <div
                        className="h-32 rounded-xl p-4 flex items-end gap-1 relative overflow-hidden"
                        style={{
                            background: 'rgba(0, 0, 0, 0.3)',
                            border: '1px solid rgba(251, 191, 36, 0.1)',
                        }}
                    >
                        {/* AI Overlay Indicator */}
                        {aiAnalysis && (
                            <div className="absolute top-2 right-2 flex items-center gap-1.5 text-[0.65rem] px-2 py-1 rounded bg-black/50 text-[#fbbf24] border border-[#fbbf24]/30">
                                <BrainCircuit size={10} />
                                Llama 3.1 Verified
                            </div>
                        )}

                        {tensionData.map((tension, i) => (
                            <div
                                key={i}
                                className="flex-1 rounded-t transition-all duration-300"
                                style={{
                                    height: `${aiAnalysis ? (tension + aiAnalysis.score) / 2 : tension}%`,
                                    background: `linear-gradient(180deg, #fbbf24 0%, #92400e 100%)`,
                                    opacity: 0.8,
                                    boxShadow: '0 0 8px rgba(251, 191, 36, 0.3)',
                                }}
                                title={`Paragraph ${i + 1}`}
                            />
                        ))}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3">
                        <StatCard
                            value={`${Math.round(aiAnalysis?.score || basicAvgTension)}%`}
                            label={aiAnalysis ? "AI Tension Score" : "Avg Tension"}
                            color="#fbbf24"
                        />
                        <StatCard value={paragraphs.length.toString()} label="Paragraphs" color="#94a3b8" />
                    </div>

                    {/* Reasoning / AI Insight */}
                    {aiAnalysis && (
                        <div
                            className="p-4 rounded-lg animate-in fade-in slide-in-from-bottom-2"
                            style={{
                                background: 'rgba(251, 191, 36, 0.05)',
                                border: '1px solid rgba(251, 191, 36, 0.2)'
                            }}
                        >
                            <div className="flex items-center gap-2 mb-2 text-[#fbbf24] text-xs uppercase tracking-widest font-bold">
                                <BrainCircuit size={12} />
                                Analysis
                            </div>
                            <p style={{ fontSize: '0.85rem', color: '#e2e8f0', lineHeight: 1.6, fontFamily: "'Crimson Text', serif" }}>
                                "{aiAnalysis.reasoning}"
                            </p>
                        </div>
                    )}

                    {/* Tip (Fallback if no AI) */}
                    {!aiAnalysis && (
                        <TipCard
                            color="#fbbf24"
                            message={
                                basicAvgTension < 40
                                    ? "Try shorter sentences and darker imagery to increase tension"
                                    : basicAvgTension > 70
                                        ? "Give readers a breather with calmer moments"
                                        : "Good tension balance! Keep varying the pace"
                            }
                        />
                    )}
                </>
            )}
        </div>
    );
}

// =============================================================================
// Anthology Panel - Horror Tropes (AI Enhanced)
// =============================================================================
function AnthologyPanel({ documentContent }: { documentContent: string }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [detectedTropes, setDetectedTropes] = useState<{ name: string; description: string; subversion: string }[] | null>(null);

    // Actually original AnthologyPanel didn't take props. We need to access content.
    // Parent "EpitaphToolsPanel" has "documentContent" prop. We need to pass it down or use context.
    // Checking parent... Parent passes it to TensionPanel. AnthologyPanel didn't use it before.
    const handleScan = async () => {
        setIsScanning(true);
        const results = await CerebrasService.scanForTropes(documentContent);
        setDetectedTropes(results);
        setIsScanning(false);
    };

    const quickTropes = [
        { name: 'The Haunted House', category: 'Settings', icon: '🏚️' },
        { name: 'Body Horror', category: 'Physical', icon: '🩸' },
        { name: 'Unreliable Narrator', category: 'Psychological', icon: '🎭' },
        { name: 'The Final Girl', category: 'Characters', icon: '👩' },
        { name: 'Cosmic Horror', category: 'Supernatural', icon: '🌀' },
        { name: 'Found Footage', category: 'Format', icon: '📼' },
    ];

    return (
        <div className="p-5 space-y-5 overflow-y-auto h-full">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h3
                        className="flex items-center gap-2 mb-1"
                        style={{
                            fontFamily: "'Cinzel', Georgia, serif",
                            fontSize: '0.9rem',
                            fontWeight: 500,
                            color: '#a78bfa',
                            letterSpacing: '0.05em',
                        }}
                    >
                        <BookOpen size={16} />
                        Fear Anthology™
                    </h3>
                    <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {detectedTropes ? 'Tropes Detected in Text' : 'Horror tropes & subversions'}
                    </p>
                </div>
                {!detectedTropes && (
                    <button
                        onClick={handleScan}
                        disabled={isScanning || documentContent.length < 50}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all duration-200"
                        style={{
                            background: 'rgba(167, 139, 250, 0.1)',
                            color: '#a78bfa',
                            border: '1px solid rgba(167, 139, 250, 0.2)',
                        }}
                    >
                        {isScanning ? <Loader2 size={12} className="animate-spin" /> : <ScanEye size={12} />}
                        {isScanning ? 'Scanning...' : 'Scan Text'}
                    </button>
                )}
            </div>

            {/* Search */}
            <div
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg"
                style={{
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(167, 139, 250, 0.1)',
                }}
            >
                <Search size={16} style={{ color: '#64748b' }} />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tropes..."
                    className="flex-1 bg-transparent outline-none"
                    style={{
                        fontSize: '0.875rem',
                        color: '#f1f5f9',
                        fontFamily: "'Inter', sans-serif",
                    }}
                />
            </div>

            {/* AI Results or Quick Access */}
            {detectedTropes ? (
                <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex items-center gap-2 text-xs text-[#a78bfa] font-bold uppercase tracking-wider mb-2">
                        <ScanEye size={12} />
                        Identified by Cerebras
                    </div>
                    {detectedTropes.map((trope, idx) => (
                        <div
                            key={idx}
                            className="p-4 rounded-lg"
                            style={{
                                background: 'rgba(167, 139, 250, 0.05)',
                                border: '1px solid rgba(167, 139, 250, 0.2)'
                            }}
                        >
                            <h4 className="font-bold text-[#a78bfa] text-sm mb-1">{trope.name}</h4>
                            <p className="text-xs text-[#94a3b8] mb-3 italic">"{trope.description}"</p>

                            <div className="pl-3 border-l-2 border-[#a78bfa]/30">
                                <p className="text-[0.65rem] text-[#a78bfa] uppercase tracking-wider font-bold mb-1">Subversion</p>
                                <p className="text-sm text-[#e2e8f0] font-serif">{trope.subversion}</p>
                            </div>
                        </div>
                    ))}
                    <button
                        onClick={() => setDetectedTropes(null)}
                        className="text-xs text-[#64748b] underline hover:text-[#a78bfa] w-full text-center mt-2"
                    >
                        Clear Analysis
                    </button>
                </div>
            ) : (
                <div>
                    <h4 className="mb-3 text-[0.7rem] text-[#64748b] uppercase tracking-widest font-sans">Popular Tropes</h4>
                    <div className="space-y-1">
                        {quickTropes.map((trope) => (
                            <button
                                key={trope.name}
                                className="w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all duration-200 group"
                                style={{ background: 'rgba(0, 0, 0, 0.2)' }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(167, 139, 250, 0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(0, 0, 0, 0.2)';
                                }}
                            >
                                <span style={{ fontSize: '1.25rem' }}>{trope.icon}</span>
                                <div className="flex-1">
                                    <div style={{ fontSize: '0.875rem', color: '#f1f5f9' }}>{trope.name}</div>
                                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{trope.category}</div>
                                </div>
                                <ChevronRight size={14} style={{ color: '#475569', opacity: 0 }} className="group-hover:!opacity-100" />
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {!detectedTropes && (
                <button
                    className="w-full py-2.5 rounded-lg transition-all duration-200"
                    style={{
                        fontSize: '0.8rem',
                        color: '#a78bfa',
                        border: '1px solid rgba(167, 139, 250, 0.2)',
                        fontFamily: "'Cinzel', Georgia, serif",
                        letterSpacing: '0.05em',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(167, 139, 250, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                    }}
                >
                    Browse Full Anthology →
                </button>
            )}
        </div>
    );
}

// =============================================================================
// Séance Panel - Craft Coaching (AI Enhanced)
// =============================================================================
function SeancePanel({ documentContent, documentWordCount }: { documentContent: string; documentWordCount: number }) {
    const [question, setQuestion] = useState('');
    const [history, setHistory] = useState<{ type: 'user' | 'ai'; text: string }[]>([]);
    const [isThinking, setIsThinking] = useState(false);

    const handleAsk = async () => {
        if (!question.trim()) return;

        const userQ = question;
        setQuestion('');

        // Optimistically update UI
        const newHistory = [...history, { type: 'user' as const, text: userQ }];
        setHistory(newHistory);
        setIsThinking(true);

        // Pass full history including the new user question (which is already in 'newHistory')
        // wait, consultSeance expects history and newQuestion separate? 
        // My definition: consultSeance(context, history, newQuestion)
        // So passed history should NOT include the question being asked right now if I follow standard patterns, 
        // OR I should include it. 
        // Looking at cerebras.ts: 
        // history.forEach... apiMessages.push(msg)
        // apiMessages.push(newQuestion)
        // So 'history' should be the PAST messages.

        const answer = await CerebrasService.consultSeance(documentContent, history, userQ);

        setIsThinking(false);
        setHistory(prev => [...prev, { type: 'ai' as const, text: answer }]);
    };

    const suggestedQuestions = [
        "How can I build tension here?",
        "What's wrong with my pacing?",
        "Help me subvert this trope",
        "How did King handle this?",
    ];

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-5 flex justify-between items-start">
                <div>
                    <h3
                        className="flex items-center gap-2 mb-1"
                        style={{
                            fontFamily: "'Cinzel', Georgia, serif",
                            fontSize: '0.9rem',
                            fontWeight: 500,
                            color: '#c084fc',
                            letterSpacing: '0.05em',
                        }}
                    >
                        <Sparkles size={16} />
                        Séance Chamber™
                    </h3>
                    <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        Horror craft coaching — never writes for you
                    </p>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto px-5 py-2 space-y-4">
                {history.length === 0 ? (
                    <div className="text-center py-8">
                        <div
                            className="text-5xl mb-4"
                            style={{ filter: 'drop-shadow(0 0 20px rgba(192, 132, 252, 0.3))' }}
                        >
                            🔮
                        </div>
                        <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.5rem' }}>
                            Summon guidance from the void.
                        </p>
                        <div className="space-y-2">
                            {suggestedQuestions.map((q) => (
                                <button
                                    key={q}
                                    onClick={() => setQuestion(q)}
                                    className="w-full text-left px-4 py-3 rounded-lg transition-all duration-200"
                                    style={{
                                        background: 'rgba(0, 0, 0, 0.2)',
                                        border: '1px solid rgba(192, 132, 252, 0.1)',
                                        fontSize: '0.8rem',
                                        color: '#94a3b8',
                                        fontStyle: 'italic',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(192, 132, 252, 0.1)';
                                        e.currentTarget.style.color = '#c084fc';
                                        e.currentTarget.style.borderColor = 'rgba(192, 132, 252, 0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(0, 0, 0, 0.2)';
                                        e.currentTarget.style.color = '#94a3b8';
                                        e.currentTarget.style.borderColor = 'rgba(192, 132, 252, 0.1)';
                                    }}
                                >
                                    "{q}"
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4 pb-4">
                        {history.map((msg, i) => (
                            <div
                                key={i}
                                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] p-3 rounded-xl text-sm ${msg.type === 'user'
                                        ? 'bg-[#c084fc]/10 text-[#f3e8ff] border border-[#c084fc]/20 rounded-tr-none'
                                        : 'bg-[#1e1e24] text-[#94a3b8] border border-white/5 rounded-tl-none'
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isThinking && (
                            <div className="flex justify-start">
                                <div className="bg-[#1e1e24] border border-white/5 rounded-xl rounded-tl-none p-3 flex items-center gap-2">
                                    <Loader2 size={14} className="animate-spin text-[#c084fc]" />
                                    <span className="text-xs text-[#64748b]">Consulting the spirits...</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Input */}
            <div
                className="p-4"
                style={{ borderTop: '1px solid rgba(148, 163, 184, 0.06)' }}
            >
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                        placeholder="Ask about horror craft..."
                        className="flex-1 px-4 py-2.5 rounded-lg outline-none transition-all duration-200"
                        style={{
                            background: 'rgba(0, 0, 0, 0.3)',
                            border: '1px solid rgba(192, 132, 252, 0.1)',
                            fontSize: '0.875rem',
                            color: '#f1f5f9',
                            fontFamily: "'Inter', sans-serif",
                        }}
                        onFocus={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(192, 132, 252, 0.4)';
                        }}
                        onBlur={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(192, 132, 252, 0.1)';
                        }}
                    />
                    <button
                        onClick={handleAsk}
                        className="px-5 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center"
                        style={{
                            background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                            color: '#faf5ff',
                            fontSize: '0.875rem',
                            fontFamily: "'Inter', sans-serif",
                            opacity: question.trim() || isThinking ? 1 : 0.5,
                            boxShadow: question.trim() ? '0 4px 15px rgba(124, 58, 237, 0.3)' : 'none',
                        }}
                        disabled={!question.trim() || isThinking}
                    >
                        {isThinking ? <Loader2 size={16} className="animate-spin" /> : 'Ask'}
                    </button>
                </div>
                <p
                    className="text-center mt-3"
                    style={{ fontSize: '0.7rem', color: '#475569' }}
                >
                    Powered by Cerebras Llama 3.1 70b
                </p>
            </div>
        </div>
    );
}

// =============================================================================
// Shared Sub-components
// =============================================================================
function EmptyState({ icon: Icon, message, color }: { icon: LucideIcon; message: string; color: string }) {
    return (
        <div className="text-center py-10">
            <Icon size={40} style={{ margin: '0 auto 1rem', color, opacity: 0.3 }} />
            <p style={{ fontSize: '0.875rem', color: '#64748b' }}>{message}</p>
        </div>
    );
}

function StatCard({ value, label, color }: { value: string; label: string; color: string }) {
    return (
        <div
            className="rounded-lg p-4 text-center"
            style={{
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.03)',
            }}
        >
            <div style={{ fontSize: '1.5rem', fontWeight: 600, color, fontFamily: "'JetBrains Mono', monospace" }}>
                {value}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.25rem' }}>
                {label}
            </div>
        </div>
    );
}

function TipCard({ message, color }: { message: string; color: string }) {
    return (
        <div
            className="flex items-start gap-3 p-4 rounded-lg"
            style={{
                background: `${color}08`,
                border: `1px solid ${color}20`,
            }}
        >
            <Lightbulb size={16} style={{ color, flexShrink: 0, marginTop: '2px' }} />
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5 }}>
                {message}
            </p>
        </div>
    );
}

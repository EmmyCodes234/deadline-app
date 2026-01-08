/**
 * EditorStatusBar - Premium Horror Status Display
 * Bottom bar with atmospheric stats and keyboard hints
 */

import { Clock, Save, Target, Flame, Skull } from 'lucide-react';

interface EditorStatusBarProps {
    wordCount: number;
    characterCount: number;
    goalWordCount?: number;
    isSaving: boolean;
    lastSaved: Date | null;
    tensionLevel?: number;
}

export function EditorStatusBar({
    wordCount,
    characterCount,
    goalWordCount,
    isSaving,
    lastSaved,
    tensionLevel = 0,
}: EditorStatusBarProps) {
    const readingTime = Math.ceil(wordCount / 200);
    const goalProgress = goalWordCount ? Math.min(100, (wordCount / goalWordCount) * 100) : 0;

    const formatLastSaved = (date: Date | null) => {
        if (!date) return 'Never';
        const now = new Date();
        const diff = now.getTime() - date.getTime();

        if (diff < 10000) return 'Just now';
        if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`;
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        return date.toLocaleDateString();
    };

    const getTensionLabel = (level: number) => {
        if (level < 20) return { label: 'Calm', color: '#60a5fa', icon: '○' };
        if (level < 40) return { label: 'Building', color: '#4ade80', icon: '◐' };
        if (level < 60) return { label: 'Rising', color: '#fbbf24', icon: '◑' };
        if (level < 80) return { label: 'High', color: '#f97316', icon: '◕' };
        return { label: 'Peak', color: '#ef4444', icon: '●' };
    };

    const tension = getTensionLabel(tensionLevel);

    return (
        <footer
            className="h-9 flex items-center justify-between px-5 text-xs flex-shrink-0"
            style={{
                background: 'linear-gradient(180deg, #050506 0%, #0a0a0c 100%)',
                borderTop: '1px solid rgba(148, 163, 184, 0.06)',
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                letterSpacing: '0.02em',
            }}
        >
            {/* Left: Stats */}
            <div className="flex items-center gap-5" style={{ color: '#475569' }}>
                {/* Word Count */}
                <div className="flex items-center gap-2">
                    <Flame size={12} style={{ color: '#dc2626' }} />
                    <span>
                        <span style={{ color: '#94a3b8', fontWeight: 500 }}>{wordCount.toLocaleString()}</span>
                        <span style={{ marginLeft: '4px', opacity: 0.7 }}>words</span>
                    </span>
                </div>

                {/* Character Count */}
                <div>
                    <span style={{ color: '#94a3b8', fontWeight: 500 }}>{characterCount.toLocaleString()}</span>
                    <span style={{ marginLeft: '4px', opacity: 0.7 }}>chars</span>
                </div>

                {/* Reading Time */}
                <div className="flex items-center gap-2">
                    <Clock size={12} style={{ opacity: 0.6 }} />
                    <span>
                        <span style={{ color: '#94a3b8', fontWeight: 500 }}>{readingTime}</span>
                        <span style={{ marginLeft: '4px', opacity: 0.7 }}>min read</span>
                    </span>
                </div>

                {/* Tension Indicator */}
                {tensionLevel > 0 && (
                    <div className="flex items-center gap-2">
                        <div
                            className="w-16 h-1 rounded-full overflow-hidden"
                            style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.3)',
                            }}
                            title={`Tension: ${tensionLevel}%`}
                        >
                            <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                    width: `${tensionLevel}%`,
                                    background: `linear-gradient(90deg, ${tension.color}88 0%, ${tension.color} 100%)`,
                                    boxShadow: `0 0 6px ${tension.color}66`,
                                }}
                            />
                        </div>
                        <span style={{ color: tension.color, fontSize: '10px' }}>
                            {tension.icon} {tension.label}
                        </span>
                    </div>
                )}

                {/* Goal Progress */}
                {goalWordCount && (
                    <div className="flex items-center gap-2">
                        <Target size={12} style={{ color: '#fbbf24', opacity: 0.8 }} />
                        <span>
                            <span style={{ color: '#fbbf24', fontWeight: 500 }}>{Math.round(goalProgress)}%</span>
                            <span style={{ marginLeft: '4px', opacity: 0.6 }}>of {goalWordCount.toLocaleString()}</span>
                        </span>
                    </div>
                )}
            </div>

            {/* Right: Shortcuts & Save Status */}
            <div className="flex items-center gap-5" style={{ color: '#334155' }}>
                {/* Keyboard Hints */}
                <div className="hidden md:flex items-center gap-4">
                    <KeyboardHint keys="⌘B" label="Bold" />
                    <KeyboardHint keys="⌘I" label="Italic" />
                </div>

                {/* Save Status */}
                <div className="flex items-center gap-2">
                    {isSaving ? (
                        <>
                            <div
                                className="w-2 h-2 rounded-full animate-pulse"
                                style={{ background: '#fbbf24', boxShadow: '0 0 8px #fbbf24' }}
                            />
                            <span style={{ color: '#fbbf24' }}>Saving...</span>
                        </>
                    ) : (
                        <>
                            <Save size={12} style={{ color: '#22c55e', opacity: 0.8 }} />
                            <span style={{ color: '#22c55e' }}>{formatLastSaved(lastSaved)}</span>
                        </>
                    )}
                </div>
            </div>
        </footer>
    );
}

// Keyboard hint sub-component
function KeyboardHint({ keys, label }: { keys: string; label: string }) {
    return (
        <span className="flex items-center gap-1.5">
            <kbd
                className="px-1.5 py-0.5 rounded text-xs"
                style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(148, 163, 184, 0.1)',
                    color: '#64748b',
                    fontSize: '10px',
                }}
            >
                {keys}
            </kbd>
            <span style={{ opacity: 0.7 }}>{label}</span>
        </span>
    );
}

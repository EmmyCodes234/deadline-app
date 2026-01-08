/**
 * EditorHeader - Premium Horror Navigation
 * Top bar with atmospheric styling and feature buttons
 */

import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, BarChart2, BookOpen, Sparkles, PanelRight, Moon, Feather, type LucideIcon } from 'lucide-react';
import type { Project } from '@/types/project';

interface EditorHeaderProps {
    project: Project | null;
    isFocusMode: boolean;
    isToolsPanelOpen: boolean;
    onToggleFocusMode: () => void;
    onToggleToolsPanel: () => void;
    onExport: () => void;
    onOpenTension: () => void;
    onOpenAnthology: () => void;
    onOpenSeance: () => void;
}

export function EditorHeader({
    project,
    isFocusMode,
    isToolsPanelOpen,
    onToggleFocusMode,
    onToggleToolsPanel,
    onExport,
    onOpenTension,
    onOpenAnthology,
    onOpenSeance,
}: EditorHeaderProps) {
    const navigate = useNavigate();

    return (
        <header
            className="h-14 flex items-center px-5 gap-4 flex-shrink-0 relative z-10"
            style={{
                background: 'linear-gradient(180deg, #0c0c10 0%, #050506 100%)',
                borderBottom: '1px solid rgba(148, 163, 184, 0.06)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            }}
        >
            {/* Left: Navigation */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/projects')}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200 group"
                    style={{
                        color: '#94a3b8',
                        background: 'transparent',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(220, 38, 38, 0.1)';
                        e.currentTarget.style.color = '#f1f5f9';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#94a3b8';
                    }}
                    title="Back to Projects"
                >
                    <ArrowLeft size={18} />
                    <span className="text-sm font-medium hidden sm:inline" style={{ fontFamily: "'Inter', sans-serif" }}>Projects</span>
                </button>

                <div
                    className="h-6 w-px"
                    style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(148, 163, 184, 0.15) 50%, transparent 100%)' }}
                />

                <div className="flex items-center gap-2.5">
                    <Feather size={16} style={{ color: '#dc2626', opacity: 0.7 }} />
                    <span
                        className="text-sm"
                        style={{
                            fontFamily: "'Cinzel', Georgia, serif",
                            fontWeight: 500,
                            color: '#f1f5f9',
                            letterSpacing: '0.05em',
                        }}
                    >
                        {project?.name || 'Untitled Manuscript'}
                    </span>
                </div>
            </div>

            {/* Center: Epitaph Tools */}
            <div className="flex-1 flex justify-center">
                <div
                    className="flex items-center gap-1 p-1 rounded-xl"
                    style={{
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(148, 163, 184, 0.06)',
                    }}
                >
                    <ToolButton
                        icon={BarChart2}
                        label="Tension"
                        color="#fbbf24"
                        hoverBg="rgba(251, 191, 36, 0.1)"
                        onClick={onOpenTension}
                        shortcut="⌘⇧T"
                    />
                    <ToolButton
                        icon={BookOpen}
                        label="Anthology"
                        color="#a78bfa"
                        hoverBg="rgba(167, 139, 250, 0.1)"
                        onClick={onOpenAnthology}
                        shortcut="⌘⇧A"
                    />
                    <ToolButton
                        icon={Sparkles}
                        label="Séance"
                        color="#c084fc"
                        hoverBg="rgba(192, 132, 252, 0.1)"
                        onClick={onOpenSeance}
                        shortcut="⌘⇧S"
                    />
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
                {/* Focus Mode */}
                <button
                    onClick={onToggleFocusMode}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                    style={{
                        fontFamily: "'Inter', sans-serif",
                        background: isFocusMode ? 'rgba(127, 29, 29, 0.3)' : 'transparent',
                        color: isFocusMode ? '#fecaca' : '#64748b',
                        border: isFocusMode ? '1px solid rgba(220, 38, 38, 0.3)' : '1px solid transparent',
                    }}
                    onMouseEnter={(e) => {
                        if (!isFocusMode) {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                            e.currentTarget.style.color = '#94a3b8';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!isFocusMode) {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = '#64748b';
                        }
                    }}
                    title="Focus Mode (Ctrl+Shift+F)"
                >
                    <Moon size={16} />
                    <span className="hidden xl:inline">{isFocusMode ? 'Exit' : 'Focus'}</span>
                </button>

                {/* Toggle Tools Panel */}
                <button
                    onClick={onToggleToolsPanel}
                    className="p-2.5 rounded-lg transition-all duration-200"
                    style={{
                        background: isToolsPanelOpen ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                        color: isToolsPanelOpen ? '#f1f5f9' : '#64748b',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                        e.currentTarget.style.color = '#f1f5f9';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = isToolsPanelOpen ? 'rgba(255, 255, 255, 0.05)' : 'transparent';
                        e.currentTarget.style.color = isToolsPanelOpen ? '#f1f5f9' : '#64748b';
                    }}
                    title="Toggle Tools Panel"
                >
                    <PanelRight size={18} />
                </button>

                {/* Export */}
                <button
                    onClick={onExport}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300"
                    style={{
                        fontFamily: "'Inter', sans-serif",
                        background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                        color: '#fef2f2',
                        boxShadow: '0 4px 15px rgba(220, 38, 38, 0.3), 0 0 30px rgba(220, 38, 38, 0.1)',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(220, 38, 38, 0.4), 0 0 40px rgba(220, 38, 38, 0.15)';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(220, 38, 38, 0.3), 0 0 30px rgba(220, 38, 38, 0.1)';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}
                    title="Export (Ctrl+E)"
                >
                    <Download size={16} />
                    <span className="hidden sm:inline">Export</span>
                </button>
            </div>
        </header>
    );
}

// Sub-component for tool buttons
function ToolButton({
    icon: Icon,
    label,
    color,
    hoverBg,
    onClick,
    shortcut,
}: {
    icon: LucideIcon;
    label: string;
    color: string;
    hoverBg: string;
    onClick: () => void;
    shortcut: string;
}) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            style={{
                fontFamily: "'Inter', sans-serif",
                color: '#64748b',
                background: 'transparent',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.background = hoverBg;
                e.currentTarget.style.color = color;
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#64748b';
            }}
            title={`${label}™ (${shortcut})`}
        >
            <Icon size={16} />
            <span className="hidden lg:inline">{label}</span>
        </button>
    );
}

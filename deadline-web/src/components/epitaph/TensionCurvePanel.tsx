/**
 * TensionCurvePanel
 * Real-time visualization of story tension for horror writers
 */

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    analyzeTensionCurve,
    generateTensionVisualization,
    getTensionColor,
    getTensionLabel,
    type TensionVisualization,
} from '../../lib/tensionCurve';
import type { TensionCurveAnalysis, TensionSuggestion } from '../../types/epitaph';

interface TensionCurvePanelProps {
    documentId: string;
    content: string;
    isVisible: boolean;
    onClose: () => void;
}

export function TensionCurvePanel({
    documentId,
    content,
    isVisible,
    onClose
}: TensionCurvePanelProps) {
    const [analysis, setAnalysis] = useState<TensionCurveAnalysis | null>(null);
    const [visualization, setVisualization] = useState<TensionVisualization | null>(null);
    const [selectedParagraph, setSelectedParagraph] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState<'curve' | 'suggestions' | 'compare'>('curve');

    // Analyze when content changes (debounced)
    useEffect(() => {
        if (!content || !isVisible) return;

        const timer = setTimeout(() => {
            const result = analyzeTensionCurve(documentId, content);
            setAnalysis(result);
            setVisualization(generateTensionVisualization(result.points, 700, 180));
        }, 500);

        return () => clearTimeout(timer);
    }, [content, documentId, isVisible]);

    // Get arc description
    const arcDescriptions: Record<string, string> = {
        slow_burn: 'Gradual tension build, classic horror pacing',
        rollercoaster: 'Peaks and valleys, keeps readers on edge',
        crescendo: 'Building to a climactic peak',
        dread_plateau: 'Sustained unease, psychological horror style',
        shock_punctuated: 'Calm interrupted by sudden scares',
        flat: '⚠️ Tension is too consistent—needs variation',
    };

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed bottom-0 left-0 right-0 bg-zinc-900/95 backdrop-blur-lg border-t border-zinc-700 z-50"
                style={{ height: '320px' }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800">
                    <div className="flex items-center gap-3">
                        <span className="text-lg">📈</span>
                        <h3 className="font-medium text-zinc-100">Tension Curve™</h3>
                        {analysis && (
                            <span className="text-sm text-zinc-400">
                                Arc: <span className="text-amber-400">{analysis.overallArc.replace('_', ' ')}</span>
                            </span>
                        )}
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-1 bg-zinc-800 rounded-lg p-1">
                        {(['curve', 'suggestions', 'compare'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-3 py-1 text-sm rounded-md transition-colors ${activeTab === tab
                                        ? 'bg-zinc-700 text-zinc-100'
                                        : 'text-zinc-400 hover:text-zinc-200'
                                    }`}
                            >
                                {tab === 'curve' ? 'Visualization' : tab === 'suggestions' ? 'Suggestions' : 'Compare'}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={onClose}
                        className="text-zinc-400 hover:text-zinc-100 transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 overflow-auto" style={{ height: 'calc(100% - 48px)' }}>
                    {!analysis ? (
                        <div className="flex items-center justify-center h-full text-zinc-500">
                            <span className="animate-pulse">Analyzing tension...</span>
                        </div>
                    ) : activeTab === 'curve' ? (
                        <CurveVisualization
                            analysis={analysis}
                            visualization={visualization}
                            selectedParagraph={selectedParagraph}
                            onSelectParagraph={setSelectedParagraph}
                            arcDescription={arcDescriptions[analysis.overallArc]}
                        />
                    ) : activeTab === 'suggestions' ? (
                        <SuggestionsPanel suggestions={analysis.suggestions} />
                    ) : (
                        <ComparisonPanel comparisons={analysis.comparisonToArchetypes} />
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

interface CurveVisualizationProps {
    analysis: TensionCurveAnalysis;
    visualization: TensionVisualization | null;
    selectedParagraph: number | null;
    onSelectParagraph: (idx: number | null) => void;
    arcDescription: string;
}

function CurveVisualization({
    analysis,
    visualization,
    selectedParagraph,
    onSelectParagraph,
    arcDescription,
}: CurveVisualizationProps) {
    if (!visualization) return null;

    return (
        <div className="flex gap-6">
            {/* SVG Curve */}
            <div className="flex-1">
                <svg
                    viewBox={`0 0 ${visualization.width} ${visualization.height}`}
                    className="w-full h-44 bg-zinc-950/50 rounded-lg"
                >
                    {/* Grid lines */}
                    {[0, 25, 50, 75, 100].map((level) => (
                        <g key={level}>
                            <line
                                x1={0}
                                y1={visualization.height - (level / 100) * visualization.height}
                                x2={visualization.width}
                                y2={visualization.height - (level / 100) * visualization.height}
                                stroke="#27272a"
                                strokeDasharray="4 4"
                            />
                            <text
                                x={5}
                                y={visualization.height - (level / 100) * visualization.height - 5}
                                fill="#52525b"
                                fontSize={10}
                            >
                                {level}
                            </text>
                        </g>
                    ))}

                    {/* Gradient fill under curve */}
                    <defs>
                        <linearGradient id="tensionGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <path
                        d={`${visualization.svgPath} L ${visualization.width} ${visualization.height} L 0 ${visualization.height} Z`}
                        fill="url(#tensionGradient)"
                    />

                    {/* Main curve */}
                    <path
                        d={visualization.svgPath}
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth={2}
                    />

                    {/* Interactive points */}
                    {analysis.points.map((point, idx) => {
                        const xStep = visualization.width / Math.max(analysis.points.length - 1, 1);
                        const x = idx * xStep;
                        const y = visualization.height - (point.tensionLevel / 100) * visualization.height;
                        const isSelected = selectedParagraph === idx;

                        return (
                            <g key={idx}>
                                <circle
                                    cx={x}
                                    cy={y}
                                    r={isSelected ? 8 : 5}
                                    fill={getTensionColor(point.tensionLevel)}
                                    stroke={isSelected ? '#fff' : 'transparent'}
                                    strokeWidth={2}
                                    className="cursor-pointer transition-all"
                                    onClick={() => onSelectParagraph(isSelected ? null : idx)}
                                />
                            </g>
                        );
                    })}

                    {/* Peak marker */}
                    <g>
                        <text
                            x={visualization.peakPoint.x}
                            y={visualization.peakPoint.y - 15}
                            fill="#fbbf24"
                            fontSize={11}
                            textAnchor="middle"
                        >
                            ▲ Peak
                        </text>
                    </g>
                </svg>

                <p className="text-sm text-zinc-400 mt-2 text-center">{arcDescription}</p>
            </div>

            {/* Selected paragraph details */}
            <div className="w-64 bg-zinc-800/50 rounded-lg p-3">
                <h4 className="text-sm font-medium text-zinc-300 mb-2">
                    {selectedParagraph !== null
                        ? `Paragraph ${selectedParagraph + 1}`
                        : 'Select a point'}
                </h4>

                {selectedParagraph !== null && analysis.points[selectedParagraph] && (
                    <div className="space-y-3">
                        <div>
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-400">Tension Level</span>
                                <span style={{ color: getTensionColor(analysis.points[selectedParagraph].tensionLevel) }}>
                                    {analysis.points[selectedParagraph].tensionLevel}%
                                </span>
                            </div>
                            <div className="text-xs text-zinc-500">
                                {getTensionLabel(analysis.points[selectedParagraph].tensionLevel)}
                            </div>
                        </div>

                        <div>
                            <h5 className="text-xs text-zinc-500 mb-1">Contributing Factors</h5>
                            <div className="space-y-1">
                                {analysis.points[selectedParagraph].factors.map((factor, i) => (
                                    <div
                                        key={i}
                                        className="text-xs p-1.5 rounded bg-zinc-700/50"
                                    >
                                        <span className={factor.impact > 0 ? 'text-red-400' : 'text-green-400'}>
                                            {factor.impact > 0 ? '+' : ''}{factor.impact}
                                        </span>
                                        {' '}
                                        <span className="text-zinc-300">{factor.description}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {selectedParagraph === null && (
                    <p className="text-xs text-zinc-500">
                        Click a point on the curve to see what's driving tension at that moment.
                    </p>
                )}
            </div>
        </div>
    );
}

interface SuggestionsPanelProps {
    suggestions: TensionSuggestion[];
}

function SuggestionsPanel({ suggestions }: SuggestionsPanelProps) {
    if (suggestions.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-zinc-400">
                <div className="text-center">
                    <span className="text-3xl mb-2 block">✨</span>
                    <p>No major issues detected. Your pacing looks solid!</p>
                </div>
            </div>
        );
    }

    const severityColors = {
        low: 'border-blue-500/50 bg-blue-500/10',
        medium: 'border-amber-500/50 bg-amber-500/10',
        high: 'border-red-500/50 bg-red-500/10',
        critical: 'border-red-600 bg-red-600/20',
    };

    const severityIcons = {
        low: '💡',
        medium: '⚠️',
        high: '🔥',
        critical: '🚨',
    };

    return (
        <div className="space-y-3 max-h-full overflow-auto">
            {suggestions.map((suggestion, idx) => (
                <div
                    key={idx}
                    className={`p-3 rounded-lg border ${severityColors[suggestion.severity]}`}
                >
                    <div className="flex items-start gap-2">
                        <span>{severityIcons[suggestion.severity]}</span>
                        <div>
                            <div className="text-sm font-medium text-zinc-200">
                                Paragraphs {suggestion.paragraphRange[0] + 1}–{suggestion.paragraphRange[1] + 1}
                            </div>
                            <p className="text-sm text-zinc-300 mt-1">{suggestion.suggestion}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

interface ComparisonPanelProps {
    comparisons: { archetypeName: string; similarityScore: number; keyDifferences: string[] }[];
}

function ComparisonPanel({ comparisons }: ComparisonPanelProps) {
    return (
        <div className="space-y-3">
            <p className="text-sm text-zinc-400 mb-3">
                How your tension curve compares to famous horror works:
            </p>

            {comparisons.slice(0, 4).map((comp, idx) => (
                <div key={idx} className="p-3 bg-zinc-800/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-zinc-200">{comp.archetypeName}</span>
                        <span
                            className={`text-sm font-medium ${comp.similarityScore > 70 ? 'text-green-400' :
                                    comp.similarityScore > 50 ? 'text-amber-400' : 'text-zinc-400'
                                }`}
                        >
                            {comp.similarityScore}% similar
                        </span>
                    </div>

                    {/* Similarity bar */}
                    <div className="h-1.5 bg-zinc-700 rounded-full overflow-hidden mb-2">
                        <div
                            className="h-full bg-gradient-to-r from-amber-500 to-red-500 rounded-full"
                            style={{ width: `${comp.similarityScore}%` }}
                        />
                    </div>

                    {comp.keyDifferences.length > 0 && (
                        <div className="text-xs text-zinc-400">
                            {comp.keyDifferences.join(' • ')}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

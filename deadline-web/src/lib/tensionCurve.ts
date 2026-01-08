/**
 * Tension Curve™ Analyzer
 * Real-time analysis of story tension and pacing for horror writers
 */

import type {
    TensionPoint,
    TensionFactor,
    TensionCurveAnalysis,
    TensionArc,
    TensionSuggestion,
    ArchetypeComparison
} from '../types/epitaph';

// =============================================================================
// TENSION ANALYSIS CONSTANTS
// =============================================================================

// Words that increase tension
const HIGH_TENSION_WORDS = new Set([
    // Fear vocabulary
    'fear', 'terror', 'horror', 'dread', 'panic', 'scream', 'shriek', 'cry',
    'nightmare', 'death', 'dead', 'die', 'dying', 'kill', 'murder', 'blood',
    'dark', 'darkness', 'shadow', 'shadows', 'black', 'night', 'midnight',

    // Threat words
    'danger', 'threat', 'attack', 'chase', 'hunt', 'stalk', 'lurk', 'creep',
    'watch', 'watching', 'eyes', 'stare', 'staring', 'follow', 'following',

    // Sensory horror
    'cold', 'freezing', 'chill', 'shiver', 'tremble', 'shake', 'sweat',
    'smell', 'stench', 'rot', 'decay', 'festering', 'crawl', 'crawling',

    // Urgency words
    'run', 'running', 'escape', 'hide', 'hiding', 'help', 'please', 'stop',
    'now', 'suddenly', 'instant', 'immediately', 'must', 'have to',

    // Body horror
    'flesh', 'bone', 'skull', 'skin', 'wound', 'injury', 'pain', 'agony',
    'bleed', 'bleeding', 'cut', 'tear', 'rip', 'break', 'crack', 'snap',

    // Psychological
    'insane', 'mad', 'crazy', 'paranoid', 'hallucination', 'delusion',
    'alone', 'isolated', 'trapped', 'cage', 'prison', 'can\'t escape',

    // Supernatural
    'ghost', 'spirit', 'demon', 'monster', 'creature', 'thing', 'it',
    'entity', 'presence', 'whisper', 'voice', 'voices', 'calling',
]);

// Words that decrease tension (relief, calm)
const LOW_TENSION_WORDS = new Set([
    'safe', 'safety', 'calm', 'peace', 'peaceful', 'quiet', 'silence',
    'rest', 'sleep', 'dream', 'beautiful', 'gentle', 'soft', 'warm',
    'light', 'bright', 'sun', 'morning', 'day', 'clear', 'clean',
    'love', 'hope', 'happy', 'joy', 'smile', 'laugh', 'comfort',
    'home', 'familiar', 'remember', 'memory', 'childhood', 'family',
    'friend', 'together', 'help', 'saved', 'rescue', 'relief',
]);

// Punctuation that affects pacing
const TENSION_PUNCTUATION = {
    '!': 5,
    '?': 3,
    '...': 7,
    '—': 4,
    '-': 2,
};

// =============================================================================
// CORE ANALYSIS FUNCTIONS
// =============================================================================

/**
 * Analyze the tension curve of a complete document
 */
export function analyzeTensionCurve(
    documentId: string,
    content: string
): TensionCurveAnalysis {
    const paragraphs = content.split(/\n\n+/).filter(p => p.trim());
    const points: TensionPoint[] = [];

    let charPosition = 0;

    paragraphs.forEach((paragraph, index) => {
        const tensionLevel = calculateParagraphTension(paragraph);
        const factors = identifyTensionFactors(paragraph);

        points.push({
            position: charPosition,
            paragraphIndex: index,
            tensionLevel,
            factors,
        });

        charPosition += paragraph.length + 2; // +2 for \n\n
    });

    const overallArc = classifyTensionArc(points);
    const suggestions = generateTensionSuggestions(points);
    const comparisonToArchetypes = compareToArchetypes(points);

    return {
        documentId,
        analyzedAt: Date.now(),
        points,
        overallArc,
        suggestions,
        comparisonToArchetypes,
    };
}

/**
 * Calculate tension level for a single paragraph (0-100)
 */
function calculateParagraphTension(paragraph: string): number {
    const words = paragraph.toLowerCase().split(/\s+/);
    const wordCount = words.length;

    if (wordCount === 0) return 0;

    let tensionScore = 50; // Start at neutral

    // Word analysis
    let highTensionCount = 0;
    let lowTensionCount = 0;

    words.forEach(word => {
        const cleanWord = word.replace(/[^a-z']/g, '');
        if (HIGH_TENSION_WORDS.has(cleanWord)) highTensionCount++;
        if (LOW_TENSION_WORDS.has(cleanWord)) lowTensionCount++;
    });

    tensionScore += (highTensionCount / wordCount) * 100;
    tensionScore -= (lowTensionCount / wordCount) * 50;

    // Sentence length analysis (shorter = more tension)
    const sentences = paragraph.split(/[.!?]+/).filter(s => s.trim());
    const avgSentenceLength = wordCount / Math.max(sentences.length, 1);

    if (avgSentenceLength < 8) tensionScore += 15; // Short, punchy
    else if (avgSentenceLength < 15) tensionScore += 5;
    else if (avgSentenceLength > 25) tensionScore -= 10; // Long, relaxed

    // Punctuation analysis
    for (const [punct, value] of Object.entries(TENSION_PUNCTUATION)) {
        const count = (paragraph.match(new RegExp(punct.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
        tensionScore += count * value;
    }

    // Dialogue density (dialogue can increase or decrease depending on content)
    const dialogueCount = (paragraph.match(/"/g) || []).length / 2;
    if (dialogueCount > 0) tensionScore += 5; // Dialogue generally adds engagement

    // Cap between 0 and 100
    return Math.max(0, Math.min(100, tensionScore));
}

/**
 * Identify specific factors contributing to tension in a paragraph
 */
function identifyTensionFactors(paragraph: string): TensionFactor[] {
    const factors: TensionFactor[] = [];
    const words = paragraph.toLowerCase().split(/\s+/);
    const wordCount = words.length;

    // Check word choice
    const highTensionWords = words.filter(w => HIGH_TENSION_WORDS.has(w.replace(/[^a-z']/g, '')));
    if (highTensionWords.length > 0) {
        factors.push({
            type: 'word_choice',
            impact: Math.min(30, highTensionWords.length * 5),
            description: `High-tension vocabulary: ${highTensionWords.slice(0, 3).join(', ')}${highTensionWords.length > 3 ? '...' : ''}`,
        });
    }

    const lowTensionWords = words.filter(w => LOW_TENSION_WORDS.has(w.replace(/[^a-z']/g, '')));
    if (lowTensionWords.length > 0) {
        factors.push({
            type: 'word_choice',
            impact: -Math.min(20, lowTensionWords.length * 4),
            description: `Calming vocabulary: ${lowTensionWords.slice(0, 3).join(', ')}`,
        });
    }

    // Check sentence length
    const sentences = paragraph.split(/[.!?]+/).filter(s => s.trim());
    const avgLength = wordCount / Math.max(sentences.length, 1);

    if (avgLength < 8) {
        factors.push({
            type: 'sentence_length',
            impact: 15,
            description: 'Short, punchy sentences create urgency',
        });
    } else if (avgLength > 25) {
        factors.push({
            type: 'sentence_length',
            impact: -10,
            description: 'Long sentences slow the pace',
        });
    }

    // Check for sensory detail (usually increases immersion/tension)
    const sensoryWords = ['smell', 'taste', 'touch', 'feel', 'hear', 'see', 'sound', 'noise'];
    const hasSensory = sensoryWords.some(sw => paragraph.toLowerCase().includes(sw));
    if (hasSensory) {
        factors.push({
            type: 'sensory_detail',
            impact: 8,
            description: 'Sensory details increase immersion',
        });
    }

    // Check for ellipsis (creates dread)
    if (paragraph.includes('...')) {
        factors.push({
            type: 'pacing',
            impact: 7,
            description: 'Ellipsis creates suspenseful pauses',
        });
    }

    return factors;
}

/**
 * Classify the overall tension arc of the document
 */
function classifyTensionArc(points: TensionPoint[]): TensionArc {
    if (points.length < 3) return 'flat';

    const tensionLevels = points.map(p => p.tensionLevel);
    const avg = tensionLevels.reduce((a, b) => a + b, 0) / tensionLevels.length;
    const variance = tensionLevels.reduce((sum, t) => sum + Math.pow(t - avg, 2), 0) / tensionLevels.length;

    // Find peak position
    const maxTension = Math.max(...tensionLevels);
    const peakIndex = tensionLevels.indexOf(maxTension);
    const peakPosition = peakIndex / tensionLevels.length;

    // Check for gradual build
    let isGradualBuild = true;
    for (let i = 1; i < points.length - 2; i++) {
        if (tensionLevels[i] < tensionLevels[i - 1] - 15) {
            isGradualBuild = false;
            break;
        }
    }

    // Classify
    if (variance < 100) {
        if (avg < 40) return 'flat';
        return 'dread_plateau';
    }

    if (isGradualBuild && peakPosition > 0.7) {
        return 'crescendo';
    }

    if (variance > 400) {
        return 'shock_punctuated';
    }

    if (variance > 200) {
        return 'rollercoaster';
    }

    return 'slow_burn';
}

/**
 * Generate specific suggestions for improving tension
 */
function generateTensionSuggestions(points: TensionPoint[]): TensionSuggestion[] {
    const suggestions: TensionSuggestion[] = [];

    for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];

        // Check for sudden drops
        if (prev.tensionLevel - curr.tensionLevel > 30) {
            suggestions.push({
                paragraphRange: [i - 1, i],
                issue: 'tension_drop',
                suggestion: 'Tension drops sharply here. Consider: lingering on the threat, adding a secondary concern, or removing explanatory text that releases the mystery.',
                severity: 'medium',
            });
        }

        // Check for plateau (5+ paragraphs at similar level)
        if (i >= 4) {
            const last5 = points.slice(i - 4, i + 1).map(p => p.tensionLevel);
            const range = Math.max(...last5) - Math.min(...last5);
            if (range < 15) {
                suggestions.push({
                    paragraphRange: [i - 4, i],
                    issue: 'plateau_too_long',
                    suggestion: 'Tension has plateaued. Readers need variation. Consider: a revelation, a new threat, or a moment of false relief followed by escalation.',
                    severity: 'high',
                });
            }
        }

        // Check for peak too early
        const tensionLevels = points.map(p => p.tensionLevel);
        const maxIdx = tensionLevels.indexOf(Math.max(...tensionLevels));
        if (maxIdx < points.length * 0.3 && i === maxIdx) {
            suggestions.push({
                paragraphRange: [maxIdx, maxIdx],
                issue: 'peak_too_early',
                suggestion: 'Your highest tension point is in the first third. This leaves the rest feeling anticlimactic. Consider: saving your biggest scare, or adding escalating threats after this moment.',
                severity: 'high',
            });
        }
    }

    return suggestions;
}

/**
 * Compare the tension curve to famous horror archetypes
 */
function compareToArchetypes(points: TensionPoint[]): ArchetypeComparison[] {
    // Archetype patterns (simplified tension trajectories)
    const archetypes: Record<string, number[]> = {
        "Stephen King's 'The Shining'": [30, 35, 40, 45, 55, 60, 50, 65, 70, 85, 95, 100],
        "Shirley Jackson's 'The Haunting'": [40, 50, 55, 60, 65, 70, 75, 80, 85, 88, 90, 92],
        "Lovecraft's 'Cosmic Dread'": [45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100],
        "Slasher Pattern": [20, 25, 80, 30, 35, 85, 40, 45, 90, 50, 95, 100],
    };

    const userTension = points.map(p => p.tensionLevel);
    const comparisons: ArchetypeComparison[] = [];

    for (const [name, pattern] of Object.entries(archetypes)) {
        // Normalize both to same length for comparison
        const normalized = normalizeTensionArray(userTension, pattern.length);

        // Calculate similarity (inverse of average difference)
        let totalDiff = 0;
        for (let i = 0; i < pattern.length; i++) {
            totalDiff += Math.abs(normalized[i] - pattern[i]);
        }
        const avgDiff = totalDiff / pattern.length;
        const similarity = Math.max(0, 100 - avgDiff);

        const differences: string[] = [];
        if (normalized[0] > pattern[0] + 15) differences.push('Starts with more tension');
        if (normalized[0] < pattern[0] - 15) differences.push('Starts slower');
        if (normalized[normalized.length - 1] < pattern[pattern.length - 1] - 15) {
            differences.push('Climax isn\'t as intense');
        }

        comparisons.push({
            archetypeName: name,
            similarityScore: Math.round(similarity),
            keyDifferences: differences,
        });
    }

    return comparisons.sort((a, b) => b.similarityScore - a.similarityScore);
}

/**
 * Normalize a tension array to a specific length
 */
function normalizeTensionArray(arr: number[], targetLength: number): number[] {
    if (arr.length === 0) return new Array(targetLength).fill(50);
    if (arr.length === targetLength) return arr;

    const result: number[] = [];
    for (let i = 0; i < targetLength; i++) {
        const sourceIdx = (i / targetLength) * arr.length;
        const lowerIdx = Math.floor(sourceIdx);
        const upperIdx = Math.min(lowerIdx + 1, arr.length - 1);
        const fraction = sourceIdx - lowerIdx;
        result.push(arr[lowerIdx] * (1 - fraction) + arr[upperIdx] * fraction);
    }
    return result;
}

// =============================================================================
// TENSION CURVE VISUALIZATION HELPERS
// =============================================================================

export interface TensionVisualization {
    svgPath: string;
    width: number;
    height: number;
    peakPoint: { x: number; y: number };
    lowPoint: { x: number; y: number };
}

/**
 * Generate SVG path data for visualizing the tension curve
 */
export function generateTensionVisualization(
    points: TensionPoint[],
    width: number = 800,
    height: number = 200
): TensionVisualization {
    if (points.length === 0) {
        return {
            svgPath: `M 0 ${height / 2} L ${width} ${height / 2}`,
            width,
            height,
            peakPoint: { x: width / 2, y: height / 2 },
            lowPoint: { x: width / 2, y: height / 2 },
        };
    }

    const xStep = width / Math.max(points.length - 1, 1);
    const tensionLevels = points.map(p => p.tensionLevel);

    // Create smooth curve using bezier
    let path = `M 0 ${height - (tensionLevels[0] / 100) * height}`;

    for (let i = 0; i < points.length - 1; i++) {
        const x1 = i * xStep;
        const y1 = height - (tensionLevels[i] / 100) * height;
        const x2 = (i + 1) * xStep;
        const y2 = height - (tensionLevels[i + 1] / 100) * height;

        // Control points for smooth curve
        const cpx1 = x1 + xStep / 3;
        const cpy1 = y1;
        const cpx2 = x2 - xStep / 3;
        const cpy2 = y2;

        path += ` C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${x2} ${y2}`;
    }

    // Find peak and low points
    const maxTension = Math.max(...tensionLevels);
    const minTension = Math.min(...tensionLevels);
    const peakIdx = tensionLevels.indexOf(maxTension);
    const lowIdx = tensionLevels.indexOf(minTension);

    return {
        svgPath: path,
        width,
        height,
        peakPoint: {
            x: peakIdx * xStep,
            y: height - (maxTension / 100) * height,
        },
        lowPoint: {
            x: lowIdx * xStep,
            y: height - (minTension / 100) * height,
        },
    };
}

/**
 * Get color for a tension level
 */
export function getTensionColor(level: number): string {
    if (level < 30) return '#4ade80'; // Green - calm
    if (level < 50) return '#facc15'; // Yellow - building
    if (level < 70) return '#f97316'; // Orange - tense
    if (level < 85) return '#ef4444'; // Red - high tension
    return '#7c2d12'; // Dark red - peak horror
}

/**
 * Get human-readable label for tension level
 */
export function getTensionLabel(level: number): string {
    if (level < 20) return 'Peaceful';
    if (level < 40) return 'Calm';
    if (level < 55) return 'Uneasy';
    if (level < 70) return 'Tense';
    if (level < 85) return 'Frightening';
    return 'Terrifying';
}

/**
 * Epitaph Components Index
 * Export all Epitaph feature components
 */

// Core Panels
export { TensionCurvePanel } from './TensionCurvePanel';
export { FearAnthologyPanel } from './FearAnthologyPanel';
export { SeanceChamberPanel } from './SeanceChamberPanel';

// Re-export types for convenience
export type {
    TensionCurveAnalysis,
    TensionPoint,
    TensionSuggestion,
    FearAnthologyEntry,
    FearCategory,
    SeanceQuery,
    SeanceResponse,
    WriterGoal,
} from '../../types/epitaph';

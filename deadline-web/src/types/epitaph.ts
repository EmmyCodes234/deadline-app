/**
 * Epitaph Feature Types
 * Type definitions for all 7 flagship features
 */

// =============================================================================
// SUBSCRIPTION & ACCESS
// =============================================================================

export type SubscriptionTier = 'neophyte' | 'disciple' | 'master' | 'archon';

export interface UserSubscription {
  tier: SubscriptionTier;
  expiresAt: number | null;
  seanceQueriesRemaining: number; // Daily limit for disciple tier
}

export const TIER_LIMITS: Record<SubscriptionTier, TierLimits> = {
  neophyte: {
    maxProjects: 1,
    maxWords: 5000,
    seanceQueriesPerDay: 0,
    hasReaderSimulation: false,
    hasBoneArchive: false,
    hasCoven: false,
    hasAdvancedExport: false,
  },
  disciple: {
    maxProjects: Infinity,
    maxWords: Infinity,
    seanceQueriesPerDay: 10,
    hasReaderSimulation: false,
    hasBoneArchive: false,
    hasCoven: false,
    hasAdvancedExport: true,
  },
  master: {
    maxProjects: Infinity,
    maxWords: Infinity,
    seanceQueriesPerDay: Infinity,
    hasReaderSimulation: true,
    hasBoneArchive: true,
    hasCoven: true,
    hasAdvancedExport: true,
  },
  archon: {
    maxProjects: Infinity,
    maxWords: Infinity,
    seanceQueriesPerDay: Infinity,
    hasReaderSimulation: true,
    hasBoneArchive: true,
    hasCoven: true,
    hasAdvancedExport: true,
  },
};

export interface TierLimits {
  maxProjects: number;
  maxWords: number;
  seanceQueriesPerDay: number;
  hasReaderSimulation: boolean;
  hasBoneArchive: boolean;
  hasCoven: boolean;
  hasAdvancedExport: boolean;
}

// =============================================================================
// 1. TENSION CURVE™
// =============================================================================

export interface TensionPoint {
  position: number; // Character position in document
  paragraphIndex: number;
  tensionLevel: number; // 0-100
  factors: TensionFactor[];
}

export interface TensionFactor {
  type: 
    | 'word_choice' 
    | 'sentence_length' 
    | 'pacing' 
    | 'dialogue_density'
    | 'sensory_detail'
    | 'revelation'
    | 'threat_proximity';
  impact: number; // -50 to +50
  description: string;
}

export interface TensionCurveAnalysis {
  documentId: string;
  analyzedAt: number;
  points: TensionPoint[];
  overallArc: TensionArc;
  suggestions: TensionSuggestion[];
  comparisonToArchetypes: ArchetypeComparison[];
}

export type TensionArc = 
  | 'slow_burn'
  | 'rollercoaster'
  | 'crescendo'
  | 'dread_plateau'
  | 'shock_punctuated'
  | 'flat'; // Warning: needs work

export interface TensionSuggestion {
  paragraphRange: [number, number];
  issue: 'tension_drop' | 'plateau_too_long' | 'peak_too_early' | 'no_recovery';
  suggestion: string;
  severity: 'low' | 'medium' | 'high';
}

export interface ArchetypeComparison {
  archetypeName: string; // "Stephen King's IT", "Shirley Jackson"
  similarityScore: number; // 0-100
  keyDifferences: string[];
}

// =============================================================================
// 2. FEAR ANTHOLOGY™
// =============================================================================

export interface FearAnthologyEntry {
  id: string;
  category: FearCategory;
  name: string;
  description: string;
  origins: string; // Cultural/historical origins
  examples: LiteraryExample[];
  subversions: SubversionIdea[];
  combinations: string[]; // IDs of entries that pair well
  tensionPattern: TensionArc;
  tags: string[];
  communityContributed: boolean;
  upvotes: number;
}

export type FearCategory =
  | 'monster'
  | 'ghost'
  | 'psychological'
  | 'cosmic'
  | 'body_horror'
  | 'folk_horror'
  | 'atmospheric'
  | 'slasher'
  | 'supernatural'
  | 'sci_fi_horror'
  | 'gothic'
  | 'survival';

export interface LiteraryExample {
  title: string;
  author: string;
  year: number;
  quote?: string;
  analysis: string;
}

export interface SubversionIdea {
  concept: string;
  example: string;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
}

// =============================================================================
// 3. SÉANCE CHAMBER™ (Coaching AI)
// =============================================================================

export interface SeanceQuery {
  id: string;
  documentId: string | null;
  selectedText: string | null;
  question: string;
  context: SeanceContext;
  timestamp: number;
}

export interface SeanceContext {
  documentWordCount: number;
  genre: string;
  currentChapter: number | null;
  writerGoal: WriterGoal;
}

export type WriterGoal =
  | 'increase_tension'
  | 'improve_atmosphere'
  | 'fix_pacing'
  | 'deepen_character'
  | 'subvert_trope'
  | 'research_accuracy'
  | 'general_craft';

export interface SeanceResponse {
  id: string;
  queryId: string;
  coachingType: CoachingType;
  content: string;
  literaryReferences: LiteraryReference[];
  suggestedTechniques: Technique[];
  followUpQuestions: string[];
  timestamp: number;
}

export type CoachingType =
  | 'craft_analysis' // Analyzing what the writer is doing
  | 'technique_suggestion' // Suggesting craft techniques
  | 'example_showcase' // Showing how masters do it
  | 'diagnostic' // Identifying issues
  | 'encouragement'; // Positive reinforcement

export interface LiteraryReference {
  title: string;
  author: string;
  relevantQuote: string;
  whyRelevant: string;
}

export interface Technique {
  name: string;
  description: string;
  howToApply: string;
  example: string;
}

// =============================================================================
// 4. READER SIMULATION™
// =============================================================================

export interface ReaderSimulation {
  documentId: string;
  chapterId: string | null;
  simulatedAt: number;
  readerProfiles: ReaderProfile[];
  paragraphResponses: ParagraphResponse[];
  overallMetrics: SimulationMetrics;
  recommendations: SimulationRecommendation[];
}

export interface ReaderProfile {
  id: string;
  fearTolerance: 'low' | 'medium' | 'high';
  readingSpeed: 'slow' | 'average' | 'fast';
  preferences: FearCategory[];
}

export interface ParagraphResponse {
  paragraphIndex: number;
  averageFearLevel: number; // 0-100
  engagementLevel: number; // 0-100
  putDownRisk: number; // 0-100 chance reader stops here
  emotionalNotes: string[];
}

export interface SimulationMetrics {
  averageFearLevel: number;
  peakFearMoment: number; // Paragraph index
  tensionVariance: number;
  predictedCompletionRate: number; // % of readers who'd finish
  pageturnerScore: number; // 0-100
}

export interface SimulationRecommendation {
  paragraphRange: [number, number];
  issue: string;
  suggestion: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

// =============================================================================
// 5. BONE ARCHIVE™ (Research Hub)
// =============================================================================

export interface BoneArchiveEntry {
  id: string;
  category: ResearchCategory;
  title: string;
  content: string;
  sources: Source[];
  tags: string[];
  triggerWarnings: string[];
  lastUpdated: number;
}

export type ResearchCategory =
  | 'forensics'
  | 'psychology'
  | 'occult'
  | 'medical'
  | 'historical'
  | 'locations'
  | 'mythology'
  | 'anthropology';

export interface Source {
  type: 'academic' | 'medical' | 'historical' | 'journalistic';
  title: string;
  author: string;
  year: number;
  url?: string;
}

export interface ResearchNote {
  id: string;
  entryId: string;
  projectId: string;
  note: string;
  createdAt: number;
}

// =============================================================================
// 6. THE COVEN™ (Community)
// =============================================================================

export interface CovenProfile {
  id: string;
  displayName: string;
  avatar: string | null;
  bio: string;
  joinedAt: number;
  wordsWritten: number;
  projectsCompleted: number;
  specializations: FearCategory[];
  isBetaReader: boolean;
  isEditor: boolean;
}

export interface CritiqueCircle {
  id: string;
  name: string;
  description: string;
  genre: FearCategory;
  memberIds: string[];
  maxMembers: number;
  isPrivate: boolean;
  createdAt: number;
}

export interface WritingSprint {
  id: string;
  title: string;
  prompt: string;
  durationMinutes: number;
  startsAt: number;
  participantIds: string[];
  leaderboard: SprintResult[];
}

export interface SprintResult {
  userId: string;
  wordsWritten: number;
  completedAt: number;
}

export interface MarketListing {
  id: string;
  type: 'publisher' | 'agent' | 'anthology' | 'contest';
  name: string;
  description: string;
  genres: FearCategory[];
  deadline: number | null;
  payRate: string;
  submissionUrl: string;
  isOpen: boolean;
  addedAt: number;
}

export interface ProfessionalListing {
  id: string;
  type: 'editor' | 'cover_designer' | 'narrator';
  name: string;
  portfolio: string;
  specializations: FearCategory[];
  rate: string;
  testimonials: Testimonial[];
  verified: boolean;
}

export interface Testimonial {
  authorName: string;
  content: string;
  rating: number; // 1-5
}

// =============================================================================
// 7. THE GRIMOIRE™ (Publishing Pipeline)
// =============================================================================

export interface ExportConfig {
  format: ExportFormat;
  includeTitle: boolean;
  includeToc: boolean;
  chapterFormatting: ChapterFormatting;
  contentWarnings: string[];
  ageRating: AgeRating;
}

export type ExportFormat =
  | 'docx'
  | 'pdf'
  | 'epub'
  | 'kindle_direct' // KDP-specific formatting
  | 'standard_manuscript' // Industry standard
  | 'wattpad'
  | 'audiobook_script';

export interface ChapterFormatting {
  chapterPrefix: string; // "Chapter", "Part", custom
  numbering: 'arabic' | 'roman' | 'spelled' | 'none';
  pageBreakBefore: boolean;
}

export type AgeRating = 'all_ages' | 'teen' | 'mature' | 'adult';

export interface QueryLetterTemplate {
  id: string;
  name: string;
  structure: QuerySection[];
}

export interface QuerySection {
  name: string;
  placeholder: string;
  maxWords: number;
  tips: string[];
}

export interface ContentWarningGenerator {
  documentId: string;
  detectedWarnings: DetectedWarning[];
  suggestedTags: string[];
}

export interface DetectedWarning {
  category: string;
  severity: 'mild' | 'moderate' | 'intense' | 'extreme';
  paragraphIndices: number[];
  description: string;
}

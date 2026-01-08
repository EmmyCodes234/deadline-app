/**
 * EpitaphContext
 * Main context provider for all Epitaph features
 */

import React, { createContext, useContext, useReducer, useCallback, useEffect, ReactNode } from 'react';
import type {
    SubscriptionTier,
    UserSubscription,
    TierLimits,
    TIER_LIMITS,
} from '../types/epitaph';

// =============================================================================
// STATE TYPES
// =============================================================================

interface EpitaphState {
    // User & Subscription
    subscription: UserSubscription;
    isAuthenticated: boolean;

    // Feature Access
    activeFeature: ActiveFeature | null;

    // UI State
    sidebarTab: SidebarTab;
    isAnthologyOpen: boolean;
    isSeanceOpen: boolean;
    isTensionCurveVisible: boolean;

    // Usage Tracking
    wordsWrittenToday: number;
    seanceQueriesUsedToday: number;
    lastResetDate: string; // YYYY-MM-DD
}

type ActiveFeature =
    | 'tension_curve'
    | 'fear_anthology'
    | 'seance_chamber'
    | 'reader_simulation'
    | 'bone_archive'
    | 'coven'
    | 'grimoire';

type SidebarTab = 'crypt' | 'anthology' | 'seance' | 'archive' | 'grimoire';

// =============================================================================
// ACTIONS
// =============================================================================

type EpitaphAction =
    | { type: 'SET_SUBSCRIPTION'; payload: UserSubscription }
    | { type: 'SET_AUTHENTICATED'; payload: boolean }
    | { type: 'SET_ACTIVE_FEATURE'; payload: ActiveFeature | null }
    | { type: 'SET_SIDEBAR_TAB'; payload: SidebarTab }
    | { type: 'TOGGLE_ANTHOLOGY'; payload?: boolean }
    | { type: 'TOGGLE_SEANCE'; payload?: boolean }
    | { type: 'TOGGLE_TENSION_CURVE'; payload?: boolean }
    | { type: 'ADD_WORDS_WRITTEN'; payload: number }
    | { type: 'USE_SEANCE_QUERY' }
    | { type: 'RESET_DAILY_LIMITS' };

// =============================================================================
// INITIAL STATE
// =============================================================================

const getInitialState = (): EpitaphState => {
    // Check for stored subscription
    const storedSub = localStorage.getItem('epitaph:subscription');
    const storedWords = localStorage.getItem('epitaph:wordsToday');
    const storedQueries = localStorage.getItem('epitaph:seanceToday');
    const storedDate = localStorage.getItem('epitaph:lastResetDate');

    const today = new Date().toISOString().split('T')[0];

    return {
        subscription: storedSub
            ? JSON.parse(storedSub)
            : { tier: 'neophyte' as SubscriptionTier, expiresAt: null, seanceQueriesRemaining: 0 },
        isAuthenticated: false,
        activeFeature: null,
        sidebarTab: 'crypt',
        isAnthologyOpen: false,
        isSeanceOpen: false,
        isTensionCurveVisible: false,
        wordsWrittenToday: storedDate === today && storedWords ? parseInt(storedWords, 10) : 0,
        seanceQueriesUsedToday: storedDate === today && storedQueries ? parseInt(storedQueries, 10) : 0,
        lastResetDate: today,
    };
};

// =============================================================================
// REDUCER
// =============================================================================

function epitaphReducer(state: EpitaphState, action: EpitaphAction): EpitaphState {
    switch (action.type) {
        case 'SET_SUBSCRIPTION':
            localStorage.setItem('epitaph:subscription', JSON.stringify(action.payload));
            return { ...state, subscription: action.payload };

        case 'SET_AUTHENTICATED':
            return { ...state, isAuthenticated: action.payload };

        case 'SET_ACTIVE_FEATURE':
            return { ...state, activeFeature: action.payload };

        case 'SET_SIDEBAR_TAB':
            return { ...state, sidebarTab: action.payload };

        case 'TOGGLE_ANTHOLOGY':
            return {
                ...state,
                isAnthologyOpen: action.payload ?? !state.isAnthologyOpen,
                activeFeature: action.payload !== false ? 'fear_anthology' : state.activeFeature,
            };

        case 'TOGGLE_SEANCE':
            return {
                ...state,
                isSeanceOpen: action.payload ?? !state.isSeanceOpen,
                activeFeature: action.payload !== false ? 'seance_chamber' : state.activeFeature,
            };

        case 'TOGGLE_TENSION_CURVE':
            return {
                ...state,
                isTensionCurveVisible: action.payload ?? !state.isTensionCurveVisible,
                activeFeature: action.payload !== false ? 'tension_curve' : state.activeFeature,
            };

        case 'ADD_WORDS_WRITTEN':
            const newWordCount = state.wordsWrittenToday + action.payload;
            localStorage.setItem('epitaph:wordsToday', String(newWordCount));
            localStorage.setItem('epitaph:lastResetDate', state.lastResetDate);
            return { ...state, wordsWrittenToday: newWordCount };

        case 'USE_SEANCE_QUERY':
            const newQueryCount = state.seanceQueriesUsedToday + 1;
            localStorage.setItem('epitaph:seanceToday', String(newQueryCount));
            localStorage.setItem('epitaph:lastResetDate', state.lastResetDate);
            return { ...state, seanceQueriesUsedToday: newQueryCount };

        case 'RESET_DAILY_LIMITS':
            const today = new Date().toISOString().split('T')[0];
            localStorage.setItem('epitaph:wordsToday', '0');
            localStorage.setItem('epitaph:seanceToday', '0');
            localStorage.setItem('epitaph:lastResetDate', today);
            return {
                ...state,
                wordsWrittenToday: 0,
                seanceQueriesUsedToday: 0,
                lastResetDate: today,
            };

        default:
            return state;
    }
}

// =============================================================================
// CONTEXT
// =============================================================================

interface EpitaphContextValue {
    state: EpitaphState;
    dispatch: React.Dispatch<EpitaphAction>;

    // Computed values
    tierLimits: TierLimits;
    canUseSeance: boolean;
    canUseReaderSimulation: boolean;
    canUseBoneArchive: boolean;
    canUseCoven: boolean;
    seanceQueriesRemaining: number;

    // Actions
    setSubscription: (sub: UserSubscription) => void;
    toggleAnthology: (open?: boolean) => void;
    toggleSeance: (open?: boolean) => void;
    toggleTensionCurve: (open?: boolean) => void;
    setSidebarTab: (tab: SidebarTab) => void;
    trackWordsWritten: (count: number) => void;
    useSeanceQuery: () => boolean; // Returns false if limit reached
}

const EpitaphContext = createContext<EpitaphContextValue | null>(null);

// Tier limits constant (re-export from types)
const TIER_LIMITS_MAP: Record<SubscriptionTier, TierLimits> = {
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

// =============================================================================
// PROVIDER
// =============================================================================

interface EpitaphProviderProps {
    children: ReactNode;
}

export function EpitaphProvider({ children }: EpitaphProviderProps) {
    const [state, dispatch] = useReducer(epitaphReducer, undefined, getInitialState);

    // Check for daily limit reset
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        if (state.lastResetDate !== today) {
            dispatch({ type: 'RESET_DAILY_LIMITS' });
        }
    }, [state.lastResetDate]);

    // Computed values
    const tierLimits = TIER_LIMITS_MAP[state.subscription.tier];
    const seanceQueriesRemaining = tierLimits.seanceQueriesPerDay === Infinity
        ? Infinity
        : Math.max(0, tierLimits.seanceQueriesPerDay - state.seanceQueriesUsedToday);
    const canUseSeance = seanceQueriesRemaining > 0;
    const canUseReaderSimulation = tierLimits.hasReaderSimulation;
    const canUseBoneArchive = tierLimits.hasBoneArchive;
    const canUseCoven = tierLimits.hasCoven;

    // Actions
    const setSubscription = useCallback((sub: UserSubscription) => {
        dispatch({ type: 'SET_SUBSCRIPTION', payload: sub });
    }, []);

    const toggleAnthology = useCallback((open?: boolean) => {
        dispatch({ type: 'TOGGLE_ANTHOLOGY', payload: open });
    }, []);

    const toggleSeance = useCallback((open?: boolean) => {
        dispatch({ type: 'TOGGLE_SEANCE', payload: open });
    }, []);

    const toggleTensionCurve = useCallback((open?: boolean) => {
        dispatch({ type: 'TOGGLE_TENSION_CURVE', payload: open });
    }, []);

    const setSidebarTab = useCallback((tab: SidebarTab) => {
        dispatch({ type: 'SET_SIDEBAR_TAB', payload: tab });
    }, []);

    const trackWordsWritten = useCallback((count: number) => {
        dispatch({ type: 'ADD_WORDS_WRITTEN', payload: count });
    }, []);

    const useSeanceQuery = useCallback(() => {
        if (!canUseSeance) return false;
        dispatch({ type: 'USE_SEANCE_QUERY' });
        return true;
    }, [canUseSeance]);

    const value: EpitaphContextValue = {
        state,
        dispatch,
        tierLimits,
        canUseSeance,
        canUseReaderSimulation,
        canUseBoneArchive,
        canUseCoven,
        seanceQueriesRemaining,
        setSubscription,
        toggleAnthology,
        toggleSeance,
        toggleTensionCurve,
        setSidebarTab,
        trackWordsWritten,
        useSeanceQuery,
    };

    return (
        <EpitaphContext.Provider value={value}>
            {children}
        </EpitaphContext.Provider>
    );
}

// =============================================================================
// HOOK
// =============================================================================

export function useEpitaph() {
    const context = useContext(EpitaphContext);
    if (!context) {
        throw new Error('useEpitaph must be used within an EpitaphProvider');
    }
    return context;
}

// Export types
export type { EpitaphState, ActiveFeature, SidebarTab };

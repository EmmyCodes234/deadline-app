/**
 * Icon Registry - Source of truth for all icons in the DeadLine application
 * 
 * This registry maps all application icons to their gothic variants and tracks
 * migration status. Each entry includes the lucide-react component, variant,
 * usage locations, and migration status.
 * 
 * Requirements: 6.1, 6.2
 */

import {
  // Global Navigation & Utility
  Landmark,
  DoorOpen,
  ArrowLeft,
  ChevronLeft,
  X,
  XCircle,
  Menu,
  AlignJustify,
  Info,
  HelpCircle,
  
  // Authentication & User
  User,
  UserCircle2,
  LogIn,
  Key,
  LogOut,
  Ghost,
  Settings,
  Cog,
  
  // Haunting Ritual Mode
  Skull,
  Play,
  Flame,
  Pause,
  RefreshCw,
  RotateCcw,
  Lock,
  Unlock,
  Heart,
  Activity,
  Zap,
  Timer,
  
  // Grimoire Editor Mode
  BookOpen,
  ScrollText,
  FilePlus,
  PenTool,
  Edit,
  Pencil,
  Save,
  HardDrive,
  Trash2,
  Hash,
  Tally5,
  
  // Rewards & Status
  Medal,
  Trophy,
  Check,
  CheckCircle,
  AlertTriangle,
  AlertOctagon,
  Loader2,
} from 'lucide-react';

import { IconRegistry } from '@/types/iconRegistry';

/**
 * Complete icon registry for the DeadLine application
 * Organized by functional category
 */
export const iconRegistry: IconRegistry = {
  // ========================================
  // A. GLOBAL NAVIGATION & UTILITY
  // ========================================
  
  'nav-home-landmark': {
    name: 'DeadLine Hub (Home) - Landmark',
    component: Landmark,
    variant: 'soul',
    usage: [],
    migrated: false,
  },
  
  'nav-home-door': {
    name: 'DeadLine Hub (Home) - Door',
    component: DoorOpen,
    variant: 'soul',
    usage: ['Sidebar.tsx'],
    migrated: true,
  },
  
  'nav-back-arrow': {
    name: 'Back/Return - Arrow',
    component: ArrowLeft,
    variant: 'soul',
    usage: ['HauntingEditor.tsx'],
    migrated: true,
  },
  
  'nav-back-chevron': {
    name: 'Back/Return - Chevron',
    component: ChevronLeft,
    variant: 'soul',
    usage: [],
    migrated: false,
  },
  
  'action-close-x': {
    name: 'Close/Cancel - X',
    component: X,
    variant: 'blood',
    usage: ['AuthModal.tsx', 'Sidebar.tsx', 'LevelSelect.tsx'],
    migrated: true,
  },
  
  'action-close-circle': {
    name: 'Close/Cancel - X Circle',
    component: XCircle,
    variant: 'blood',
    usage: [],
    migrated: false,
  },
  
  'nav-menu': {
    name: 'Menu/Options - Menu',
    component: Menu,
    variant: 'soul',
    usage: [],
    migrated: false,
  },
  
  'nav-menu-justify': {
    name: 'Menu/Options - Align Justify',
    component: AlignJustify,
    variant: 'soul',
    usage: [],
    migrated: false,
  },
  
  'info-help': {
    name: 'Info/Help - Info',
    component: Info,
    variant: 'soul',
    usage: [],
    migrated: false,
  },
  
  'info-help-circle': {
    name: 'Info/Help - Help Circle',
    component: HelpCircle,
    variant: 'soul',
    usage: [],
    migrated: false,
  },
  
  // ========================================
  // B. AUTHENTICATION & USER
  // ========================================
  
  'user-profile': {
    name: 'Profile/User - User',
    component: User,
    variant: 'soul',
    usage: ['HauntingEditor.tsx'],
    migrated: true,
  },
  
  'user-profile-circle': {
    name: 'Profile/User - User Circle',
    component: UserCircle2,
    variant: 'soul',
    usage: [],
    migrated: false,
  },
  
  'auth-login': {
    name: 'Sign In/Login - Log In',
    component: LogIn,
    variant: 'soul',
    usage: [],
    migrated: false,
  },
  
  'auth-login-key': {
    name: 'Sign In/Login - Key',
    component: Key,
    variant: 'soul',
    usage: ['AuthModal.tsx'],
    migrated: false,
  },
  
  'auth-logout': {
    name: 'Sign Out/Logout - Log Out',
    component: LogOut,
    variant: 'soul',
    usage: ['HauntingEditor.tsx'],
    migrated: true,
  },
  
  'auth-logout-ghost': {
    name: 'Sign Out/Logout - Ghost',
    component: Ghost,
    variant: 'soul',
    usage: [],
    migrated: false,
  },
  
  'settings-cog': {
    name: 'Settings - Settings',
    component: Settings,
    variant: 'soul',
    usage: [],
    migrated: false,
  },
  
  'settings-gear': {
    name: 'Settings - Cog',
    component: Cog,
    variant: 'soul',
    usage: [],
    migrated: false,
  },
  
  // ========================================
  // C. HAUNTING RITUAL MODE
  // ========================================
  
  'ritual-mode-icon': {
    name: 'Haunting Ritual Mode Icon',
    component: Skull,
    variant: 'blood',
    usage: ['LevelSelect.tsx', 'HauntingEditor.tsx'],
    migrated: true,
  },
  
  'ritual-play': {
    name: 'Play/Begin - Play',
    component: Play,
    variant: 'blood',
    usage: ['LevelSelect.tsx'],
    migrated: true,
  },
  
  'ritual-play-flame': {
    name: 'Play/Begin - Flame',
    component: Flame,
    variant: 'blood',
    usage: ['LevelSelect.tsx'],
    migrated: true,
  },
  
  'ritual-pause': {
    name: 'Pause',
    component: Pause,
    variant: 'blood',
    usage: [],
    migrated: false,
  },
  
  'ritual-retry': {
    name: 'Retry/Replay - Refresh',
    component: RefreshCw,
    variant: 'blood',
    usage: [],
    migrated: false,
  },
  
  'ritual-retry-rotate': {
    name: 'Retry/Replay - Rotate',
    component: RotateCcw,
    variant: 'blood',
    usage: [],
    migrated: false,
  },
  
  'ritual-locked': {
    name: 'Locked Level',
    component: Lock,
    variant: 'blood',
    usage: ['LevelSelect.tsx'],
    migrated: true,
  },
  
  'ritual-unlocked': {
    name: 'Unlocked Level - Unlock',
    component: Unlock,
    variant: 'blood',
    usage: [],
    migrated: false,
  },
  
  'ritual-unlocked-door': {
    name: 'Unlocked Level - Door',
    component: DoorOpen,
    variant: 'blood',
    usage: [],
    migrated: false,
  },
  
  'ritual-patience-heart': {
    name: 'Patience/Sanity - Heart',
    component: Heart,
    variant: 'blood',
    usage: [],
    migrated: false,
  },
  
  'ritual-patience-activity': {
    name: 'Patience/Sanity - Activity',
    component: Activity,
    variant: 'blood',
    usage: [],
    migrated: false,
  },
  
  'ritual-speed-zap': {
    name: 'Speed/WPM - Zap',
    component: Zap,
    variant: 'blood',
    usage: [],
    migrated: false,
  },
  
  'ritual-speed-timer': {
    name: 'Speed/WPM - Timer',
    component: Timer,
    variant: 'blood',
    usage: [],
    migrated: false,
  },
  
  // ========================================
  // D. GRIMOIRE EDITOR MODE
  // ========================================
  
  'grimoire-mode-icon': {
    name: 'Grimoire Editor Mode Icon - Book',
    component: BookOpen,
    variant: 'arcane',
    usage: ['Sidebar.tsx', 'HauntingEditor.tsx'],
    migrated: true,
  },
  
  'grimoire-mode-scroll': {
    name: 'Grimoire Editor Mode Icon - Scroll',
    component: ScrollText,
    variant: 'arcane',
    usage: [],
    migrated: false,
  },
  
  'grimoire-new-file': {
    name: 'New Page/Story - File Plus',
    component: FilePlus,
    variant: 'arcane',
    usage: [],
    migrated: false,
  },
  
  'grimoire-new-pen': {
    name: 'New Page/Story - Pen Tool',
    component: PenTool,
    variant: 'arcane',
    usage: ['Sidebar.tsx'],
    migrated: true,
  },
  
  'grimoire-edit': {
    name: 'Edit - Edit',
    component: Edit,
    variant: 'arcane',
    usage: [],
    migrated: false,
  },
  
  'grimoire-edit-pencil': {
    name: 'Edit - Pencil',
    component: Pencil,
    variant: 'arcane',
    usage: [],
    migrated: false,
  },
  
  'grimoire-save': {
    name: 'Save - Save',
    component: Save,
    variant: 'arcane',
    usage: [],
    migrated: false,
  },
  
  'grimoire-save-drive': {
    name: 'Save - Hard Drive',
    component: HardDrive,
    variant: 'arcane',
    usage: [],
    migrated: false,
  },
  
  'grimoire-delete': {
    name: 'Delete/Trash',
    component: Trash2,
    variant: 'blood', // Destructive action always uses blood
    usage: ['Sidebar.tsx'],
    migrated: true,
  },
  
  'grimoire-wordcount-hash': {
    name: 'Word Count - Hash',
    component: Hash,
    variant: 'arcane',
    usage: [],
    migrated: false,
  },
  
  'grimoire-wordcount-tally': {
    name: 'Word Count - Tally',
    component: Tally5,
    variant: 'arcane',
    usage: [],
    migrated: false,
  },
  
  // ========================================
  // E. REWARDS & STATUS
  // ========================================
  
  'reward-skull': {
    name: 'Skull Score',
    component: Skull,
    variant: 'relic',
    usage: [],
    migrated: false,
  },
  
  'reward-achievement-medal': {
    name: 'Achievement - Medal',
    component: Medal,
    variant: 'relic',
    usage: ['LevelSelect.tsx'],
    migrated: true,
  },
  
  'reward-achievement-trophy': {
    name: 'Achievement - Trophy',
    component: Trophy,
    variant: 'relic',
    usage: [],
    migrated: false,
  },
  
  'status-success-check': {
    name: 'Success/Saved - Check',
    component: Check,
    variant: 'soul',
    usage: [],
    migrated: false,
  },
  
  'status-success-circle': {
    name: 'Success/Saved - Check Circle',
    component: CheckCircle,
    variant: 'soul',
    usage: [],
    migrated: false,
  },
  
  'status-error-triangle': {
    name: 'Error/Warning - Alert Triangle',
    component: AlertTriangle,
    variant: 'blood',
    usage: [],
    migrated: false,
  },
  
  'status-error-octagon': {
    name: 'Error/Warning - Alert Octagon',
    component: AlertOctagon,
    variant: 'blood',
    usage: [],
    migrated: false,
  },
  
  'status-loading': {
    name: 'Loading - Context Dependent',
    component: Loader2,
    variant: 'neutral', // Default, should be overridden based on context
    usage: ['AuthModal.tsx'],
    migrated: true,
  },
};

/**
 * Get all icons by category
 */
export const getIconsByCategory = () => {
  const categories = {
    navigation: Object.entries(iconRegistry).filter(([key]) => key.startsWith('nav-')),
    actions: Object.entries(iconRegistry).filter(([key]) => key.startsWith('action-')),
    info: Object.entries(iconRegistry).filter(([key]) => key.startsWith('info-')),
    user: Object.entries(iconRegistry).filter(([key]) => key.startsWith('user-')),
    auth: Object.entries(iconRegistry).filter(([key]) => key.startsWith('auth-')),
    settings: Object.entries(iconRegistry).filter(([key]) => key.startsWith('settings-')),
    ritual: Object.entries(iconRegistry).filter(([key]) => key.startsWith('ritual-')),
    grimoire: Object.entries(iconRegistry).filter(([key]) => key.startsWith('grimoire-')),
    reward: Object.entries(iconRegistry).filter(([key]) => key.startsWith('reward-')),
    status: Object.entries(iconRegistry).filter(([key]) => key.startsWith('status-')),
  };
  
  return categories;
};

/**
 * Get migration statistics
 */
export const getMigrationStats = () => {
  const total = Object.keys(iconRegistry).length;
  const migrated = Object.values(iconRegistry).filter(entry => entry.migrated).length;
  const remaining = total - migrated;
  const percentage = total > 0 ? Math.round((migrated / total) * 100) : 0;
  
  return {
    total,
    migrated,
    remaining,
    percentage,
  };
};

/**
 * Get icons by variant
 */
export const getIconsByVariant = (variant: 'blood' | 'arcane' | 'soul' | 'relic' | 'neutral') => {
  return Object.entries(iconRegistry)
    .filter(([, entry]) => entry.variant === variant)
    .map(([key, entry]) => ({ key, ...entry }));
};

/**
 * Get unmigrated icons
 */
export const getUnmigratedIcons = () => {
  return Object.entries(iconRegistry)
    .filter(([, entry]) => !entry.migrated)
    .map(([key, entry]) => ({ key, ...entry }));
};

/**
 * Mark an icon as migrated
 */
export const markIconAsMigrated = (iconKey: string, usageLocation: string) => {
  const icon = iconRegistry[iconKey];
  if (icon) {
    icon.migrated = true;
    if (!icon.usage.includes(usageLocation)) {
      icon.usage.push(usageLocation);
    }
  }
};

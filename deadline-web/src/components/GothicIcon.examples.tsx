/**
 * GothicIcon Usage Examples
 * 
 * This file contains practical examples of how to use the GothicIcon component
 * in various common scenarios throughout the DeadLine application.
 */

import React from 'react';
import { GothicIcon } from './GothicIcon';
import {
  Skull,
  BookOpen,
  User,
  Settings,
  Trash2,
  Edit,
  Save,
  Plus,
  ArrowLeft,
  X,
  Heart,
  Zap,
  Lock,
  Unlock,
  Medal,
  CheckCircle,
  AlertTriangle,
  Loader2,
  LogIn,
  LogOut,
  Hash,
} from 'lucide-react';

// ============================================================================
// EXAMPLE 1: Basic Icon Usage
// ============================================================================

/**
 * Simple icon display without interactivity
 */
export const BasicIconExample: React.FC = () => {
  return (
    <div className="flex items-center gap-4">
      <GothicIcon variant="blood" size="md">
        <Skull />
      </GothicIcon>
      
      <GothicIcon variant="arcane" size="lg">
        <BookOpen />
      </GothicIcon>
      
      <GothicIcon variant="soul" size="xl">
        <User />
      </GothicIcon>
      
      <GothicIcon variant="relic" size="md">
        <Medal />
      </GothicIcon>
    </div>
  );
};

// ============================================================================
// EXAMPLE 2: Interactive Button Icons
// ============================================================================

/**
 * Icons used as interactive buttons with proper accessibility
 */
export const InteractiveButtonExample: React.FC = () => {
  const handleDelete = () => console.log('Delete clicked');
  const handleEdit = () => console.log('Edit clicked');
  const handleSave = () => console.log('Save clicked');

  return (
    <div className="flex items-center gap-3">
      {/* Delete button - destructive action */}
      <button
        onClick={handleDelete}
        className="p-2 rounded hover:bg-red-900/20 transition-colors"
        title="Delete story"
      >
        <GothicIcon variant="blood" size="md" interactive aria-label="Delete story">
          <Trash2 />
        </GothicIcon>
      </button>

      {/* Edit button - creative action */}
      <button
        onClick={handleEdit}
        className="p-2 rounded hover:bg-purple-900/20 transition-colors"
        title="Edit story"
      >
        <GothicIcon variant="arcane" size="md" interactive aria-label="Edit story">
          <Edit />
        </GothicIcon>
      </button>

      {/* Save button - creative action */}
      <button
        onClick={handleSave}
        className="p-2 rounded hover:bg-purple-900/20 transition-colors"
        title="Save changes"
      >
        <GothicIcon variant="arcane" size="md" interactive aria-label="Save changes">
          <Save />
        </GothicIcon>
      </button>
    </div>
  );
};

// ============================================================================
// EXAMPLE 3: Navigation Icons
// ============================================================================

/**
 * Icons used in navigation menus and links
 */
export const NavigationExample: React.FC = () => {
  return (
    <nav className="flex flex-col gap-2 p-4 bg-gray-800 rounded-lg">
      {/* Back navigation */}
      <button className="flex items-center gap-3 p-2 rounded hover:bg-gray-700 transition-colors">
        <GothicIcon variant="soul" size="md" interactive aria-label="Go back">
          <ArrowLeft />
        </GothicIcon>
        <span>Back</span>
      </button>

      {/* Profile link */}
      <button className="flex items-center gap-3 p-2 rounded hover:bg-gray-700 transition-colors">
        <GothicIcon variant="soul" size="md" interactive aria-label="User profile">
          <User />
        </GothicIcon>
        <span>Profile</span>
      </button>

      {/* Settings link */}
      <button className="flex items-center gap-3 p-2 rounded hover:bg-gray-700 transition-colors">
        <GothicIcon variant="soul" size="md" interactive aria-label="Settings">
          <Settings />
        </GothicIcon>
        <span>Settings</span>
      </button>

      {/* Sign out */}
      <button className="flex items-center gap-3 p-2 rounded hover:bg-gray-700 transition-colors">
        <GothicIcon variant="soul" size="md" interactive aria-label="Sign out">
          <LogOut />
        </GothicIcon>
        <span>Sign Out</span>
      </button>
    </nav>
  );
};

// ============================================================================
// EXAMPLE 4: Decorative Icons
// ============================================================================

/**
 * Icons used purely for decoration alongside text
 * These use aria-hidden since the text provides context
 */
export const DecorativeIconExample: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* Page header with decorative icon */}
      <h1 className="flex items-center gap-3 text-3xl font-bold">
        <GothicIcon variant="arcane" size="xl" aria-hidden={true}>
          <BookOpen />
        </GothicIcon>
        <span>Grimoire Editor</span>
      </h1>

      {/* Status message with decorative icon */}
      <div className="flex items-center gap-2 text-green-400">
        <GothicIcon variant="soul" size="sm" aria-hidden={true}>
          <CheckCircle />
        </GothicIcon>
        <span>Story saved successfully</span>
      </div>

      {/* Skull score display */}
      <div className="flex items-center gap-2 text-amber-300">
        <GothicIcon variant="relic" size="md" aria-hidden={true}>
          <Skull />
        </GothicIcon>
        <span className="text-2xl font-bold">1,250</span>
        <span className="text-sm">Skull Score</span>
      </div>

      {/* Word count display */}
      <div className="flex items-center gap-2 text-purple-400">
        <GothicIcon variant="arcane" size="sm" aria-hidden={true}>
          <Hash />
        </GothicIcon>
        <span>2,847 words</span>
      </div>
    </div>
  );
};

// ============================================================================
// EXAMPLE 5: Mode Selection Cards
// ============================================================================

/**
 * Icons used in mode selection cards (Haunting Ritual vs Grimoire Editor)
 */
export const ModeSelectionExample: React.FC = () => {
  const [selectedMode, setSelectedMode] = React.useState<'haunting' | 'grimoire' | null>(null);

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Haunting Ritual Mode */}
      <button
        onClick={() => setSelectedMode('haunting')}
        className={`
          p-6 rounded-lg border-2 transition-all
          ${selectedMode === 'haunting' 
            ? 'border-red-500 bg-red-900/20' 
            : 'border-gray-700 bg-gray-800 hover:border-red-500/50'
          }
        `}
      >
        <div className="flex flex-col items-center gap-4">
          <GothicIcon variant="blood" size="xl" aria-hidden={true}>
            <Skull />
          </GothicIcon>
          <h3 className="text-xl font-bold">Haunting Ritual</h3>
          <p className="text-sm text-gray-400 text-center">
            Race against the clock to exorcise your writer's block
          </p>
        </div>
      </button>

      {/* Grimoire Editor Mode */}
      <button
        onClick={() => setSelectedMode('grimoire')}
        className={`
          p-6 rounded-lg border-2 transition-all
          ${selectedMode === 'grimoire' 
            ? 'border-purple-500 bg-purple-900/20' 
            : 'border-gray-700 bg-gray-800 hover:border-purple-500/50'
          }
        `}
      >
        <div className="flex flex-col items-center gap-4">
          <GothicIcon variant="arcane" size="xl" aria-hidden={true}>
            <BookOpen />
          </GothicIcon>
          <h3 className="text-xl font-bold">Grimoire Editor</h3>
          <p className="text-sm text-gray-400 text-center">
            Craft your stories in a peaceful, distraction-free space
          </p>
        </div>
      </button>
    </div>
  );
};

// ============================================================================
// EXAMPLE 6: Status Indicators
// ============================================================================

/**
 * Icons used to indicate various states and statuses
 */
export const StatusIndicatorExample: React.FC = () => {
  return (
    <div className="space-y-3">
      {/* Success state */}
      <div className="flex items-center gap-2 p-3 bg-green-900/20 border border-green-700 rounded">
        <GothicIcon variant="soul" size="md" aria-hidden={true}>
          <CheckCircle />
        </GothicIcon>
        <span className="text-green-400">Changes saved successfully</span>
      </div>

      {/* Error state */}
      <div className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-700 rounded">
        <GothicIcon variant="blood" size="md" aria-hidden={true}>
          <AlertTriangle />
        </GothicIcon>
        <span className="text-red-400">Failed to save changes</span>
      </div>

      {/* Loading state */}
      <div className="flex items-center gap-2 p-3 bg-gray-800 border border-gray-700 rounded">
        <GothicIcon variant="arcane" size="md" className="animate-spin">
          <Loader2 />
        </GothicIcon>
        <span className="text-gray-400">Saving changes...</span>
      </div>
    </div>
  );
};

// ============================================================================
// EXAMPLE 7: Locked/Unlocked States
// ============================================================================

/**
 * Icons showing locked and unlocked states for levels or features
 */
export const LockedStateExample: React.FC = () => {
  const [isUnlocked, setIsUnlocked] = React.useState(false);

  return (
    <div className="space-y-4">
      {/* Locked level */}
      <div className="flex items-center gap-3 p-4 bg-gray-800 rounded-lg opacity-50">
        <GothicIcon variant="blood" size="lg" disabled aria-label="Locked level">
          <Lock />
        </GothicIcon>
        <div>
          <h4 className="font-bold">Level 5: The Haunted Manor</h4>
          <p className="text-sm text-gray-400">Complete Level 4 to unlock</p>
        </div>
      </div>

      {/* Unlocked level */}
      <div className="flex items-center gap-3 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
        <GothicIcon variant="blood" size="lg" interactive aria-label="Unlocked level">
          <Unlock />
        </GothicIcon>
        <div>
          <h4 className="font-bold">Level 4: The Crypt</h4>
          <p className="text-sm text-gray-400">Available to play</p>
        </div>
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setIsUnlocked(!isUnlocked)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
      >
        <GothicIcon
          variant="soul"
          size="md"
          interactive
          disabled={!isUnlocked}
          aria-label={isUnlocked ? 'Unlocked' : 'Locked'}
        >
          {isUnlocked ? <Unlock /> : <Lock />}
        </GothicIcon>
        <span>{isUnlocked ? 'Unlocked' : 'Locked'}</span>
      </button>
    </div>
  );
};

// ============================================================================
// EXAMPLE 8: Toolbar Actions
// ============================================================================

/**
 * Icons used in a toolbar for common actions
 */
export const ToolbarExample: React.FC = () => {
  return (
    <div className="flex items-center gap-1 p-2 bg-gray-800 rounded-lg border border-gray-700">
      <button
        className="p-2 rounded hover:bg-gray-700 transition-colors"
        title="New story"
      >
        <GothicIcon variant="arcane" size="md" interactive aria-label="New story">
          <Plus />
        </GothicIcon>
      </button>

      <button
        className="p-2 rounded hover:bg-gray-700 transition-colors"
        title="Edit"
      >
        <GothicIcon variant="arcane" size="md" interactive aria-label="Edit">
          <Edit />
        </GothicIcon>
      </button>

      <button
        className="p-2 rounded hover:bg-gray-700 transition-colors"
        title="Save"
      >
        <GothicIcon variant="arcane" size="md" interactive aria-label="Save">
          <Save />
        </GothicIcon>
      </button>

      <div className="w-px h-6 bg-gray-700 mx-1" />

      <button
        className="p-2 rounded hover:bg-red-900/20 transition-colors"
        title="Delete"
      >
        <GothicIcon variant="blood" size="md" interactive aria-label="Delete">
          <Trash2 />
        </GothicIcon>
      </button>
    </div>
  );
};

// ============================================================================
// EXAMPLE 9: Game Stats Display
// ============================================================================

/**
 * Icons used to display game statistics in Haunting Ritual mode
 */
export const GameStatsExample: React.FC = () => {
  return (
    <div className="flex items-center gap-6 p-4 bg-gray-800 rounded-lg">
      {/* Patience/Sanity */}
      <div className="flex items-center gap-2">
        <GothicIcon variant="blood" size="md" aria-hidden={true}>
          <Heart />
        </GothicIcon>
        <div>
          <div className="text-xs text-gray-400">Patience</div>
          <div className="text-lg font-bold text-red-400">85%</div>
        </div>
      </div>

      {/* Speed/WPM */}
      <div className="flex items-center gap-2">
        <GothicIcon variant="blood" size="md" aria-hidden={true}>
          <Zap />
        </GothicIcon>
        <div>
          <div className="text-xs text-gray-400">Speed</div>
          <div className="text-lg font-bold text-red-400">42 WPM</div>
        </div>
      </div>

      {/* Skull Score */}
      <div className="flex items-center gap-2">
        <GothicIcon variant="relic" size="md" aria-hidden={true}>
          <Skull />
        </GothicIcon>
        <div>
          <div className="text-xs text-gray-400">Score</div>
          <div className="text-lg font-bold text-amber-300">1,250</div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// EXAMPLE 10: Modal Header
// ============================================================================

/**
 * Icons used in modal headers with close button
 */
export const ModalHeaderExample: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg border border-gray-700 w-full max-w-md">
        {/* Modal header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <GothicIcon variant="soul" size="lg" aria-hidden={true}>
              <Settings />
            </GothicIcon>
            <h2 className="text-xl font-bold">Settings</h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded hover:bg-gray-700 transition-colors"
          >
            <GothicIcon variant="blood" size="md" interactive aria-label="Close modal">
              <X />
            </GothicIcon>
          </button>
        </div>

        {/* Modal content */}
        <div className="p-4">
          <p className="text-gray-400">Modal content goes here...</p>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// EXAMPLE 11: Achievement Card
// ============================================================================

/**
 * Icons used in achievement/reward displays
 */
export const AchievementCardExample: React.FC = () => {
  return (
    <div className="p-6 bg-gradient-to-br from-amber-900/20 to-gray-800 rounded-lg border-2 border-amber-500/50">
      <div className="flex flex-col items-center gap-4 text-center">
        <GothicIcon variant="relic" size="xl" aria-label="Achievement unlocked">
          <Medal />
        </GothicIcon>
        <div>
          <h3 className="text-2xl font-bold text-amber-300">Achievement Unlocked!</h3>
          <p className="text-gray-400 mt-2">First Story Completed</p>
        </div>
        <div className="flex items-center gap-2 text-amber-300">
          <GothicIcon variant="relic" size="md" aria-hidden={true}>
            <Skull />
          </GothicIcon>
          <span className="text-xl font-bold">+500</span>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// EXAMPLE 12: Authentication Buttons
// ============================================================================

/**
 * Icons used in authentication UI
 */
export const AuthenticationExample: React.FC = () => {
  return (
    <div className="space-y-3 w-64">
      <button className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors">
        <GothicIcon variant="soul" size="md" interactive aria-label="Sign in">
          <LogIn />
        </GothicIcon>
        <span className="font-bold">Sign In</span>
      </button>

      <button className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
        <GothicIcon variant="soul" size="md" interactive aria-label="Sign out">
          <LogOut />
        </GothicIcon>
        <span className="font-bold">Sign Out</span>
      </button>
    </div>
  );
};

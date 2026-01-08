import React from 'react';
import { GothicIcon } from './GothicIcon';
import type { GothicIconVariant, GothicIconSize } from './GothicIcon';
import {
  Skull,
  Flame,
  BookOpen,
  User,
  Medal,
  Trash2,
  Edit,
  Settings,
  Heart,
  Zap,
  Lock,
  Unlock,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

/**
 * GothicIconShowcase - Visual reference guide for all GothicIcon variants and states
 * 
 * This component displays all available variants at all sizes, showing interactive
 * states and disabled states for comprehensive visual reference.
 */
export const GothicIconShowcase: React.FC = () => {
  const variants: GothicIconVariant[] = ['blood', 'arcane', 'soul', 'relic', 'neutral'];
  const sizes: GothicIconSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];

  const variantDescriptions: Record<GothicIconVariant, { name: string; meaning: string; color: string }> = {
    blood: {
      name: 'Blood',
      meaning: 'Danger, urgency, destructive actions',
      color: '🔴 Red/Orange',
    },
    arcane: {
      name: 'Arcane',
      meaning: 'Creativity, magic, writing',
      color: '🟣 Purple/Blue',
    },
    soul: {
      name: 'Soul',
      meaning: 'Navigation, user, settings, success',
      color: '🟢 Green/Teal',
    },
    relic: {
      name: 'Relic',
      meaning: 'Rewards, achievements, currency',
      color: '🟡 Gold/Bone',
    },
    neutral: {
      name: 'Neutral',
      meaning: 'Default, non-thematic',
      color: '⚪ Gray',
    },
  };

  return (
    <div className="p-8 bg-gray-900 text-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4 flex items-center gap-4">
            <GothicIcon variant="arcane" size="xl" aria-hidden={true}>
              <BookOpen />
            </GothicIcon>
            Gothic Icon Visual Reference
          </h1>
          <p className="text-gray-400 text-lg">
            A comprehensive showcase of all variants, sizes, and interactive states
          </p>
        </header>

        {/* Variants Overview */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Variants Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {variants.map((variant) => (
              <div
                key={variant}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700"
              >
                <div className="flex items-center gap-4 mb-4">
                  <GothicIcon variant={variant} size="xl" aria-hidden={true}>
                    <Skull />
                  </GothicIcon>
                  <div>
                    <h3 className="text-xl font-bold">{variantDescriptions[variant].name}</h3>
                    <p className="text-sm text-gray-400">{variantDescriptions[variant].color}</p>
                  </div>
                </div>
                <p className="text-gray-300">{variantDescriptions[variant].meaning}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Size Scale Reference */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Size Scale</h2>
          {variants.map((variant) => (
            <div key={variant} className="mb-8 bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 capitalize">{variant} Variant</h3>
              <div className="flex items-end gap-8">
                {sizes.map((size) => (
                  <div key={size} className="flex flex-col items-center gap-2">
                    <GothicIcon variant={variant} size={size} aria-label={`${variant} ${size}`}>
                      <Skull />
                    </GothicIcon>
                    <span className="text-xs text-gray-400 uppercase">{size}</span>
                    <span className="text-xs text-gray-500">
                      {size === 'xs' && '16px'}
                      {size === 'sm' && '20px'}
                      {size === 'md' && '24px'}
                      {size === 'lg' && '32px'}
                      {size === 'xl' && '48px'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Interactive States */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Interactive States</h2>
          <p className="text-gray-400 mb-6">
            Hover over icons to see glow intensification and scale effects. Click to see active state.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {variants.map((variant) => (
              <div
                key={variant}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700"
              >
                <h3 className="text-lg font-bold mb-4 capitalize">{variant}</h3>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <GothicIcon
                      variant={variant}
                      size="lg"
                      interactive
                      aria-label={`Interactive ${variant} icon`}
                    >
                      <Flame />
                    </GothicIcon>
                    <span className="text-sm text-gray-400">Hover me</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="p-2 rounded hover:bg-gray-700 transition-colors">
                      <GothicIcon
                        variant={variant}
                        size="md"
                        interactive
                        aria-label={`Button with ${variant} icon`}
                      >
                        <Heart />
                      </GothicIcon>
                    </button>
                    <span className="text-sm text-gray-400">In button</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Disabled States */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Disabled States</h2>
          <p className="text-gray-400 mb-6">
            Disabled icons have reduced opacity and no glow effects.
          </p>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
              {variants.map((variant) => (
                <div key={variant} className="flex flex-col items-center gap-3">
                  <div className="flex flex-col items-center gap-2">
                    <GothicIcon
                      variant={variant}
                      size="lg"
                      aria-label={`Normal ${variant} icon`}
                    >
                      <Lock />
                    </GothicIcon>
                    <span className="text-xs text-gray-400">Normal</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <GothicIcon
                      variant={variant}
                      size="lg"
                      disabled
                      aria-label={`Disabled ${variant} icon`}
                    >
                      <Lock />
                    </GothicIcon>
                    <span className="text-xs text-gray-400">Disabled</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Common Icon Examples */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Common Icon Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Haunting Ritual Mode */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-bold mb-4">🔴 Haunting Ritual Mode</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <GothicIcon variant="blood" size="lg" aria-hidden={true}>
                    <Skull />
                  </GothicIcon>
                  <span>Mode Icon</span>
                </div>
                <div className="flex items-center gap-3">
                  <GothicIcon variant="blood" size="md" interactive aria-label="Start">
                    <Flame />
                  </GothicIcon>
                  <span>Start/Play</span>
                </div>
                <div className="flex items-center gap-3">
                  <GothicIcon variant="blood" size="md" aria-hidden={true}>
                    <Heart />
                  </GothicIcon>
                  <span>Patience/Sanity</span>
                </div>
                <div className="flex items-center gap-3">
                  <GothicIcon variant="blood" size="md" aria-hidden={true}>
                    <Zap />
                  </GothicIcon>
                  <span>Speed/WPM</span>
                </div>
                <div className="flex items-center gap-3">
                  <GothicIcon variant="blood" size="md" interactive aria-label="Delete">
                    <Trash2 />
                  </GothicIcon>
                  <span>Delete (Destructive)</span>
                </div>
              </div>
            </div>

            {/* Grimoire Editor Mode */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-bold mb-4">🟣 Grimoire Editor Mode</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <GothicIcon variant="arcane" size="lg" aria-hidden={true}>
                    <BookOpen />
                  </GothicIcon>
                  <span>Mode Icon</span>
                </div>
                <div className="flex items-center gap-3">
                  <GothicIcon variant="arcane" size="md" interactive aria-label="Edit">
                    <Edit />
                  </GothicIcon>
                  <span>Edit</span>
                </div>
                <div className="flex items-center gap-3">
                  <GothicIcon variant="arcane" size="md" disabled aria-label="Locked">
                    <Lock />
                  </GothicIcon>
                  <span>Locked</span>
                </div>
                <div className="flex items-center gap-3">
                  <GothicIcon variant="arcane" size="md" aria-label="Unlocked">
                    <Unlock />
                  </GothicIcon>
                  <span>Unlocked</span>
                </div>
              </div>
            </div>

            {/* Navigation & User */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-bold mb-4">🟢 Navigation & User</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <GothicIcon variant="soul" size="md" interactive aria-label="Profile">
                    <User />
                  </GothicIcon>
                  <span>Profile</span>
                </div>
                <div className="flex items-center gap-3">
                  <GothicIcon variant="soul" size="md" interactive aria-label="Settings">
                    <Settings />
                  </GothicIcon>
                  <span>Settings</span>
                </div>
                <div className="flex items-center gap-3">
                  <GothicIcon variant="soul" size="md" aria-hidden={true}>
                    <CheckCircle />
                  </GothicIcon>
                  <span>Success</span>
                </div>
              </div>
            </div>

            {/* Rewards & Status */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-bold mb-4">🟡 Rewards & Status</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <GothicIcon variant="relic" size="lg" aria-hidden={true}>
                    <Skull />
                  </GothicIcon>
                  <span>Skull Score</span>
                </div>
                <div className="flex items-center gap-3">
                  <GothicIcon variant="relic" size="xl" aria-label="Achievement">
                    <Medal />
                  </GothicIcon>
                  <span>Achievement</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Error States */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Error & Warning States</h2>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <GothicIcon variant="blood" size="lg" aria-hidden={true}>
                  <AlertTriangle />
                </GothicIcon>
                <span>Error/Warning</span>
              </div>
              <div className="flex items-center gap-3">
                <GothicIcon variant="soul" size="lg" aria-hidden={true}>
                  <CheckCircle />
                </GothicIcon>
                <span>Success</span>
              </div>
            </div>
          </div>
        </section>

        {/* Usage Notes */}
        <section className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-2xl font-bold mb-4">Usage Notes</h2>
          <ul className="space-y-2 text-gray-300">
            <li>• All interactive icons automatically ensure 44x44px minimum touch targets</li>
            <li>• Glow effects scale proportionally with icon size</li>
            <li>• Transitions are smooth 300ms for all state changes</li>
            <li>• Interactive icons support both mouse and keyboard navigation</li>
            <li>• Disabled state removes glow and reduces opacity to 50%</li>
            <li>• Always include aria-label for interactive icons</li>
            <li>• Use aria-hidden for decorative icons with adjacent text</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

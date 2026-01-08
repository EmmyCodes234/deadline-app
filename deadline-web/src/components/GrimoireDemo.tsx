import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

export function GrimoireDemo() {
  const [selectedEditor, setSelectedEditor] = useState<'classic' | 'new'>('new');

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-zinc-950/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/hub"
                className="flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors px-3 py-2 rounded hover:bg-zinc-800/50"
              >
                <Icon icon="solar:arrow-left-bold" className="size-4" />
                <span className="text-sm">Back to Hub</span>
              </Link>
              <div className="h-6 w-px bg-white/10" />
              <div className="flex items-center gap-3">
                <Icon 
                  icon="solar:book-bold" 
                  className="size-6 text-red-400" 
                  style={{ filter: 'drop-shadow(0 0 10px rgba(220, 38, 38, 0.6))' }}
                />
                <h1 className="font-['Playfair_Display'] text-xl font-bold text-stone-100 uppercase tracking-wider">
                  Grimoire Editors
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-['Playfair_Display'] font-bold text-stone-100 mb-4">
            Choose Your Writing Experience
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Experience the evolution of dark writing. Choose between our atmospheric classic editor 
            or the modern, streamlined interface.
          </p>
        </div>

        {/* Editor Selection */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-zinc-900/50 rounded-lg p-1 border border-white/10">
            <button
              onClick={() => setSelectedEditor('new')}
              className={clsx(
                "px-6 py-3 rounded-md transition-all font-medium",
                selectedEditor === 'new'
                  ? "bg-red-950 text-red-200 border border-red-800"
                  : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              New Interface
            </button>
            <button
              onClick={() => setSelectedEditor('classic')}
              className={clsx(
                "px-6 py-3 rounded-md transition-all font-medium",
                selectedEditor === 'classic'
                  ? "bg-red-950 text-red-200 border border-red-800"
                  : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              Classic Interface
            </button>
          </div>
        </div>

        {/* Editor Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* New Editor Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={clsx(
              "relative overflow-hidden rounded-xl border transition-all duration-300",
              selectedEditor === 'new'
                ? "border-red-500 shadow-[0_0_30px_rgba(220,38,38,0.3)]"
                : "border-white/10 hover:border-white/20"
            )}
          >
            <div className="aspect-video bg-gradient-to-br from-zinc-900 to-zinc-950 relative overflow-hidden">
              {/* Mock Screenshot */}
              <div className="absolute inset-0 p-4">
                <div className="h-full bg-[#1a1816] rounded-lg border border-white/10 relative overflow-hidden">
                  {/* Mock Header */}
                  <div className="h-12 bg-zinc-950/50 border-b border-white/10 flex items-center px-4">
                    <div className="flex items-center gap-2">
                      <div className="size-3 bg-red-500 rounded-full opacity-60"></div>
                      <div className="size-3 bg-amber-500 rounded-full opacity-60"></div>
                      <div className="size-3 bg-green-500 rounded-full opacity-60"></div>
                    </div>
                    <div className="flex-1 flex justify-center">
                      <div className="text-xs text-zinc-400">New Grimoire Editor</div>
                    </div>
                  </div>
                  
                  {/* Mock Sidebar */}
                  <div className="absolute left-0 top-12 bottom-0 w-16 bg-zinc-900/50 border-r border-white/10">
                    <div className="p-2 space-y-2">
                      <div className="h-2 bg-zinc-700 rounded"></div>
                      <div className="h-2 bg-zinc-700 rounded w-3/4"></div>
                      <div className="h-2 bg-red-600 rounded w-1/2"></div>
                    </div>
                  </div>
                  
                  {/* Mock Content */}
                  <div className="ml-16 p-4 space-y-2">
                    <div className="h-3 bg-zinc-700 rounded w-1/3"></div>
                    <div className="h-2 bg-zinc-800 rounded"></div>
                    <div className="h-2 bg-zinc-800 rounded w-5/6"></div>
                    <div className="h-2 bg-zinc-800 rounded w-4/5"></div>
                  </div>
                  
                  {/* Mock Right Panel */}
                  <div className="absolute right-0 top-12 bottom-0 w-16 bg-purple-950/20 border-l border-purple-800/30">
                    <div className="p-2">
                      <div className="h-2 bg-purple-700 rounded mb-2"></div>
                      <div className="h-1 bg-purple-800 rounded mb-1"></div>
                      <div className="h-1 bg-purple-800 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Glow Effect */}
              {selectedEditor === 'new' && (
                <div className="absolute inset-0 bg-gradient-to-t from-red-500/10 to-transparent pointer-events-none" />
              )}
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-['Playfair_Display'] font-bold text-stone-100 mb-2">
                New Grimoire Editor
              </h3>
              <p className="text-zinc-400 mb-4 text-sm leading-relaxed">
                Modern, clean interface inspired by professional writing tools. Features tabbed documents, 
                AI assistant panel, and streamlined workflow for focused writing.
              </p>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <Icon icon="solar:check-circle-bold" className="size-4 text-green-400" />
                  <span>Tabbed document interface</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <Icon icon="solar:check-circle-bold" className="size-4 text-green-400" />
                  <span>Integrated AI assistant</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <Icon icon="solar:check-circle-bold" className="size-4 text-green-400" />
                  <span>Clean, distraction-free design</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <Icon icon="solar:check-circle-bold" className="size-4 text-green-400" />
                  <span>Rich text editing with TipTap</span>
                </div>
              </div>
              
              <Link
                to="/grimoire-new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-950 hover:bg-red-900 border border-red-800 rounded-lg text-red-200 hover:text-red-100 transition-all hover:shadow-[0_0_15px_rgba(220,38,38,0.5)] text-sm font-medium"
              >
                <Icon icon="solar:play-bold" className="size-4" />
                Try New Editor
              </Link>
            </div>
          </motion.div>

          {/* Classic Editor Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={clsx(
              "relative overflow-hidden rounded-xl border transition-all duration-300",
              selectedEditor === 'classic'
                ? "border-red-500 shadow-[0_0_30px_rgba(220,38,38,0.3)]"
                : "border-white/10 hover:border-white/20"
            )}
          >
            <div className="aspect-video bg-gradient-to-br from-zinc-900 to-zinc-950 relative overflow-hidden">
              {/* Mock Screenshot */}
              <div className="absolute inset-0 p-4">
                <div className="h-full bg-[#1a1816] rounded-lg border border-white/10 relative overflow-hidden">
                  {/* Mock Header */}
                  <div className="h-12 bg-zinc-950/50 border-b border-white/10 flex items-center px-4">
                    <div className="flex items-center gap-2">
                      <div className="size-3 bg-red-500 rounded-full opacity-60"></div>
                      <div className="size-3 bg-amber-500 rounded-full opacity-60"></div>
                      <div className="size-3 bg-green-500 rounded-full opacity-60"></div>
                    </div>
                    <div className="flex-1 flex justify-center">
                      <div className="text-xs text-zinc-400">Classic Grimoire</div>
                    </div>
                  </div>
                  
                  {/* Mock Sidebar */}
                  <div className="absolute left-0 top-12 bottom-0 w-20 bg-zinc-900/80 border-r border-white/10">
                    <div className="p-2 space-y-2">
                      <div className="h-2 bg-amber-700 rounded"></div>
                      <div className="h-2 bg-zinc-700 rounded w-3/4"></div>
                      <div className="h-2 bg-zinc-700 rounded w-1/2"></div>
                    </div>
                  </div>
                  
                  {/* Mock Content - More atmospheric */}
                  <div className="ml-20 mr-20 p-4 space-y-2">
                    <div className="h-4 bg-zinc-600 rounded w-1/2 mb-4"></div>
                    <div className="h-2 bg-zinc-700 rounded"></div>
                    <div className="h-2 bg-zinc-700 rounded w-5/6"></div>
                    <div className="h-2 bg-zinc-700 rounded w-4/5"></div>
                    <div className="h-2 bg-zinc-700 rounded w-3/4"></div>
                  </div>
                  
                  {/* Mock Right Panel */}
                  <div className="absolute right-0 top-12 bottom-0 w-20 bg-red-950/20 border-l border-red-800/30">
                    <div className="p-2">
                      <div className="h-2 bg-red-700 rounded mb-2"></div>
                      <div className="h-1 bg-red-800 rounded mb-1"></div>
                      <div className="h-1 bg-red-800 rounded w-3/4"></div>
                    </div>
                  </div>
                  
                  {/* Atmospheric effects */}
                  <div className="absolute inset-0 bg-gradient-to-br from-red-950/5 to-transparent pointer-events-none"></div>
                </div>
              </div>
              
              {/* Glow Effect */}
              {selectedEditor === 'classic' && (
                <div className="absolute inset-0 bg-gradient-to-t from-red-500/10 to-transparent pointer-events-none" />
              )}
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-['Playfair_Display'] font-bold text-stone-100 mb-2">
                Classic Grimoire
              </h3>
              <p className="text-zinc-400 mb-4 text-sm leading-relaxed">
                The original atmospheric writing experience. Immersive gothic interface with ritual mode, 
                atmospheric effects, and deep customization for the ultimate horror writing experience.
              </p>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <Icon icon="solar:check-circle-bold" className="size-4 text-green-400" />
                  <span>Atmospheric fog and effects</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <Icon icon="solar:check-circle-bold" className="size-4 text-green-400" />
                  <span>Ritual mode for deep focus</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <Icon icon="solar:check-circle-bold" className="size-4 text-green-400" />
                  <span>Gothic theming throughout</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <Icon icon="solar:check-circle-bold" className="size-4 text-green-400" />
                  <span>Corkboard and continuous scroll</span>
                </div>
              </div>
              
              <Link
                to="/grimoire"
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-950 hover:bg-amber-900 border border-amber-800 rounded-lg text-amber-200 hover:text-amber-100 transition-all hover:shadow-[0_0_15px_rgba(217,119,6,0.5)] text-sm font-medium"
              >
                <Icon icon="solar:play-bold" className="size-4" />
                Try Classic Editor
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Feature Comparison */}
        <div className="mt-16">
          <h3 className="text-2xl font-['Playfair_Display'] font-bold text-stone-100 text-center mb-8">
            Feature Comparison
          </h3>
          
          <div className="bg-zinc-900/50 rounded-xl border border-white/10 overflow-hidden">
            <div className="grid grid-cols-3 gap-px bg-white/10">
              {/* Header */}
              <div className="bg-zinc-900/50 p-4">
                <h4 className="font-medium text-zinc-300">Feature</h4>
              </div>
              <div className="bg-zinc-900/50 p-4 text-center">
                <h4 className="font-medium text-red-300">New Editor</h4>
              </div>
              <div className="bg-zinc-900/50 p-4 text-center">
                <h4 className="font-medium text-amber-300">Classic Editor</h4>
              </div>
              
              {/* Rows */}
              {[
                { feature: 'Tabbed Documents', new: true, classic: false },
                { feature: 'AI Assistant Panel', new: true, classic: true },
                { feature: 'Rich Text Editing', new: true, classic: false },
                { feature: 'Atmospheric Effects', new: false, classic: true },
                { feature: 'Ritual Focus Mode', new: true, classic: true },
                { feature: 'Corkboard View', new: false, classic: true },
                { feature: 'Clean Interface', new: true, classic: false },
                { feature: 'Gothic Theming', new: true, classic: true },
              ].map((row, index) => (
                <div key={index} className="contents">
                  <div className="bg-zinc-900/30 p-4 text-sm text-zinc-300">
                    {row.feature}
                  </div>
                  <div className="bg-zinc-900/30 p-4 text-center">
                    {row.new ? (
                      <Icon icon="solar:check-circle-bold" className="size-5 text-green-400 mx-auto" />
                    ) : (
                      <Icon icon="solar:close-circle-bold" className="size-5 text-zinc-600 mx-auto" />
                    )}
                  </div>
                  <div className="bg-zinc-900/30 p-4 text-center">
                    {row.classic ? (
                      <Icon icon="solar:check-circle-bold" className="size-5 text-green-400 mx-auto" />
                    ) : (
                      <Icon icon="solar:close-circle-bold" className="size-5 text-zinc-600 mx-auto" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
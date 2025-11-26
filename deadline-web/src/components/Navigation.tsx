import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  Home, 
  Award, 
  Settings, 
  User, 
  LogOut, 
  Menu, 
  X,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { AuthModal } from './AuthModal';
import clsx from 'clsx';

interface NavigationProps {
  variant?: 'full' | 'minimal';
  showBackButton?: boolean;
  backTo?: string;
  className?: string;
}

export function Navigation({ 
  variant = 'full', 
  showBackButton = false,
  backTo = '/hub',
  className 
}: NavigationProps) {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/hub');
  };

  if (variant === 'minimal') {
    return (
      <nav className={clsx(
        "fixed top-0 left-0 right-0 z-50 bg-zinc-950/90 backdrop-blur-md border-b border-white/10",
        className
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Back or Logo */}
            {showBackButton ? (
              <Link
                to={backTo}
                className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group"
              >
                <ChevronRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium uppercase tracking-wider">Back</span>
              </Link>
            ) : (
              <Link to="/hub" className="flex items-center gap-2">
                <Home className="w-6 h-6 text-zinc-500 hover:text-red-500 transition-colors" />
              </Link>
            )}

            {/* Right: User Menu */}
            <div className="relative">
              {user ? (
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-900/50 hover:bg-zinc-800/50 border border-white/10 transition-all"
                >
                  <User className="w-4 h-4 text-zinc-400" />
                  <span className="text-sm text-zinc-300 max-w-[120px] truncate hidden sm:block">
                    {user.email?.split('@')[0] || 'VESSEL'}
                  </span>
                </Link>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => setShowAuthModal(false)}
        />
      </nav>
    );
  }

  // Full navigation variant - Immersive Game HUD
  return (
    <>
      {/* Desktop HUD */}
      <nav className={clsx(
        "hidden lg:block absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent pointer-events-none",
        className
      )}>
        <div className="max-w-7xl mx-auto w-full px-8 py-6">
          <div className="flex items-center justify-between">
            {/* Left: Home Icon */}
            <Link 
              to="/hub" 
              className="pointer-events-auto group"
              aria-label="Return to Hub"
            >
              <Home className="w-6 h-6 text-zinc-500 hover:text-red-500 transition-colors" />
            </Link>

            {/* Right: HUD Controls */}
            <div className="flex items-center gap-3 pointer-events-auto">
              {/* Vessel Badge */}
              {user ? (
                <div className="flex items-center gap-3 px-4 py-2 bg-zinc-900/50 backdrop-blur-md rounded-full border border-white/5">
                  <User className="w-4 h-4 text-zinc-400" />
                  <span className="text-xs tracking-widest uppercase text-zinc-300">
                    VESSEL: {user.email?.split('@')[0] || 'SCRIBE'}
                  </span>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-zinc-900/50 backdrop-blur-md rounded-full border border-white/5 hover:border-red-500/30 transition-colors"
                >
                  <User className="w-4 h-4 text-zinc-400" />
                  <span className="text-xs tracking-widest uppercase text-zinc-400">
                    FORGE COVENANT
                  </span>
                </button>
              )}

              {/* Profile Icon */}
              <Link
                to="/profile"
                className="p-2.5 bg-zinc-900/50 backdrop-blur-md rounded-full border border-white/5 hover:border-blue-500/30 transition-colors group"
                aria-label="Profile"
              >
                <Award className="w-5 h-5 text-zinc-400 group-hover:text-blue-400 transition-colors" />
              </Link>

              {/* Settings Icon */}
              <Link
                to="/settings"
                className="p-2.5 bg-zinc-900/50 backdrop-blur-md rounded-full border border-white/5 hover:border-green-500/30 transition-colors group"
                aria-label="Settings"
              >
                <Settings className="w-5 h-5 text-zinc-400 group-hover:text-green-400 transition-colors" />
              </Link>

              {/* Sever Connection (Logout) */}
              {user && (
                <button
                  onClick={handleSignOut}
                  className="p-2.5 bg-zinc-900/50 backdrop-blur-md rounded-full border border-white/5 hover:border-red-500/30 transition-colors group"
                  aria-label="Sign Out"
                >
                  <LogOut className="w-5 h-5 text-zinc-400 group-hover:text-red-400 transition-colors" />
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile HUD */}
      <nav className="lg:hidden absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Home Icon */}
            <Link to="/hub" aria-label="Return to Hub">
              <Home className="w-6 h-6 text-zinc-500" />
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 bg-zinc-900/50 backdrop-blur-md rounded-full border border-white/5"
            >
              {showMobileMenu ? <X className="w-5 h-5 text-zinc-400" /> : <Menu className="w-5 h-5 text-zinc-400" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-black/95 backdrop-blur-md border-t border-white/10"
            >
              <div className="px-4 py-4 space-y-3">
                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/profile"
                    onClick={() => setShowMobileMenu(false)}
                    className="flex flex-col items-center gap-2 p-4 bg-zinc-900/50 rounded-lg border border-white/5"
                  >
                    <Award className="w-6 h-6 text-blue-400" />
                    <span className="text-xs uppercase tracking-wider text-zinc-300">Profile</span>
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setShowMobileMenu(false)}
                    className="flex flex-col items-center gap-2 p-4 bg-zinc-900/50 rounded-lg border border-white/5"
                  >
                    <Settings className="w-6 h-6 text-green-400" />
                    <span className="text-xs uppercase tracking-wider text-zinc-300">Settings</span>
                  </Link>
                </div>

                {/* User Section */}
                <div className="pt-3 border-t border-white/10">
                  {user ? (
                    <>
                      <div className="px-3 py-2 mb-3 bg-zinc-900/50 rounded-lg border border-white/5">
                        <div className="text-xs text-zinc-500 mb-1">Vessel</div>
                        <div className="text-sm text-zinc-300 uppercase tracking-wider">
                          {user.email?.split('@')[0] || 'SCRIBE'}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          handleSignOut();
                          setShowMobileMenu(false);
                        }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg transition-colors border border-red-900/30"
                      >
                        <LogOut className="w-5 h-5" />
                        <span className="text-sm uppercase tracking-wider">Sever Connection</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        setShowAuthModal(true);
                        setShowMobileMenu(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      <User className="w-5 h-5" />
                      <span className="text-sm uppercase tracking-wider">Forge Covenant</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => setShowAuthModal(false)}
      />
    </>
  );
}

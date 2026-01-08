import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Mail, Lock, X as CloseIcon, Loader2 } from 'lucide-react';
import { Icon } from '@iconify/react';
import { GothicIcon } from './GothicIcon';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLoginView) {
        // Login
        const { error: authError } = await signInWithEmail(email, password);
        if (authError) {
          setError((authError as any)?.message || 'Failed to sign in');
        } else {
          onSuccess();
          onClose();
        }
      } else {
        // Sign up
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        if (password.length < 6) {
          setError('Password must be at least 6 characters');
          setLoading(false);
          return;
        }

        const { error: authError } = await signUpWithEmail(email, password);
        if (authError) {
          setError((authError as any)?.message || 'Failed to sign up');
        } else {
          onSuccess();
          onClose();
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      const { error: authError } = await signInWithGoogle();
      if (authError) {
        setError((authError as any)?.message || 'Failed to sign in with Google');
        setLoading(false);
      }
      // Note: Google OAuth will redirect, so we don't call onSuccess here
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setError('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-sm animate-in fade-in duration-300 pointer-events-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        {/* Modal Dialog */}
        <div className="relative w-full max-w-md bg-stone-900 border-4 border-purple-900/50 rounded-lg shadow-2xl shadow-purple-900/50 animate-in zoom-in duration-300">
        {/* Glowing Border Effect */}
        <div className="absolute -inset-1 rounded-lg border-2 border-purple-500/30 blur-sm"></div>

        <div className="relative z-10 p-8">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-stone-400 hover:text-stone-200 transition-colors"
            disabled={loading}
            aria-label="Close modal"
          >
            <GothicIcon variant="blood" size="md">
              <CloseIcon />
            </GothicIcon>
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <Icon 
              icon="game-icons:pentagram-rose" 
              className="w-16 h-16 mx-auto mb-4 text-purple-500 animate-pulse"
              style={{ filter: 'drop-shadow(0 0 20px rgba(168, 85, 247, 0.6))' }}
            />
            <h2 className="text-3xl font-['Creepster'] text-purple-400 mb-2 tracking-wider">
              {isLoginView ? 'ENTER THE REALM' : 'JOIN THE DAMNED'}
            </h2>
            <p className="text-stone-400 text-sm font-['Playfair_Display'] italic">
              {isLoginView 
                ? 'Sign in to save your progress across the void' 
                : 'Create an account to preserve your dark journey'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-red-900/30 border border-red-700/50 rounded text-red-300 text-sm animate-in slide-in-from-top duration-300">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-stone-300 text-sm font-mono uppercase tracking-wider mb-2">
                <Mail className="inline w-4 h-4 mr-2" />
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-stone-800/50 border border-stone-700 rounded text-stone-200 placeholder-stone-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                placeholder="your@email.com"
                required
                disabled={loading}
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-stone-300 text-sm font-mono uppercase tracking-wider mb-2">
                <Lock className="inline w-4 h-4 mr-2" />
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-stone-800/50 border border-stone-700 rounded text-stone-200 placeholder-stone-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            {/* Confirm Password (Sign Up Only) */}
            {!isLoginView && (
              <div>
                <label className="block text-stone-300 text-sm font-mono uppercase tracking-wider mb-2">
                  <Lock className="inline w-4 h-4 mr-2" />
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-stone-800/50 border border-stone-700 rounded text-stone-200 placeholder-stone-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white font-['Creepster'] text-xl tracking-wider rounded border-b-4 border-purple-900 hover:border-b-2 active:border-b-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-900/50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <GothicIcon variant="neutral" size="sm" className="animate-spin">
                    <Loader2 />
                  </GothicIcon>
                  {isLoginView ? 'SIGNING IN...' : 'CREATING ACCOUNT...'}
                </span>
              ) : (
                isLoginView ? 'SIGN IN' : 'SIGN UP'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-stone-900 text-stone-500 font-mono uppercase tracking-wider">
                Or
              </span>
            </div>
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-3 bg-white hover:bg-gray-100 text-gray-800 font-semibold rounded border border-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            <Icon icon="logos:google-icon" className="w-5 h-5" />
            Sign in with Google
          </button>

          {/* Toggle View */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={toggleView}
              disabled={loading}
              className="text-purple-400 hover:text-purple-300 text-sm font-['Playfair_Display'] italic transition-colors disabled:opacity-50"
            >
              {isLoginView 
                ? "Don't have an account? Sign up" 
                : 'Already have an account? Sign in'}
            </button>
          </div>

          {/* Guest Mode Notice */}
          <div className="mt-6 p-3 bg-stone-800/50 border border-stone-700 rounded text-center">
            <p className="text-stone-400 text-xs font-['Playfair_Display']">
              Playing as a guest? Your progress will be lost when you close the browser.
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

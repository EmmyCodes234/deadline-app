import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface InvocationSplashProps {
  onComplete: () => void;
}

export function InvocationSplash({ onComplete }: InvocationSplashProps) {
  const [name, setName] = useState('');
  const [isExiting, setIsExiting] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-focus input on mount
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      // Shake animation for empty input
      inputRef.current?.classList.add('animate-shake');
      setTimeout(() => {
        inputRef.current?.classList.remove('animate-shake');
      }, 500);
      return;
    }

    // Save to localStorage
    localStorage.setItem('scribe_name', name.trim());
    
    // Flash effect
    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 100);
    
    // Start exit animation
    setIsExiting(true);
    
    // Complete onboarding and navigate
    setTimeout(() => {
      onComplete();
      navigate('/hub');
    }, 2000);
  };

  return (
    <>
      {/* Main Container */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: isExiting ? 0 : 1 }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
        className="fixed inset-0 bg-black flex items-center justify-center z-50 pointer-events-auto"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isExiting ? 0 : 1 }}
          transition={{ duration: isExiting ? 0.5 : 1 }}
          className="flex flex-col items-center gap-8 px-8 max-w-2xl w-full"
        >
          {/* The Prompt */}
          <motion.h1
            animate={{
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="text-4xl md:text-5xl text-white/90 text-center font-serif tracking-wide"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Identify Yourself, Writer.
          </motion.h1>

          {/* The Input */}
          <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-6">
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent border-0 border-b-2 border-white/40 focus:border-white text-4xl text-white text-center pb-3 outline-none transition-all caret-red-500 placeholder:text-white/20"
              placeholder="Your name..."
              autoComplete="off"
              style={{ fontFamily: "'Courier Prime', monospace" }}
            />
            
            {/* Bind Name Button */}
            <button
              type="submit"
              className="px-8 py-3 bg-red-900/30 hover:bg-red-900/50 border border-red-700/50 hover:border-red-600 text-white text-lg font-semibold tracking-wider uppercase transition-all duration-300 rounded-lg shadow-lg hover:shadow-red-900/50"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Bind Your Name
            </button>
            
            {/* Remain Anonymous */}
            <button
              type="button"
              onClick={() => {
                localStorage.setItem('scribe_name', 'Anonymous');
                setIsExiting(true);
                setTimeout(() => {
                  onComplete();
                  navigate('/hub');
                }, 1000);
              }}
              className="text-white/40 hover:text-white/70 text-sm transition-colors underline"
            >
              Remain Anonymous
            </button>
          </form>
        </motion.div>
      </motion.div>

      {/* Flash Effect */}
      {showFlash && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.1 }}
          className="fixed inset-0 z-[60] pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)'
          }}
        />
      )}
    </>
  );
}

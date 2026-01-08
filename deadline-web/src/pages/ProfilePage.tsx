import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useUserProfile } from '../hooks/useUserProfile';
import { User, Camera, Upload } from 'lucide-react';
import { Navigation } from '../components/Navigation';

const AVATAR_STORAGE_KEY = 'scribe_avatar';
const EPITAPH_STORAGE_KEY = 'scribe_epitaph';

export function ProfilePage() {
  const { user } = useAuth();
  const { profile, updateProfile, uploadAvatar, getDisplayName } = useUserProfile();
  const [localBio, setLocalBio] = useState('');
  const [localAvatar, setLocalAvatar] = useState<string>('');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load avatar and epitaph from localStorage on mount
  useEffect(() => {
    const savedAvatar = localStorage.getItem(AVATAR_STORAGE_KEY);
    if (savedAvatar) {
      setLocalAvatar(savedAvatar);
    }
    
    const savedEpitaph = localStorage.getItem(EPITAPH_STORAGE_KEY);
    if (savedEpitaph) {
      setLocalBio(savedEpitaph);
    }
  }, []);

  // Auto-save bio to localStorage on blur
  const handleBioBlur = async () => {
    const trimmedBio = localBio.trim();
    
    // Save to localStorage immediately
    localStorage.setItem(EPITAPH_STORAGE_KEY, trimmedBio);
    
    // Also try to save to backend (optional)
    if (trimmedBio !== (profile?.bio || '')) {
      const result = await updateProfile({
        bio: trimmedBio
      });
      
      if (!result?.success) {
        setSaveError(result?.error || 'Failed to save epitaph');
      } else {
        setSaveError(null);
      }
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setSaveError('Please select an image file');
      return;
    }

    // Validate file size (2MB max for localStorage)
    if (file.size > 2 * 1024 * 1024) {
      setSaveError('Image must be less than 2MB');
      return;
    }

    setSaveError(null);
    setUploadingAvatar(true);

    try {
      // Convert to Base64
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        
        // Save to localStorage immediately
        localStorage.setItem(AVATAR_STORAGE_KEY, base64String);
        setLocalAvatar(base64String);
        setUploadingAvatar(false);
        
        // Also try to upload to Supabase in background (optional)
        uploadToSupabase(file);
      };
      
      reader.onerror = () => {
        setSaveError('Failed to read image');
        setUploadingAvatar(false);
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      setSaveError('Failed to process image');
      setUploadingAvatar(false);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Optional: Upload to Supabase in background
  const uploadToSupabase = async (file: File) => {
    try {
      await uploadAvatar(file);
    } catch (error) {
      // Silent fail - localStorage is primary
      console.log('Background upload to Supabase failed:', error);
    }
  };

  const displayName = getDisplayName();
  const handle = user?.email?.split('@')[0] || profile?.username || 'anonymous';
  
  // Determine which avatar to show: localStorage > Supabase > default
  const avatarSrc = localAvatar || profile?.avatar_url;

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Navigation */}
      <Navigation variant="minimal" showBackButton backTo="/hub" />

      {/* Background - Video */}
      <div className="fixed inset-0 -z-10">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          poster="/bg-graveyard.jpg"
          style={{
            filter: 'brightness(0.3) contrast(1.2) saturate(0.9)',
          }}
        >
          <source src="/bg-graveyard-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* Identity Shard - Centered */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-24">
        <motion.div 
          className="w-full max-w-md"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Identity Shard - Heavy Glassmorphism */}
          <div 
            className="relative bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden identity-shard"
            style={{
              boxShadow: '0 0 40px -10px rgba(220, 38, 38, 0.3), 0 0 60px rgba(255, 255, 255, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            }}
          >
            {/* Spectral Glow - Softer */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                background: 'radial-gradient(circle at 50% 0%, rgba(220, 38, 38, 0.15) 0%, transparent 60%)',
              }}
            />

            {/* Content */}
            <div className="relative z-10 p-10">
              {/* Avatar - Large Focal Point - The Mirror */}
              <div className="flex flex-col items-center mb-12">
                <div className="relative mb-8 group">
                  <div 
                    className="w-40 h-40 flex items-center justify-center overflow-hidden rounded-full cursor-pointer"
                    style={{
                      background: avatarSrc 
                        ? 'transparent'
                        : 'linear-gradient(135deg, rgba(220, 38, 38, 0.4), rgba(127, 29, 29, 0.4))',
                      boxShadow: '0 0 40px -10px rgba(220, 38, 38, 0.4), 0 0 60px rgba(220, 38, 38, 0.2), inset 0 0 30px rgba(0, 0, 0, 0.5)',
                    }}
                    onClick={handleAvatarClick}
                  >
                    {avatarSrc ? (
                      <img 
                        src={avatarSrc} 
                        alt="Identity" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-20 h-20 text-red-400/80" strokeWidth={1.5} />
                    )}
                    
                    {/* Mirror Overlay - "Reform Visage" */}
                    <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center rounded-full gap-2">
                      {uploadingAvatar ? (
                        <>
                          <div className="animate-spin">
                            <Upload className="w-10 h-10 text-white" />
                          </div>
                          <p className="text-white text-xs font-serif uppercase tracking-widest">
                            Reforming...
                          </p>
                        </>
                      ) : (
                        <>
                          <Camera className="w-10 h-10 text-white" strokeWidth={1.5} />
                          <p className="text-white text-sm font-serif uppercase tracking-widest">
                            Reform Visage
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Hidden File Input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                {/* Display Name - Inscription Style with Text Shadow */}
                <h1 
                  className="text-5xl font-serif text-white mb-4 text-center tracking-wide px-4"
                  style={{
                    textShadow: '0 4px 12px rgba(0, 0, 0, 0.8), 0 2px 4px rgba(0, 0, 0, 0.6)',
                  }}
                >
                  {displayName}
                </h1>

                {/* Handle - Inscription Style (Read-only) */}
                <p className="text-sm font-sans text-stone-500 text-center tracking-wide mb-2">
                  @{handle}
                </p>
              </div>

              {/* Epitaph - Invisible Inscription Input */}
              <div className="w-full px-4">
                <textarea
                  value={localBio}
                  onChange={(e) => setLocalBio(e.target.value)}
                  onBlur={handleBioBlur}
                  className="w-full bg-transparent border-none text-stone-500 italic text-base leading-relaxed font-serif text-center outline-none focus:text-stone-200 focus:border-b focus:border-white/10 transition-all duration-300 resize-none py-4 px-2 epitaph-input"
                  placeholder="Inscribe your epitaph..."
                  rows={3}
                  maxLength={200}
                  spellCheck={false}
                />

                {saveError && (
                  <p className="text-red-400/80 text-xs text-center font-serif mt-2 animate-pulse">
                    {saveError}
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Custom Styles */}
      <style>{`
        /* Identity Shard Subtle Float */
        .identity-shard {
          animation: shardFloat 8s ease-in-out infinite;
        }

        @keyframes shardFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        /* Epitaph Input - Invisible with Subtle Focus */
        .epitaph-input {
          border-bottom: 1px solid transparent;
        }

        .epitaph-input:focus {
          border-bottom-color: rgba(255, 255, 255, 0.1);
        }

        .epitaph-input::placeholder {
          color: rgba(120, 113, 108, 0.5);
          font-style: italic;
        }
      `}</style>
    </div>
  );
}

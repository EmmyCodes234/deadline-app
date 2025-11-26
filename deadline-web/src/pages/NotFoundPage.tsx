import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Ghost, Home } from 'lucide-react';
import { horrorAudio } from '@/lib/audio/HorrorAudio';

export function NotFoundPage() {
  useEffect(() => {
    horrorAudio.playError();
  }, []);
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black flex items-center justify-center px-6">
      {/* 1. The Atmosphere - Reuses your global video background setup, but darker */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover opacity-20"
        >
          <source src="/bg-graveyard-video.mp4" type="video/mp4" />
        </video>
        {/* Heavy Overlay to create "The Void" */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950/90 to-black" />
        {/* Vignette for focus */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,black_100%)]" />
      </div>

      {/* 2. The Content Container */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl">
        {/* The Glitching 404 */}
        <div className="relative">
          <h1 
            className="text-[150px] md:text-[200px] font-['Creepster'] leading-none text-red-600 select-none mix-blend-difference relative z-10"
            style={{ textShadow: '4px 0 rgba(0,255,255,0.5), -4px 0 rgba(255,0,0,0.5)' }}
          >
            <span className="animate-glitch-twitch inline-block">4</span>
            <span className="animate-glitch-twitch animation-delay-200 inline-block">0</span>
            <span className="animate-glitch-twitch animation-delay-500 inline-block">4</span>
          </h1>
          {/* Sub-glow for depth */}
          <div className="absolute inset-0 blur-[50px] bg-red-800/30 -z-10 rounded-full animate-pulse-slow" />
        </div>

        {/* The Lore Headline */}
        <h2 className="text-3xl md:text-4xl font-['Playfair_Display'] text-zinc-100 mb-6 mt-4 tracking-wide">
          CONNECTION SEVERED
        </h2>

        {/* The Diegetic Explanation */}
        <p className="text-zinc-400 text-lg md:text-xl font-serif italic mb-12 max-w-md leading-relaxed">
          You have wandered too far into the void, Vessel. The path you seek does not exist in this realm. Turn back before you are consumed.
        </p>

        {/* The Exit Strategy (Ghost Button) */}
        <Link
          to="/hub"
          onClick={() => horrorAudio.playClick()}
          onMouseEnter={() => horrorAudio.playHover()}
          className="group relative px-8 py-4 border border-red-900/50 text-red-500 hover:text-red-100 hover:border-red-500 hover:bg-red-950/30 transition-all duration-500 uppercase tracking-[0.2em] text-sm flex items-center gap-4 overflow-hidden"
        >
          <Home className="w-5 h-5 relative z-10 transition-transform group-hover:-translate-x-1" />
          <span className="relative z-10">Return to Sanctuary</span>
          {/* Subtle electric surge on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700" />
        </Link>

        <div className="mt-16 text-zinc-600 flex items-center gap-2 text-sm uppercase tracking-widest opacity-50">
          <Ghost className="w-4 h-4" />
          <span>Error Code: VOID_WALKER</span>
        </div>
      </div>

      {/* Essential CSS for the Glitch Effect */}
      <style>{`
        @keyframes glitch-twitch {
          0% { transform: translate(0); }
          20% { transform: translate(-3px, 2px) skew(2deg); }
          40% { transform: translate(3px, -2px) skew(-2deg); }
          60% { transform: translate(-2px, 1px); }
          80% { transform: translate(2px, -1px) skew(1deg); }
          100% { transform: translate(0); }
        }
        
        .animate-glitch-twitch {
          animation: glitch-twitch 0.3s infinite linear alternate-reverse;
        }
        
        .animation-delay-200 { 
          animation-delay: 0.2s; 
        }
        
        .animation-delay-500 { 
          animation-delay: 0.5s; 
        }
        
        @keyframes pulse-slow {
          0%, 100% { 
            opacity: 0.3; 
            transform: scale(1); 
          }
          50% { 
            opacity: 0.6; 
            transform: scale(1.1); 
          }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}

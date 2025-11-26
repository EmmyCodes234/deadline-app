import { Link } from 'react-router-dom';
import { Skull, BookOpen, Award, Settings } from 'lucide-react';
import { Navigation } from './Navigation';
import { horrorAudio } from '@/lib/audio/HorrorAudio';

export function DeadLineHub() {

  return (
    <>
      {/* Fixed Background Layer - Does NOT scroll */}
      <div className="fixed inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          poster="/bg-graveyard.jpg"
          style={{
            filter: 'brightness(0.5) contrast(1.1) saturate(0.95)'
          }}
        >
          <source src="/bg-graveyard-video.mp4" type="video/mp4" />
        </video>
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* Scrollable Content Layer */}
      <div className="min-h-screen relative">
        {/* Navigation */}
        <Navigation variant="full" />
        
        {/* Content */}
        <div className="w-full relative z-10 flex flex-col items-center justify-start px-4 sm:px-6 lg:px-8 py-32 pb-96">
        {/* Title Section - Spectral Blade Look */}
        <h1 
          className="font-['Creepster'] text-7xl md:text-9xl tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-500 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] leading-none mb-16 text-center mt-32"
        >
          THE DEADLINE
        </h1>

        {/* Navigation Grid - Glass Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full mx-auto">
          {/* The Haunting Ritual */}
          <Link
            to="/haunting"
            onClick={() => horrorAudio.playClick()}
            onMouseEnter={() => horrorAudio.playHover()}
            className="group relative overflow-hidden rounded-lg transition-all duration-300"
          >
            {/* Glass Background */}
            <div className="absolute inset-0 bg-zinc-950/70 border border-white/10 group-hover:border-red-500 group-hover:bg-zinc-900/90 rounded-lg transition-all duration-300" />
            
            {/* Watermark Icon */}
            <div className="absolute -top-6 -right-6 opacity-5 text-zinc-500 rotate-12 pointer-events-none group-hover:text-red-500 transition-colors duration-300">
              <Skull className="w-48 h-48" strokeWidth={2.5} />
            </div>
            
            {/* Content */}
            <div className="relative z-10 px-6 py-6 flex flex-col items-start text-left">
              {/* Icon */}
              <Skull 
                className="w-10 h-10 mb-4 text-zinc-500 group-hover:text-white group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-300"
                strokeWidth={2.5}
              />
              
              {/* Title */}
              <h2 
                className="text-lg font-bold tracking-widest uppercase mb-3 text-zinc-300 group-hover:text-white transition-colors duration-300"
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  letterSpacing: '0.15em'
                }}
              >
                THE HAUNTING RITUAL
              </h2>
              
              {/* Description */}
              <p 
                className="text-zinc-300 text-sm font-medium leading-relaxed drop-shadow-md"
                style={{ 
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                Channel the Muse, complete the Rituals.
              </p>
            </div>
            
            {/* Hover Glow */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg"
              style={{
                boxShadow: '0 0 40px rgba(239, 68, 68, 0.4)'
              }}
            />
          </Link>

          {/* The Grimoire Editor */}
          <Link
            to="/grimoire"
            onClick={() => horrorAudio.playClick()}
            onMouseEnter={() => horrorAudio.playHover()}
            className="group relative overflow-hidden rounded-lg transition-all duration-300"
          >
            {/* Glass Background */}
            <div className="absolute inset-0 bg-zinc-950/70 border border-white/10 group-hover:border-purple-500 group-hover:bg-zinc-900/90 rounded-lg transition-all duration-300" />
            
            {/* Watermark Icon */}
            <div className="absolute -top-6 -right-6 opacity-5 text-zinc-500 rotate-12 pointer-events-none group-hover:text-purple-500 transition-colors duration-300">
              <BookOpen className="w-48 h-48" strokeWidth={2.5} />
            </div>
            
            {/* Content */}
            <div className="relative z-10 px-6 py-6 flex flex-col items-start text-left">
              {/* Icon */}
              <BookOpen 
                className="w-10 h-10 mb-4 text-zinc-500 group-hover:text-white group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-300"
                strokeWidth={2.5}
              />
              
              {/* Title */}
              <h2 
                className="text-lg font-bold tracking-widest uppercase mb-3 text-zinc-300 group-hover:text-white transition-colors duration-300"
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  letterSpacing: '0.15em'
                }}
              >
                THE GRIMOIRE EDITOR
              </h2>
              
              {/* Description */}
              <p 
                className="text-zinc-300 text-sm font-medium leading-relaxed drop-shadow-md"
                style={{ 
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                Craft your own tales of dread.
              </p>
            </div>
            
            {/* Hover Glow */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg"
              style={{
                boxShadow: '0 0 40px rgba(168, 85, 247, 0.4)'
              }}
            />
          </Link>

          {/* The Scribe's Sanctum */}
          <Link
            to="/profile"
            onClick={() => horrorAudio.playClick()}
            onMouseEnter={() => horrorAudio.playHover()}
            className="group relative overflow-hidden rounded-lg transition-all duration-300"
          >
            {/* Glass Background */}
            <div className="absolute inset-0 bg-zinc-950/70 border border-white/10 group-hover:border-blue-500 group-hover:bg-zinc-900/90 rounded-lg transition-all duration-300" />
            
            {/* Watermark Icon */}
            <div className="absolute -top-6 -right-6 opacity-5 text-zinc-500 rotate-12 pointer-events-none group-hover:text-blue-500 transition-colors duration-300">
              <Award className="w-48 h-48" strokeWidth={2.5} />
            </div>
            
            {/* Content */}
            <div className="relative z-10 px-6 py-6 flex flex-col items-start text-left">
              {/* Icon */}
              <Award 
                className="w-10 h-10 mb-4 text-zinc-500 group-hover:text-white group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-300"
                strokeWidth={2.5}
              />
              
              {/* Title */}
              <h2 
                className="text-lg font-bold tracking-widest uppercase mb-3 text-zinc-300 group-hover:text-white transition-colors duration-300"
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  letterSpacing: '0.15em'
                }}
              >
                THE SCRIBE'S SANCTUM
              </h2>
              
              {/* Description */}
              <p 
                className="text-zinc-300 text-sm font-medium leading-relaxed drop-shadow-md"
                style={{ 
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                View your progress and earned favors.
              </p>
            </div>
            
            {/* Hover Glow */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg"
              style={{
                boxShadow: '0 0 40px rgba(59, 130, 246, 0.4)'
              }}
            />
          </Link>

          {/* Settings / Abjurations */}
          <Link
            to="/settings"
            onClick={() => horrorAudio.playClick()}
            onMouseEnter={() => horrorAudio.playHover()}
            className="group relative overflow-hidden rounded-lg transition-all duration-300"
          >
            {/* Glass Background */}
            <div className="absolute inset-0 bg-zinc-950/70 border border-white/10 group-hover:border-green-500 group-hover:bg-zinc-900/90 rounded-lg transition-all duration-300" />
            
            {/* Watermark Icon */}
            <div className="absolute -top-6 -right-6 opacity-5 text-zinc-500 rotate-12 pointer-events-none group-hover:text-green-500 transition-colors duration-300">
              <Settings className="w-48 h-48" strokeWidth={2.5} />
            </div>
            
            {/* Content */}
            <div className="relative z-10 px-6 py-6 flex flex-col items-start text-left">
              {/* Icon */}
              <Settings 
                className="w-10 h-10 mb-4 text-zinc-500 group-hover:text-white group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-300"
                strokeWidth={2.5}
              />
              
              {/* Title */}
              <h2 
                className="text-lg font-bold tracking-widest uppercase mb-3 text-zinc-300 group-hover:text-white transition-colors duration-300"
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  letterSpacing: '0.15em'
                }}
              >
                SETTINGS / ABJURATIONS
              </h2>
              
              {/* Description */}
              <p 
                className="text-zinc-300 text-sm font-medium leading-relaxed drop-shadow-md"
                style={{ 
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                Adjust the echoes of the beyond.
              </p>
            </div>
            
            {/* Hover Glow */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg"
              style={{
                boxShadow: '0 0 40px rgba(34, 197, 94, 0.4)'
              }}
            />
          </Link>
        </div>

        </div>
      </div>
    </>
  );
}

import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { horrorAudio } from '@/lib/audio/HorrorAudio';

export function AboutPage() {
  return (
    <div className="h-screen bg-[#0a0a0a] text-[#e5e5e5] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 flex-shrink-0">
        <Link 
          to="/hub" 
          className="flex items-center gap-2 text-zinc-400 hover:text-[#e5e5e5] transition-colors"
          onClick={() => horrorAudio.playClick()}
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </Link>
        
        <h1 
          className="text-3xl font-bold text-center flex-1"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          Manifesto
        </h1>
        
        <div className="w-16" /> {/* Spacer for centering */}
      </div>

      {/* Content */}
      <div className="flex-1 max-w-4xl mx-auto px-6 py-2 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          
          {/* Philosophy */}
          <div className="bg-[#121212] border border-zinc-800 rounded-lg p-6 h-full flex flex-col">
            <h2 className="text-xl font-bold text-[#e5e5e5] mb-4" style={{ fontFamily: "'Cinzel', serif" }}>
              The Philosophy of Permanence
            </h2>
            
            <div className="space-y-3 text-zinc-300 leading-relaxed text-sm flex-1">
              <p>
                In the sacred act of writing, each word becomes eternal—carved not in fleeting 
                digital memory, but in the very essence of meaning itself. 
                <strong className="text-[#e5e5e5]"> What is written remains forever</strong>.
              </p>
              
              <p>
                This application is a monument to permanence, a testament to the enduring power 
                of the written word. Here, your thoughts transcend mortality, your stories 
                outlive their creator.
              </p>
              
              <p>
                Every keystroke etches deeper into eternity. Every paragraph becomes a gravestone 
                marking the passage of ideas. Every document stands as an epitaph to the moment 
                when thought became <em>imperishable truth</em>.
              </p>
            </div>

            {/* Version Info */}
            <div className="border-t border-zinc-800 pt-4 mt-4 text-center">
              <p className="text-zinc-500 text-xs">
                EPITAPH v1.0.0 • Words Carved in Stone
              </p>
              <p className="text-zinc-600 text-xs mt-1">
                "What is written here remains forever."
              </p>
            </div>
          </div>

          {/* Principles */}
          <div className="bg-[#121212] border border-zinc-800 rounded-lg p-6 h-full">
            <h2 className="text-xl font-bold text-[#e5e5e5] mb-4" style={{ fontFamily: "'Cinzel', serif" }}>
              The Sacred Principles
            </h2>
            
            <div className="space-y-4">
              <div className="border-l-4 border-red-600 pl-3">
                <h3 className="text-base font-semibold text-[#e5e5e5] mb-1">I. Embrace Permanence</h3>
                <p className="text-zinc-300 text-sm">
                  Every word you write becomes part of the eternal record. Choose them 
                  wisely, for they will outlast your mortal form.
                </p>
              </div>
              
              <div className="border-l-4 border-orange-500 pl-3">
                <h3 className="text-base font-semibold text-[#e5e5e5] mb-1">II. Carve with Purpose</h3>
                <p className="text-zinc-300 text-sm">
                  Like a stonemason chiseling marble, each keystroke should be deliberate. 
                  What is carved cannot be easily undone.
                </p>
              </div>
              
              <div className="border-l-4 border-purple-500 pl-3">
                <h3 className="text-base font-semibold text-[#e5e5e5] mb-1">III. Honor the Monument</h3>
                <p className="text-zinc-300 text-sm">
                  Your writing is a monument to thought itself. Treat it with the reverence 
                  due to something that will endure beyond time.
                </p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
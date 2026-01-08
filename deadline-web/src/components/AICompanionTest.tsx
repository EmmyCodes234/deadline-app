import React from 'react';
import { AICompanion } from './AICompanion';

export const AICompanionTest: React.FC = () => {
  return (
    <div className="w-full h-screen bg-zinc-950 flex">
      {/* Left side - placeholder */}
      <div className="flex-1 bg-zinc-900 p-4">
        <h2 className="text-white text-xl mb-4">Main Content Area</h2>
        <p className="text-zinc-300">
          This is a test layout to verify the AI Companion scrolling works properly.
          The AI Companion should be able to scroll when there are many messages.
        </p>
      </div>
      
      {/* Right side - AI Companion */}
      <div className="w-80 h-full">
        <AICompanion />
      </div>
    </div>
  );
};
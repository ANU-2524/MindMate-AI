
import React from 'react';
import { BrainCircuitIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 p-4 flex items-center justify-center sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <BrainCircuitIcon className="w-8 h-8 text-cyan-400" />
        <h1 className="text-2xl font-bold text-white tracking-wider">
          Mind<span className="text-cyan-400">Mate</span> AI
        </h1>
      </div>
    </header>
  );
};

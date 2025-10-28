
import React from 'react';
import { ActionType, OutputData } from '../types';
import { Loader } from './Loader';
import { OutputDisplay } from './OutputDisplay';

interface ContentPanelProps {
  inputText: string;
  setInputText: (text: string) => void;
  outputData: OutputData | null;
  isLoading: boolean;
  error: string | null;
  activeAction: ActionType | null;
}

export const ContentPanel: React.FC<ContentPanelProps> = ({
  inputText,
  setInputText,
  outputData,
  isLoading,
  error,
  activeAction
}) => {
  return (
    <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="bg-gray-800/60 rounded-xl p-4 flex flex-col">
        <h2 className="text-lg font-semibold mb-3 text-cyan-400">Your Content</h2>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste your article, notes, or any text here..."
          className="w-full flex-grow bg-gray-900/50 rounded-lg p-4 text-gray-300 border border-gray-700 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-shadow resize-none"
        />
      </div>
      <div className="bg-gray-800/60 rounded-xl p-4 flex flex-col">
         <h2 className="text-lg font-semibold mb-3 text-cyan-400">AI Assistant</h2>
        <div className="w-full flex-grow bg-gray-900/50 rounded-lg p-4 border border-gray-700 relative overflow-y-auto">
          {isLoading && <Loader />}
          {error && <div className="text-red-400 text-center p-4">{error}</div>}
          {!isLoading && !error && outputData && (
            <OutputDisplay data={outputData} actionType={activeAction} />
          )}
          {!isLoading && !error && !outputData && (
             <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <p>Your AI-generated content will appear here.</p>
                <p className="text-sm">Select an action from the left panel to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

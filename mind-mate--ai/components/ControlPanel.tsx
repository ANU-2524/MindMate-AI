
import React, { useState } from 'react';
import { ActionType } from '../../types';
import { BookOpenIcon, HelpCircleIcon, ListChecksIcon, FocusIcon, LinkIcon, SpeakerIcon } from './icons';

interface ControlPanelProps {
  onAction: (action: ActionType, text: string, options?: { detail?: string }) => void;
  inputText: string;
}

const ActionButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  isActive?: boolean;
}> = ({ icon, label, onClick, isActive }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors duration-200 ${
      isActive ? 'bg-cyan-500/20 text-cyan-300' : 'hover:bg-gray-700 text-gray-300'
    }`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

export const ControlPanel: React.FC<ControlPanelProps> = ({ onAction, inputText }) => {
  const [showSummaryOptions, setShowSummaryOptions] = useState(false);

  const handleSummaryClick = () => {
    setShowSummaryOptions(!showSummaryOptions);
  };

  const handleSummaryOptionClick = (detail: string) => {
    onAction(ActionType.Summarize, inputText, { detail });
    setShowSummaryOptions(false);
  };

  const handleNarration = () => {
    const outputElement = document.getElementById('output-content');
    if (outputElement && outputElement.textContent) {
      const utterance = new SpeechSynthesisUtterance(outputElement.textContent);
      speechSynthesis.speak(utterance);
    } else {
        alert("No content to read aloud. Please generate a summary or explanation first.");
    }
  };

  return (
    <aside className="w-full md:w-64 lg:w-72 bg-gray-800/60 rounded-xl p-4 flex flex-col gap-2 self-start sticky top-24">
      <div className="relative">
        <ActionButton
          icon={<BookOpenIcon className="w-5 h-5" />}
          label="Smart Summaries"
          onClick={handleSummaryClick}
        />
        {showSummaryOptions && (
          <div className="pl-8 mt-1 space-y-1">
            <button onClick={() => handleSummaryOptionClick('short')} className="block w-full text-left p-2 rounded hover:bg-gray-700 text-gray-400">Short</button>
            <button onClick={() => handleSummaryOptionClick('medium')} className="block w-full text-left p-2 rounded hover:bg-gray-700 text-gray-400">Medium</button>
            <button onClick={() => handleSummaryOptionClick('detailed')} className="block w-full text-left p-2 rounded hover:bg-gray-700 text-gray-400">Detailed</button>
          </div>
        )}
      </div>
      <ActionButton
        icon={<HelpCircleIcon className="w-5 h-5" />}
        label="Explain Like I'm 10"
        onClick={() => onAction(ActionType.Explain, inputText)}
      />
      <ActionButton
        icon={<ListChecksIcon className="w-5 h-5" />}
        label="Auto Quiz Generator"
        onClick={() => onAction(ActionType.Quiz, inputText)}
      />
      <ActionButton
        icon={<LinkIcon className="w-5 h-5" />}
        label="Concept Linker"
        onClick={() => onAction(ActionType.Concepts, inputText)}
      />
       <div className="my-2 border-t border-gray-700"></div>
      <ActionButton
        icon={<FocusIcon className="w-5 h-5" />}
        label="Focus Mode"
        onClick={() => onAction(ActionType.Focus, inputText)}
      />
       <ActionButton
        icon={<SpeakerIcon className="w-5 h-5" />}
        label="Audio Narration"
        onClick={handleNarration}
      />
    </aside>
  );
};


import React, { useState, useEffect } from 'react';

interface FocusModeOverlayProps {
  onExit: () => void;
}

const motivationalMessages = [
  "You're doing great, keep up the momentum!",
  "Finish this section, a breakthrough is near.",
  "Deep focus unlocks deep understanding.",
  "One paragraph at a time. You've got this.",
  "The secret of getting ahead is getting started.",
  "Embrace the challenge. Your future self will thank you.",
];

export const FocusModeOverlay: React.FC<FocusModeOverlayProps> = ({ onExit }) => {
    const [message, setMessage] = useState('');

    useEffect(() => {
        const pickMessage = () => {
            const randomIndex = Math.floor(Math.random() * motivationalMessages.length);
            setMessage(motivationalMessages[randomIndex]);
        };
        pickMessage();
        const intervalId = setInterval(pickMessage, 10000); // Change message every 10 seconds
        return () => clearInterval(intervalId);
    }, []);

  return (
    <div className="fixed inset-0 bg-gray-900/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-8 text-center text-white">
      <div className="max-w-2xl">
        <h2 className="text-5xl font-bold text-cyan-400 mb-4">Focus Mode</h2>
        <p className="text-2xl text-gray-300 mb-8 italic">"{message}"</p>
        <p className="text-lg text-gray-400 mb-12">
          All distractions are hidden. Concentrate on your content.
        </p>
        <button
          onClick={onExit}
          className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-8 rounded-lg transition-transform duration-200 hover:scale-105"
        >
          Exit Focus Mode
        </button>
      </div>
    </div>
  );
};

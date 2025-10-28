
import React, { useState, useCallback } from 'react';
import { ControlPanel } from './mind-mate--ai/components/ControlPanel';
import { ContentPanel } from './mind-mate--ai/components/ContentPanel';
import { Header } from './mind-mate--ai/components/Header';
import { FocusModeOverlay } from './mind-mate--ai/components/FocusModeOverlay';
import { ActionType, Quiz, Concept, OutputData } from './types';
import { generateContent } from './mind-mate--ai/services/geminiService';

const App: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [outputData, setOutputData] = useState<OutputData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState<ActionType | null>(null);
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);

  const handleAction = useCallback(async (action: ActionType, text: string, options?: { detail?: string, selectedText?: string }) => {
    if (!text && action !== ActionType.Focus) {
      setError('Please paste some text into the content area first.');
      return;
    }

    if (action === ActionType.Focus) {
      setIsFocusMode(true);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setOutputData(null);
    setActiveAction(action);

    try {
      const result = await generateContent(action, text, options);
      setOutputData(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleFocusModeExit = useCallback(() => {
    setIsFocusMode(false);
  }, []);

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen font-sans flex flex-col">
      <Header />
      <main className="flex-grow flex flex-col md:flex-row p-4 gap-4">
        <ControlPanel onAction={handleAction} inputText={inputText} />
        <ContentPanel
          inputText={inputText}
          setInputText={setInputText}
          outputData={outputData}
          isLoading={isLoading}
          error={error}
          activeAction={activeAction}
        />
      </main>
      {isFocusMode && <FocusModeOverlay onExit={handleFocusModeExit} />}
    </div>
  );
};

export default App;

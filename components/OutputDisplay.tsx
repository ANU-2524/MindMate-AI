
import React from 'react';
import { ActionType, Concept, OutputData, Quiz as QuizType } from '../types';
import { Quiz } from './Quiz';
import { marked } from 'marked';

interface OutputDisplayProps {
  data: OutputData;
  actionType: ActionType | null;
}

export const OutputDisplay: React.FC<OutputDisplayProps> = ({ data, actionType }) => {
  if (actionType === ActionType.Summarize || actionType === ActionType.Explain) {
    const htmlContent = marked(data as string);
    return <div id="output-content" className="prose prose-invert max-w-none prose-p:text-gray-300 prose-headings:text-cyan-400 prose-strong:text-white" dangerouslySetInnerHTML={{ __html: htmlContent }} />;
  }

  if (actionType === ActionType.Quiz) {
    return <Quiz quiz={data as QuizType} />;
  }

  if (actionType === ActionType.Concepts) {
    const concepts = data as Concept[];
    return (
      <div id="output-content">
        <h3 className="text-xl font-bold mb-4 text-cyan-400">Key Concepts</h3>
        <ul className="space-y-4">
          {concepts.map((concept, index) => (
            <li key={index} className="border-b border-gray-700 pb-2">
              <strong className="text-white font-semibold">{concept.term}</strong>
              <p className="text-gray-400 mt-1">{concept.definition}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return <div>No content to display.</div>;
};

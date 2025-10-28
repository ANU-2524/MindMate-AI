
import React, { useState } from 'react';
import { Quiz as QuizType } from '../../types';

interface QuizProps {
  quiz: QuizType;
}

export const Quiz: React.FC<QuizProps> = ({ quiz }) => {
  const [answers, setAnswers] = useState<(number | null)[]>(Array(quiz.questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);

  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    if (submitted) return;
    const newAnswers = [...answers];
    newAnswers[questionIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const getScore = () => {
    return answers.reduce((score, answer, index) => {
      return answer === quiz.questions[index].correctAnswerIndex ? score + 1 : score;
    }, 0);
  };

  const score = getScore();

  return (
    <div id="output-content" className="text-gray-200">
      <h3 className="text-2xl font-bold mb-4 text-cyan-400">{quiz.title}</h3>
      {quiz.questions.map((q, qIndex) => (
        <div key={qIndex} className="mb-6 pb-4 border-b border-gray-700">
          <p className="font-semibold mb-3">{qIndex + 1}. {q.question}</p>
          <div className="space-y-2">
            {q.options.map((option, oIndex) => {
              const isSelected = answers[qIndex] === oIndex;
              const isCorrect = q.correctAnswerIndex === oIndex;
              let bgColor = 'bg-gray-800 hover:bg-gray-700';
              if (submitted) {
                if (isCorrect) bgColor = 'bg-green-500/30';
                else if (isSelected && !isCorrect) bgColor = 'bg-red-500/30';
              } else if (isSelected) {
                bgColor = 'bg-cyan-500/20';
              }
              return (
                <button
                  key={oIndex}
                  onClick={() => handleAnswerSelect(qIndex, oIndex)}
                  disabled={submitted}
                  className={`w-full text-left p-3 rounded-md transition-colors duration-200 ${bgColor}`}
                >
                  {option}
                </button>
              );
            })}
          </div>
          {submitted && (
            <div className="mt-3 p-3 bg-gray-800/50 rounded-md text-sm">
                <p className="font-bold text-cyan-300">Explanation:</p>
                <p className="text-gray-400">{q.explanation}</p>
            </div>
          )}
        </div>
      ))}
      <div className="mt-6 text-center">
        {submitted ? (
          <div className="p-4 bg-gray-800 rounded-lg">
            <p className="text-xl font-bold">Your Score: {score} / {quiz.questions.length}</p>
          </div>
        ) : (
          <button
            onClick={handleSubmit}
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Submit Quiz
          </button>
        )}
      </div>
    </div>
  );
};

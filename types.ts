
export enum ActionType {
  Summarize = 'SUMMARIZE',
  Explain = 'EXPLAIN',
  Quiz = 'QUIZ',
  Concepts = 'CONCEPTS',
  Focus = 'FOCUS',
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Quiz {
  title: string;
  questions: QuizQuestion[];
}

export interface Concept {
  term: string;
  definition: string;
}

export type OutputData = string | Quiz | Concept[];

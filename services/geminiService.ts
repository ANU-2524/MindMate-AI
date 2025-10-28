
import { GoogleGenAI, Type } from '@google/genai';
import { ActionType, Quiz, Concept } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getQuizSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    questions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          options: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          correctAnswerIndex: { type: Type.INTEGER },
          explanation: { type: Type.STRING },
        },
        required: ['question', 'options', 'correctAnswerIndex', 'explanation'],
      },
    },
  },
  required: ['title', 'questions'],
};

const getConceptsSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            term: { type: Type.STRING },
            definition: { type: Type.STRING },
        },
        required: ['term', 'definition'],
    },
};

export const generateContent = async (
  action: ActionType,
  text: string,
  options?: { detail?: string; selectedText?: string }
): Promise<string | Quiz | Concept[]> => {
  let prompt = '';
  let config = {};

  switch (action) {
    case ActionType.Summarize:
      prompt = `Summarize the following text with a ${options?.detail || 'medium'} level of detail. Present it in well-structured markdown format:\n\n---\n${text}`;
      break;
    case ActionType.Explain:
      const textToExplain = options?.selectedText || text;
      prompt = `Explain the following text as if I am 10 years old. Use simple language and analogies if possible:\n\n---\n${textToExplain}`;
      break;
    case ActionType.Quiz:
      prompt = `Generate a 3-question multiple-choice quiz based on the following text. The questions should test key concepts. For each question, provide the question, 4 options, the index of the correct answer, and a brief explanation for why it's correct. The title of the quiz should be related to the text content.`;
      config = {
        responseMimeType: 'application/json',
        responseSchema: getQuizSchema,
      };
      break;
    case ActionType.Concepts:
        prompt = `Identify the key concepts or important terms in the following text. For each concept, provide a concise definition.`;
        config = {
            responseMimeType: 'application/json',
            responseSchema: getConceptsSchema,
        };
        break;
    default:
      throw new Error('Invalid action type');
  }

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `${prompt}\n\n---\n${text}`,
        config,
    });
    
    const responseText = response.text;

    if (action === ActionType.Quiz || action === ActionType.Concepts) {
        try {
            return JSON.parse(responseText);
        } catch(e) {
            console.error("Failed to parse JSON response:", responseText);
            throw new Error("The AI returned an invalid format. Please try again.");
        }
    }

    return responseText;
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to get response from AI. Please check your API key and try again.');
  }
};

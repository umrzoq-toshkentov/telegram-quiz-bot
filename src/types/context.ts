import type { Context } from 'telegraf';

export interface Question {
  id: number;
  question: string;
  options: string[];
  answer: string;
}

export interface UserAnswer {
  question: string;
  selected: string;
  correct: string;
  isCorrect: boolean;
}

export interface SessionData {
  quiz: {
    index: number;
    score: number;
    total: number;
    questions: Question[];
    answers: UserAnswer[];
  };
}

export interface BotContext extends Context {
  session: SessionData;
}

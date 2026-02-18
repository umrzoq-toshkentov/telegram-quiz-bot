import { Markup } from 'telegraf';
import type { BotContext, Question } from '../types/context';
import { sendQuestion } from '../handlers';
import questions from '../data/questions.json';

export const BUTTON_START_QUIZ = '🧠 Start Quiz';
export const BUTTON_LEADERBOARD = '🏆 Show Leaderboard';

export function startCommand(ctx: BotContext) {
  ctx.reply(
    `👋 Welcome to the Quiz Bot!\n\nTest your knowledge and compete on the leaderboard. Choose an option below to get started.`,
    Markup.keyboard([[BUTTON_START_QUIZ, BUTTON_LEADERBOARD]]).resize()
  );
}

export function beginQuiz(ctx: BotContext) {
  ctx.session.quiz = {
    index: 0,
    score: 0,
    total: questions.length,
    questions: questions as Question[],
    answers: [],
  };

  sendQuestion(ctx);
}

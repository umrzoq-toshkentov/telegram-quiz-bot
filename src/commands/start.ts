import type { BotContext, Question } from '../types/context';
import { sendQuestion } from '../handlers';
import questions from '../data/questions.json';

export function startCommand(ctx: BotContext) {
  ctx.reply('Yow-yow!!!');
  ctx.session.quiz = {
    index: 0,
    score: 0,
    total: questions.length,
    questions: questions as Question[],
    answers: [],
  };

  sendQuestion(ctx);
}

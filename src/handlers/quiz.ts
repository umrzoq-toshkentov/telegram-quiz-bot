import { Markup } from 'telegraf';
import type { BotContext, UserAnswer } from '../types/context';

export function sendQuestion(ctx: BotContext) {
  const { quiz } = ctx.session;
  const question = quiz.questions[quiz.index];
  if (!question) return;

  const buttons = question.options.map((option) => {
    return [Markup.button.callback(option, `ANSWER_${option}`)];
  });

  ctx.reply(
    `Question ${quiz.index + 1} of ${quiz.total}:\n\n${question.question}`,
    Markup.inlineKeyboard(buttons)
  );
}

export async function answerAction(ctx: BotContext & { match: RegExpExecArray }) {
  const selected = ctx.match[1];
  const { quiz } = ctx.session;
  const question = quiz.questions[quiz.index];
  if (!question) return;

  const isCorrect = selected === question.answer;
  if (isCorrect) quiz.score++;

  quiz.answers.push({
    question: question.question,
    selected,
    correct: question.answer,
    isCorrect,
  });

  await ctx.answerCbQuery('Answer recorded!');
  await ctx.editMessageText(
    `Question ${quiz.index + 1} of ${quiz.total}:\n\n${question.question}\n\nYour answer: ${selected}`,
    { reply_markup: undefined }
  );

  quiz.index++;

  if (quiz.index < quiz.total) {
    sendQuestion(ctx);
  } else {
    await showResults(ctx, quiz.answers, quiz.score, quiz.total);
  }
}

async function showResults(ctx: BotContext, answers: UserAnswer[], score: number, total: number) {
  const msg = await ctx.reply('...');
  const chatId = msg.chat.id;
  const msgId = msg.message_id;

  const drumroll = ['3...', '3... 2...', '3... 2... 1...', '🎉 TA-DA! 🎉'];
  for (const text of drumroll) {
    await Bun.sleep(800);
    await ctx.telegram.editMessageText(chatId, msgId, undefined, text);
  }

  await Bun.sleep(1000);

  const header = formatHeader(score, total);
  const summary = formatSummary(answers);
  await ctx.telegram.editMessageText(
    chatId,
    msgId,
    undefined,
    `${header}\n\n${'─'.repeat(25)}\n\n${summary}`
  );
}

export function getResultEmoji(percentage: number): string {
  if (percentage === 100) return '🏆';
  if (percentage >= 70) return '🌟';
  if (percentage >= 50) return '👍';
  return '💪';
}

export function formatHeader(score: number, total: number): string {
  const percentage = Math.round((score / total) * 100);
  const emoji = getResultEmoji(percentage);
  return `${emoji} Quiz Complete! ${emoji}\n\nScore: ${score}/${total} (${percentage}%)`;
}

export function formatSummary(answers: UserAnswer[]): string {
  return answers
    .map((a, i) => {
      const icon = a.isCorrect ? '✅' : '❌';
      const line = `${icon} ${i + 1}. ${a.question}`;
      if (a.isCorrect) return line;
      return `${line}\n     Your answer: ${a.selected}\n     Correct: ${a.correct}`;
    })
    .join('\n\n');
}

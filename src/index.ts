import { Telegraf, session } from 'telegraf';
import type { BotContext, SessionData } from './types/context';
import { startCommand, leaderboardCommand } from './commands';
import { answerAction } from './handlers';

const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN) {
  throw new Error('BOT_TOKEN environment variable is required');
}

const bot = new Telegraf<BotContext>(BOT_TOKEN);

// Middlewares
bot.use(
  session({
    defaultSession: (): SessionData => ({
      quiz: { index: 0, score: 0, total: 0, questions: [], answers: [] },
    }),
  })
);

// Commands
bot.start((ctx) => startCommand(ctx));
bot.command('leaderboard', (ctx) => leaderboardCommand(ctx));

// Actions
bot.action(/^ANSWER_(.+)$/, answerAction);

bot.launch();

console.log('Quiz bot is running...');

import type { BotContext } from '../types/context';
import { getLeaderboard, getUserRank, type LeaderboardEntry } from '../db';

function getRankEmoji(rank: number): string {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return `${rank}.`;
}

export function formatLeaderboard(entries: LeaderboardEntry[]): string {
  if (entries.length === 0) {
    return 'No scores yet! Be the first to play — use /start';
  }

  const lines = entries.map((entry) => {
    const rank = getRankEmoji(entry.rank);
    const name = entry.username ? `${entry.first_name} (@${entry.username})` : entry.first_name;
    const percentage = Math.round((entry.best_score / entry.total) * 100);
    return `${rank} ${name} — ${entry.best_score}/${entry.total} (${percentage}%) [${entry.games_played} game${entry.games_played === 1 ? '' : 's'}]`;
  });

  return `🏆 Leaderboard\n${'─'.repeat(25)}\n\n${lines.join('\n\n')}`;
}

export function leaderboardCommand(ctx: BotContext) {
  const entries = getLeaderboard(10);
  let text = formatLeaderboard(entries);

  const userId = ctx.from?.id;
  if (userId && entries.length > 0) {
    const userRank = getUserRank(userId);
    if (userRank && userRank.rank > 10) {
      const percentage = Math.round((userRank.best_score / userRank.total) * 100);
      text += `\n\n${'─'.repeat(25)}\nYour rank: #${userRank.rank} — ${userRank.best_score}/${userRank.total} (${percentage}%)`;
    }
  }

  ctx.reply(text);
}

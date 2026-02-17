import { Database } from 'bun:sqlite';

const dbPath = process.env.DB_PATH || 'quiz.db';
const db = new Database(dbPath);

db.run('PRAGMA journal_mode = WAL');
db.run(`
  CREATE TABLE IF NOT EXISTS scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    username TEXT,
    first_name TEXT NOT NULL,
    score INTEGER NOT NULL,
    total INTEGER NOT NULL,
    played_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

export interface ScoreRecord {
  user_id: number;
  username: string | null;
  first_name: string;
  score: number;
  total: number;
}

export interface LeaderboardEntry {
  rank: number;
  first_name: string;
  username: string | null;
  best_score: number;
  total: number;
  games_played: number;
}

const insertScore = db.prepare<void, [number, string | null, string, number, number]>(
  'INSERT INTO scores (user_id, username, first_name, score, total) VALUES (?, ?, ?, ?, ?)'
);

export function saveScore(record: ScoreRecord): void {
  insertScore.run(record.user_id, record.username, record.first_name, record.score, record.total);
}

const leaderboardQuery = db.prepare<
  {
    rank: number;
    first_name: string;
    username: string | null;
    best_score: number;
    total: number;
    games_played: number;
  },
  [number]
>(`
  SELECT
    ROW_NUMBER() OVER (ORDER BY best_score DESC, games_played DESC) AS rank,
    first_name,
    username,
    best_score,
    total,
    games_played
  FROM (
    SELECT
      user_id,
      first_name,
      username,
      MAX(score) AS best_score,
      total,
      COUNT(*) AS games_played
    FROM scores
    GROUP BY user_id
  )
  ORDER BY best_score DESC, games_played DESC
  LIMIT ?
`);

export function getLeaderboard(limit = 10): LeaderboardEntry[] {
  return leaderboardQuery.all(limit);
}

const userRankQuery = db.prepare<
  { rank: number; best_score: number; total: number; games_played: number } | null,
  [number]
>(`
  SELECT rank, best_score, total, games_played
  FROM (
    SELECT
      user_id,
      ROW_NUMBER() OVER (ORDER BY MAX(score) DESC, COUNT(*) DESC) AS rank,
      MAX(score) AS best_score,
      total,
      COUNT(*) AS games_played
    FROM scores
    GROUP BY user_id
  )
  WHERE user_id = ?
`);

export function getUserRank(userId: number) {
  return userRankQuery.get(userId);
}

export { db };

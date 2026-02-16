import { describe, test, expect } from 'bun:test';
import { getResultEmoji, formatHeader, formatSummary } from './quiz';
import type { UserAnswer } from '../types/context';

describe('getResultEmoji', () => {
  test('returns trophy for 100%', () => {
    expect(getResultEmoji(100)).toBe('🏆');
  });

  test('returns star for 70-99%', () => {
    expect(getResultEmoji(70)).toBe('🌟');
    expect(getResultEmoji(85)).toBe('🌟');
    expect(getResultEmoji(99)).toBe('🌟');
  });

  test('returns thumbs up for 50-69%', () => {
    expect(getResultEmoji(50)).toBe('👍');
    expect(getResultEmoji(69)).toBe('👍');
  });

  test('returns flexed biceps for below 50%', () => {
    expect(getResultEmoji(0)).toBe('💪');
    expect(getResultEmoji(49)).toBe('💪');
  });
});

describe('formatHeader', () => {
  test('shows score and percentage', () => {
    const header = formatHeader(7, 10);
    expect(header).toContain('7/10');
    expect(header).toContain('70%');
  });

  test('includes correct emoji for score tier', () => {
    expect(formatHeader(10, 10)).toContain('🏆');
    expect(formatHeader(8, 10)).toContain('🌟');
    expect(formatHeader(5, 10)).toContain('👍');
    expect(formatHeader(2, 10)).toContain('💪');
  });

  test('rounds percentage correctly', () => {
    const header = formatHeader(1, 3);
    expect(header).toContain('33%');
  });
});

describe('formatSummary', () => {
  const correctAnswer: UserAnswer = {
    question: 'What is 2 + 2?',
    selected: '4',
    correct: '4',
    isCorrect: true,
  };

  const wrongAnswer: UserAnswer = {
    question: 'Capital of France?',
    selected: 'London',
    correct: 'Paris',
    isCorrect: false,
  };

  test('marks correct answers with check', () => {
    const summary = formatSummary([correctAnswer]);
    expect(summary).toContain('✅');
    expect(summary).toContain('What is 2 + 2?');
    expect(summary).not.toContain('Your answer');
  });

  test('marks wrong answers with cross and shows correct answer', () => {
    const summary = formatSummary([wrongAnswer]);
    expect(summary).toContain('❌');
    expect(summary).toContain('Your answer: London');
    expect(summary).toContain('Correct: Paris');
  });

  test('numbers questions sequentially', () => {
    const summary = formatSummary([correctAnswer, wrongAnswer]);
    expect(summary).toContain('1. What is 2 + 2?');
    expect(summary).toContain('2. Capital of France?');
  });

  test('returns empty string for no answers', () => {
    expect(formatSummary([])).toBe('');
  });
});

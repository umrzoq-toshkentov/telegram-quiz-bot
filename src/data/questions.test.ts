import { describe, test, expect } from 'bun:test';
import questions from './questions.json';

describe('questions data', () => {
  test('has at least one question', () => {
    expect(questions.length).toBeGreaterThan(0);
  });

  test('every question has required fields', () => {
    for (const q of questions) {
      expect(q).toHaveProperty('id');
      expect(q).toHaveProperty('question');
      expect(q).toHaveProperty('options');
      expect(q).toHaveProperty('answer');
      expect(typeof q.question).toBe('string');
      expect(typeof q.answer).toBe('string');
      expect(Array.isArray(q.options)).toBe(true);
    }
  });

  test('every question has at least 2 options', () => {
    for (const q of questions) {
      expect(q.options.length).toBeGreaterThanOrEqual(2);
    }
  });

  test('correct answer is included in options', () => {
    for (const q of questions) {
      expect(q.options).toContain(q.answer);
    }
  });

  test('no duplicate question IDs', () => {
    const ids = questions.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

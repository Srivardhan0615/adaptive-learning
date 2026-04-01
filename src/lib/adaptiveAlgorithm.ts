import type { Question } from '../types';
import { clamp } from './utils';

export interface AdaptiveOutcome {
  isCorrect: boolean;
  difficultyChanged: boolean;
  newDifficulty: number;
  previousDifficulty: number;
  abilityEstimate: number;
  conceptAccuracy: Record<string, { correct: number; total: number; accuracy: number }>;
}

export class AdaptiveEngine {
  currentDifficulty = 3;
  consecutiveCorrect = 0;
  consecutiveWrong = 0;
  abilityScore = 50;
  conceptAccuracy = new Map<string, { correct: number; total: number }>();

  constructor(initialAbility = 50) {
    this.abilityScore = initialAbility;
  }

  processAnswer(question: Question, selectedAnswer: number, timeTaken: number): AdaptiveOutcome {
    const isCorrect = selectedAnswer === question.correct_answer;
    const previousDifficulty = this.currentDifficulty;
    const conceptStats = this.conceptAccuracy.get(question.concept_tag) ?? { correct: 0, total: 0 };
    conceptStats.total += 1;
    if (isCorrect) {
      conceptStats.correct += 1;
    }
    this.conceptAccuracy.set(question.concept_tag, conceptStats);

    if (isCorrect) {
      this.consecutiveCorrect += 1;
      this.consecutiveWrong = 0;
    } else {
      this.consecutiveWrong += 1;
      this.consecutiveCorrect = 0;
    }

    const speedBoost = timeTaken < 10 && isCorrect ? 2 : 0;
    const speedPenalty = timeTaken > 24 && !isCorrect ? -1 : 0;
    let difficultyChanged = false;

    if (this.consecutiveCorrect >= 2 && this.currentDifficulty < 5) {
      this.currentDifficulty += 1;
      this.consecutiveCorrect = 0;
      difficultyChanged = true;
    } else if (this.consecutiveWrong >= 2 && this.currentDifficulty > 1) {
      this.currentDifficulty -= 1;
      this.consecutiveWrong = 0;
      difficultyChanged = true;
    }

    const expected = 1 / (1 + Math.pow(10, (question.difficulty * 20 - this.abilityScore) / 400));
    const k = 32;
    this.abilityScore = clamp(
      this.abilityScore + k * ((isCorrect ? 1 : 0) - expected) + speedBoost + speedPenalty,
      0,
      100,
    );

    return {
      isCorrect,
      difficultyChanged,
      newDifficulty: this.currentDifficulty,
      previousDifficulty,
      abilityEstimate: Math.round(this.abilityScore),
      conceptAccuracy: this.getConceptStats(),
    };
  }

  getConceptStats() {
    return Object.fromEntries(
      [...this.conceptAccuracy.entries()].map(([concept, stats]) => [
        concept,
        {
          ...stats,
          accuracy: Math.round((stats.correct / stats.total) * 100),
        },
      ]),
    );
  }

  getWeakConcepts() {
    return [...this.conceptAccuracy.entries()]
      .filter(([, stats]) => stats.total >= 2 && stats.correct / stats.total < 0.5)
      .map(([concept]) => concept);
  }

  getStrongConcepts() {
    return [...this.conceptAccuracy.entries()]
      .filter(([, stats]) => stats.correct / stats.total >= 0.7)
      .map(([concept]) => concept);
  }
}

export function describeAbility(score: number) {
  if (score >= 75) {
    return 'Advanced';
  }
  if (score >= 50) {
    return 'Intermediate';
  }
  return 'Developing';
}

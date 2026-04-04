import type { Question } from '../types';
import { sampleChapters, sampleTopics } from './sampleData';

type QuestionBankFile = {
  questions?: Partial<Question>[];
};

let cachedBank: Question[] | null = null;
let bankPromise: Promise<Question[]> | null = null;
let cachedTopicIndex: Map<string, Question[]> | null = null;
let cachedChapterIndex: Map<string, Question[]> | null = null;
let cachedConceptIndex: Map<string, Question[]> | null = null;

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function tokenize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]+/g, ' ')
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 3);
}

function uniqueByQuestionText(questions: Question[]) {
  const seen = new Set<string>();
  return questions.filter((question) => {
    const key = normalize(question.question_text);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function buildTopicSearchProfile(topicId: string) {
  const topic = sampleTopics.find((item) => item.id === topicId);
  if (!topic) {
    return null;
  }

  const chapter = sampleChapters.find((item) => item.id === topic.chapter_id);
  const rawTerms = [
    topic.title,
    topic.description,
    topic.key_concepts.join(' '),
    topic.prerequisites.join(' '),
    chapter?.title ?? '',
  ].join(' ');

  const keywordSet = new Set(tokenize(rawTerms));
  return {
    topic,
    normalizedTitle: normalize(topic.title),
    normalizedConcepts: topic.key_concepts.map((concept) => normalize(concept)),
    keywordSet,
  };
}

function getQuestionRelevance(question: Question, topicId: string) {
  const profile = buildTopicSearchProfile(topicId);
  if (!profile) {
    return 0;
  }

  if (question.topic_id === topicId) {
    return 100;
  }

  let score = 0;
  const normalizedConcept = normalize(question.concept_tag);
  const normalizedText = normalize(`${question.question_text} ${question.paper_title ?? ''}`);
  const questionTokens = new Set(
    tokenize(`${question.question_text} ${question.explanation} ${question.paper_title ?? ''} ${question.concept_tag}`),
  );

  if (profile.normalizedConcepts.includes(normalizedConcept)) {
    score += 30;
  }

  if (normalizedText.includes(profile.normalizedTitle)) {
    score += 25;
  }

  for (const concept of profile.normalizedConcepts) {
    if (concept && normalizedText.includes(concept)) {
      score += 12;
    }
  }

  for (const token of profile.keywordSet) {
    if (questionTokens.has(token)) {
      score += 3;
    }
  }

  if (question.chapter_id === profile.topic.chapter_id) {
    score += 5;
  }

  return score;
}

function sortByExamQuality(questions: Question[], topicId?: string) {
  return [...questions].sort((left, right) => {
    const relevanceDelta = (topicId ? getQuestionRelevance(right, topicId) - getQuestionRelevance(left, topicId) : 0);
    if (relevanceDelta !== 0) {
      return relevanceDelta;
    }

    const examDelta =
      (right.exam_name === 'JEE Advanced' ? 2 : right.exam_name === 'JEE Main' ? 1 : 0) -
      (left.exam_name === 'JEE Advanced' ? 2 : left.exam_name === 'JEE Main' ? 1 : 0);
    if (examDelta !== 0) {
      return examDelta;
    }

    const difficultyDelta = right.difficulty - left.difficulty;
    if (difficultyDelta !== 0) {
      return difficultyDelta;
    }

    return (right.exam_year ?? 0) - (left.exam_year ?? 0);
  });
}

function inferDifficulty(value: Partial<Question>) {
  if (typeof value.difficulty === 'number') {
    return value.difficulty;
  }
  return 3;
}

function normalizeQuestion(item: Partial<Question>, index: number): Question | null {
  if (!item.question_text || !Array.isArray(item.options) || typeof item.correct_answer !== 'number') {
    return null;
  }

  const topicId =
    item.topic_id ??
    sampleTopics.find((topic) => normalize(topic.title) === normalize(item.concept_tag ?? ''))?.id ??
    '';

  const chapterId =
    item.chapter_id ??
    (topicId ? sampleTopics.find((topic) => topic.id === topicId)?.chapter_id : undefined) ??
    sampleChapters.find((chapter) => normalize(chapter.title) === normalize(item.paper_title ?? ''))?.id ??
    '';

  const subjectId =
    item.subject_id ??
    (topicId ? sampleTopics.find((topic) => topic.id === topicId)?.subject_id : undefined) ??
    (chapterId ? sampleChapters.find((chapter) => chapter.id === chapterId)?.subject_id : undefined) ??
    '';

  if (!chapterId || !subjectId) {
    return null;
  }

  return {
    id: item.id ?? `pyq-${index + 1}`,
    topic_id: topicId,
    chapter_id: chapterId,
    concept_tag: item.concept_tag ?? 'pyq',
    question_text: item.question_text,
    options: item.options,
    correct_answer: item.correct_answer,
    difficulty: inferDifficulty(item),
    explanation: item.explanation ?? '',
    subject_id: subjectId,
    exam_name: item.exam_name,
    exam_year: item.exam_year,
    paper_id: item.paper_id,
    paper_title: item.paper_title,
    source: 'pyq',
  };
}

async function loadBank() {
  try {
    const response = await fetch('/data/jee-pyq-bank.json');
    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as QuestionBankFile;
    return (data.questions ?? [])
      .map((item, index) => normalizeQuestion(item, index))
      .filter((item): item is Question => Boolean(item));
  } catch {
    return [];
  }
}

function ensureIndexes(questions: Question[]) {
  if (cachedTopicIndex && cachedChapterIndex && cachedConceptIndex) {
    return;
  }

  const topicIndex = new Map<string, Question[]>();
  const chapterIndex = new Map<string, Question[]>();
  const conceptIndex = new Map<string, Question[]>();

  questions.forEach((question) => {
    if (question.topic_id) {
      topicIndex.set(question.topic_id, [...(topicIndex.get(question.topic_id) ?? []), question]);
    }

    const conceptKey = normalize(question.concept_tag);
    if (conceptKey) {
      conceptIndex.set(conceptKey, [...(conceptIndex.get(conceptKey) ?? []), question]);
    }

    chapterIndex.set(question.chapter_id, [...(chapterIndex.get(question.chapter_id) ?? []), question]);
  });

  cachedTopicIndex = topicIndex;
  cachedChapterIndex = chapterIndex;
  cachedConceptIndex = conceptIndex;
}

export async function getPyqQuestions(topicId?: string): Promise<Question[]> {
  if (cachedBank) {
    ensureIndexes(cachedBank);
  } else {
    bankPromise ??= loadBank();
    cachedBank = await bankPromise;
    bankPromise = null;
    ensureIndexes(cachedBank);
  }

  if (!cachedBank) {
    return [];
  }

  if (!topicId) {
    return sortByExamQuality(uniqueByQuestionText(cachedBank));
  }

  const profile = buildTopicSearchProfile(topicId);
  const exactMatches = cachedTopicIndex?.get(topicId) ?? [];
  if (!profile) {
    return sortByExamQuality(uniqueByQuestionText(exactMatches), topicId);
  }

  const conceptMatches = profile.normalizedConcepts.flatMap(
    (concept) => cachedConceptIndex?.get(concept) ?? [],
  );
  const chapterQuestions = cachedChapterIndex?.get(profile.topic.chapter_id) ?? [];
  const candidatePool = uniqueByQuestionText([...exactMatches, ...conceptMatches, ...chapterQuestions]);
  const scoredPool = candidatePool.filter((question) => getQuestionRelevance(question, topicId) >= 12);

  if (scoredPool.length) {
    return sortByExamQuality(scoredPool, topicId);
  }

  return sortByExamQuality(uniqueByQuestionText(exactMatches), topicId);
}

import type { User } from 'firebase/auth';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth';
import { firebaseAuth, isFirebaseConfigured } from './firebase';
import type { Chapter, ConceptMastery, ContentVariant, Lesson, Profile, Question, Subject, TestSession, Topic, UserProgress } from '../types';
import {
  DEMO_USER_ID,
  sampleChapters,
  sampleLessons,
  sampleProfile,
  sampleProgress,
  sampleQuestions,
  sampleSessions,
  sampleSubjects,
  sampleTopics,
} from './sampleData';

const STORAGE_KEY = 'adaptlearn-demo-sessions';
const QUICK_CHECK_KEY = 'adaptlearn-quick-check';
const PROGRESS_KEY = 'adaptlearn-progress';
const VARIANTS_KEY = 'adaptlearn-lesson-variants';
const MASTERY_KEY = 'adaptlearn-concept-mastery';

export { isFirebaseConfigured };

function readSessions(): TestSession[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as TestSession[]) : sampleSessions;
}

function writeSessions(sessions: TestSession[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

function readProgress(): UserProgress[] {
  const raw = localStorage.getItem(PROGRESS_KEY);
  return raw ? (JSON.parse(raw) as UserProgress[]) : sampleProgress;
}

function writeProgress(progress: UserProgress[]) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

function readVariants(): ContentVariant[] {
  const raw = localStorage.getItem(VARIANTS_KEY);
  return raw ? (JSON.parse(raw) as ContentVariant[]) : [];
}

function writeVariants(variants: ContentVariant[]) {
  localStorage.setItem(VARIANTS_KEY, JSON.stringify(variants));
}

function readConceptMastery(): ConceptMastery[] {
  const raw = localStorage.getItem(MASTERY_KEY);
  return raw ? (JSON.parse(raw) as ConceptMastery[]) : [];
}

function writeConceptMastery(records: ConceptMastery[]) {
  localStorage.setItem(MASTERY_KEY, JSON.stringify(records));
}

async function getActiveUserId() {
  if (!isFirebaseConfigured) {
    return DEMO_USER_ID;
  }

  return firebaseAuth?.currentUser?.uid ?? (await getSession())?.uid ?? null;
}

function filterByUser<T extends { user_id: string }>(items: T[], userId: string | null) {
  if (!userId) {
    return [];
  }

  return items.filter((item) => item.user_id === userId);
}

export async function getSession() {
  if (!firebaseAuth) {
    return null as User | null;
  }

  return new Promise<User | null>((resolve) => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
}

export async function signInWithPassword(email: string, password: string) {
  if (!firebaseAuth) {
    throw new Error('Firebase is not configured for authentication.');
  }

  const result = await signInWithEmailAndPassword(firebaseAuth, email, password);
  return result.user;
}

export async function signUpWithPassword(email: string, password: string, fullName?: string) {
  if (!firebaseAuth) {
    throw new Error('Firebase is not configured for authentication.');
  }

  const result = await createUserWithEmailAndPassword(firebaseAuth, email, password);

  if (fullName?.trim()) {
    await updateProfile(result.user, { displayName: fullName.trim() });
  }

  return result.user;
}

export async function signOut() {
  if (firebaseAuth) {
    await firebaseSignOut(firebaseAuth);
  }
}

export function onAuthStateChange(callback: (user: User | null) => void) {
  if (!firebaseAuth) {
    return () => undefined;
  }

  return onAuthStateChanged(firebaseAuth, callback);
}

export async function getCurrentProfile(): Promise<Profile> {
  if (!isFirebaseConfigured) {
    return sampleProfile;
  }

  const user = await getSession();
  if (!user) {
    return {
      ...sampleProfile,
      email: '',
    };
  }

  return {
    ...sampleProfile,
    id: user.uid,
    full_name: user.displayName ?? user.email?.split('@')[0] ?? sampleProfile.full_name,
    email: user.email ?? sampleProfile.email,
  };
}

export async function getSubjects(): Promise<Subject[]> {
  return sampleSubjects;
}

export async function getSubjectById(subjectId: string) {
  return sampleSubjects.find((subject) => subject.id === subjectId) ?? null;
}

export async function getChapters(subjectId?: string): Promise<Chapter[]> {
  return subjectId ? sampleChapters.filter((chapter) => chapter.subject_id === subjectId) : sampleChapters;
}

export async function getChapterById(chapterId: string): Promise<Chapter | null> {
  return sampleChapters.find((chapter) => chapter.id === chapterId) ?? null;
}

export async function getTopics(chapterId?: string): Promise<Topic[]> {
  return chapterId ? sampleTopics.filter((topic) => topic.chapter_id === chapterId) : sampleTopics;
}

export async function getTopicsBySubject(subjectId: string): Promise<Topic[]> {
  return sampleTopics.filter((topic) => topic.subject_id === subjectId);
}

export async function getTopicById(topicId: string): Promise<Topic | null> {
  return sampleTopics.find((topic) => topic.id === topicId) ?? null;
}

export async function getLessons(topicId?: string): Promise<Lesson[]> {
  return topicId ? sampleLessons.filter((lesson) => lesson.topic_id === topicId) : sampleLessons;
}

export async function getLessonById(lessonId: string): Promise<Lesson | null> {
  return sampleLessons.find((lesson) => lesson.id === lessonId) ?? null;
}

export async function getQuestions(topicId?: string): Promise<Question[]> {
  return topicId ? sampleQuestions.filter((question) => question.topic_id === topicId) : sampleQuestions;
}

export async function getProgress(): Promise<UserProgress[]> {
  const userId = await getActiveUserId();

  if (!isFirebaseConfigured && userId === DEMO_USER_ID) {
    const stored = readProgress();
    return stored.length ? filterByUser(stored, userId) : sampleProgress;
  }

  return filterByUser(readProgress(), userId);
}

export async function saveProgress(update: UserProgress) {
  const userId = await getActiveUserId();
  const ownerId = update.user_id || userId || DEMO_USER_ID;
  const next = readProgress();
  const index = next.findIndex((item) => item.lesson_id === update.lesson_id && item.user_id === ownerId);
  const payload = { ...update, user_id: ownerId };

  if (index >= 0) {
    next[index] = payload;
  } else {
    next.push(payload);
  }
  writeProgress(next);
}

export async function getCompletedSessions(): Promise<TestSession[]> {
  const userId = await getActiveUserId();

  if (!isFirebaseConfigured && userId === DEMO_USER_ID) {
    const stored = readSessions();
    const scoped = filterByUser(stored, userId).filter((session) => session.status === 'completed');
    return scoped.length ? scoped : sampleSessions.filter((session) => session.user_id === DEMO_USER_ID);
  }

  return filterByUser(readSessions(), userId).filter((session) => session.status === 'completed');
}

export async function getSessionById(sessionId: string): Promise<TestSession | null> {
  const userId = await getActiveUserId();
  return readSessions().find((session) => session.id === sessionId && session.user_id === userId) ?? null;
}

export async function createTestSession(topicId: string): Promise<TestSession> {
  const topic = await getTopicById(topicId);
  const draft: TestSession = {
    id: crypto.randomUUID(),
    user_id: DEMO_USER_ID,
    subject_id: topic?.subject_id ?? 'subject-mathematics',
    chapter_id: topic?.chapter_id ?? 'chapter-math-algebra',
    topic_id: topicId,
    started_at: new Date().toISOString(),
    answers: [],
    final_score: 0,
    ability_estimate: 50,
    weak_concepts: [],
    strong_concepts: [],
    concept_breakdown: [],
    status: 'in_progress',
  };

  const session = await getSession();
  const payload = { ...draft, user_id: session?.uid ?? DEMO_USER_ID };
  const sessions = readSessions();
  sessions.unshift(payload);
  writeSessions(sessions);
  return payload;
}

export async function saveCompletedSession(result: TestSession) {
  const userId = await getActiveUserId();
  const ownerId = result.user_id || userId || DEMO_USER_ID;
  const sessions = readSessions();
  const index = sessions.findIndex((item) => item.id === result.id && item.user_id === ownerId);
  const payload = { ...result, user_id: ownerId };
  if (index >= 0) {
    sessions[index] = payload;
  } else {
    sessions.unshift(payload);
  }
  writeSessions(sessions);
}

export async function getLessonVariant(lessonId: string, variantType?: ContentVariant['variant_type']) {
  const userId = await getActiveUserId();
  const variants = readVariants().filter((variant) => variant.lesson_id === lessonId && variant.user_id === userId);
  if (variantType) {
    return variants.find((variant) => variant.variant_type === variantType) ?? null;
  }
  return variants[0] ?? null;
}

export async function saveLessonVariant(variant: ContentVariant) {
  const userId = await getActiveUserId();
  const ownerId = variant.user_id || userId || DEMO_USER_ID;
  const variants = readVariants();
  const payload = { ...variant, user_id: ownerId };
  const index = variants.findIndex(
    (item) =>
      item.lesson_id === payload.lesson_id &&
      item.variant_type === payload.variant_type &&
      item.user_id === ownerId,
  );
  if (index >= 0) {
    variants[index] = payload;
  } else {
    variants.unshift(payload);
  }
  writeVariants(variants);
  return payload;
}

export async function saveConceptMastery(records: ConceptMastery[]) {
  const userId = await getActiveUserId();
  const ownerId = userId ?? DEMO_USER_ID;
  const current = readConceptMastery();
  records.forEach((record) => {
    const payload = { ...record, user_id: record.user_id || ownerId };
    const index = current.findIndex(
      (item) => item.concept_tag === payload.concept_tag && item.user_id === payload.user_id,
    );
    if (index >= 0) {
      current[index] = {
        ...current[index],
        ...payload,
        attempts_count: current[index].attempts_count + payload.attempts_count,
      };
    } else {
      current.push(payload);
    }
  });
  writeConceptMastery(current);
}

export async function getQuickCheckStatus(lessonId: string) {
  const userId = await getActiveUserId();
  const raw = localStorage.getItem(QUICK_CHECK_KEY);
  const data = raw ? (JSON.parse(raw) as Record<string, Record<string, boolean>>) : {};
  return Boolean(data[userId ?? DEMO_USER_ID]?.[lessonId]);
}

export async function setQuickCheckStatus(lessonId: string, passed: boolean) {
  const userId = await getActiveUserId();
  const raw = localStorage.getItem(QUICK_CHECK_KEY);
  const data = raw ? (JSON.parse(raw) as Record<string, Record<string, boolean>>) : {};
  const ownerId = userId ?? DEMO_USER_ID;
  data[ownerId] = {
    ...(data[ownerId] ?? {}),
    [lessonId]: passed,
  };
  localStorage.setItem(QUICK_CHECK_KEY, JSON.stringify(data));
}

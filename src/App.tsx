import { Suspense, lazy, useEffect, useState } from 'react';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import { Skeleton } from './components/ui/skeleton';
import { getCurrentProfile, getSession, isFirebaseConfigured, onAuthStateChange } from './lib/supabase';
import type { Profile } from './types';
import type { User } from 'firebase/auth';

const Home = lazy(() => import('./pages/Home'));
const LearningHub = lazy(() => import('./pages/LearningHub'));
const SubjectPage = lazy(() => import('./pages/SubjectPage'));
const ChapterPage = lazy(() => import('./pages/ChapterPage'));
const LessonPage = lazy(() => import('./pages/LessonPage'));
const TestPage = lazy(() => import('./pages/TestPage'));
const FeedbackPage = lazy(() => import('./pages/FeedbackPage'));
const TestReportPage = lazy(() => import('./pages/TestReportPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));

function RequireAuth({ hasSession }: { hasSession: boolean }) {
  const location = useLocation();

  if (!isFirebaseConfigured || hasSession) {
    return <Outlet />;
  }

  return <Navigate to="/login" replace state={{ from: location }} />;
}

export default function App() {
  const [session, setSession] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadInitialState() {
      const currentSession = await getSession();

      if (!isMounted) {
        return;
      }

      setSession(currentSession);

      if (currentSession || !isFirebaseConfigured) {
        const nextProfile = await getCurrentProfile();

        if (!isMounted) {
          return;
        }

        setProfile(nextProfile);
      } else {
        setProfile(null);
      }

      if (isMounted) {
        setIsLoading(false);
      }
    }

    void loadInitialState();

    const unsubscribe = onAuthStateChange(async (nextSession) => {
      if (!isMounted) {
        return;
      }

      setSession(nextSession);

      if (nextSession || !isFirebaseConfigured) {
        const nextProfile = await getCurrentProfile();

        if (!isMounted) {
          return;
        }

        setProfile(nextProfile);
      } else {
        setProfile(null);
      }

      if (isMounted) {
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="h-[420px]" />
      </div>
    );
  }

  const hasSession = Boolean(session);

  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"><Skeleton className="h-[420px]" /></div>}>
      <Routes>
        <Route path="/login" element={<LoginPage isAuthenticated={hasSession} />} />
        <Route element={<RequireAuth hasSession={hasSession} />}>
          <Route element={<Layout profile={profile} />}>
            <Route path="/" element={<Home />} />
            <Route path="/learn" element={<LearningHub />} />
            <Route path="/learn/:subjectId" element={<SubjectPage />} />
            <Route path="/learn/:subjectId/chapters/:chapterId" element={<ChapterPage />} />
            <Route path="/learn/:subjectId/chapters/:chapterId/topics/:topicId" element={<LessonPage />} />
            <Route path="/test/:sessionId" element={<TestPage />} />
            <Route path="/feedback/:sessionId" element={<FeedbackPage />} />
            <Route path="/report/:sessionId" element={<TestReportPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to={hasSession || !isFirebaseConfigured ? '/' : '/login'} replace />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}

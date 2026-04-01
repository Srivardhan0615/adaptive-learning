import { AlertCircle, ArrowRight, BookOpenCheck, LockKeyhole, Mail, UserCircle2 } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { isFirebaseConfigured, signInWithPassword, signUpWithPassword } from '../lib/supabase';

type LoginPageProps = {
  isAuthenticated: boolean;
};

export default function LoginPage({ isAuthenticated }: LoginPageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextPath = typeof location.state?.from?.pathname === 'string' ? location.state.from.pathname : '/';

  if (isAuthenticated) {
    return <Navigate to={nextPath} replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isFirebaseConfigured) {
      navigate('/', { replace: true });
      return;
    }

    if (mode === 'signup') {
      if (!fullName.trim()) {
        setError('Please enter your full name to create an account.');
        return;
      }

      if (password.trim().length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (mode === 'signup') {
        await signUpWithPassword(email.trim(), password, fullName);
      } else {
        await signInWithPassword(email.trim(), password);
      }
      navigate(nextPath, { replace: true });
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : mode === 'signup'
            ? 'Unable to create your account. Please try again.'
            : 'Unable to sign in. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="app-shell flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.1),transparent_24%)]" />

      <div className="relative z-10 grid w-full max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
        <section className="rounded-[28px] border border-white/10 bg-[#0b1224]/85 p-6 shadow-[0_30px_90px_-30px_rgba(0,0,0,0.72)] backdrop-blur-xl sm:p-8 md:rounded-[32px] md:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-300">
            <BookOpenCheck className="h-4 w-4" />
            Adaptive Learning Portal
          </div>

          <div className="mt-8 space-y-5">
            <h1 className="max-w-2xl text-4xl font-bold leading-[1.02] tracking-[-0.05em] text-white sm:text-5xl md:text-6xl">
              {mode === 'signup' ? 'Create an account and start learning with your own path.' : 'Sign in to keep every lesson personalized.'}
            </h1>
            <p className="max-w-xl text-base text-slate-300 sm:text-lg">
              {mode === 'signup'
                ? 'Your chapters, test history, and performance insights stay synced to your account from the very first session.'
                : 'Your progress, test history, and concept mastery stay tied to your account, so logging back in restores the right learning path immediately.'}
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div className="text-sm uppercase tracking-[0.2em] text-cyan-300">Lessons</div>
              <p className="mt-2 text-sm text-slate-400">Pick up exactly where you left off.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div className="text-sm uppercase tracking-[0.2em] text-emerald-300">Progress</div>
              <p className="mt-2 text-sm text-slate-400">Keep your scores and mastery history in sync.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div className="text-sm uppercase tracking-[0.2em] text-amber-300">Feedback</div>
              <p className="mt-2 text-sm text-slate-400">Return to the support plan built from your last test.</p>
            </div>
          </div>
        </section>

        <Card className="border-[#dcecdc] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(247,255,247,0.98)_100%)] p-6 sm:p-8 md:p-10">
          <div className="mb-6 flex w-full flex-col rounded-[22px] border border-[#d8ead9] bg-[#f6fff5] p-1 sm:inline-flex sm:w-auto sm:flex-row sm:rounded-full">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
              }}
              className={`rounded-[18px] px-4 py-2 text-sm font-semibold transition sm:rounded-full ${
                mode === 'login' ? 'bg-[#2fc84f] text-white shadow-[0_12px_24px_rgba(47,200,79,0.22)]' : 'text-[#5d6e5f]'
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setError(null);
              }}
              className={`rounded-[18px] px-4 py-2 text-sm font-semibold transition sm:rounded-full ${
                mode === 'signup' ? 'bg-[#2fc84f] text-white shadow-[0_12px_24px_rgba(47,200,79,0.22)]' : 'text-[#5d6e5f]'
              }`}
            >
              Create account
            </button>
          </div>

          <div className="space-y-2">
            <p className="section-label">{mode === 'signup' ? 'Create Account' : 'Login'}</p>
            <h2 className="text-3xl font-bold text-[#172519]">
              {mode === 'signup' ? 'Join AdaptLearn' : 'Welcome back'}
            </h2>
            <p className="text-[#627364]">
              {mode === 'signup'
                ? 'Set up your account to save progress, chapter mastery, and adaptive test reports.'
                : 'Use your email and password to access your learning dashboard.'}
            </p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            {mode === 'signup' ? (
              <label className="block space-y-2">
                <span className="text-sm font-medium text-[#435245]">Full name</span>
                <div className="flex items-center gap-3 rounded-2xl border border-[#d8ead9] bg-white px-4 py-3 focus-within:border-[#29c1ef]">
                  <UserCircle2 className="h-4 w-4 text-[#7f8d82]" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    className="w-full border-0 bg-transparent text-[#172519] outline-none placeholder:text-[#9aa89d]"
                    placeholder="Your full name"
                    autoComplete="name"
                    required={isFirebaseConfigured}
                  />
                </div>
              </label>
            ) : null}

            <label className="block space-y-2">
              <span className="text-sm font-medium text-[#435245]">Email</span>
              <div className="flex items-center gap-3 rounded-2xl border border-[#d8ead9] bg-white px-4 py-3 focus-within:border-[#29c1ef]">
                <Mail className="h-4 w-4 text-[#7f8d82]" />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full border-0 bg-transparent text-[#172519] outline-none placeholder:text-[#9aa89d]"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required={isFirebaseConfigured}
                />
              </div>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-[#435245]">Password</span>
              <div className="flex items-center gap-3 rounded-2xl border border-[#d8ead9] bg-white px-4 py-3 focus-within:border-[#29c1ef]">
                <LockKeyhole className="h-4 w-4 text-[#7f8d82]" />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full border-0 bg-transparent text-[#172519] outline-none placeholder:text-[#9aa89d]"
                  placeholder={mode === 'signup' ? 'Create a password' : 'Enter your password'}
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  required={isFirebaseConfigured}
                />
              </div>
              {mode === 'signup' ? <p className="text-xs text-[#6f7d71]">Use at least 6 characters.</p> : null}
            </label>

            {error ? (
              <div className="flex items-start gap-3 rounded-2xl border border-[#f0c3c3] bg-[#fff3f3] px-4 py-3 text-sm text-[#8c3030]">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            ) : null}

            {!isFirebaseConfigured ? (
              <div className="rounded-2xl border border-[#f2dd9f] bg-[#fff7db] px-4 py-3 text-sm text-[#7a5a09]">
                Firebase auth is not configured in this project, so the form is disabled and the app will continue in demo mode.
              </div>
            ) : null}

            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (mode === 'signup' ? 'Creating Account...' : 'Signing In...') : mode === 'signup' ? 'Create Account' : 'Sign In'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>

          <p className="mt-6 text-sm leading-7 text-[#6f7d71]">
            {mode === 'signup' ? (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError(null);
                  }}
                  className="text-[#18a9d8] transition hover:text-[#0d83ab]"
                >
                  Sign in here
                </button>
                <span className="mx-2">|</span>
              </>
            ) : (
              <>
                New here?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setError(null);
                  }}
                  className="text-[#18a9d8] transition hover:text-[#0d83ab]"
                >
                  Create an account
                </button>
                <span className="mx-2">|</span>
              </>
            )}
            Need a different route? <Link to="/" className="text-[#18a9d8] transition hover:text-[#0d83ab]">Return to the app</Link>
          </p>
        </Card>
      </div>
    </div>
  );
}

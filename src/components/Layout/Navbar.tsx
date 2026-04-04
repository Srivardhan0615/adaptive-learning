import { BookOpen, ChevronDown, CircleUserRound, GraduationCap, LayoutDashboard, LineChart, LogOut, Menu, User, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { signOut } from '../../lib/supabase';
import { cn } from '../../lib/utils';
import type { Profile } from '../../types';
import { Button } from '../ui/button';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/learn', label: 'Learning Hub' },
  { to: '/profile', label: 'Profile' },
];

export default function Navbar({ profile }: { profile: Profile | null }) {
  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  async function handleLogout() {
    setOpen(false);
    setMobileMenuOpen(false);

    try {
      await signOut();
    } finally {
      navigate('/login', { replace: true });
    }
  }

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div className="mx-auto max-w-7xl px-3 pt-3 sm:px-6 sm:pt-4 lg:px-8">
        <div className="glass-panel rounded-[24px] px-3 py-3 sm:rounded-[28px] sm:px-5">
          <div className="flex items-center justify-between gap-3">
          <NavLink to="/" className="flex items-center gap-3">
            <div className="rounded-2xl bg-gradient-to-br from-[#32c751] to-[#74dd58] p-2.5 text-white shadow-[0_18px_30px_-16px_rgba(47,180,75,0.45)]">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <div className="text-lg font-bold text-[#172519]">AdaptLearn</div>
              <div className="hidden text-xs text-[#7d8c80] sm:block">Playful adaptive learning</div>
            </div>
          </NavLink>

          <nav className="hidden items-center gap-2 md:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    'rounded-xl px-4 py-2 text-sm font-medium transition',
                    isActive ? 'bg-[#ecf9ea] text-[#27a944]' : 'text-[#6a796d] hover:bg-[#f2faf0] hover:text-[#172519]',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="relative flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((value) => !value)}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#d7e6d4] bg-white text-[#4f6354] transition hover:bg-[#f6fbf5] md:hidden"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="flex items-center gap-3 rounded-2xl border border-[#d7e6d4] bg-white px-3 py-2 transition hover:bg-[#f6fbf5]"
            >
              <CircleUserRound className="h-5 w-5 text-[#35c759]" />
              <div className="hidden text-left md:block">
                <div className="text-sm font-medium text-[#172519]">{profile?.full_name ?? 'Guest Learner'}</div>
                <div className="text-xs text-[#7e8b81]">{profile?.email ?? 'Demo mode active'}</div>
              </div>
              <ChevronDown className="h-4 w-4 text-[#7e8b81]" />
            </button>

            {open && (
              <div className="absolute right-0 top-14 w-60 rounded-[26px] border border-[#d6e6d4] bg-white/95 p-2 shadow-[0_24px_50px_-22px_rgba(55,99,61,0.24)] backdrop-blur-xl">
                <button
                  type="button"
                  onClick={() => {
                    navigate('/profile');
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-[#4f6354] transition hover:bg-[#f1f9ef]"
                >
                  <User className="h-4 w-4" />
                  Profile
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigate('/learn');
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-[#4f6354] transition hover:bg-[#f1f9ef]"
                >
                  <BookOpen className="h-4 w-4" />
                  Learning Hub
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigate('/profile');
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-[#4f6354] transition hover:bg-[#f1f9ef]"
                >
                  <LineChart className="h-4 w-4" />
                  Performance
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigate('/');
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-[#4f6354] transition hover:bg-[#f1f9ef]"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Overview
                </button>
                <div className="my-2 h-px bg-[#edf4eb]" />
                <Button variant="ghost" className="w-full justify-start px-3" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            )}
          </div>
          </div>

          {mobileMenuOpen && (
            <div className="mt-4 space-y-3 rounded-[24px] border border-[#d7e6d4] bg-white/95 p-4 shadow-[0_24px_50px_-22px_rgba(55,99,61,0.18)] md:hidden">
              <div className="rounded-[20px] border border-[#e3ece1] bg-[#f7fff7] p-4">
                <div className="text-sm font-semibold text-[#172519]">{profile?.full_name ?? 'Guest Learner'}</div>
                <div className="mt-1 text-xs text-[#7e8b81]">{profile?.email ?? 'Demo mode active'}</div>
              </div>

              <div className="grid gap-2">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'rounded-2xl px-4 py-3 text-sm font-semibold transition',
                        isActive
                          ? 'bg-[#ecf9ea] text-[#27a944]'
                          : 'bg-[#fbfdf9] text-[#5f6f62] hover:bg-[#f2faf0] hover:text-[#172519]',
                      )
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>

              <div className="grid gap-2 rounded-[20px] border border-[#e3ece1] bg-[#fbfdf9] p-3">
                <button
                  type="button"
                  onClick={() => {
                    navigate('/profile');
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-[#4f6354] transition hover:bg-[#f1f9ef]"
                >
                  <User className="h-4 w-4" />
                  Profile
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigate('/learn');
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-[#4f6354] transition hover:bg-[#f1f9ef]"
                >
                  <BookOpen className="h-4 w-4" />
                  Learning Hub
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigate('/');
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-[#4f6354] transition hover:bg-[#f1f9ef]"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Overview
                </button>
              </div>

              <Button variant="ghost" className="w-full justify-center" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

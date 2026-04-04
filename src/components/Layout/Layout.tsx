import { Outlet } from 'react-router-dom';
import type { Profile } from '../../types';
import Navbar from './Navbar';

export default function Layout({ profile }: { profile: Profile | null }) {
  return (
    <div className="app-shell">
      <Navbar profile={profile} />
      <main className="relative z-10 mx-auto min-h-screen max-w-7xl px-3 pb-10 pt-24 sm:px-4 sm:pb-12 sm:pt-28 md:px-6 md:pt-32 lg:px-8 lg:pt-28">
        <div className="animate-page-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

import { Download, Mail, UserCircle2 } from 'lucide-react';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AbilityChart from '../components/analytics/AbilityChart';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { getCompletedSessions, getCurrentProfile } from '../lib/supabase';
import { downloadTextFile, formatDate, humanizeIdentifier, percent } from '../lib/utils';
import type { AbilityHistoryPoint, Profile, TestSession } from '../types';

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [sessions, setSessions] = useState<TestSession[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getCurrentProfile(), getCompletedSessions()]).then(([profileData, sessionData]) => {
      setProfile(profileData);
      setSessions(sessionData);
    });
  }, []);

  const history = useMemo<AbilityHistoryPoint[]>(
    () =>
      sessions
        .slice(0, 10)
        .reverse()
        .map((session, index) => ({
          label: `S${index + 1}`,
          ability: Math.round(session.ability_estimate),
          score: session.final_score,
        })),
    [sessions],
  );

  if (!profile) {
    return <Skeleton className="h-[520px]" />;
  }

  function exportCsv() {
    const rows = ['Date,Subject,Score,Accuracy,Difficulty Level'];
    sessions.forEach((session) => {
      rows.push(
        [
          formatDate(session.completed_at ?? session.started_at),
          session.subject_id,
          `${session.final_score}%`,
          `${percent(session.answers.filter((answer) => answer.correct).length, Math.max(session.answers.length, 1))}%`,
          session.ability_estimate.toString(),
        ].join(','),
      );
    });
    downloadTextFile('adaptlearn-performance-report.csv', rows.join('\n'));
  }

  return (
    <div className="space-y-8">
      <Card className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-[28px] bg-[#203046] p-4 shadow-[0_22px_42px_rgba(32,48,70,0.22)]">
            <UserCircle2 className="h-12 w-12 text-[#66e3ff]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#172519]">{profile.full_name}</h1>
            <div className="mt-2 flex items-center gap-2 text-[#627364]">
              <Mail className="h-4 w-4" />
              {profile.email}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Badge variant="indigo">{profile.current_level}</Badge>
          <Badge variant="cyan">Ability {Math.round(profile.ability_score)}</Badge>
        </div>
      </Card>

      <AbilityChart data={history} />

      <Card className="space-y-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-[#172519]">Recent Sessions</h2>
            <p className="mt-1 text-sm text-[#627364]">Click a row to expand the answer summary.</p>
          </div>
          <Button variant="outline" onClick={exportCsv}>
            <Download className="mr-2 h-4 w-4" />
            Download Performance Report
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-[#809083]">
              <tr className="border-b border-[#dbe8dc]">
                <th className="pb-3">Date</th>
                <th className="pb-3">Subject</th>
                <th className="pb-3">Score</th>
                <th className="pb-3">Accuracy</th>
                <th className="pb-3">Difficulty Level</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => {
                const expanded = expandedId === session.id;
                const accuracy = percent(session.answers.filter((answer) => answer.correct).length, Math.max(session.answers.length, 1));
                return (
                  <Fragment key={session.id}>
                    <tr
                      className="cursor-pointer border-b border-[#e2ece3] text-[#405043] transition hover:bg-[#f6fff6]"
                      onClick={() => setExpandedId(expanded ? null : session.id)}
                    >
                      <td className="py-4">{formatDate(session.completed_at ?? session.started_at)}</td>
                      <td className="py-4">{humanizeIdentifier(session.subject_id)}</td>
                      <td className="py-4">{session.final_score}%</td>
                      <td className="py-4">{accuracy}%</td>
                      <td className="py-4">{Math.round(session.ability_estimate)}</td>
                    </tr>
                    {expanded && (
                      <tr className="border-b border-[#e2ece3]">
                        <td colSpan={5} className="pb-4">
                          <div className="rounded-[22px] border border-[#dcecdc] bg-[#f8fff8] p-4 text-[#536255]">
                            Strong: {session.strong_concepts.join(', ') || 'None'} | Needs work: {session.weak_concepts.join(', ') || 'None'}
                            <div className="mt-4">
                              <Link to={`/report/${session.id}`} className="font-medium text-[#18a9d8] hover:text-[#0d83ab]">
                                Open separate report
                              </Link>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

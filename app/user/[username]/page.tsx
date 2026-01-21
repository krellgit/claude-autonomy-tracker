import Link from 'next/link';
import { getUserSessions, getUserStats } from '@/lib/db';
import SessionCard from '@/components/SessionCard';
import { Session } from '@/lib/types';

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export const revalidate = 60;

interface PageProps {
  params: Promise<{ username: string }>;
}

export default async function UserPage({ params }: PageProps) {
  const { username } = await params;
  const decodedUsername = decodeURIComponent(username);

  let sessions: Session[] = [];
  let stats: any = null;

  try {
    [sessions, stats] = await Promise.all([
      getUserSessions(decodedUsername, 50),
      getUserStats(decodedUsername)
    ]);
  } catch (error) {
    console.error('Error loading user data:', error);
  }

  if (sessions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold mb-4">{decodedUsername}</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">No sessions found for this user</p>
          <Link
            href="/"
            className="text-blue-600 hover:underline"
          >
            ← Back to Leaderboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* User Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">{decodedUsername}</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {stats?.sessionCount || 0} sessions recorded
        </p>
      </div>

      {/* User Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Sessions</div>
            <div className="text-3xl font-bold text-blue-600">{stats.sessionCount}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 dark:text-gray-400">Longest Session</div>
            <div className="text-3xl font-bold text-green-600">
              {formatDuration(stats.longestDuration)}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 dark:text-gray-400">Average Duration</div>
            <div className="text-3xl font-bold text-purple-600">
              {formatDuration(stats.averageDuration)}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Actions</div>
            <div className="text-3xl font-bold text-orange-600">
              {stats.totalActions.toLocaleString()}
            </div>
          </div>
        </div>
      )}

      {/* Sessions List */}
      <div>
        <h2 className="text-2xl font-bold mb-6">All Sessions</h2>
        <div className="space-y-4">
          {sessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      </div>

      {/* Back to Home */}
      <div className="text-center">
        <Link
          href="/"
          className="text-blue-600 hover:underline"
        >
          ← Back to Leaderboard
        </Link>
      </div>
    </div>
  );
}

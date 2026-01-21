import Link from 'next/link';
import Leaderboard from '@/components/Leaderboard';
import { getLeaderboard, getStats } from '@/lib/db';
import { Session, Stats } from '@/lib/types';

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export const revalidate = 60; // Revalidate every 60 seconds

export default async function HomePage() {
  let sessions: Session[] = [];
  let stats: Stats | null = null;

  try {
    [sessions, stats] = await Promise.all([
      getLeaderboard(10),
      getStats()
    ]);
  } catch (error) {
    console.error('Error loading data:', error);
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold mb-4">Claude Code Autonomy Tracker</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
          Measure and compare how long Claude Code can work autonomously
        </p>
        <Link
          href="/submit"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md"
        >
          Submit Your Session
        </Link>
      </div>

      {/* Stats Grid */}
      {stats && stats.totalSessions > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Sessions</div>
            <div className="text-3xl font-bold text-blue-600">{stats.totalSessions}</div>
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

      {/* Leaderboard */}
      <div>
        <Leaderboard sessions={sessions} title="Leaderboard - Longest Autonomous Sessions" />
      </div>

      {/* How It Works */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mt-8">
        <h2 className="text-2xl font-bold mb-4">How It Works</h2>
        <div className="space-y-3 text-gray-700 dark:text-gray-300">
          <p>1. Use Claude Code for your projects</p>
          <p>2. Track the time between your messages (autonomous work periods)</p>
          <p>3. Submit your session data here or use our hook script</p>
          <p>4. Compare your results with others on the leaderboard</p>
        </div>
        <div className="mt-6">
          <Link
            href="/submit"
            className="text-blue-600 hover:underline font-medium"
          >
            Learn more about submitting sessions →
          </Link>
        </div>
      </div>
    </div>
  );
}

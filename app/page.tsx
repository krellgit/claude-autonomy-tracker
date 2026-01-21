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
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Sessions are automatically tracked via the Claude Code hook script
        </p>
      </div>

      {/* What This Does */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-3 text-blue-900 dark:text-blue-100">What is this?</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          This leaderboard tracks <strong>autonomous work periods</strong> in Claude Code - the time between when you send a message and when you send your next message. During this time, Claude Code works independently to complete tasks, execute commands, write code, and solve problems without human intervention.
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          The longer the autonomous period, the more complex and self-sufficient Claude Code was able to be. Install our hook script to automatically track your sessions and see how you compare with others pushing the boundaries of AI autonomy!
        </p>
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
          <p>1. Download and install the Claude Code hook script from our GitHub repository</p>
          <p>2. Configure the script with your username</p>
          <p>3. Use Claude Code for your projects as usual</p>
          <p>4. The hook automatically tracks time between your messages and submits sessions</p>
          <p>5. Compare your results with others on the leaderboard</p>
        </div>
        <div className="mt-6">
          <a
            href="https://github.com/krellgit/claude-autonomy-tracker/blob/master/scripts/claude-timer-hook.sh"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
          >
            Download Hook Script
          </a>
          <a
            href="https://github.com/krellgit/claude-autonomy-tracker"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block ml-4 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md"
          >
            View on GitHub
          </a>
        </div>
      </div>
    </div>
  );
}

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

export const revalidate = 60;

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
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Hero */}
        <div className="text-center lg:text-left">
          <h1 className="text-3xl font-bold mb-2">Autonomy Leaderboard</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Track how long Claude Code works without human input
          </p>
        </div>

        {/* Stats Grid */}
        {stats && stats.totalSessions > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="text-xs text-gray-500 dark:text-gray-400">Sessions</div>
              <div className="text-2xl font-bold text-blue-600">{stats.totalSessions}</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="text-xs text-gray-500 dark:text-gray-400">Longest</div>
              <div className="text-2xl font-bold text-green-600">
                {formatDuration(stats.longestDuration)}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="text-xs text-gray-500 dark:text-gray-400">Average</div>
              <div className="text-2xl font-bold text-purple-600">
                {formatDuration(stats.averageDuration)}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="text-xs text-gray-500 dark:text-gray-400">Actions</div>
              <div className="text-2xl font-bold text-orange-600">
                {stats.totalActions.toLocaleString()}
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard */}
        <div>
          <Leaderboard sessions={sessions} title="Top Sessions" />
        </div>
      </div>

      {/* Sidebar */}
      <div className="lg:w-80 space-y-4">
        {/* What is this */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2 text-blue-900 dark:text-blue-100">What is this?</h2>
          <p className="text-xs text-gray-700 dark:text-gray-300 mb-2">
            Tracks autonomous work periods - time between your messages while Claude Code works independently.
          </p>
          <p className="text-xs text-gray-700 dark:text-gray-300">
            Longer periods = more complex autonomous work.
          </p>
        </div>

        {/* Setup */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-3">Quick Setup</h2>

          <div className="space-y-3 text-xs">
            <div>
              <div className="font-semibold mb-1">Option 1: NPM (Easiest)</div>
              <div className="bg-gray-100 dark:bg-gray-900 rounded p-2 font-mono text-xs mb-1">
                npm install -g claude-autonomy-hook
              </div>
              <div className="bg-gray-100 dark:bg-gray-900 rounded p-2 font-mono text-xs">
                claude-hook setup
              </div>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Follow prompts to configure
              </p>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
              <div className="font-semibold mb-1">Option 2: Manual Script</div>
              <div className="space-y-1">
                <p>1. Download hook script from GitHub</p>
                <p>2. Set username: <code className="bg-gray-100 dark:bg-gray-900 px-1 rounded">export CLAUDE_TRACKER_USERNAME="you"</code></p>
                <p>3. Add to Claude Code hooks</p>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <a
              href="https://github.com/krellgit/claude-autonomy-tracker"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded"
            >
              View on GitHub
            </a>
            <a
              href="https://github.com/krellgit/claude-autonomy-tracker/blob/master/scripts/claude-timer-hook.sh"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium py-2 px-3 rounded"
            >
              Download Script
            </a>
          </div>
        </div>

        {/* API */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h3 className="text-sm font-semibold mb-2">API Endpoint</h3>
          <code className="text-xs bg-gray-100 dark:bg-gray-900 p-2 rounded block break-all">
            POST https://longcc.the-ppc-geek.org/api/sessions
          </code>
        </div>
      </div>
    </div>
  );
}

import Leaderboard from '@/components/Leaderboard';
import CopyButton from '@/components/CopyButton';
import LimitSelector from '@/components/LimitSelector';
import FilterControls from '@/components/FilterControls';
import UserRankingsTable from '@/components/UserRankingsTable';
import { getLeaderboard, getStats, getUserRankings } from '@/lib/db';
import { Session, Stats, UserRanking } from '@/lib/types';

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
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;

  // Parse filters for top sessions table
  const sessionsLimit = parseInt((params.sessions_limit as string) || '5');

  // Parse filters for user rankings table
  const usersLimit = parseInt((params.users_limit as string) || '50');
  const userSort = (params.user_sort as 'duration' | 'sessions' | 'recent') || 'duration';
  const userOrder = (params.user_order as 'asc' | 'desc') || 'desc';
  const usernameFilter = params.username as string | undefined;

  let sessions: Session[] = [];
  let userRankings: UserRanking[] = [];
  let stats: Stats | null = null;

  try {
    [sessions, userRankings, stats] = await Promise.all([
      getLeaderboard(sessionsLimit),
      getUserRankings(usersLimit, userSort, userOrder, usernameFilter),
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

        {/* Table 1: Top Sessions Leaderboard */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Top Sessions</h2>
            <LimitSelector
              paramName="sessions_limit"
              options={[5, 10, 20, 50]}
              defaultValue={5}
            />
          </div>
          <Leaderboard sessions={sessions} title="" />
        </div>

        {/* Table 2: User Rankings */}
        <div>
          <h2 className="text-xl font-bold mb-4">User Rankings</h2>
          <FilterControls />
          <UserRankingsTable rankings={userRankings} title="" />
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
              <div className="font-semibold mb-2">Automatic Install</div>
              <div className="relative bg-gray-100 dark:bg-gray-900 rounded p-2 pr-16 font-mono text-xs overflow-x-auto">
                CLAUDE_USERNAME=yourname bash -c "$(curl -fsSL https://raw.githubusercontent.com/krellgit/claude-autonomy-tracker/master/install.sh)"
                <CopyButton text='CLAUDE_USERNAME=yourname bash -c "$(curl -fsSL https://raw.githubusercontent.com/krellgit/claude-autonomy-tracker/master/install.sh)"' />
              </div>
              <p className="text-gray-500 dark:text-gray-500 mt-2 text-xs italic">
                Replace "yourname" with your username, paste in Terminal, and press Enter
              </p>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
              <div className="font-semibold mb-1">Manual Install</div>
              <div className="space-y-1">
                <p>1. Download script from GitHub</p>
                <p>2. Set <code className="bg-gray-100 dark:bg-gray-900 px-1 rounded">CLAUDE_TRACKER_USERNAME</code></p>
                <p>3. Add to Claude Code hooks config</p>
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
      </div>
    </div>
  );
}

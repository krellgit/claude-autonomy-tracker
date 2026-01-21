import Leaderboard from '@/components/Leaderboard';
import CopyButton from '@/components/CopyButton';
import UserRankingsTable from '@/components/UserRankingsTable';
import UsernameFilter from '@/components/UsernameFilter';
import { getStats, getUserRankings, getSessionsByUser } from '@/lib/db';
import { Session, Stats, UserRanking } from '@/lib/types';

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export const revalidate = 3600; // Revalidate every hour (stats cached for better performance)

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;

  // Parse filters for top users table (always 5)
  const topUsersLimit = 5;

  // Parse filters for all sessions table
  const usernameFilter = params.username as string | undefined;

  let topUsers: UserRanking[] = [];
  let allSessions: Session[] = [];
  let stats: Stats | null = null;

  try {
    [topUsers, allSessions, stats] = await Promise.all([
      getUserRankings(topUsersLimit, 'duration', 'desc'), // Top 5 unique users
      getSessionsByUser(usernameFilter, 100), // Up to 5 sessions per user
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
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="text-xs text-gray-500 dark:text-gray-400">Total Runs</div>
              <div className="text-2xl font-bold text-blue-600">{stats.totalSessions}</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="text-xs text-gray-500 dark:text-gray-400">Longest Run</div>
              <div className="text-2xl font-bold text-green-600">
                {formatDuration(stats.longestDuration)}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="text-xs text-gray-500 dark:text-gray-400">Average Run</div>
              <div className="text-2xl font-bold text-purple-600">
                {formatDuration(stats.averageDuration)}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="text-xs text-gray-500 dark:text-gray-400">Most Tools Used</div>
              <div className="text-2xl font-bold text-red-600">
                {stats.maxActions}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="text-xs text-gray-500 dark:text-gray-400">Total Actions</div>
              <div className="text-2xl font-bold text-orange-600">
                {stats.totalActions.toLocaleString()}
              </div>
            </div>
          </div>
        )}

        {/* Table 1: Top 5 Users (Unique) */}
        <div>
          <h2 className="text-xl font-bold mb-4">Top 5 Users</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Each user shown once with their longest autonomous run
          </p>
          <UserRankingsTable rankings={topUsers} title="" />
        </div>

        {/* Table 2: All Sessions by User */}
        <div>
          <h2 className="text-xl font-bold mb-4">All Sessions by User</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Up to 5 sessions per user, grouped by username
          </p>

          <UsernameFilter />
          <Leaderboard sessions={allSessions} title="" />
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
          <h2 className="text-lg font-semibold mb-3">How to Submit</h2>

          <div className="space-y-3 text-xs">
            {/* Step 1: Install Skill */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded p-3">
              <div className="font-semibold mb-2 text-blue-900 dark:text-blue-100">
                1️⃣ Install the Skill (One-Time)
              </div>
              <div className="relative bg-gray-100 dark:bg-gray-900 rounded p-2 pr-16 font-mono text-xs overflow-x-auto mb-2">
                bash -c "$(curl -fsSL https://raw.githubusercontent.com/krellgit/claude-autonomy-tracker/master/install-skill.sh)"
                <CopyButton text='bash -c "$(curl -fsSL https://raw.githubusercontent.com/krellgit/claude-autonomy-tracker/master/install-skill.sh)"' />
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-xs">
                Installs the /longcc command in Claude Code
              </p>
            </div>

            {/* Step 2: Set Username */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded p-3">
              <div className="font-semibold mb-2 text-green-900 dark:text-green-100">
                2️⃣ Set Your Username
              </div>
              <div className="relative bg-gray-100 dark:bg-gray-900 rounded p-2 pr-16 font-mono text-xs overflow-x-auto mb-2">
                export CLAUDE_TRACKER_USERNAME=yourname
                <CopyButton text='export CLAUDE_TRACKER_USERNAME=yourname' />
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-xs">
                Replace "yourname" with your username
              </p>
            </div>

            {/* Step 3: Run Command */}
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded p-3">
              <div className="font-semibold mb-2 text-purple-900 dark:text-purple-100">
                3️⃣ Submit Your Top 5
              </div>
              <div className="relative bg-gray-100 dark:bg-gray-900 rounded p-2 pr-16 font-mono text-xs overflow-x-auto mb-2">
                /longcc
                <CopyButton text='/longcc' />
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-xs">
                Analyzes history and submits top 5 longest runs
              </p>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
              <p className="text-xs text-gray-500 dark:text-gray-500 italic">
                💡 Run /longcc anytime to update your leaderboard position
              </p>
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
          </div>
        </div>
      </div>
    </div>
  );
}

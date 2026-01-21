import SubmitForm from '@/components/SubmitForm';
import Link from 'next/link';

export default function SubmitPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Submit Your Session</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your Claude Code autonomous work periods and join the leaderboard
        </p>
      </div>

      <SubmitForm />

      {/* Instructions */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Automatic Tracking with Hook Script</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Instead of manually submitting sessions, you can use our hook script to automatically track and submit your Claude Code sessions.
        </p>

        <div className="bg-white dark:bg-gray-900 rounded border border-gray-300 dark:border-gray-700 p-4 mb-4">
          <h3 className="font-semibold mb-2">Installation Steps:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li>Download the hook script from the repository</li>
            <li>Make it executable: <code className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded">chmod +x claude-timer-hook.sh</code></li>
            <li>Configure it in your Claude Code hooks settings</li>
            <li>Set your username in the script</li>
          </ol>
        </div>

        <a
          href="https://github.com/krellgit/claude-autonomy-tracker/blob/main/scripts/claude-timer-hook.sh"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md"
        >
          View Hook Script on GitHub
        </a>
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

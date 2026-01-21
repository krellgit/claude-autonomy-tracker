import { Session } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

interface SessionCardProps {
  session: Session;
  rank?: number;
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
}

export default function SessionCard({ session, rank }: SessionCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {rank && (
            <div className="inline-block bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded mb-2">
              #{rank}
            </div>
          )}
          <Link
            href={`/user/${session.username}`}
            className="text-lg font-semibold text-blue-600 hover:underline"
          >
            {session.username}
          </Link>
          {session.task_description && (
            <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">
              {session.task_description}
            </p>
          )}
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-600">
            {formatDuration(session.autonomous_duration)}
          </div>
          <div className="text-xs text-gray-500">
            {session.action_count || 0} actions
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500">
        <div className="flex justify-between">
          <span>
            Submitted {formatDistanceToNow(new Date(session.created_at), { addSuffix: true })}
          </span>
          {session.session_start && (
            <span>
              Started {new Date(session.session_start).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

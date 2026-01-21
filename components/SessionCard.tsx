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
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
}

export default function SessionCard({ session, rank }: SessionCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {rank && (
            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white text-sm font-bold rounded-full flex items-center justify-center">
              {rank}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <Link
              href={`/user/${session.username}`}
              className="text-base font-semibold text-blue-600 hover:underline truncate block"
            >
              {session.username}
            </Link>
          </div>
        </div>
        <div className="text-right flex-shrink-0 ml-4">
          <div className="text-xl font-bold text-green-600">
            {formatDuration(session.autonomous_duration)}
          </div>
          <div className="text-xs text-gray-500">
            {session.action_count || 0} acts
          </div>
        </div>
      </div>
      <div className="mt-2 text-xs text-gray-400">
        {formatDistanceToNow(new Date(session.created_at), { addSuffix: true })}
      </div>
    </div>
  );
}

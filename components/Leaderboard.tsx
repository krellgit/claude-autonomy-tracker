import { Session } from '@/lib/types';
import SessionCard from './SessionCard';

interface LeaderboardProps {
  sessions: Session[];
  title?: string;
}

export default function Leaderboard({ sessions, title = 'Top Sessions' }: LeaderboardProps) {
  if (sessions.length === 0) {
    return (
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">No sessions yet. Install the hook to start tracking!</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="space-y-3">
        {sessions.map((session, index) => (
          <SessionCard
            key={session.id}
            session={session}
            rank={index + 1}
          />
        ))}
      </div>
    </div>
  );
}

// TypeScript types for Claude Code Autonomy Tracker

export interface Session {
  id: number;
  username: string;
  task_description: string | null;
  autonomous_duration: number; // in seconds
  action_count: number | null;
  session_start: Date | null;
  session_end: Date | null;
  created_at: Date;
  metadata: Record<string, any>;
}

export interface SessionInput {
  username: string;
  task_description?: string;
  autonomous_duration: number;
  action_count?: number;
  session_start?: Date | string;
  session_end?: Date | string;
  metadata?: Record<string, any>;
}

export interface Stats {
  totalUsers: number;
  totalSessions: number;
  totalDuration: number;
  longestDuration: number;
  averageDuration: number;
  totalActions: number;
  maxActions: number;
  topUsers: Array<{
    username: string;
    sessionCount: number;
    totalDuration: number;
  }>;
}

export interface QueryParams {
  limit?: number;
  offset?: number;
  username?: string;
  sort?: 'duration' | 'created_at' | 'action_count';
  order?: 'asc' | 'desc';
}

export interface UserRanking {
  username: string;
  best_duration: number;
  best_action_count: number;
  avg_duration: number;
  total_duration: number;
  session_count: number;
  latest_session: Date;
}

export interface UserRankingsParams {
  limit?: number;
  sortBy?: 'duration' | 'total_time' | 'sessions' | 'recent';
  order?: 'asc' | 'desc';
  username?: string;
}

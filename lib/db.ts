import { sql } from '@vercel/postgres';
import { Session, SessionInput, Stats, QueryParams, UserRanking } from './types';

/**
 * Insert a new session into the database
 */
export async function createSession(input: SessionInput): Promise<Session> {
  const sessionStart = input.session_start
    ? (typeof input.session_start === 'string' ? input.session_start : input.session_start.toISOString())
    : null;
  const sessionEnd = input.session_end
    ? (typeof input.session_end === 'string' ? input.session_end : input.session_end.toISOString())
    : null;

  const { rows } = await sql<Session>`
    INSERT INTO sessions (
      username,
      task_description,
      autonomous_duration,
      action_count,
      session_start,
      session_end,
      metadata
    )
    VALUES (
      ${input.username},
      ${input.task_description || null},
      ${input.autonomous_duration},
      ${input.action_count || 0},
      ${sessionStart},
      ${sessionEnd},
      ${JSON.stringify(input.metadata || {})}::jsonb
    )
    RETURNING *
  `;

  return rows[0];
}

/**
 * Get sessions with optional filtering and pagination
 */
export async function getSessions(params: QueryParams = {}): Promise<Session[]> {
  const {
    limit = 50,
    offset = 0,
    username,
    sort = 'created_at',
    order = 'desc'
  } = params;

  // Validate sort column against allowlist (prevent SQL injection)
  const ALLOWED_SORT_COLUMNS: Record<string, string> = {
    'duration': 'autonomous_duration',
    'autonomous_duration': 'autonomous_duration',
    'created_at': 'created_at',
    'action_count': 'action_count'
  };

  const sortColumn = ALLOWED_SORT_COLUMNS[sort] || 'created_at';

  // Validate order direction (prevent SQL injection)
  const orderDirection = order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

  // Use parameterized queries to prevent SQL injection
  // Note: sortColumn is already validated against ALLOWED_SORT_COLUMNS allowlist
  if (username) {
    const query = `
      SELECT * FROM sessions
      WHERE LOWER(username) = LOWER($1)
        AND LOWER(username) NOT LIKE '%test%'
      ORDER BY ${sortColumn} ${orderDirection}
      LIMIT $2
      OFFSET $3
    `;
    const { rows } = await sql.query<Session>(query, [username, limit, offset]);
    return rows;
  } else {
    const query = `
      SELECT * FROM sessions
      WHERE LOWER(username) NOT LIKE '%test%'
      ORDER BY ${sortColumn} ${orderDirection}
      LIMIT $1
      OFFSET $2
    `;
    const { rows } = await sql.query<Session>(query, [limit, offset]);
    return rows;
  }
}

/**
 * Get leaderboard (top sessions by duration)
 */
export async function getLeaderboard(limit: number = 10): Promise<Session[]> {
  const { rows } = await sql<Session>`
    SELECT * FROM sessions
    WHERE LOWER(username) NOT LIKE '%test%'
    ORDER BY autonomous_duration DESC
    LIMIT ${limit}
  `;

  return rows;
}

/**
 * Get sessions for a specific user
 */
export async function getUserSessions(username: string, limit: number = 50): Promise<Session[]> {
  const { rows } = await sql<Session>`
    SELECT * FROM sessions
    WHERE LOWER(username) = LOWER(${username})
      AND LOWER(username) NOT LIKE '%test%'
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;

  return rows;
}

/**
 * Get aggregate statistics
 */
export async function getStats(): Promise<Stats> {
  // Get total sessions and duration stats
  const { rows: statsRows } = await sql`
    SELECT
      COUNT(*) as total_sessions,
      MAX(autonomous_duration) as longest_duration,
      AVG(autonomous_duration)::INTEGER as average_duration,
      SUM(action_count)::INTEGER as total_actions,
      MAX(action_count) as max_actions
    FROM sessions
    WHERE LOWER(username) NOT LIKE '%test%'
  `;

  // Get top users (case-insensitive grouping)
  const { rows: topUsersRows } = await sql`
    SELECT
      MAX(username) as username,
      COUNT(*) as session_count,
      SUM(autonomous_duration)::INTEGER as total_duration
    FROM sessions
    WHERE LOWER(username) NOT LIKE '%test%'
    GROUP BY LOWER(username)
    ORDER BY total_duration DESC
    LIMIT 10
  `;

  return {
    totalSessions: parseInt(statsRows[0].total_sessions) || 0,
    longestDuration: parseInt(statsRows[0].longest_duration) || 0,
    averageDuration: parseInt(statsRows[0].average_duration) || 0,
    totalActions: parseInt(statsRows[0].total_actions) || 0,
    maxActions: parseInt(statsRows[0].max_actions) || 0,
    topUsers: topUsersRows.map(row => ({
      username: row.username,
      sessionCount: parseInt(row.session_count),
      totalDuration: parseInt(row.total_duration)
    }))
  };
}

/**
 * Get user-specific statistics
 */
export async function getUserStats(username: string) {
  const { rows } = await sql`
    SELECT
      COUNT(*) as session_count,
      MAX(autonomous_duration) as longest_duration,
      AVG(autonomous_duration)::INTEGER as average_duration,
      SUM(action_count)::INTEGER as total_actions
    FROM sessions
    WHERE LOWER(username) = LOWER(${username})
      AND LOWER(username) NOT LIKE '%test%'
  `;

  return {
    sessionCount: parseInt(rows[0].session_count) || 0,
    longestDuration: parseInt(rows[0].longest_duration) || 0,
    averageDuration: parseInt(rows[0].average_duration) || 0,
    totalActions: parseInt(rows[0].total_actions) || 0
  };
}

/**
 * Get user rankings (unique users with their best performance)
 */
export async function getUserRankings(
  limit: number = 50,
  sortBy: 'duration' | 'sessions' | 'recent' = 'duration',
  order: 'asc' | 'desc' = 'desc',
  usernameFilter?: string
): Promise<UserRanking[]> {
  // Validate sort option and map to column name
  const SORT_COLUMNS: Record<string, string> = {
    'duration': 'best_duration',
    'sessions': 'session_count',
    'recent': 'latest_session'
  };

  const sortColumn = SORT_COLUMNS[sortBy] || 'best_duration';
  const orderDirection = order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

  // Build query with optional username filter
  // Note: sortColumn is already validated against SORT_COLUMNS allowlist
  if (usernameFilter) {
    const query = `
      SELECT
        MAX(username) as username,
        MAX(autonomous_duration)::INTEGER as best_duration,
        MAX(action_count)::INTEGER as best_action_count,
        COUNT(*)::INTEGER as session_count,
        MAX(created_at) as latest_session
      FROM sessions
      WHERE LOWER(username) = LOWER($1)
        AND LOWER(username) NOT LIKE '%test%'
      GROUP BY LOWER(username)
      ORDER BY ${sortColumn} ${orderDirection}
      LIMIT $2
    `;
    const { rows } = await sql.query<UserRanking>(query, [usernameFilter, limit]);
    return rows;
  } else {
    const query = `
      SELECT
        MAX(username) as username,
        MAX(autonomous_duration)::INTEGER as best_duration,
        MAX(action_count)::INTEGER as best_action_count,
        COUNT(*)::INTEGER as session_count,
        MAX(created_at) as latest_session
      FROM sessions
      WHERE LOWER(username) NOT LIKE '%test%'
      GROUP BY LOWER(username)
      ORDER BY ${sortColumn} ${orderDirection}
      LIMIT $1
    `;
    const { rows } = await sql.query<UserRanking>(query, [limit]);
    return rows;
  }
}

/**
 * Get sessions grouped by user (up to 5 per user)
 */
export async function getSessionsByUser(
  usernameFilter?: string,
  limit: number = 100
): Promise<Session[]> {
  // Get top 5 sessions per user using window function
  if (usernameFilter) {
    const query = `
      SELECT * FROM (
        SELECT *,
               ROW_NUMBER() OVER (PARTITION BY LOWER(username) ORDER BY autonomous_duration DESC) as rn
        FROM sessions
        WHERE LOWER(username) = LOWER($1)
          AND LOWER(username) NOT LIKE '%test%'
      ) ranked
      WHERE rn <= 5
      ORDER BY username, autonomous_duration DESC
    `;
    const { rows } = await sql.query<Session>(query, [usernameFilter]);
    return rows;
  } else {
    const query = `
      SELECT * FROM (
        SELECT *,
               ROW_NUMBER() OVER (PARTITION BY LOWER(username) ORDER BY autonomous_duration DESC) as rn
        FROM sessions
        WHERE LOWER(username) NOT LIKE '%test%'
      ) ranked
      WHERE rn <= 5
      ORDER BY username, autonomous_duration DESC
      LIMIT $1
    `;
    const { rows } = await sql.query<Session>(query, [limit]);
    return rows;
  }
}

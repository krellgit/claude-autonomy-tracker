import { sql } from '@vercel/postgres';
import { Session, SessionInput, Stats, QueryParams } from './types';

/**
 * Insert a new session into the database
 */
export async function createSession(input: SessionInput): Promise<Session> {
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
      ${input.session_start || null},
      ${input.session_end || null},
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

  let query = 'SELECT * FROM sessions';
  const conditions: string[] = [];

  if (username) {
    conditions.push(`username = '${username}'`);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ` ORDER BY ${sort} ${order.toUpperCase()}`;
  query += ` LIMIT ${limit} OFFSET ${offset}`;

  const { rows } = await sql.query<Session>(query);
  return rows;
}

/**
 * Get leaderboard (top sessions by duration)
 */
export async function getLeaderboard(limit: number = 10): Promise<Session[]> {
  const { rows } = await sql<Session>`
    SELECT * FROM sessions
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
    WHERE username = ${username}
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
      SUM(action_count)::INTEGER as total_actions
    FROM sessions
  `;

  // Get top users
  const { rows: topUsersRows } = await sql`
    SELECT
      username,
      COUNT(*) as session_count,
      SUM(autonomous_duration)::INTEGER as total_duration
    FROM sessions
    GROUP BY username
    ORDER BY total_duration DESC
    LIMIT 10
  `;

  return {
    totalSessions: parseInt(statsRows[0].total_sessions) || 0,
    longestDuration: parseInt(statsRows[0].longest_duration) || 0,
    averageDuration: parseInt(statsRows[0].average_duration) || 0,
    totalActions: parseInt(statsRows[0].total_actions) || 0,
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
    WHERE username = ${username}
  `;

  return {
    sessionCount: parseInt(rows[0].session_count) || 0,
    longestDuration: parseInt(rows[0].longest_duration) || 0,
    averageDuration: parseInt(rows[0].average_duration) || 0,
    totalActions: parseInt(rows[0].total_actions) || 0
  };
}

import { NextRequest, NextResponse } from 'next/server';
import { createSession, getSessions } from '@/lib/db';
import { SessionInput } from '@/lib/types';
import { sql } from '@vercel/postgres';

/**
 * POST /api/sessions
 * Create a new session
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.username || !body.autonomous_duration) {
      return NextResponse.json(
        { error: 'Missing required fields: username, autonomous_duration' },
        { status: 400 }
      );
    }

    // Validate duration is a positive number
    if (typeof body.autonomous_duration !== 'number' || body.autonomous_duration < 0) {
      return NextResponse.json(
        { error: 'autonomous_duration must be a positive number' },
        { status: 400 }
      );
    }

    const sessionInput: SessionInput = {
      username: body.username,
      task_description: body.task_description,
      autonomous_duration: body.autonomous_duration,
      action_count: body.action_count,
      session_start: body.session_start,
      session_end: body.session_end,
      metadata: body.metadata || {}
    };

    const session = await createSession(sessionInput);

    return NextResponse.json(
      { success: true, session },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/sessions
 * Get sessions with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const params = {
      limit: parseInt(searchParams.get('limit') || '50'),
      offset: parseInt(searchParams.get('offset') || '0'),
      username: searchParams.get('username') || undefined,
      sort: (searchParams.get('sort') as 'duration' | 'created_at' | 'action_count') || 'created_at',
      order: (searchParams.get('order') as 'asc' | 'desc') || 'desc'
    };

    const sessions = await getSessions(params);

    return NextResponse.json({
      success: true,
      sessions,
      count: sessions.length
    });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/sessions
 * Delete sessions (requires username query param for safety)
 */
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const username = searchParams.get('username');
    const sessionId = searchParams.get('id');

    // Safety check: require either username or id
    if (!username && !sessionId) {
      return NextResponse.json(
        { error: 'Must provide either username or id parameter' },
        { status: 400 }
      );
    }

    let deletedCount = 0;
    if (sessionId) {
      // Delete specific session by ID
      const result = await sql`DELETE FROM sessions WHERE id = ${parseInt(sessionId)}`;
      deletedCount = result.rowCount || 0;
    } else if (username) {
      // Delete all sessions for a user
      const result = await sql`DELETE FROM sessions WHERE username = ${username}`;
      deletedCount = result.rowCount || 0;
    }

    return NextResponse.json({
      success: true,
      deletedCount
    });
  } catch (error) {
    console.error('Error deleting sessions:', error);
    return NextResponse.json(
      { error: 'Failed to delete sessions' },
      { status: 500 }
    );
  }
}

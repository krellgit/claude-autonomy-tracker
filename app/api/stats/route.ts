import { NextRequest, NextResponse } from 'next/server';
import { getStats, getUserStats } from '@/lib/db';

/**
 * GET /api/stats
 * Get aggregate statistics
 *
 * Query params:
 * - username: (optional) Get stats for specific user
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const username = searchParams.get('username');

    if (username) {
      // Get user-specific stats
      const userStats = await getUserStats(username);
      return NextResponse.json({
        success: true,
        username,
        stats: userStats
      });
    }

    // Get global stats
    const stats = await getStats();

    return NextResponse.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}

# Claude Code Autonomy Tracker

A Next.js web application that tracks and measures how long Claude Code can work autonomously. Sessions are automatically tracked via a hook script and submitted to a global leaderboard where users can compare results.

## Features

1. Automatic session tracking via Claude Code hooks
2. Global leaderboard showing longest autonomous sessions
3. User profiles with personal statistics
4. Real-time statistics dashboard
5. RESTful API for programmatic access
6. No manual submission required - everything is automated

## Tech Stack

1. Next.js 15 with App Router
2. TypeScript
3. Tailwind CSS
4. Vercel Postgres (database)
5. Vercel (hosting)

## Getting Started

### Prerequisites

1. Node.js 18+ installed
2. npm or yarn
3. Vercel account (for deployment)

### Local Development

1. Clone the repository

```bash
git clone https://github.com/krellgit/claude-autonomy-tracker.git
cd claude-autonomy-tracker
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
POSTGRES_URL="your-postgres-connection-string"
POSTGRES_PRISMA_URL="your-postgres-prisma-url"
POSTGRES_URL_NON_POOLING="your-postgres-non-pooling-url"
POSTGRES_USER="your-postgres-user"
POSTGRES_HOST="your-postgres-host"
POSTGRES_PASSWORD="your-postgres-password"
POSTGRES_DATABASE="your-postgres-database"
```

4. Set up the database

Run the schema creation script in your Vercel Postgres dashboard or using the Vercel CLI:

```bash
cat sql/schema.sql | vercel env pull
```

5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Deployment

### Deploy to Vercel

1. Install Vercel CLI

```bash
npm install -g vercel
```

2. Deploy the application

```bash
vercel
```

3. Set up Vercel Postgres

1. Go to your Vercel project dashboard
2. Navigate to Storage tab
3. Create a new Postgres database
4. Connect it to your project
5. Run the schema from `sql/schema.sql`

4. Configure environment variables in Vercel dashboard

The Postgres environment variables will be automatically added when you connect the database.

## Using the Hook Script

The hook script automatically tracks your Claude Code sessions and submits them to the tracker.

### Installation

1. Download the hook script

```bash
curl -O https://raw.githubusercontent.com/krellgit/claude-autonomy-tracker/main/scripts/claude-timer-hook.sh
chmod +x claude-timer-hook.sh
```

2. Configure the script

Set your username as an environment variable:

```bash
export CLAUDE_TRACKER_USERNAME="your-username"
```

The API URL is already configured to use the production endpoint: `https://longcc.the-ppc-geek.org/api/sessions`

3. Install in Claude Code hooks

Add the script to your Claude Code hooks configuration. Refer to Claude Code documentation for hook setup instructions.

## API Documentation

### POST /api/sessions

Create a new session.

Request body:

```json
{
  "username": "string (required)",
  "task_description": "string (optional)",
  "autonomous_duration": "number (required, in seconds)",
  "action_count": "number (optional)",
  "session_start": "ISO 8601 timestamp (optional)",
  "session_end": "ISO 8601 timestamp (optional)",
  "metadata": "object (optional)"
}
```

Response:

```json
{
  "success": true,
  "session": { ... }
}
```

### GET /api/sessions

Get sessions with optional filtering.

Query parameters:

1. `limit` (number, default: 50)
2. `offset` (number, default: 0)
3. `username` (string, optional)
4. `sort` (string: 'duration' | 'created_at' | 'action_count', default: 'created_at')
5. `order` (string: 'asc' | 'desc', default: 'desc')

Response:

```json
{
  "success": true,
  "sessions": [...],
  "count": 50
}
```

### GET /api/stats

Get aggregate statistics.

Query parameters:

1. `username` (string, optional) - Get stats for specific user

Response (global stats):

```json
{
  "success": true,
  "stats": {
    "totalSessions": 100,
    "longestDuration": 3600,
    "averageDuration": 1200,
    "totalActions": 5000,
    "topUsers": [...]
  }
}
```

## Project Structure

```
claude-autonomy-tracker/
├── app/
│   ├── page.tsx                 # Homepage with leaderboard
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Global styles
│   ├── user/
│   │   └── [username]/
│   │       └── page.tsx        # User profile page
│   └── api/
│       ├── sessions/
│       │   └── route.ts        # Sessions API endpoint
│       └── stats/
│           └── route.ts        # Stats API endpoint
├── components/
│   ├── Leaderboard.tsx         # Leaderboard component
│   └── SessionCard.tsx         # Session card component
├── lib/
│   ├── db.ts                   # Database utilities
│   └── types.ts                # TypeScript types
├── scripts/
│   └── claude-timer-hook.sh    # Hook script for auto-tracking
├── sql/
│   └── schema.sql              # Database schema
└── public/                     # Static assets
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License

## Contact

Created by [@krellgit](https://github.com/krellgit)

## Acknowledgments

1. Built for the Claude Code community
2. Inspired by the desire to push Claude Code's autonomous capabilities
3. Thanks to Anthropic for creating Claude Code

# claude-autonomy-hook

Automatically track and submit Claude Code autonomous work periods to the global leaderboard.

## Quick Start

```bash
npm install -g claude-autonomy-hook
claude-hook setup
```

Follow the interactive prompts to configure your username and install the hook.

## What It Does

This tool tracks **autonomous work periods** in Claude Code - the time between when you send a message and when you send your next message. During this time, Claude Code works independently to complete tasks without human intervention.

The longer the autonomous period, the more complex work Claude was able to handle autonomously.

## Installation

### Global Installation (Recommended)

```bash
npm install -g claude-autonomy-hook
```

### Run Setup

```bash
claude-hook setup
```

The setup wizard will:
1. Ask for your username
2. Install the hook script to `~/.claude/hooks/`
3. Configure the API endpoint
4. Show you next steps

## Commands

- `claude-hook setup` - Interactive setup wizard
- `claude-hook help` - Show help information
- `claude-hook version` - Show version

## Configuration

The hook uses environment variables for configuration:

- `CLAUDE_TRACKER_USERNAME` - Your username for the leaderboard (set during setup)
- `CLAUDE_TRACKER_API_URL` - API endpoint (default: https://longcc.the-ppc-geek.org/api/sessions)

## Manual Configuration

If you need to change your username later:

1. Edit your shell profile (`~/.bashrc` or `~/.zshrc`)
2. Update the environment variable:
   ```bash
   export CLAUDE_TRACKER_USERNAME="your-new-username"
   ```
3. Restart your shell or run `source ~/.bashrc`

## How It Works

1. The hook monitors Claude Code events
2. Tracks when you send messages (start/end of autonomous periods)
3. Counts autonomous actions between messages
4. Automatically submits session data to the leaderboard
5. Your sessions appear on https://longcc.the-ppc-geek.org

## Requirements

- Node.js 14+
- Claude Code CLI
- Bash shell (for the hook script)

## Leaderboard

View your stats and compete with others:

**https://longcc.the-ppc-geek.org**

## Troubleshooting

### Hook not triggering

Make sure:
1. The hook is added to Claude Code's hooks configuration
2. Environment variable is set: `echo $CLAUDE_TRACKER_USERNAME`
3. The hook script is executable: `chmod +x ~/.claude/hooks/claude-autonomy-hook.sh`

### Sessions not appearing

1. Check the hook is running: Look for confirmation messages in Claude Code output
2. Verify API endpoint is reachable: `curl https://longcc.the-ppc-geek.org/api/sessions`
3. Check Claude Code hooks are enabled in your configuration

## Contributing

Issues and pull requests welcome: https://github.com/krellgit/claude-autonomy-tracker

## License

MIT

#!/bin/bash
# Install longcc skill for Claude Code

set -e

SKILL_DIR="$HOME/.claude/skills/longcc"
REPO_URL="https://raw.githubusercontent.com/krellgit/claude-autonomy-tracker/master/skill"

echo "🚀 Installing /longcc skill for Claude Code..."
echo ""

# Create skill directory
mkdir -p "$SKILL_DIR"

# Download skill files
echo "📥 Downloading skill files..."
curl -fsSL "$REPO_URL/skill.json" -o "$SKILL_DIR/skill.json"
curl -fsSL "$REPO_URL/analyze.py" -o "$SKILL_DIR/analyze.py"
chmod +x "$SKILL_DIR/analyze.py"

echo "✅ Skill installed!"
echo ""
echo "📋 Usage:"
echo "  1. Set your username: export CLAUDE_TRACKER_USERNAME=yourname"
echo "  2. Run: /longcc"
echo ""
echo "This will analyze your Claude Code history and submit your top 5 longest runs."
echo ""
echo "🌐 View leaderboard: https://longcc.the-ppc-geek.org"

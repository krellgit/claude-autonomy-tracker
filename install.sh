#!/bin/bash

# Claude Code Autonomy Tracker - Installation Script
# Usage: CLAUDE_USERNAME=yourname bash -c "$(curl -fsSL https://raw.githubusercontent.com/krellgit/claude-autonomy-tracker/master/install.sh)"

set -e

REPO_URL="https://raw.githubusercontent.com/krellgit/claude-autonomy-tracker/master"
HOOK_URL="$REPO_URL/scripts/claude-timer-hook.sh"
INSTALL_DIR="$HOME/.claude/hooks"
HOOK_FILE="$INSTALL_DIR/claude-autonomy-hook.sh"
API_URL="https://longcc.the-ppc-geek.org/api/sessions"

echo ""
echo "🚀 Claude Code Autonomy Tracker - Installer"
echo ""

# Check if curl or wget is available
if command -v curl >/dev/null 2>&1; then
    DOWNLOAD_CMD="curl -fsSL"
elif command -v wget >/dev/null 2>&1; then
    DOWNLOAD_CMD="wget -qO-"
else
    echo "❌ Error: Neither curl nor wget found. Please install one of them."
    exit 1
fi

# Get username from environment variable or prompt
if [ -z "$CLAUDE_USERNAME" ]; then
    # Check if we can prompt (stdin is a terminal)
    if [ -t 0 ]; then
        read -p "Enter your username for the leaderboard: " USERNAME
    else
        echo "❌ Error: Username not provided"
        echo ""
        echo "Set your username with:"
        echo "  CLAUDE_USERNAME=yourname bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/krellgit/claude-autonomy-tracker/master/install.sh)\""
        echo ""
        exit 1
    fi
else
    USERNAME="$CLAUDE_USERNAME"
fi

if [ -z "$USERNAME" ]; then
    echo "❌ Username is required"
    exit 1
fi

echo ""
echo "📥 Downloading hook script..."

# Create installation directory
mkdir -p "$INSTALL_DIR"

# Download the hook script
$DOWNLOAD_CMD "$HOOK_URL" > "$HOOK_FILE"
chmod +x "$HOOK_FILE"

# Configure the hook with username
sed -i.bak "s/your-username-here/$USERNAME/g" "$HOOK_FILE"
rm -f "$HOOK_FILE.bak"

echo "✓ Hook installed to: $HOOK_FILE"

# Detect shell and config file
if [ -n "$ZSH_VERSION" ]; then
    SHELL_CONFIG="$HOME/.zshrc"
elif [ -n "$BASH_VERSION" ]; then
    SHELL_CONFIG="$HOME/.bashrc"
else
    SHELL_CONFIG="$HOME/.profile"
fi

# Add environment variable to shell config if not already present
if ! grep -q "CLAUDE_TRACKER_USERNAME" "$SHELL_CONFIG" 2>/dev/null; then
    echo "" >> "$SHELL_CONFIG"
    echo "# Claude Code Autonomy Tracker" >> "$SHELL_CONFIG"
    echo "export CLAUDE_TRACKER_USERNAME=\"$USERNAME\"" >> "$SHELL_CONFIG"
    echo "✓ Added CLAUDE_TRACKER_USERNAME to $SHELL_CONFIG"
fi

echo ""
echo "✨ Installation complete!"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Restart your shell or run:"
echo "   source $SHELL_CONFIG"
echo ""
echo "2. Configure Claude Code hooks:"
echo "   Add \"$HOOK_FILE\" to your Claude Code hooks configuration"
echo ""
echo "3. Start using Claude Code - your sessions will be tracked automatically!"
echo ""
echo "📊 View leaderboard: https://longcc.the-ppc-geek.org"
echo ""

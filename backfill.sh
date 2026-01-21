#!/bin/bash
# Claude Code Autonomy Tracker - Historical Backfill Script
# Analyzes your local session history and submits top 5 longest runs

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
USERNAME="${CLAUDE_USERNAME:-${CLAUDE_TRACKER_USERNAME}}"
API_URL="${CLAUDE_TRACKER_API_URL:-https://longcc.the-ppc-geek.org/api/sessions}"

echo -e "${BLUE}🔍 Claude Code Autonomy Tracker - Historical Backfill${NC}\n"

# Check username
if [ -z "$USERNAME" ]; then
    echo -e "${RED}❌ Error: Username not set${NC}"
    echo ""
    echo "Please set your username:"
    echo "  export CLAUDE_USERNAME=yourname"
    echo ""
    echo "Or run this script with:"
    echo "  CLAUDE_USERNAME=yourname bash backfill.sh"
    exit 1
fi

echo -e "👤 Username: ${GREEN}$USERNAME${NC}"
echo ""

# Create Python script
TEMP_SCRIPT=$(mktemp)
cat > "$TEMP_SCRIPT" << 'PYTHON_SCRIPT'
#!/usr/bin/env python3
import json
import os
import glob
import sys
from datetime import datetime
import urllib.request
import urllib.error

USERNAME = os.environ.get('CLAUDE_USERNAME', os.environ.get('CLAUDE_TRACKER_USERNAME', ''))
API_URL = os.environ.get('CLAUDE_TRACKER_API_URL', 'https://longcc.the-ppc-geek.org/api/sessions')
MIN_DURATION = 10

def parse_timestamp(ts):
    if not ts:
        return None
    try:
        if ts.endswith('Z'):
            return datetime.fromisoformat(ts.replace('Z', '+00:00'))
        return datetime.fromisoformat(ts)
    except:
        return None

def extract_autonomous_periods(session_file):
    periods = []
    try:
        with open(session_file, 'r') as f:
            events = []
            for line in f:
                line = line.strip()
                if not line:
                    continue
                try:
                    events.append(json.loads(line))
                except:
                    continue

        if not events:
            return periods

        last_user_time = None
        action_count = 0
        period_start = None

        for event in events:
            timestamp = parse_timestamp(event.get('timestamp'))
            if not timestamp:
                continue

            event_type = event.get('type', '')
            is_user_msg = (event_type == 'user' or
                          (event_type == 'assistant' and event.get('message', {}).get('role') == 'user') or
                          ('message' in event and event.get('message', {}).get('role') == 'user'))

            if is_user_msg:
                if last_user_time and period_start and action_count > 0:
                    duration = (timestamp - period_start).total_seconds()
                    if duration >= MIN_DURATION:
                        periods.append({
                            'start': period_start,
                            'end': timestamp,
                            'duration': int(duration),
                            'action_count': action_count
                        })
                last_user_time = timestamp
                period_start = None
                action_count = 0
            elif event_type == 'assistant':
                msg = event.get('message', {})
                content = msg.get('content', [])
                if isinstance(content, list):
                    for item in content:
                        if isinstance(item, dict) and item.get('type') == 'tool_use':
                            if period_start is None and last_user_time:
                                period_start = timestamp
                            action_count += 1
        return periods
    except:
        return periods

def upload_session(period):
    payload = {
        "username": USERNAME,
        "autonomous_duration": period['duration'],
        "action_count": period['action_count'],
        "session_start": period['start'].isoformat(),
        "session_end": period['end'].isoformat(),
        "task_description": "Historical import"
    }

    try:
        data = json.dumps(payload).encode('utf-8')
        req = urllib.request.Request(API_URL, data=data, headers={'Content-Type': 'application/json'})
        with urllib.request.urlopen(req, timeout=5) as response:
            return response.status == 201
    except:
        return False

def main():
    session_files = glob.glob(os.path.expanduser("~/.claude/projects/*/*.jsonl"))
    print(f"📁 Found {len(session_files)} session files")
    print("")

    all_periods = []
    for session_file in session_files:
        periods = extract_autonomous_periods(session_file)
        all_periods.extend(periods)

    if not all_periods:
        print("❌ No autonomous periods found")
        return 1

    # Sort by duration and take top 5
    all_periods.sort(key=lambda x: x['duration'], reverse=True)
    top_5 = all_periods[:5]

    print(f"✅ Found {len(all_periods)} total autonomous periods")
    print("")
    print("🏆 Your Top 5 Longest Runs:")
    print("=" * 60)
    for i, period in enumerate(top_5, 1):
        duration_min = period['duration'] / 60
        date_str = period['start'].strftime('%Y-%m-%d')
        print(f"{i}. {duration_min:6.1f} min | {period['action_count']:3} actions | {date_str}")
    print("=" * 60)
    print("")

    # Upload top 5
    print("⬆️  Uploading top 5 sessions...")
    success_count = 0
    for period in top_5:
        if upload_session(period):
            success_count += 1

    print(f"✅ Uploaded {success_count}/5 sessions")
    print("")
    print("🌐 View at: https://longcc.the-ppc-geek.org")
    return 0

if __name__ == "__main__":
    sys.exit(main())
PYTHON_SCRIPT

# Run the Python script
python3 "$TEMP_SCRIPT"
EXIT_CODE=$?

# Cleanup
rm -f "$TEMP_SCRIPT"

exit $EXIT_CODE

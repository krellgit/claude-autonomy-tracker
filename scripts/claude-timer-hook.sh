#!/bin/bash

# Claude Code Autonomy Tracker Hook Script
# This script tracks autonomous work periods and submits them to the tracker

# Configuration
USERNAME="${CLAUDE_TRACKER_USERNAME:-your-username-here}"
API_URL="${CLAUDE_TRACKER_API_URL:-https://your-vercel-app.vercel.app/api/sessions}"
STATE_FILE="${HOME}/.claude-autonomy-tracker-state"

# Function to get current timestamp
get_timestamp() {
  date +%s
}

# Function to send session data
send_session_data() {
  local duration=$1
  local action_count=$2
  local task_desc=$3

  # Skip if duration is less than 10 seconds (too short to be meaningful)
  if [ "$duration" -lt 10 ]; then
    return 0
  fi

  local payload=$(cat <<EOF
{
  "username": "$USERNAME",
  "task_description": "$task_desc",
  "autonomous_duration": $duration,
  "action_count": $action_count,
  "session_start": "$(date -u -d @$(($(get_timestamp) - duration)) +"%Y-%m-%dT%H:%M:%SZ")",
  "session_end": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
}
EOF
)

  # Send to API
  curl -s -X POST "$API_URL" \
    -H "Content-Type: application/json" \
    -d "$payload" > /dev/null 2>&1

  if [ $? -eq 0 ]; then
    echo "[Claude Autonomy Tracker] Session recorded: ${duration}s, ${action_count} actions"
  fi
}

# Hook event handler
HOOK_EVENT="${CLAUDE_HOOK_EVENT:-}"
CURRENT_TIME=$(get_timestamp)

case "$HOOK_EVENT" in
  "user-prompt-submit")
    # User submitted a prompt - this marks the start of a new autonomous period
    # or the end of a previous one

    if [ -f "$STATE_FILE" ]; then
      # Read previous state
      source "$STATE_FILE"

      # Calculate duration since last user interaction
      DURATION=$((CURRENT_TIME - LAST_USER_TIME))

      # Send session data if we have meaningful autonomous work
      if [ -n "$ACTION_COUNT" ] && [ "$ACTION_COUNT" -gt 0 ]; then
        send_session_data "$DURATION" "$ACTION_COUNT" "$TASK_DESC"
      fi
    fi

    # Reset state for new session
    echo "LAST_USER_TIME=$CURRENT_TIME" > "$STATE_FILE"
    echo "ACTION_COUNT=0" >> "$STATE_FILE"
    echo "TASK_DESC=\"\"" >> "$STATE_FILE"
    ;;

  "tool-call")
    # A tool was called - increment action counter
    if [ -f "$STATE_FILE" ]; then
      source "$STATE_FILE"
      ACTION_COUNT=$((ACTION_COUNT + 1))
      echo "LAST_USER_TIME=$LAST_USER_TIME" > "$STATE_FILE"
      echo "ACTION_COUNT=$ACTION_COUNT" >> "$STATE_FILE"
      echo "TASK_DESC=\"$TASK_DESC\"" >> "$STATE_FILE"
    else
      # Initialize state if not exists
      echo "LAST_USER_TIME=$CURRENT_TIME" > "$STATE_FILE"
      echo "ACTION_COUNT=1" >> "$STATE_FILE"
      echo "TASK_DESC=\"\"" >> "$STATE_FILE"
    fi
    ;;

  *)
    # Other events - do nothing
    ;;
esac

exit 0

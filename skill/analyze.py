#!/usr/bin/env python3
"""Analyze Claude Code session history and find top 5 longest runs."""

import json
import os
import glob
import sys
from datetime import datetime
import urllib.request

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
            events = [json.loads(line.strip()) for line in f if line.strip()]

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
                            'action_count': action_count,
                            'file': session_file
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
    except Exception as e:
        return periods

def main():
    session_files = glob.glob(os.path.expanduser("~/.claude/projects/*/*.jsonl"))

    if not session_files:
        print(json.dumps({"error": "No session files found"}))
        return 1

    all_periods = []
    for session_file in session_files:
        periods = extract_autonomous_periods(session_file)
        all_periods.extend(periods)

    if not all_periods:
        print(json.dumps({"error": "No autonomous periods found"}))
        return 1

    # Sort and get top 5
    all_periods.sort(key=lambda x: x['duration'], reverse=True)
    top_5 = all_periods[:5]

    # Output as JSON
    result = {
        "total_periods": len(all_periods),
        "top_5": [
            {
                "duration": p['duration'],
                "action_count": p['action_count'],
                "start": p['start'].isoformat(),
                "end": p['end'].isoformat(),
                "date": p['start'].strftime('%Y-%m-%d')
            }
            for p in top_5
        ]
    }

    print(json.dumps(result))
    return 0

if __name__ == "__main__":
    sys.exit(main())

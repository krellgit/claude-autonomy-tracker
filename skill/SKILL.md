---
name: longcc
description: Submit your top 5 longest autonomous runs to the Claude Code leaderboard
---

When the user runs /longcc:

1. Check if CLAUDE_TRACKER_USERNAME environment variable is set
   - If not set, ask the user to run: `export CLAUDE_TRACKER_USERNAME=theirusername`
   - Then stop and wait for them to set it

2. Run the analysis script:
   ```bash
   python3 ~/.claude/skills/longcc/analyze.py
   ```

3. Parse the JSON output from the script which contains:
   - total_periods: total number of autonomous periods found
   - top_5: array of the 5 longest runs with duration, action_count, start, end, date

4. Display the results in a formatted table showing:
   - Rank (1-5)
   - Duration in minutes (convert seconds to minutes)
   - Action count
   - Date

5. For each of the top 5 runs, submit to the API:
   ```bash
   curl -X POST https://longcc.the-ppc-geek.org/api/sessions \
     -H "Content-Type: application/json" \
     -d '{"username": "$CLAUDE_TRACKER_USERNAME", "autonomous_duration": <duration>, "action_count": <count>, "session_start": "<start>", "session_end": "<end>", "task_description": "Historical import"}'
   ```

6. After all uploads complete, show:
   - Success message
   - Link to leaderboard: https://longcc.the-ppc-geek.org
   - Encourage them to run /longcc again anytime to update their position

Handle errors gracefully and provide clear feedback.

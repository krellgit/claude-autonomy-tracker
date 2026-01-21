-- Database schema for Claude Code Autonomy Tracker

-- Drop table if exists (for development)
DROP TABLE IF EXISTS sessions;

-- Create sessions table
CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  task_description TEXT,
  autonomous_duration INTEGER NOT NULL,  -- duration in seconds
  action_count INTEGER DEFAULT 0,
  session_start TIMESTAMP,
  session_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for better query performance
CREATE INDEX idx_username ON sessions(username);
CREATE INDEX idx_duration ON sessions(autonomous_duration DESC);
CREATE INDEX idx_created_at ON sessions(created_at DESC);

-- Add comments for documentation
COMMENT ON TABLE sessions IS 'Stores Claude Code autonomous session data';
COMMENT ON COLUMN sessions.autonomous_duration IS 'Duration of autonomous work period in seconds';
COMMENT ON COLUMN sessions.action_count IS 'Number of autonomous actions performed';
COMMENT ON COLUMN sessions.metadata IS 'Additional session metadata in JSON format';

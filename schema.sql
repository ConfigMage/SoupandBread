-- Run this in your Neon database console to set up the schema

CREATE TABLE IF NOT EXISTS mission_status (
  id INTEGER PRIMARY KEY DEFAULT 1,
  destroyed BOOLEAN DEFAULT false,
  destroyed_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT single_row CHECK (id = 1)
);

-- Initialize with default values
INSERT INTO mission_status (id, destroyed, destroyed_at)
VALUES (1, false, NULL)
ON CONFLICT (id) DO NOTHING;

-- Create guestbook table
CREATE TABLE guestbook (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create visitor counter table
CREATE TABLE visitor_stats (
  id INTEGER PRIMARY KEY DEFAULT 1,
  count INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Insert initial visitor count
INSERT INTO visitor_stats (id, count) VALUES (1, 0)
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE guestbook ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_stats ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Enable read access for all users" ON guestbook
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON guestbook
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read access for visitor stats" ON visitor_stats
  FOR SELECT USING (true);

CREATE POLICY "Enable update access for visitor stats" ON visitor_stats
  FOR UPDATE USING (true);

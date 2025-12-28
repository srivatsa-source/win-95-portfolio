-- SECURE SUPABASE SETUP
-- Run this in your Supabase SQL Editor to secure your API against Postman attacks and spam.

-- 1. SECURE VISITOR COUNTER
-- NOTE: Your table might be named 'visitor_stats' or 'visitor_count' depending on when you set it up.
-- This script handles both cases.

-- Create a function to increment the counter safely (for visitor_stats table)
CREATE OR REPLACE FUNCTION increment_visitor_count()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Try visitor_stats first (original setup)
  UPDATE visitor_stats
  SET count = count + 1
  WHERE id = 1;
EXCEPTION
  WHEN undefined_table THEN
    -- If visitor_stats doesn't exist, try visitor_count
    UPDATE visitor_count
    SET count = count + 1
    WHERE id = 1;
END;
$$;

-- Grant execute permission on the function to everyone
GRANT EXECUTE ON FUNCTION increment_visitor_count TO anon, authenticated, public;

-- Revoke direct UPDATE permission on the tables from public (try both names)
-- This ensures they MUST use the function above and cannot edit the table directly.
DO $$
BEGIN
  EXECUTE 'REVOKE UPDATE ON visitor_stats FROM anon, authenticated, public';
  EXECUTE 'GRANT SELECT ON visitor_stats TO anon, authenticated, public';
EXCEPTION WHEN undefined_table THEN
  NULL; -- Table doesn't exist, that's fine
END $$;

DO $$
BEGIN
  EXECUTE 'REVOKE UPDATE ON visitor_count FROM anon, authenticated, public';
  EXECUTE 'GRANT SELECT ON visitor_count TO anon, authenticated, public';
EXCEPTION WHEN undefined_table THEN
  NULL; -- Table doesn't exist, that's fine
END $$;


-- 2. SECURE GUESTBOOK
-- Add constraints to prevent empty or too long messages at the database level.
-- This stops people from bypassing the frontend validation via Postman.

-- Add length constraints (if they don't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'guestbook_name_length') THEN
        ALTER TABLE guestbook
        ADD CONSTRAINT guestbook_name_length CHECK (char_length(name) > 0 AND char_length(name) <= 100);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'guestbook_message_length') THEN
        ALTER TABLE guestbook
        ADD CONSTRAINT guestbook_message_length CHECK (char_length(message) > 0 AND char_length(message) <= 500);
    END IF;
END $$;

-- Ensure Row Level Security is enabled
ALTER TABLE guestbook ENABLE ROW LEVEL SECURITY;

-- Re-create policies to be strict (drop old ones first to avoid errors)
DROP POLICY IF EXISTS "Enable read access for all users" ON guestbook;
DROP POLICY IF EXISTS "Enable insert for all users" ON guestbook;
DROP POLICY IF EXISTS "Enable update for all users" ON guestbook;
DROP POLICY IF EXISTS "Enable delete for all users" ON guestbook;

-- Allow everyone to READ
CREATE POLICY "Enable read access for all users" ON guestbook
  FOR SELECT USING (true);

-- Allow everyone to INSERT (but not update or delete)
CREATE POLICY "Enable insert for all users" ON guestbook
  FOR INSERT WITH CHECK (true);

-- DO NOT create policies for UPDATE or DELETE.
-- This prevents anyone (even the creator) from modifying entries via the API.
-- You can still manage entries from the Supabase Dashboard.


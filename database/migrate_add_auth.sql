-- =============================================
-- Auth Migration — run this if you already have
-- the DB set up WITHOUT authentication
-- =============================================

-- Add password_hash column (if it doesn't exist yet)
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255) NOT NULL DEFAULT '';

-- Remove the default so new rows must supply a real hash
ALTER TABLE users ALTER COLUMN password_hash DROP DEFAULT;

-- Remove old name/email column defaults that assumed a single demo user
ALTER TABLE users ALTER COLUMN name DROP DEFAULT;
ALTER TABLE users ALTER COLUMN email DROP DEFAULT;

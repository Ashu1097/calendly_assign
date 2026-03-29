-- =============================================
-- Calendly Clone - PostgreSQL Database Schema
-- =============================================

-- Users (with authentication)
CREATE TABLE IF NOT EXISTS users (
  id              SERIAL PRIMARY KEY,
  name            VARCHAR(100) NOT NULL,
  email           VARCHAR(255) NOT NULL UNIQUE,
  password_hash   VARCHAR(255) NOT NULL,
  timezone        VARCHAR(100) NOT NULL DEFAULT 'America/New_York',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Event types (e.g. "30 min meeting", "1 hr consultation")
CREATE TABLE IF NOT EXISTS event_types (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name        VARCHAR(150) NOT NULL,
  slug        VARCHAR(150) NOT NULL UNIQUE,
  duration    INTEGER NOT NULL CHECK (duration > 0),   -- minutes
  description TEXT,
  color       VARCHAR(7) NOT NULL DEFAULT '#0069FF',
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Weekly availability (recurring per day-of-week)
CREATE TABLE IF NOT EXISTS availability (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sun…6=Sat
  start_time  TIME NOT NULL,                           -- e.g. 09:00
  end_time    TIME NOT NULL,                           -- e.g. 17:00
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE (user_id, day_of_week)
);

-- Date-specific overrides (bonus feature)
CREATE TABLE IF NOT EXISTS availability_overrides (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date        DATE NOT NULL,
  is_blocked  BOOLEAN NOT NULL DEFAULT FALSE,          -- TRUE = day off
  start_time  TIME,
  end_time    TIME,
  UNIQUE (user_id, date)
);

-- Booked meetings
CREATE TABLE IF NOT EXISTS meetings (
  id              SERIAL PRIMARY KEY,
  event_type_id   INTEGER NOT NULL REFERENCES event_types(id) ON DELETE CASCADE,
  invitee_name    VARCHAR(150) NOT NULL,
  invitee_email   VARCHAR(255) NOT NULL,
  start_time      TIMESTAMPTZ NOT NULL,
  end_time        TIMESTAMPTZ NOT NULL,
  status          VARCHAR(20) NOT NULL DEFAULT 'confirmed'
                    CHECK (status IN ('confirmed','cancelled','rescheduled')),
  cancel_reason   TEXT,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_meetings_start      ON meetings(start_time);
CREATE INDEX IF NOT EXISTS idx_meetings_event_type ON meetings(event_type_id);
CREATE INDEX IF NOT EXISTS idx_event_types_slug    ON event_types(slug);
CREATE INDEX IF NOT EXISTS idx_availability_user   ON availability(user_id);

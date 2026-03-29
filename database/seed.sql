-- =============================================
-- Calendly Clone - Seed Data
-- NOTE: password_hash below is bcrypt of "password123"
-- =============================================

-- Default user (password: password123)
INSERT INTO users (name, email, password_hash, timezone)
VALUES (
  'Alex Johnson',
  'alex@example.com',
  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'America/New_York'
)
ON CONFLICT (email) DO NOTHING;

-- Event types
INSERT INTO event_types (user_id, name, slug, duration, description, color)
VALUES
  (1, '30 Minute Meeting', '30-min-meeting', 30, 'A quick 30-minute chat to discuss your needs.', '#0069FF'),
  (1, '60 Minute Meeting', '60-min-meeting', 60, 'An in-depth one-hour consultation session.', '#7C3AED'),
  (1, 'Quick Chat',        'quick-chat',     15, 'A fast 15-minute intro or catch-up call.',    '#10B981')
ON CONFLICT (slug) DO NOTHING;

-- Weekly availability (Mon–Fri, 9am–5pm)
INSERT INTO availability (user_id, day_of_week, start_time, end_time)
VALUES
  (1, 1, '09:00', '17:00'),  -- Monday
  (1, 2, '09:00', '17:00'),  -- Tuesday
  (1, 3, '09:00', '17:00'),  -- Wednesday
  (1, 4, '09:00', '17:00'),  -- Thursday
  (1, 5, '09:00', '17:00')   -- Friday
ON CONFLICT (user_id, day_of_week) DO NOTHING;

-- Sample upcoming meetings (relative to NOW)
INSERT INTO meetings (event_type_id, invitee_name, invitee_email, start_time, end_time, status)
VALUES
  (1, 'Sarah Connor', 'sarah@example.com',
     NOW() + INTERVAL '2 days' + TIME '10:00',
     NOW() + INTERVAL '2 days' + TIME '10:30', 'confirmed'),
  (2, 'John Doe', 'john@example.com',
     NOW() + INTERVAL '3 days' + TIME '14:00',
     NOW() + INTERVAL '3 days' + TIME '15:00', 'confirmed'),
  (3, 'Emily Ray', 'emily@example.com',
     NOW() - INTERVAL '1 day' + TIME '11:00',
     NOW() - INTERVAL '1 day' + TIME '11:15', 'confirmed'),
  (1, 'Bob Smith', 'bob@example.com',
     NOW() - INTERVAL '5 days' + TIME '09:00',
     NOW() - INTERVAL '5 days' + TIME '09:30', 'cancelled');

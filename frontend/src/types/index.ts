// ─── Domain Types ─────────────────────────────────────────────────────────────

export interface User {
  id: number;
  name: string;
  email: string;
  timezone: string;
  created_at: string;
}

export interface EventType {
  id: number;
  user_id: number;
  name: string;
  slug: string;
  duration: number;           // minutes
  description: string | null;
  color: string;              // hex
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // joined fields from public booking
  owner_name?: string;
  owner_timezone?: string;
}

export interface AvailabilitySlot {
  id?: number;
  user_id?: number;
  day_of_week: number;        // 0=Sun … 6=Sat
  start_time: string;         // HH:mm
  end_time: string;           // HH:mm
  is_active?: boolean;
}

export interface Meeting {
  id: number;
  event_type_id: number;
  invitee_name: string;
  invitee_email: string;
  start_time: string;         // ISO
  end_time: string;           // ISO
  status: 'confirmed' | 'cancelled' | 'rescheduled';
  cancel_reason: string | null;
  notes: string | null;
  created_at: string;
  // joined fields
  event_type_name?: string;
  duration?: number;
  color?: string;
  slug?: string;
}

// ─── Form Payloads ────────────────────────────────────────────────────────────

export interface EventTypeFormData {
  name: string;
  slug: string;
  duration: number;
  description: string;
  color: string;
}

export interface BookingFormData {
  invitee_name: string;
  invitee_email: string;
  notes: string;
}

// ─── UI Helpers ───────────────────────────────────────────────────────────────

export type ActiveTab = 'upcoming' | 'past';

export const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const SHORT_DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

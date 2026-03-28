import { format, parseISO, isToday, isTomorrow } from 'date-fns';

/** Format ISO string → "Mon, Jun 24 · 10:00 AM" */
export const formatMeetingTime = (iso: string): string =>
  format(parseISO(iso), "EEE, MMM d · h:mm a");

/** Format ISO → "10:00 AM" */
export const formatTime = (iso: string): string =>
  format(parseISO(iso), 'h:mm a');

/** Format ISO → "Mon, Jun 24" */
export const formatDate = (iso: string): string =>
  format(parseISO(iso), 'EEE, MMM d');

/** Friendly relative date: "Today", "Tomorrow", or "Jun 24" */
export const friendlyDate = (iso: string): string => {
  const d = parseISO(iso);
  if (isToday(d))    return 'Today';
  if (isTomorrow(d)) return 'Tomorrow';
  return format(d, 'MMM d, yyyy');
};

/** Duration label: 60 → "1 hr", 30 → "30 min", 90 → "1 hr 30 min" */
export const formatDuration = (minutes: number): string => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} hr`;
  return `${h} hr ${m} min`;
};

/** "my event" → "my-event" */
export const slugify = (str: string): string =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');

/** Ensure hex color is valid, else return fallback */
export const safeColor = (color: string, fallback = '#0069FF'): string =>
  /^#[0-9A-F]{6}$/i.test(color) ? color : fallback;

/** Build initials from a full name */
export const initials = (name: string): string =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');

/** Generate a consistent light background color from a hex for badges */
export const hexToLight = (hex: string): string => {
  try {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},0.12)`;
  } catch {
    return 'rgba(0,105,255,0.12)';
  }
};

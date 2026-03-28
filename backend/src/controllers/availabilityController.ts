import { Request, Response } from 'express';
import pool from '../db/pool';

const DEFAULT_USER_ID = 1;

/** GET /api/availability */
export const getAvailability = async (_req: Request, res: Response) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM availability WHERE user_id = $1 ORDER BY day_of_week ASC`,
      [DEFAULT_USER_ID]
    );
    res.json(rows);
  } catch {
    res.status(500).json({ error: 'Failed to fetch availability' });
  }
};

/** PUT /api/availability  — replace all days for user */
export const upsertAvailability = async (req: Request, res: Response) => {
  const slots: Array<{ day_of_week: number; start_time: string; end_time: string; is_active: boolean }> = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(`DELETE FROM availability WHERE user_id = $1`, [DEFAULT_USER_ID]);
    for (const slot of slots) {
      await client.query(
        `INSERT INTO availability (user_id, day_of_week, start_time, end_time, is_active)
         VALUES ($1,$2,$3,$4,$5)`,
        [DEFAULT_USER_ID, slot.day_of_week, slot.start_time, slot.end_time, slot.is_active]
      );
    }
    await client.query('COMMIT');
    const { rows } = await client.query(
      `SELECT * FROM availability WHERE user_id=$1 ORDER BY day_of_week`, [DEFAULT_USER_ID]
    );
    res.json(rows);
  } catch {
    await client.query('ROLLBACK');
    res.status(500).json({ error: 'Failed to update availability' });
  } finally {
    client.release();
  }
};

/**
 * GET /api/availability/slots?eventTypeId=&date=YYYY-MM-DD
 * Returns available booking slots for a given date (public, no auth)
 */
export const getAvailableSlots = async (req: Request, res: Response) => {
  const { eventTypeId, date } = req.query as { eventTypeId: string; date: string };

  if (!eventTypeId || !date) {
    return res.status(400).json({ error: 'eventTypeId and date are required' });
  }

  try {
    // 1. Get event type duration
    const etResult = await pool.query(
      `SELECT duration, user_id FROM event_types WHERE id=$1 AND is_active=TRUE`,
      [eventTypeId]
    );
    if (!etResult.rows.length) return res.status(404).json({ error: 'Event type not found' });
    const { duration, user_id } = etResult.rows[0];

    // 2. Day of week for requested date (0=Sun … 6=Sat)
    const requestedDate = new Date(date + 'T00:00:00');
    const dayOfWeek = requestedDate.getDay();

    // 3. Get availability for that day
    const avResult = await pool.query(
      `SELECT start_time, end_time FROM availability
        WHERE user_id=$1 AND day_of_week=$2 AND is_active=TRUE`,
      [user_id, dayOfWeek]
    );
    if (!avResult.rows.length) return res.json({ slots: [] });

    const { start_time, end_time } = avResult.rows[0];

    // 4. Already booked slots for that day
    const bookedResult = await pool.query(
      `SELECT start_time, end_time FROM meetings
        WHERE event_type_id = $1
          AND status = 'confirmed'
          AND DATE(start_time AT TIME ZONE 'UTC') = $2`,
      [eventTypeId, date]
    );
    const booked: Array<{ start: Date; end: Date }> = bookedResult.rows.map((r) => ({
      start: new Date(r.start_time),
      end:   new Date(r.end_time),
    }));

    // 5. Generate 30-min grid slots that fit within availability
    const slots: string[] = [];
    const [sh, sm] = (start_time as string).split(':').map(Number);
    const [eh, em] = (end_time as string).split(':').map(Number);

    const slotStart = new Date(`${date}T${pad(sh)}:${pad(sm)}:00`);
    const dayEnd    = new Date(`${date}T${pad(eh)}:${pad(em)}:00`);

    while (slotStart.getTime() + duration * 60_000 <= dayEnd.getTime()) {
      const slotEnd = new Date(slotStart.getTime() + duration * 60_000);
      const isBooked = booked.some(
        (b) => slotStart < b.end && slotEnd > b.start
      );
      if (!isBooked) {
        slots.push(slotStart.toISOString());
      }
      slotStart.setMinutes(slotStart.getMinutes() + 30);
    }

    res.json({ slots });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to compute slots' });
  }
};

const pad = (n: number) => String(n).padStart(2, '0');

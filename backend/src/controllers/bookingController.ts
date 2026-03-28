import { Request, Response } from 'express';
import pool from '../db/pool';

/** POST /api/book  — public endpoint */
export const createBooking = async (req: Request, res: Response) => {
  const { event_type_id, invitee_name, invitee_email, start_time, notes } = req.body;

  if (!event_type_id || !invitee_name || !invitee_email || !start_time) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Lock & fetch event type
    const etResult = await client.query(
      `SELECT * FROM event_types WHERE id=$1 AND is_active=TRUE FOR SHARE`,
      [event_type_id]
    );
    if (!etResult.rows.length) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Event type not found' });
    }
    const { duration } = etResult.rows[0];

    const start = new Date(start_time);
    const end   = new Date(start.getTime() + duration * 60_000);

    // Check for double booking (row-level locking)
    const conflict = await client.query(
      `SELECT id FROM meetings
        WHERE event_type_id = $1
          AND status = 'confirmed'
          AND tstzrange(start_time, end_time) && tstzrange($2::timestamptz, $3::timestamptz)
        FOR UPDATE`,
      [event_type_id, start.toISOString(), end.toISOString()]
    );

    if (conflict.rows.length) {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: 'Time slot already booked' });
    }

    // Insert meeting
    const { rows } = await client.query(
      `INSERT INTO meetings (event_type_id, invitee_name, invitee_email, start_time, end_time, notes)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [event_type_id, invitee_name, invitee_email, start.toISOString(), end.toISOString(), notes ?? null]
    );

    await client.query('COMMIT');

    // Return meeting with event type details
    const meeting = rows[0];
    meeting.event_type = etResult.rows[0];
    res.status(201).json(meeting);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Booking failed' });
  } finally {
    client.release();
  }
};

import { Request, Response } from 'express';
import pool from '../db/pool';

const uid = (req: Request): number => (req as any).userId as number;

/** GET /api/meetings?type=upcoming|past */
export const getMeetings = async (req: Request, res: Response) => {
  const type = req.query.type === 'past' ? 'past' : 'upcoming';
  try {
    const { rows } = await pool.query(
      `SELECT m.*, et.name AS event_type_name, et.duration, et.color
         FROM meetings m
         JOIN event_types et ON et.id = m.event_type_id
        WHERE et.user_id = $1
          AND m.status != 'cancelled'
          AND m.start_time ${type === 'upcoming' ? '>=' : '<'} NOW()
        ORDER BY m.start_time ${type === 'upcoming' ? 'ASC' : 'DESC'}`,
      [uid(req)]
    );
    res.json(rows);
  } catch {
    res.status(500).json({ error: 'Failed to fetch meetings' });
  }
};

/** GET /api/meetings/:id */
export const getMeetingById = async (req: Request, res: Response) => {
  try {
    const { rows } = await pool.query(
      `SELECT m.*, et.name AS event_type_name, et.duration, et.color, et.slug
         FROM meetings m
         JOIN event_types et ON et.id = m.event_type_id
        WHERE m.id = $1`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Meeting not found' });
    res.json(rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to fetch meeting' });
  }
};

/** PATCH /api/meetings/:id/cancel */
export const cancelMeeting = async (req: Request, res: Response) => {
  const { cancel_reason } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE meetings
          SET status='cancelled', cancel_reason=$1
        WHERE id=$2 AND status='confirmed'
        RETURNING *`,
      [cancel_reason ?? null, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Meeting not found or already cancelled' });
    res.json(rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to cancel meeting' });
  }
};

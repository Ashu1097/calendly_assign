import { Request, Response } from 'express';
import pool from '../db/pool';

const DEFAULT_USER_ID = 1;

/** GET /api/event-types */
export const getEventTypes = async (_req: Request, res: Response) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM event_types WHERE user_id = $1 AND is_active = TRUE ORDER BY created_at ASC`,
      [DEFAULT_USER_ID]
    );
    res.json(rows);
  } catch (err: any) {
    console.error("🔥 CREATE ERROR:", err);
    res.status(500).json({ error: 'Failed to fetch event types' });
  }
};

/** GET /api/event-types/:id */
export const getEventTypeById = async (req: Request, res: Response) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM event_types WHERE id = $1 AND user_id = $2`,
      [req.params.id, DEFAULT_USER_ID]
    );
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch event type' });
  }
};

/** GET /api/event-types/slug/:slug  (public, no auth) */
export const getEventTypeBySlug = async (req: Request, res: Response) => {
  try {
    const { rows } = await pool.query(
      `SELECT et.*, u.name AS owner_name, u.timezone AS owner_timezone
         FROM event_types et
         JOIN users u ON u.id = et.user_id
        WHERE et.slug = $1 AND et.is_active = TRUE`,
      [req.params.slug]
    );
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch event type' });
  }
};

/** POST /api/event-types */
export const createEventType = async (req: Request, res: Response) => {
  console.log("BODY:", req.body);
  const { name, slug, duration, description, color } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO event_types (user_id, name, slug, duration, description, color)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [DEFAULT_USER_ID, name, slug, duration, description ?? null, color ?? '#0069FF']
    );
    res.status(201).json(rows[0]);
  } catch (err: any) {
    console.error("🔥 CREATE ERROR:", err); 
    if (err.code === '23505') return res.status(409).json({ error: 'Slug already in use' });
    res.status(500).json({ error: 'Failed to create event type' });
  }
};

/** PUT /api/event-types/:id */
export const updateEventType = async (req: Request, res: Response) => {
  const { name, slug, duration, description, color } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE event_types
          SET name=$1, slug=$2, duration=$3, description=$4, color=$5, updated_at=NOW()
        WHERE id=$6 AND user_id=$7 RETURNING *`,
      [name, slug, duration, description ?? null, color ?? '#0069FF', req.params.id, DEFAULT_USER_ID]
    );
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err: any) {
    if (err.code === '23505') return res.status(409).json({ error: 'Slug already in use' });
    res.status(500).json({ error: 'Failed to update event type' });
  }
};

/** DELETE /api/event-types/:id */
export const deleteEventType = async (req: Request, res: Response) => {
  try {
    const { rowCount } = await pool.query(
      `UPDATE event_types SET is_active=FALSE WHERE id=$1 AND user_id=$2`,
      [req.params.id, DEFAULT_USER_ID]
    );
    if (!rowCount) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete event type' });
  }
};

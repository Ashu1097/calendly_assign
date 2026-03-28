import { Request, Response } from 'express';
import pool from '../db/pool';

const DEFAULT_USER_ID = 1;

/** GET /api/users/me */
export const getMe = async (_req: Request, res: Response) => {
  try {
    const { rows } = await pool.query(`SELECT * FROM users WHERE id=$1`, [DEFAULT_USER_ID]);
    if (!rows.length) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

/** PUT /api/users/me */
export const updateMe = async (req: Request, res: Response) => {
  const { name, timezone } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE users SET name=$1, timezone=$2 WHERE id=$3 RETURNING *`,
      [name, timezone, DEFAULT_USER_ID]
    );
    res.json(rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to update user' });
  }
};

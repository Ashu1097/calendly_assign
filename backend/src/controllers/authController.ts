import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db/pool';

const JWT_SECRET     = process.env.JWT_SECRET ?? 'changeme';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '7d';

/** Sign a JWT for a given user id */
const signToken = (userId: number): string =>
  jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);

/** POST /api/auth/register */
export const register = async (req: Request, res: Response) => {
  const { name, email, password, timezone } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'name, email and password are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  try {
    // Check duplicate email
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length) {
      return res.status(409).json({ error: 'An account with that email already exists' });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const { rows } = await pool.query(
      `INSERT INTO users (name, email, password_hash, timezone)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, timezone, created_at`,
      [name.trim(), email.toLowerCase().trim(), password_hash, timezone ?? 'America/New_York']
    );

    const user  = rows[0];
    const token = signToken(user.id);

    res.status(201).json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
};

/** POST /api/auth/login */
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }

  try {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email.toLowerCase().trim()]
    );

    if (!rows.length) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user     = rows[0];
    const match    = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = signToken(user.id);
    

    // Don't expose the hash
    const { password_hash: _ph, ...safeUser } = user;
    res.json({ token, user: safeUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
};

/** GET /api/auth/me  — requires auth middleware */
export const getMe = async (req: Request, res: Response) => {
  const userId = (req as any).userId as number;
  try {
    const { rows } = await pool.query(
      'SELECT id, name, email, timezone, created_at FROM users WHERE id = $1',
      [userId]
    );
    if (!rows.length) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

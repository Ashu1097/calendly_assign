import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRouter         from './routes/auth';
import eventTypesRouter   from './routes/eventTypes';
import availabilityRouter from './routes/availability';
import bookingRouter      from './routes/booking';
import meetingsRouter     from './routes/meetings';
import usersRouter        from './routes/users';
import { requireAuth }    from './middleware/requireAuth';
import { getEventTypeBySlug } from './controllers/eventTypesController';
import { getAvailableSlots }  from './controllers/availabilityController';

dotenv.config();

const app  = express();
const PORT = process.env.PORT ?? 4000;

// ─── Core Middleware ──────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.FRONTEND_URL ?? 'http://localhost:5173' }));
app.use(express.json());

// ─── Public Routes ────────────────────────────────────────────────────────────
app.use('/api/auth', authRouter);
app.use('/api/book', bookingRouter);

// Public — no auth needed for booking page lookups
app.get('/api/event-types/slug/:slug', getEventTypeBySlug);
app.get('/api/availability/slots',     getAvailableSlots);

// ─── Protected Routes (Bearer JWT required) ───────────────────────────────────
app.use('/api/event-types',  requireAuth, eventTypesRouter);
app.use('/api/availability', requireAuth, availabilityRouter);
app.use('/api/meetings',     requireAuth, meetingsRouter);
app.use('/api/users',        requireAuth, usersRouter);

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;

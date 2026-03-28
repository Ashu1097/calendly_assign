import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import eventTypesRouter    from './routes/eventTypes';
import availabilityRouter  from './routes/availability';
import bookingRouter       from './routes/booking';
import meetingsRouter      from './routes/meetings';
import usersRouter         from './routes/users';

dotenv.config();

const app  = express();
const PORT = process.env.PORT ?? 4000;

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.FRONTEND_URL ?? 'http://localhost:5173' }));
app.use(express.json());

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/event-types',   eventTypesRouter);
app.use('/api/availability',  availabilityRouter);
app.use('/api/book',          bookingRouter);
app.use('/api/meetings',      meetingsRouter);
app.use('/api/users',         usersRouter);

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;

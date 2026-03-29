import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute   from './components/layout/ProtectedRoute';
import AppLayout        from './components/layout/AppLayout';

import LoginPage        from './pages/LoginPage';
import RegisterPage     from './pages/RegisterPage';
import EventTypesPage   from './pages/EventTypesPage';
import AvailabilityPage from './pages/AvailabilityPage';
import MeetingsPage     from './pages/MeetingsPage';
import BookingPage      from './pages/BookingPage';
import ConfirmationPage from './pages/ConfirmationPage';
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          {/* ── Public auth pages ──────────────────────────────────────────── */}
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* ── Public booking pages (no sidebar) ─────────────────────────── */}
          <Route path="/:slug"            element={<BookingPage />} />
          <Route path="/confirmation/:id" element={<ConfirmationPage />} />

          {/* ── Protected dashboard (JWT required) ────────────────────────── */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route index element={<Navigate to="/event-types" replace />} />
              <Route path="/event-types"  element={<EventTypesPage />} />
              <Route path="/availability" element={<AvailabilityPage />} />
              <Route path="/meetings"     element={<MeetingsPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

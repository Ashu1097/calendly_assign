import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout        from './components/layout/AppLayout';
import EventTypesPage   from './pages/EventTypesPage';
import AvailabilityPage from './pages/AvailabilityPage';
import MeetingsPage     from './pages/MeetingsPage';
import BookingPage      from './pages/BookingPage';
import ConfirmationPage from './pages/ConfirmationPage';
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <BrowserRouter>
    <Toaster position="top-right" />
      <Routes>
        
        {/* Admin / dashboard shell */}
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/event-types" replace />} />
          <Route path="/event-types"   element={<EventTypesPage />} />
          <Route path="/availability"  element={<AvailabilityPage />} />
          <Route path="/meetings"      element={<MeetingsPage />} />
        </Route>

        {/* Public booking pages — no sidebar */}
        <Route path="/:slug"               element={<BookingPage />} />
        <Route path="/confirmation/:id"    element={<ConfirmationPage />} />
      </Routes>
    </BrowserRouter>
  );
}

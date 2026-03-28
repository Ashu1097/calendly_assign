import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { EventType, BookingFormData } from '../../types';
import { formatDuration } from '../../utils';

interface BookingFormProps {
  eventType:   EventType;
  selectedSlot: string;
  onSubmit:    (data: BookingFormData) => Promise<void>;
  onBack:      () => void;
}

export default function BookingForm({ eventType, selectedSlot, onSubmit, onBack }: BookingFormProps) {
  const [form, setForm]   = useState<BookingFormData>({ invitee_name: '', invitee_email: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.invitee_name.trim()) return setError('Name is required');
    if (!form.invitee_email.trim()) return setError('Email is required');
    try {
      setLoading(true);
      await onSubmit(form);
    } catch (err: any) {
      setError(err?.response?.data?.error ?? 'Booking failed. Please try another time slot.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Selected time summary */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-blue-900">
              {format(parseISO(selectedSlot), 'EEEE, MMMM d, yyyy')}
            </p>
            <p className="text-sm text-blue-700 mt-0.5">
              {format(parseISO(selectedSlot), 'h:mm a')} · {formatDuration(eventType.duration)}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Your Name *</label>
          <input
            className="input"
            placeholder="Jane Doe"
            value={form.invitee_name}
            onChange={(e) => setForm((f) => ({ ...f, invitee_name: e.target.value }))}
            required
          />
        </div>

        <div>
          <label className="label">Email Address *</label>
          <input
            type="email"
            className="input"
            placeholder="jane@example.com"
            value={form.invitee_email}
            onChange={(e) => setForm((f) => ({ ...f, invitee_email: e.target.value }))}
            required
          />
        </div>

        <div>
          <label className="label">Additional Notes</label>
          <textarea
            className="input resize-none"
            rows={3}
            placeholder="Anything you'd like to share in advance…"
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onBack} className="btn-secondary flex-1">
            ← Back
          </button>
          <button type="submit" disabled={loading} className="btn-primary flex-1">
            {loading ? 'Booking…' : 'Confirm Booking'}
          </button>
        </div>
      </form>
    </div>
  );
}

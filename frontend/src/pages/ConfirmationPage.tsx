import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { Meeting } from '../types';
import { meetingsApi } from '../api';
import { formatDuration } from '../utils';
import { FullPageSpinner } from '../components/layout/Spinner';

export default function ConfirmationPage() {
  const { id }    = useParams<{ id: string }>();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [error, setError]     = useState('');

  useEffect(() => {
    if (!id) return;
    meetingsApi
      .getById(Number(id))
      .then((res) => setMeeting(res.data))
      .catch(() => setError('Could not load booking details.'));
  }, [id]);

  if (!meeting && !error) return <FullPageSpinner />;

  if (error || !meeting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* Top green success banner */}
        <div className="bg-green-500 px-8 py-8 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Confirmed!</h1>
          <p className="text-green-100 text-sm mt-1">Your meeting has been scheduled.</p>
        </div>

        {/* Details */}
        <div className="px-8 py-6 space-y-5">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Event</p>
            <p className="text-base font-semibold text-gray-900">{meeting.event_type_name}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Date</p>
              <p className="text-sm text-gray-800">
                {format(parseISO(meeting.start_time), 'EEE, MMM d, yyyy')}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Time</p>
              <p className="text-sm text-gray-800">
                {format(parseISO(meeting.start_time), 'h:mm a')}
                {' – '}
                {format(parseISO(meeting.end_time), 'h:mm a')}
              </p>
            </div>
          </div>

          {meeting.duration && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Duration</p>
              <p className="text-sm text-gray-800">{formatDuration(meeting.duration)}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Name</p>
              <p className="text-sm text-gray-800">{meeting.invitee_name}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Email</p>
              <p className="text-sm text-gray-800 truncate">{meeting.invitee_email}</p>
            </div>
          </div>

          {meeting.notes && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Notes</p>
              <p className="text-sm text-gray-600 italic">"{meeting.notes}"</p>
            </div>
          )}

          <div className="pt-2">
            <p className="text-xs text-gray-400 text-center mb-3">
              A calendar invite has been sent to {meeting.invitee_email}
            </p>
            {meeting.slug && (
              <Link
                to={`/${meeting.slug}`}
                className="btn-secondary w-full justify-center"
              >
                Book Another Time
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

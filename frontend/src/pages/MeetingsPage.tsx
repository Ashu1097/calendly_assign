import { useState, useEffect, useCallback } from 'react';
import { Meeting, ActiveTab } from '../types';
import { meetingsApi } from '../api';
import PageHeader          from '../components/layout/PageHeader';
import MeetingCard         from '../components/meetings/MeetingCard';
import CancelMeetingModal  from '../components/meetings/CancelMeetingModal';
import Toast               from '../components/layout/Toast';
import { FullPageSpinner } from '../components/layout/Spinner';

export default function MeetingsPage() {
  const [tab, setTab]         = useState<ActiveTab>('upcoming');
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading]   = useState(true);
  const [cancelling, setCancelling] = useState<Meeting | null>(null);
  const [toast, setToast]       = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const fetchMeetings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await meetingsApi.getAll(tab);
      setMeetings(res.data);
    } catch {
      setToast({ msg: 'Failed to load meetings', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => { fetchMeetings(); }, [fetchMeetings]);

  const handleCancel = async (reason: string) => {
    if (!cancelling) return;
    try {
      await meetingsApi.cancel(cancelling.id, reason);
      setToast({ msg: 'Meeting cancelled', type: 'success' });
      setCancelling(null);
      fetchMeetings();
    } catch {
      setToast({ msg: 'Failed to cancel meeting', type: 'error' });
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <PageHeader
        title="Meetings"
        subtitle="View and manage your scheduled meetings."
      />

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit mb-8">
        {(['upcoming', 'past'] as ActiveTab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 text-sm font-medium rounded-lg transition-colors capitalize ${
              tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <FullPageSpinner />
      ) : meetings.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            No {tab} meetings
          </h3>
          <p className="text-sm text-gray-500">
            {tab === 'upcoming'
              ? 'Your upcoming meetings will appear here.'
              : 'Your past meetings will appear here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {meetings.map((m) => (
            <MeetingCard
              key={m.id}
              meeting={m}
              isPast={tab === 'past'}
              onCancel={setCancelling}
            />
          ))}
        </div>
      )}

      <CancelMeetingModal
        meeting={cancelling}
        onConfirm={handleCancel}
        onClose={() => setCancelling(null)}
      />

      {toast && (
        <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}

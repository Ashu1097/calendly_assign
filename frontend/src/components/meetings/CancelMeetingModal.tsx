import { useState } from 'react';
import Modal from '../layout/Modal';
import { Meeting } from '../../types';
import { formatMeetingTime } from '../../utils';

interface CancelMeetingModalProps {
  meeting:  Meeting | null;
  onConfirm: (reason: string) => Promise<void>;
  onClose:  () => void;
}

export default function CancelMeetingModal({ meeting, onConfirm, onClose }: CancelMeetingModalProps) {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm(reason);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={!!meeting} onClose={onClose} title="Cancel Meeting" maxWidth="sm">
      {meeting && (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm font-medium text-gray-900">{meeting.invitee_name}</p>
            <p className="text-sm text-gray-500">{meeting.event_type_name}</p>
            <p className="text-sm text-gray-500 mt-1">{formatMeetingTime(meeting.start_time)}</p>
          </div>

          <div>
            <label className="label">Reason for cancellation (optional)</label>
            <textarea
              className="input resize-none"
              rows={3}
              placeholder="Let the invitee know why you're cancelling…"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <button onClick={onClose} className="btn-secondary flex-1">
              Keep Meeting
            </button>
            <button onClick={handleConfirm} disabled={loading} className="btn-danger flex-1">
              {loading ? 'Cancelling…' : 'Cancel Meeting'}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}

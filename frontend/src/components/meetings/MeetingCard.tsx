import { Meeting } from '../../types';
import { formatMeetingTime, formatDuration, hexToLight, initials } from '../../utils';

interface MeetingCardProps {
  meeting:  Meeting;
  onCancel: (meeting: Meeting) => void;
  isPast:   boolean;
}

export default function MeetingCard({ meeting, onCancel, isPast }: MeetingCardProps) {
  const color = meeting.color ?? '#0069FF';

  return (
    <div className="card p-5 flex gap-4 hover:shadow-md transition-shadow">
      {/* Color indicator */}
      <div
        className="w-1 rounded-full flex-shrink-0 self-stretch"
        style={{ backgroundColor: color }}
      />

      {/* Avatar */}
      <div
        className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold"
        style={{ backgroundColor: hexToLight(color), color }}
      >
        {initials(meeting.invitee_name)}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-gray-900">{meeting.invitee_name}</p>
            <p className="text-sm text-gray-500">{meeting.invitee_email}</p>
          </div>
          {!isPast && meeting.status === 'confirmed' && (
            <button
              onClick={() => onCancel(meeting)}
              className="flex-shrink-0 text-xs text-red-600 border border-red-200 rounded-lg px-2.5 py-1 hover:bg-red-50 transition-colors"
            >
              Cancel
            </button>
          )}
          {meeting.status === 'cancelled' && (
            <span className="flex-shrink-0 text-xs text-gray-400 bg-gray-100 border border-gray-200 rounded-lg px-2.5 py-1">
              Cancelled
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
          {/* Event type badge */}
          <span
            className="inline-flex items-center gap-1.5 text-xs font-medium rounded-full px-2 py-0.5"
            style={{ color, backgroundColor: hexToLight(color) }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: color }}
            />
            {meeting.event_type_name}
          </span>

          {/* Time */}
          <span className="flex items-center gap-1 text-sm text-gray-600">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatMeetingTime(meeting.start_time)}
          </span>

          {/* Duration */}
          {meeting.duration && (
            <span className="flex items-center gap-1 text-sm text-gray-600">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formatDuration(meeting.duration)}
            </span>
          )}
        </div>

        {meeting.notes && (
          <p className="mt-2 text-sm text-gray-500 line-clamp-1 italic">"{meeting.notes}"</p>
        )}
      </div>
    </div>
  );
}

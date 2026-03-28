import { EventType } from '../../types';
import { formatDuration, hexToLight } from '../../utils';

interface EventTypeCardProps {
  eventType: EventType;
  onEdit:   (et: EventType) => void;
  onDelete: (et: EventType) => void;
}

export default function EventTypeCard({ eventType, onEdit, onDelete }: EventTypeCardProps) {
  const bookingUrl = `${window.location.origin}/${eventType.slug}`;

  const copyLink = () => {
    navigator.clipboard.writeText(bookingUrl).catch(() => {});
  };

  return (
    <div className="card p-5 hover:shadow-md transition-shadow group">
      {/* Color bar */}
      <div
        className="h-1 rounded-full mb-4"
        style={{ backgroundColor: eventType.color }}
      />

      {/* Title & duration */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{eventType.name}</h3>
          <span
            className="inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full"
            style={{ color: eventType.color, backgroundColor: hexToLight(eventType.color) }}
          >
            {formatDuration(eventType.duration)}
          </span>
        </div>
      </div>

      {/* Description */}
      {eventType.description && (
        <p className="text-sm text-gray-500 line-clamp-2 mb-4">{eventType.description}</p>
      )}

      {/* Booking link */}
      <div className="flex items-center gap-2 mb-4">
        <input
          readOnly
          value={`/${eventType.slug}`}
          className="flex-1 text-xs text-blue-600 bg-blue-50 border border-blue-100 rounded-lg px-2 py-1.5 cursor-default truncate"
        />
        <button
          onClick={copyLink}
          title="Copy link"
          className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-3 border-t border-gray-100">
        <button
          onClick={() => onEdit(eventType)}
          className="btn-secondary flex-1 text-xs py-1.5"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(eventType)}
          className="px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
